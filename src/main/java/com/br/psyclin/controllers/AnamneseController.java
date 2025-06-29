package com.br.psyclin.controllers;

import com.br.psyclin.models.Anamnese;
import com.br.psyclin.services.AnamneseService;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

/**
 * Controller REST para operações com Anamneses.
 * Endpoints para cadastro, atualização, exclusão e busca por id.
 */
@RestController
@RequestMapping("/anamnese")
@Validated
public class AnamneseController {

    @Autowired
    private AnamneseService anamneseService;

    /**
     * Lista todas as anamneses.
     */
    @GetMapping
    public ResponseEntity<List<Anamnese>> listarTodos() {
        List<Anamnese> anamneses = anamneseService.listarTodos();
        return ResponseEntity.ok().body(anamneses);
    }

    /**
     * Busca uma anamnese por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Anamnese> buscarPorId(@PathVariable Integer id) {
        Anamnese anamnese = anamneseService.buscarAnamnesePorId(id);
        return ResponseEntity.ok().body(anamnese);
    }

    /**
     * Cadastra uma nova anamnese.
     */
    @PostMapping
    @Validated
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Anamnese anamnese) {
        Anamnese salva = anamneseService.cadastrarAnamnese(anamnese);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(salva.getIdAnamnese()).toUri();
        return ResponseEntity.created(uri).build();
    }

    /**
     * Atualiza uma anamnese existente.
     */
    @PutMapping("/{id}")
    @Validated
    public ResponseEntity<Void> atualizar(@Valid @RequestBody Anamnese anamnese, @PathVariable Integer id) {
        anamnese.setIdAnamnese(id);
        anamneseService.atualizarAnamnese(id, anamnese);
        return ResponseEntity.noContent().build();
    }

    /**
     * Exclui uma anamnese.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        anamneseService.excluirAnamnese(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Lista apenas anamneses ativas (statusFuncional = true).
     * Endpoint seguro que não expõe dados sensíveis.
     */
    @GetMapping("/ativas")
    public ResponseEntity<List<Anamnese>> listarAtivas() {
        List<Anamnese> anamnesesAtivas = anamneseService.listarAtivas();
        return ResponseEntity.ok().body(anamnesesAtivas);
    }
    
    /**
     * Conta o número de anamneses ativas para o dashboard.
     * Endpoint otimizado que retorna apenas a contagem, sem dados sensíveis.
     */
    @GetMapping("/ativas/count")
    public ResponseEntity<Long> contarAtivas() {
        Long count = anamneseService.contarAtivas();
        return ResponseEntity.ok().body(count);
    }
}