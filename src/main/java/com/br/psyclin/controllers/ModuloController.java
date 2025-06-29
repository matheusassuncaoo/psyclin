package com.br.psyclin.controllers;

import com.br.psyclin.models.Modulo;
import com.br.psyclin.services.ModuloService;
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
 * Controller REST para operações com Módulos.
 * Endpoints para cadastro, atualização, exclusão e busca por id.
 */
@RestController
@RequestMapping("/modulo")
public class ModuloController {

    @Autowired
    private ModuloService moduloService;

    /**
     * Cadastra um novo módulo.
     */
    @PostMapping
    public ResponseEntity<Modulo> cadastrar(@RequestBody Modulo modulo) {
        // TODO: Adicionar validação e tratamento de exceções
        Modulo salvo = moduloService.cadastrarModulo(modulo);
        return ResponseEntity.ok(salvo);
    }

    /**
     * Atualiza um módulo existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Modulo> atualizar(@PathVariable Integer id, @RequestBody Modulo modulo) {
        // TODO: Adicionar validação e tratamento de exceções
        Modulo atualizado = moduloService.atualizarModulo(id, modulo);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * Exclui um módulo.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        // TODO: Adicionar validação de segurança e tratamento de exceções
        moduloService.excluirModulo(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Busca um módulo por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Modulo> buscarPorId(@PathVariable Integer id) {
        Optional<Modulo> modulo = moduloService.buscarModuloPorId(id);
        return modulo.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
} 