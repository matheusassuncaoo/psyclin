package com.br.psyclin.repositories;

import com.br.psyclin.models.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações relacionadas a Profissionais.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Integer> {

    /**
     * Busca um profissional por ID.
     * 
     * @param idProfissional ID do profissional
     * @return Optional contendo o profissional se encontrado
     */
    Optional<Profissional> findByIdProfissional(Integer idProfissional);

    /**
     * Busca um profissional por CPF.
     * 
     * @param cpfPessoa CPF do profissional
     * @return Optional contendo o profissional se encontrado
     */
    Optional<Profissional> findByPessoaFisica_CpfPessoa(String cpfPessoa);

    /**
     * Busca profissionais por nome (contendo o texto).
     * 
     * @param nomeProfissional Nome ou parte do nome do profissional
     * @return Lista de profissionais que contêm o nome
     */
    @Query("SELECT p FROM Profissional p WHERE p.pessoaFisica.nomePessoa LIKE %:nomeProfissional%")
    List<Profissional> buscarProfissionaisPorNome(@Param("nomeProfissional") String nomeProfissional);

    /**
     * Busca profissionais por tipo.
     * 
     * @param tipoProfissional Tipo do profissional
     * @return Lista de profissionais do tipo especificado
     */
    List<Profissional> findByTipoProfissional(Profissional.TipoProfissional tipoProfissional);

    /**
     * Busca profissionais por status.
     * 
     * @param statusProfissional Status do profissional
     * @return Lista de profissionais com o status especificado
     */
    List<Profissional> findByStatusProfissional(Profissional.StatusProfissional statusProfissional);

    /**
     * Busca apenas profissionais ativos (status = _1).
     * 
     * @return Lista de profissionais ativos
     */
    @Query("SELECT p FROM Profissional p WHERE p.statusProfissional = com.br.psyclin.models.Profissional$StatusProfissional._1")
    List<Profissional> findByStatusProfissionalAtivo();

    /**
     * Conta profissionais ativos para otimização de performance.
     * 
     * @return Número de profissionais ativos
     */
    @Query("SELECT COUNT(p) FROM Profissional p WHERE p.statusProfissional = com.br.psyclin.models.Profissional$StatusProfissional._1")
    Long countByStatusProfissionalAtivo();

    /**
     * Busca profissionais por conselho.
     * 
     * @param idConselhoProfissional ID do conselho profissional
     * @return Lista de profissionais do conselho especificado
     */
    @Query("SELECT p FROM Profissional p WHERE p.conselhoProfissional.idConselhoProfissional = :idConselhoProfissional")
    List<Profissional> buscarProfissionaisPorConselho(@Param("idConselhoProfissional") Integer idConselhoProfissional);

    /**
     * Busca profissionais por especialidade.
     * 
     * @param idEspecialidade ID da especialidade
     * @return Lista de profissionais da especialidade especificada
     */
    @Query("SELECT p FROM Profissional p JOIN p.especialidades e WHERE e.idEspecialidade = :idEspecialidade")
    List<Profissional> buscarProfissionaisPorEspecialidade(@Param("idEspecialidade") Integer idEspecialidade);

    /**
     * Busca profissionais supervisores (que têm subordinados).
     * 
     * @return Lista de profissionais que são supervisores
     */
    @Query("SELECT p FROM Profissional p WHERE p.idProfissional IN (SELECT DISTINCT s.supervisor.idProfissional FROM Profissional s WHERE s.supervisor IS NOT NULL)")
    List<Profissional> buscarProfissionaisSupervisores();

    /**
     * Busca subordinados de um profissional.
     * 
     * @param idSupervisor ID do profissional supervisor
     * @return Lista de profissionais subordinados
     */
    @Query("SELECT p FROM Profissional p WHERE p.supervisor.idProfissional = :idSupervisor")
    List<Profissional> buscarSubordinadosPorSupervisor(@Param("idSupervisor") Integer idSupervisor);

    /**
     * Verifica se existe um profissional com o CPF informado.
     * 
     * @param cpfPessoa CPF do profissional
     * @return true se existir, false caso contrário
     */
    boolean existsByPessoaFisica_CpfPessoa(String cpfPessoa);

    /**
     * Busca profissionais ativos por especialidade.
     * 
     * @param idEspecialidade ID da especialidade
     * @return Lista de profissionais ativos da especialidade especificada
     */
    @Query("SELECT p FROM Profissional p JOIN p.especialidades e WHERE e.idEspecialidade = :idEspecialidade AND p.statusProfissional = '_1'")
    List<Profissional> buscarProfissionaisAtivosPorEspecialidade(@Param("idEspecialidade") Integer idEspecialidade);
} 