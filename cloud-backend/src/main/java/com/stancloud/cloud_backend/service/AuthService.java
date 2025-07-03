package com.stancloud.cloud_backend.service;



import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stancloud.cloud_backend.dto.AuthRequest;
import com.stancloud.cloud_backend.dto.AuthResponse;
import com.stancloud.cloud_backend.dto.RegisterRequest;
import com.stancloud.cloud_backend.entity.User;
import com.stancloud.cloud_backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(
            token,
            user.getRole()
            );
    }

    public AuthResponse authenticate(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(
            token,
            user.getRole()
            );
    }
}