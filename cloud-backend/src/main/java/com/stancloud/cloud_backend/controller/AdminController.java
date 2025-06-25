package com.stancloud.cloud_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
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
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> listAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        adminService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/update-limit/{newLimit}")//this also verifies the user
    public ResponseEntity<User> updateUserStorageLimit(@PathVariable Long id, @PathVariable Long newLimit) {
        User updatedUser = adminService.updateUserStorageLimit(id, newLimit* 1024L * 1024 * 1024); // Convert GB to bytes
        return ResponseEntity.ok(updatedUser);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{id}/storage-usage")
    public ResponseEntity<Long> getUserStorageUsage(@PathVariable Long id) {
        long storageUsed = adminService.getUserStorageUsage(id);
        return ResponseEntity.ok(storageUsed);
    }
}
