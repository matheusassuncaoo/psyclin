package com.br.psyclin.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import java.util.List;

/**
 * Entidade que representa uma pessoa no sistema, podendo ser física ou jurídica.
 * Esta é a entidade base que contém informações comuns a todos os tipos de pessoa.
 * 
 * <p>A entidade Pessoa serve como base para {@link PessoaFisica} e {@link PessoaJuridica},
 * e possui relacionamentos com endereços, contatos e emails.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PESSOA")
@Data
public class Pessoa {

    /**
     * Identificador único da pessoa.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPESSOA")
    private Integer idPessoa;

    /**
     * Tipo da pessoa: F (Física) ou J (Jurídica).
     */
    @Column(name = "TIPOPESSOA", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoPessoa tipoPessoa;

    /**
     * Relacionamento com pessoa física (se aplicável).
     */
    @OneToOne(mappedBy = "pessoa", cascade = CascadeType.ALL)
    private PessoaFisica pessoaFisica;

    /**
     * Relacionamento com pessoa jurídica (se aplicável).
     */
    @OneToOne(mappedBy = "pessoa", cascade = CascadeType.ALL)
    private PessoaJuridica pessoaJuridica;

    /**
     * Lista de endereços da pessoa.
     */
    @OneToMany(mappedBy = "pessoa", cascade = CascadeType.ALL)
    private List<Endereco> enderecos;

    /**
     * Lista de contatos telefônicos da pessoa.
     */
    @OneToMany(mappedBy = "pessoa", cascade = CascadeType.ALL)
    private List<Contato> contatos;

    /**
     * Lista de emails da pessoa.
     */
    @OneToMany(mappedBy = "pessoa", cascade = CascadeType.ALL)
    private List<Email> emails;

    /**
     * Enum que define os tipos de pessoa no sistema.
     */
    public enum TipoPessoa {
        /** Pessoa Física */
        F,
        /** Pessoa Jurídica */
        J
    }
} 