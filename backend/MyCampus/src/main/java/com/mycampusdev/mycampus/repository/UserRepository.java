package com.mycampusdev.mycampus.repository;

import com.mycampusdev.mycampus.pojo.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户数据仓库接口，继承自MongoRepository，提供对User集合的CRUD操作。
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * 根据用户昵称查找用户。
     * Spring Data MongoDB会根据方法名自动生成查询。
     * @param userName 用户昵称
     * @return 包含用户（如果找到）的Optional对象
     */
    Optional<User> findByUserName(String userName);

    /**
     * 根据学号查找用户。
     * @param studentId 学号
     * @return 包含用户（如果找到）的Optional对象
     */
    Optional<User> findByStudentId(String studentId);
}
