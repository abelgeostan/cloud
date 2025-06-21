package com.stancloud.cloud_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SharedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filePath;

    @Column(unique = true)
    private String shareToken;

    private Integer downloadLimit; // Optional
    private Integer downloads = 0;

    private LocalDateTime expiryTime; // Optional

    private LocalDateTime createdAt = LocalDateTime.now();

    public boolean isExpired() {
        return (expiryTime != null && LocalDateTime.now().isAfter(expiryTime)) ||
               (downloadLimit != null && downloads >= downloadLimit);
    }
}
