package com.br.psyclin.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.psyclin.models.Paciente;
import com.br.psyclin.repositories.PacienteRepository;

@Service
public class PacienteService {
    
    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente buscarPorId(Long id) {
        Optional<Paciente> paciente = this.pacienteRepository.findById(id);
        return paciente.orElseThrow(() -> new RuntimeException("Paciente não encontrado" + id + Paciente.class.getName()));
    }

    public Paciente buscarPorPessoaFisCpfPessoa(String cpf) {
        Optional<Paciente> paciente = this.pacienteRepository.findByPessoaFisCpfPessoa(cpf);
        return paciente.orElseThrow(() -> new RuntimeException("Paciente não encontrado" + cpf + Paciente.class.getName()));
    }

    public Paciente buscarPorRgPaciente(String rg) {
        Optional<Paciente> paciente = this.pacienteRepository.findByRgPaciente(rg);
        return paciente.orElseThrow(() -> new RuntimeException("Paciente não encontrado" + rg + Paciente.class.getName()));
    }

    public List<Paciente> buscarPorPessoaFisNomePessoaContendo(String nome) {
        return this.pacienteRepository.findByPessoaFisNomePessoaContaining(nome);
    }

    public List<Paciente> buscarPorStatusPac(Boolean status) {
        return this.pacienteRepository.findByStatusPac(status);
    }

    @Transactional
    public Paciente criar(Paciente paciente) {
        paciente.setIdPaciente(null);
        paciente = this.pacienteRepository.save(paciente);
        return paciente;
    }

    @Transactional
    public Paciente atualizar(Long id, Paciente pacienteAtualizado) {
        Paciente paciente = this.buscarPorId(id);
        pacienteAtualizado.setIdPaciente(paciente.getIdPaciente());
        return this.pacienteRepository.save(pacienteAtualizado);
    }

    @Transactional
    public void deletar(Long id) {
        Paciente paciente = this.buscarPorId(id);
        this.pacienteRepository.delete(paciente);
    }
}
