package com.psyclin.controllers;

import com.br.psyclin.models.RelatorioDTO;
import com.br.psyclin.services.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    @Autowired
    private ConsultaService consultaService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Salvar relatório (como anamnese)
    @PostMapping
    public ResponseEntity<?> salvarRelatorio(@RequestBody RelatorioDTO relatorio) {
        try {
            if (relatorio.getIdPaciente() == null || relatorio.getDescricao() == null
                    || relatorio.getDescricao().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("ID do paciente e descrição são obrigatórios");
            }
            // Buscar o IDPACIENTE correspondente ao ID_PESSOAFIS recebido
            String buscaPacienteSql = "SELECT IDPACIENTE FROM PACIENTE WHERE ID_PESSOAFIS = ?";
            Long idPaciente = jdbcTemplate.queryForObject(buscaPacienteSql, new Object[] { relatorio.getIdPaciente() },
                    Long.class);
            if (idPaciente == null) {
                return ResponseEntity.badRequest().body("Paciente não encontrado para o ID_PESSOAFIS informado");
            }
            // Salvar como nova anamnese
            String sql = "INSERT INTO ANAMNESE (ID_PACIENTE, DATAANAM, STATUSANM, OBSERVACOES) VALUES (?, NOW(), 'RELATORIO', ?)";
            jdbcTemplate.update(sql, idPaciente, relatorio.getDescricao());
            return ResponseEntity.ok().body("Relatório salvo com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao salvar relatório: " + e.getMessage());
        }
    }

    // Salvar prontuário (relatório) na tabela PRONTUARIO
    @PostMapping("/prontuario")
    public ResponseEntity<?> salvarProntuario(@RequestBody RelatorioDTO relatorio) {
        try {
            if (relatorio.getIdPaciente() == null || relatorio.getDescricao() == null
                    || relatorio.getDescricao().trim().isEmpty() || relatorio.getIdProcedimento() == null) {
                return ResponseEntity.badRequest().body("ID do paciente, procedimento e descrição são obrigatórios");
            }
            // Buscar o IDPACIENTE correspondente ao ID_PESSOAFIS recebido
            String buscaPacienteSql = "SELECT IDPACIENTE FROM PACIENTE WHERE ID_PESSOAFIS = ?";
            Long idPaciente = jdbcTemplate.queryForObject(buscaPacienteSql, new Object[] { relatorio.getIdPaciente() },
                    Long.class);
            if (idPaciente == null) {
                return ResponseEntity.badRequest().body("Paciente não encontrado para o ID_PESSOAFIS informado");
            }
            // Inserir na tabela PRONTUARIO
            String sql = "INSERT INTO PRONTUARIO (ID_PACIENTE, ID_PROFISSIO, ID_ESPEC, ID_PROCED, DATAPROCED, DESCRPRONTU, LINKPROCED, AUTOPACVISU) VALUES (?, ?, ?, ?, NOW(), ?, NULL, ?)";
            jdbcTemplate.update(sql,
                    idPaciente,
                    1, // ID_PROFISSIO fixo
                    3, // ID_ESPEC fixo (Psicologia)
                    relatorio.getIdProcedimento(),
                    relatorio.getDescricao(),
                    1 // AUTOPACVISU fixo
            );
            return ResponseEntity.ok().body("Prontuário salvo com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao salvar prontuário: " + e.getMessage());
        }
    }

    // Buscar procedimentos por termo (para auto-sugestão)
    @GetMapping("/procedimentos/buscar")
    public ResponseEntity<?> buscarProcedimentos(@RequestParam String termo) {
        try {
            if (termo == null || termo.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Termo de busca é obrigatório");
            }

            String sql = "SELECT IDPROCED, DESCRPROC FROM PROCEDIMENTO WHERE DESCRPROC LIKE ? ORDER BY DESCRPROC LIMIT 10";
            var procedimentos = jdbcTemplate.queryForList(sql, "%" + termo.trim() + "%");

            return ResponseEntity.ok(procedimentos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar procedimentos: " + e.getMessage());
        }
    }

    // Listar relatórios do paciente (PRONTUARIO + nome do procedimento)
    @GetMapping("/{idPaciente}")
    public ResponseEntity<?> listarRelatorios(@PathVariable Long idPaciente) {
        try {
            String sql = "SELECT p.IDPRONTU, p.DATAPROCED, p.DESCRPRONTU, p.ID_PROCED, proc.DESCRPROC " +
                    "FROM PRONTUARIO p " +
                    "LEFT JOIN PROCEDIMENTO proc ON p.ID_PROCED = proc.IDPROCED " +
                    "WHERE p.ID_PACIENTE = ? " +
                    "ORDER BY p.DATAPROCED DESC";
            var relatorios = jdbcTemplate.queryForList(sql, idPaciente);
            return ResponseEntity.ok(relatorios);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar relatórios: " + e.getMessage());
        }
    }

    // Buscar relatórios por nome do paciente (parcial)
    @GetMapping("/buscar-por-nome")
    public ResponseEntity<?> buscarRelatoriosPorNome(@RequestParam String nome) {
        try {
            if (nome == null || nome.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nome do paciente é obrigatório");
            }
            String sql = "SELECT p.IDPRONTU, p.DATAPROCED, p.DESCRPRONTU, p.ID_PROCED, proc.DESCRPROC, pf.NOMEPESSOA " +
                    "FROM PRONTUARIO p " +
                    "LEFT JOIN PROCEDIMENTO proc ON p.ID_PROCED = proc.IDPROCED " +
                    "INNER JOIN PACIENTE pa ON p.ID_PACIENTE = pa.IDPACIENTE " +
                    "INNER JOIN PESSOAFIS pf ON pa.ID_PESSOAFIS = pf.IDPESSOAFIS " +
                    "WHERE pf.NOMEPESSOA LIKE ? " +
                    "ORDER BY p.DATAPROCED DESC";
            var relatorios = jdbcTemplate.queryForList(sql, "%" + nome.trim() + "%");
            return ResponseEntity.ok(relatorios);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar relatórios por nome: " + e.getMessage());
        }
    }
}