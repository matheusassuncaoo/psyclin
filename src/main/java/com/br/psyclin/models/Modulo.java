package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Entidade que representa um módulo de anamnese no sistema.
 * Contém informações sobre módulos como Comum, Fisioterapia, Psicologia, etc.
 * 
 * <p>Esta entidade está relacionada com {@link Pergunta}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "MODULO")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Modulo {

    /**
     * Identificador único do módulo.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDMODULO")
    private Integer idModulo;

    /**
     * Nome do módulo (ex: Comum, Fisioterapia, Psicologia).
     */
    @Column(name = "MODULO", nullable = false, unique = true, length = 50)
    private String modulo;

    /**
     * Lista de perguntas que pertencem a este módulo.
     */
    @ManyToMany(mappedBy = "modulos")
    private List<Pergunta> perguntas;
} 