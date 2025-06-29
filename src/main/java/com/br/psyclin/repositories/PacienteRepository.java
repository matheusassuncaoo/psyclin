package com.br.psyclin.repositories;

import com.br.psyclin.models.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações relacionadas a Pacientes.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    /**
     * Busca um paciente por ID.
     * 
     * @param idPaciente ID do paciente
     * @return Optional contendo o paciente se encontrado
     */
    Optional<Paciente> findByIdPaciente(Integer idPaciente);

    /**
     * Busca um paciente por RG.
     * 
     * @param rgPaciente RG do paciente
     * @return Optional contendo o paciente se encontrado
     */
    Optional<Paciente> findByRgPaciente(String rgPaciente);

    /**
     * Busca pacientes por nome (contendo o texto).
     * 
     * @param nomePaciente Nome ou parte do nome do paciente
     * @return Lista de pacientes que contêm o nome
     */
    @Query("SELECT p FROM Paciente p WHERE p.pessoaFisica.nomePessoa LIKE %:nomePaciente%")
    List<Paciente> buscarPacientesPorNome(@Param("nomePaciente") String nomePaciente);

    /**
     * Busca pacientes por CPF.
     * 
     * @param cpfPaciente CPF do paciente
     * @return Optional contendo o paciente se encontrado
     */
    Optional<Paciente> findByPessoaFisica_CpfPessoa(String cpfPessoa);

    /**
     * Busca pacientes ativos.
     * 
     * @return Lista de pacientes com status ativo
     */
    List<Paciente> findByStatusPacienteTrue();

    /**
     * Busca pacientes por status.
     * 
     * @param statusPaciente Status do paciente (true = ativo, false = inativo)
     * @return Lista de pacientes com o status especificado
     */
    List<Paciente> findByStatusPaciente(Boolean statusPaciente);

    /**
     * Verifica se existe um paciente com o RG informado.
     * 
     * @param rgPaciente RG do paciente
     * @return true se existir, false caso contrário
     */
    boolean existsByRgPaciente(String rgPaciente);

    /**
     * Verifica se existe um paciente com o CPF informado.
     * 
     * @param cpfPaciente CPF do paciente
     * @return true se existir, false caso contrário
     */
    boolean existsByPessoaFisica_CpfPessoa(String cpfPessoa);

    /**
     * Busca pacientes por estado emissor do RG.
     * 
     * @param estadoRg Estado emissor do RG
     * @return Lista de pacientes do estado especificado
     */
    List<Paciente> findByEstadoRg(Paciente.EstadoRg estadoRg);
} 