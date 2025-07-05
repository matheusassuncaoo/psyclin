package com.br.psyclin.dto.request;

import com.br.psyclin.models.Anamnese;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para requisições de cadastro de anamnese.
 * Contém todas as informações necessárias para criar uma anamnese.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnamneseRequestDTO {

    @NotNull(message = "ID do paciente é obrigatório")
    private Integer idPaciente;

    @NotNull(message = "ID do profissional é obrigatório")
    private Integer idProfissional;

    @NotNull(message = "Data da anamnese é obrigatória")
    private LocalDateTime dataAnamnese;

    @Size(max = 100, message = "Nome do responsável deve ter no máximo 100 caracteres")
    private String nomeResponsavel;

    @Pattern(regexp = "\\d{11}|^$", message = "CPF do responsável deve conter exatamente 11 dígitos ou ser vazio")
    private String cpfResponsavel;

    @NotNull(message = "Autorização de visualização é obrigatória")
    private Boolean autorizacaoVisualizacao;

    @NotNull(message = "Status da anamnese é obrigatório")
    private Anamnese.StatusAnamnese statusAnamnese;

    @NotNull(message = "Status funcional é obrigatório")
    private Boolean statusFuncional;

    @Size(max = 500, message = "Observações devem ter no máximo 500 caracteres")
    private String observacoes;
}
