package com.optics_store.optics.security.secur_cust_users;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.optics_store.optics.entity.users.User;
import com.optics_store.optics.repository.rep_users.UserRepos;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
/**
 * Component of the platform's security and authentication module.
 * Enforces access control and data integrity rules across the e-commerce
 * application.
 */
public class CustomUseDetService implements UserDetailsService {

    private final UserRepos usersRepo;

    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = usersRepo.findByClientEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Користувача з email “" + email + "” не знайдено"));
        return CustomUseGueDetails.build(user);
    }
}
