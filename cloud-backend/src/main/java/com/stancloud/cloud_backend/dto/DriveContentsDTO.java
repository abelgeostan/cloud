package com.stancloud.cloud_backend.dto;
import java.util.List;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriveContentsDTO {
    private List<FolderSimpleDTO> folders;
    private List<FileSimpleDTO> files;
}