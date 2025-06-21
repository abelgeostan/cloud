package com.stancloud.cloud_backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Not strictly needed for CORS in this config, but often useful
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration; // Import CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Import UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter; // Import CorsFilter (optional, but good for clarity)
import com.stancloud.cloud_backend.filter.JwtAuthFilter;
import com.stancloud.cloud_backend.service.UserDetailsServiceImpl;

import java.util.Arrays; // Import Arrays for List creation

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // **CRUCIAL: Apply CORS configuration**
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless APIs (common with JWT)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**","/api/share/**").permitAll() // Allow authentication endpoints without auth and share endpoints
                // Allow OPTIONS requests (CORS preflight) for all authenticated paths
                // Browsers send an OPTIONS request before the actual GET/POST/PUT/DELETE
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/folders/**").authenticated() // Secure folders API
                .anyRequest().authenticated() // All other requests require authentication
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // This bean defines the CORS configuration for Spring Security
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Allow cookies, authorization headers, etc.
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173","https://drive.brethren.in","http://192.168.1.123:3001")); // Your frontend origin
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); // Allowed headers (crucial for JWT)
        source.registerCorsConfiguration("/**", config); // Apply this config to all paths
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}