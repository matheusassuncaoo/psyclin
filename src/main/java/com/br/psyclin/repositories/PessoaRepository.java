package com.br.psyclin.repositories;

import com.br.psyclin.models.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository para operações de banco de dados com Pessoa.
 */
@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Integer> {
}
