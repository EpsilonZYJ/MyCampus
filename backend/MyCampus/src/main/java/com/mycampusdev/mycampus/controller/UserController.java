package com.mycampusdev.mycampus.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycampusdev.mycampus.dto.UserRegisterRequest;
import com.mycampusdev.mycampus.pojo.ResponseMessage;
import com.mycampusdev.mycampus.pojo.User;
import com.mycampusdev.mycampus.pojo.User.Address;
import com.mycampusdev.mycampus.pojo.User.RunnerStatus;
import com.mycampusdev.mycampus.service.IUserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 用户模块的控制器，负责处理与用户相关的HTTP请求。
 * 采用RESTful风格设计API。
 */
@RestController
@RequestMapping("/api/users") // 统一的API路径前缀
@Validated
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private IUserService userService;

    /**
     * 用于用户登录请求的数据传输对象。
     */
    public static class LoginRequest {
        public String userName;
        public String password;
    }

    /**
     * 用于申请成为跑腿员请求的数据传输对象。
     */
    public static class BecomeRunnerRequest {
        @NotBlank(message = "IdCardNumber cannot be empty")
        public String idCardNumber;
        @NotBlank(message = "studentIDCardurl cannot be empty")
        public String studentIDCardurl;
    }

    /**
     * 用户注册
     * @param userRegisterRequest 包含新用户信息，将从请求体中解析
     * @return 包含创建成功的用户信息的响应
     */
    @PostMapping("/register")
    public ResponseMessage<User> register(@Valid @RequestBody UserRegisterRequest userRegisterRequest) {
        log.info("Registering user {}", userRegisterRequest);
        User registeredUser = userService.register(userRegisterRequest);
        log.info("User {} registered successfully", userRegisterRequest);
        return ResponseMessage.success(registeredUser);
    }

    /**
     * 用户登录
     * @param loginRequest 包含用户名和密码的登录请求
     * @return 登录成功则返回包含Token和用户信息的响应
     */
    @PostMapping("/login")
    public ResponseMessage<Map<String, Object>> login(@RequestBody @Valid LoginRequest loginRequest) {
        log.info("Logining user: name:{} password:{}", loginRequest.userName, loginRequest.password);
        Map<String, Object> loginResult = userService.login(loginRequest.userName, loginRequest.password);
        log.info("User {} login successfully", loginResult.toString());
        return ResponseMessage.success(loginResult);
    }

    /**
     * 根据ID获取用户信息
     * @param id 用户的唯一ID
     * @return 包含用户信息的响应
     */
    @GetMapping("/{id}")
    public ResponseMessage<User> getUserById(@PathVariable String id) {
        User user = userService.findById(id);
        return ResponseMessage.success(user);
    }

    /**
     * 更新用户信息
     * @param id 要更新的用户的ID
     * @param userUpdates 包含待更新字段的Map
     * @return 更新后的用户信息
     */
    @PutMapping("/{id}")
    public ResponseMessage<User> updateUser(@PathVariable String id, @RequestBody Map<String, Object> userUpdates) {
        User updatedUser = userService.updateUser(id, userUpdates);
        return ResponseMessage.success(updatedUser);
    }

    /**
     * 为指定用户添加新的收货地址
     * @param userId 用户的ID
     * @param address 新的地址信息
     * @return 更新后的用户信息
     */
    @PostMapping("/{userId}/addresses")
    public ResponseMessage<User> addAddress(@PathVariable String userId, @Valid @RequestBody Address address) {
        User updatedUser = userService.addAddress(userId, address);
        return ResponseMessage.success(updatedUser);
    }

    /**
     * 更新用户的某个收货地址
     * @param userId 用户的ID
     * @param addressId 地址的ID
     * @param addressUpdates 包含地址更新信息的Map
     * @return 更新后的用户信息
     */
    @PutMapping("/{userId}/addresses/{addressId}")
    public ResponseMessage<User> updateAddress(@PathVariable String userId, @PathVariable String addressId, @RequestBody Address addressUpdates) {
        User updatedUser = userService.updateAddress(userId, addressId, addressUpdates);
        return ResponseMessage.success(updatedUser);
    }

    /**
     * 删除用户的某个收货地址
     * @param userId 用户的ID
     * @param addressId 地址的ID
     * @return 无返回内容的成功响应
     */
    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseMessage<Void> deleteAddress(@PathVariable String userId, @PathVariable String addressId) {
        userService.deleteAddress(userId, addressId);
        return ResponseMessage.success(null);
    }

    /**
     * 用户申请成为跑腿员
     * @param userId 申请用户的ID
     * @param request 包含身份证和健康证信息的请求体
     * @return 更新后的用户信息
     */
    @PostMapping("/{userId}/become-runner")
    public ResponseMessage<User> becomeRunner(@PathVariable String userId, @Valid @RequestBody BecomeRunnerRequest request) {
        User updatedUser = userService.becomeRunner(userId, request.idCardNumber, request.studentIDCardurl);
        return ResponseMessage.success(updatedUser);
    }

    /**
     * 用于余额操作请求的数据传输对象。
     */
    public static class BalanceOperationRequest {
        @NotNull(message = "Amount cannot be null")
        private BigDecimal amount;
        
        public BigDecimal getAmount() {
            return amount;
        }
        
        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
    
    /**
     * 跑腿员更新自己的在线状态
     * @param userId 跑腿员的用户ID
     * @param statusMap 包含新状态的请求体, e.g., {"status": "ONLINE"}
     * @return 更新后的用户信息
     */
    @PutMapping("/{userId}/runner/status")
    public ResponseMessage<User> updateRunnerStatus(@PathVariable String userId, @RequestBody Map<String, String> statusMap) {
        RunnerStatus status = RunnerStatus.valueOf(statusMap.get("status"));
        User updatedUser = userService.updateRunnerStatus(userId, status);
        return ResponseMessage.success(updatedUser);
    }
    
    /**
     * 增加用户余额（充值）
     * @param userId 用户ID
     * @param request 包含充值金额的请求体
     * @return 更新后的用户信息
     */
    @PostMapping("/{userId}/balance/add")
    public ResponseMessage<User> addBalance(@PathVariable String userId, @Valid @RequestBody BalanceOperationRequest request) {
        User updatedUser = userService.addBalance(userId, request.getAmount());
        return ResponseMessage.success(updatedUser);
    }
    
    /**
     * 减少用户余额（消费）
     * @param userId 用户ID
     * @param request 包含消费金额的请求体
     * @return 更新后的用户信息
     */
    @PostMapping("/{userId}/balance/deduct")
    public ResponseMessage<User> deductBalance(@PathVariable String userId, @Valid @RequestBody BalanceOperationRequest request) {
        User updatedUser = userService.deductBalance(userId, request.getAmount());
        return ResponseMessage.success(updatedUser);
    }
    
    /**
     * 获取所有待审核的跑腿员列表（管理员功能）
     * GET /api/users/runners/pending
     */
    @GetMapping("/runners/pending")
    public ResponseMessage<List<User>> getPendingRunners() {
        List<User> pendingRunners = userService.getPendingRunners();
        return ResponseMessage.success(pendingRunners);
    }
    
    /**
     * 管理员审核跑腿员申请
     * POST /api/users/{userId}/runners/approve
     */
    @PostMapping("/{userId}/runners/approve")
    public ResponseMessage<User> approveRunner(
            @PathVariable String userId, 
            @RequestBody Map<String, Boolean> request) {
        Boolean approved = request.get("approved");
        User updatedUser = userService.approveRunner(userId, approved);
        return ResponseMessage.success(updatedUser);
    }
}
