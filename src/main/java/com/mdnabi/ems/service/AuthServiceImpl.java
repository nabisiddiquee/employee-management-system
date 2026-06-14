package com.mdnabi.ems.service;

import com.mdnabi.ems.dto.request.LoginRequest;
import com.mdnabi.ems.dto.request.RegisterRequest;
import com.mdnabi.ems.dto.response.ApiResponse;
import com.mdnabi.ems.dto.response.LoginResponse;
import com.mdnabi.ems.entity.Role;
import com.mdnabi.ems.entity.User;

import com.mdnabi.ems.exception.badRequestException.*;
import com.mdnabi.ems.repository.RoleRepository;
import com.mdnabi.ems.repository.UserRepository;
import com.mdnabi.ems.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public ApiResponse<String> register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Role role = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(new Role(null, "USER", null, null)));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider("LOCAL");
        user.setRole(role);

        userRepository.save(user);

        return new ApiResponse<>(
                true,
                "User registered successfully",
                user.getEmail()
        );
    }

    @Override
    public ApiResponse<LoginResponse> login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse(
                token,
                "Bearer",
                user.getEmail(),
                user.getRole().getName()
        );

        return new ApiResponse<>(
                true,
                "Login successful",
                response
        );
    }


}
