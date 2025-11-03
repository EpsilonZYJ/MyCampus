package com.mycampusdev.mycampus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * MongoDB 配置类
 * 启用审计功能，使 @CreatedDate 和 @LastModifiedDate 注解生效
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {
    // 启用 MongoDB 审计功能
}


