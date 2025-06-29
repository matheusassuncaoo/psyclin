package com.br.psyclin.services;

import com.br.psyclin.models.Procedimento;
import com.br.psyclin.repositories.ProcedimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service para operações de negócio relacionadas a Procedimentos.
 * Responsável por cadastro, atualização, exclusão e busca de procedimentos.
 * 
 * @author Sistema Psyclin
 * @version 1.0
 * @since 2025
 */
@Service
@Transactional
public class ProcedimentoService {

    @Autowired
    private ProcedimentoRepository procedimentoRepository;

    /**
     * Cadastra um novo procedimento.
     * @param procedimento Procedimento a ser cadastrado
     * @return Procedimento salvo
     */
    public Procedimento cadastrarProcedimento(Procedimento procedimento) {
        try {
            if (procedimento == null) {
                throw new IllegalArgumentException("Procedimento não pode ser nulo");
            }
            
            if (procedimento.getCodProcedimento() == null || procedimento.getCodProcedimento().trim().isEmpty()) {
                throw new IllegalArgumentException("Código do procedimento é obrigatório");
            }
            
            if (procedimento.getDescricao() == null || procedimento.getDescricao().trim().isEmpty()) {
                throw new IllegalArgumentException("Descrição do procedimento é obrigatória");
            }
            
            if (procedimento.getValor() == null || procedimento.getValor().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Valor do procedimento deve ser maior ou igual a zero");
            }
            
            // Verificar se código já existe
            Optional<Procedimento> existentePorCodigo = procedimentoRepository.findByCodProcedimento(procedimento.getCodProcedimento());
            if (existentePorCodigo.isPresent()) {
                throw new RuntimeException("Já existe um procedimento com o código: " + procedimento.getCodProcedimento());
            }
            
            return procedimentoRepository.save(procedimento);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao cadastrar procedimento: " + e.getMessage(), e);
        }
    }

    /**
     * Atualiza os dados de um procedimento existente.
     * @param id ID do procedimento
     * @param dadosAtualizados Dados a serem atualizados
     * @return Procedimento atualizado
     */
    public Procedimento atualizarProcedimento(Integer id, Procedimento dadosAtualizados) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do procedimento é obrigatório");
            }
            
            Optional<Procedimento> existente = procedimentoRepository.findByIdProcedimento(id);
            if (existente.isEmpty()) {
                throw new RuntimeException("Procedimento não encontrado com ID: " + id);
            }
            
            Procedimento procedimento = existente.get();
            
            // Atualiza apenas os campos permitidos
            if (dadosAtualizados.getDescricao() != null && !dadosAtualizados.getDescricao().trim().isEmpty()) {
                procedimento.setDescricao(dadosAtualizados.getDescricao());
            }
            if (dadosAtualizados.getValor() != null && dadosAtualizados.getValor().compareTo(BigDecimal.ZERO) >= 0) {
                procedimento.setValor(dadosAtualizados.getValor());
            }
            // Código normalmente não deve ser alterado após criação
            
            return procedimentoRepository.save(procedimento);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar procedimento: " + e.getMessage(), e);
        }
    }

    /**
     * Exclui um procedimento.
     * @param id ID do procedimento
     */
    public void excluirProcedimento(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do procedimento é obrigatório");
            }
            
            Optional<Procedimento> procedimento = procedimentoRepository.findByIdProcedimento(id);
            if (procedimento.isEmpty()) {
                throw new RuntimeException("Procedimento não encontrado com ID: " + id);
            }
            
            procedimentoRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao excluir procedimento: " + e.getMessage(), e);
        }
    }

    /**
     * Busca um procedimento pelo ID.
     * @param id ID do procedimento
     * @return Procedimento encontrado
     */
    @Transactional(readOnly = true)
    public Procedimento buscarProcedimentoPorId(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("ID do procedimento é obrigatório");
            }
            
            return procedimentoRepository.findByIdProcedimento(id)
                    .orElseThrow(() -> new RuntimeException("Procedimento não encontrado com ID: " + id));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar procedimento: " + e.getMessage(), e);
        }
    }

    /**
     * Busca um procedimento pelo código.
     * @param codigo Código do procedimento
     * @return Procedimento encontrado
     */
    @Transactional(readOnly = true)
    public Procedimento buscarProcedimentoPorCodigo(String codigo) {
        try {
            if (codigo == null || codigo.trim().isEmpty()) {
                throw new IllegalArgumentException("Código do procedimento é obrigatório");
            }
            
            return procedimentoRepository.findByCodProcedimento(codigo)
                    .orElseThrow(() -> new RuntimeException("Procedimento não encontrado com código: " + codigo));
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar procedimento: " + e.getMessage(), e);
        }
    }

    /**
     * Lista todos os procedimentos.
     * @return Lista de todos os procedimentos
     */
    @Transactional(readOnly = true)
    public List<Procedimento> listarTodos() {
        try {
            return procedimentoRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar procedimentos: " + e.getMessage(), e);
        }
    }
    
    /**
     * Lista procedimentos ordenados por descrição.
     * @return Lista de procedimentos ordenados alfabeticamente
     */
    @Transactional(readOnly = true)
    public List<Procedimento> listarOrdenadosPorDescricao() {
        try {
            return procedimentoRepository.findAllOrderByDescricao();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar procedimentos ordenados: " + e.getMessage(), e);
        }
    }
    
    /**
     * Conta o total de procedimentos disponíveis no catálogo.
     * Este método é otimizado para contagem apenas, usado no dashboard.
     * @return Número total de procedimentos cadastrados
     */
    @Transactional(readOnly = true)
    public Long contarTotalProcedimentos() {
        try {
            return procedimentoRepository.countTotalProcedimentos();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao contar procedimentos: " + e.getMessage(), e);
        }
    }
    
    /**
     * Busca procedimentos por descrição.
     * @param descricao Texto a ser buscado na descrição
     * @return Lista de procedimentos que contêm o texto
     */
    @Transactional(readOnly = true)
    public List<Procedimento> buscarPorDescricao(String descricao) {
        try {
            if (descricao == null || descricao.trim().isEmpty()) {
                return listarTodos();
            }
            
            return procedimentoRepository.findByDescricaoContaining(descricao.trim());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar procedimentos por descrição: " + e.getMessage(), e);
        }
    }
}
