package com.br.psyclin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de dados de paciente
 * Contém apenas os campos necessários para a interface
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PacienteResponseDTO {
    
    private Integer idPaciente;
    private String nomePessoa;
    private String cpfPessoa;
    private String telefone;
    private String email;
    private String dataNascimento;
    private String sexo;
    private String rgPaciente;
    private String estadoRg;
    private String statusPaciente;
    
    /**
     * Converte status numérico para texto
     */
    public String getStatusTexto() {
        if (statusPaciente == null) return "Indefinido";
        
        return switch (statusPaciente) {
            case "1" -> "Ativo";
            case "0" -> "Inativo";
            default -> "Indefinido";
        };
    }
    
    /**
     * Converte sexo para texto legível
     */
    public String getSexoTexto() {
        if (sexo == null) return "Não informado";
        
        return switch (sexo.toUpperCase()) {
            case "M" -> "Masculino";
            case "F" -> "Feminino";
            case "O" -> "Outro";
            default -> "Não informado";
        };
    }
}
