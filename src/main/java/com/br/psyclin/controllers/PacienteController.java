package com.br.psyclin.controllers;

import java.net.URI;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.br.psyclin.models.Paciente;
import com.br.psyclin.services.PacienteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pacientes")
@Validated
public class PacienteController {

    
    private PacienteService pacienteService;

    @Autowired
    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    /**
     * Busca todos os pacientes
     * @return Lista de pacientes
     */
    @GetMapping
    public ResponseEntity<List<Paciente>> buscarTodos() {
        List<Paciente> pacientes = pacienteService.buscarTodos();
        return ResponseEntity.ok(pacientes);
    }

    /**
     * Busca um paciente pelo ID
     * @param id ID do paciente
     * @return Paciente encontrado
     */
     @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Integer id) {
        return pacienteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Busca pacientes pelo nome
     * @param nome Nome ou parte do nome
     * @return Lista de pacientes que contêm o nome informado
     */
    @GetMapping("/nome/{nome}")
    public ResponseEntity<List<Paciente>> buscarPorNome(@PathVariable String nome) {
        List<Paciente> pacientes = pacienteService.buscarPorNome(nome);
        return ResponseEntity.ok(pacientes);
    }

     /**
     * Busca um paciente pelo CPF
     * @param cpf CPF do paciente
     * @return Paciente encontrado ou 404 se não existir
     */
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Paciente> buscarPorCpf(@PathVariable String cpf) {
        return pacienteService.buscarPorCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    /**
     * Busca um paciente pelo RG
     * @param rg RG do paciente
     * @return Paciente encontrado ou 404 se não existir
     */
    @GetMapping("/rg/{rg}")
    public ResponseEntity<Paciente> buscarPorRg(@PathVariable String rg) {
        return pacienteService.buscarPorRg(rg)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

     /**
     * Busca pacientes por status
     * @param status Status do paciente (true para ativo, false para inativo)
     * @return Lista de pacientes com o status informado
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Paciente>> buscarPorStatus(@PathVariable Boolean status) {
        List<Paciente> pacientes = pacienteService.buscarPorStatus(status);
        return ResponseEntity.ok(pacientes);
    }

     /**
     * Cria um novo paciente
     * @param paciente Dados do paciente
     * @return Paciente criado com status 201
     */
    @PostMapping
    public ResponseEntity<Paciente> criar(@Valid @RequestBody Paciente paciente) {
        Paciente novoPaciente = pacienteService.salvar(paciente);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoPaciente);
    }
   
    /**
     * Atualiza um paciente existente
     * @param id ID do paciente
     * @param paciente Dados atualizados do paciente
     * @return Paciente atualizado ou 404 se não existir
     */
    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Integer id, @Valid @RequestBody Paciente paciente) {
        return pacienteService.buscarPorId(id)
                .map(pacienteExistente -> {
                    paciente.setIdPaciente(id);
                    Paciente pacienteAtualizado = pacienteService.salvar(paciente);
                    return ResponseEntity.ok(pacienteAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Atualiza o status de um paciente
     * @param id ID do paciente
     * @param status Novo status
     * @return Paciente atualizado ou 404 se não existir
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Paciente> atualizarStatus(@PathVariable Integer id, @RequestParam Boolean status) {
        try {
            Paciente pacienteAtualizado = pacienteService.atualizarStatus(id, status);
            return ResponseEntity.ok(pacienteAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Exclui um paciente
     * @param id ID do paciente
     * @return 204 No Content se excluído com sucesso ou 404 se não existir
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        try {
            pacienteService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}