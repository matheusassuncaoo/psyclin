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
@Table(name = "TIPOLOGRADO")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TipoLogrado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDTIPOLOGRA")
    @EqualsAndHashCode.Include
    private Integer idTipoLogra;

    @NotBlank(message = "Tipo não pode ser vazio")
    @Size(max = 20, message = "Tipo deve ter no máximo 20 caracteres")
    @Column(name = "TIPO", length = 20, nullable = false, unique = true)
    private String tipo;

    // Relacionamento inverso com Endereco (se necessário, mas geralmente não é)
    // @OneToMany(mappedBy = "tipoLogrado")
    // private List<Endereco> enderecos;
}
