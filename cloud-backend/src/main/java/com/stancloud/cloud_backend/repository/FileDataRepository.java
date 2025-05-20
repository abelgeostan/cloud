package com.stancloud.cloud_backend.repository;

import com.stancloud.cloud_backend.entity.FileData;
import com.stancloud.cloud_backend.entity.Folder;
import com.stancloud.cloud_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// FileDataRepository.java
public interface FileDataRepository extends JpaRepository<FileData, Long> {
    List<FileData> findAllByOwner(User user);
    List<FileData> findAllByOwnerAndFolder(User user, Folder folder);  // Changed parameter type
    List<FileData> findAllByOwnerAndFolderIsNull(User user);  // Only keep one version
    List<FileData> findByOwnerAndFolderId(User owner, Long folderId);
    List<FileData> findByOwnerAndFolderIsNull(User owner);
}
