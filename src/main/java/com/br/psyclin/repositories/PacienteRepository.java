package com.br.psyclin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.br.psyclin.models.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

     // Buscar por RG
    Optional<Paciente> findByRgPaciente(String rgPaciente);
    
    // Verificar se RG já existe
    boolean existsByRgPaciente(String rgPaciente);
    
    // Buscar por status
    List<Paciente> findByStatusPac(Boolean statusPac);
    
    // Buscar por estado do RG
    List<Paciente> findByEstdoRgPac(Paciente.EstadoRg estadoRg);
    
    // Buscar por nome do paciente (usando relacionamento com PessoaFis)
    List<Paciente> findByPessoaFisNomePessoaContainingIgnoreCase(String nomePessoa);
    
    // Buscar por CPF (usando relacionamento com PessoaFis)
    Optional<Paciente> findByPessoaFisCpfPessoa(String cpfPessoa);
    
}