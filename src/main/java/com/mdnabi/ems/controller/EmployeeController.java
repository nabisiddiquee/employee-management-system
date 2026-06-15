package com.mdnabi.ems.controller;

import com.mdnabi.ems.dto.request.EmployeeRequest;
import com.mdnabi.ems.dto.response.ApiResponse;
import com.mdnabi.ems.dto.response.EmployeeResponse;
import com.mdnabi.ems.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ApiResponse<EmployeeResponse> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {
        return employeeService.createEmployee(request);
    }

    @GetMapping
    public ApiResponse<List<EmployeeResponse>> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public ApiResponse<EmployeeResponse> getEmployeeById(
            @PathVariable Long id) {

        return employeeService.getEmployeeById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        return employeeService.updateEmployee(id, request);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteEmployee(
            @PathVariable Long id) {

        return employeeService.deleteEmployee(id);
    }
}