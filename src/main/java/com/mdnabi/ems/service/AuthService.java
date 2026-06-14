package com.mdnabi.ems.service;

import com.mdnabi.ems.dto.request.RegisterRequest;
import com.mdnabi.ems.dto.response.ApiResponse;

public interface AuthService {

    ApiResponse<String> register(RegisterRequest request);
}
