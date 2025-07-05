package com.br.psyclin.repositories;

import com.br.psyclin.models.Endereco;
import com.br.psyclin.models.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para operações de banco de dados com Endereco.
 */
@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Integer> {
    
    /**
     * Busca endereços por pessoa.
     */
    List<Endereco> findByPessoa(Pessoa pessoa);
}
