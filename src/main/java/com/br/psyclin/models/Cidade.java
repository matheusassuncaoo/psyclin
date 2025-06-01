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
@Table(name = "CIDADE")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Cidade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDCIDADE")
    @EqualsAndHashCode.Include
    private Integer idCidade;

    @NotBlank(message = "Nome da cidade não pode ser vazio")
    @Size(max = 100, message = "Nome da cidade deve ter no máximo 100 caracteres")
    @Column(name = "CIDADE", length = 100, nullable = false)
    private String nomeCidade;

    @NotBlank(message = "Estado não pode ser vazio")
    @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres")
    @Column(name = "ESTADO", length = 2, nullable = false)
    private String estado;

    // Relacionamento inverso com Endereco (se necessário)
    // @OneToMany(mappedBy = "cidade")
    // private List<Endereco> enderecos;
}
