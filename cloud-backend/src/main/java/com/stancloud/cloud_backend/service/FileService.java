package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.entity.FileData; 
import com.stancloud.cloud_backend.entity.Folder;
import com.stancloud.cloud_backend.entity.User;
import com.stancloud.cloud_backend.repository.FileDataRepository; 
import com.stancloud.cloud_backend.repository.FolderRepository;
import com.stancloud.cloud_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource; // Import Resource
import org.springframework.core.io.UrlResource; // Import UrlResource
import org.springframework.http.HttpStatus;   // Import HttpStatus
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException; // Import ResponseStatusException

import java.io.IOException;
import java.net.MalformedURLException; // Import MalformedURLException
import java.nio.file.*;
import java.util.Optional; // Import Optional

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileDataRepository fileRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    // It's better to inject this from application.properties for flexibility
    // @Value("${file.upload-dir}")
    private final String uploadDir = "uploads"; // Assuming this is the base directory for uploads

    public FileData upload(MultipartFile multipartFile, Long folderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")); // Use ResponseStatusException

        Folder folder = null;
        if (folderId != null) {
            folder = folderRepository.findById(folderId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Folder not found")); // Use ResponseStatusException
        }

        try {
            // Ensure upload directory exists
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize(); // Get absolute path
            Files.createDirectories(uploadPath);

            String originalFilename = multipartFile.getOriginalFilename();
            // Generate a unique filename to prevent collisions and security issues
            String storedFilename = System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(storedFilename); // Resolve against the uploadPath

            // Save file to disk
            Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Save metadata to DB
            FileData fileData = FileData.builder()
                    .filename(originalFilename)
                    .fileType(multipartFile.getContentType())
                    .fileSize(multipartFile.getSize())
                    .storagePath(storedFilename) // Store only the unique filename, not the full path
                    .owner(user)
                    .folder(folder)
                    .build();

            return fileRepository.save(fileData);

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed: " + e.getMessage(), e); // Use ResponseStatusException
        }
    }

    /**
     * Loads a file as a Spring Resource for download.
     * Performs authorization check to ensure the user owns the file.
     *
     * @param fileId The ID of the file to download.
     * @param userEmail The email of the authenticated user attempting the download.
     * @return The file as a Resource.
     * @throws IOException If the file is not found or cannot be read.
     * @throws ResponseStatusException If the user is not authorized or file metadata is not found.
     */
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

        // 3. Construct the full file path on the server
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize(); // Ensure consistency with upload path
        Path filePath = uploadPath.resolve(fileData.getStoragePath()).normalize(); // Resolve against the base upload directory

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