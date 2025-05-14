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
import com.br.psyclin.models.Profissional.CreateProfissional;
import com.br.psyclin.models.Profissional.UpdateProfissional;
import com.br.psyclin.services.ProfissionalService;

@RestController
@RequestMapping("/profissional")
@Validated
public class ProfissionalController {

    @Autowired
    private ProfissionalService profissionalService;

    // GET /profissional/{id} - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Profissional> findById(@PathVariable Long id) {
        Profissional obj = this.profissionalService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    // GET /profissional/cod/{codProf} - Buscar por codProf
    @GetMapping("/cod/{codProf}")
    public ResponseEntity<Profissional> findByCodProf(@PathVariable String codProf) {
        Profissional obj = this.profissionalService.findByCodProf(codProf);
        return ResponseEntity.ok().body(obj);
    }

    // GET /profissional/nome/{nomeProf} - Buscar por nomeProf
    @GetMapping("/nome/{nomeProf}")
    public ResponseEntity<List<Profissional>> findByNomeProf(@PathVariable String nomeProf) {
        List<Profissional> obj = this.profissionalService.findByNomeProf(nomeProf);
        return ResponseEntity.ok().body(obj);
    }

    // GET /profissional/supervisor/{supProf} - Buscar por supProf
    @GetMapping("/supervisor/{supProf}")
    public ResponseEntity<List<Profissional>> findBySupProf(@PathVariable String supProf) {
        List<Profissional> obj = this.profissionalService.findBySupProf(supProf);
        return ResponseEntity.ok().body(obj);
    }

    // GET /profissional/tipo/{tipoProf} - Buscar por tipoProf
    @GetMapping("/tipo/{tipoProf}")
    public ResponseEntity<List<Profissional>> findByTipoProf(@PathVariable Integer tipoProf) {
        List<Profissional> obj = this.profissionalService.findByTipoProf(tipoProf);
        return ResponseEntity.ok().body(obj);
    }

    // GET /profissional/status/{statusProf} - Buscar por statusProf
    @GetMapping("/status/{statusProf}")
    public ResponseEntity<List<Profissional>> findByStatusProf(@PathVariable Integer statusProf) {
        List<Profissional> profissionais = this.profissionalService.findByStatusProf(statusProf);
        return ResponseEntity.ok().body(profissionais);
    }

    // POST /profissional/login - Autenticação
    @PostMapping("/login")
    public ResponseEntity<Profissional> login(@RequestParam String codProf, @RequestParam String senhaProf) {
        Profissional obj = this.profissionalService.authenticate(codProf, senhaProf);
        return ResponseEntity.ok().body(obj);
    }

    // POST /profissional - Criar profissional
    @PostMapping
    @Validated(CreateProfissional.class)
    public ResponseEntity<Void> create(@Validated @RequestBody Profissional obj) {
        Profissional created = this.profissionalService.create(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    // PUT /profissional/{id} - Atualizar profissional
    @PutMapping("/{id}")
    @Validated(UpdateProfissional.class)
    public ResponseEntity<Void> update(@Validated @RequestBody Profissional obj, @PathVariable Long id) {
        obj.setId(id);
        this.profissionalService.update(obj);
        return ResponseEntity.noContent().build();
    }

    // DELETE /profissional/{id} - Deletar profissional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        this.profissionalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}