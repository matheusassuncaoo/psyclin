package com.br.psyclin.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {
    public static final String TABLE_NAME = "user";
    
    @Id
    private Long id;
}
