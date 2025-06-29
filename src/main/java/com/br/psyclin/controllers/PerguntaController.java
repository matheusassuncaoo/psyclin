package com.br.psyclin.controllers;

import com.br.psyclin.models.Pergunta;
import com.br.psyclin.services.PerguntaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Optional;

/**
 * Controller REST para operações com Perguntas.
 * Endpoints para cadastro, atualização, exclusão e busca por id.
 */
@RestController
@RequestMapping("/pergunta")
public class PerguntaController {

    @Autowired
    private PerguntaService perguntaService;

    /**
     * Cadastra uma nova pergunta.
     */
    @PostMapping
    public ResponseEntity<Pergunta> cadastrar(@RequestBody Pergunta pergunta) {
        // TODO: Adicionar validação e tratamento de exceções
        Pergunta salva = perguntaService.cadastrarPergunta(pergunta);
        return ResponseEntity.ok(salva);
    }

    /**
     * Atualiza uma pergunta existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Pergunta> atualizar(@PathVariable Integer id, @RequestBody Pergunta pergunta) {
        // TODO: Adicionar validação e tratamento de exceções
        Pergunta atualizada = perguntaService.atualizarPergunta(id, pergunta);
        return ResponseEntity.ok(atualizada);
    }

    /**
     * Exclui uma pergunta.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        // TODO: Adicionar validação de segurança e tratamento de exceções
        perguntaService.excluirPergunta(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Busca uma pergunta por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pergunta> buscarPorId(@PathVariable Integer id) {
        Optional<Pergunta> pergunta = perguntaService.buscarPerguntaPorId(id);
        return pergunta.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
} 