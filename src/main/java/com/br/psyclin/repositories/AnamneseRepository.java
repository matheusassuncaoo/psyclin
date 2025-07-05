package com.br.psyclin.repositories;

import com.br.psyclin.models.Anamnese;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações relacionadas a Anamneses.
 * Foca na lógica de aprovação/reprovação pelo coordenador.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Repository
public interface AnamneseRepository extends JpaRepository<Anamnese, Integer> {

    /**
     * Busca uma anamnese por ID.
     * 
     * @param idAnamnese ID da anamnese
     * @return Optional contendo a anamnese se encontrada
     */
    Optional<Anamnese> findByIdAnamnese(Integer idAnamnese);

    /**
     * Busca anamneses por paciente.
     * 
     * @param idPaciente ID do paciente
     * @return Lista de anamneses do paciente
     */
    List<Anamnese> findByPaciente_IdPaciente(Integer idPaciente);

    /**
     * Busca anamneses por profissional.
     * 
     * @param idProfissional ID do profissional
     * @return Lista de anamneses realizadas pelo profissional
     */
    List<Anamnese> findByProfissional_IdProfissional(Integer idProfissional);

    /**
     * Busca anamneses por status (APROVADO, REPROVADO, CANCELADO).
     * 
     * @param statusAnamnese Status da anamnese
     * @return Lista de anamneses com o status especificado
     */
    List<Anamnese> findByStatusAnamnese(Anamnese.StatusAnamnese statusAnamnese);

    /**
     * Busca anamneses pendentes de aprovação (REPROVADO).
     * 
     * @return Lista de anamneses que precisam ser aprovadas
     */
    @Query("SELECT a FROM Anamnese a WHERE a.statusAnamnese = 'REPROVADO' ORDER BY a.dataAnamnese DESC")
    List<Anamnese> buscarAnamnesesPendentesAprovacao();

    /**
     * Busca anamneses aprovadas.
     * 
     * @return Lista de anamneses aprovadas
     */
    @Query("SELECT a FROM Anamnese a WHERE a.statusAnamnese = 'APROVADO' ORDER BY a.dataAnamnese DESC")
    List<Anamnese> buscarAnamnesesAprovadas();

    /**
     * Busca anamneses ativas (statusFuncional = true).
     * 
     * @return Lista de anamneses ativas
     */
    List<Anamnese> findByStatusFuncionalTrue();

    /**
     * Conta anamneses ativas para dashboard.
     * 
     * @return Número de anamneses ativas
     */
    @Query("SELECT COUNT(a) FROM Anamnese a WHERE a.statusFuncional = true")
    Long countByStatusFuncionalTrue();

    /**
     * Busca anamneses canceladas.
     * 
     * @return Lista de anamneses canceladas
     */
    @Query("SELECT a FROM Anamnese a WHERE a.statusAnamnese = 'CANCELADO' ORDER BY a.dataAnamnese DESC")
    List<Anamnese> buscarAnamnesesCanceladas();

    /**
     * Busca anamneses por período.
     * 
     * @param dataInicio Data de início do período
     * @param dataFim Data de fim do período
     * @return Lista de anamneses no período especificado
     */
    @Query("SELECT a FROM Anamnese a WHERE a.dataAnamnese BETWEEN :dataInicio AND :dataFim ORDER BY a.dataAnamnese DESC")
    List<Anamnese> buscarAnamnesesPorPeriodo(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);

    /**
     * Busca anamneses por paciente e status.
     * 
     * @param idPaciente ID do paciente
     * @param statusAnamnese Status da anamnese
     * @return Lista de anamneses do paciente com o status especificado
     */
    @Query("SELECT a FROM Anamnese a WHERE a.paciente.idPaciente = :idPaciente AND a.statusAnamnese = :statusAnamnese ORDER BY a.dataAnamnese DESC")
    List<Anamnese> buscarAnamnesesPorPacienteEStatus(@Param("idPaciente") Integer idPaciente, @Param("statusAnamnese") Anamnese.StatusAnamnese statusAnamnese);

    /**
     * Busca anamneses por profissional e status.
     * 
     * @param idProfissional ID do profissional
     * @param statusAnamnese Status da anamnese
     * @return Lista de anamneses do profissional com o status especificado
     */
    @Query("SELECT a FROM Anamnese a WHERE a.profissional.idProfissional = :idProfissional AND a.statusAnamnese = :statusAnamnese ORDER BY a.dataAnamnese DESC")
    List<Anamnese> buscarAnamnesesPorProfissionalEStatus(@Param("idProfissional") Integer idProfissional, @Param("statusAnamnese") Anamnese.StatusAnamnese statusAnamnese);

    /**
     * Busca a última anamnese de um paciente.
     * 
     * @param idPaciente ID do paciente
     * @return Optional contendo a última anamnese do paciente
     */
    @Query("SELECT a FROM Anamnese a WHERE a.paciente.idPaciente = :idPaciente ORDER BY a.dataAnamnese DESC")
    Optional<Anamnese> buscarUltimaAnamnesePorPaciente(@Param("idPaciente") Integer idPaciente);

    /**
     * Busca anamneses que podem ser editadas (REPROVADO).
     * 
     * @param idProfissional ID do profissional
     * @return Lista de anamneses que podem ser editadas pelo profissional
     */
    @Query("SELECT a FROM Anamnese a WHERE a.profissional.idProfissional = :idProfissional AND a.statusAnamnese = 'REPROVADO' ORDER BY a.dataAnamnese DESC")
    List<Anamnese> buscarAnamnesesEditaveisPorProfissional(@Param("idProfissional") Integer idProfissional);

    /**
     * Verifica se existe anamnese para o paciente.
     * 
     * @param idPaciente ID do paciente
     * @return true se existir, false caso contrário
     */
    @Query("SELECT COUNT(a) > 0 FROM Anamnese a WHERE a.paciente.idPaciente = :idPaciente")
    boolean existsByPaciente_IdPaciente(@Param("idPaciente") Integer idPaciente);

    /**
     * Conta anamneses por status.
     * 
     * @param statusAnamnese Status da anamnese
     * @return Número de anamneses com o status especificado
     */
    long countByStatusAnamnese(Anamnese.StatusAnamnese statusAnamnese);

    /**
     * Busca anamneses com autorização de visualização.
     * 
     * @param autorizacaoVisualizacao Status da autorização
     * @return Lista de anamneses com a autorização especificada
     */
    List<Anamnese> findByAutorizacaoVisualizacao(Boolean autorizacaoVisualizacao);

    /**
     * Conta anamneses criadas após uma data específica.
     * 
     * @param dataInicio Data de início para contagem
     * @return Número de anamneses criadas após a data
     */
    long countByDataAnamneseAfter(LocalDateTime dataInicio);
}