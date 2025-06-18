package com.br.psyclin.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

/**
 * Entidade que representa uma especialidade médica no sistema.
 * Contém informações sobre especialidades como Cardiologia, Neurologia, etc.
 * 
 * <p>Esta entidade está relacionada com {@link Profissional} e {@link Procedimento}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "ESPECIALIDADE")
@Data
public class Especialidade {

    /**
     * Identificador único da especialidade.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDESPEC")
    private Integer idEspecialidade;

    /**
     * Código da especialidade (2 caracteres).
     */
    @Column(name = "CODESPEC", nullable = false, unique = true, length = 2)
    private String codEspecialidade;

    /**
     * Descrição da especialidade.
     */
    @Column(name = "DESCESPEC", length = 100)
    private String descricao;

    /**
     * Lista de profissionais desta especialidade.
     */
    @ManyToMany(mappedBy = "especialidades")
    private List<Profissional> profissionais;

    /**
     * Lista de procedimentos desta especialidade.
     */
    @ManyToMany(mappedBy = "especialidades")
    private List<Procedimento> procedimentos;
} 