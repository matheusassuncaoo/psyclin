package com.br.psyclin.repositories;

import com.br.psyclin.models.Contato;
import com.br.psyclin.models.Pessoa;
import com.br.psyclin.models.TipoContato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para operações de banco de dados com Contato.
 */
@Repository
public interface ContatoRepository extends JpaRepository<Contato, Integer> {
    
    /**
     * Busca contatos por pessoa.
     */
    List<Contato> findByPessoa(Pessoa pessoa);
    
    /**
     * Busca contatos por pessoa e tipo.
     */
    List<Contato> findByPessoaAndTipoContato(Pessoa pessoa, TipoContato tipoContato);
}
