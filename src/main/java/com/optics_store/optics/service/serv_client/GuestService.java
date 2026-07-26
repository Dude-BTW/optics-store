package com.optics_store.optics.service.serv_client;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.optics_store.optics.entity.guests.Guest;
import com.optics_store.optics.entity.guests.GuestQuest;
import com.optics_store.optics.entity.guests.GuestRating;
import com.optics_store.optics.entity.guests.GuestRatingGlob;
import com.optics_store.optics.entity.guests.GuestReport;
import com.optics_store.optics.entity.users.ERole;
import com.optics_store.optics.entity.users.Role;
import com.optics_store.optics.entity.users.UserGuestRole;
import com.optics_store.optics.repository.rep_guests.GuestQuestRepos;
import com.optics_store.optics.repository.rep_guests.GuestRatingGlobRepos;
import com.optics_store.optics.repository.rep_guests.GuestRatingRepos;
import com.optics_store.optics.repository.rep_guests.GuestReportRepos;
import com.optics_store.optics.repository.rep_guests.GuestRepos;
import com.optics_store.optics.repository.rep_users.RoleRepos;
import com.optics_store.optics.repository.rep_users.UserGuestRoleRepos;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * User Identity and Profile Management.
 * Handles the mapping between fully authenticated clients (with encrypted
 * personal data) and anonymous guests interacting with the catalog.
 */
public class GuestService {

    private final GuestQuestRepos guestQuestRepos;
    private final GuestRatingRepos guestRatingRepos;
    private final GuestRatingGlobRepos guestRatingGlobRepos;
    private final GuestReportRepos guestReportRepos;
    private final GuestRepos guestRepos;
    private final RoleRepos roleRepos;
    private final UserGuestRoleRepos ugrRepos;

    public Guest getGuestById(Long guestId) {
        return guestRepos.findById(guestId).orElse(null);
    }

    @Transactional
    public Long createGuestAndReturnId() {
        Guest guest = new Guest();
        Guest savedGuest = guestRepos.save(guest);

        Role guestRole = roleRepos.findByName(ERole.GUEST)
                .orElseThrow(() -> new IllegalStateException("Роль GUEST не знайдена"));
        ugrRepos.save(new UserGuestRole(null, savedGuest, guestRole));

        return savedGuest.getId();
    }

    // Create Guest

    public GuestQuest createQuest(String name, String phone, String email, Long clientId) {
        Guest guest = getGuestById(clientId);
        GuestQuest saved = guestQuestRepos.save(
                GuestQuest.builder()
                        .guest(guest)
                        .guestName(name)
                        .phone(phone)
                        .email(email)
                        .build());
        return saved;
    }

    public GuestRating createRating(String name, Long clientId) {
        Guest guest = getGuestById(clientId);
        GuestRating saved = guestRatingRepos.save(
                GuestRating.builder()
                        .guest(guest)
                        .guestName(name)
                        .build());
        return saved;
    }

    public GuestRatingGlob createRatingGlob(String name, Long clientId) {
        Guest guest = getGuestById(clientId);
        GuestRatingGlob saved = guestRatingGlobRepos.save(
                GuestRatingGlob.builder()
                        .guest(guest)
                        .guestName(name)
                        .build());
        return saved;
    }

    public GuestReport createReport(String name, String phone, String email, Long clientId) {
        Guest guest = getGuestById(clientId);
        GuestReport saved = guestReportRepos.save(
                GuestReport.builder()
                        .guest(guest)
                        .guestName(name)
                        .phone(phone)
                        .email(email)
                        .build());
        return saved;
    }
}
