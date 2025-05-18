package com.br.psyclin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.br.psyclin.models.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> { // Long por causa do ID como PK

    Optional<Paciente> findByCodPac(String codPac);

    List<Paciente> findByNomePacContainingIgnoreCase(String nomePac);

    List<Paciente> findByStatusPac(Integer statusPac);

    Optional<Paciente> findByCpfPac(String cpfPac);
}