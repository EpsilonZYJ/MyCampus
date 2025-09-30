package com.mycampusdev.mycampus.service;

import com.mycampusdev.mycampus.pojo.User;
import com.mycampusdev.mycampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service  // springµÄBean
public class UserService implements IUserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public void add(User user){
        userRepository.save(user);
    }
}
