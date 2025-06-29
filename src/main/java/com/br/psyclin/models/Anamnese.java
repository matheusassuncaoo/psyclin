package com.br.psyclin.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidade que representa uma anamnese no sistema.
 * Contém informações sobre a avaliação inicial do paciente, incluindo
 * dados do responsável e autorizações.
 * 
 * <p>Esta entidade está relacionada com {@link Paciente} e {@link Profissional},
 * e possui relacionamentos com {@link Resposta} e {@link ProcPresc}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "ANAMNESE")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Anamnese {

    /**
     * Identificador único da anamnese.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDANAMNESE")
    private Integer idAnamnese;

    /**
     * Paciente da anamnese.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PACIENTE", nullable = false)
    @JsonBackReference
    private Paciente paciente;

    /**
     * Profissional que realizou a anamnese.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PROFISSIO", nullable = false)
    @JsonBackReference
    private Profissional profissional;

    /**
     * Data e hora da anamnese.
     */
    @Column(name = "DATAANAM", nullable = false)
    private LocalDateTime dataAnamnese;

    /**
     * Nome do responsável (se aplicável).
     */
    @Column(name = "NOMERESP", length = 100)
    private String nomeResponsavel;

    /**
     * CPF do responsável (se aplicável).
     */
    @Column(name = "CPFRESP", length = 11)
    private String cpfResponsavel;

    /**
     * Autorização para visualização.
     */
    @Column(name = "AUTVISIB", nullable = false)
    private Boolean autorizacaoVisualizacao;

    /**
     * Status da anamnese.
     */
    @Column(name = "STATUSANM", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusAnamnese statusAnamnese;

    /**
     * Status funcional da anamnese.
     */
    @Column(name = "STATUSFUNC", nullable = false)
    private Boolean statusFuncional;

    /**
     * Observações adicionais.
     */
    @Column(name = "OBSERVACOES", columnDefinition = "TEXT")
    private String observacoes;

    /**
     * Lista de respostas da anamnese.
     */
    @OneToMany(mappedBy = "anamnese")
    @JsonIgnore
    private List<Resposta> respostas;

    /**
     * Lista de procedimentos prescritos na anamnese.
     */
    @OneToMany(mappedBy = "anamnese")
    @JsonIgnore
    private List<ProcPresc> procedimentosPrescritos;

    /**
     * Enum para o status da anamnese.
     */
    public enum StatusAnamnese {
        APROVADO, REPROVADO, CANCELADO;
    }
} 