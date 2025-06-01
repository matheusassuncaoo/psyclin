package com.br.psyclin.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.br.psyclin.models.Profissional;

import com.br.psyclin.services.ProfissionalService;

@RestController
@RequestMapping("/api/profissionais")
@Validated
public class ProfissionalController {

      @Autowired
    private ProfissionalService profissionalService;

    // GET /api/profissionais - Listar todos os profissionais (com filtro opcional por status)
    @GetMapping
    public ResponseEntity<List<Profissional>> buscarTodos(@RequestParam(required = false) Profissional.StatusProfissional status) {
        List<Profissional> profissionais;
        if (status != null) {
            profissionais = profissionalService.buscarPorStatus(status);
        } else {
            profissionais = profissionalService.buscarTodos();
        }
        return ResponseEntity.ok(profissionais);
    }

    // GET /api/profissionais/{id} - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Profissional> buscarPorId(@PathVariable Integer id) {
        return profissionalService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/profissionais/nome/{nome} - Buscar por nome
    @GetMapping("/nome/{nome}")
    public ResponseEntity<List<Profissional>> buscarPorNome(@PathVariable String nome) {
        List<Profissional> profissionais = profissionalService.buscarPorNome(nome);
        return ResponseEntity.ok(profissionais);
    }

    // GET /api/profissionais/cpf/{cpf} - Buscar por CPF
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Profissional> buscarPorCpf(@PathVariable String cpf) {
        return profissionalService.buscarPorCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/profissionais/tipo/{tipo} - Buscar por tipo
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Profissional>> buscarPorTipo(@PathVariable Profissional.TipoProfissional tipo) {
        List<Profissional> profissionais = profissionalService.buscarPorTipo(tipo);
        return ResponseEntity.ok(profissionais);
    }

    // GET /api/profissionais/supervisor/{idSupervisor} - Buscar por supervisor
    @GetMapping("/supervisor/{idSupervisor}")
    public ResponseEntity<List<Profissional>> buscarPorSupervisor(@PathVariable Integer idSupervisor) {
        try {
            List<Profissional> profissionais = profissionalService.buscarPorSupervisor(idSupervisor);
            return ResponseEntity.ok(profissionais);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/profissionais/sem-supervisor - Buscar sem supervisor
    @GetMapping("/sem-supervisor")
    public ResponseEntity<List<Profissional>> buscarSemSupervisor() {
        List<Profissional> profissionais = profissionalService.buscarSemSupervisor();
        return ResponseEntity.ok(profissionais);
    }

    // POST /api/profissionais - Criar profissional
    @PostMapping
    public ResponseEntity<Profissional> criar(@Validated @RequestBody Profissional profissional) {
        Profissional novoProfissional = profissionalService.salvar(profissional);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(novoProfissional.getIdProfissio())
                .toUri();
        return ResponseEntity.created(uri).body(novoProfissional);
    }

    // PUT /api/profissionais/{id} - Atualizar profissional
    @PutMapping("/{id}")
    public ResponseEntity<Profissional> atualizar(@PathVariable Integer id, @Validated @RequestBody Profissional profissional) {
        return profissionalService.buscarPorId(id)
                .map(profissionalExistente -> {
                    profissional.setIdProfissio(id);
                    Profissional profissionalAtualizado = profissionalService.salvar(profissional);
                    return ResponseEntity.ok(profissionalAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/profissionais/{id}/status - Atualizar status
    @PutMapping("/{id}/status")
    public ResponseEntity<Profissional> atualizarStatus(@PathVariable Integer id, @RequestParam Profissional.StatusProfissional status) {
        try {
            Profissional profissionalAtualizado = profissionalService.atualizarStatus(id, status);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH /api/profissionais/{id}/supervisor - Atribuir supervisor
    @PutMapping("/{id}/supervisor")
    public ResponseEntity<Profissional> atribuirSupervisor(@PathVariable Integer id, @RequestParam Integer idSupervisor) {
        try {
            Profissional profissionalAtualizado = profissionalService.atribuirSupervisor(id, idSupervisor);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH /api/profissionais/{id}/remover-supervisor - Remover supervisor
    @PutMapping("/{id}/remover-supervisor")
    public ResponseEntity<Profissional> removerSupervisor(@PathVariable Integer id) {
        try {
            Profissional profissionalAtualizado = profissionalService.removerSupervisor(id);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/profissionais/{id} - Excluir profissional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        try {
            profissionalService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}