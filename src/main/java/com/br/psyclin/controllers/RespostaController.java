package com.br.psyclin.controllers;

import com.br.psyclin.models.Resposta;
import com.br.psyclin.services.RespostaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import java.util.Optional;

/**
 * Controller REST para operações com Respostas.
 * Endpoints para cadastro, atualização, exclusão e busca por id.
 */
@RestController
@RequestMapping("/resposta")
public class RespostaController {

    @Autowired
    private RespostaService respostaService;

    /**
     * Cadastra uma nova resposta.
     */
    @PostMapping
    public ResponseEntity<Resposta> cadastrar(@RequestBody Resposta resposta) {
        // TODO: Adicionar validação e tratamento de exceções
        Resposta salva = respostaService.cadastrarResposta(resposta);
        return ResponseEntity.ok(salva);
    }

    /**
     * Atualiza uma resposta existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Resposta> atualizar(@PathVariable Integer id, @RequestBody Resposta resposta) {
        // TODO: Adicionar validação e tratamento de exceções
        Resposta atualizada = respostaService.atualizarResposta(id, resposta);
        return ResponseEntity.ok(atualizada);
    }

    /**
     * Exclui uma resposta.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        // TODO: Adicionar validação de segurança e tratamento de exceções
        respostaService.excluirResposta(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Busca uma resposta por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Resposta> buscarPorId(@PathVariable Integer id) {
        Optional<Resposta> resposta = respostaService.buscarRespostaPorId(id);
        return resposta.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
} 
 