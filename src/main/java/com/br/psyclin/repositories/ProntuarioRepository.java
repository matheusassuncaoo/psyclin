package com.br.psyclin.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.br.psyclin.models.Prontuario;
import java.time.LocalDate;
import java.util.List;

/**
 * Repositório para operações relacionadas à entidade Prontuario.
 * Fornece métodos para acessar e manipular dados de prontuários no banco de dados.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Integer> {

    /**
     * Conta o total de prontuários no sistema.
     * Representa o histórico completo de atendimentos realizados.
     * 
     * @return número total de prontuários
     */
    @Query("SELECT COUNT(p) FROM Prontuario p")
    Long contarTotalProntuarios();

    /**
     * Busca prontuários por paciente.
     * 
     * @param idPaciente ID do paciente
     * @return lista de prontuários do paciente
     */
    @Query("SELECT p FROM Prontuario p WHERE p.paciente.id = :idPaciente ORDER BY p.dataProcedimento DESC")
    List<Prontuario> buscarPorPaciente(Integer idPaciente);

    /**
     * Busca prontuários por profissional.
     * 
     * @param idProfissional ID do profissional
     * @return lista de prontuários do profissional
     */
    @Query("SELECT p FROM Prontuario p WHERE p.profissional.id = :idProfissional ORDER BY p.dataProcedimento DESC")
    List<Prontuario> buscarPorProfissional(Integer idProfissional);

    /**
     * Busca prontuários por período.
     * 
     * @param dataInicio data de início do período
     * @param dataFim data de fim do período
     * @return lista de prontuários no período
     */
    @Query("SELECT p FROM Prontuario p WHERE p.dataProcedimento BETWEEN :dataInicio AND :dataFim ORDER BY p.dataProcedimento DESC")
    List<Prontuario> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim);

    /**
     * Conta prontuários criados hoje.
     * 
     * @return número de prontuários criados hoje
     */
    @Query("SELECT COUNT(p) FROM Prontuario p WHERE p.dataProcedimento = CURRENT_DATE")
    Long contarProntuariosHoje();

    /**
     * Conta prontuários criados nos últimos 30 dias.
     * 
     * @return número de prontuários dos últimos 30 dias
     */
    @Query(value = "SELECT COUNT(*) FROM PRONTUARIO WHERE DATAPROCED >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)", nativeQuery = true)
    Long contarProntuariosUltimos30Dias();

    /**
     * Busca os últimos N prontuários criados.
     * 
     * @param pageable configuração de página/limite
     * @return lista dos últimos prontuários
     */
    @Query("SELECT p FROM Prontuario p ORDER BY p.dataProcedimento DESC, p.idProntuario DESC")
    List<Prontuario> buscarUltimosProntuarios(Pageable pageable);
}
