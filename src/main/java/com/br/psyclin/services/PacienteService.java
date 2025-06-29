package com.br.psyclin.services;

import com.br.psyclin.models.Paciente;
import com.br.psyclin.repositories.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Service para operações de negócio relacionadas a Pacientes.
 * Responsável por cadastro, atualização, exclusão (inativação) e busca de pacientes.
 */
@Service
@Transactional
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    /**
     * Cadastra um novo paciente.
     * @param paciente Paciente a ser cadastrado
     * @return Paciente salvo
     */
    public Paciente cadastrarPaciente(Paciente paciente) {
        try {
            if (paciente == null) {
                throw new IllegalArgumentException("Paciente não pode ser nulo");
            }
            
            if (paciente.getPessoaFisica() == null || paciente.getPessoaFisica().getIdPessoaFisica() == null) {
                throw new IllegalArgumentException("Pessoa física é obrigatória");
            }
            
            if (paciente.getRgPaciente() == null || paciente.getRgPaciente().trim().isEmpty()) {
                throw new IllegalArgumentException("RG do paciente é obrigatório");
            }
            
            return pacienteRepository.save(paciente);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao cadastrar paciente: " + e.getMessage(), e);
        }
    }

    /**
     * Atualiza os dados de um paciente existente.
     * @param id ID do paciente
     * @param dadosAtualizados Dados a serem atualizados
     * @return Paciente atualizado
     */
    public Paciente atualizarPaciente(Integer id, Paciente dadosAtualizados) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do paciente é obrigatório");
            }
            
            Optional<Paciente> existente = pacienteRepository.findByIdPaciente(id);
            if (existente.isEmpty()) {
                throw new RuntimeException("Paciente não encontrado com ID: " + id);
            }
            
            Paciente paciente = existente.get();
            
            // Atualiza apenas os campos permitidos
            if (dadosAtualizados.getRgPaciente() != null) {
                paciente.setRgPaciente(dadosAtualizados.getRgPaciente());
            }
            if (dadosAtualizados.getEstadoRg() != null) {
                paciente.setEstadoRg(dadosAtualizados.getEstadoRg());
            }
            if (dadosAtualizados.getStatusPaciente() != null) {
                paciente.setStatusPaciente(dadosAtualizados.getStatusPaciente());
            }
            
            return pacienteRepository.save(paciente);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar paciente: " + e.getMessage(), e);
        }
    }

    /**
     * Inativa (exclui logicamente) um paciente.
     * @param id ID do paciente
     */
    public void excluirPaciente(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do paciente é obrigatório");
            }
            
            Optional<Paciente> paciente = pacienteRepository.findByIdPaciente(id);
            if (paciente.isEmpty()) {
                throw new RuntimeException("Paciente não encontrado com ID: " + id);
            }
            
            // Inativa o paciente ao invés de excluir
            Paciente p = paciente.get();
            p.setStatusPaciente(false);
            pacienteRepository.save(p);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao excluir paciente: " + e.getMessage(), e);
        }
    }

    /**
     * Busca um paciente pelo ID.
     * @param id ID do paciente
     * @return Paciente encontrado
     */
    @Transactional(readOnly = true)
    public Paciente buscarPacientePorId(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do paciente é obrigatório");
            }
            
            return pacienteRepository.findByIdPaciente(id)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar paciente: " + e.getMessage(), e);
        }
    }

    /**
     * Lista todos os pacientes.
     * @return Lista de todos os pacientes
     */
    /**
     * Lista todos os pacientes.
     * @return Lista de todos os pacientes (ativos e inativos)
     */
    @Transactional(readOnly = true)
    public List<Paciente> listarTodos() {
        try {
            return pacienteRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar pacientes: " + e.getMessage(), e);
        }
    }

    /**
     * Lista apenas os pacientes ativos (statusPaciente = true).
     * @return Lista de pacientes ativos
     */
    @Transactional(readOnly = true)
    public List<Paciente> listarAtivos() {
        try {
            return pacienteRepository.findByStatusPacienteTrue();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar pacientes ativos: " + e.getMessage(), e);
        }
    }

    /**
     * Lista pacientes por status.
     * @param status true para ativos, false para inativos
     * @return Lista de pacientes filtrados por status
     */
    @Transactional(readOnly = true)
    public List<Paciente> listarPorStatus(Boolean status) {
        try {
            return pacienteRepository.findByStatusPaciente(status);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar pacientes por status: " + e.getMessage(), e);
        }
    }

    /**
     * Conta o número de pacientes ativos.
     * @return Número de pacientes ativos
     */
    @Transactional(readOnly = true)
    public long contarAtivos() {
        try {
            return pacienteRepository.findByStatusPacienteTrue().size();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao contar pacientes ativos: " + e.getMessage(), e);
        }
    }
} 