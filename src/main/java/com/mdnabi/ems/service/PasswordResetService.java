package com.mdnabi.ems.service;



import com.mdnabi.ems.dto.request.ForgotPasswordRequest;
import com.mdnabi.ems.dto.request.ResetPasswordRequest;
import com.mdnabi.ems.entity.User;
import com.mdnabi.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.reset-password-url}")
    private String resetPasswordUrl;

    public String forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found with email: " + request.getEmail())
                );

        String resetToken = UUID.randomUUID().toString();

        user.setResetPasswordToken(resetToken);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        String resetLink = resetPasswordUrl + "?token=" + resetToken;

        emailService.sendResetPasswordEmail(user.getEmail(), resetLink);

        return "Password reset link has been sent to your registered email.";
    }

    public String resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() ->
                        new RuntimeException("Invalid reset token")
                );

        if (user.getResetPasswordTokenExpiry() == null ||
                user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {

            user.setResetPasswordToken(null);
            user.setResetPasswordTokenExpiry(null);
            userRepository.save(user);

            throw new RuntimeException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setProvider("LOCAL");
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);

        userRepository.save(user);

        return "Password has been reset successfully.";
    }
}
