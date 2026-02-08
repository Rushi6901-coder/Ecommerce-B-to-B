package com.cdac.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private String photo;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Category category;
}
