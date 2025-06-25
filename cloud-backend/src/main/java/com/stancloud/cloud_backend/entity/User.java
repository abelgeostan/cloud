package com.stancloud.cloud_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role;  //"USER", "ADMIN"

    @Column(nullable = false)
    @Builder.Default
    private Long storageUsed = 0L; // in bytes

    @Builder.Default
    @Column(nullable = false)
    private Long storageLimit = 5 * 1024 * 1024L; // 100 MB default

    @Builder.Default
    @Column(nullable = false)
    private boolean verified = false;

}