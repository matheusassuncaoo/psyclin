package com.br.psyclin.services;

import com.br.psyclin.models.Paciente;
import com.br.psyclin.dto.response.PacienteResponseDTO;
import com.br.psyclin.repositories.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
     * Atualiza um paciente usando DTO com apenas campos editáveis
     * @param id ID do paciente
     * @param dadosAtualizacao DTO com dados a serem atualizados
     * @return Paciente atualizado
     */
    public Paciente atualizarPacienteComDTO(Integer id, com.br.psyclin.dto.request.PacienteUpdateDTO dadosAtualizacao) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do paciente é obrigatório");
            }
            
            if (dadosAtualizacao == null) {
                throw new IllegalArgumentException("Dados para atualização são obrigatórios");
            }
            
            // Busca o paciente existente
            Paciente pacienteExistente = buscarPacientePorId(id);
            
            // Atualiza apenas os campos permitidos na pessoa física
            if (pacienteExistente.getPessoaFisica() != null) {
                if (dadosAtualizacao.getNomePessoa() != null && !dadosAtualizacao.getNomePessoa().trim().isEmpty()) {
                    pacienteExistente.getPessoaFisica().setNomePessoa(dadosAtualizacao.getNomePessoa().trim());
                }
                
                // Atualiza contatos e emails se a pessoa existir
                if (pacienteExistente.getPessoaFisica().getPessoa() != null) {
                    // Atualiza telefone (primeiro contato)
                    if (dadosAtualizacao.getTelefone() != null && !dadosAtualizacao.getTelefone().trim().isEmpty()) {
                        if (pacienteExistente.getPessoaFisica().getPessoa().getContatos() != null && 
                            !pacienteExistente.getPessoaFisica().getPessoa().getContatos().isEmpty()) {
                            pacienteExistente.getPessoaFisica().getPessoa().getContatos().get(0)
                                    .setNumero(dadosAtualizacao.getTelefone().trim());
                        }
                    }
                    
                    // Atualiza email (primeiro email)
                    if (dadosAtualizacao.getEmail() != null && !dadosAtualizacao.getEmail().trim().isEmpty()) {
                        if (pacienteExistente.getPessoaFisica().getPessoa().getEmails() != null && 
                            !pacienteExistente.getPessoaFisica().getPessoa().getEmails().isEmpty()) {
                            pacienteExistente.getPessoaFisica().getPessoa().getEmails().get(0)
                                    .setEmail(dadosAtualizacao.getEmail().trim());
                        }
                    }
                }
            }
            
            // Atualiza RG se fornecido
            if (dadosAtualizacao.getRgPaciente() != null && !dadosAtualizacao.getRgPaciente().trim().isEmpty()) {
                pacienteExistente.setRgPaciente(dadosAtualizacao.getRgPaciente().trim());
            }
            
            // Atualiza estado do RG se fornecido
            if (dadosAtualizacao.getEstadoRg() != null && !dadosAtualizacao.getEstadoRg().trim().isEmpty()) {
                try {
                    Paciente.EstadoRg estadoRg = Paciente.EstadoRg.valueOf(dadosAtualizacao.getEstadoRg().trim().toUpperCase());
                    pacienteExistente.setEstadoRg(estadoRg);
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Estado de RG inválido: " + dadosAtualizacao.getEstadoRg());
                }
            }
            
            return pacienteRepository.save(pacienteExistente);
            
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

    /**
     * Converte lista de pacientes para DTOs de resposta
     * @param pacientes Lista de pacientes
     * @return Lista de DTOs
     */
    public List<PacienteResponseDTO> converterParaDTO(List<Paciente> pacientes) {
        return pacientes.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    /**
     * Converte paciente para DTO de resposta
     * @param paciente Paciente a ser convertido
     * @return DTO de resposta
     */
    public PacienteResponseDTO converterParaDTO(Paciente paciente) {
        if (paciente == null) {
            return null;
        }

        PacienteResponseDTO dto = new PacienteResponseDTO();
        dto.setIdPaciente(paciente.getIdPaciente());
        
        // Dados da pessoa física (nome, CPF, telefone, email, data nascimento, sexo)
        if (paciente.getPessoaFisica() != null) {
            dto.setNomePessoa(paciente.getPessoaFisica().getNomePessoa());
            dto.setCpfPessoa(paciente.getPessoaFisica().getCpfPessoa());
            
            // Dados de contato da pessoa
            if (paciente.getPessoaFisica().getPessoa() != null) {
                // Pega o primeiro telefone da lista
                if (paciente.getPessoaFisica().getPessoa().getContatos() != null && 
                    !paciente.getPessoaFisica().getPessoa().getContatos().isEmpty()) {
                    dto.setTelefone(paciente.getPessoaFisica().getPessoa().getContatos().get(0).getNumero());
                }
                
                // Pega o primeiro email da lista
                if (paciente.getPessoaFisica().getPessoa().getEmails() != null && 
                    !paciente.getPessoaFisica().getPessoa().getEmails().isEmpty()) {
                    dto.setEmail(paciente.getPessoaFisica().getPessoa().getEmails().get(0).getEmail());
                }
            }
            
            // Data de nascimento
            if (paciente.getPessoaFisica().getDataNascimento() != null) {
                dto.setDataNascimento(paciente.getPessoaFisica().getDataNascimento().toString());
            }
            
            // Sexo
            if (paciente.getPessoaFisica().getSexo() != null) {
                dto.setSexo(paciente.getPessoaFisica().getSexo().toString());
            }
        }

        // Status do paciente
        dto.setStatusPaciente(paciente.getStatusPaciente() ? "1" : "0");
        
        // RG do paciente
        dto.setRgPaciente(paciente.getRgPaciente());
        dto.setEstadoRg(paciente.getEstadoRg() != null ? paciente.getEstadoRg().toString() : null);

        return dto;
    }
}