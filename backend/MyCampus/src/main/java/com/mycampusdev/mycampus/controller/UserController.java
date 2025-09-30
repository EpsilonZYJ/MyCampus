package com.mycampusdev.mycampus.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycampusdev.mycampus.pojo.User;
import com.mycampusdev.mycampus.service.IUserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController  // 接口方法返回对象，并转换为json文本
@RequestMapping("user")  //localhost:8080/user/...
public class UserController {
    // 增删查改
    // 使用Rest风格接口？

    @Autowired
    IUserService userService;

    //增加
    @PostMapping
    public String add(@Valid @RequestBody User user) {

        userService.add(user);
        
        return "success";
    }
    
}
