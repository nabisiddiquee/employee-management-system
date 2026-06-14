package com.mdnabi.ems.service;

import com.mdnabi.ems.dto.request.LoginRequest;
import com.mdnabi.ems.dto.request.RegisterRequest;
import com.mdnabi.ems.dto.response.ApiResponse;
import com.mdnabi.ems.dto.response.LoginResponse;

public interface AuthService {

    ApiResponse<String> register(RegisterRequest request);
    ApiResponse<LoginResponse> login(LoginRequest request);
}
