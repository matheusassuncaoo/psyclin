package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "CONTATO")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDCONTATO")
    @EqualsAndHashCode.Include
    private Integer idContato;

    @NotNull(message = "Tipo de contato não pode ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TIPOCONTATO", referencedColumnName = "IDTIPOCONTATO", nullable = false)
    private TipoContato tipoContato;

    @Size(max = 12, message = "Número deve ter no máximo 12 caracteres")
    @Column(name = "NUMERO", length = 12)
    private String numero;

    @NotNull(message = "Pessoa não pode ser nula")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PESSOA", referencedColumnName = "IDPESSOA", nullable = false)
    private Pessoa pessoa;
    
}
