package com.br.psyclin.controllers;

import java.net.URI;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import com.br.psyclin.models.Paciente;
import com.br.psyclin.models.Paciente.CreatePaciente;
import com.br.psyclin.models.Paciente.UpdatePaciente;
import com.br.psyclin.services.PacienteService;

@RestController
@RequestMapping("/paciente")
@Validated
public class PacienteController {

    private static final Logger logger = LoggerFactory.getLogger(PacienteController.class);

    @Autowired
    private PacienteService pacienteService;

    // GET /paciente - Listar todos os pacientes (com filtro opcional por statusPaciente)
    @GetMapping
    public ResponseEntity<List<Paciente>> findAll(@RequestParam(required = false) Integer statusPaciente) {
        logger.info("Recebida requisição GET /paciente com statusPaciente={}", statusPaciente);
        List<Paciente> pacientes;
        if (statusPaciente != null) {
            logger.info("Filtrando pacientes com statusPaciente = {}", statusPaciente);
            pacientes = pacienteService.findByStatusPaciente(statusPaciente);
        } else {
            logger.info("Listando todos os pacientes");
            pacientes = pacienteService.findAll();
        }
        logger.info("Retornando {} pacientes", pacientes.size());
        return ResponseEntity.ok().body(pacientes);
    }

    // GET /paciente/{id} - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> findById(@PathVariable Long id) {
        Paciente obj = this.pacienteService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    // GET /paciente/cod/{codPaciente} - Buscar por codPaciente
    @GetMapping("/cod/{codPaciente}")
    public ResponseEntity<Paciente> findByCodPaciente(@PathVariable String codPaciente) {
        Paciente obj = this.pacienteService.findByCodPaciente(codPaciente);
        return ResponseEntity.ok().body(obj);
    }

    // GET /paciente/nome/{nomePaciente} - Buscar por nomePaciente
    @GetMapping("/nome/{nomePaciente}")
    public ResponseEntity<List<Paciente>> findByNomePaciente(@PathVariable String nomePaciente) {
        List<Paciente> obj = this.pacienteService.findByNomePaciente(nomePaciente);
        return ResponseEntity.ok().body(obj);
    }

    // GET /paciente/cpf/{cpfPaciente} - Buscar por CPF
    @GetMapping("/cpf/{cpfPaciente}")
    public ResponseEntity<Paciente> findByCpfPaciente(@PathVariable String cpfPaciente) {
        Paciente obj = this.pacienteService.findByCpfPaciente(cpfPaciente);
        return ResponseEntity.ok().body(obj);
    }

    // POST /paciente - Criar paciente
    @PostMapping
    @Validated(CreatePaciente.class)
    public ResponseEntity<Void> create(@Validated @RequestBody Paciente obj) {
        Paciente created = this.pacienteService.create(obj);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    // PUT /paciente/{id} - Atualizar paciente
    @PutMapping("/{id}")
    @Validated(UpdatePaciente.class)
    public ResponseEntity<Void> update(@Validated @RequestBody Paciente obj, @PathVariable Long id) {
        obj.setId(id);
        this.pacienteService.update(obj);
        return ResponseEntity.noContent().build();
    }

    // DELETE /paciente/{id} - Deletar paciente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        this.pacienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}