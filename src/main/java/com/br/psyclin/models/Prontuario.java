package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

/**
 * Entidade que representa um prontuário no sistema.
 * Contém informações sobre atendimentos realizados aos pacientes.
 * 
 * <p>Esta entidade está relacionada com {@link Paciente}, {@link Profissional},
 * {@link Especialidade}, {@link Procedimento} e {@link ProcPrescAte}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "PRONTUARIO")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Prontuario {

    /**
     * Identificador único do prontuário.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPRONTU")
    private Integer idProntuario;

    /**
     * Paciente do prontuário.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PACIENTE", nullable = false)
    private Paciente paciente;

    /**
     * Profissional responsável pelo prontuário.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PROFISSIO", nullable = false)
    private Profissional profissional;

    /**
     * Especialidade do atendimento.
     */
    @ManyToOne
    @JoinColumn(name = "ID_ESPEC", nullable = false)
    private Especialidade especialidade;

    /**
     * Procedimento realizado.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PROCED", nullable = false)
    private Procedimento procedimento;

    /**
     * Data do procedimento.
     */
    @Column(name = "DATAPROCED", nullable = false)
    private LocalDate dataProcedimento;

    /**
     * Descrição detalhada do prontuário.
     */
    @Column(name = "DESCRPRONTU", nullable = false, columnDefinition = "TEXT")
    private String descricaoProntuario;

    /**
     * Link para documentos relacionados ao procedimento.
     */
    @Column(name = "LINKPROCED", length = 250)
    private String linkProcedimento;

    /**
     * Autorização do paciente para visualização.
     */
    @Column(name = "AUTOPACVISU", nullable = false)
    private Boolean autorizacaoPacienteVisualizacao;

    /**
     * Lista de procedimentos prescritos atendidos neste prontuário.
     */
    @OneToMany(mappedBy = "prontuario")
    private List<ProcPrescAte> procedimentosPrescritosAtendidos;
} 