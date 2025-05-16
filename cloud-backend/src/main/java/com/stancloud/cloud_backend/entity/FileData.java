package com.stancloud.cloud_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String fileType;
    private Long fileSize;
    private String storagePath; // where it’s stored in the server

    @ManyToOne
    private User owner;

    @ManyToOne
    private Folder folder; // parent folder, null = root
}
