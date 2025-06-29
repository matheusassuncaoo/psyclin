package com.br.psyclin.controllers;

import com.br.psyclin.models.Paciente;
import com.br.psyclin.services.PacienteService;
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
import java.util.Optional;

/**
 * Controller REST para operações com Pacientes.
 * Endpoints para cadastro, atualização, exclusão (inativação) e busca por id.
 */
@RestController
@RequestMapping("/paciente")
@CrossOrigin(origins = "*", maxAge = 3600)
@Validated
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    /**
     * Lista todos os pacientes.
     */
    @GetMapping
    public ResponseEntity<List<Paciente>> listarTodos() {
        List<Paciente> pacientes = pacienteService.listarTodos();
        return ResponseEntity.ok().body(pacientes);
    }

    /**
     * Lista apenas pacientes ativos.
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<Paciente>> listarAtivos() {
        List<Paciente> pacientesAtivos = pacienteService.listarAtivos();
        return ResponseEntity.ok().body(pacientesAtivos);
    }

    /**
     * Conta pacientes ativos para dashboard.
     */
    @GetMapping("/contar-ativos")
    public ResponseEntity<Long> contarAtivos() {
        long count = pacienteService.contarAtivos();
        return ResponseEntity.ok().body(count);
    }

    /**
     * Busca um paciente por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Integer id) {
        Paciente paciente = pacienteService.buscarPacientePorId(id);
        return ResponseEntity.ok().body(paciente);
    }

    /**
     * Cadastra um novo paciente.
     */
    @PostMapping
    @Validated
    public ResponseEntity<Void> cadastrar(@Valid @RequestBody Paciente paciente) {
        Paciente salvo = pacienteService.cadastrarPaciente(paciente);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(salvo.getIdPaciente()).toUri();
        return ResponseEntity.created(uri).build();
    }

    /**
     * Atualiza um paciente existente.
     */
    @PutMapping("/{id}")
    @Validated
    public ResponseEntity<Void> atualizar(@Valid @RequestBody Paciente paciente, @PathVariable Integer id) {
        paciente.setIdPaciente(id);
        pacienteService.atualizarPaciente(id, paciente);
        return ResponseEntity.noContent().build();
    }

    /**
     * Inativa (exclui logicamente) um paciente.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        pacienteService.excluirPaciente(id);
        return ResponseEntity.noContent().build();
    }
} 