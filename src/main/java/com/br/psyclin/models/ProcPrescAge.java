package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidade que representa o agendamento de um procedimento prescrito.
 * Faz a ligação entre procedimentos prescritos e agendamentos.
 * 
 * <p>Esta entidade está relacionada com {@link ProcPresc} e {@link Agenda}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PROCPRESCAGE")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProcPrescAge {

    /**
     * Identificador único do agendamento de procedimento prescrito.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROCPRESCAGE")
    private Integer idProcPrescAge;

    /**
     * Procedimento prescrito agendado.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PROCPRESC", nullable = false)
    private ProcPresc procPresc;

    /**
     * Agendamento associado.
     */
    @ManyToOne
    @JoinColumn(name = "ID_AGENDA", nullable = false)
    private Agenda agenda;
} 