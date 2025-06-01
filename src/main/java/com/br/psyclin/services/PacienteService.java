package com.br.psyclin.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.psyclin.models.Paciente;
import com.br.psyclin.repositories.PacienteRepository;

import jakarta.transaction.Transactional;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    @Autowired
    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    /**
     * Busca todos os pacientes cadastrados
     * 
     * @return Lista de todos os pacientes
     */
    public List<Paciente> buscarTodos() {
        return pacienteRepository.findAll();
    }

    /**
     * Busca um paciente pelo ID
     * 
     * @param id ID do paciente
     * @return Optional contendo o paciente, se encontrado
     */
    public Optional<Paciente> buscarPorId(Integer id) {
        return pacienteRepository.findById(id);
    }

    /**
     * Busca um paciente pelo RG
     * 
     * @param rg RG do paciente
     * @return Optional contendo o paciente, se encontrado
     */
    public Optional<Paciente> buscarPorRg(String rg) {
        return pacienteRepository.findByRgPaciente(rg);
    }

    /**
     * Busca pacientes pelo nome (contendo o texto informado)
     * 
     * @param nome Nome ou parte do nome a ser buscado
     * @return Lista de pacientes que contêm o nome informado
     */
    public List<Paciente> buscarPorNome(String nome) {
        return pacienteRepository.findByPessoaFisNomePessoaContainingIgnoreCase(nome);
    }

    /**
     * Busca um paciente pelo CPF
     * 
     * @param cpf CPF do paciente
     * @return Optional contendo o paciente, se encontrado
     */
    public Optional<Paciente> buscarPorCpf(String cpf) {
        return pacienteRepository.findByPessoaFisCpfPessoa(cpf);
    }

    /**
     * Verifica se já existe um paciente com o RG informado
     * 
     * @param rg RG a ser verificado
     * @return true se já existe, false caso contrário
     */
    public boolean existePorRg(String rg) {
        return pacienteRepository.existsByRgPaciente(rg);
    }

    /**
     * Salva um novo paciente ou atualiza um existente
     * 
     * @param paciente Objeto paciente a ser salvo
     * @return Paciente salvo com ID gerado
     * @throws RuntimeException se o RG já estiver cadastrado (apenas para novos
     *                          registros)
     */
    @Transactional
    public Paciente salvar(Paciente paciente) {
        // Verifica se é um novo registro e se o RG já existe
        if (paciente.getIdPaciente() == null && existePorRg(paciente.getRgPaciente())) {
            throw new RuntimeException("RG já cadastrado: " + paciente.getRgPaciente());
        }
        return pacienteRepository.save(paciente);
    }

    /**
     * Exclui um paciente pelo ID
     * 
     * @param id ID do paciente a ser excluído
     * @throws RuntimeException se o paciente não for encontrado
     */
    @Transactional
    public void excluir(Integer id) {
        if (!pacienteRepository.existsById(id)) {
            throw new RuntimeException("Paciente não encontrado com ID: " + id);
        }
        pacienteRepository.deleteById(id);
    }

    /**
     * Busca pacientes por status (ativo/inativo)
     * 
     * @param status Status do paciente
     * @return Lista de pacientes com o status informado
     */
    public List<Paciente> buscarPorStatus(Boolean status) {
        return pacienteRepository.findByStatusPac(status);
    }

    /**
     * Busca pacientes por estado do RG
     * 
     * @param estadoRg Estado do RG
     * @return Lista de pacientes com o estado do RG informado
     */
    public List<Paciente> buscarPorEstadoRg(Paciente.EstadoRg estadoRg) {
        return pacienteRepository.findByEstdoRgPac(estadoRg);
    }

    /**
     * Atualiza o status de um paciente
     * 
     * @param id     ID do paciente
     * @param status Novo status
     * @return Paciente atualizado
     * @throws RuntimeException se o paciente não for encontrado
     */
    @Transactional
    public Paciente atualizarStatus(Integer id, Boolean status) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findById(id);
        if (pacienteOpt.isEmpty()) {
            throw new RuntimeException("Paciente não encontrado com ID: " + id);
        }

        Paciente paciente = pacienteOpt.get();
        paciente.setStatusPac(status);
        return pacienteRepository.save(paciente);
    }

}