package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Entidade que representa uma pergunta de anamnese no sistema.
 * Contém informações sobre perguntas utilizadas em avaliações médicas.
 * 
 * <p>Esta entidade está relacionada com {@link Modulo} e {@link Resposta}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "PERGUNTA")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Pergunta {

    /**
     * Identificador único da pergunta.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPERGUNTA")
    private Integer idPergunta;

    /**
     * Texto da pergunta.
     */
    @Column(name = "PERGUNTA", nullable = false, unique = true, length = 255)
    private String pergunta;

    /**
     * Tipo da pergunta (objetiva, subjetiva ou ambas).
     */
    @Column(name = "TIPO", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoPergunta tipo;

    /**
     * Lista de módulos que utilizam esta pergunta.
     */
    @ManyToMany
    @JoinTable(
        name = "PERGMODU",
        joinColumns = @JoinColumn(name = "ID_PERGUNTA"),
        inverseJoinColumns = @JoinColumn(name = "ID_MODULO")
    )
    private List<Modulo> modulos;

    /**
     * Lista de respostas para esta pergunta.
     */
    @OneToMany(mappedBy = "pergunta")
    private List<Resposta> respostas;

    /**
     * Enum que define os tipos de pergunta.
     */
    public enum TipoPergunta {
        O, S, A;
    }
} 