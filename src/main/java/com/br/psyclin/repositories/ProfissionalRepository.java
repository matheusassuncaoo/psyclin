package com.br.psyclin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.br.psyclin.models.Profissional;

import java.util.List;

@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {

    Profissional findByCodProf(String codProf);

    List<Profissional> findBySupProf(String supProf);

    List<Profissional> findByTipoProf(Integer tipoProf);

    List<Profissional> findByStatusProf(Integer statusProf);
}