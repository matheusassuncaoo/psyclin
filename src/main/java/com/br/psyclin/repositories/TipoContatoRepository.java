package com.br.psyclin.repositories;

import com.br.psyclin.models.TipoContato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository para operações de banco de dados com TipoContato.
 */
@Repository
public interface TipoContatoRepository extends JpaRepository<TipoContato, Integer> {
    
    /**
     * Busca tipo de contato por tipo.
     */
    Optional<TipoContato> findByTipo(String tipo);
}
