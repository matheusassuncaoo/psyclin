package com.br.psyclin.controllers;

import com.br.psyclin.dto.response.ApiResponseDTO;
import com.br.psyclin.dto.response.ProfissionalResponseDTO;
import com.br.psyclin.dto.request.ProfissionalUpdateDTO;
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
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponseDTO<List<ProfissionalResponseDTO>>> listarTodos() {
        try {
            List<Profissional> profissionais = profissionalService.listarTodos();
            List<ProfissionalResponseDTO> profissionaisDTO = profissionalService.converterParaDTO(profissionais);
            return ResponseEntity.ok(ApiResponseDTO.success("Profissionais listados com sucesso", profissionaisDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao listar profissionais", e.getMessage()));
        }
    }

    /**
     * Lista apenas profissionais ativos.
     */
    @GetMapping("/ativos")
    public ResponseEntity<ApiResponseDTO<List<ProfissionalResponseDTO>>> listarAtivos() {
        try {
            List<Profissional> profissionaisAtivos = profissionalService.listarAtivos();
            List<ProfissionalResponseDTO> profissionaisDTO = profissionalService.converterParaDTO(profissionaisAtivos);
            return ResponseEntity.ok(ApiResponseDTO.success("Profissionais ativos listados", profissionaisDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao listar profissionais ativos", e.getMessage()));
        }
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
    public ResponseEntity<ApiResponseDTO<ProfissionalResponseDTO>> buscarPorId(@PathVariable Integer id) {
        try {
            Profissional profissional = profissionalService.buscarProfissionalPorId(id);
            ProfissionalResponseDTO profissionalDTO = profissionalService.converterParaDTO(profissional);
            return ResponseEntity.ok(ApiResponseDTO.success("Profissional encontrado", profissionalDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao buscar profissional", e.getMessage()));
        }
    }

    /**
     * Cadastra um novo profissional.
     */
    @PostMapping
    @Validated
    public ResponseEntity<ApiResponseDTO<Profissional>> cadastrar(@Valid @RequestBody Profissional profissional) {
        try {
            Profissional salvo = profissionalService.cadastrarProfissional(profissional);
            return ResponseEntity.ok(ApiResponseDTO.success("Profissional cadastrado com sucesso", salvo));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseDTO.error("Erro ao cadastrar profissional", e.getMessage()));
        }
    }

    /**
     * Atualiza um profissional existente.
     */
    @PutMapping("/{id}")
    @Validated
    public ResponseEntity<ApiResponseDTO<Profissional>> atualizar(@Valid @RequestBody Profissional profissional, @PathVariable Integer id) {
        try {
            profissional.setIdProfissional(id);
            Profissional atualizado = profissionalService.atualizarProfissional(id, profissional);
            return ResponseEntity.ok(ApiResponseDTO.success("Profissional atualizado com sucesso", atualizado));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseDTO.error("Erro ao atualizar profissional", e.getMessage()));
        }
    }

    /**
     * Inativa (soft delete) um profissional.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<String>> excluir(@PathVariable Integer id) {
        try {
            profissionalService.excluirProfissional(id);
            return ResponseEntity.ok(ApiResponseDTO.success("Profissional inativado com sucesso", "ID: " + id));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponseDTO.error("Erro ao inativar profissional", e.getMessage()));
        }
    }
} 