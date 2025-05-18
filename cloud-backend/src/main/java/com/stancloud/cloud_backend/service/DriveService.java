package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.entity.*;
import com.stancloud.cloud_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DriveService {

    private final FolderRepository folderRepository;
    private final FileDataRepository fileRepository;
    private final UserRepository userRepository;

    public Map<String, Object> listContents(Long folderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder parentFolder = null;
        if (folderId != null) {
            parentFolder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new RuntimeException("Folder not found"));
        }

        // Fetch folders
        List<Folder> folders = folderRepository.findByOwnerAndParent(user, parentFolder);

        // Fetch files
        List<FileData> files;
        if (parentFolder == null) {
            files = fileRepository.findAllByOwnerAndFolderIsNull(user);
        } else {
            files = fileRepository.findAllByOwnerAndFolder(user, parentFolder);
        }

        // Wrap in response map
        Map<String, Object> response = new HashMap<>();
        response.put("folders", folders);
        response.put("files", files);
        return response;
    }
}
