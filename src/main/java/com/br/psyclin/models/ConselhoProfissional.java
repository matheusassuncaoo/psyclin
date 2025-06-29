package com.br.psyclin.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Entidade que representa um conselho profissional no sistema.
 * Contém informações sobre conselhos como CRM, CRP, CRO, etc.
 * 
 * <p>
 * Esta entidade está relacionada com {@link Profissional}.
 * </p>
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Entity
@Table(name = "CONSEPROFI")
@AllArgsConstructor
@NoArgsConstructor
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