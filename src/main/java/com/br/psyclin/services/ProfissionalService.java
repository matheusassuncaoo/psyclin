package com.br.psyclin.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.br.psyclin.models.Profissional;
import com.br.psyclin.repositories.ProfissionalRepository;

import jakarta.transaction.Transactional;

@Service
public class ProfissionalService {
    private ProfissionalRepository profissionalRepository;

    public ProfissionalService(ProfissionalRepository profissionalRepository) {
        this.profissionalRepository = profissionalRepository;
    }

    public Profissional findById(Long id) {
        Optional<Profissional> profissional = this.profissionalRepository.findById(id);
        return profissional.orElseThrow(() -> new RuntimeException(
                "Profissional não encontrado! ID: " + id + ", Tipo: " + Profissional.class.getName()));
    }

    @Transactional
    public Profissional create(Profissional obj) {
        obj.setId(null);
        obj = this.profissionalRepository.save(obj);
        // retornar o task
        return obj;
    }

    @Transactional
    public Profissional update(Profissional obj) {
        Profissional newObj = findById(obj.getId());
        newObj.setSenhaProf(obj.getSenhaProf());
        return this.profissionalRepository.save(newObj);
    }

    public void delete(Long id) {
        findById(id);
        try{
            this.profissionalRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Não é possível excluir o profissional com id: " + id + ", pois ele está associado a outras entidades.");
        }
       
    }
}
