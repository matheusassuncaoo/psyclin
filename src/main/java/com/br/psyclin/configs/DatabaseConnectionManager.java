package com.br.psyclin.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.scheduling.annotation.Scheduled;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Monitora e gerencia conexões do banco de dados automaticamente
 * Para resolver o problema: User 'aluno7' has exceeded the 'max_user_connections' resource
 */
@Component
public class DatabaseConnectionManager implements HealthIndicator {

    @Autowired
    private DataSource dataSource;
    
    private int activeConnections = 0;
    private int maxConnections = 0;

    /**
     * Verifica status das conexões a cada 2 minutos (mais frequente)
     */
    @Scheduled(fixedRate = 120000) // 2 minutos
    public void monitorConnections() {
        try {
            checkConnectionStatus();
            if (activeConnections >= maxConnections * 0.7) { // 70% do limite (mais agressivo)
                System.out.println("⚠️ AVISO: Muitas conexões ativas (" + activeConnections + "/" + maxConnections + ")");
                // Força limpeza de conexões ociosas
                forceCleanIdleConnections();
            } else if (activeConnections >= maxConnections * 0.5) { // 50% do limite
                System.out.println("📊 INFO: Uso moderado de conexões (" + activeConnections + "/" + maxConnections + ")");
            }
        } catch (Exception e) {
            System.err.println("❌ Erro ao monitorar conexões: " + e.getMessage());
        }
    }

    /**
     * Verifica status atual das conexões
     */
    private void checkConnectionStatus() {
        try (Connection conn = dataSource.getConnection()) {
            // Verifica conexões do usuário atual
            String query = "SHOW PROCESSLIST";
            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {
                
                int userConnections = 0;
                while (rs.next()) {
                    String user = rs.getString("User");
                    if ("aluno7".equals(user)) {
                        userConnections++;
                    }
                }
                
                this.activeConnections = userConnections;
                
                // Pega limite máximo
                String limitQuery = "SHOW VARIABLES LIKE 'max_user_connections'";
                try (PreparedStatement limitStmt = conn.prepareStatement(limitQuery);
                     ResultSet limitRs = limitStmt.executeQuery()) {
                    if (limitRs.next()) {
                        this.maxConnections = limitRs.getInt("Value");
                    }
                }
                
                System.out.println("📊 Conexões ativas: " + activeConnections + "/" + maxConnections);
                
            }
        } catch (SQLException e) {
            System.err.println("❌ Erro ao verificar status das conexões: " + e.getMessage());
        }
    }

    /**
     * Força fechamento de conexões ociosas de forma mais agressiva
     */
    private void forceCleanIdleConnections() {
        try (Connection conn = dataSource.getConnection()) {
            // Mata conexões ociosas há mais de 3 minutos (mais agressivo que 5 minutos)
            String query = "SELECT ID, TIME, COMMAND, STATE FROM INFORMATION_SCHEMA.PROCESSLIST " +
                          "WHERE USER = 'aluno7' AND COMMAND IN ('Sleep', 'Query') AND TIME > 180 " +
                          "AND ID != CONNECTION_ID()";
            
            int killedConnections = 0;
            
            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {
                
                while (rs.next()) {
                    int processId = rs.getInt("ID");
                    int time = rs.getInt("TIME");
                    String command = rs.getString("COMMAND");
                    String state = rs.getString("STATE");
                    
                    try (PreparedStatement killStmt = conn.prepareStatement("KILL " + processId)) {
                        killStmt.execute();
                        killedConnections++;
                        System.out.println("🗑️ Conexão ociosa eliminada: ID=" + processId + 
                                         ", Tempo=" + time + "s, Comando=" + command + ", Estado=" + state);
                    } catch (SQLException killError) {
                        // Conexão pode já ter sido fechada - não é erro crítico
                        System.out.println("⚠️ Não foi possível matar conexão " + processId + ": " + killError.getMessage());
                    }
                }
            }
            
            if (killedConnections > 0) {
                System.out.println("🧹 LIMPEZA CONCLUÍDA: " + killedConnections + " conexões ociosas eliminadas");
            } else {
                System.out.println("✅ Nenhuma conexão ociosa >3min encontrada para limpeza");
            }
            
        } catch (SQLException e) {
            System.err.println("❌ Erro ao limpar conexões ociosas: " + e.getMessage());
        }
    }

    /**
     * Health check para o Spring Boot Actuator
     */
    @Override
    public Health health() {
        try {
            checkConnectionStatus();
            
            if (activeConnections >= maxConnections) {
                return Health.down()
                    .withDetail("connections", activeConnections + "/" + maxConnections)
                    .withDetail("status", "LIMITE_ATINGIDO")
                    .build();
            } else if (activeConnections >= maxConnections * 0.8) {
                return Health.up()
                    .withDetail("connections", activeConnections + "/" + maxConnections)
                    .withDetail("status", "AVISO_ALTO_USO")
                    .build();
            } else {
                return Health.up()
                    .withDetail("connections", activeConnections + "/" + maxConnections)
                    .withDetail("status", "OK")
                    .build();
            }
        } catch (Exception e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
    }

    /**
     * Endpoint para forçar limpeza manual - mais agressiva
     */
    public void forceCleanup() {
        System.out.println("🧹 Iniciando limpeza forçada de conexões...");
        
        try (Connection conn = dataSource.getConnection()) {
            // Limpeza agressiva: mata conexões ociosas há mais de 1 minuto
            String query = "SELECT ID, TIME, COMMAND, STATE, INFO FROM INFORMATION_SCHEMA.PROCESSLIST " +
                          "WHERE USER = 'aluno7' AND COMMAND IN ('Sleep', 'Query') AND TIME > 60 " +
                          "AND ID != CONNECTION_ID()";
            
            int killedConnections = 0;
            
            try (PreparedStatement stmt = conn.prepareStatement(query);
                 ResultSet rs = stmt.executeQuery()) {
                
                while (rs.next()) {
                    int processId = rs.getInt("ID");
                    int time = rs.getInt("TIME");
                    String command = rs.getString("COMMAND");
                    String state = rs.getString("STATE");
                    String info = rs.getString("INFO");
                    
                    try (PreparedStatement killStmt = conn.prepareStatement("KILL " + processId)) {
                        killStmt.execute();
                        killedConnections++;
                        System.out.println("🗑️ [FORÇADA] Conexão eliminada: ID=" + processId + 
                                         ", Tempo=" + time + "s, Cmd=" + command + 
                                         ", Estado=" + state + ", Query=" + (info != null ? info.substring(0, Math.min(50, info.length())) : "null"));
                    } catch (SQLException killError) {
                        System.out.println("⚠️ Não foi possível matar conexão " + processId + ": " + killError.getMessage());
                    }
                }
            }
            
            if (killedConnections > 0) {
                System.out.println("🧹 LIMPEZA FORÇADA CONCLUÍDA: " + killedConnections + " conexões eliminadas");
            } else {
                System.out.println("✅ Nenhuma conexão ociosa >1min encontrada na limpeza forçada");
            }
            
        } catch (SQLException e) {
            System.err.println("❌ Erro na limpeza forçada: " + e.getMessage());
        }
        
        System.out.println("✅ Limpeza forçada concluída");
    }
}
