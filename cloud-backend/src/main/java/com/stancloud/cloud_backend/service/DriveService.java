package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.dto.DriveContentsDTO;
import com.stancloud.cloud_backend.dto.FileSimpleDTO;
import com.stancloud.cloud_backend.dto.FolderSimpleDTO;
import com.stancloud.cloud_backend.entity.*;
import com.stancloud.cloud_backend.repository.*;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriveService {
    private final FileDataRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public DriveContentsDTO listContents(Long folderId, String userEmail) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Folder> folders;
        List<FileData> files;

        if (folderId != null) {
            // Get subfolders of the requested folder
            folders = folderRepository.findByOwnerAndParentId(owner, folderId);
            // Get files in the requested folder
            files = fileRepository.findByOwnerAndFolderId(owner, folderId);
        } else {
            // Get root folders (no parent)
            folders = folderRepository.findByOwnerAndParentIsNull(owner);
            // Get root files (no folder)
            files = fileRepository.findByOwnerAndFolderIsNull(owner);
        }

        return new DriveContentsDTO(
            folders.stream().map(this::convertToSimpleDTO).collect(Collectors.toList()),
            files.stream().map(this::convertToSimpleDTO).collect(Collectors.toList())
        );
    }

    
    private FolderSimpleDTO convertToSimpleDTO(Folder folder) {
    return new FolderSimpleDTO(folder.getId(), folder.getName());
    }

    private FileSimpleDTO convertToSimpleDTO(FileData file) {
        return new FileSimpleDTO(
            file.getId(),
            file.getFilename(),
            file.getFileType(),
            file.getFileSize(),
            file.getStoragePath(),
            file.getFolder() != null ? file.getFolder().getId() : null
        );
    }


}