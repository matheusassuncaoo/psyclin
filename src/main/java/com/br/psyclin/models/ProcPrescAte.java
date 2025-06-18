package com.br.psyclin.models;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entidade que representa o atendimento de um procedimento prescrito.
 * Faz a ligação entre procedimentos prescritos e prontuários.
 * 
 * <p>Esta entidade está relacionada com {@link ProcPresc} e {@link Prontuario}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PROCPRESCATE")
@Data
public class ProcPrescAte {

    /**
     * Identificador único do atendimento de procedimento prescrito.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROCPRESCATE")
    private Integer idProcPrescAte;

    /**
     * Procedimento prescrito atendido.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PROCPRESC", nullable = false)
    private ProcPresc procPresc;

    /**
     * Prontuário do atendimento.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PRONTU", nullable = false)
    private Prontuario prontuario;

    /**
     * Status do atendimento (realizado ou não).
     */
    @Column(name = "STATUSATE", nullable = false)
    private Boolean statusAtendimento = false;
} 