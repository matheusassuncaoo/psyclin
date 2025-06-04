package com.br.psyclin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.br.psyclin.models.Profissional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Integer> {

    /**
     * Busca profissionais pelo tipo de profissional.
     *
     * @param tipoProfissional Tipo do profissional
     * @return Lista de profissionais do tipo informado
     */
    List<Profissional> findByTipoProfissional(Profissional.TipoProfissional tipoProfissional);
    
    /**
     * Busca profissionais pelo status.
     *
     * @param statusProfissional Status do profissional
     * @return Lista de profissionais com o status informado
     */
    List<Profissional> findByStatusProfissional(Profissional.StatusProfissional statusProfissional);
    
    /**
     * Busca profissionais pelo supervisor.
     *
     * @param profissional Supervisor do profissional
     * @return Lista de profissionais supervisionados pelo profissional informado
     */
    List<Profissional> findBySupervisor(Profissional profissional);
    
    /**
     * Busca profissionais que não possuem supervisor.
     *
     * @return Lista de profissionais sem supervisor
     */
    List<Profissional> findBySupervisorIsNull();
    
    /**
     * Busca profissionais pelo nome, ignorando maiúsculas/minúsculas.
     *
     * @param nomePessoa Nome (ou parte do nome) do profissional
     * @return Lista de profissionais cujo nome contenha o valor informado
     */
    List<Profissional> findByPessoaFisNomePessoaContainingIgnoreCase(String nomePessoa);
    
    /**
     * Busca um profissional pelo CPF.
     *
     * @param cpfPessoa CPF do profissional
     * @return Optional contendo o profissional, se encontrado
     */
    Optional<Profissional> findByPessoaFisCpfPessoa(String cpfPessoa);
    
    /**
     * Busca profissionais pelo conselho profissional.
     *
     * @param idConseprofi ID do conselho profissional
     * @return Lista de profissionais vinculados ao conselho informado
     */
    List<Profissional> findByConseprofiIdConseprofi(Integer idConseprofi);
}