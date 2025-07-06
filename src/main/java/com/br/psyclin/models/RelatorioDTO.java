package com.br.psyclin.models;

import java.time.LocalDateTime;

public class RelatorioDTO {
    private Long idProntu;
    private Long idPaciente;
    private String descricao;
    private LocalDateTime dataRegistro;
    private Integer idProcedimento; // novo campo para o ID do procedimento

    public RelatorioDTO() {
    }

    public Long getIdProntu() {
        return idProntu;
    }

    public void setIdProntu(Long idProntu) {
        this.idProntu = idProntu;
    }

    public Long getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(Long idPaciente) {
        this.idPaciente = idPaciente;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDateTime dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public Integer getIdProcedimento() {
        return idProcedimento;
    }

    public void setIdProcedimento(Integer idProcedimento) {
        this.idProcedimento = idProcedimento;
    }
}