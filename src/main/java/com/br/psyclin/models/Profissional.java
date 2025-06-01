package com.br.psyclin.models;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.EqualsAndHashCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

@Entity
@Table(name = "PROFISSIONAL")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Profissional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPROFISSIO")
    @EqualsAndHashCode.Include
    private Integer idProfissio;

    // Relacionamento com PessoaFis (um para um, chave estrangeira aqui)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PESSOAFIS", referencedColumnName = "IDPESSOAFIS", nullable = false, unique = true)
    @NotNull(message = "Referência à Pessoa Física não pode ser nula")
    private PessoaFis pessoaFis;

    @NotNull(message = "Tipo de profissional não pode ser nulo")
    @Enumerated(EnumType.STRING) // Enum '1', '2', '3', '4'
    @Column(name = "TIPOPROFI", nullable = false, length = 1)
    private TipoProfissional tipoProfissional;

    // Relacionamento de auto-referência para supervisor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_SUPPROFI", referencedColumnName = "IDPROFISSIO")
    private Profissional supervisor; // Mapeia ID_SUPPROFI

    @Enumerated(EnumType.STRING) // Enum '1', '2', '3'
    @Column(name = "STATUSPROFI", length = 1)
    private StatusProfissional statusProfissional;

    @NotNull(message = "Conselho profissional não pode ser nulo")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONSEPROFI", referencedColumnName = "IDCONSEPROFI", nullable = false)
    private Conseprofi conseprofi;

    // Relacionamento inverso com Usuario (se necessário)
    @OneToOne(mappedBy = "profissional", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Usuario usuario;

    // Relacionamento inverso com Agenda (se necessário)
    // @OneToMany(mappedBy = "profissional")
    // private List<Agenda> agendas;

    // Enum para TipoProfissional
    public enum TipoProfissional {
        _1, // Representa '1'
        _2, // Representa '2'
        _3, // Representa '3'
        _4 // Representa '4'
        // Adicionar mapeamento para valores reais se necessário
    }

    // Enum para StatusProfissional
    public enum StatusProfissional {
        _1, // Representa '1' (e.g., Ativo)
        _2, // Representa '2' (e.g., Inativo)
        _3 // Representa '3' (e.g., Licença)
        // Adicionar mapeamento para valores reais se necessário
    }

    // Métodos utilitários, se necessário
    public String getNomeProfissional() {
        return this.pessoaFis != null ? this.pessoaFis.getNomePessoa() : null;
    }

}