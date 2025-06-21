package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.entity.SharedFile;
import com.stancloud.cloud_backend.repository.FileDataRepository;
import com.stancloud.cloud_backend.repository.SharedFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SharedFileService {

    private final SharedFileRepository sharedFileRepository;
    private final FileDataRepository fileRepository;

    public SharedFile createShareLinkByFileId(Long fileId, Integer downloadLimit, Integer expiryInHours) {
        var file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        SharedFile sharedFile = SharedFile.builder()
            .filePath("./uploads/" + file.getStoragePath()) // ✅ Ensure it starts with /uploads/
            .shareToken(UUID.randomUUID().toString())
            .downloadLimit(downloadLimit)
            .expiryTime(expiryInHours != null ? LocalDateTime.now().plusHours(expiryInHours) : null)
            .downloads(0)
            .build();


        return sharedFileRepository.save(sharedFile);
    }


    public Optional<SharedFile> getValidSharedFile(String token) {
        return sharedFileRepository.findByShareToken(token)
                .filter(sharedFile -> !sharedFile.isExpired());
    }

    public void incrementDownloadCount(SharedFile sharedFile) {
        sharedFile.setDownloads(sharedFile.getDownloads() + 1);
        sharedFileRepository.save(sharedFile);
    }
}
