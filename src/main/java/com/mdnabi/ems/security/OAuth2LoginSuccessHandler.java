package com.mdnabi.ems.security;


import com.mdnabi.ems.entity.Role;
import com.mdnabi.ems.entity.User;
import com.mdnabi.ems.repository.RoleRepository;
import com.mdnabi.ems.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.oauth2.success-redirect-url}")
    private String successRedirectUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        if (email == null || email.isBlank()) {
            response.sendRedirect("http://localhost:4200/login?error=google_email_missing");
            return;
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, name));

        if (user.getRole() == null) {
            Role userRole = getOrCreateUserRole();
            user.setRole(userRole);
            userRepository.save(user);
        }

        String roleName = user.getRole().getName();

        String token = jwtUtil.generateToken(user.getEmail(), roleName);

        String redirectUrl = UriComponentsBuilder
                .fromUriString(successRedirectUrl)
                .queryParam("token", token)
                .queryParam("email", user.getEmail())
                .queryParam("role", roleName)
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private User createGoogleUser(String email, String name) {
        Role userRole = getOrCreateUserRole();

        User user = new User();
        user.setName(name != null && !name.isBlank() ? name : email);
        user.setEmail(email);
        user.setPassword(null);
        user.setProvider("GOOGLE");
        user.setRole(userRole);

        return userRepository.save(user);
    }

    private Role getOrCreateUserRole() {
        return roleRepository.findByName("USER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("USER");
                    return roleRepository.save(role);
                });
    }

}
