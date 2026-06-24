package com.mdnabi.ems.security;

import com.mdnabi.ems.entity.User;
import com.mdnabi.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {


    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email)
                );

        String roleName = "USER";

        if (user.getRole() != null && user.getRole().getName() != null) {
            roleName = user.getRole().getName();
        }

        String password = user.getPassword();

        if (password == null || password.isBlank()) {
            password = "{noop}GOOGLE_OAUTH2_USER";
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(password)
                .authorities(
                        List.of(
                                new SimpleGrantedAuthority(roleName),
                                new SimpleGrantedAuthority("ROLE_" + roleName)
                        )
                )
                .build();
    }


}
