package com.mdnabi.ems.repository;

import com.mdnabi.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDeletedFalse();
    Optional<Employee> findByIdAndDeletedFalse(Long id);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
    boolean existsByEmployeeCode(String employeeCode);
    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByMobileAndIdNot(String mobile, Long id);
    boolean existsByEmployeeCodeAndIdNot(String employeeCode, Long id);
}
