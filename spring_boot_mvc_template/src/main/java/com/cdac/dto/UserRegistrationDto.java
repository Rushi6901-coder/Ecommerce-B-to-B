package com.cdac.dto;

import com.cdac.entity.Role;
import lombok.Data;

@Data
public class UserRegistrationDto {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String phone;
    private String address;
}
