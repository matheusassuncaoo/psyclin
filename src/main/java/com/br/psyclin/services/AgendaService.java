package com.br.psyclin.services;

import com.br.psyclin.models.Agenda;
import com.br.psyclin.repositories.AgendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/**
 * Service para operações de negócio relacionadas à Agenda.
 * Responsável por cadastro, atualização, exclusão e busca de agendamentos.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Service
@Transactional
public class AgendaService {

    @Autowired
    private AgendaRepository agendaRepository;

    /**
     * Cadastra um novo agendamento.
     * @param agenda Agendamento a ser cadastrado
     * @return Agendamento salvo
     */
    public Agenda cadastrarAgendamento(Agenda agenda) {
        try {
            if (agenda == null) {
                throw new IllegalArgumentException("Agendamento não pode ser nulo");
            }
            
            if (agenda.getProfissional() == null || agenda.getProfissional().getIdProfissional() == null) {
                throw new IllegalArgumentException("Profissional é obrigatório");
            }
            
            if (agenda.getProcedimento() == null || agenda.getProcedimento().getIdProcedimento() == null) {
                throw new IllegalArgumentException("Procedimento é obrigatório");
            }
            
            if (agenda.getDataAbertura() == null) {
                throw new IllegalArgumentException("Data de abertura é obrigatória");
            }
            
            return agendaRepository.save(agenda);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao cadastrar agendamento: " + e.getMessage(), e);
        }
    }

    /**
     * Atualiza os dados de um agendamento existente.
     * @param id ID do agendamento
     * @param dadosAtualizados Dados a serem atualizados
     * @return Agendamento atualizado
     */
    public Agenda atualizarAgendamento(Integer id, Agenda dadosAtualizados) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do agendamento é obrigatório");
            }
            
            Optional<Agenda> existente = agendaRepository.findByIdAgenda(id);
            if (existente.isEmpty()) {
                throw new RuntimeException("Agendamento não encontrado com ID: " + id);
            }
            
            Agenda agenda = existente.get();
            
            // Atualiza apenas os campos permitidos
            if (dadosAtualizados.getDataNova() != null) {
                agenda.setDataNova(dadosAtualizados.getDataNova());
            }
            if (dadosAtualizados.getSituacaoAgenda() != null) {
                agenda.setSituacaoAgenda(dadosAtualizados.getSituacaoAgenda());
            }
            if (dadosAtualizados.getDescricaoComplementar() != null) {
                agenda.setDescricaoComplementar(dadosAtualizados.getDescricaoComplementar());
            }
            if (dadosAtualizados.getMotivoCancelamento() != null) {
                agenda.setMotivoCancelamento(dadosAtualizados.getMotivoCancelamento());
            }
            
            return agendaRepository.save(agenda);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar agendamento: " + e.getMessage(), e);
        }
    }

    /**
     * Exclui um agendamento.
     * @param id ID do agendamento
     */
    public void excluirAgendamento(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do agendamento é obrigatório");
            }
            
            Optional<Agenda> agenda = agendaRepository.findByIdAgenda(id);
            if (agenda.isEmpty()) {
                throw new RuntimeException("Agendamento não encontrado com ID: " + id);
            }
            
            agendaRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao excluir agendamento: " + e.getMessage(), e);
        }
    }

    /**
     * Busca um agendamento pelo ID.
     * @param id ID do agendamento
     * @return Agendamento encontrado
     */
    @Transactional(readOnly = true)
    public Agenda buscarAgendamentoPorId(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do agendamento é obrigatório");
            }
            
            return agendaRepository.findByIdAgenda(id)
                    .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar agendamento: " + e.getMessage(), e);
        }
    }

    /**
     * Lista todos os agendamentos.
     * @return Lista de todos os agendamentos
     */
    @Transactional(readOnly = true)
    public List<Agenda> listarTodos() {
        try {
            return agendaRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar agendamentos: " + e.getMessage(), e);
        }
    }
    
    /**
     * Lista agendamentos aguardando atendimento.
     * @return Lista de agendamentos aguardando
     */
    @Transactional(readOnly = true)
    public List<Agenda> listarAguardando() {
        try {
            return agendaRepository.buscarAgendamentosAguardando();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar agendamentos aguardando: " + e.getMessage(), e);
        }
    }
    
    /**
     * Conta encontros ativos de hoje (aguardando atendimento).
     * Este método é otimizado para contagem apenas, usado no dashboard.
     * @return Número de encontros ativos para hoje
     */
    @Transactional(readOnly = true)
    public Long contarEncontrosAtivosHoje() {
        try {
            // Define início e fim do dia atual
            LocalDateTime inicioHoje = LocalDateTime.now().with(LocalTime.MIN); // 00:00:00
            LocalDateTime fimHoje = LocalDateTime.now().with(LocalTime.MAX);    // 23:59:59
            
            return agendaRepository.countEncontrosAtivosHoje(inicioHoje, fimHoje);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao contar encontros ativos de hoje: " + e.getMessage(), e);
        }
    }
    
    /**
     * Lista encontros ativos de hoje (aguardando atendimento).
     * @return Lista de encontros ativos para hoje
     */
    @Transactional(readOnly = true)
    public List<Agenda> listarEncontrosAtivosHoje() {
        try {
            LocalDateTime inicioHoje = LocalDateTime.now().with(LocalTime.MIN);
            LocalDateTime fimHoje = LocalDateTime.now().with(LocalTime.MAX);
            
            return agendaRepository.buscarEncontrosAtivosHoje(inicioHoje, fimHoje);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar encontros ativos de hoje: " + e.getMessage(), e);
        }
    }
}
