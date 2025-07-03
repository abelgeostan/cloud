package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.entity.SharedFile;
import com.stancloud.cloud_backend.repository.FileDataRepository;
import com.stancloud.cloud_backend.repository.SharedFileRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SharedFileService {

    private final SharedFileRepository sharedFileRepository;
    private final FileDataRepository fileRepository;
    @Value("${file.upload-dir}")
    private String uploadDir; 

    public SharedFile createShareLinkByFileId(Long fileId, Integer downloadLimit, Integer expiryInHours) {
        var file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        SharedFile sharedFile = SharedFile.builder()
            .filePath(uploadDir + "/" + file.getStoragePath())
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

    @Scheduled(cron = "0 0 * * * *")
    public void deleteExpiredShares() {
        List<SharedFile> expiredFiles = sharedFileRepository.findAll().stream()
            .filter(SharedFile::isExpired)
            .toList();

        if (!expiredFiles.isEmpty()) {
            sharedFileRepository.deleteAll(expiredFiles);
            System.out.println("Deleted expired shared files: " + expiredFiles.size());
        }
    }
}
