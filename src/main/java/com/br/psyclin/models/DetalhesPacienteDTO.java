package com.psyclin.models;

import java.time.LocalDateTime;

public class DetalhesPacienteDTO {
    private Long idPaciente;
    private String nome;
    private String idade;
    private String contato;
    private String email;
    private String quadroClinico;
    private String sessao;
    private LocalDateTime dataConsulta;
    private String statusConsulta;
    private Long idAgenda;

    // Construtor padrão
    public DetalhesPacienteDTO() {
    }

    // Construtor completo
    public DetalhesPacienteDTO(Long idPaciente, String nome, String idade, String contato,
            String email, String quadroClinico, String sessao,
            LocalDateTime dataConsulta, String statusConsulta) {
        this.idPaciente = idPaciente;
        this.nome = nome;
        this.idade = idade;
        this.contato = contato;
        this.email = email;
        this.quadroClinico = quadroClinico;
        this.sessao = sessao;
        this.dataConsulta = dataConsulta;
        this.statusConsulta = statusConsulta;
    }

    // Getters e Setters
    public Long getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(Long idPaciente) {
        this.idPaciente = idPaciente;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getIdade() {
        return idade;
    }

    public void setIdade(String idade) {
        this.idade = idade;
    }

    public String getContato() {
        return contato;
    }

    public void setContato(String contato) {
        this.contato = contato;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getQuadroClinico() {
        return quadroClinico;
    }

    public void setQuadroClinico(String quadroClinico) {
        this.quadroClinico = quadroClinico;
    }

    public String getSessao() {
        return sessao;
    }

    public void setSessao(String sessao) {
        this.sessao = sessao;
    }

    public LocalDateTime getDataConsulta() {
        return dataConsulta;
    }

    public void setDataConsulta(LocalDateTime dataConsulta) {
        this.dataConsulta = dataConsulta;
    }

    public String getStatusConsulta() {
        return statusConsulta;
    }

    public void setStatusConsulta(String statusConsulta) {
        this.statusConsulta = statusConsulta;
    }

    public Long getIdAgenda() {
        return idAgenda;
    }

    public void setIdAgenda(Long idAgenda) {
        this.idAgenda = idAgenda;
    }
}