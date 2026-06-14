package com.mdnabi.ems.service;

import com.mdnabi.ems.dto.request.EmployeeRequest;
import com.mdnabi.ems.dto.response.ApiResponse;
import com.mdnabi.ems.dto.response.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    ApiResponse<EmployeeResponse> createEmployee(EmployeeRequest request);

    ApiResponse<List<EmployeeResponse>> getAllEmployees();

    ApiResponse<EmployeeResponse> getEmployeeById(Long id);

    ApiResponse<EmployeeResponse> updateEmployee(Long id, EmployeeRequest request);

    ApiResponse<String> deleteEmployee(Long id);
}
