package com.stancloud.cloud_backend.repository;

import com.stancloud.cloud_backend.entity.FileData;
import com.stancloud.cloud_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileDataRepository extends JpaRepository<FileData, Long> {
    List<FileData> findAllByOwner(User user);
}
