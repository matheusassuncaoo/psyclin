package com.br.psyclin.services;

import com.br.psyclin.models.Modulo;
import com.br.psyclin.repositories.ModuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

/**
 * Service para operações de negócio relacionadas a Módulos.
 * Responsável por cadastro, atualização, exclusão e busca de módulos.
 */
@Service
public class ModuloService {

    @Autowired
    private ModuloRepository moduloRepository;

    /**
     * Cadastra um novo módulo.
     * @param modulo Módulo a ser cadastrado
     * @return Módulo salvo
     */
    public Modulo cadastrarModulo(Modulo modulo) {
        // TODO: Validar duplicidade de nome e outras regras
        return moduloRepository.save(modulo);
    }

    /**
     * Atualiza os dados de um módulo existente.
     * @param id ID do módulo
     * @param dadosAtualizados Dados a serem atualizados
     * @return Módulo atualizado
     */
    public Modulo atualizarModulo(Integer id, Modulo dadosAtualizados) {
        Optional<Modulo> existente = moduloRepository.findByIdModulo(id);
        // ...
        return null;
    }

    /**
     * Exclui um módulo.
     * @param id ID do módulo
     */
    public void excluirModulo(Integer id) {
        // TODO: Verificar vínculos antes de excluir
    }

    /**
     * Busca um módulo pelo ID.
     * @param id ID do módulo
     * @return Optional contendo o módulo, se encontrado
     */
    public Optional<Modulo> buscarModuloPorId(Integer id) {
        return moduloRepository.findByIdModulo(id);
    }
} 