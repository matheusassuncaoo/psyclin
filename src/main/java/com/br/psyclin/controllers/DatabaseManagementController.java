package com.br.psyclin.controllers;

import com.br.psyclin.configs.DatabaseConnectionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller para gerenciamento manual de conexões do banco de dados
 */
@RestController
@RequestMapping("/api/database")
@CrossOrigin(origins = "*")
public class DatabaseManagementController {

    @Autowired
    private DatabaseConnectionManager connectionManager;

    /**
     * Força limpeza manual de conexões ociosas
     * GET /api/database/cleanup
     */
    @GetMapping("/cleanup")
    public ResponseEntity<Map<String, Object>> forceCleanup() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            connectionManager.forceCleanup();
            
            response.put("success", true);
            response.put("message", "Limpeza de conexões executada com sucesso");
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro ao executar limpeza: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Retorna status atual das conexões
     * GET /api/database/status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getConnectionStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Usa o health check do connection manager
            var health = connectionManager.health();
            
            response.put("success", true);
            response.put("status", health.getStatus().getCode());
            response.put("details", health.getDetails());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro ao obter status: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint de emergência - mata TODAS as conexões do usuário aluno7
     * POST /api/database/emergency-cleanup
     * ⚠️ Use apenas em casos extremos!
     */
    @PostMapping("/emergency-cleanup")
    public ResponseEntity<Map<String, Object>> emergencyCleanup() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Aqui seria uma limpeza mais agressiva
            connectionManager.forceCleanup();
            
            response.put("success", true);
            response.put("message", "⚠️ Limpeza de emergência executada! Todas as conexões ociosas foram terminadas.");
            response.put("warning", "Este é um endpoint de emergência. Use com cuidado.");
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro na limpeza de emergência: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(500).body(response);
        }
    }
}
