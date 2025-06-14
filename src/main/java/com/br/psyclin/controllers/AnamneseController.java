package com.br.psyclin.controllers;

import com.br.psyclin.models.Anamnese;
import com.br.psyclin.services.AnamneseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/anamneses")
@Validated
public class AnamneseController {

    @Autowired
    private AnamneseService anamneseService;

    /**
     * Lista todas as anamneses cadastradas
     * @return Lista de anamneses
     */
    @GetMapping
    public ResponseEntity<List<Anamnese>> listarTodas() {
        return ResponseEntity.ok(anamneseService.buscarTodas());
    }

    /**
     * Busca uma anamnese pelo ID
     * @param id ID da anamnese
     * @return Anamnese encontrada ou 404 se não existir
     */
    @GetMapping("/{id}")
    public ResponseEntity<Anamnese> buscarPorId(@PathVariable Long id) {
        return anamneseService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lista todas as anamneses associadas a um profissional
     * @param idProfissional ID do profissional
     * @return Lista de anamneses do profissional
     */
    @GetMapping("/profissional/{idProfissional}")
    public ResponseEntity<List<Anamnese>> buscarPorProfissional(@PathVariable Long idProfissional) {
        return ResponseEntity.ok(anamneseService.buscarPorProfissional(idProfissional));
    }

    /**
     * Cadastra uma nova anamnese
     * @param anamnese Objeto da anamnese
     * @return Anamnese criada com URI
     */
    @PostMapping
    public ResponseEntity<Anamnese> criar(@Valid @RequestBody Anamnese anamnese) {
        Anamnese nova = anamneseService.salvar(anamnese);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(nova.getIdAnamnese())
                .toUri();
        return ResponseEntity.created(uri).body(nova);
    }

    /**
     * Atualiza uma anamnese existente
     * @param id ID da anamnese
     * @param anamnese Dados atualizados
     * @return Anamnese atualizada ou 404 se não existir
     */
    @PutMapping("/{id}")
    public ResponseEntity<Anamnese> atualizar(@PathVariable Long id, @Valid @RequestBody Anamnese anamnese) {
        return anamneseService.atualizar(id, anamnese)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Remove uma anamnese pelo ID
     * @param id ID da anamnese
     * @return 204 No Content se removida, 404 se não encontrada
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (anamneseService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
