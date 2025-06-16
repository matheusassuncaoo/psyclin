package com.br.psyclin.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.br.psyclin.models.Anamnese;

/**
 * Repositório responsável pelas operações de persistência da entidade Anamnese.
 * Utiliza as convenções de nomenclatura do Spring Data JPA para gerar as consultas automaticamente.
 */
@Repository
@Transactional(readOnly = true)
public interface AnamneseRepository extends JpaRepository<Anamnese, Long> {

    /**
     * Busca uma anamnese pelo ID.
     * @param id ID da anamnese
     * @return Optional contendo a anamnese encontrada, se existir
     */
    Optional<Anamnese> buscarPorId(Long id);

    /**
     * Busca anamneses pelo texto da anamnese.
     * @param texto Texto da anamnese (busca parcial)
     * @return Lista de anamneses encontradas
     */
    List<Anamnese> buscarPorTexto(String texto);

    /**
     * Busca anamneses pela data de realização.
     * @param data Data da anamnese
     * @return Lista de anamneses encontradas
     */
    List<Anamnese> buscarPorDataAnamnese(LocalDate data);

    /**
     * Busca anamneses por um período de datas.
     * @param dataInicio Data inicial do período
     * @param dataFim Data final do período
     * @return Lista de anamneses encontradas no período
     */
    List<Anamnese> buscarPorPeriodoAnamnese(LocalDate dataInicio, LocalDate dataFim);

    /**
     * Busca anamneses de um paciente específico.
     * @param idPaciente ID do paciente
     * @return Lista de anamneses do paciente
     */
    List<Anamnese> buscarPorPaciente(Long idPaciente);

    /**
     * Busca anamneses realizadas por um profissional específico.
     * @param idProfissional ID do profissional
     * @return Lista de anamneses realizadas pelo profissional
     */
    List<Anamnese> buscarPorProfissional(Long idProfissional);

    /**
     * Busca anamneses por status.
     * @param status Status da anamnese (finalizada/em andamento)
     * @return Lista de anamneses encontradas
     */
    List<Anamnese> buscarPorStatus(Boolean status);

    /**
     * Busca anamneses de um paciente realizadas por um profissional específico.
     * @param idPaciente ID do paciente
     * @param idProfissional ID do profissional
     * @return Lista de anamneses encontradas
     */
    List<Anamnese> buscarPorPacienteAndProfissional(Long idPaciente, Long idProfissional);
} 