package com.marsa_maroc;


import com.marsa_maroc.entities.AppUser;
import com.marsa_maroc.enumeration.Role;
import com.marsa_maroc.security_config.RsaConfig;
import com.marsa_maroc.servicies.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
@EnableConfigurationProperties(RsaConfig.class)
@EnableDiscoveryClient
public class DemoApplication {




    public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CommandLineRunner run(UserService userService) {
		return args -> {
			// Vérifie si l'utilisateur "root" existe déjà
			if (!userService.existsByUsername("root")) {
				userService.createUser(new AppUser(null, "root", "root", Role.ADMIN));
				System.out.println("Utilisateur root créé !");
			} else {
				System.out.println("Utilisateur root déjà existant.");
			}

			if (!userService.existsByUsername("user")) {
				userService.createUser(new AppUser(null, "user", "user", Role.USER));
				System.out.println("Utilisateur user créé !");
			} else {
				System.out.println("Utilisateur user déjà existant.");
			}
		};
	}


}
