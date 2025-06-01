package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "CONSEPROFI")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Conseprofi {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDCONSEPROFI")
    @EqualsAndHashCode.Include
    private Integer idConseprofi;

    @NotBlank(message = "Descrição não pode ser vazia")
    @Size(max = 100, message = "Descrição deve ter no máximo 100 caracteres")
    @Column(name = "DESCRICAO", length = 100, nullable = false, unique = true)
    private String descricao;

    @NotBlank(message = "Abreviação não pode ser vazia")
    @Size(max = 10, message = "Abreviação deve ter no máximo 10 caracteres")
    @Column(name = "ABREVCONS", length = 10, nullable = false, unique = true)
    private String abrevCons;

    // Relacionamento inverso com Profissional (se necessário)
    // @OneToMany(mappedBy = "conseprofi")
    // private List<Profissional> profissionais;
}
