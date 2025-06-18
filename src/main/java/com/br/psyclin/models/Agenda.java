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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidade que representa um agendamento no sistema.
 * Contém informações sobre consultas e procedimentos agendados.
 * 
 * <p>Esta entidade está relacionada com {@link PessoaFisica}, {@link Profissional},
 * {@link Procedimento} e {@link ProcPrescAge}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "AGENDA")
@Data
public class Agenda {

    /**
     * Identificador único do agendamento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDAGENDA")
    private Integer idAgenda;

    /**
     * Paciente agendado (pessoa física).
     */
    @ManyToOne
    @JoinColumn(name = "ID_PESSOAFIS")
    private PessoaFisica pessoaFisica;

    /**
     * Profissional responsável pelo agendamento.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PROFISSIO", nullable = false)
    private Profissional profissional;

    /**
     * Procedimento agendado.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PROCED", nullable = false)
    private Procedimento procedimento;

    /**
     * Descrição complementar do agendamento.
     */
    @Column(name = "DESCRCOMP", length = 250)
    private String descricaoComplementar;

    /**
     * Nova data do agendamento (se reagendado).
     */
    @Column(name = "DATANOVA")
    private LocalDateTime dataNova;

    /**
     * Data de abertura do agendamento.
     */
    @Column(name = "DATAABERT", nullable = false)
    private LocalDateTime dataAbertura;

    /**
     * Situação do agendamento.
     */
    @Column(name = "SITUAGEN", nullable = false)
    @Enumerated(EnumType.STRING)
    private SituacaoAgenda situacaoAgenda = SituacaoAgenda.AGUARDANDO;

    /**
     * Motivo do cancelamento (se aplicável).
     */
    @Column(name = "MOTCANC", length = 100)
    private String motivoCancelamento;

    /**
     * Lista de procedimentos prescritos agendados.
     */
    @OneToMany(mappedBy = "agenda")
    private List<ProcPrescAge> procedimentosPrescritos;

    /**
     * Enum que define as situações do agendamento.
     */
    public enum SituacaoAgenda {
        /** Agendamento aguardando atendimento */
        AGUARDANDO,
        /** Agendamento atendido */
        ATENDIDO,
        /** Agendamento cancelado */
        CANCELADO
    }
} 