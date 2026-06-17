package com.mdnabi.ems.repository;

import com.mdnabi.ems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
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

    Page<Employee> findByDeletedFalse(Pageable pageable);

    Page<Employee> findByDeletedFalseAndFirstNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String firstName,
            String email,
            String department,
            Pageable pageable
    );

    @Query("""
            SELECT e FROM Employee e
            WHERE e.deleted = false
            AND (
            LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(e.department) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    Page<Employee> searchEmployees(
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
