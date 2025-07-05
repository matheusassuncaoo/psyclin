package com.br.psyclin.repositories;

import com.br.psyclin.models.Email;
import com.br.psyclin.models.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para operações de banco de dados com Email.
 */
@Repository
public interface EmailRepository extends JpaRepository<Email, Integer> {
    
    /**
     * Busca emails por pessoa.
     */
    List<Email> findByPessoa(Pessoa pessoa);
    
    /**
     * Verifica se existe email com o endereço informado.
     */
    boolean existsByEmail(String email);
}
