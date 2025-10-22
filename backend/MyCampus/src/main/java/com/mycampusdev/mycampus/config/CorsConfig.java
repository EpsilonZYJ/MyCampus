package com.mycampusdev.mycampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS 跨域配置类
 * 允许前端应用（localhost:5173）访问后端 API
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许跨域的源（前端地址）
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://localhost:5174"); // 备用端口
        config.addAllowedOrigin("http://127.0.0.1:5173");
        
        // 允许所有请求头
        config.addAllowedHeader("*");
        
        // 允许所有 HTTP 方法（GET, POST, PUT, DELETE, etc.）
        config.addAllowedMethod("*");
        
        // 是否允许发送 Cookie
        config.setAllowCredentials(true);
        
        // 对所有路径应用此配置
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
