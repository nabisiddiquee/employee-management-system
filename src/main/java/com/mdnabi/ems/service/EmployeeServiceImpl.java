package com.mdnabi.ems.service;

import com.mdnabi.ems.dto.request.EmployeeRequest;
import com.mdnabi.ems.dto.response.ApiResponse;
import com.mdnabi.ems.dto.response.EmployeeResponse;
import com.mdnabi.ems.entity.Employee;
import com.mdnabi.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public ApiResponse<EmployeeResponse> createEmployee(EmployeeRequest request) {

        Employee employee = new Employee();

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setMobile(request.getMobile());
        employee.setDepartment(request.getDepartment());
        employee.setSalary(request.getSalary());
        employee.setStatus(request.getStatus());
        employee.setJoiningDate(request.getJoiningDate());

        Employee savedEmployee = employeeRepository.save(employee);

        return new ApiResponse<>(
                true,
                "Employee created successfully",
                mapToResponse(savedEmployee)
        );
    }

    @Override
    public ApiResponse<List<EmployeeResponse>> getAllEmployees() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public ApiResponse<EmployeeResponse> getEmployeeById(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public ApiResponse<EmployeeResponse> updateEmployee(Long id, EmployeeRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public ApiResponse<String> deleteEmployee(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    private EmployeeResponse mapToResponse(Employee employee) {

        EmployeeResponse response = new EmployeeResponse();

        response.setId(employee.getId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setMobile(employee.getMobile());
        response.setDepartment(employee.getDepartment());
        response.setSalary(employee.getSalary());
        response.setStatus(employee.getStatus());
        response.setJoiningDate(employee.getJoiningDate());

        return response;
    }
}