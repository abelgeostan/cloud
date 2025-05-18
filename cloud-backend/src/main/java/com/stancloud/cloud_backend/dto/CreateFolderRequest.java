package com.stancloud.cloud_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFolderRequest {
    @NotBlank(message = "Folder name is required")
    @Size(max = 255, message = "Folder name must be less than 255 characters")
    private String name;
    
    private Long parentId; // null = root folder
}