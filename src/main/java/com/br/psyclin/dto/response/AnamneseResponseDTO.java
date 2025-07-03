package com.br.psyclin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de dados de anamnese
 * Contém apenas os campos necessários para a interface
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnamneseResponseDTO {
    
    private Integer idAnamnese;
    private String nomePaciente;
    private String nomeProfissional;
    private String dataAplicacao;
    private String statusAnamnese;
    private String nomeResponsavel;
    private String cpfResponsavel;
    private Boolean autorizacaoVisualizacao;
    private String observacoes;
    
    /**
     * Converte status enum para texto legível
     */
    public String getStatusTexto() {
        if (statusAnamnese == null) return "Indefinido";
        
        return switch (statusAnamnese.toUpperCase()) {
            case "APROVADO" -> "Aprovado";
            case "REPROVADO" -> "Reprovado";
            case "CANCELADO" -> "Cancelado";
            default -> "Indefinido";
        };
    }
}
