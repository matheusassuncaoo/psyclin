package com.br.psyclin.dto.request;

import com.br.psyclin.models.Paciente;
import com.br.psyclin.models.PessoaFisica;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

/**
 * DTO para requisições de cadastro de paciente.
 * Contém todas as informações necessárias para criar um paciente completo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteRequestDTO {

    // Dados Pessoais (PessoaFisica)
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nomePessoa;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter exatamente 11 dígitos")
    private String cpfPessoa;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data de nascimento deve ser anterior à data atual")
    private LocalDate dataNascimento;

    @NotNull(message = "Sexo é obrigatório")
    private PessoaFisica.Sexo sexo;

    // Dados específicos do Paciente
    @NotBlank(message = "RG é obrigatório")
    @Size(max = 15, message = "RG deve ter no máximo 15 caracteres")
    private String rgPaciente;

    @NotNull(message = "Estado do RG é obrigatório")
    private Paciente.EstadoRg estadoRg;

    // Dados de Contato
    @Email(message = "Email deve ter formato válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    private String email;

    @Pattern(regexp = "\\d{10,11}", message = "Telefone deve conter 10 ou 11 dígitos")
    private String telefone;

    @Pattern(regexp = "\\d{10,11}", message = "Celular deve conter 10 ou 11 dígitos")
    private String celular;

    // Dados de Endereço
    @NotBlank(message = "CEP é obrigatório")
    @Pattern(regexp = "\\d{8}", message = "CEP deve conter exatamente 8 dígitos")
    private String cep;

    @NotBlank(message = "Logradouro é obrigatório")
    @Size(max = 100, message = "Logradouro deve ter no máximo 100 caracteres")
    private String logradouro;

    @NotBlank(message = "Número é obrigatório")
    @Size(max = 10, message = "Número deve ter no máximo 10 caracteres")
    private String numero;

    @Size(max = 50, message = "Complemento deve ter no máximo 50 caracteres")
    private String complemento;

    @NotBlank(message = "Bairro é obrigatório")
    @Size(max = 50, message = "Bairro deve ter no máximo 50 caracteres")
    private String bairro;

    @NotBlank(message = "Cidade é obrigatória")
    @Size(max = 50, message = "Cidade deve ter no máximo 50 caracteres")
    private String cidade;

    @NotBlank(message = "Estado é obrigatório")
    @Size(min = 2, max = 2, message = "Estado deve ter exatamente 2 caracteres")
    private String estado;
}
