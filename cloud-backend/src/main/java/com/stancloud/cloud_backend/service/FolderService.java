package com.stancloud.cloud_backend.service;

import com.stancloud.cloud_backend.dto.*;
import com.stancloud.cloud_backend.entity.*;
import com.stancloud.cloud_backend.exception.*;
import com.stancloud.cloud_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    @Transactional
    public FolderDTO createFolder(CreateFolderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Folder parentFolder = null;
        if (request.getParentId() != null) {
            parentFolder = folderRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found"));
            
            // Verify the parent folder belongs to the same user
            if (!parentFolder.getOwner().getId().equals(user.getId())) {
                throw new AccessDeniedException("You don't have permission to access this parent folder");
            }
        }

        Folder folder = Folder.builder()
                .name(request.getName())
                .owner(user)
                .parent(parentFolder)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Folder savedFolder = folderRepository.save(folder);
        return convertToDTO(savedFolder);
    }

    @Transactional(readOnly = true)
    public List<FolderDTO.FolderSimpleDTO> listFolders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Folder> folders = folderRepository.findByOwnerAndParentIsNull(user);
        return folders.stream()
                .map(this::convertToSimpleDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FolderDTO getFolder(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));

        if (!folder.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to access this folder");
        }

        return convertToDTO(folder);
    }

    @Transactional
    public FolderDTO updateFolder(Long id, UpdateFolderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));

        if (!folder.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to modify this folder");
        }

        folder.setName(request.getName());
        folder.setUpdatedAt(Instant.now());
        Folder updatedFolder = folderRepository.save(folder);
        
        return convertToDTO(updatedFolder);
    }

    @Transactional
    public void deleteFolder(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));

        if (!folder.getOwner().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to delete this folder");
        }

        // Check if folder has subfolders
        if (!folder.getSubFolders().isEmpty()) {
            throw new OperationNotAllowedException("Cannot delete folder with subfolders");
        }

        folderRepository.delete(folder);
    }

    // DTO Conversion Methods
    public FolderDTO convertToDTO(Folder folder) {
        FolderDTO dto = new FolderDTO();
        dto.setId(folder.getId());
        dto.setName(folder.getName());
        dto.setCreatedAt(folder.getCreatedAt());
        dto.setUpdatedAt(folder.getUpdatedAt());
        
        if (folder.getParent() != null) {
            FolderDTO.FolderParentDTO parentDTO = new FolderDTO.FolderParentDTO();
            parentDTO.setId(folder.getParent().getId());
            parentDTO.setName(folder.getParent().getName());
            dto.setParent(parentDTO);
        }
        
        FolderDTO.UserDTO ownerDTO = new FolderDTO.UserDTO();
        ownerDTO.setId(folder.getOwner().getId());
        ownerDTO.setUsername(folder.getOwner().getUsername());
        ownerDTO.setEmail(folder.getOwner().getEmail());
        dto.setOwner(ownerDTO);
        
        dto.setSubFolders(folder.getSubFolders().stream()
            .map(this::convertToSimpleDTO)
            .collect(Collectors.toList()));
        
        return dto;
    }

    public FolderDTO.FolderSimpleDTO convertToSimpleDTO(Folder folder) {
        FolderDTO.FolderSimpleDTO simpleDTO = new FolderDTO.FolderSimpleDTO();
        simpleDTO.setId(folder.getId());
        simpleDTO.setName(folder.getName());
        simpleDTO.setCreatedAt(folder.getCreatedAt());
        return simpleDTO;
    }
}