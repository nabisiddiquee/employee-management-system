package com.mdnabi.ems.controller;

import com.mdnabi.ems.dto.request.RegisterRequest;
import com.mdnabi.ems.dto.response.ApiResponse;
import com.mdnabi.ems.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}
