package com.br.psyclin.models;

import java.util.List;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "PESSOA")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPESSOA")
    @EqualsAndHashCode.Include
    private Integer idPessoa;

    @NotNull(message = "Tipo de pessoa não pode ser nulo")
    @Enumerated(EnumType.STRING)
    @Column(name = "TIPOPESSOA", nullable = false, length = 1)
    private TipoPessoa tipoPessoa; // Enum 'F' ou 'J'

    // Relacionamento com PessoaFis (um para um)
    // mappedBy indica que a chave estrangeira está na outra entidade (PessoaFis)
    @OneToOne(mappedBy = "pessoa", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private PessoaFis pessoaFis;

    // Relacionamento com PessoaJur (um para um) - Adicionar se necessário
    // @OneToOne(mappedBy = "pessoa", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    // private PessoaJur pessoaJur;

     // Relacionamento com Endereco (um para muitos)
    @OneToMany(mappedBy = "pessoa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Endereco> enderecos;

    // Relacionamento com Contato (um para muitos)
    @OneToMany(mappedBy = "pessoa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Contato> contatos;

    // Relacionamento com Email (um para muitos)
    @ElementCollection
    @Column(name = "EMAIL")
    private List<@Email String> emails;

    // Enum para TipoPessoa
    public enum TipoPessoa {
        F, // Física
        J  // Jurídica
    }

}

