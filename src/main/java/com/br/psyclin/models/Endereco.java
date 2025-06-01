package com.br.psyclin.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "ENDERECO")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDENDERECO")
    @EqualsAndHashCode.Include
    private Integer idEndereco;

    @NotNull(message = "Tipo de endereço não pode ser nulo")
    @Enumerated(EnumType.STRING)
    @Column(name = "TIPOENDER", nullable = false, length = 3)
    private TipoEndereco tipoEndereco; // Enum COM ou RES

    @NotNull(message = "Tipo de logradouro não pode ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TIPOLOGRA", referencedColumnName = "IDTIPOLOGRA", nullable = false)
    private TipoLogrado tipoLogrado;

    @NotBlank(message = "Logradouro não pode ser vazio")
    @Size(max = 100, message = "Logradouro deve ter no máximo 100 caracteres")
    @Column(name = "LOGRADOURO", length = 100, nullable = false)
    private String logradouro;

    @NotBlank(message = "Número não pode ser vazio")
    @Size(max = 10, message = "Número deve ter no máximo 10 caracteres")
    @Column(name = "NUMEENDER", length = 10, nullable = false)
    private String numeroEndereco;

    @Size(max = 100, message = "Complemento deve ter no máximo 100 caracteres")
    @Column(name = "COMPLEMENTO", length = 100)
    private String complemento;

    @NotBlank(message = "Bairro não pode ser vazio")
    @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres")
    @Column(name = "BAIRRO", length = 100, nullable = false)
    private String bairro;

    @NotBlank(message = "CEP não pode ser vazio")
    @Pattern(regexp = "\\d{8}", message = "CEP deve conter 8 dígitos")
    @Column(name = "CEP", length = 8, nullable = false)
    private String cep;

    @NotNull(message = "Cidade não pode ser nula")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CIDADE", referencedColumnName = "IDCIDADE", nullable = false)
    private Cidade cidade;

    @NotNull(message = "Pessoa não pode ser nula")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PESSOA", referencedColumnName = "IDPESSOA", nullable = false)
    private Pessoa pessoa;

    // Enum para TipoEndereco
    public enum TipoEndereco {
        COM, // Comercial
        RES  // Residencial
    }









}
