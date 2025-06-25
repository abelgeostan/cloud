package com.stancloud.cloud_backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Service;

import com.stancloud.cloud_backend.entity.FileData;
import com.stancloud.cloud_backend.entity.Folder;
import com.stancloud.cloud_backend.entity.User;
import com.stancloud.cloud_backend.repository.FileDataRepository;
import com.stancloud.cloud_backend.repository.FolderRepository;
import com.stancloud.cloud_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    private final FileDataRepository fileDataRepository;
    private final FolderRepository folderRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUserById(Long id) {
        userRepository.findById(id).ifPresent(user -> {

            // 1. Delete all files
            List<FileData> files = fileDataRepository.findByOwnerId(user.getId());
            for (FileData file : files) {
                try {
                    Path path = Paths.get("uploads", file.getStoragePath());
                    Files.deleteIfExists(path);
                } catch (IOException e) {
                    System.err.println("Failed to delete file: " + file.getStoragePath());
                }
            }
            // Break relation before deletion
            for (FileData file : files) {
                file.setOwner(null);
            }
            fileDataRepository.saveAll(files);
            fileDataRepository.deleteAll(files);

            // 2. Delete all folders owned by the user (break hierarchy if needed)
            List<Folder> folders = folderRepository.findByOwnerId(user.getId());
            for (Folder folder : folders) {
                folder.setOwner(null);
                folder.setParent(null);  // Break circular reference
            }
            folderRepository.saveAll(folders);
            folderRepository.deleteAll(folders);

            // 3. Now delete user
            userRepository.delete(user);
        });
    }

    public User updateUserStorageLimit(Long id, Long newLimit) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        
        if (newLimit < user.getStorageUsed()) {
            throw new IllegalArgumentException("New storage limit cannot be less than current usage.");
        }
        
        user.setStorageLimit(newLimit);
        user.setVerified(true);
        return userRepository.save(user);
    }

    public long getUserStorageUsage(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        
        // Return the storage used by the user
        return user.getStorageUsed();
    }

}
