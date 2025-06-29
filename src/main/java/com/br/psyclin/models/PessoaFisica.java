package com.br.psyclin.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidade que representa uma pessoa física no sistema.
 * Contém informações pessoais como CPF, nome, data de nascimento e sexo.
 * 
 * <p>Esta entidade está relacionada com {@link Pessoa} e pode ser associada
 * a {@link Paciente} ou {@link Profissional}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "PESSOAFIS")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PessoaFisica {

    /**
     * Identificador único da pessoa física.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPESSOAFIS")
    private Integer idPessoaFisica;

    /**
     * Relacionamento com a entidade Pessoa.
     */
    @OneToOne
    @JoinColumn(name = "ID_PESSOA", nullable = false, unique = true)
    @JsonBackReference
    private Pessoa pessoa;

    /**
     * CPF da pessoa física (11 dígitos).
     */
    @Column(name = "CPFPESSOA", nullable = false, unique = true, length = 11)
    private String cpfPessoa;

    /**
     * Nome completo da pessoa física.
     */
    @Column(name = "NOMEPESSOA", nullable = false, length = 100)
    private String nomePessoa;

    /**
     * Data de nascimento da pessoa física.
     */
    @Column(name = "DATANASCPES", nullable = false)
    private LocalDate dataNascimento;

    /**
     * Sexo da pessoa física.
     */
    @Column(name = "SEXOPESSOA", nullable = false)
    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    /**
     * Data e hora de criação do registro.
     */
    @Column(name = "DATACRIACAO", nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    /**
     * Relacionamento com paciente (se aplicável).
     */
    @OneToOne(mappedBy = "pessoaFisica")
    @JsonIgnore
    private Paciente paciente;

    /**
     * Relacionamento com profissional (se aplicável).
     */
    @OneToOne(mappedBy = "pessoaFisica")
    @JsonIgnore
    private Profissional profissional;

    /**
     * Enum que define os sexos disponíveis.
     */
    public enum Sexo {
        M, F;
    }
} 