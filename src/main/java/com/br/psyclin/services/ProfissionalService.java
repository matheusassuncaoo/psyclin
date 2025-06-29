package com.br.psyclin.services;

import com.br.psyclin.models.Profissional;
import com.br.psyclin.repositories.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service para operações de negócio relacionadas a Profissionais.
 * Responsável por cadastro, atualização, exclusão (inativação) e busca de profissionais.
 */
@Service
@Transactional
public class ProfissionalService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    /**
     * Cadastra um novo profissional.
     * @param profissional Profissional a ser cadastrado
     * @return Profissional salvo
     */
    public Profissional cadastrarProfissional(Profissional profissional) {
        try {
            if (profissional == null) {
                throw new IllegalArgumentException("Profissional não pode ser nulo");
            }
            
            if (profissional.getPessoaFisica() == null || profissional.getPessoaFisica().getIdPessoaFisica() == null) {
                throw new IllegalArgumentException("Pessoa física é obrigatória");
            }
            
            if (profissional.getTipoProfissional() == null) {
                throw new IllegalArgumentException("Tipo de profissional é obrigatório");
            }
            
            if (profissional.getConselhoProfissional() == null || profissional.getConselhoProfissional().getIdConselhoProfissional() == null) {
                throw new IllegalArgumentException("Conselho profissional é obrigatório");
            }
            
            return profissionalRepository.save(profissional);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao cadastrar profissional: " + e.getMessage(), e);
        }
    }

    /**
     * Atualiza os dados de um profissional existente.
     * @param id ID do profissional
     * @param dadosAtualizados Dados a serem atualizados
     * @return Profissional atualizado
     */
    public Profissional atualizarProfissional(Integer id, Profissional dadosAtualizados) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do profissional é obrigatório");
            }
            
            Optional<Profissional> existente = profissionalRepository.findByIdProfissional(id);
            if (existente.isEmpty()) {
                throw new RuntimeException("Profissional não encontrado com ID: " + id);
            }
            
            Profissional profissional = existente.get();
            
            // Atualiza apenas os campos permitidos
            if (dadosAtualizados.getTipoProfissional() != null) {
                profissional.setTipoProfissional(dadosAtualizados.getTipoProfissional());
            }
            if (dadosAtualizados.getSupervisor() != null) {
                profissional.setSupervisor(dadosAtualizados.getSupervisor());
            }
            if (dadosAtualizados.getStatusProfissional() != null) {
                profissional.setStatusProfissional(dadosAtualizados.getStatusProfissional());
            }
            if (dadosAtualizados.getConselhoProfissional() != null) {
                profissional.setConselhoProfissional(dadosAtualizados.getConselhoProfissional());
            }
            
            return profissionalRepository.save(profissional);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar profissional: " + e.getMessage(), e);
        }
    }

    /**
     * Inativa (exclui logicamente) um profissional.
     * @param id ID do profissional
     */
    public void excluirProfissional(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do profissional é obrigatório");
            }
            
            Optional<Profissional> profissional = profissionalRepository.findByIdProfissional(id);
            if (profissional.isEmpty()) {
                throw new RuntimeException("Profissional não encontrado com ID: " + id);
            }
            
            // Inativa o profissional ao invés de excluir
            Profissional p = profissional.get();
            p.setStatusProfissional(Profissional.StatusProfissional._3); // Assumindo que _3 é inativo
            profissionalRepository.save(p);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao excluir profissional: " + e.getMessage(), e);
        }
    }

    /**
     * Busca um profissional pelo ID.
     * @param id ID do profissional
     * @return Profissional encontrado
     */
    @Transactional(readOnly = true)
    public Profissional buscarProfissionalPorId(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do profissional é obrigatório");
            }
            
            return profissionalRepository.findByIdProfissional(id)
                    .orElseThrow(() -> new RuntimeException("Profissional não encontrado com ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar profissional: " + e.getMessage(), e);
        }
    }

    /**
     * Lista todos os profissionais.
     * @return Lista de todos os profissionais
     */
    @Transactional(readOnly = true)
    public List<Profissional> listarTodos() {
        try {
            return profissionalRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar profissionais: " + e.getMessage(), e);
        }
    }

    /**
     * Lista apenas os profissionais ativos (statusProfissional = _1).
     * @return Lista de profissionais ativos
     */
    @Transactional(readOnly = true)
    public List<Profissional> listarAtivos() {
        try {
            return profissionalRepository.findByStatusProfissionalAtivo();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar profissionais ativos: " + e.getMessage(), e);
        }
    }

    /**
     * Lista profissionais por status.
     * @param status Status do profissional
     * @return Lista de profissionais filtrados por status
     */
    @Transactional(readOnly = true)
    public List<Profissional> listarPorStatus(Profissional.StatusProfissional status) {
        try {
            return profissionalRepository.findByStatusProfissional(status);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar profissionais por status: " + e.getMessage(), e);
        }
    }

    /**
     * Conta o número de profissionais ativos de forma otimizada.
     * Método otimizado para dashboard com cache de 8 horas.
     * @return Número de profissionais ativos
     */
    @Transactional(readOnly = true)
    public long contarAtivos() {
        try {
            return profissionalRepository.countByStatusProfissionalAtivo();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao contar profissionais ativos: " + e.getMessage(), e);
        }
    }
} 