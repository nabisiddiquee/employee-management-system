package com.mdnabi.ems.service;

import com.mdnabi.ems.dto.request.EmployeeRequest;
import com.mdnabi.ems.dto.response.ApiResponse;
import com.mdnabi.ems.dto.response.EmployeeResponse;
import com.mdnabi.ems.entity.Employee;
import com.mdnabi.ems.exception.BadRequestException;
import com.mdnabi.ems.exception.ResourceNotFoundException;
import com.mdnabi.ems.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public ApiResponse<EmployeeResponse> createEmployee(EmployeeRequest request) {

        validateCreateEmployee(request);

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

        List<EmployeeResponse> employees = employeeRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return new ApiResponse<>(
                true,
                "Employees fetched successfully",
                employees
        );
    }

    @Override
    public ApiResponse<EmployeeResponse> getEmployeeById(Long id) {

        Employee employee = employeeRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id));

        return new ApiResponse<>(
                true,
                "Employee fetched successfully",
                mapToResponse(employee)
        );
    }

    @Override
    public ApiResponse<EmployeeResponse> updateEmployee(
            Long id,
            EmployeeRequest request) {

        Employee employee = employeeRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id));

        validateUpdateEmployee(id, request);

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setMobile(request.getMobile());
        employee.setDepartment(request.getDepartment());
        employee.setSalary(request.getSalary());
        employee.setStatus(request.getStatus());
        employee.setJoiningDate(request.getJoiningDate());

        Employee updatedEmployee = employeeRepository.save(employee);

        return new ApiResponse<>(
                true,
                "Employee updated successfully",
                mapToResponse(updatedEmployee)
        );
    }

    @Override
    public ApiResponse<String> deleteEmployee(Long id) {

        Employee employee = employeeRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id));

        employee.setDeleted(true);
        employeeRepository.save(employee);

        return new ApiResponse<>(
                true,
                "Employee deleted successfully",
                null
        );
    }

    @Override
    public ApiResponse<Object> searchEmployees(
            String keyword,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Employee> employeePage =
                employeeRepository.searchEmployees(keyword, pageable);

        List<EmployeeResponse> employees = employeePage
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("employees", employees);
        response.put("currentPage", employeePage.getNumber());
        response.put("totalItems", employeePage.getTotalElements());
        response.put("totalPages", employeePage.getTotalPages());
        response.put("pageSize", employeePage.getSize());

        return new ApiResponse<>(
                true,
                "Employees fetched successfully",
                response
        );
    }

    private void validateCreateEmployee(EmployeeRequest request) {

        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new BadRequestException("Employee code already exists");
        }

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        if (employeeRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number already exists");
        }
    }

    private void validateUpdateEmployee(Long id, EmployeeRequest request) {

        if (employeeRepository.existsByEmployeeCodeAndIdNot(request.getEmployeeCode(), id)) {
            throw new BadRequestException("Employee code already exists");
        }

        if (employeeRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new BadRequestException("Email already exists");
        }

        if (employeeRepository.existsByMobileAndIdNot(request.getMobile(), id)) {
            throw new BadRequestException("Mobile number already exists");
        }
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