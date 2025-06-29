package com.br.psyclin.services;

import com.br.psyclin.models.Pergunta;
import com.br.psyclin.repositories.PerguntaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

/**
 * Service para operações de negócio relacionadas a Perguntas.
 * Responsável por cadastro, atualização, exclusão e busca de perguntas.
 */
@Service
public class PerguntaService {

    @Autowired
    private PerguntaRepository perguntaRepository;

    /**
     * Cadastra uma nova pergunta.
     * @param pergunta Pergunta a ser cadastrada
     * @return Pergunta salva
     */
    public Pergunta cadastrarPergunta(Pergunta pergunta) {
        // TODO: Validar duplicidade de texto e outras regras
        return perguntaRepository.save(pergunta);
    }

    /**
     * Atualiza os dados de uma pergunta existente.
     * @param id ID da pergunta
     * @param dadosAtualizados Dados a serem atualizados
     * @return Pergunta atualizada
     */
    public Pergunta atualizarPergunta(Integer id, Pergunta dadosAtualizados) {
        Optional<Pergunta> existente = perguntaRepository.findByIdPergunta(id);
        // ...
        return null;
    }

    /**
     * Exclui uma pergunta.
     * @param id ID da pergunta
     */
    public void excluirPergunta(Integer id) {
        // TODO: Verificar vínculos antes de excluir
    }

    /**
     * Busca uma pergunta pelo ID.
     * @param id ID da pergunta
     * @return Optional contendo a pergunta, se encontrada
     */
    public Optional<Pergunta> buscarPerguntaPorId(Integer id) {
        return perguntaRepository.findByIdPergunta(id);
    }
} 