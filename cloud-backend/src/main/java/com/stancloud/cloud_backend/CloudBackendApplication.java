package com.stancloud.cloud_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CloudBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CloudBackendApplication.class, args);
	}

}
