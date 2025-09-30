package com.mycampusdev.mycampus.pojo;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Document(collection = "tb_user")
public class User {
    @Id
    private String id;

    @Field("user_name")
    @Indexed(unique = true)
    @NotBlank(message = "Username cannot be blank")
    private String userName;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "PhoneNumber cannot be blank")
    private String phoneNumber;

    @Field("student_id")
    @Indexed(unique = true)
    private String studentId;
    // 头像图片链接
    private String avatarUrl;

    private BigDecimal balance = BigDecimal.ZERO;

    private List<String> roles = new ArrayList<>(Arrays.asList("ROLE_STUDENT"));

    // 跑腿员资料
    private RunnerProfile runnerProfile;

    // 收货地址列表
    private List<Address> addresses = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;

    // 构造函数
    public User() {}

    public User(String userName, String password, String studentId, String phoneNumber) {
        this.userName = userName;
        this.password = password;
        this.studentId = studentId;
        this.phoneNumber = phoneNumber;
        this.roles = Arrays.asList("ROLE_STUDENT");
    }

    // 内部类：跑腿员资料
    public static class RunnerProfile {
        private RunnerStatus status = RunnerStatus.OFFLINE;
        private Double rating = 5.0;
        private Integer totalOrdersCompleted = 0;
        private String idCardNumber;
        private String healthCertificateUrl;
        private Boolean isVerified = false;
        private LocalDateTime runnerSince;
        private BigDecimal totalEarnings = BigDecimal.ZERO;

        // 默认构造函数
        public RunnerProfile() {
            this.runnerSince = LocalDateTime.now();
        }

        // getters and setters
        public RunnerStatus getStatus() { return status; }
        public void setStatus(RunnerStatus status) { this.status = status; }
        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }
        public Integer getTotalOrdersCompleted() { return totalOrdersCompleted; }
        public void setTotalOrdersCompleted(Integer totalOrdersCompleted) { this.totalOrdersCompleted = totalOrdersCompleted; }
        public String getIdCardNumber() { return idCardNumber; }
        public void setIdCardNumber(String idCardNumber) { this.idCardNumber = idCardNumber; }
        public String getHealthCertificateUrl() { return healthCertificateUrl; }
        public void setHealthCertificateUrl(String healthCertificateUrl) { this.healthCertificateUrl = healthCertificateUrl; }
        public Boolean getVerified() { return isVerified; }
        public void setVerified(Boolean verified) { isVerified = verified; }
        public LocalDateTime getRunnerSince() { return runnerSince; }
        public void setRunnerSince(LocalDateTime runnerSince) { this.runnerSince = runnerSince; }
        public BigDecimal getTotalEarnings() { return totalEarnings; }
        public void setTotalEarnings(BigDecimal totalEarnings) { this.totalEarnings = totalEarnings; }
    }

    // 内部类：地址
    public static class Address {
        private String addressId;
        private String name;
        private String building;
        private String room;
        private String notes;
        private Boolean isDefault = false;

        public Address() {
            this.addressId = java.util.UUID.randomUUID().toString();
        }

        // getters and setters
        public String getAddressId() { return addressId; }
        public void setAddressId(String addressId) { this.addressId = addressId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getBuilding() { return building; }
        public void setBuilding(String building) { this.building = building; }
        public String getRoom() { return room; }
        public void setRoom(String room) { this.room = room; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public Boolean getDefault() { return isDefault; }
        public void setDefault(Boolean aDefault) { isDefault = aDefault; }
    }

    public enum RunnerStatus {
        ONLINE, OFFLINE, DELIVERING
    }

    // 业务方法
    public boolean hasRole(String role) {
        return roles.contains(role);
    }

    public void addRole(String role) {
        if (!roles.contains(role)) {
            roles.add(role);
        }
    }

    public void removeRole(String role) {
        roles.remove(role);
    }

    public boolean isRunner() {
        return runnerProfile != null && hasRole("ROLE_RUNNER");
    }

    // 成为跑腿员调用的方法
    public void becomeRunner(String idCardNumber, String healthCertificateUrl) {
        if (this.runnerProfile == null) {
            this.runnerProfile = new RunnerProfile();
        }
        this.runnerProfile.setIdCardNumber(idCardNumber);
        this.runnerProfile.setHealthCertificateUrl(healthCertificateUrl);
        this.runnerProfile.setVerified(false); // 需要管理员审核
        addRole("ROLE_RUNNER");
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public RunnerProfile getRunnerProfile() { return runnerProfile; }
    public void setRunnerProfile(RunnerProfile runnerProfile) { this.runnerProfile = runnerProfile; }
    public List<Address> getAddresses() { return addresses; }
    public void setAddresses(List<Address> addresses) { this.addresses = addresses; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
