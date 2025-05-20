package com.stancloud.cloud_backend.repository;

import com.stancloud.cloud_backend.entity.Folder;
import com.stancloud.cloud_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// FolderRepository.java
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findAllByOwner(User user);
    List<Folder> findByOwnerAndParent(User owner, Folder parent);  // Changed parameter type
    List<Folder> findByOwnerAndParentIsNull(User owner);
    List<Folder> findByOwnerAndParentId(User owner, Long folderId);
}
