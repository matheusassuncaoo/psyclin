package com.br.psyclin.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

/**
 * Entidade que representa um procedimento prescrito em anamnese.
 * Contém informações sobre procedimentos prescritos pelos profissionais.
 * 
 * <p>Esta entidade está relacionada com {@link Anamnese}, {@link Procedimento},
 * {@link ProcPrescAge} e {@link ProcPrescAte}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PROCPRESC")
@Data
public class ProcPresc {

    /**
     * Identificador único do procedimento prescrito.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROCPRESC")
    private Integer idProcPresc;

    /**
     * Anamnese na qual o procedimento foi prescrito.
     */
    @ManyToOne
    @JoinColumn(name = "ID_ANAMNESE", nullable = false)
    private Anamnese anamnese;

    /**
     * Procedimento prescrito.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PROCED", nullable = false)
    private Procedimento procedimento;

    /**
     * Quantidade do procedimento prescrito.
     */
    @Column(name = "PROCEDQTD", nullable = false)
    private Integer quantidadeProcedimento;

    /**
     * Caminho para imagem do procedimento.
     */
    @Column(name = "IMAGEMPROC", length = 250)
    private String imagemProcedimento;

    /**
     * Orientações sobre o procedimento.
     */
    @Column(name = "ORIENTACAO", length = 250)
    private String orientacao;

    /**
     * Lista de agendamentos para este procedimento.
     */
    @OneToMany(mappedBy = "procPresc")
    private List<ProcPrescAge> agendamentos;

    /**
     * Lista de atendimentos deste procedimento.
     */
    @OneToMany(mappedBy = "procPresc")
    private List<ProcPrescAte> atendimentos;
} 