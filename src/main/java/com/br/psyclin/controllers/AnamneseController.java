package com.br.psyclin.controllers;

import com.br.psyclin.dto.response.ApiResponseDTO;
import com.br.psyclin.dto.response.AnamneseResponseDTO;
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
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*", maxAge = 3600)
@Validated
public class AnamneseController {

    @Autowired
    private AnamneseService anamneseService;

    /**
     * Lista todas as anamneses.
     */
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<AnamneseResponseDTO>>> listarTodos() {
        try {
            List<Anamnese> anamneses = anamneseService.listarTodos();
            List<AnamneseResponseDTO> anamnesesDTO = anamneseService.converterParaDTO(anamneses);
            return ResponseEntity.ok(ApiResponseDTO.success("Anamneses listadas com sucesso", anamnesesDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao listar anamneses", e.getMessage()));
        }
    }

    /**
     * Lista apenas anamneses ativas.
     */
    @GetMapping("/ativas")
    public ResponseEntity<ApiResponseDTO<List<AnamneseResponseDTO>>> listarAtivas() {
        try {
            List<Anamnese> anamnesesAtivas = anamneseService.listarAtivas();
            List<AnamneseResponseDTO> anamnesesDTO = anamneseService.converterParaDTO(anamnesesAtivas);
            return ResponseEntity.ok(ApiResponseDTO.success("Anamneses ativas listadas", anamnesesDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao listar anamneses ativas", e.getMessage()));
        }
    }

    /**
     * Busca uma anamnese por id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<AnamneseResponseDTO>> buscarPorId(@PathVariable Integer id) {
        try {
            Anamnese anamnese = anamneseService.buscarAnamnesePorId(id);
            AnamneseResponseDTO anamneseDTO = anamneseService.converterParaDTO(anamnese);
            return ResponseEntity.ok(ApiResponseDTO.success("Anamnese encontrada", anamneseDTO));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao buscar anamnese", e.getMessage()));
        }
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
     * Conta o número de anamneses ativas para o dashboard.
     * Endpoint otimizado que retorna apenas a contagem, sem dados sensíveis.
     */
    @GetMapping("/ativas/count")
    public ResponseEntity<Long> contarAtivas() {
        Long count = anamneseService.contarAtivas();
        return ResponseEntity.ok().body(count);
    }

    /**
     * Atualiza apenas o status de uma anamnese.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponseDTO<String>> atualizarStatus(@PathVariable Integer id, @RequestBody String novoStatus) {
        try {
            // Remove aspas se houver
            String status = novoStatus.replaceAll("\"", "");
            anamneseService.atualizarStatusAnamnese(id, status);
            return ResponseEntity.ok(ApiResponseDTO.success("Status atualizado com sucesso", "Status: " + status));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponseDTO.error("Erro ao atualizar status", e.getMessage()));
        }
    }
}