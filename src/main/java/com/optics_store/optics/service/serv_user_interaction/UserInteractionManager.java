package com.optics_store.optics.service.serv_user_interaction;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.optics_store.optics.service.serv_client.ClientAuthorizable;
import com.optics_store.optics.service.serv_client.ClientDataService;
import com.optics_store.optics.util.ClientIpResolver;
import com.optics_store.optics.util.IpGeoService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Core transactional handler for client interactions.
 * Isolates the complexity of geolocation resolution, history tracking, and
 * entity association (Guest vs Authorized User).
 */
public class UserInteractionManager {

    private final ClientDataService clientDataService;
    private final ClientIpResolver clientIpResolver;
    private final IpGeoService ipGeoService;

    public static record AuthContext<T extends ClientAuthorizable, G>(
            T entity,
            G guest,
            Long clientId) {
    }

    public static class GeoData {
        String region;
        String timezone;
        LocalDateTime feedbackDate;

        GeoData(String region, String timezone, LocalDateTime feedbackDate) {
            this.region = region;
            this.timezone = timezone;
            this.feedbackDate = feedbackDate;
        }
    }

    /**
     * Geolocation and authorization resolution.
     * Dynamically determines the user's timezone/region based on IP to ensure
     * accurate review timestamps.
     */
    public GeoData resolveGeoData() {
        IpGeoService.IpRegionResult geoResult = ipGeoService.getRegionFromIp(clientIpResolver.resolveClientIp());
        LocalDateTime feedbackDate = LocalDateTime.now(geoResult.zoneId).truncatedTo(ChronoUnit.SECONDS);
        return new GeoData(geoResult.region, geoResult.zoneId.toString(), feedbackDate);
    }

    @Transactional
    public <T extends ClientAuthorizable, G> Long addInteraction(
            Class<G> guestClass,
            Long guestId,
            Long userId,
            Boolean accountAllowed,
            String guestName,
            String phone,
            String email,

            Function<ClientDataService.GuestContext<G>, T> entityBuilder,
            BiConsumer<T, ClientDataService.GuestContext<G>> headerUpdater,
            Function<ClientDataService.GuestContext<G>, Optional<T>> findExisting,
            Consumer<T> saveHistory,
            BiConsumer<T, ClientDataService.GuestContext<G>> existingUpdater,

            Function<T, T> entitySaver,
            Function<T, Long> idExtractor,
            Runnable cacheInvalidator) {
        ClientDataService.GuestContext<G> ctx = clientDataService.prepareGuest(
                guestClass, guestName, phone, email, guestId, userId, accountAllowed);

        synchronized (this) {
            Optional<T> opt = findExisting.apply(ctx);
            if (opt.isPresent()) {
                T existing = opt.get();
                saveHistory.accept(existing);
                headerUpdater.accept(existing, ctx);
                existingUpdater.accept(existing, ctx);
                T updated = entitySaver.apply(existing);
                cacheInvalidator.run();
                return idExtractor.apply(updated);
            } else {
                T entity = entityBuilder.apply(ctx);
                headerUpdater.accept(entity, ctx);
                T saved = entitySaver.apply(entity);
                cacheInvalidator.run();
                return idExtractor.apply(saved);
            }
        }
    }

    @Transactional
    public <T extends ClientAuthorizable, G> Long updateInteraction(
            Long entityId,
            Long guestId,
            Long userId,
            Boolean accountAllowed,
            Function<Long, T> fetchById,
            Function<T, G> extractGuest,
            Consumer<T> saveHistory,
            Consumer<G> guestUpdater,
            BiConsumer<T, AuthContext<T, G>> headerUpdater,
            BiConsumer<T, AuthContext<T, G>> entityUpdater,
            Function<T, T> entitySaver,
            Runnable cacheInvalidator) {
        try {
            AuthContext<T, G> ctx = authorizeContext(fetchById, entityId, extractGuest, userId, guestId);
            T entity = ctx.entity();
            G guest = ctx.guest();

            if (entity.getClass().getMethod("getId").invoke(entity) != null) {
                saveHistory.accept(entity);
            }

            if (Boolean.FALSE.equals(accountAllowed) && guest != null) {
                guestUpdater.accept(guest);
            }

            headerUpdater.accept(entity, ctx);
            entityUpdater.accept(entity, ctx);

            T updated;
            synchronized (this) {
                updated = entitySaver.apply(entity);
                cacheInvalidator.run();
            }
            return (Long) entity.getClass().getMethod("getId").invoke(updated);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException("Failed to update interaction", e);
        }
    }

    @Transactional
    public <T extends ClientAuthorizable, G> void deleteEntity(
            Long entityId,
            Long guestId,
            Long userId,
            Function<Long, T> fetchById,
            Function<T, G> extractGuest,
            BiConsumer<T, G> deleteUpdater,
            Consumer<G> deleteGuestRepo,
            Runnable cacheInvalidator) {
        AuthContext<T, G> ctx;
        try {
            ctx = authorizeContext(fetchById, entityId, extractGuest, userId, guestId);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException("Failed to authorize context for deletion", e);
        }
        T entity = ctx.entity();
        G guest = ctx.guest();

        deleteUpdater.accept(entity, guest);
        if (Boolean.FALSE.equals(entity.getAccountUsed()) && guest != null) {
            deleteGuestRepo.accept(guest);
        }
        cacheInvalidator.run();
    }

    private <T extends ClientAuthorizable, G> AuthContext<T, G> authorizeContext(
            Function<Long, T> fetchById,
            Long entityId,
            Function<T, G> extractGuest,
            Long userId,
            Long guestId) throws ReflectiveOperationException {
        T entity = fetchById.apply(entityId);
        G guest = extractGuest.apply(entity);
        Long clientId = clientDataService.ensureClientAuthorized(entity, userId, guestId);
        return new AuthContext<>(entity, guest, clientId);
    }

    @Transactional
    public <LD> void handleLikeOrDislikeGeneric(
            Optional<LD> existing,
            Consumer<LD> deleteFn,
            BiConsumer<LD, Boolean> setLiked,
            BiConsumer<LD, Boolean> setDisliked,
            Supplier<LD> creator,
            Consumer<LD> saveFn,
            Runnable invalidateCache,
            Boolean like,
            Boolean dislike) {
        if (existing.isPresent()) {
            LD entry = existing.get();
            if (!Boolean.TRUE.equals(like) && !Boolean.TRUE.equals(dislike)) {
                deleteFn.accept(entry);
            } else {
                setLiked.accept(entry, Boolean.TRUE.equals(like));
                setDisliked.accept(entry, Boolean.TRUE.equals(dislike));
                saveFn.accept(entry);
            }
        } else {
            if (Boolean.TRUE.equals(like) || Boolean.TRUE.equals(dislike)) {
                LD entry = creator.get();
                setLiked.accept(entry, Boolean.TRUE.equals(like));
                setDisliked.accept(entry, Boolean.TRUE.equals(dislike));
                saveFn.accept(entry);
            }
        }
        invalidateCache.run();
    }
}
