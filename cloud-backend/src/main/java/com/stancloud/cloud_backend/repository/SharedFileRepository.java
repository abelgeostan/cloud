package com.stancloud.cloud_backend.repository;

import com.stancloud.cloud_backend.entity.SharedFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SharedFileRepository extends JpaRepository<SharedFile, Long> {
    Optional<SharedFile> findByShareToken(String token);
}
