package com.mycampusdev.mycampus.pojo;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 用户实体类，映射到MongoDB的 "tb_user" 集合。
 * 包含学生用户和跑腿员共有的基础信息。
 */
@Document(collection = "tb_user")
public class User {

    // --- 角色常量 ---
    public static final String ROLE_STUDENT = "ROLE_STUDENT";
    public static final String ROLE_RUNNER = "ROLE_RUNNER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    @Id
    /**
     * 用户文档的唯一ID，由MongoDB自动生成。
     * 类型为String以兼容ObjectId。
     */
    private String id;

    @Field("user_name")
    @Indexed(unique = true)
    @NotBlank(message = "Username cannot be empty")
    /**
     * 用户昵称，必须唯一。
     */
    private String userName;

    @NotBlank(message = "password cannot be empty")
    /**
     * 用户密码，存储时应进行加密处理。
     */
    private String password;

    @Indexed(unique = true)
    /**
     * 用户邮箱，必须唯一，用于找回密码等操作。
     */
    private String email;

    @NotBlank(message = "PhoneNumber cannot be empty")
    /**
     * 用户手机号码。
     */
    private String phoneNumber;

    @Field("student_id")
    @Indexed(unique = true)
    @NotBlank(message = "StudentID cannot be empty")
    /**
     * 用户学号，必须唯一，是校园内身份的重要标识。
     */
    private String studentId;
    
//    /**
//     * 用户头像图片的URL地址。
//     */
//    private String avatarUrl = "/opt/app/images/user_avatars/default.png";

    /**
     * 用户在平台内的账户余额。
     */
    private BigDecimal balance = BigDecimal.ZERO;

    /**
     * 用户的角色列表，用于权限控制。
     * 例如：["ROLE_STUDENT", "ROLE_RUNNER"]
     */
    private List<String> roles = new ArrayList<>(Arrays.asList(ROLE_STUDENT));

    /**
     * 跑腿员的专属档案，如果用户不是跑腿员，此字段可以为null。
     */
    private RunnerProfile runnerProfile;

    /**
     * 用户的收货地址列表。
     */
    private List<Address> addresses = new ArrayList<>();

    @CreatedDate
    /**
     * 记录创建时间，由Spring Data MongoDB自动填充。
     */
    private LocalDateTime createdAt;

    @LastModifiedDate
    /**
     * 记录最后更新时间，由Spring Data MongoDB自动填充。
     */
    private LocalDateTime updatedAt;

    /**
     * 用户最近一次登录的时间。
     */
    private LocalDateTime lastLoginAt;

    /**
     * 默认构造函数，供框架使用。
     */
    public User() {}

    /**
     * 用于快速创建用户的构造函数。
     * @param userName 用户昵称
     * @param password 密码
     * @param studentId 学号
     * @param phoneNumber 手机号
     */
    public User(String userName, String password, String studentId, String phoneNumber) {
        this.userName = userName;
        this.password = password;
        this.studentId = studentId;
        this.phoneNumber = phoneNumber;
        this.roles = new ArrayList<>(Arrays.asList(ROLE_STUDENT));
    }

    /**
     * 内部类，用于封装跑腿员的专属信息。
     */
    public static class RunnerProfile {
        /**
         * 跑腿员的在线状态（ONLINE, OFFLINE, DELIVERING）。
         */
        private RunnerStatus status = RunnerStatus.OFFLINE;
        
        /**
         * 跑腿员的信誉分，初始为5.0，根据服务评价动态变化。
         */
        private Double rating = 5.0;
        
        /**
         * 完成的订单总数。
         */
        private Integer totalOrdersCompleted = 0;
        
        /**
         * 身份证号，用于实名认证。
         */
        private String idCardNumber;

        /**
         * 健康证图片的URL地址。
         */
        private String healthCertificateUrl;
        
        /**
         * 是否已通过平台认证。
         */
        private Boolean isVerified = false;
        
        /**
         * 成为跑腿员的时间。
         */
        private LocalDateTime runnerSince;
        
        /**
         * 累计收入。
         */
        private BigDecimal totalEarnings = BigDecimal.ZERO;

        public RunnerProfile() {
            this.runnerSince = LocalDateTime.now();
        }

        // Getters and Setters
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

    /**
     * 内部类，用于定义用户的收货地址。
     */
    public static class Address {
        /**
         * 地址的唯一ID，方便前端进行增删改查。
         */
        private String addressId;
        
        /**
         * 该地址的别名或收货人姓名。
         */
        @NotBlank(message = "收件人姓名不能为空")
        private String name;
        
        /**
         * 校区及楼栋名称，例如：东十二楼。
         */
        @NotBlank(message = "楼栋信息不能为空")
        private String building;
        
        /**
         * 详细的寝室号，例如：301。
         */
        private String room;
        
        /**
         * 备注信息，例如：请在楼下自取。
         */
        private String notes;
        
        /**
         * 是否为默认收货地址。
         */
        @NotNull(message = "是否默认地址不能为null")
        private Boolean isDefault = false;

        public Address() {
            this.addressId = java.util.UUID.randomUUID().toString();
        }

        // Getters and Setters
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

    /**
     * 枚举类，定义跑腿员的几种工作状态。
     */
    public enum RunnerStatus {
        ONLINE,     // 在线，可接单
        OFFLINE,    // 离线，不可接单
        DELIVERING  // 配送中，不可接单
    }

    // --- 业务方法 ---

    /**
     * 检查用户是否拥有指定角色。
     * @param role 角色名
     * @return 如果拥有该角色则返回true，否则返回false。
     */
    public boolean hasRole(String role) {
        return roles.contains(role);
    }

    /**
     * 为用户添加一个新角色。
     * @param role 角色名
     */
    public void addRole(String role) {
        if (!roles.contains(role)) {
            roles.add(role);
        }
    }

    /**
     * 移除用户的某个角色。
     * @param role 角色名
     */
    public void removeRole(String role) {
        roles.remove(role);
    }

    /**
     * 判断当前用户是否为跑腿员。
     * @return 如果是跑腿员则返回true。
     */
    public boolean isRunner() {
        return runnerProfile != null && hasRole(ROLE_RUNNER);
    }

    /**
     * 核心业务方法：将一个普通学生用户升级为跑腿员。
     * @param idCardNumber 身份证号，用于实名认证
     * @param studentIDCardurl 学生证URL，用于资质审核
     */
    public void becomeRunner(String idCardNumber, String studentIDCardurl) {
        if (this.runnerProfile == null) {
            this.runnerProfile = new RunnerProfile();
        }
        this.runnerProfile.setIdCardNumber(idCardNumber);
        this.runnerProfile.setHealthCertificateUrl(studentIDCardurl);
        this.runnerProfile.setVerified(false); // 认证状态默认为false，需要后台管理员审核
        addRole(ROLE_RUNNER);
    }

    // --- Getters and Setters ---
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
