package com.stancloud.cloud_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateFolderRequest {
    @NotBlank(message = "Folder name cannot be blank")
    @Size(max = 255, message = "Folder name must be less than 255 characters")
    private String name;
}