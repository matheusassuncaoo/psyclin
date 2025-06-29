package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Entidade que representa os tipos de contato no sistema.
 * Contém informações sobre os diferentes tipos de contato telefônico
 * como Celular, Fixo, WhatsApp, etc.
 * 
 * <p>Esta entidade está relacionada com {@link Contato}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "TIPOCONTATO")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TipoContato {

    /**
     * Identificador único do tipo de contato.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDTIPOCONTATO")
    private Integer idTipoContato;

    /**
     * Nome do tipo de contato (ex: Celular, Fixo, WhatsApp).
     */
    @Column(name = "TIPO", nullable = false, unique = true, length = 20)
    private String tipo;

    /**
     * Lista de contatos que utilizam este tipo.
     */
    @OneToMany(mappedBy = "tipoContato")
    private List<Contato> contatos;
} 