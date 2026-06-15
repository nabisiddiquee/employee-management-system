package com.mdnabi.ems.exception;

import com.mdnabi.ems.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFound(ResourceNotFoundException ex) {

        ApiResponse<Object> response =
                new ApiResponse<>(false, ex.getMessage(), null);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(BadRequestException ex) {

        ApiResponse<Object> response =
                new ApiResponse<>(false, ex.getMessage(), null);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        ApiResponse<Object> response =
                new ApiResponse<>(false, message, null);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGlobalException(Exception ex) {

        ApiResponse<Object> response =
                new ApiResponse<>(false, ex.getMessage(), null);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}