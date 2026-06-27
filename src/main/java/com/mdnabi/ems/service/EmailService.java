package com.mdnabi.ems.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendResetPasswordEmail(String toEmail, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("🔐 Reset Your EMS Account Password");

        message.setText(
                "Dear EMS User,\n\n" +
                        "🔐 We received a request to reset the password for your Employee Management System account.\n\n" +
                        "Please use the secure reset link below to create a new password:\n\n" +
                        "👉 " + resetLink + "\n\n" +
                        "⏰ This password reset link is valid for 15 minutes only.\n\n" +
                        "⚠️ For your security, please do not share this link with anyone.\n\n" +
                        "If you did not request a password reset, you can safely ignore this email. Your account password will remain unchanged.\n\n" +
                        "Thank you,\n" +
                        "Employee Management System Team\n\n" +
                        "📌 Note: This is an automated email. Please do not reply to this message."
        );

        javaMailSender.send(message);
    }
}