package com.br.psyclin.models;

import java.time.LocalDateTime;

public class ConsultaDTO {
    // ID da pessoa física para vinculação com a tabela PESSOAFIS
    private Long idPessoa;

    // Nome do paciente para exibição na lista
    private String nomePaciente;

    // Sexo do paciente (M/F) para definir a cor do círculo
    private String sexoPaciente;

    // Data e hora da consulta
    private LocalDateTime dataConsulta;

    // ID do profissional que realizará a consulta
    private Long idProfissional;

    // ID do procedimento a ser realizado
    private Long idProcedimento;

    // Construtor padrão
    public ConsultaDTO() {
    }

    // Getters e Setters
    public Long getIdPessoa() {
        return idPessoa;
    }

    public void setIdPessoa(Long idPessoa) {
        this.idPessoa = idPessoa;
    }

    public String getNomePaciente() {
        return nomePaciente;
    }

    public void setNomePaciente(String nomePaciente) {
        this.nomePaciente = nomePaciente;
    }

    public String getSexoPaciente() {
        return sexoPaciente;
    }

    public void setSexoPaciente(String sexoPaciente) {
        this.sexoPaciente = sexoPaciente;
    }

    public LocalDateTime getDataConsulta() {
        return dataConsulta;
    }

    public void setDataConsulta(LocalDateTime dataConsulta) {
        this.dataConsulta = dataConsulta;
    }

    public Long getIdProfissional() {
        return idProfissional;
    }

    public void setIdProfissional(Long idProfissional) {
        this.idProfissional = idProfissional;
    }

    public Long getIdProcedimento() {
        return idProcedimento;
    }

    public void setIdProcedimento(Long idProcedimento) {
        this.idProcedimento = idProcedimento;
    }
}