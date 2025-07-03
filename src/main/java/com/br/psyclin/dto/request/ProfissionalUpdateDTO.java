package com.br.psyclin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para atualização de dados de profissional
 * Contém apenas os campos que podem ser editados
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfissionalUpdateDTO {
    
    private String nomePessoa;
    private String codigoProfissional;
    private String conselhoProfissional;
    private String especialidade;
    private String telefone;
    private String email;
}
