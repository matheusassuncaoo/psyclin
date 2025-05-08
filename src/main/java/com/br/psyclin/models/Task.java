package com.br.psyclin.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = Task.TABLE_NAME)
public class Task {
    public static final String TABLE_NAME = "Task";

    private Long id;
  
    
}
