package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

/**
 * Entidade que representa um endereço no sistema.
 * Contém informações completas de localização como logradouro, número,
 * bairro, CEP, cidade e tipo de endereço.
 * 
 * <p>Esta entidade está relacionada com {@link Pessoa}, {@link TipoLogradouro}
 * e {@link Cidade}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "ENDERECO")
@Data
public class Endereco {

    /**
     * Identificador único do endereço.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDENDERECO")
    private Integer idEndereco;

    /**
     * Tipo do endereço (comercial ou residencial).
     */
    @Column(name = "TIPOENDER", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoEndereco tipoEndereco;

    /**
     * Tipo de logradouro (Rua, Avenida, etc.).
     */
    @ManyToOne
    @JoinColumn(name = "ID_TIPOLOGRA", nullable = false)
    private TipoLogradouro tipoLogradouro;

    /**
     * Nome do logradouro.
     */
    @Column(name = "LOGRADOURO", nullable = false, length = 100)
    private String logradouro;

    /**
     * Número do endereço.
     */
    @Column(name = "NUMEENDER", nullable = false, length = 10)
    private String numero;

    /**
     * Complemento do endereço (apartamento, sala, etc.).
     */
    @Column(name = "COMPLEMENTO", length = 100)
    private String complemento;

    /**
     * Bairro do endereço.
     */
    @Column(name = "BAIRRO", nullable = false, length = 100)
    private String bairro;

    /**
     * CEP do endereço (8 dígitos).
     */
    @Column(name = "CEP", nullable = false, length = 8)
    private String cep;

    /**
     * Cidade do endereço.
     */
    @ManyToOne
    @JoinColumn(name = "ID_CIDADE", nullable = false)
    private Cidade cidade;

    /**
     * Pessoa proprietária do endereço.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PESSOA", nullable = false)
    private Pessoa pessoa;

    /**
     * Enum que define os tipos de endereço.
     */
    public enum TipoEndereco {
        /** Endereço Comercial */
        COM,
        /** Endereço Residencial */
        RES
    }
} 