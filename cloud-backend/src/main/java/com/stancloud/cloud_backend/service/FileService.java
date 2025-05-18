package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.entity.*;
import com.stancloud.cloud_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileDataRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    private final String uploadDir = "uploads";

    public FileData upload(MultipartFile multipartFile, Long folderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new RuntimeException("Folder not found"));
        }

        try {
            // Ensure upload directory exists
            Files.createDirectories(Paths.get(uploadDir));

            String originalFilename = multipartFile.getOriginalFilename();
            String storedFilename = System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = Paths.get(uploadDir, storedFilename);

            // Save file to disk
            Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Save metadata to DB
            FileData fileData = FileData.builder()
                    .filename(originalFilename)
                    .fileType(multipartFile.getContentType())
                    .fileSize(multipartFile.getSize())
                    .storagePath(filePath.toString())
                    .owner(user)
                    .folder(folder)
                    .build();

            return fileRepository.save(fileData);

        } catch (IOException e) {
            throw new RuntimeException("File upload failed", e);
        }
    }
}
