package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import java.util.List;

/**
 * Entidade que representa os tipos de logradouro no sistema.
 * Contém informações sobre os diferentes tipos de vias públicas
 * como Rua, Avenida, Travessa, etc.
 * 
 * <p>Esta entidade está relacionada com {@link Endereco}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "TIPOLOGRADO")
@Data
public class TipoLogradouro {

    /**
     * Identificador único do tipo de logradouro.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDTIPOLOGRA")
    private Integer idTipoLogradouro;

    /**
     * Nome do tipo de logradouro (ex: Rua, Avenida, Travessa).
     */
    @Column(name = "TIPO", nullable = false, unique = true, length = 20)
    private String tipo;

    /**
     * Lista de endereços que utilizam este tipo de logradouro.
     */
    @OneToMany(mappedBy = "tipoLogradouro")
    private List<Endereco> enderecos;
} 