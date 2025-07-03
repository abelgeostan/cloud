package com.stancloud.cloud_backend.controller;

import com.stancloud.cloud_backend.dto.*;
import com.stancloud.cloud_backend.service.AuthService;
import com.stancloud.cloud_backend.service.VerificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final VerificationService verificationService;



    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        // 1. Verify OTP directly
        verificationService.verifyOtp(request.getEmail(), request.getOtp());

        // 2. Register user only if OTP is valid
        return ResponseEntity.ok(authService.register(request));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/generate-otp")
    public ResponseEntity<String> generateOtp(@RequestParam String email) {
        verificationService.generateOtp(email);
        return ResponseEntity.ok("OTP sent to email");
    }

    // @PostMapping("/verify-otp")
    // public ResponseEntity<String> verifyOtp(
    //     @RequestParam String email,
    //     @RequestParam String otp) {
    //     verificationService.verifyOtp(email, otp);
    //     return ResponseEntity.ok("Email verified");
    // }
}