package com.br.psyclin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de dados de profissional
 * Contém apenas os campos necessários para a interface
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalResponseDTO {
    
    private Integer idProfissional;
    private String nomePessoa;
    private String codigoProfissional;
    private String conselhoProfissional;
    private String tipoProfissional;
    private String statusProfissional;
    private String especialidade;
    private String telefone;
    private String email;
    
    /**
     * Converte status numérico para texto
     */
    public String getStatusTexto() {
        if (statusProfissional == null) return "Indefinido";
        
        return switch (statusProfissional) {
            case "1" -> "Ativo";
            case "0" -> "Inativo";
            default -> "Indefinido";
        };
    }
    
    /**
     * Converte tipo numérico para texto
     */
    public String getTipoTexto() {
        if (tipoProfissional == null) return "Indefinido";
        
        return switch (tipoProfissional) {
            case "1" -> "Administrador";
            case "2" -> "Psicólogo";
            case "3" -> "Terapeuta";
            case "4" -> "Estagiário";
            default -> "Indefinido";
        };
    }
}
