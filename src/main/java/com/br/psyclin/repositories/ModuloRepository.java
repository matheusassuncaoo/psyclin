package com.br.psyclin.repositories;

import com.br.psyclin.models.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações relacionadas a Módulos de Anamnese.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Repository
public interface ModuloRepository extends JpaRepository<Modulo, Integer> {

    /**
     * Busca um módulo por ID.
     * 
     * @param idModulo ID do módulo
     * @return Optional contendo o módulo se encontrado
     */
    Optional<Modulo> buscarModuloPorId(Integer idModulo);

    /**
     * Busca um módulo por nome.
     * 
     * @param nomeModulo Nome do módulo
     * @return Optional contendo o módulo se encontrado
     */
    Optional<Modulo> buscarModuloPorNome(String nomeModulo);

    /**
     * Busca módulos por nome (contendo o texto).
     * 
     * @param nomeModulo Nome ou parte do nome do módulo
     * @return Lista de módulos que contêm o nome
     */
    @Query("SELECT m FROM Modulo m WHERE m.modulo LIKE %:nomeModulo%")
    List<Modulo> buscarModulosPorNome(@Param("nomeModulo") String nomeModulo);

    /**
     * Verifica se existe um módulo com o nome informado.
     * 
     * @param nomeModulo Nome do módulo
     * @return true se existir, false caso contrário
     */
    boolean existeModuloPorNome(String nomeModulo);

    /**
     * Busca módulos que contêm perguntas.
     * 
     * @return Lista de módulos que têm perguntas associadas
     */
    @Query("SELECT m FROM Modulo m WHERE SIZE(m.perguntas) > 0")
    List<Modulo> buscarModulosComPerguntas();

    /**
     * Busca módulos sem perguntas.
     * 
     * @return Lista de módulos que não têm perguntas associadas
     */
    @Query("SELECT m FROM Modulo m WHERE SIZE(m.perguntas) = 0")
    List<Modulo> buscarModulosSemPerguntas();

    /**
     * Conta perguntas por módulo.
     * 
     * @param idModulo ID do módulo
     * @return Número de perguntas do módulo
     */
    @Query("SELECT SIZE(m.perguntas) FROM Modulo m WHERE m.idModulo = :idModulo")
    long contarPerguntasPorModulo(@Param("idModulo") Integer idModulo);

    /**
     * Busca módulos ordenados por nome.
     * 
     * @return Lista de módulos ordenados alfabeticamente
     */
    @Query("SELECT m FROM Modulo m ORDER BY m.modulo ASC")
    List<Modulo> buscarModulosOrdenadosPorNome();
} 