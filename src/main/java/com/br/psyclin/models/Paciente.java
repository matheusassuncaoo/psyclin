package com.br.psyclin.models;

import java.time.LocalDate;

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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import lombok.Data;
import lombok.EqualsAndHashCode;


@Entity
@Table(name = "PACIENTE")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDPACIENTE")
    @EqualsAndHashCode.Include
    private Integer idPaciente;

    // Relacionamento com PessoaFis (um para um, chave estrangeira aqui)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PESSOAFIS", referencedColumnName = "IDPESSOAFIS", nullable = false, unique = true)
    @NotNull(message = "Referência à Pessoa Física não pode ser nula")
    private PessoaFis pessoaFis;

    @NotBlank(message = "RG não pode ser vazio")
    @Size(max = 15, message = "RG deve ter no máximo 15 caracteres")
    @Column(name = "RGPACIENTE", length = 15, nullable = false, unique = true)
    private String rgPaciente;

    // Mapeando o ENUM do estado do RG
    @Enumerated(EnumType.STRING)
    @Column(name = "ESTDORGPAC", length = 2) // Tamanho 2 conforme ENUM no SQL
    private EstadoRg estdoRgPac; // Enum EstadoRg

    @NotNull(message = "Status do paciente não pode ser nulo")
    @Column(name = "STATUSPAC", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean statusPac = true; // Valor padrão definido na entidade

     // Relacionamento inverso com Prontuario (se necessário)
    // @OneToMany(mappedBy = "paciente")
    // private List<Prontuario> prontuarios;

    // Relacionamento inverso com Anamnese (se necessário)
    // @OneToMany(mappedBy = "paciente")
    // private List<Anamnese> anamneses;

    // Enum para EstadoRg (precisa ser criado ou definido aqui)
    public enum EstadoRg {
        AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO
    }

    // Métodos utilitários, se necessário
    // Exemplo: obter nome do paciente através de pessoaFis
    public String getNomePaciente() {
        return this.pessoaFis != null ? this.pessoaFis.getNomePessoa() : null;
    }

     // Exemplo: obter CPF do paciente através de pessoaFis
    public String getCpfPaciente() {
        return this.pessoaFis != null ? this.pessoaFis.getCpfPessoa() : null;
    }

   
}