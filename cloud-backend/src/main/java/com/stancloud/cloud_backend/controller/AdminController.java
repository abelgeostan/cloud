package com.stancloud.cloud_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stancloud.cloud_backend.entity.User;
import com.stancloud.cloud_backend.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final AdminService adminService;
    // Add methods for admin functionalities here
    // For example, you might want to add endpoints for user management, system health checks, etc.
    
    // Example: Get system health
    // @GetMapping("/health")
    // public ResponseEntity<String> getSystemHealth() {
    //     return ResponseEntity.ok("System is healthy");
    // }
    
    // Example: List all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> listAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        adminService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}
