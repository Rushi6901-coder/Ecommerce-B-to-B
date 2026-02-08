package com.cdac.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    @PostMapping("/encode")
    public String encodePassword(@RequestParam String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    @PostMapping("/validate")
    public boolean validatePassword(@RequestParam String rawPassword, @RequestParam String encodedPassword) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(rawPassword, encodedPassword);
    }
}
