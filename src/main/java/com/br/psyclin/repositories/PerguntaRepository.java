package com.br.psyclin.repositories;

import com.br.psyclin.models.Pergunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações relacionadas a Perguntas de Anamnese.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Repository
public interface PerguntaRepository extends JpaRepository<Pergunta, Integer> {

    /**
     * Busca uma pergunta por ID.
     * 
     * @param idPergunta ID da pergunta
     * @return Optional contendo a pergunta se encontrada
     */
    Optional<Pergunta> buscarPerguntaPorId(Integer idPergunta);

    /**
     * Busca perguntas por texto (contendo).
     * 
     * @param textoPergunta Texto ou parte do texto da pergunta
     * @return Lista de perguntas que contêm o texto
     */
    @Query("SELECT p FROM Pergunta p WHERE p.pergunta LIKE %:textoPergunta%")
    List<Pergunta> buscarPerguntasPorTexto(@Param("textoPergunta") String textoPergunta);

    /**
     * Busca perguntas por tipo (O, S, A).
     * 
     * @param tipoPergunta Tipo da pergunta
     * @return Lista de perguntas do tipo especificado
     */
    List<Pergunta> buscarPerguntasPorTipo(Pergunta.TipoPergunta tipoPergunta);

    /**
     * Busca perguntas por módulo.
     * 
     * @param idModulo ID do módulo
     * @return Lista de perguntas do módulo especificado
     */
    @Query("SELECT p FROM Pergunta p JOIN p.modulos m WHERE m.idModulo = :idModulo")
    List<Pergunta> buscarPerguntasPorModulo(@Param("idModulo") Integer idModulo);

    /**
     * Busca perguntas por módulo e tipo.
     * 
     * @param idModulo ID do módulo
     * @param tipoPergunta Tipo da pergunta
     * @return Lista de perguntas do módulo e tipo especificados
     */
    @Query("SELECT p FROM Pergunta p JOIN p.modulos m WHERE m.idModulo = :idModulo AND p.tipo = :tipoPergunta")
    List<Pergunta> buscarPerguntasPorModuloETipo(@Param("idModulo") Integer idModulo, @Param("tipoPergunta") Pergunta.TipoPergunta tipoPergunta);

    /**
     * Verifica se existe uma pergunta com o texto informado.
     * 
     * @param pergunta Texto da pergunta
     * @return true se existir, false caso contrário
     */
    boolean existePerguntaPorTexto(String pergunta);

    /**
     * Busca perguntas objetivas.
     * 
     * @return Lista de perguntas objetivas
     */
    @Query("SELECT p FROM Pergunta p WHERE p.tipo = 'O'")
    List<Pergunta> buscarPerguntasObjetivas();

    /**
     * Busca perguntas subjetivas.
     * 
     * @return Lista de perguntas subjetivas
     */
    @Query("SELECT p FROM Pergunta p WHERE p.tipo = 'S'")
    List<Pergunta> buscarPerguntasSubjetivas();

    /**
     * Busca perguntas que aceitam ambos os tipos de resposta.
     * 
     * @return Lista de perguntas que aceitam ambos os tipos
     */
    @Query("SELECT p FROM Pergunta p WHERE p.tipo = 'A'")
    List<Pergunta> buscarPerguntasAmbas();
} 