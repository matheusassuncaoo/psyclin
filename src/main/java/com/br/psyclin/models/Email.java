package com.br.psyclin.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade que representa um email no sistema.
 * Contém informações sobre endereços de email das pessoas.
 * 
 * <p>Esta entidade está relacionada com {@link Pessoa}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "EMAIL")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Email {

    /**
     * Identificador único do email.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDEMAIL")
    private Integer idEmail;

    /**
     * Endereço de email.
     */
    @Column(name = "EMAIL", nullable = false, length = 100)
    private String email;

    /**
     * Pessoa proprietária do email.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PESSOA", nullable = false)
    private Pessoa pessoa;
} 