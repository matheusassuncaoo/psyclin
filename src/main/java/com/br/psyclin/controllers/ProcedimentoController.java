package com.br.psyclin.controllers;

import com.br.psyclin.models.Procedimento;
import com.br.psyclin.services.ProcedimentoService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;

/**
 * Controller REST para operações com Procedimentos.
 * Endpoints para cadastro, atualização, exclusão e busca de procedimentos.
 */
@RestController
@RequestMapping("/procedimento")
@Validated
public class ProcedimentoController {

    @Autowired
    private ProcedimentoService procedimentoService;

    /**
     * Lista todos os procedimentos.
     */
    @GetMapping
    public ResponseEntity<List<Procedimento>> listarTodos() {
        List<Procedimento> procedimentos = procedimentoService.listarTodos();
        return ResponseEntity.ok().body(procedimentos);
    }

    /**
     * Busca um procedimento por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Procedimento> buscarPorId(@PathVariable Integer id) {
        Procedimento procedimento = procedimentoService.buscarProcedimentoPorId(id);
        return ResponseEntity.ok().body(procedimento);
    }
    
    /**
     * Busca um procedimento por código.
     */
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Procedimento> buscarPorCodigo(@PathVariable String codigo) {
        Procedimento procedimento = procedimentoService.buscarProcedimentoPorCodigo(codigo);
        return ResponseEntity.ok().body(procedimento);
    }

    /**
     * Busca procedimentos por descrição.
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Procedimento>> buscarPorDescricao(@RequestParam String descricao) {
        List<Procedimento> procedimentos = procedimentoService.buscarPorDescricao(descricao);
        return ResponseEntity.ok().body(procedimentos);
    }

    /**
     * Lista procedimentos ordenados por descrição.
     */
    @GetMapping("/ordenados")
    public ResponseEntity<List<Procedimento>> listarOrdenados() {
        List<Procedimento> procedimentos = procedimentoService.listarOrdenadosPorDescricao();
        return ResponseEntity.ok().body(procedimentos);
    }

    /**
     * Cadastra um novo procedimento.
     */
    @PostMapping
    @Validated
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Procedimento procedimento) {
        Procedimento salvo = procedimentoService.cadastrarProcedimento(procedimento);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(salvo.getIdProcedimento()).toUri();
        return ResponseEntity.created(uri).build();
    }

    /**
     * Atualiza um procedimento existente.
     */
    @PutMapping("/{id}")
    @Validated
    public ResponseEntity<Void> atualizar(@Valid @RequestBody Procedimento procedimento, @PathVariable Integer id) {
        procedimento.setIdProcedimento(id);
        procedimentoService.atualizarProcedimento(id, procedimento);
        return ResponseEntity.noContent().build();
    }

    /**
     * Exclui um procedimento.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        procedimentoService.excluirProcedimento(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Conta o total de procedimentos disponíveis para o dashboard.
     * Endpoint otimizado que retorna apenas a contagem do catálogo de serviços.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> contarTotalProcedimentos() {
        Long count = procedimentoService.contarTotalProcedimentos();
        return ResponseEntity.ok().body(count);
    }
}
