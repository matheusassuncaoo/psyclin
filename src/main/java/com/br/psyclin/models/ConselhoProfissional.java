package com.br.psyclin.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

/**
 * Entidade que representa um conselho profissional no sistema.
 * Contém informações sobre conselhos como CRM, CRP, CRO, etc.
 * 
 * <p>Esta entidade está relacionada com {@link Profissional}.</p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "CONSEPROFI")
@Data
public class ConselhoProfissional {

    /**
     * Identificador único do conselho profissional.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDCONSEPROFI")
    private Integer idConselhoProfissional;

    /**
     * Descrição completa do conselho (ex: Conselho Regional de Medicina).
     */
    @Column(name = "DESCRICAO", nullable = false, unique = true, length = 100)
    private String descricao;

    /**
     * Abreviação do conselho (ex: CRM, CRP, CRO).
     */
    @Column(name = "ABREVCONS", nullable = false, unique = true, length = 10)
    private String abreviacao;

    /**
     * Lista de profissionais registrados neste conselho.
     */
    @OneToMany(mappedBy = "conselhoProfissional")
    private List<Profissional> profissionais;
} 