package com.br.psyclin.repositories;

import com.br.psyclin.models.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações relacionadas a Agenda (Agendamentos/Encontros).
 * Foca na gestão de consultas e procedimentos agendados.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Integer> {

    /**
     * Busca um agendamento por ID.
     * 
     * @param idAgenda ID do agendamento
     * @return Optional contendo o agendamento se encontrado
     */
    Optional<Agenda> findByIdAgenda(Integer idAgenda);

    /**
     * Busca agendamentos por situação.
     * 
     * @param situacao Situação do agendamento
     * @return Lista de agendamentos com a situação especificada
     */
    List<Agenda> findBySituacaoAgenda(Agenda.SituacaoAgenda situacao);

    /**
     * Busca agendamentos aguardando atendimento.
     * 
     * @return Lista de agendamentos aguardando
     */
    @Query("SELECT a FROM Agenda a WHERE a.situacaoAgenda = 'AGUARDANDO' ORDER BY a.dataNova ASC, a.dataAbertura ASC")
    List<Agenda> buscarAgendamentosAguardando();

    /**
     * Conta agendamentos ativos para hoje.
     * Considera agendamentos com situação AGUARDANDO e data para hoje.
     * 
     * @param inicioHoje Início do dia de hoje (00:00:00)
     * @param fimHoje Fim do dia de hoje (23:59:59)
     * @return Número de encontros ativos para hoje
     */
    @Query("SELECT COUNT(a) FROM Agenda a WHERE a.situacaoAgenda = 'AGUARDANDO' AND " +
           "((a.dataNova IS NOT NULL AND a.dataNova BETWEEN :inicioHoje AND :fimHoje) OR " +
           "(a.dataNova IS NULL AND a.dataAbertura BETWEEN :inicioHoje AND :fimHoje))")
    Long countEncontrosAtivosHoje(@Param("inicioHoje") LocalDateTime inicioHoje, 
                                   @Param("fimHoje") LocalDateTime fimHoje);

    /**
     * Busca encontros ativos para hoje.
     * 
     * @param inicioHoje Início do dia de hoje
     * @param fimHoje Fim do dia de hoje
     * @return Lista de encontros ativos para hoje
     */
    @Query("SELECT a FROM Agenda a WHERE a.situacaoAgenda = 'AGUARDANDO' AND " +
           "((a.dataNova IS NOT NULL AND a.dataNova BETWEEN :inicioHoje AND :fimHoje) OR " +
           "(a.dataNova IS NULL AND a.dataAbertura BETWEEN :inicioHoje AND :fimHoje)) " +
           "ORDER BY COALESCE(a.dataNova, a.dataAbertura) ASC")
    List<Agenda> buscarEncontrosAtivosHoje(@Param("inicioHoje") LocalDateTime inicioHoje, 
                                           @Param("fimHoje") LocalDateTime fimHoje);

    /**
     * Busca agendamentos por profissional.
     * 
     * @param idProfissional ID do profissional
     * @return Lista de agendamentos do profissional
     */
    List<Agenda> findByProfissional_IdProfissional(Integer idProfissional);

    /**
     * Busca agendamentos por período.
     * 
     * @param dataInicio Data de início do período
     * @param dataFim Data de fim do período
     * @return Lista de agendamentos no período
     */
    @Query("SELECT a FROM Agenda a WHERE " +
           "((a.dataNova IS NOT NULL AND a.dataNova BETWEEN :dataInicio AND :dataFim) OR " +
           "(a.dataNova IS NULL AND a.dataAbertura BETWEEN :dataInicio AND :dataFim)) " +
           "ORDER BY COALESCE(a.dataNova, a.dataAbertura) ASC")
    List<Agenda> buscarAgendamentosPorPeriodo(@Param("dataInicio") LocalDateTime dataInicio, 
                                              @Param("dataFim") LocalDateTime dataFim);

    /**
     * Conta agendamentos por situação.
     * 
     * @param situacao Situação do agendamento
     * @return Número de agendamentos com a situação especificada
     */
    long countBySituacaoAgenda(Agenda.SituacaoAgenda situacao);

    /**
     * Busca agendamentos atendidos hoje.
     * 
     * @param inicioHoje Início do dia de hoje
     * @param fimHoje Fim do dia de hoje
     * @return Lista de agendamentos atendidos hoje
     */
    @Query("SELECT a FROM Agenda a WHERE a.situacaoAgenda = 'ATENDIDO' AND " +
           "((a.dataNova IS NOT NULL AND a.dataNova BETWEEN :inicioHoje AND :fimHoje) OR " +
           "(a.dataNova IS NULL AND a.dataAbertura BETWEEN :inicioHoje AND :fimHoje)) " +
           "ORDER BY COALESCE(a.dataNova, a.dataAbertura) DESC")
    List<Agenda> buscarAgendamentosAtendidosHoje(@Param("inicioHoje") LocalDateTime inicioHoje, 
                                                 @Param("fimHoje") LocalDateTime fimHoje);
}
