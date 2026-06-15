package com.mdnabi.ems.exception;

public class ResourceNotFoundException extends RuntimeException{

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
