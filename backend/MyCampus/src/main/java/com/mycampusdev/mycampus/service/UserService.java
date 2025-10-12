package com.mycampusdev.mycampus.service;

import com.mycampusdev.mycampus.dto.UserRegisterRequest;
import com.mycampusdev.mycampus.pojo.User;
import com.mycampusdev.mycampus.pojo.User.Address;
import com.mycampusdev.mycampus.pojo.User.RunnerStatus;
import com.mycampusdev.mycampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

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

        userUpdates.forEach((key, value) -> {
            // 使用反射动态更新字段
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
