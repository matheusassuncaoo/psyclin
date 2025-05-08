package com.br.psyclin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.br.psyclin.models.Profissional;

@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {

    Profissional findByCodProf(String codProf);
}