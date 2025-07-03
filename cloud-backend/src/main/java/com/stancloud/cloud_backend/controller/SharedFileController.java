package com.stancloud.cloud_backend.controller;

import com.stancloud.cloud_backend.entity.SharedFile;
import com.stancloud.cloud_backend.service.SharedFileService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;

@RestController
@RequestMapping("/api/share")
@RequiredArgsConstructor
public class SharedFileController {

    private final SharedFileService sharedFileService;

    @PostMapping("/create")
    public ResponseEntity<?> createShareLink(@RequestBody Map<String, Object> request) {
        Long fileId = Long.valueOf(request.get("fileId").toString());
        Integer downloadLimit = (Integer) request.get("downloadLimit");
        Integer expiryInHours = (Integer) request.get("expiryInHours");

        SharedFile sharedFile = sharedFileService.createShareLinkByFileId(fileId, downloadLimit/2, expiryInHours);
        return ResponseEntity.ok(Map.of("shareLink", "/share/" + sharedFile.getShareToken()));
    }


    @GetMapping("/{token}")
    public ResponseEntity<?> downloadSharedFile(@PathVariable String token) {
        return sharedFileService.getValidSharedFile(token)
                .map(sharedFile -> {
                    File file = new File(sharedFile.getFilePath());
                    System.out.println("Trying to access file: " + sharedFile.getFilePath());

                    if (!file.exists()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
                    }

                    try {
                        // Convert file to Spring Resource
                        Resource resource = new FileSystemResource(file);

                        // Determine MIME type
                        String contentType = "application/octet-stream";
                        try {
                            contentType = Files.probeContentType(file.toPath());
                        } catch (IOException ignored) {}

                        // Increment download count
                        sharedFileService.incrementDownloadCount(sharedFile);

                        // Return file with proper headers
                        return ResponseEntity.ok()
                                .contentType(MediaType.parseMediaType(contentType))
                                .header(HttpHeaders.CONTENT_DISPOSITION,
                                        "attachment; filename=\"" + file.getName() + "\"")
                                .body(resource);

                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error serving file: " + e.getMessage());
                    }

                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.GONE)
                        .body("Link expired or download limit reached"));
    }

}
