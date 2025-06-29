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
@AllArgsConstructor
@NoArgsConstructor
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