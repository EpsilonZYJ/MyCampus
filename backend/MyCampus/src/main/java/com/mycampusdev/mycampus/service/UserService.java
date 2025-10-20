package com.mycampusdev.mycampus.service;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import com.mycampusdev.mycampus.dto.UserRegisterRequest;
import com.mycampusdev.mycampus.pojo.User;
import com.mycampusdev.mycampus.pojo.User.Address;
import com.mycampusdev.mycampus.pojo.User.RunnerStatus;
import com.mycampusdev.mycampus.repository.UserRepository;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    // TODO: 注入一个密码编码器，例如 BCryptPasswordEncoder
    // import org.springframework.security.crypto.password.PasswordEncoder;
    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Override
    public User register(UserRegisterRequest userRegisterRequest) {
        // 检查用户名或学号是否已存在
        if (userRepository.findByUserName(userRegisterRequest.getUserName()).isPresent() ||
            userRepository.findByStudentId(userRegisterRequest.getStudentId()).isPresent()) {
            throw new RuntimeException("Username or StudentID is existed");
        }
        
        // 将DTO转换为User实体
        User user = new User();
        user.setUserName(userRegisterRequest.getUserName());
        user.setPassword(userRegisterRequest.getPassword());
        user.setEmail(userRegisterRequest.getEmail());
        user.setPhoneNumber(userRegisterRequest.getPhoneNumber());
        user.setStudentId(userRegisterRequest.getStudentId());
        
        // TODO: 对密码进行加密
        // user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Map<String, Object> login(String username, String password) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User " + username+ " is not existed"));

        // TODO: 使用 passwordEncoder.matches(password, user.getPassword()) 进行密码匹配
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Password error");
        }

        // TODO: 使用JWT等技术生成真实的Token
        String token = "fake-jwt-token-for-" + user.getUserName();

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", user);
        return result;
    }

    @Override
    public User findById(String id) {
        return getUserById(id);
    }

    @Override
    public User updateUser(String id, Map<String, Object> userUpdates) {
        User user = getUserById(id);

        List<String> sensitiveFields = Arrays.asList(
            "balance", "password", "roles", "id", "createdAt", "updatedAt",
            "lastLoginAt"
        );

        userUpdates.forEach((key, value) -> {
            if (sensitiveFields.contains(key)) {
                throw new RuntimeErrorException(null, key + "属性不允许使用该方法修改");
            }
            
            // 使用反射动态更新非敏感字段
            Field field = ReflectionUtils.findField(User.class, key);
            if (field != null) {
                // 确保可以访问私有字段
                ReflectionUtils.makeAccessible(field);
                // 设置字段值
                ReflectionUtils.setField(field, user, value);
            }
        });

        return userRepository.save(user);
    }

    @Override
    public User addAddress(String userId, Address address) {
        User user = getUserById(userId);
        user.getAddresses().add(address);
        return userRepository.save(user);
    }

    @Override
    public User updateAddress(String userId, String addressId, Address addressUpdates) {
        User user = getUserById(userId);
        Address addressToUpdate = user.getAddresses().stream()
                .filter(addr -> addr.getAddressId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Address is not existed"));

        // 更新字段
        if (addressUpdates.getName() != null) addressToUpdate.setName(addressUpdates.getName());
        if (addressUpdates.getBuilding() != null) addressToUpdate.setBuilding(addressUpdates.getBuilding());
        if (addressUpdates.getRoom() != null) addressToUpdate.setRoom(addressUpdates.getRoom());
        if (addressUpdates.getNotes() != null) addressToUpdate.setNotes(addressUpdates.getNotes());
        if (addressUpdates.getDefault() != null) addressToUpdate.setDefault(addressUpdates.getDefault());

        return userRepository.save(user);
    }

    @Override
    public void deleteAddress(String userId, String addressId) {
        User user = getUserById(userId);
        boolean removed = user.getAddresses().removeIf(address -> address.getAddressId().equals(addressId));
        if (!removed) {
            throw new RuntimeException("The address to be deleted is not existed");
        }
        userRepository.save(user);
    }

    @Override
    public User becomeRunner(String userId, String idCardNumber, String healthCertificateUrl) {
        User user = getUserById(userId);
        user.becomeRunner(idCardNumber, healthCertificateUrl);
        return userRepository.save(user);
    }

    @Override
    public User updateRunnerStatus(String userId, RunnerStatus status) {
        User user = getUserById(userId);
        if (!user.isRunner()) {
            throw new RuntimeException("Current user is not runner");
        }
        user.getRunnerProfile().setStatus(status);
        return userRepository.save(user);
    }

    @Override
    public User addBalance(String userId, java.math.BigDecimal amount) {
        User user = getUserById(userId);
        
        // 验证金额必须为正数
        if (amount == null || amount.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }
        
        // 增加余额
        user.setBalance(user.getBalance().add(amount));
        return userRepository.save(user);
    }

    @Override
    public User deductBalance(String userId, java.math.BigDecimal amount) {
        User user = getUserById(userId);
        
        // 验证金额必须为正数
        if (amount == null || amount.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive");
        }
        
        // 检查余额是否充足
        if (user.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        
        // 减少余额
        user.setBalance(user.getBalance().subtract(amount));
        return userRepository.save(user);
    }

    @Override
    public List<User> getPendingRunners() {
        // 查找所有拥有跑腿员角色但未认证的用户
        return userRepository.findAll().stream()
                .filter(user -> user.isRunner() && 
                               user.getRunnerProfile() != null && 
                               !user.getRunnerProfile().getVerified())
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public User approveRunner(String userId, Boolean approved) {
        User user = getUserById(userId);
        
        if (!user.isRunner() || user.getRunnerProfile() == null) {
            throw new RuntimeException("User is not a runner applicant");
        }
        
        if (approved) {
            user.getRunnerProfile().setVerified(true);
        } else {
            // 如果拒绝，移除跑腿员角色和档案
            user.removeRole(User.ROLE_RUNNER);
            user.setRunnerProfile(null);
        }
        
        return userRepository.save(user);
    }

    /**
     * 内部辅助方法，用于根据ID获取用户，如果找不到则抛出标准异常。
     * @param id 用户ID
     * @return 找到的用户实体
     */
    private User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserID: " + id + " is not existed"));
    }
}
