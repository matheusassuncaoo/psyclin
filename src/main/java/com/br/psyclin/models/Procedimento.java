package com.br.psyclin.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * Entidade que representa um procedimento médico no sistema.
 * Contém informações sobre procedimentos como consultas, exames, cirurgias, etc.
 * 
 * <p>Esta entidade está relacionada com {@link Especialidade}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PROCEDIMENTO")
@Data
public class Procedimento {

    /**
     * Identificador único do procedimento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROCED")
    private Integer idProcedimento;

    /**
     * Código do procedimento (8 caracteres).
     */
    @Column(name = "CODPROCED", nullable = false, unique = true, length = 8)
    private String codProcedimento;

    /**
     * Descrição do procedimento.
     */
    @Column(name = "DESCRPROC", nullable = false, length = 250)
    private String descricao;

    /**
     * Valor do procedimento.
     */
    @Column(name = "VALORPROC", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    /**
     * Lista de especialidades que realizam este procedimento.
     */
    @ManyToMany
    @JoinTable(
        name = "ESPECPROCED",
        joinColumns = @JoinColumn(name = "ID_PROCED"),
        inverseJoinColumns = @JoinColumn(name = "ID_ESPEC")
    )
    private List<Especialidade> especialidades;
} 