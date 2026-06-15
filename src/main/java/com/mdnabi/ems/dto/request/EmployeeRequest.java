package com.mdnabi.ems.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class EmployeeRequest {

    @NotBlank(message = "Employee code is required")
    private String employeeCode;

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Mobile number must be valid 10 digit Indian number"
    )
    private String mobile;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "1.0", message = "Salary must be greater than 0")
    private BigDecimal salary;

    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "ACTIVE|INACTIVE",
            message = "Status must be ACTIVE or INACTIVE"
    )
    private String status;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;
}