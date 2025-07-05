package com.br.psyclin.repositories;

import com.br.psyclin.models.TipoLogradouro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository para operações de banco de dados com TipoLogradouro.
 */
@Repository
public interface TipoLogradouroRepository extends JpaRepository<TipoLogradouro, Integer> {
    
    /**
     * Busca tipo de logradouro por tipo.
     */
    Optional<TipoLogradouro> findByTipo(String tipo);
}
