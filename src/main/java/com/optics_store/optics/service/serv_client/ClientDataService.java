package com.optics_store.optics.service.serv_client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.optics_store.optics.entity.guests.GuestQuest;
import com.optics_store.optics.entity.guests.GuestRating;
import com.optics_store.optics.entity.guests.GuestRatingGlob;
import com.optics_store.optics.entity.guests.GuestReport;
import com.optics_store.optics.entity.users.User;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * User Identity and Profile Management.
 * Handles the mapping between fully authenticated clients (with encrypted
 * personal data) and anonymous guests interacting with the catalog.
 */
public class ClientDataService {

    private final GuestService guestService;
    private final UserService userService;

    private Map<Class<?>, Function<GuestCreationContext, ?>> guestFactory;

    @PostConstruct
    private void initGuestFactory() {
        guestFactory = Map.of(
                GuestQuest.class, ctx -> guestService.createQuest(ctx.name(), ctx.phone(), ctx.email(), ctx.clientId()),
                GuestRating.class, ctx -> guestService.createRating(ctx.name(), ctx.clientId()),
                GuestRatingGlob.class, ctx -> guestService.createRatingGlob(ctx.name(), ctx.clientId()),
                GuestReport.class,
                ctx -> guestService.createReport(ctx.name(), ctx.phone(), ctx.email(), ctx.clientId()));
    }

    public record GuestContext<T>(T guest, Long clientId, boolean accountUsed) {
    }

    private record GuestCreationContext(String name, String phone, String email, Long clientId) {
    }

    public <T> GuestContext<T> prepareGuest(
            Class<T> clazz,
            String guestName,
            String phone,
            String email,
            Long guestId,
            Long userId,
            boolean accountAllowed) {
        boolean hasContact = (phone != null && email != null);
        boolean useAccount = accountAllowed
                && isNameMatch(guestName, userId)
                && (!hasContact || isContactMatch(phone, email, userId));

        Long clientId = useAccount ? userId : guestId;
        T guest = useAccount
                ? null
                : createGuest(clazz, new GuestCreationContext(
                        guestName,
                        hasContact && phone != null ? phone.trim() : null,
                        hasContact && email != null ? email.trim().toLowerCase() : null,
                        clientId));

        return new GuestContext<>(guest, clientId, useAccount);
    }

    @SuppressWarnings("unchecked")
    private <T> T createGuest(Class<T> clazz, GuestCreationContext ctx) {
        Function<GuestCreationContext, ?> creator = guestFactory.get(clazz);
        if (creator == null) {
            throw new IllegalArgumentException("Unsupported guest type: " + clazz);
        }
        return (T) creator.apply(ctx);
    }

    public <T extends ClientAuthorizable> Long ensureClientAuthorized(
            T entity,
            Long userId,
            Long guestId) {
        boolean useAccount = Boolean.TRUE.equals(entity.getAccountUsed());
        Long expected = useAccount ? userId : guestId;

        if (!Objects.equals(entity.getClientId(), expected)) {
            String who = useAccount ? "userId" : "guestId";
            throw new IllegalArgumentException(
                    "Insufficient permissions: " + who + " mismatch");
        }
        return expected;
    }

    public <T> List<Map<String, Object>> buildClientDataList(
            List<T> items,
            Predicate<T> isAvailable,
            Function<T, Long> clientIdFn,
            Function<T, ?> guestExtractor,
            Function<T, Long> idExtractor) {
        return items.stream()
                .map(item -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", idExtractor.apply(item));

                    if (!isAvailable.test(item)) {
                        Optional.ofNullable(guestExtractor.apply(item))
                                .ifPresent(guest -> {
                                    map.put("type", guest.getClass().getSimpleName());
                                    map.put("data", guest);
                                });
                    } else {
                        Long clientId = clientIdFn.apply(item);
                        Optional.ofNullable(userService.getUserById(clientId))
                                .map(User::getClient)
                                .ifPresent(client -> {
                                    map.put("type", "Client");
                                    map.put("data", client);
                                });
                    }
                    return map.isEmpty() ? null : map;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private boolean isNameMatch(String fullName, Long userId) {
        if (userId == null) {
            return false;
        }
        return Optional.ofNullable(fullName)
                .map(String::trim)
                .map(name -> name.split("\\s+", 2))
                .filter(parts -> parts.length == 2)
                .map(parts -> {
                    User user = userService.getUserById(userId);
                    return Optional.ofNullable(user)
                            .map(User::getClient)
                            .filter(c -> parts[0].equalsIgnoreCase(c.getFirstName())
                                    && parts[1].equalsIgnoreCase(c.getLastName()))
                            .isPresent();
                })
                .orElse(false);
    }

    private boolean isContactMatch(String phone, String email, Long userId) {
        return Optional.ofNullable(phone)
                .filter(_ -> email != null && userId != null)
                .map(String::trim)
                .flatMap(normPhone -> Optional.ofNullable(userService.getUserById(userId))
                        .map(User::getClient)
                        .filter(c -> normPhone.equals(c.getPhone().trim())
                                && email.trim().equalsIgnoreCase(c.getEmail().trim())))
                .isPresent();
    }
}
