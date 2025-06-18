package com.br.psyclin.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Entidade que representa uma pessoa jurídica no sistema.
 * Contém informações empresariais como CNPJ, razão social e nome fantasia.
 * 
 * <p>Esta entidade está relacionada com {@link Pessoa} e pode ser utilizada
 * para representar empresas, clínicas, hospitais, etc.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PESSOAJUR")
@Data
public class PessoaJuridica {

    /**
     * Identificador único da pessoa jurídica.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPESSOAJUR")
    private Integer idPessoaJuridica;

    /**
     * Relacionamento com a entidade Pessoa.
     */
    @OneToOne
    @JoinColumn(name = "ID_PESSOA", nullable = false, unique = true)
    private Pessoa pessoa;

    /**
     * CNPJ da pessoa jurídica (14 dígitos).
     */
    @Column(name = "CNPJ", nullable = false, unique = true, length = 14)
    private String cnpj;

    /**
     * Razão social da empresa.
     */
    @Column(name = "RAZSOCIAL", nullable = false, length = 100)
    private String razaoSocial;

    /**
     * Nome fantasia da empresa.
     */
    @Column(name = "NOMEFAN", nullable = false, length = 100)
    private String nomeFantasia;

    /**
     * Código CNAE da empresa (7 dígitos).
     */
    @Column(name = "CNAE", length = 7)
    private String cnae;

    /**
     * Data e hora de criação do registro.
     */
    @Column(name = "DATACRIACAO", nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();
} 