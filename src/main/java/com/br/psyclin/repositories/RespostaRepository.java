package com.br.psyclin.repositories;

import com.br.psyclin.models.Resposta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações relacionadas a Respostas de Anamnese.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Repository
public interface RespostaRepository extends JpaRepository<Resposta, Integer> {

    /**
     * Busca uma resposta por ID.
     * 
     * @param idResposta ID da resposta
     * @return Optional contendo a resposta se encontrada
     */
    Optional<Resposta> buscarRespostaPorId(Integer idResposta);

    /**
     * Busca respostas por anamnese.
     * 
     * @param idAnamnese ID da anamnese
     * @return Lista de respostas da anamnese
     */
    @Query("SELECT r FROM Resposta r WHERE r.anamnese.idAnamnese = :idAnamnese")
    List<Resposta> buscarRespostasPorAnamnese(@Param("idAnamnese") Integer idAnamnese);

    /**
     * Busca respostas por pergunta.
     * 
     * @param idPergunta ID da pergunta
     * @return Lista de respostas para a pergunta
     */
    @Query("SELECT r FROM Resposta r WHERE r.pergunta.idPergunta = :idPergunta")
    List<Resposta> buscarRespostasPorPergunta(@Param("idPergunta") Integer idPergunta);

    /**
     * Busca respostas por anamnese e pergunta.
     * 
     * @param idAnamnese ID da anamnese
     * @param idPergunta ID da pergunta
     * @return Lista de respostas da anamnese para a pergunta específica
     */
    @Query("SELECT r FROM Resposta r WHERE r.anamnese.idAnamnese = :idAnamnese AND r.pergunta.idPergunta = :idPergunta")
    List<Resposta> buscarRespostasPorAnamneseEPergunta(@Param("idAnamnese") Integer idAnamnese, @Param("idPergunta") Integer idPergunta);

    /**
     * Busca respostas objetivas (sim/não).
     * 
     * @param respostaObjetiva Valor da resposta objetiva
     * @return Lista de respostas objetivas com o valor especificado
     */
    List<Resposta> buscarRespostasObjetivas(Boolean respostaObjetiva);

    /**
     * Busca respostas subjetivas que contêm o texto.
     * 
     * @param textoResposta Texto ou parte do texto da resposta
     * @return Lista de respostas subjetivas que contêm o texto
     */
    @Query("SELECT r FROM Resposta r WHERE r.respostaSubjetiva LIKE %:textoResposta%")
    List<Resposta> buscarRespostasSubjetivasPorTexto(@Param("textoResposta") String textoResposta);

    /**
     * Busca respostas por anamnese que têm resposta objetiva.
     * 
     * @param idAnamnese ID da anamnese
     * @return Lista de respostas objetivas da anamnese
     */
    @Query("SELECT r FROM Resposta r WHERE r.anamnese.idAnamnese = :idAnamnese AND r.respostaObjetiva IS NOT NULL")
    List<Resposta> buscarRespostasObjetivasPorAnamnese(@Param("idAnamnese") Integer idAnamnese);

    /**
     * Busca respostas por anamnese que têm resposta subjetiva.
     * 
     * @param idAnamnese ID da anamnese
     * @return Lista de respostas subjetivas da anamnese
     */
    @Query("SELECT r FROM Resposta r WHERE r.anamnese.idAnamnese = :idAnamnese AND r.respostaSubjetiva IS NOT NULL")
    List<Resposta> buscarRespostasSubjetivasPorAnamnese(@Param("idAnamnese") Integer idAnamnese);

    /**
     * Verifica se existe resposta para a anamnese e pergunta.
     * 
     * @param idAnamnese ID da anamnese
     * @param idPergunta ID da pergunta
     * @return true se existir, false caso contrário
     */
    @Query("SELECT COUNT(r) > 0 FROM Resposta r WHERE r.anamnese.idAnamnese = :idAnamnese AND r.pergunta.idPergunta = :idPergunta")
    boolean existeRespostaPorAnamneseEPergunta(@Param("idAnamnese") Integer idAnamnese, @Param("idPergunta") Integer idPergunta);

    /**
     * Conta respostas por anamnese.
     * 
     * @param idAnamnese ID da anamnese
     * @return Número de respostas da anamnese
     */
    @Query("SELECT COUNT(r) FROM Resposta r WHERE r.anamnese.idAnamnese = :idAnamnese")
    long contarRespostasPorAnamnese(@Param("idAnamnese") Integer idAnamnese);

    /**
     * Busca respostas que têm tanto objetiva quanto subjetiva.
     * 
     * @return Lista de respostas que têm ambos os tipos
     */
    @Query("SELECT r FROM Resposta r WHERE r.respostaObjetiva IS NOT NULL AND r.respostaSubjetiva IS NOT NULL")
    List<Resposta> buscarRespostasCompletas();
} 