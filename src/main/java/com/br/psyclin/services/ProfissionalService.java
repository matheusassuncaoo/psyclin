package com.br.psyclin.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.psyclin.models.Profissional;
import com.br.psyclin.repositories.ProfissionalRepository;

import jakarta.transaction.Transactional;

@Service
public class ProfissionalService {
    private final ProfissionalRepository profissionalRepository;

    public ProfissionalService(ProfissionalRepository profissionalRepository) {
        this.profissionalRepository = profissionalRepository;
    }

    public Profissional findById(Long id) {
        Optional<Profissional> profissional = this.profissionalRepository.findById(id);
        return profissional.orElseThrow(() -> new RuntimeException(
                "Profissional não encontrado! ID: " + id + ", Tipo: " + Profissional.class.getName()));
    }

    public Profissional findByCodProf(String codProf) {
        Profissional profissional = this.profissionalRepository.findByCodProf(codProf);
        if (profissional == null) {
            throw new RuntimeException("Profissional não encontrado! Código: " + codProf);
        }
        return profissional;
    }

    public List<Profissional> findBySupProf(String supProf) {
        List<Profissional> profissionais = this.profissionalRepository.findBySupProf(supProf);
        if (profissionais.isEmpty()) {
            throw new RuntimeException("Nenhum profissional encontrado com supervisor: " + supProf);
        }
        return profissionais;
    }

    public List<Profissional> findByTipoProf(Integer tipoProf) {
        List<Profissional> profissionais = this.profissionalRepository.findByTipoProf(tipoProf);
        if (profissionais.isEmpty()) {
            throw new RuntimeException("Nenhum profissional encontrado com tipo: " + tipoProf);
        }
        return profissionais;
    }

    public List<Profissional> findByStatusProf(Integer statusProf) {
        List<Profissional> profissionais = this.profissionalRepository.findByStatusProf(statusProf);
        if (profissionais.isEmpty()) {
            throw new RuntimeException("Nenhum profissional encontrado com status: " + statusProf);
        }
        return profissionalRepository.findByStatusProf(statusProf);
    }

    public Profissional authenticate(String codProf, String senhaProf) {
        Profissional profissional = this.profissionalRepository.findByCodProf(codProf);
        if (profissional == null || !profissional.authenticate(codProf, senhaProf)) {
            throw new RuntimeException("Código ou senha inválidos!");
        }
        return profissional;
    }

    public List<Profissional> findByNomeProf(String nomeProf) {
        List<Profissional> profissionais = this.profissionalRepository.findAll().stream()
                .filter(p -> p.getNomeProf().equalsIgnoreCase(nomeProf))
                .toList();
        if (profissionais.isEmpty()) {
            throw new RuntimeException("Nenhum profissional encontrado com nome: " + nomeProf);
        }
        return profissionais;
    }

    @Transactional
    public Profissional create(Profissional obj) {
        // Validar se codProf já existe
        Profissional existing = this.profissionalRepository.findByCodProf(obj.getCodProf());
        if (existing != null) {
            throw new RuntimeException("Código de profissional já existe: " + obj.getCodProf());
        }
        obj.setId(null); // Garante que o ID será gerado automaticamente
        return this.profissionalRepository.save(obj);
    }

    @Transactional
    public Profissional update(Profissional obj) {
        Profissional existing = findById(obj.getId());
        existing.setNomeProf(obj.getNomeProf());
        existing.setSenhaProf(obj.getSenhaProf());
        existing.setTipoProf(obj.getTipoProf());
        existing.setSupProf(obj.getSupProf());
        existing.setStatusProf(obj.getStatusProf());
        existing.setConsProf(obj.getConsProf());
        return this.profissionalRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Profissional profissional = findById(id);
        try {
            this.profissionalRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Não é possível excluir o profissional com ID: " + id +
                    ". Ele pode estar associado a outras entidades (ex.: anamneses, consultas).");
        }
    }

    public List<Profissional> findAll() {
       return this.profissionalRepository.findAll();
    }
}