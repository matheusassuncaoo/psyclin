package com.br.psyclin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.br.psyclin.models.Profissional;

/**
 * Repositório responsável pelas operações de persistência da entidade Profissional.
 * Utiliza as convenções de nomenclatura do Spring Data JPA para gerar as consultas automaticamente.
 */
@Repository
@Transactional(readOnly = true)
public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
   
    /**
     * Busca um profissional pelo CPF da pessoa física associada.
     * @param cpf CPF da pessoa física
     * @return Optional contendo o profissional encontrado, se existir
     */
    Optional<Profissional> buscarPorPessoaFisCpfPessoa(String cpf);

    /**
     * Busca um profissional pelo RG.
     * @param rg RG do profissional
     * @return Optional contendo o profissional encontrado, se existir
     */
    Optional<Profissional> buscarPorRgProfissional(String rg);
    
    /**
     * Busca um profissional pelo ID.
     * @param id ID do profissional
     * @return Optional contendo o profissional encontrado, se existir
     */
    Optional<Profissional> buscarPorId(Long id);

    /**
     * Busca profissionais pelo nome.
     * @param nome Nome do profissional (busca parcial)
     * @return Lista de profissionais encontrados
     */
    List<Profissional> buscarPorNome(String nome);

    /**
     * Busca um profissional pelo email.
     * @param email Email do profissional
     * @return Optional contendo o profissional encontrado, se existir
     */
    Optional<Profissional> buscarPorEmail(String email);

    /**
     * Busca os pacientes associados a um profissional específico.
     * @param idProfissional ID do profissional
     * @return Lista de profissionais que possuem pacientes associados
     */
    List<Profissional> buscarPacientesPorProfissional(Long idProfissional);

    /**
     * Busca profissionais pelo status.
     * @param status Status do profissional (ativo/inativo)
     * @return Lista de profissionais encontrados
     */
    List<Profissional> buscarPorStatusProf(Boolean status);

    /**
     * Busca profissionais que possuem uma anamnese específica.
     * @param anamnese Texto da anamnese
     * @return Lista de profissionais encontrados
     */
    List<Profissional> buscarPorAnamnese(String anamnese);

    /**
     * Busca todas as anamneses associadas a um profissional específico.
     * @param idProfissional ID do profissional
     * @return Lista de profissionais com suas anamneses
     */
    List<Profissional> buscarPorAnamnesesProfissional(Long idProfissional);
}
