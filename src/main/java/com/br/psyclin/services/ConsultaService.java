package com.br.psyclin.services;

import com.br.psyclin.models.ConsultaDTO;
import com.br.psyclin.models.RelatorioDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class ConsultaService {

    private static final Logger logger = LoggerFactory.getLogger(ConsultaService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Busca consultas agendadas baseado no período especificado
     * 
     * @param periodo - pode ser "hoje", "semana" ou "mes"
     * @return Lista de consultas ordenadas por proximidade do horário atual
     */
    public List<ConsultaDTO> buscarConsultasPorPeriodo(String periodo) {
        logger.debug("Iniciando busca de consultas para o período: {}", periodo);

        String sql = """
                SELECT DISTINCT
                    p.ID_PESSOA,
                    p.NOMEPESSOA,
                    p.SEXOPESSOA,
                    a.DATAABERT,
                    a.ID_PROFISSIO,
                    a.ID_PROCED
                FROM PESSOAFIS p
                INNER JOIN PACIENTE pac ON p.ID_PESSOA = pac.ID_PESSOAFIS
                INNER JOIN AGENDA a ON p.ID_PESSOA = a.ID_PESSOAFIS
                WHERE 1=1
                AND a.SITUAGEN = 1
                """;

        // Adiciona filtro de data baseado no período
        switch (periodo.toLowerCase()) {
            case "hoje":
                sql += " AND DATE(a.DATAABERT) = CURDATE()";
                break;
            case "semana":
                sql += """
                        AND DATE(a.DATAABERT) BETWEEN CURDATE()
                        AND DATE_ADD(CURDATE(), INTERVAL 5 DAY)
                        AND WEEKDAY(a.DATAABERT) < 5
                        """;
                break;
            case "mes":
                sql += """
                        AND MONTH(a.DATAABERT) = MONTH(CURDATE())
                        AND YEAR(a.DATAABERT) = YEAR(CURDATE())
                        """;
                break;
            default:
                logger.warn("Período inválido: {}. Usando período 'hoje' como padrão.", periodo);
                sql += " AND DATE(a.DATAABERT) = CURDATE()";
        }

        // Ordena por proximidade do horário atual
        sql += """
                ORDER BY
                    CASE
                        WHEN TIME(a.DATAABERT) >= CURRENT_TIME THEN 0
                        ELSE 1
                    END,
                    ABS(TIME_TO_SEC(TIMEDIFF(TIME(a.DATAABERT), CURRENT_TIME)))
                """;

        logger.debug("SQL gerado: {}", sql);

        try {
            List<ConsultaDTO> consultas = jdbcTemplate.query(sql, (rs, rowNum) -> {
                ConsultaDTO consulta = new ConsultaDTO();
                consulta.setIdPessoa(rs.getLong("ID_PESSOA"));
                consulta.setNomePaciente(rs.getString("NOMEPESSOA"));
                consulta.setSexoPaciente(rs.getString("SEXOPESSOA"));

                // Tratamento correto da data
                Timestamp timestamp = rs.getTimestamp("DATAABERT");
                if (timestamp != null) {
                    LocalDateTime dataHora = timestamp.toLocalDateTime();
                    consulta.setDataConsulta(dataHora);
                }

                consulta.setIdProfissional(rs.getLong("ID_PROFISSIO"));
                consulta.setIdProcedimento(rs.getLong("ID_PROCED"));

                // Log detalhado de cada consulta encontrada
                logger.debug("Consulta encontrada: ID={}, Nome={}, Data={}, Sexo={}",
                        consulta.getIdPessoa(),
                        consulta.getNomePaciente(),
                        consulta.getDataConsulta(),
                        consulta.getSexoPaciente());

                return consulta;
            });

            logger.debug("Consulta executada com sucesso. {} registros encontrados.", consultas.size());
            return consultas != null ? consultas : new ArrayList<>();
        } catch (Exception e) {
            logger.error("Erro ao executar consulta SQL: ", e);
            throw new RuntimeException("Erro ao buscar consultas: " + e.getMessage(), e);
        }
    }

    /**
     * Cria uma nova consulta na agenda
     * 
     * @param consultaDTO - Dados da consulta a ser criada
     * @return ConsultaDTO com os dados da consulta criada
     */
    public ConsultaDTO criarConsulta(ConsultaDTO consultaDTO) {
        logger.info("Criando nova consulta para paciente: {}", consultaDTO.getNomePaciente());

        try {
            // SQL para inserir nova consulta na tabela AGENDA.
            // Usamos a função NOW() do MySQL para garantir que a data e hora
            // sejam sempre as do servidor, evitando problemas de fuso horário.
            String sql = """
                    INSERT INTO AGENDA (
                        ID_PESSOAFIS,
                        DATAABERT,
                        ID_PROFISSIO,
                        ID_PROCED,
                        SITUAGEN
                    ) VALUES (?, ?, ?, ?, ?)
                    """;

            // Valores padrão para a consulta
            Long idProfissional = consultaDTO.getIdProfissional() != null ? consultaDTO.getIdProfissional() : 1L;
            Long idProcedimento = consultaDTO.getIdProcedimento() != null ? consultaDTO.getIdProcedimento() : 1L;
            int statusAgenda = 1; // 1 = Aguardando

            // Executar a inserção, agora passando a data/hora customizada
            jdbcTemplate.update(sql,
                    consultaDTO.getIdPessoa(),
                    java.sql.Timestamp.valueOf(consultaDTO.getDataConsulta()),
                    idProfissional,
                    idProcedimento,
                    statusAgenda);

            // Apenas para consistência do objeto retornado, atualizamos a data.
            consultaDTO.setDataConsulta(consultaDTO.getDataConsulta());
            logger.info("Consulta criada com sucesso para paciente: {}", consultaDTO.getNomePaciente());

            // Retornar a consulta criada
            return consultaDTO;

        } catch (Exception e) {
            logger.error("Erro ao criar consulta: ", e);
            throw new RuntimeException("Erro ao criar consulta: " + e.getMessage(), e);
        }
    }

    // Salvar relatório (prontuário)
    public void salvarRelatorio(RelatorioDTO relatorio) {
        try {
            System.out.println("[SALVAR RELATÓRIO] idPaciente=" + relatorio.getIdPaciente() + ", descricao="
                    + relatorio.getDescricao() + ", dataRegistro=" + relatorio.getDataRegistro());
            String sql = "INSERT INTO PRONTUARIO (ID_PACIENTE, DESCRPRONTU, DATAPROCED, ID_PROFISSIO, ID_ESPEC, ID_PROCED, AUTOPACVISU) VALUES (?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                    relatorio.getIdPaciente(),
                    relatorio.getDescricao(),
                    java.sql.Timestamp.valueOf(relatorio.getDataRegistro()),
                    1, // ID_PROFISSIO fixo
                    1, // ID_ESPEC fixo
                    1, // ID_PROCED fixo
                    1 // AUTOPACVISU fixo (agora 1)
            );
            System.out.println("[SALVAR RELATÓRIO] Relatório salvo com sucesso!");
        } catch (Exception e) {
            System.err.println("[SALVAR RELATÓRIO] Erro ao salvar relatório: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // Listar relatórios de um paciente
    public List<RelatorioDTO> listarRelatoriosPorPaciente(Long idPaciente) {
        String sql = "SELECT IDPRONTU, ID_PACIENTE, DESCRPRONTU, DATAPROCED FROM PRONTUARIO WHERE ID_PACIENTE = ? ORDER BY DATAPROCED DESC";
        return jdbcTemplate.query(sql, new Object[] { idPaciente }, (rs, rowNum) -> {
            RelatorioDTO r = new RelatorioDTO();
            r.setIdProntu(rs.getLong("IDPRONTU"));
            r.setIdPaciente(rs.getLong("ID_PACIENTE"));
            r.setDescricao(rs.getString("DESCRPRONTU"));
            java.sql.Timestamp ts = rs.getTimestamp("DATAPROCED");
            r.setDataRegistro(ts != null ? ts.toLocalDateTime() : null);
            return r;
        });
    }
}