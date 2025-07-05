package com.br.psyclin.repositories;

import com.br.psyclin.models.Cidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository para operações de banco de dados com Cidade.
 */
@Repository
public interface CidadeRepository extends JpaRepository<Cidade, Integer> {
    
    /**
     * Busca cidade por nome e estado.
     */
    Optional<Cidade> findByCidadeAndEstado(String cidade, String estado);
}
