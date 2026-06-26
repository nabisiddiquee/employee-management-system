package com.mdnabi.ems.controller;

import com.mdnabi.ems.dto.request.ForgotPasswordRequest;
import com.mdnabi.ems.dto.request.ResetPasswordRequest;
import com.mdnabi.ems.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        String message = passwordResetService.forgotPassword(request);

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        String message = passwordResetService.resetPassword(request);

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }
}
