package com.cdac.service;

import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

@Service
public class EncryptionService {

    private static final String SECRET_KEY = "MySuperSecretKey"; // In prod, store in env var (must be 16/24/32 chars)
    // Ensuring 16 bytes for AES-128
    private static final SecretKeySpec SECRET_KEY_SPEC = new SecretKeySpec(
            fixKeyLength(SECRET_KEY).getBytes(StandardCharsets.UTF_8), "AES");

    private static String fixKeyLength(String key) {
        if (key.length() < 16) {
            return String.format("%-16s", key).replace(' ', '0');
        }
        return key.substring(0, 16);
    }

    public String encrypt(String strToEncrypt) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, SECRET_KEY_SPEC);
            return Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException("Error while encrypting: " + e.toString());
        }
    }

    public String decrypt(String strToDecrypt) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, SECRET_KEY_SPEC);
            return new String(cipher.doFinal(Base64.getDecoder().decode(strToDecrypt)));
        } catch (Exception e) {
            throw new RuntimeException("Error while decrypting: " + e.toString());
        }
    }
}
