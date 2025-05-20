package com.stancloud.cloud_backend.dto;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileSimpleDTO {
    private Long id;
    private String filename;
    private String fileType;
    private Long fileSize;
    private String storagePath;
    private Long folderId; // Just include ID instead of whole folder
}