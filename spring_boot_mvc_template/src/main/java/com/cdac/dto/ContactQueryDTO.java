package com.cdac.dto;

import lombok.Data;

@Data
public class ContactQueryDTO {
    private String name;
    private String email;
    private String subject;
    private String message;
}
