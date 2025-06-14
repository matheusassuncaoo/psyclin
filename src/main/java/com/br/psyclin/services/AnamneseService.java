package com.br.psyclin.services;

import com.br.psyclin.models.Anamnese;
import com.br.psyclin.repositories.AnamneseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnamneseService {

    @Autowired
    private AnamneseRepository anamneseRepository;

    /**
     * Busca todas as anamneses
     * @return Lista de anamneses
     */
    public List<Anamnese> buscarTodas() {
        return anamneseRepository.findAll();
    }

    /**
     * Busca uma anamnese por ID
     * @param id ID da anamnese
     * @return Optional com a anamnese, se existir
     */
    public Optional<Anamnese> buscarPorId(Long id) {
        return anamneseRepository.findById(id);
    }

    /**
     * Busca anamneses pelo ID do profissional
     * @param idProfissional ID do profissional
     * @return Lista de anamneses do profissional
     */
    public List<Anamnese> buscarPorProfissional(Long idProfissional) {
        return anamneseRepository.findByIdProfissional(idProfissional);
    }

    /**
     * Salva nova anamnese
     * @param anamnese Objeto a ser salvo
     * @return Anamnese salva
     */
    public Anamnese salvar(Anamnese anamnese) {
        return anamneseRepository.save(anamnese);
    }

    /**
     * Atualiza anamnese existente
     * @param id ID da anamnese
     * @param anamnese Dados atualizados
     * @return Optional com a anamnese atualizada
     */
    public Optional<Anamnese> atualizar(Long id, Anamnese anamnese) {
        return buscarPorId(id).map(existing -> {
            anamnese.setIdAnamnese(id);
            return anamneseRepository.save(anamnese);
        });
    }

    /**
     * Deleta uma anamnese
     * @param id ID da anamnese
     * @return true se excluído, false se não encontrado
     */
    public boolean deletar(Long id) {
        return buscarPorId(id).map(a -> {
            anamneseRepository.deleteById(id);
            return true;
        }).orElse(false);
    }
}
