package com.br.psyclin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.br.psyclin.models.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    /**
     * Busca um paciente pelo RG.
     * 
     * @param rgPaciente RG do paciente
     * @return Optional contendo o paciente, se encontrado
     */
    Optional<Paciente> findByRgPaciente(String rgPaciente);
    
    /**
     * Verifica se já existe um paciente com o RG informado.
     * 
     * @param rgPaciente RG do paciente
     * @return true se existir, false caso contrário
     */
    boolean existsByRgPaciente(String rgPaciente);
    
    /**
     * Busca todos os pacientes pelo status.
     * 
     * @param statusPac Status do paciente (ativo/inativo)
     * @return Lista de pacientes com o status informado
     */
    List<Paciente> findByStatusPac(Boolean statusPac);
    
    /**
     * Busca todos os pacientes pelo estado do RG.
     * 
     * @param estadoRg Estado do RG do paciente
     * @return Lista de pacientes do estado informado
     */
    List<Paciente> findByEstdoRgPac(Paciente.EstadoRg estadoRg);
    
    /**
     * Busca pacientes pelo nome, ignorando maiúsculas/minúsculas.
     * 
     * @param nomePessoa Nome (ou parte do nome) do paciente
     * @return Lista de pacientes cujo nome contenha o valor informado
     */
    List<Paciente> findByPessoaFisNomePessoaContainingIgnoreCase(String nomePessoa);
    
    /**
     * Busca um paciente pelo CPF.
     * 
     * @param cpfPessoa CPF do paciente
     * @return Optional contendo o paciente, se encontrado
     */
    Optional<Paciente> findByPessoaFisCpfPessoa(String cpfPessoa);
    
}