package com.br.psyclin.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class DatabaseMonitorService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Retorna a quantidade de conexões ativas por usuário
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getActiveConnections() {
        String sql = """
                SELECT
                    user,
                    COUNT(*) AS connections
                FROM
                    information_schema.processlist
                GROUP BY user
                ORDER BY connections DESC
                """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Gera comandos KILL para conexões excedentes
     */
    @Transactional
    public List<String> generateKillCommands() {
        String sql = """
                SELECT
                    CONCAT('KILL ', ID, ';') as kill_command
                FROM
                    information_schema.processlist
                WHERE ID <> CONNECTION_ID()
                """;
        return jdbcTemplate.queryForList(sql, String.class);
    }

    /**
     * Executa os comandos KILL para limpar conexões excedentes
     */
    @Transactional
    public void killExcessConnections() {
        List<String> killCommands = generateKillCommands();
        for (String command : killCommands) {
            jdbcTemplate.execute(command);
        }
    }

    /**
     * Busca informações sobre chaves estrangeiras
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getForeignKeyInfo() {
        String sql = """
                SELECT
                    kcu.CONSTRAINT_NAME,
                    kcu.TABLE_SCHEMA,
                    kcu.TABLE_NAME,
                    kcu.COLUMN_NAME,
                    kcu.REFERENCED_TABLE_SCHEMA,
                    kcu.REFERENCED_TABLE_NAME,
                    kcu.REFERENCED_COLUMN_NAME,
                    rc.UPDATE_RULE,
                    rc.DELETE_RULE
                FROM
                    INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
                INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
                    ON kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
                    AND kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
                WHERE kcu.REFERENCED_TABLE_NAME IS NOT NULL
                ORDER BY kcu.CONSTRAINT_NAME, kcu.COLUMN_NAME
                """;
        return jdbcTemplate.queryForList(sql);
    }
}