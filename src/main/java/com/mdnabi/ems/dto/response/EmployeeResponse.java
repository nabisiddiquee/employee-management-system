package com.mdnabi.ems.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeResponse {

    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String department;
    private BigDecimal salary;
    private String status;
    private LocalDate joiningDate;
}
