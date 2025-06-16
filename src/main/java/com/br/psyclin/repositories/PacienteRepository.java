package com.br.psyclin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.br.psyclin.models.Paciente;

/**
 * Repositório responsável pelas operações de banco de dados relacionadas aos Pacientes.
 * Fornece métodos para buscar, salvar e gerenciar registros de pacientes.
 */
@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    /**
     * Busca um paciente pelo CPF através da pessoa física associada.
     * @param cpf CPF do paciente
     * @return Optional contendo o paciente encontrado
     */
    Optional<Paciente> findByPessoaFisCpfPessoa(String cpf);

    /**
     * Busca um paciente pelo RG.
     * @param rg RG do paciente
     * @return Optional contendo o paciente encontrado
     */
    Optional<Paciente> findByRgPaciente(String rg);

    /**
     * Busca pacientes pelo nome através da pessoa física associada.
     * @param nome Nome ou parte do nome do paciente
     * @return Lista de pacientes encontrados
     */
    List<Paciente> findByPessoaFisNomePessoaContaining(String nome);

    /**
     * Busca pacientes pelo status.
     * @param status Status do paciente (true para ativo, false para inativo)
     * @return Lista de pacientes encontrados
     */
    List<Paciente> findByStatusPac(Boolean status);
}
