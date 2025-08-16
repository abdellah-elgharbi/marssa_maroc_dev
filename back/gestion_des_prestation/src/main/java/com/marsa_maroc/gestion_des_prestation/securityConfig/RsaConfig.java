package com.marsa_maroc.gestion_des_prestation.securityConfig;

import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class RsaConfig {

    private RSAPublicKey publicKey;

    // Votre clé publique directement dans le code (temporaire pour tester)
    private static final String PUBLIC_KEY_STRING = """
        MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoz/VTR3jc9JFzg4s+EV6
        8hqfpE1R7Rwp0FUP7E1pstHNBagJv7yWs9To5aasqa/VQY4nIbqnyrDTwv/tWglq
        AEZr2EjmHQf1STA8Qn6xXNZK/pPeXu+T1y0/uIp5v3xMlihiJH5OBYU8FHLcMCKz
        yAnTdXRkSuISsoSSP0dA/ep58C9YBBDNHUOaODMyqoO/Pa8HOGUdOERUcUGNPSUN
        DF5VeCob2VOTxx62Tb/jSFr0S0u5AYTdORuNW5GMrzV7yC38XfWNK+x/TmU9f+XO
        pwSo/UtIIcrk/3urHJVje6oKo5SZlR0MRcPb6ke1e1BonKCJEftoF+9p5qoTBDSl
        pwIDAQAB
        """;

    @PostConstruct
    public void loadKey() throws Exception {
        System.out.println("🔍 Loading RSA key from hardcoded string...");

        try {
            // Remove any whitespace and newlines
            String cleanedKey = PUBLIC_KEY_STRING.replaceAll("\\s", "");

            System.out.println("🔍 Cleaned key length: " + cleanedKey.length());

            // Decode and create RSAPublicKey
            byte[] keyBytes = Base64.getDecoder().decode(cleanedKey);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            this.publicKey = (RSAPublicKey) keyFactory.generatePublic(spec);

            System.out.println("✅ RSA Public key loaded successfully from hardcoded string!");

        } catch (Exception e) {
            System.err.println("❌ Error loading public key: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public RSAPublicKey getPublicKey() {
        if (publicKey == null) {
            throw new IllegalStateException("Public key not loaded yet");
        }
        return publicKey;
    }
}