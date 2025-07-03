package com.stancloud.cloud_backend.service;

import org.springframework.stereotype.Service;

import com.stancloud.cloud_backend.entity.VerificationToken;
import com.stancloud.cloud_backend.repository.VerificationTokenRepository;


import java.time.LocalDateTime;
import java.util.Random;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    public void generateOtp(String email) {
        // generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // create token with expiry
        VerificationToken token = tokenRepository.findByEmail(email)
            .orElse(new VerificationToken());
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiry(LocalDateTime.now().plusSeconds(60));
        token.setVerified(false);

        tokenRepository.save(token);

        // send email
        sendEmail(email, otp);
    }

    private void sendEmail(String to, String otp) {
        try {
            emailService.sendOtpEmail(to, otp);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean verifyOtp(String email, String otp) {
        VerificationToken token = tokenRepository.findByEmailAndOtp(email, otp)
            .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (token.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        token.setVerified(true);
        tokenRepository.save(token);
        return true;
    }

    public boolean isVerified(String email) {
        return tokenRepository.findByEmail(email)
            .map(VerificationToken::isVerified)
            .orElse(false);
    }
}

