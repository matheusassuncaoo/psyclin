package com.psyclin.controllers;

import com.psyclin.models.ConsultaDTO;
import com.br.psyclin.services.ConsultaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*") // Permite requisições de qualquer origem
public class ConsultaController {

    private static final Logger logger = LoggerFactory.getLogger(ConsultaController.class);

    @Autowired
    private ConsultaService consultaService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Endpoint para buscar consultas agendadas
     * 
     * @param periodo - Filtro de período (hoje, semana, mes)
     * @return Lista de consultas ordenadas por proximidade do horário
     */
    @GetMapping
    public ResponseEntity<?> getConsultas(
            @RequestParam(required = false, defaultValue = "hoje") String periodo) {
        try {
            logger.info("Buscando consultas para o período: {}", periodo);
            List<ConsultaDTO> consultas = consultaService.buscarConsultasPorPeriodo(periodo);
            logger.info("Encontradas {} consultas", consultas.size());
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            logger.error("Erro ao buscar consultas: ", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erro ao buscar consultas: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Endpoint para criar uma nova consulta
     * 
     * @param consultaDTO - Dados da consulta a ser criada
     * @return Confirmação da criação da consulta
     */
    @PostMapping
    public ResponseEntity<?> criarConsulta(@RequestBody ConsultaDTO consultaDTO) {
        try {
            logger.info("Criando nova consulta para paciente: {}", consultaDTO.getNomePaciente());

            // Validar dados obrigatórios
            if (consultaDTO.getIdPessoa() == null || consultaDTO.getNomePaciente() == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "ID da pessoa e nome do paciente são obrigatórios");
                return ResponseEntity.badRequest().body(error);
            }

            // Criar a consulta através do service
            ConsultaDTO consultaCriada = consultaService.criarConsulta(consultaDTO);

            logger.info("Consulta criada com sucesso para: {}", consultaCriada.getNomePaciente());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Consulta criada com sucesso");
            response.put("consulta", consultaCriada);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Erro ao criar consulta: ", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erro ao criar consulta: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Endpoint para atualizar o status da agenda (consulta)
     * 
     * @param idAgenda - ID da agenda (consulta)
     * @param status   - novo status (1=aguardando, 2=atendido, 3=cancelado)
     * @return Mensagem de sucesso ou erro
     */
    @PutMapping("/agenda/{idAgenda}/status")
    public ResponseEntity<?> atualizarStatusAgenda(
            @PathVariable Long idAgenda,
            @RequestParam("status") int status) {
        try {
            String sql = "UPDATE AGENDA SET SITUAGEN = ? WHERE IDAGENDA = ?";
            logger.info("Atualizando status da agenda. IDAGENDA: {}, Novo Status: {}", idAgenda, status);
            int rows = jdbcTemplate.update(sql, status, idAgenda);
            logger.info("SQL executado: {} | Linhas afetadas: {}", sql, rows);
            if (rows > 0) {
                return ResponseEntity.ok().body("Status atualizado com sucesso!");
            } else {
                logger.warn("Agendamento não encontrado para IDAGENDA: {}", idAgenda);
                return ResponseEntity.status(404).body("Agendamento não encontrado.");
            }
        } catch (Exception e) {
            logger.error("Erro ao atualizar status da agenda: ", e);
            return ResponseEntity.status(500).body("Erro ao atualizar status: " + e.getMessage());
        }
    }
}