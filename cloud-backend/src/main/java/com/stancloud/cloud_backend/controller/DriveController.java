package com.stancloud.cloud_backend.controller;

import com.stancloud.cloud_backend.dto.UpdateFileRequest;
import com.stancloud.cloud_backend.dto.UpdateFileResponse;
import com.stancloud.cloud_backend.entity.FileData;
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
import java.net.URLConnection;
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
            @AuthenticationPrincipal(expression = "username") String userEmail) {
        try {
            Resource resource = fileService.loadFileAsResource(fileId, userEmail);
            
            String contentType = "application/octet-stream";
            try {
                contentType = Files.probeContentType(Paths.get(resource.getURI()));
            } catch (IOException ignored) {}
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error downloading file", e);
        }
    }

    @PutMapping("/rename/{fileId}")
    public ResponseEntity<UpdateFileResponse> renameFile(
            @PathVariable Long fileId,
            @RequestBody UpdateFileRequest request,
            @AuthenticationPrincipal(expression = "username") String userEmail) {

        String newFilename = request.getFilename();
        if (newFilename == null || newFilename.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filename cannot be null or empty");
        }

        
        FileData fileData = fileService.renameFile(fileId, newFilename, userEmail);

        UpdateFileResponse response = new UpdateFileResponse(
                fileId,
                fileData.getFilename(),
                "File renamed successfully"
        );

        return ResponseEntity.ok(response);
    }




}