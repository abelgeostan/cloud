package com.stancloud.cloud_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stancloud.cloud_backend.entity.VerificationToken;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long>{
    Optional<VerificationToken> findByEmailAndOtp(String email, String otp);
    Optional<VerificationToken> findByEmail(String email);
    void deleteByEmail(String email);
}
