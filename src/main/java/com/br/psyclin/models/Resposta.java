package com.br.psyclin.models;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entidade que representa uma resposta de anamnese no sistema.
 * Contém informações sobre respostas dadas pelos pacientes às perguntas.
 * 
 * <p>Esta entidade está relacionada com {@link Pergunta} e {@link Anamnese}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "RESPOSTA")
@Data
public class Resposta {

    /**
     * Identificador único da resposta.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDRESPOSTA")
    private Integer idResposta;

    /**
     * Pergunta respondida.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PERGUNTA", nullable = false)
    private Pergunta pergunta;

    /**
     * Anamnese à qual esta resposta pertence.
     */
    @ManyToOne
    @JoinColumn(name = "ID_ANAMNESE", nullable = false)
    private Anamnese anamnese;

    /**
     * Resposta subjetiva (texto livre).
     */
    @Column(name = "RESPSUBJET", columnDefinition = "TEXT")
    private String respostaSubjetiva;

    /**
     * Resposta objetiva (sim/não).
     */
    @Column(name = "RESPOBJET")
    private Boolean respostaObjetiva;
} 