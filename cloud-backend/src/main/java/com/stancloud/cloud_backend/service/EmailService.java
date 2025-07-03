package com.stancloud.cloud_backend.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class EmailService {

    private RestTemplate restTemplate = new RestTemplate();

    private String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
    @Value("${brevo.api.key}")
    private String BREVO_API_KEY; // put in env for real apps!

    public void sendOtpEmail(String toEmail, String otp) {
        String body = """
            {
              "sender": {
                "name": "StanDrive",
                "email": "geostandrive@gmail.com"
              },
              "to": [
                {
                  "email": "%s",
                  "name": "User"
                }
              ],
              "subject": "Your OTP Code",
              "htmlContent": "<html><body><h3>Your OTP is <strong>%s</strong></h3></body></html>"
            }
        """.formatted(toEmail, otp);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", BREVO_API_KEY);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, request, String.class);

        System.out.println("Brevo response: " + response.getStatusCode() + " " + response.getBody());
    }

    public void sendWelcomeEmail(String toEmail, String username) {
        String body = """
            {
            "sender": {
                "name": "StanDrive",
                "email": "geostandrive@gmail.com"
            },
            "to": [
                {
                "email": "%s",
                "name": "%s"
                }
            ],
            "subject": "Welcome to StanDrive",
            "htmlContent": "<html><body><h2>Welcome, %s!</h2><p>Thanks for signing up for StanDrive. We're glad to have you!</p></body></html>"
            }
        """.formatted(toEmail, username, username);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", BREVO_API_KEY);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, request, String.class);

        System.out.println("Brevo response (welcome): " + response.getStatusCode() + " " + response.getBody());
    }

}
