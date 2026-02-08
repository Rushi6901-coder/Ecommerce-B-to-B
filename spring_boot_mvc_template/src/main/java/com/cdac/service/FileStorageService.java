package com.cdac.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // Store files in 'uploads' directory in the project root, not inside src/main/resources
    private final Path rootLocation = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file.");
            }
            
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path destinationFile = this.rootLocation.resolve(Paths.get(filename)).normalize().toAbsolutePath();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            
            // Return the relative path/URL for the DB
            // Assuming we serve static resources from /uploads/**
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.", e);
        }
    }

    public void delete(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) return;
        
        try {
            // Extract filename from URL (e.g. /uploads/abc.jpg -> abc.jpg)
            String filename = fileUrl.replace("/uploads/", "");
            Path file = rootLocation.resolve(filename);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            System.err.println("Could not delete file: " + fileUrl);
        }
    }
}
