package com.stancloud.cloud_backend.dto;

import java.time.Instant;
import java.util.List;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FolderDTO {
    private Long id;
    private String name;
    private Instant createdAt;
    private Instant updatedAt;
    private FolderParentDTO parent;
    private UserDTO owner;
    private List<FolderSimpleDTO> subFolders;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FolderParentDTO {
        private Long id;
        private String name;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FolderSimpleDTO {
        private Long id;
        private String name;
        private Instant createdAt;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private Long id;
        private String username;
        private String email;
        // Exclude password!
    }
}