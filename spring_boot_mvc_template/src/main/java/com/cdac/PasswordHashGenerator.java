package com.cdac;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = args.length > 0 ? args[0] : "hello";
        String hash = encoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("Hash: " + hash);
        System.out.println("\nUse this hash in your database:");
        System.out.println("UPDATE users SET password='" + hash + "' WHERE email='admin@b2b.com';");
    }
}
