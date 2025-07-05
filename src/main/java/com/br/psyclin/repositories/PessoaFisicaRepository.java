package com.br.psyclin.repositories;

import com.br.psyclin.models.PessoaFisica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository para operações de banco de dados com PessoaFisica.
 */
@Repository
public interface PessoaFisicaRepository extends JpaRepository<PessoaFisica, Integer> {
    
    /**
     * Busca pessoa física por CPF.
     */
    Optional<PessoaFisica> findByCpfPessoa(String cpfPessoa);
    
    /**
     * Verifica se existe pessoa física com o CPF informado.
     */
    boolean existsByCpfPessoa(String cpfPessoa);
}
