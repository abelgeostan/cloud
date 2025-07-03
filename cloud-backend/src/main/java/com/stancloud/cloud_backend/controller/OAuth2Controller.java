package com.stancloud.cloud_backend.controller;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stancloud.cloud_backend.dto.AuthResponse;
import com.stancloud.cloud_backend.entity.User;
import com.stancloud.cloud_backend.repository.UserRepository;
import com.stancloud.cloud_backend.service.EmailService;
import com.stancloud.cloud_backend.service.JwtService;

import java.io.IOException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.oauth2.redirect}")
    private String frontendRedirectBase;

    @GetMapping("/success")
    public void getUserInfo(@AuthenticationPrincipal OAuth2User principal, HttpServletResponse response) throws IOException {
        if (principal == null) {
            response.sendRedirect(frontendRedirectBase.replace("/redirect", "/login?error=OAuth%20failed%20(no%20principal)"));
            return;
        }
        System.out.println("OAuth2 attributes: " + principal.getAttributes());

        String email = (String) principal.getAttributes().get("email");
        if (email == null) {
            response.sendRedirect(frontendRedirectBase.replace("/redirect", "/login?error=OAuth%20failed%20(no%20email)"));
            return;
        }

        try {
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
            } else {
                String randomUsername = "user_" + UUID.randomUUID().toString().substring(0, 8);
                String randomPassword = UUID.randomUUID().toString();
                user = User.builder()
                        .username(randomUsername)
                        .email(email)
                        .password(passwordEncoder.encode(randomPassword))
                        .role("USER")
                        .build();
                userRepository.save(user);
                emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
            }

            String token = jwtService.generateToken(user.getEmail());
            String frontendRedirectUrl = frontendRedirectBase + "?token=" + token + "&role=" + user.getRole();
            response.sendRedirect(frontendRedirectUrl);

        } catch (Exception e) {
            System.err.println("OAuth2 login error: " + e.getMessage());
            e.printStackTrace();
            response.sendRedirect(frontendRedirectBase.replace("/redirect", "/login?error=OAuth%20failed%20(" + e.getClass().getSimpleName() + ")"));
        }
    }
}