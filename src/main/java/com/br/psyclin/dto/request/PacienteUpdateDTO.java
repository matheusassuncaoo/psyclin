package com.br.psyclin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para atualização de dados de paciente
 * Contém apenas os campos que podem ser editados
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PacienteUpdateDTO {
    
    private String nomePessoa;
    private String telefone;
    private String email;
    private String rgPaciente;
    private String estadoRg;
}
