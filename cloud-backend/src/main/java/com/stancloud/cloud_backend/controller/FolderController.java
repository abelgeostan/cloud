package com.stancloud.cloud_backend.controller;

import com.stancloud.cloud_backend.dto.CreateFolderRequest;
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
}

