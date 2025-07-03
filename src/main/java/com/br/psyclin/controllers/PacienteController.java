package com.br.psyclin.controllers;

import com.br.psyclin.dto.response.ApiResponseDTO;
import com.br.psyclin.dto.response.PacienteResponseDTO;
import com.br.psyclin.dto.request.PacienteUpdateDTO;
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
import jakarta.validation.Valid;
import java.util.List;

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
    public ResponseEntity<ApiResponseDTO<List<PacienteResponseDTO>>> listarTodos() {
        try {
            List<Paciente> pacientes = pacienteService.listarTodos();
            List<PacienteResponseDTO> pacientesDTO = pacienteService.converterParaDTO(pacientes);
            return ResponseEntity.ok(ApiResponseDTO.success("Pacientes listados com sucesso", pacientesDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao listar pacientes", e.getMessage()));
        }
    }

    /**
     * Lista apenas pacientes ativos.
     */
    @GetMapping("/ativos")
    public ResponseEntity<ApiResponseDTO<List<PacienteResponseDTO>>> listarAtivos() {
        try {
            List<Paciente> pacientesAtivos = pacienteService.listarAtivos();
            List<PacienteResponseDTO> pacientesDTO = pacienteService.converterParaDTO(pacientesAtivos);
            return ResponseEntity.ok(ApiResponseDTO.success("Pacientes ativos listados", pacientesDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao listar pacientes ativos", e.getMessage()));
        }
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
    public ResponseEntity<ApiResponseDTO<PacienteResponseDTO>> buscarPorId(@PathVariable Integer id) {
        try {
            Paciente paciente = pacienteService.buscarPacientePorId(id);
            PacienteResponseDTO pacienteDTO = pacienteService.converterParaDTO(paciente);
            return ResponseEntity.ok(ApiResponseDTO.success("Paciente encontrado", pacienteDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao buscar paciente", e.getMessage()));
        }
    }

    /**
     * Cadastra um novo paciente.
     */
    @PostMapping
    public ResponseEntity<ApiResponseDTO<PacienteResponseDTO>> cadastrar(@Valid @RequestBody Paciente paciente) {
        try {
            Paciente salvo = pacienteService.cadastrarPaciente(paciente);
            PacienteResponseDTO pacienteDTO = pacienteService.converterParaDTO(salvo);
            return ResponseEntity.ok(ApiResponseDTO.success("Paciente cadastrado com sucesso", pacienteDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao cadastrar paciente", e.getMessage()));
        }
    }

    /**
     * Atualiza um paciente existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<PacienteResponseDTO>> atualizar(@Valid @RequestBody PacienteUpdateDTO dadosAtualizacao, @PathVariable Integer id) {
        try {
            Paciente atualizado = pacienteService.atualizarPacienteComDTO(id, dadosAtualizacao);
            PacienteResponseDTO pacienteDTO = pacienteService.converterParaDTO(atualizado);
            return ResponseEntity.ok(ApiResponseDTO.success("Paciente atualizado com sucesso", pacienteDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao atualizar paciente", e.getMessage()));
        }
    }

    /**
     * Inativa (exclui logicamente) um paciente.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<String>> excluir(@PathVariable Integer id) {
        try {
            pacienteService.excluirPaciente(id);
            return ResponseEntity.ok(ApiResponseDTO.success("Paciente inativado com sucesso", "ID: " + id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao inativar paciente", e.getMessage()));
        }
    }
} 