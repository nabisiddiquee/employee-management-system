package com.mdnabi.ems.service.authServiceImpl;

import com.mdnabi.ems.dto.request.RegisterRequest;
import com.mdnabi.ems.dto.response.ApiResponse;
import com.mdnabi.ems.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public ApiResponse<String> register(RegisterRequest request) {
        return new ApiResponse<>(
                true,
                "User registered successfully",
                request.getEmail()
        );
    }
}
