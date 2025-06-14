package com.br.psyclin.repositories;

import com.br.psyclin.models.Anamnese;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório JPA para entidade Anamnese
 */
@Repository
public interface AnamneseRepository extends JpaRepository<Anamnese, Long> {

    /**
     * Busca todas as anamneses associadas ao profissional
     * @param idProfissional ID do profissional
     * @return Lista de anamneses
     */
    List<Anamnese> findByIdProfissional(Long idProfissional);
}
