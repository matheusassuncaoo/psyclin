package com.br.psyclin.repositories;

import com.br.psyclin.models.Procedimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações relacionadas a Procedimentos.
 * Gerencia o catálogo de serviços oferecidos pela clínica.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Repository
public interface ProcedimentoRepository extends JpaRepository<Procedimento, Integer> {

    /**
     * Busca um procedimento por ID.
     * 
     * @param idProcedimento ID do procedimento
     * @return Optional contendo o procedimento se encontrado
     */
    Optional<Procedimento> findByIdProcedimento(Integer idProcedimento);

    /**
     * Busca procedimentos por código.
     * 
     * @param codigoProcedimento Código do procedimento
     * @return Optional contendo o procedimento se encontrado
     */
    Optional<Procedimento> findByCodProcedimento(String codigoProcedimento);

    /**
     * Busca procedimentos por descrição (contendo texto).
     * 
     * @param descricao Texto a ser buscado na descrição
     * @return Lista de procedimentos que contêm o texto na descrição
     */
    @Query("SELECT p FROM Procedimento p WHERE LOWER(p.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')) ORDER BY p.descricao")
    List<Procedimento> findByDescricaoContaining(String descricao);

    /**
     * Conta total de procedimentos disponíveis para o dashboard.
     * Representa o catálogo completo de serviços da clínica.
     * 
     * @return Número total de procedimentos cadastrados
     */
    @Query("SELECT COUNT(p) FROM Procedimento p")
    Long countTotalProcedimentos();

    /**
     * Busca procedimentos ordenados por valor.
     * 
     * @return Lista de procedimentos ordenados por valor (menor para maior)
     */
    @Query("SELECT p FROM Procedimento p ORDER BY p.valor ASC")
    List<Procedimento> findAllOrderByValor();

    /**
     * Busca procedimentos ordenados por descrição.
     * 
     * @return Lista de procedimentos ordenados alfabeticamente
     */
    @Query("SELECT p FROM Procedimento p ORDER BY p.descricao ASC")
    List<Procedimento> findAllOrderByDescricao();

    /**
     * Busca procedimentos por faixa de valor.
     * 
     * @param valorMinimo Valor mínimo
     * @param valorMaximo Valor máximo
     * @return Lista de procedimentos na faixa de valor especificada
     */
    @Query("SELECT p FROM Procedimento p WHERE p.valor BETWEEN :valorMinimo AND :valorMaximo ORDER BY p.valor ASC")
    List<Procedimento> findByFaixaValor(Double valorMinimo, Double valorMaximo);
}
