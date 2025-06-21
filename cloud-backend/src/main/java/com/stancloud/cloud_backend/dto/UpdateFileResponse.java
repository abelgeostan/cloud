package com.stancloud.cloud_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFileResponse {
    private Long id;
    private String newFilename;
    private String message;
}
