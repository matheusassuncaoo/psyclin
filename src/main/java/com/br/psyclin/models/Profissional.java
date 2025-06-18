package com.br.psyclin.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToMany;

import lombok.Data;
import java.util.List;

/**
 * Entidade que representa um profissional de saúde no sistema.
 * Contém informações sobre tipo, status, supervisor e conselho profissional.
 * 
 * <p>Esta entidade está relacionada com {@link PessoaFisica} e possui
 * relacionamentos com {@link ConselhoProfissional} e {@link Especialidade}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PROFISSIONAL")
@Data
public class Profissional {

    /**
     * Identificador único do profissional.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROFISSIO")
    private Integer idProfissional;

    /**
     * Relacionamento com pessoa física.
     */
    @OneToOne
    @JoinColumn(name = "ID_PESSOAFIS", nullable = false, unique = true)
    private PessoaFisica pessoaFisica;

    /**
     * Tipo do profissional.
     */
    @Column(name = "TIPOPROFI", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoProfissional tipoProfissional;

    /**
     * Profissional supervisor (se aplicável).
     */
    @ManyToOne
    @JoinColumn(name = "ID_SUPPROFI")
    private Profissional supervisor;

    /**
     * Status do profissional.
     */
    @Column(name = "STATUSPROFI")
    @Enumerated(EnumType.STRING)
    private StatusProfissional statusProfissional;

    /**
     * Conselho profissional.
     */
    @ManyToOne
    @JoinColumn(name = "ID_CONSEPROFI", nullable = false)
    private ConselhoProfissional conselhoProfissional;

    /**
     * Lista de especialidades do profissional.
     */
    @ManyToMany
    @JoinTable(
        name = "PROFI_ESPEC",
        joinColumns = @JoinColumn(name = "ID_PROFISSIO"),
        inverseJoinColumns = @JoinColumn(name = "ID_ESPEC")
    )
    private List<Especialidade> especialidades;

    /**
     * Lista de profissionais subordinados.
     */
    @OneToMany(mappedBy = "supervisor")
    private List<Profissional> subordinados;

    /**
     * Enum para o tipo de profissional.
     */
    public enum TipoProfissional {
        /** Tipo 1 */
        _1,
        /** Tipo 2 */
        _2,
        /** Tipo 3 */
        _3,
        /** Tipo 4 */
        _4
    }

    /**
     * Enum para o status do profissional.
     */
    public enum StatusProfissional {
        /** Status 1 */
        _1,
        /** Status 2 */
        _2,
        /** Status 3 */
        _3
    }
}