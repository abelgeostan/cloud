package com.stancloud.cloud_backend.controller;

import com.stancloud.cloud_backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
}
