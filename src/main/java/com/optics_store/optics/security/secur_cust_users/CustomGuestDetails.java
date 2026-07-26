package com.optics_store.optics.security.secur_cust_users;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.optics_store.optics.entity.guests.Guest;
import com.optics_store.optics.entity.users.UserGuestRole;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
/**
 * Component of the platform's security and authentication module.
 * Enforces access control and data integrity rules across the e-commerce
 * application.
 */
public class CustomGuestDetails implements UserDetails {

    private final Long guestId;
    private final Set<GrantedAuthority> authorities;

    public static CustomGuestDetails build(Guest guest) {
        Set<GrantedAuthority> auths = guest.getUserGuestRoles().stream()
                .map(UserGuestRole::getRole)
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName().name()))
                .collect(Collectors.toSet());

        return new CustomGuestDetails(
                guest.getId(),
                auths);
    }

    @Override
    public Set<GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return "";
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
