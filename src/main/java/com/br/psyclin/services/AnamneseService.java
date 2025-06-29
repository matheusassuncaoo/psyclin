package com.br.psyclin.services;

import com.br.psyclin.models.Anamnese;
import com.br.psyclin.repositories.AnamneseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service para operações de negócio relacionadas a Anamneses.
 * Responsável por cadastro, atualização, exclusão e busca de anamneses.
 */
@Service
@Transactional
public class AnamneseService {

    @Autowired
    private AnamneseRepository anamneseRepository;

    /**
     * Cadastra uma nova anamnese.
     * @param anamnese Anamnese a ser cadastrada
     * @return Anamnese salva
     */
    public Anamnese cadastrarAnamnese(Anamnese anamnese) {
        try {
            if (anamnese == null) {
                throw new IllegalArgumentException("Anamnese não pode ser nula");
            }
            
            if (anamnese.getPaciente() == null || anamnese.getPaciente().getIdPaciente() == null) {
                throw new IllegalArgumentException("Paciente é obrigatório");
            }
            
            if (anamnese.getProfissional() == null || anamnese.getProfissional().getIdProfissional() == null) {
                throw new IllegalArgumentException("Profissional é obrigatório");
            }
            
            if (anamnese.getDataAnamnese() == null) {
                throw new IllegalArgumentException("Data da anamnese é obrigatória");
            }
            
            return anamneseRepository.save(anamnese);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao cadastrar anamnese: " + e.getMessage(), e);
        }
    }

    /**
     * Atualiza os dados de uma anamnese existente.
     * @param id ID da anamnese
     * @param dadosAtualizados Dados a serem atualizados
     * @return Anamnese atualizada
     */
    public Anamnese atualizarAnamnese(Integer id, Anamnese dadosAtualizados) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID da anamnese é obrigatório");
            }
            
            Optional<Anamnese> existente = anamneseRepository.findByIdAnamnese(id);
            if (existente.isEmpty()) {
                throw new RuntimeException("Anamnese não encontrada com ID: " + id);
            }
            
            Anamnese anamnese = existente.get();
            
            // Atualiza apenas os campos permitidos
            if (dadosAtualizados.getNomeResponsavel() != null) {
                anamnese.setNomeResponsavel(dadosAtualizados.getNomeResponsavel());
            }
            if (dadosAtualizados.getCpfResponsavel() != null) {
                anamnese.setCpfResponsavel(dadosAtualizados.getCpfResponsavel());
            }
            if (dadosAtualizados.getAutorizacaoVisualizacao() != null) {
                anamnese.setAutorizacaoVisualizacao(dadosAtualizados.getAutorizacaoVisualizacao());
            }
            if (dadosAtualizados.getStatusAnamnese() != null) {
                anamnese.setStatusAnamnese(dadosAtualizados.getStatusAnamnese());
            }
            if (dadosAtualizados.getStatusFuncional() != null) {
                anamnese.setStatusFuncional(dadosAtualizados.getStatusFuncional());
            }
            if (dadosAtualizados.getObservacoes() != null) {
                anamnese.setObservacoes(dadosAtualizados.getObservacoes());
            }
            
            return anamneseRepository.save(anamnese);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar anamnese: " + e.getMessage(), e);
        }
    }

    /**
     * Exclui uma anamnese.
     * @param id ID da anamnese
     */
    public void excluirAnamnese(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID da anamnese é obrigatório");
            }
            
            Optional<Anamnese> anamnese = anamneseRepository.findByIdAnamnese(id);
            if (anamnese.isEmpty()) {
                throw new RuntimeException("Anamnese não encontrada com ID: " + id);
            }
            
            anamneseRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao excluir anamnese: " + e.getMessage(), e);
        }
    }

    /**
     * Busca uma anamnese pelo ID.
     * @param id ID da anamnese
     * @return Anamnese encontrada
     */
    @Transactional(readOnly = true)
    public Anamnese buscarAnamnesePorId(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID da anamnese é obrigatório");
            }
            
            return anamneseRepository.findByIdAnamnese(id)
                    .orElseThrow(() -> new RuntimeException("Anamnese não encontrada com ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar anamnese: " + e.getMessage(), e);
        }
    }

    /**
     * Lista todas as anamneses.
     * @return Lista de todas as anamneses
     */
    @Transactional(readOnly = true)
    public List<Anamnese> listarTodos() {
        try {
            return anamneseRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar anamneses: " + e.getMessage(), e);
        }
    }
    
    /**
     * Lista apenas anamneses ativas (statusFuncional = true).
     * @return Lista de anamneses ativas
     */
    @Transactional(readOnly = true)
    public List<Anamnese> listarAtivas() {
        try {
            return anamneseRepository.findByStatusFuncionalTrue();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar anamneses ativas: " + e.getMessage(), e);
        }
    }
    
    /**
     * Conta o número de anamneses ativas para o dashboard.
     * Este método é otimizado para contagem apenas, sem retornar dados sensíveis.
     * @return Número de anamneses ativas
     */
    @Transactional(readOnly = true)
    public Long contarAtivas() {
        try {
            return anamneseRepository.countByStatusFuncionalTrue();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao contar anamneses ativas: " + e.getMessage(), e);
        }
    }
}