package com.stancloud.cloud_backend.controller;

import com.stancloud.cloud_backend.dto.CreateFolderRequest;
import com.stancloud.cloud_backend.dto.UpdateFolderRequest;
import com.stancloud.cloud_backend.service.FolderService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    @PostMapping
    public ResponseEntity<?> createFolder(@RequestBody CreateFolderRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Creating folder for user: " + userEmail);
        return ResponseEntity.ok(folderService.createFolder(request, userEmail));
    }

    @GetMapping
    public ResponseEntity<?> listFolders() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Listing folders for user: " + userEmail);
        return ResponseEntity.ok(folderService.listFolders(userEmail));
    }
    // Get folder by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFolder(@PathVariable Long id) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(folderService.getFolder(id, userEmail));
    }

    // Update folder
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFolder(@PathVariable Long id, 
                                        @RequestBody UpdateFolderRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(folderService.updateFolder(id, request, userEmail));
    }

    // Delete folder
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFolder(@PathVariable Long id) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        folderService.deleteFolder(id, userEmail);
        return ResponseEntity.noContent().build();
    }

}

