package com.stancloud.cloud_backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stancloud.cloud_backend.entity.User;
import com.stancloud.cloud_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    
    private final UserRepository userRepository;
    // private final UserService userService;

    @GetMapping("/isVerified")
    public boolean isUserVerified(@AuthenticationPrincipal(expression = "username") String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        return user != null && user.isVerified();
    }

    @GetMapping("/storageUsed")
    public long getUserStorageUsed(@AuthenticationPrincipal(expression = "username") String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        return user != null ? user.getStorageUsed() : 0;
    }
    @GetMapping("/storageLimit")
    public long getUserStorageLimit(@AuthenticationPrincipal(expression = "username") String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        return user != null ? user.getStorageLimit() : 0;
    }
}
