package com.br.psyclin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.br.psyclin.models.Profissional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Integer> {

    // Buscar por tipo de profissional
    List<Profissional> findByTipoProfissional(Profissional.TipoProfissional tipoProfissional);
    
    // Buscar por status
    List<Profissional> findByStatusProfissional(Profissional.StatusProfissional statusProfissional);
    
    // Buscar por supervisor
    List<Profissional> findBySupervisor(Profissional profissional);
    
    // Buscar profissionais sem supervisor
    List<Profissional> findBySupervisorIsNull();
    
    // Buscar por nome do profissional (usando relacionamento com PessoaFis)
    List<Profissional> findByPessoaFisNomePessoaContainingIgnoreCase(String nomePessoa);
    
    // Buscar por CPF (usando relacionamento com PessoaFis)
    Optional<Profissional> findByPessoaFisCpfPessoa(String cpfPessoa);
    
    // Buscar por conselho profissional
    List<Profissional> findByConseprofiIdConseprofi(Integer idConseprofi);
}