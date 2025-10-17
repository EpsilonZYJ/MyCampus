package com.mycampusdev.mycampus.service;

import com.mycampusdev.mycampus.dto.UserRegisterRequest;
import com.mycampusdev.mycampus.pojo.User;
import com.mycampusdev.mycampus.pojo.User.Address;
import com.mycampusdev.mycampus.pojo.User.RunnerStatus;

import java.util.Map;

/**
 * 用户服务的接口，定义了用户模块所需的所有业务方法。
 */
public interface IUserService {

    /**
     * 用户注册
     * @param userRegisterRequest 包含注册信息的请求对象
     * @return 创建成功并持久化的用户对象
     */
    User register(UserRegisterRequest userRegisterRequest);

    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return 包含认证token和用户信息的Map
     */
    Map<String, Object> login(String username, String password);

    /**
     * 根据ID查找用户
     * @param id 用户的唯一ID
     * @return 查找到的用户对象
     */
    User findById(String id);

    /**
     * 更新用户信息
     * @param id 要更新的用户的ID
     * @param userUpdates 包含待更新字段的Map
     * @return 更新后的用户对象
     */
    User updateUser(String id, Map<String, Object> userUpdates);

    /**
     * 为用户添加新的收货地址
     * @param userId 用户的ID
     * @param address 新的地址信息
     * @return 更新后的用户对象
     */
    User addAddress(String userId, Address address);

    /**
     * 更新用户的某个收货地址
     * @param userId 用户的ID
     * @param addressId 要更新的地址的ID
     * @param addressUpdates 包含地址更新信息的对象
     * @return 更新后的用户对象
     */
    User updateAddress(String userId, String addressId, Address addressUpdates);

    /**
     * 删除用户的某个收货地址
     * @param userId 用户的ID
     * @param addressId 要删除的地址的ID
     */
    void deleteAddress(String userId, String addressId);

    /**
     * 用户申请成为跑腿员
     * @param userId 申请用户的ID
     * @param idCardNumber 身份证号
     * @param healthCertificateUrl 健康证URL
     * @return 更新后的用户对象
     */
    User becomeRunner(String userId, String idCardNumber, String healthCertificateUrl);

    /**
     * 跑腿员更新自己的在线状态
     * @param userId 跑腿员的用户ID
     * @param status 新的在线状态
     * @return 更新后的用户对象
     */
    User updateRunnerStatus(String userId, RunnerStatus status);
    
    /**
     * 增加用户余额（充值）
     * @param userId 用户ID
     * @param amount 要增加的金额
     * @return 更新后的用户对象
     */
    User addBalance(String userId, java.math.BigDecimal amount);
    
    /**
     * 减少用户余额（消费）
     * @param userId 用户ID
     * @param amount 要减少的金额
     * @return 更新后的用户对象
     * @throws RuntimeException 当余额不足时抛出异常
     */
    User deductBalance(String userId, java.math.BigDecimal amount);
}
