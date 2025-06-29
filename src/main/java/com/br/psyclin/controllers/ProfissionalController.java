package com.br.psyclin.controllers;

import com.br.psyclin.models.Profissional;
import com.br.psyclin.services.ProfissionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

/**
 * Controller REST para operações com Profissionais.
 * Endpoints para cadastro, atualização, exclusão (inativação) e busca por id.
 */
@RestController
@RequestMapping("/profissional")
@CrossOrigin(origins = "*", maxAge = 3600)
@Validated
public class ProfissionalController {

    @Autowired
    private ProfissionalService profissionalService;

    /**
     * Lista todos os profissionais.
     */
    @GetMapping
    public ResponseEntity<List<Profissional>> listarTodos() {
        List<Profissional> profissionais = profissionalService.listarTodos();
        return ResponseEntity.ok().body(profissionais);
    }

    /**
     * Lista apenas profissionais ativos.
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<Profissional>> listarAtivos() {
        List<Profissional> profissionaisAtivos = profissionalService.listarAtivos();
        return ResponseEntity.ok().body(profissionaisAtivos);
    }

    /**
     * Conta profissionais ativos para dashboard (otimizado para cache de 8 horas).
     */
    @GetMapping("/contar-ativos")
    public ResponseEntity<Long> contarAtivos() {
        long count = profissionalService.contarAtivos();
        return ResponseEntity.ok().body(count);
    }

    /**
     * Busca um profissional por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Profissional> buscarPorId(@PathVariable Integer id) {
        Profissional profissional = profissionalService.buscarProfissionalPorId(id);
        return ResponseEntity.ok().body(profissional);
    }

    /**
     * Cadastra um novo profissional.
     */
    @PostMapping
    @Validated
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Profissional profissional) {
        Profissional salvo = profissionalService.cadastrarProfissional(profissional);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(salvo.getIdProfissional()).toUri();
        return ResponseEntity.created(uri).build();
    }

    /**
     * Atualiza um profissional existente.
     */
    @PutMapping("/{id}")
    @Validated
    public ResponseEntity<Void> atualizar(@Valid @RequestBody Profissional profissional, @PathVariable Integer id) {
        profissional.setIdProfissional(id);
        profissionalService.atualizarProfissional(id, profissional);
        return ResponseEntity.noContent().build();
    }

    /**
     * Inativa (exclui logicamente) um profissional.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        profissionalService.excluirProfissional(id);
        return ResponseEntity.noContent().build();
    }
} 