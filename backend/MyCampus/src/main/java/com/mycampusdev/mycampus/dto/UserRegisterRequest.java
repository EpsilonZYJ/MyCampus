package com.mycampusdev.mycampus.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * 用户注册请求的数据传输对象
 */
public class UserRegisterRequest {
    
    @NotBlank(message = "Username cannot be empty")
    private String userName;

    @NotBlank(message = "password cannot be empty")
    private String password;

    @Email(message = "invalid Email address")
    private String email;

    @NotBlank(message = "PhoneNumber cannot be empty")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "invalid phonenumber")
    private String phoneNumber;

    @NotBlank(message = "StudentID cannot be empty")
    private String studentId;
    
    // Getters and Setters
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public String getStudentId() {
        return studentId;
    }
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}