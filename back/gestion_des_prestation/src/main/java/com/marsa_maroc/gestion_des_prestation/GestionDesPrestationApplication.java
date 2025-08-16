package com.marsa_maroc.gestion_des_prestation;

import com.marsa_maroc.gestion_des_prestation.securityConfig.RsaConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GestionDesPrestationApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionDesPrestationApplication.class, args);
	}

}
