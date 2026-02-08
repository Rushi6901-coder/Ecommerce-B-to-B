package com.cdac.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/ContactQuery")
public class ContactQueryController {

    @GetMapping
    public ResponseEntity<?> getAllQueries() {
        return ResponseEntity.ok(new ArrayList<>());
    }
    @PostMapping
    public ResponseEntity<?> submitQuery(@RequestBody com.cdac.dto.ContactQueryDTO queryDTO) {
        // Logic to save query or send email
        System.out.println("Received Query: " + queryDTO);
        return ResponseEntity.ok("Query submitted successfully");
    }
}