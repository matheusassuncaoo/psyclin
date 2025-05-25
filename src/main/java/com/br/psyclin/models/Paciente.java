package com.br.psyclin.models;

import java.time.LocalDate;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "paciente")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Paciente {

    public interface CreatePaciente {}
    public interface UpdatePaciente {}

    public static final String TABLE_NAME = "Paciente";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cpf_pac",nullable = false, length = 11)
    @NotNull(groups = CreatePaciente.class)
    @NotBlank(groups = CreatePaciente.class)
    @Size(groups = CreatePaciente.class, min = 11, max = 11)
    private String cpfPac;

    @Column(name = "cod_pac", length = 10)
    @NotNull
    @NotBlank
    @Size(min = 10, max = 10)
    private String codPac;

    @Column(name = "nome_pac", length = 100)
    @NotNull
    @NotBlank
    @Size(min = 50, max = 100)
    private String nomePac;

    @Column(name = "tel_pac", length = 11)
    @NotNull
    @NotBlank
    @Size(min = 11, max = 11)
    private String telPac;

    @Column(name = "data_nasc_pac")
    @NotNull
    private LocalDate dataNascPac;

    @Column(name = "rg_pac", length = 12)
    @NotNull
    @NotBlank
    @Size(min = 12, max = 12)
    private String rgPac;

    @Column(name = "est_rg_pac", length = 2)
    @NotNull
    @NotBlank
    @Size(min = 2, max = 2)
    private String estRgPac;

    @Column(name = "nome_mae_pac", length = 100)
    @NotNull
    @NotBlank
    @Size(min = 50, max = 100)
    private String nomeMaePac;

    @Column(name = "status_pac", length = 1)
    @NotNull
    @Size(min = 1, max = 1)
    private Integer statusPac; // 1: ativo, 2: inativo, 3: suspenso
}