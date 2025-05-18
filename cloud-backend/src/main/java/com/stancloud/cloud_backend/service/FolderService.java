package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.dto.CreateFolderRequest;
import com.stancloud.cloud_backend.entity.*;
import com.stancloud.cloud_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public Folder createFolder(CreateFolderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder parentFolder = null;
        if (request.getParentId() != null) {
            parentFolder = folderRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
        }

        Folder folder = Folder.builder()
                .name(request.getName())
                .owner(user)
                .parent(parentFolder)
                .build();

        return folderRepository.save(folder);
    }

    public Object listFolders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return folderRepository.findByOwnerAndParentIsNull(user);
    }

    
}
