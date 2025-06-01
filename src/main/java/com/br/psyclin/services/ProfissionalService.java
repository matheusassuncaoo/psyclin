package com.br.psyclin.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.psyclin.models.Profissional;
import com.br.psyclin.repositories.ProfissionalRepository;

import jakarta.transaction.Transactional;

@Service
public class ProfissionalService {

    private final ProfissionalRepository profissionalRepository;

    @Autowired
    public ProfissionalService(ProfissionalRepository profissionalRepository) {
        this.profissionalRepository = profissionalRepository;
    }

    /**
     * Busca todos os profissionais cadastrados
     * 
     * @return Lista de todos os profissionais
     */
    public List<Profissional> buscarTodos() {
        return profissionalRepository.findAll();
    }

    /**
     * Busca um profissional pelo ID
     * 
     * @param id ID do profissional
     * @return Optional contendo o profissional, se encontrado
     */
    public Optional<Profissional> buscarPorId(Integer id) {
        return profissionalRepository.findById(id);
    }

    /**
     * Busca profissionais pelo nome (contendo o texto informado)
     * 
     * @param nome Nome ou parte do nome a ser buscado
     * @return Lista de profissionais que contêm o nome informado
     */
    public List<Profissional> buscarPorNome(String nome) {
        return profissionalRepository.findByPessoaFisNomePessoaContainingIgnoreCase(nome);
    }

    /**
     * Busca um profissional pelo CPF
     * 
     * @param cpf CPF do profissional
     * @return Optional contendo o profissional, se encontrado
     */
    public Optional<Profissional> buscarPorCpf(String cpf) {
        return profissionalRepository.findByPessoaFisCpfPessoa(cpf);
    }

    /**
     * Busca profissionais por tipo
     * 
     * @param tipo Tipo do profissional
     * @return Lista de profissionais do tipo informado
     */
    public List<Profissional> buscarPorTipo(Profissional.TipoProfissional tipo) {
        return profissionalRepository.findByTipoProfissional(tipo);
    }

    /**
     * Busca profissionais por status
     * 
     * @param status Status do profissional
     * @return Lista de profissionais com o status informado
     */
    public List<Profissional> buscarPorStatus(Profissional.StatusProfissional status) {
        return profissionalRepository.findByStatusProfissional(status);
    }

    /**
     * Busca profissionais por supervisor
     * 
     * @param idSupervisor ID do supervisor
     * @return Lista de profissionais supervisionados pelo profissional informado
     */
    public List<Profissional> buscarPorSupervisor(Integer idSupervisor) {
        Optional<Profissional> supervisor = profissionalRepository.findById(idSupervisor);
        return supervisor.map(profissionalRepository::findBySupervisor)
                .orElseThrow(() -> new RuntimeException("Supervisor não encontrado com ID: " + idSupervisor));
    }

    /**
     * Busca profissionais sem supervisor
     * 
     * @return Lista de profissionais sem supervisor
     */
    public List<Profissional> buscarSemSupervisor() {
        return profissionalRepository.findBySupervisorIsNull();
    }

    /**
     * Salva um novo profissional ou atualiza um existente
     * 
     * @param profissional Objeto profissional a ser salvo
     * @return Profissional salvo com ID gerado
     */
    @Transactional
    public Profissional salvar(Profissional profissional) {
        return profissionalRepository.save(profissional);
    }

    /**
     * Exclui um profissional pelo ID
     * 
     * @param id ID do profissional a ser excluído
     * @throws RuntimeException se o profissional não for encontrado
     */
    @Transactional
    public void excluir(Integer id) {
        if (!profissionalRepository.existsById(id)) {
            throw new RuntimeException("Profissional não encontrado com ID: " + id);
        }
        profissionalRepository.deleteById(id);
    }

    /**
     * Atualiza o status de um profissional
     * 
     * @param id     ID do profissional
     * @param status Novo status
     * @return Profissional atualizado
     * @throws RuntimeException se o profissional não for encontrado
     */
    @Transactional
    public Profissional atualizarStatus(Integer id, Profissional.StatusProfissional status) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(id);
        if (profissionalOpt.isEmpty()) {
            throw new RuntimeException("Profissional não encontrado com ID: " + id);
        }

        Profissional profissional = profissionalOpt.get();
        profissional.setStatusProfissional(status);
        return profissionalRepository.save(profissional);
    }

    /**
     * Atribui um supervisor a um profissional
     * 
     * @param idProfissional ID do profissional
     * @param idSupervisor   ID do supervisor
     * @return Profissional atualizado
     * @throws RuntimeException se o profissional ou supervisor não forem
     *                          encontrados
     */
    @Transactional
    public Profissional atribuirSupervisor(Integer idProfissional, Integer idSupervisor) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(idProfissional);
        if (profissionalOpt.isEmpty()) {
            throw new RuntimeException("Profissional não encontrado com ID: " + idProfissional);
        }

        Optional<Profissional> supervisorOpt = profissionalRepository.findById(idSupervisor);
        if (supervisorOpt.isEmpty()) {
            throw new RuntimeException("Supervisor não encontrado com ID: " + idSupervisor);
        }

        Profissional profissional = profissionalOpt.get();
        profissional.setSupervisor(supervisorOpt.get());
        return profissionalRepository.save(profissional);
    }

    /**
     * Remove o supervisor de um profissional
     * 
     * @param idProfissional ID do profissional
     * @return Profissional atualizado
     * @throws RuntimeException se o profissional não for encontrado
     */
    @Transactional
    public Profissional removerSupervisor(Integer idProfissional) {
        Optional<Profissional> profissionalOpt = profissionalRepository.findById(idProfissional);
        if (profissionalOpt.isEmpty()) {
            throw new RuntimeException("Profissional não encontrado com ID: " + idProfissional);
        }

        Profissional profissional = profissionalOpt.get();
        profissional.setSupervisor(null);
        return profissionalRepository.save(profissional);
    }

}