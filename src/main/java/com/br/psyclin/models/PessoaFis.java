package com.br.psyclin.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "PESSOAFIS")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PessoaFis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPESSOAFIS")
    @EqualsAndHashCode.Include
    private Integer idPessoaFis;

    // Relacionamento com Pessoa (um para um, chave estrangeira aqui)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PESSOA", referencedColumnName = "IDPESSOA", nullable = false, unique = true)
    @NotNull(message = "Referência à Pessoa não pode ser nula")
    private Pessoa pessoa;

    @NotBlank(message = "CPF não pode ser vazio")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos")
    @Column(name = "CPFPESSOA", length = 11, nullable = false, unique = true)
    private String cpfPessoa;

    @NotBlank(message = "Nome não pode ser vazio")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Column(name = "NOMEPESSOA", length = 100, nullable = false)
    private String nomePessoa;

    @NotNull(message = "Data de nascimento não pode ser nula")
    @PastOrPresent(message = "Data de nascimento deve ser no passado ou presente")
    @Column(name = "DATANASCPES", nullable = false)
    private LocalDate dataNascPessoa;

    @NotNull(message = "Sexo não pode ser nulo")
    @Enumerated(EnumType.STRING)
    @Column(name = "SEXOPESSOA", nullable = false, length = 1)
    private SexoPessoa sexoPessoa;

    @Column(name = "DATACRIACAO", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime dataCriacao;


    // Relacionamento inverso com Paciente (se necessário)
    @OneToOne(mappedBy = "pessoaFis", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Paciente paciente;

    // Relacionamento inverso com Profissional (se necessário)
    @OneToOne(mappedBy = "pessoaFis", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Profissional profissional;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
    }

    // Enum para SexoPessoa
    public enum SexoPessoa {
        M, // Masculino
        F  // Feminino
    }

}
