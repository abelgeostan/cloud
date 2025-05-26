package com.stancloud.cloud_backend.controller;

import com.stancloud.cloud_backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource; // Import Resource
import org.springframework.http.HttpHeaders; // Import HttpHeaders
import org.springframework.http.HttpStatus;   // Import HttpStatus
import org.springframework.http.MediaType;  // Import MediaType
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException; // Import ResponseStatusException

import java.io.IOException; // Import IOException
import java.nio.file.Files; // Import Files
import java.nio.file.Paths; // Import Paths

@RestController
@RequestMapping("/api/drive/files")
@RequiredArgsConstructor
public class DriveController {

    private final FileService fileService;
    private final DriveService driveService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) Long folderId,
            @AuthenticationPrincipal(expression = "username") String userEmail) {
        // 'username' here is actually the email since you used email as username
        return ResponseEntity.ok(fileService.upload(file, folderId, userEmail));
    }

    @GetMapping("/{folderId}")
    public ResponseEntity<?> listDriveContents(
            @PathVariable Long folderId,
            @AuthenticationPrincipal(expression = "username") String userEmail) {
        return ResponseEntity.ok(driveService.listContents(folderId, userEmail));
    }

    // Add this for root level listing
    @GetMapping
    public ResponseEntity<?> listRootDriveContents(
            @AuthenticationPrincipal(expression = "username") String userEmail) {
        return ResponseEntity.ok(driveService.listContents(null, userEmail));
    }

    // NEW DOWNLOAD ENDPOINT
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long fileId,
            @AuthenticationPrincipal(expression = "username") String userEmail) { // Add userEmail for security
        try {
            // Call the fileService to load the file as a Resource
            Resource resource = fileService.loadFileAsResource(fileId, userEmail);

            // Determine content type (e.g., "application/pdf", "image/jpeg")
            String contentType;
            try {
                // Try to determine file's content type using its URI
                contentType = Files.probeContentType(Paths.get(resource.getURI()));
            } catch (IOException ex) {
                // Fallback to a generic content type if detection fails
                contentType = "application/octet-stream";
            }

            // Return the file as a ResponseEntity with appropriate headers
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (IOException e) {
            // Handle file not found or other IO errors
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found or cannot be read: " + e.getMessage(), e);
        } catch (SecurityException e) { // Catch custom security exceptions from FileService
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage(), e);
        } catch (Exception e) {
            // Catch any other unexpected exceptions
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error downloading file: " + e.getMessage(), e);
        }
    }
}