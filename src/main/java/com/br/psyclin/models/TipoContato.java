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
@Table(name = "TIPOCONTATO")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TipoContato {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDTIPOCONTATO")
    @EqualsAndHashCode.Include
    private Integer idTipoContato;

    @NotBlank(message = "Tipo não pode ser vazio")
    @Size(max = 20, message = "Tipo deve ter no máximo 20 caracteres")
    @Column(name = "TIPO", length = 20, nullable = false, unique = true)
    private String tipo;

    // Relacionamento inverso com Contato (se necessário)
    // @OneToMany(mappedBy = "tipoContato")
    // private List<Contato> contatos;

}
