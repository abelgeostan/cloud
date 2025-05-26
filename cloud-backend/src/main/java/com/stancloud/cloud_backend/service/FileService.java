package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.entity.FileData;
import com.stancloud.cloud_backend.entity.Folder;
import com.stancloud.cloud_backend.entity.User;
import com.stancloud.cloud_backend.repository.FileDataRepository;
import com.stancloud.cloud_backend.repository.FolderRepository;
import com.stancloud.cloud_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileDataRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    private final String uploadDir = "uploads"; // Assuming this is the base directory for uploads

    public FileData upload(MultipartFile multipartFile, Long folderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found"));
        }

        try {
            // Ensure upload directory exists and get its absolute, normalized path
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFilename = multipartFile.getOriginalFilename();
            // Generate a unique filename to prevent collisions and security issues
            String storedFilename = System.currentTimeMillis() + "_" + originalFilename;
            
            // Construct the full path where the file will be saved on disk
            Path filePathOnDisk = uploadPath.resolve(storedFilename);

            // Save file to disk
            Files.copy(multipartFile.getInputStream(), filePathOnDisk, StandardCopyOption.REPLACE_EXISTING);

            // Save metadata to DB
            FileData fileData = FileData.builder()
                    .filename(originalFilename)
                    .fileType(multipartFile.getContentType())
                    .fileSize(multipartFile.getSize())
                    // FIX: Store ONLY the storedFilename, not the full path, in the database.
                    // The 'uploadDir' will be prepended when retrieving.
                    .storagePath(storedFilename) // <--- CRITICAL CHANGE HERE
                    .owner(user)
                    .folder(folder)
                    .build();

            return fileRepository.save(fileData);

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed: " + e.getMessage(), e);
        }
    }

    public Resource loadFileAsResource(Long fileId, String userEmail) throws IOException {
        // 1. Retrieve file metadata from the database
        Optional<FileData> fileOptional = fileRepository.findById(fileId);

        if (fileOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File with ID " + fileId + " not found.");
        }

        FileData fileData = fileOptional.get();

        // 2. Perform Authorization Check:
        // Ensure the authenticated user owns this file
        if (!fileData.getOwner().getEmail().equals(userEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: User " + userEmail + " does not own file " + fileId);
        }

        // 3. Construct the full file path on the server using the base upload directory
        // and the 'storagePath' (which now correctly only contains the filename)
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize(); // Base upload directory
        Path filePath = uploadPath.resolve(fileData.getStoragePath()).normalize(); // Resolves correctly now

        // 4. Check if the file exists and is readable
        if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found on server at path: " + filePath.toString());
        }

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found or not readable: " + filePath.toString());
            }
        } catch (MalformedURLException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File path invalid: " + ex.getMessage(), ex);
        }
    }
}