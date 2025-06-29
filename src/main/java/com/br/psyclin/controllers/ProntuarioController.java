package com.br.psyclin.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.br.psyclin.models.Prontuario;
import com.br.psyclin.services.ProntuarioService;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gerenciamento de prontuários.
 * Fornece endpoints para operações CRUD e consultas específicas de prontuários.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@RestController
@RequestMapping("/prontuario")
@CrossOrigin(origins = "*")
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    public ProntuarioController(ProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    /**
     * Endpoint para contar o total de prontuários (histórico completo).
     * 
     * @return ResponseEntity com a contagem total de prontuários
     */
    @GetMapping("/count")
    public ResponseEntity<Long> contarTotalProntuarios() {
        try {
            Long total = prontuarioService.contarTotalProntuarios();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para contar prontuários criados hoje.
     * 
     * @return ResponseEntity com a contagem de prontuários de hoje
     */
    @GetMapping("/count/hoje")
    public ResponseEntity<Long> contarProntuariosHoje() {
        try {
            Long total = prontuarioService.contarProntuariosHoje();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para contar prontuários dos últimos 30 dias.
     * 
     * @return ResponseEntity com a contagem de prontuários dos últimos 30 dias
     */
    @GetMapping("/count/ultimos-30-dias")
    public ResponseEntity<Long> contarProntuariosUltimos30Dias() {
        try {
            Long total = prontuarioService.contarProntuariosUltimos30Dias();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para listar todos os prontuários.
     * 
     * @return ResponseEntity com a lista de prontuários
     */
    @GetMapping
    public ResponseEntity<List<Prontuario>> listarTodos() {
        try {
            List<Prontuario> prontuarios = prontuarioService.listarTodos();
            return ResponseEntity.ok(prontuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para buscar prontuário por ID.
     * 
     * @param id ID do prontuário
     * @return ResponseEntity com o prontuário encontrado ou 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<Prontuario> buscarPorId(@PathVariable Integer id) {
        try {
            Optional<Prontuario> prontuario = prontuarioService.buscarPorId(id);
            return prontuario.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para buscar prontuários por paciente.
     * 
     * @param idPaciente ID do paciente
     * @return ResponseEntity com a lista de prontuários do paciente
     */
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<Prontuario>> buscarPorPaciente(@PathVariable Integer idPaciente) {
        try {
            List<Prontuario> prontuarios = prontuarioService.buscarPorPaciente(idPaciente);
            return ResponseEntity.ok(prontuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para buscar prontuários por profissional.
     * 
     * @param idProfissional ID do profissional
     * @return ResponseEntity com a lista de prontuários do profissional
     */
    @GetMapping("/profissional/{idProfissional}")
    public ResponseEntity<List<Prontuario>> buscarPorProfissional(@PathVariable Integer idProfissional) {
        try {
            List<Prontuario> prontuarios = prontuarioService.buscarPorProfissional(idProfissional);
            return ResponseEntity.ok(prontuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para buscar prontuários por período.
     * 
     * @param dataInicio data de início (formato: YYYY-MM-DD)
     * @param dataFim data de fim (formato: YYYY-MM-DD)
     * @return ResponseEntity com a lista de prontuários no período
     */
    @GetMapping("/periodo")
    public ResponseEntity<List<Prontuario>> buscarPorPeriodo(
            @RequestParam String dataInicio,
            @RequestParam String dataFim) {
        try {
            LocalDate inicio = LocalDate.parse(dataInicio);
            LocalDate fim = LocalDate.parse(dataFim);
            List<Prontuario> prontuarios = prontuarioService.buscarPorPeriodo(inicio, fim);
            return ResponseEntity.ok(prontuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint para buscar os últimos prontuários criados.
     * 
     * @param limite número máximo de prontuários (padrão: 10)
     * @return ResponseEntity com a lista dos últimos prontuários
     */
    @GetMapping("/ultimos")
    public ResponseEntity<List<Prontuario>> buscarUltimosProntuarios(
            @RequestParam(defaultValue = "10") int limite) {
        try {
            List<Prontuario> prontuarios = prontuarioService.buscarUltimosProntuarios(limite);
            return ResponseEntity.ok(prontuarios);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para criar um novo prontuário.
     * 
     * @param prontuario dados do prontuário
     * @return ResponseEntity com o prontuário criado
     */
    @PostMapping
    public ResponseEntity<Prontuario> criar(@RequestBody Prontuario prontuario) {
        try {
            Prontuario novoProntuario = prontuarioService.salvar(prontuario);
            return ResponseEntity.ok(novoProntuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint para atualizar um prontuário existente.
     * 
     * @param id ID do prontuário
     * @param prontuario dados atualizados
     * @return ResponseEntity com o prontuário atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<Prontuario> atualizar(@PathVariable Integer id, @RequestBody Prontuario prontuario) {
        try {
            Prontuario prontuarioAtualizado = prontuarioService.atualizar(id, prontuario);
            return ResponseEntity.ok(prontuarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para remover um prontuário.
     * 
     * @param id ID do prontuário
     * @return ResponseEntity vazio
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        try {
            prontuarioService.remover(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
