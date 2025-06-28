package com.stancloud.cloud_backend.controller;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stancloud.cloud_backend.entity.FileData;
import com.stancloud.cloud_backend.entity.User;
import com.stancloud.cloud_backend.repository.FileDataRepository;
import com.stancloud.cloud_backend.repository.UserRepository;
import com.stancloud.cloud_backend.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final AdminService adminService;
    private final long startTime = System.currentTimeMillis();
    private final UserRepository userRepository;
    private final FileDataRepository fileDataRepository;
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
    @GetMapping("/server-health")
    public Map<String, Object> getServerHealth() {
        Map<String, Object> health = new HashMap<>();

        // CPU
        OperatingSystemMXBean os = ManagementFactory.getOperatingSystemMXBean();
        double cpuLoad = os instanceof com.sun.management.OperatingSystemMXBean ?
                ((com.sun.management.OperatingSystemMXBean) os).getSystemCpuLoad() * 100 : -1;

        // Memory
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;

        // Disk
        File uploadDir = new File("uploads");
        long totalDisk = uploadDir.getTotalSpace();
        long freeDisk = uploadDir.getUsableSpace();
        long usedDisk = totalDisk - freeDisk;

        // Uptime
        long uptimeMillis = System.currentTimeMillis() - startTime;

        // App-level metrics
        long userCount = userRepository.count();
        long fileCount = fileDataRepository.count();
        long totalFileSize = fileDataRepository.findAll()
                .stream()
                .mapToLong(FileData::getFileSize)
                .sum();

        health.put("cpuUsage", String.format("%.2f", cpuLoad));
        health.put("usedMemoryMB", usedMemory / (1024 * 1024));
        health.put("totalMemoryMB", totalMemory / (1024 * 1024));
        health.put("usedDiskGB", usedDisk / (1024 * 1024 * 1024));
        health.put("totalDiskGB", totalDisk / (1024 * 1024 * 1024));
        health.put("uptimeMinutes", uptimeMillis / (1000 * 60));
        health.put("userCount", userCount);
        health.put("fileCount", fileCount);
        health.put("totalFileSizeMB", totalFileSize / (1024 * 1024));

        return health;
    }


    
}
