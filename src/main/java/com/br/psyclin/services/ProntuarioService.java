package com.br.psyclin.services;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.br.psyclin.models.Prontuario;
import com.br.psyclin.repositories.ProntuarioRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Serviço para gerenciamento de prontuários.
 * Fornece operações de negócio para prontuários com cache inteligente.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2024
 */
@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    public ProntuarioService(ProntuarioRepository prontuarioRepository) {
        this.prontuarioRepository = prontuarioRepository;
    }

    /**
     * Conta o total de prontuários no sistema (histórico completo).
     * Cache de 6 horas - prontuários são criados com menor frequência que outros dados.
     * 
     * @return número total de prontuários no histórico
     */
    @Cacheable(value = "prontuarios", key = "'total'", cacheManager = "cacheManager")
    public Long contarTotalProntuarios() {
        return prontuarioRepository.contarTotalProntuarios();
    }

    /**
     * Busca todos os prontuários.
     * 
     * @return lista de todos os prontuários
     */
    public List<Prontuario> listarTodos() {
        return prontuarioRepository.findAll();
    }

    /**
     * Busca prontuário por ID.
     * 
     * @param id ID do prontuário
     * @return Optional contendo o prontuário se encontrado
     */
    public Optional<Prontuario> buscarPorId(Integer id) {
        return prontuarioRepository.findById(id);
    }

    /**
     * Salva um novo prontuário.
     * 
     * @param prontuario prontuário a ser salvo
     * @return prontuário salvo
     */
    public Prontuario salvar(Prontuario prontuario) {
        return prontuarioRepository.save(prontuario);
    }

    /**
     * Atualiza um prontuário existente.
     * 
     * @param id ID do prontuário
     * @param prontuarioAtualizado dados atualizados
     * @return prontuário atualizado
     * @throws RuntimeException se o prontuário não for encontrado
     */
    public Prontuario atualizar(Integer id, Prontuario prontuarioAtualizado) {
        Optional<Prontuario> prontuarioOpt = prontuarioRepository.findById(id);
        if (prontuarioOpt.isEmpty()) {
            throw new RuntimeException("Prontuário não encontrado com ID: " + id);
        }

        Prontuario prontuario = prontuarioOpt.get();
        // Atualizar campos necessários
        prontuario.setDescricaoProntuario(prontuarioAtualizado.getDescricaoProntuario());
        prontuario.setLinkProcedimento(prontuarioAtualizado.getLinkProcedimento());
        prontuario.setAutorizacaoPacienteVisualizacao(prontuarioAtualizado.getAutorizacaoPacienteVisualizacao());
        
        return prontuarioRepository.save(prontuario);
    }

    /**
     * Remove um prontuário.
     * 
     * @param id ID do prontuário
     * @throws RuntimeException se o prontuário não for encontrado
     */
    public void remover(Integer id) {
        if (!prontuarioRepository.existsById(id)) {
            throw new RuntimeException("Prontuário não encontrado com ID: " + id);
        }
        prontuarioRepository.deleteById(id);
    }

    /**
     * Busca prontuários por paciente.
     * 
     * @param idPaciente ID do paciente
     * @return lista de prontuários do paciente
     */
    public List<Prontuario> buscarPorPaciente(Integer idPaciente) {
        return prontuarioRepository.buscarPorPaciente(idPaciente);
    }

    /**
     * Busca prontuários por profissional.
     * 
     * @param idProfissional ID do profissional
     * @return lista de prontuários do profissional
     */
    public List<Prontuario> buscarPorProfissional(Integer idProfissional) {
        return prontuarioRepository.buscarPorProfissional(idProfissional);
    }

    /**
     * Busca prontuários por período.
     * 
     * @param dataInicio data de início
     * @param dataFim data de fim
     * @return lista de prontuários no período
     */
    public List<Prontuario> buscarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return prontuarioRepository.buscarPorPeriodo(dataInicio, dataFim);
    }

    /**
     * Conta prontuários criados hoje.
     * Cache de 1 hora - dados do dia atual mudam frequentemente.
     * 
     * @return número de prontuários criados hoje
     */
    @Cacheable(value = "prontuarios", key = "'hoje'", cacheManager = "cacheManager")
    public Long contarProntuariosHoje() {
        return prontuarioRepository.contarProntuariosHoje();
    }

    /**
     * Conta prontuários dos últimos 30 dias.
     * Cache de 2 horas.
     * 
     * @return número de prontuários dos últimos 30 dias
     */
    @Cacheable(value = "prontuarios", key = "'ultimos30dias'", cacheManager = "cacheManager")
    public Long contarProntuariosUltimos30Dias() {
        return prontuarioRepository.contarProntuariosUltimos30Dias();
    }

    /**
     * Busca os últimos prontuários criados.
     * 
     * @param limite número máximo de prontuários
     * @return lista dos últimos prontuários
     */
    public List<Prontuario> buscarUltimosProntuarios(int limite) {
        Pageable pageable = PageRequest.of(0, limite);
        return prontuarioRepository.buscarUltimosProntuarios(pageable);
    }
}
