package com.br.psyclin.controllers;

import com.br.psyclin.models.Agenda;
import com.br.psyclin.services.AgendaService;
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
 * Controller REST para operações com Agenda (Agendamentos/Encontros).
 * Endpoints para cadastro, atualização, exclusão e busca de agendamentos.
 */
@RestController
@RequestMapping("/agenda")
@Validated
public class AgendaController {

    @Autowired
    private AgendaService agendaService;

    /**
     * Lista todos os agendamentos.
     */
    @GetMapping
    public ResponseEntity<List<Agenda>> listarTodos() {
        List<Agenda> agendamentos = agendaService.listarTodos();
        return ResponseEntity.ok().body(agendamentos);
    }

    /**
     * Busca um agendamento por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Agenda> buscarPorId(@PathVariable Integer id) {
        Agenda agenda = agendaService.buscarAgendamentoPorId(id);
        return ResponseEntity.ok().body(agenda);
    }

    /**
     * Cadastra um novo agendamento.
     */
    @PostMapping
    @Validated
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Agenda agenda) {
        Agenda salva = agendaService.cadastrarAgendamento(agenda);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(salva.getIdAgenda()).toUri();
        return ResponseEntity.created(uri).build();
    }

    /**
     * Atualiza um agendamento existente.
     */
    @PutMapping("/{id}")
    @Validated
    public ResponseEntity<Void> atualizar(@Valid @RequestBody Agenda agenda, @PathVariable Integer id) {
        agenda.setIdAgenda(id);
        agendaService.atualizarAgendamento(id, agenda);
        return ResponseEntity.noContent().build();
    }

    /**
     * Exclui um agendamento.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        agendaService.excluirAgendamento(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Lista agendamentos aguardando atendimento.
     */
    @GetMapping("/aguardando")
    public ResponseEntity<List<Agenda>> listarAguardando() {
        List<Agenda> agendamentosAguardando = agendaService.listarAguardando();
        return ResponseEntity.ok().body(agendamentosAguardando);
    }
    
    /**
     * Lista encontros ativos de hoje (aguardando atendimento).
     */
    @GetMapping("/hoje/ativos")
    public ResponseEntity<List<Agenda>> listarEncontrosAtivosHoje() {
        List<Agenda> encontrosHoje = agendaService.listarEncontrosAtivosHoje();
        return ResponseEntity.ok().body(encontrosHoje);
    }
    
    /**
     * Conta encontros ativos de hoje para o dashboard.
     * Endpoint otimizado que retorna apenas a contagem, sem dados sensíveis.
     */
    @GetMapping("/hoje/ativos/count")
    public ResponseEntity<Long> contarEncontrosAtivosHoje() {
        Long count = agendaService.contarEncontrosAtivosHoje();
        return ResponseEntity.ok().body(count);
    }
}
