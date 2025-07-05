package com.br.psyclin.services;

import com.br.psyclin.models.Anamnese;
import com.br.psyclin.models.Paciente;
import com.br.psyclin.models.Profissional;
import com.br.psyclin.dto.request.AnamneseRequestDTO;
import com.br.psyclin.repositories.AnamneseRepository;
import com.br.psyclin.repositories.PacienteRepository;
import com.br.psyclin.repositories.ProfissionalRepository;
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
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private ProfissionalRepository profissionalRepository;

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
     * Cadastra uma nova anamnese com base no DTO.
     * @param anamneseRequest DTO com dados da anamnese
     * @return Anamnese salva
     */
    public Anamnese cadastrarAnamneseComDTO(AnamneseRequestDTO anamneseRequest) {
        try {
            // Buscar paciente
            Paciente paciente = pacienteRepository.findById(anamneseRequest.getIdPaciente())
                .orElseThrow(() -> new IllegalArgumentException("Paciente não encontrado"));
            
            // Buscar profissional
            Profissional profissional = profissionalRepository.findById(anamneseRequest.getIdProfissional())
                .orElseThrow(() -> new IllegalArgumentException("Profissional não encontrado"));
            
            // Criar anamnese
            Anamnese anamnese = new Anamnese();
            anamnese.setPaciente(paciente);
            anamnese.setProfissional(profissional);
            anamnese.setDataAnamnese(anamneseRequest.getDataAnamnese());
            anamnese.setNomeResponsavel(anamneseRequest.getNomeResponsavel());
            anamnese.setCpfResponsavel(anamneseRequest.getCpfResponsavel());
            anamnese.setAutorizacaoVisualizacao(anamneseRequest.getAutorizacaoVisualizacao());
            anamnese.setStatusAnamnese(anamneseRequest.getStatusAnamnese());
            anamnese.setStatusFuncional(anamneseRequest.getStatusFuncional());
            anamnese.setObservacoes(anamneseRequest.getObservacoes());
            
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
     * Atualiza apenas o status de uma anamnese.
     * @param id ID da anamnese
     * @param novoStatus Novo status da anamnese
     * @return Anamnese atualizada
     */
    public Anamnese atualizarStatusAnamnese(Integer id, String novoStatus) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID da anamnese é obrigatório");
            }
            
            if (novoStatus == null || novoStatus.trim().isEmpty()) {
                throw new IllegalArgumentException("Status é obrigatório");
            }
            
            Optional<Anamnese> existente = anamneseRepository.findByIdAnamnese(id);
            if (existente.isEmpty()) {
                throw new RuntimeException("Anamnese não encontrada com ID: " + id);
            }
            
            Anamnese anamnese = existente.get();
            
            // Converte String para enum StatusAnamnese
            try {
                Anamnese.StatusAnamnese statusEnum = Anamnese.StatusAnamnese.valueOf(novoStatus.trim().toUpperCase());
                anamnese.setStatusAnamnese(statusEnum);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Status inválido: " + novoStatus + ". Valores válidos: " + 
                    java.util.Arrays.toString(Anamnese.StatusAnamnese.values()));
            }
            
            return anamneseRepository.save(anamnese);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar status da anamnese: " + e.getMessage(), e);
        }
    }

    /**
     * Atualiza apenas as observações de uma anamnese.
     * @param id ID da anamnese
     * @param novasObservacoes Novas observações da anamnese
     * @return Anamnese atualizada
     */
    public Anamnese atualizarObservacoesAnamnese(Integer id, String novasObservacoes) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID da anamnese é obrigatório");
            }
            
            Optional<Anamnese> existente = anamneseRepository.findByIdAnamnese(id);
            if (existente.isEmpty()) {
                throw new RuntimeException("Anamnese não encontrada com ID: " + id);
            }
            
            Anamnese anamnese = existente.get();
            anamnese.setObservacoes(novasObservacoes);
            
            return anamneseRepository.save(anamnese);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar observações da anamnese: " + e.getMessage(), e);
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

    /**
     * Converte lista de anamneses para DTOs de resposta
     * @param anamneses Lista de anamneses
     * @return Lista de DTOs
     */
    public List<com.br.psyclin.dto.response.AnamneseResponseDTO> converterParaDTO(List<Anamnese> anamneses) {
        return anamneses.stream()
                .map(this::converterParaDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Converte anamnese para DTO de resposta
     * @param anamnese Anamnese a ser convertida
     * @return DTO de resposta
     */
    public com.br.psyclin.dto.response.AnamneseResponseDTO converterParaDTO(Anamnese anamnese) {
        if (anamnese == null) {
            return null;
        }

        com.br.psyclin.dto.response.AnamneseResponseDTO dto = new com.br.psyclin.dto.response.AnamneseResponseDTO();
        dto.setIdAnamnese(anamnese.getIdAnamnese());
        
        // Nome do paciente
        if (anamnese.getPaciente() != null && anamnese.getPaciente().getPessoaFisica() != null) {
            dto.setNomePaciente(anamnese.getPaciente().getPessoaFisica().getNomePessoa());
        }
        
        // Nome do profissional
        if (anamnese.getProfissional() != null && anamnese.getProfissional().getPessoaFisica() != null) {
            dto.setNomeProfissional(anamnese.getProfissional().getPessoaFisica().getNomePessoa());
        }
        
        // Data formatada
        if (anamnese.getDataAnamnese() != null) {
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
            dto.setDataAplicacao(anamnese.getDataAnamnese().format(formatter));
        }
        
        // Status
        if (anamnese.getStatusAnamnese() != null) {
            dto.setStatusAnamnese(anamnese.getStatusAnamnese().toString());
        }
        
        // Dados do responsável
        dto.setNomeResponsavel(anamnese.getNomeResponsavel());
        dto.setCpfResponsavel(anamnese.getCpfResponsavel());
        dto.setAutorizacaoVisualizacao(anamnese.getAutorizacaoVisualizacao());
        dto.setObservacoes(anamnese.getObservacoes());

        return dto;
    }

    /**
     * Obtém estatísticas gerais das anamneses
     * @return Map com estatísticas
     */
    public java.util.Map<String, Object> obterEstatisticas() {
        java.util.Map<String, Object> estatisticas = new java.util.HashMap<>();
        
        try {
            long total = anamneseRepository.count();
            long ativas = anamneseRepository.countByStatusAnamnese(com.br.psyclin.models.Anamnese.StatusAnamnese.APROVADO);
            long pendentes = anamneseRepository.countByStatusAnamnese(com.br.psyclin.models.Anamnese.StatusAnamnese.PENDENTE);
            
            // Anamneses desta semana
            java.time.LocalDateTime inicioSemana = java.time.LocalDateTime.now().with(java.time.DayOfWeek.MONDAY).withHour(0).withMinute(0).withSecond(0);
            long estaSemana = anamneseRepository.countByDataAnamneseAfter(inicioSemana);
            
            estatisticas.put("total", total);
            estatisticas.put("completas", ativas);
            estatisticas.put("pendentes", pendentes);
            estatisticas.put("estaSemana", estaSemana);
            
        } catch (Exception e) {
            // Em caso de erro, retorna valores padrão
            estatisticas.put("total", 0L);
            estatisticas.put("completas", 0L);
            estatisticas.put("pendentes", 0L);
            estatisticas.put("estaSemana", 0L);
        }
        
        return estatisticas;
    }
}