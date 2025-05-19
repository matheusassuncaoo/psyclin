package com.br.psyclin.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.psyclin.models.Paciente;
import com.br.psyclin.repositories.PacienteRepository;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public List<Paciente> findAll() {
        return pacienteRepository.findAll();
    }

    public List<Paciente> findByStatusPaciente(Integer statusPaciente) {
        return pacienteRepository.findByStatusPac(statusPaciente);
    }

    public Paciente findById(Long id) {
        Optional<Paciente> obj = pacienteRepository.findById(id);
        return obj.orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
    }

    public Paciente findByCodPaciente(String codPaciente) {
        return pacienteRepository.findByCodPac(codPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
    }

    public List<Paciente> findByNomePaciente(String nomePaciente) {
        return pacienteRepository.findByNomePacContainingIgnoreCase(nomePaciente);
    }

    public Paciente findByCpfPaciente(String cpfPaciente) {
        return pacienteRepository.findByCpfPac(cpfPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
    }

    public Paciente create(Paciente obj) {
        return pacienteRepository.save(obj);
    }

    public void update(Paciente obj) {
        pacienteRepository.save(obj);
    }

    public void delete(Long id) {
        pacienteRepository.deleteById(id);
    }
}