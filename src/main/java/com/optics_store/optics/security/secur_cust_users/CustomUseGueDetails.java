package com.optics_store.optics.security.secur_cust_users;

import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.optics_store.optics.entity.users.Client;
import com.optics_store.optics.entity.users.User;
import com.optics_store.optics.entity.users.UserGuestRole;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
/**
 * Component of the platform's security and authentication module.
 * Enforces access control and data integrity rules across the e-commerce
 * application.
 */
public class CustomUseGueDetails implements UserDetails {

    private Long id;
    private Client client;
    private String password;
    private Long userId;
    private Long guestId;
    private Set<GrantedAuthority> authorities;

    public static CustomUseGueDetails build(User user) {
        Set<GrantedAuthority> auths = user.getUserGuestRoles().stream()
                .map(UserGuestRole::getRole)
                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName().name()))
                .collect(Collectors.toSet());

        Long guestId = user.getUserGuestRoles().stream()
                .map(UserGuestRole::getGuest)
                .filter(Objects::nonNull)
                .map(g -> g.getId())
                .findFirst()
                .orElse(null);

        return new CustomUseGueDetails(
                user.getId(),
                user.getClient(),
                user.getPassword(),
                user.getId(),
                guestId,
                auths);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return client.getEmail();
    }

    @Override
    public String getPassword() {
        return password;
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
