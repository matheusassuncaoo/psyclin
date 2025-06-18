package com.br.psyclin.models;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entidade que representa um contato telefônico no sistema.
 * Contém informações sobre números de telefone das pessoas.
 * 
 * <p>Esta entidade está relacionada com {@link Pessoa} e {@link TipoContato}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "CONTATO")
@Data
public class Contato {

    /**
     * Identificador único do contato.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDCONTATO")
    private Integer idContato;

    /**
     * Tipo do contato (celular, fixo, etc.).
     */
    @ManyToOne
    @JoinColumn(name = "ID_TIPOCONTATO", nullable = false)
    private TipoContato tipoContato;

    /**
     * Número do telefone.
     */
    @Column(name = "NUMERO", length = 12)
    private String numero;

    /**
     * Pessoa proprietária do contato.
     */
    @ManyToOne
    @JoinColumn(name = "ID_PESSOA", nullable = false)
    private Pessoa pessoa;
} 