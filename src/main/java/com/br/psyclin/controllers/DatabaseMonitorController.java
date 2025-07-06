package com.psyclin.controllers;

import com.psyclin.services.DatabaseMonitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/database")
public class DatabaseMonitorController {

    @Autowired
    private DatabaseMonitorService databaseMonitorService;

    @GetMapping("/connections")
    public ResponseEntity<List<Map<String, Object>>> getActiveConnections() {
        return ResponseEntity.ok(databaseMonitorService.getActiveConnections());
    }

    @GetMapping("/kill-commands")
    public ResponseEntity<List<String>> getKillCommands() {
        return ResponseEntity.ok(databaseMonitorService.generateKillCommands());
    }

    @PostMapping("/kill-connections")
    public ResponseEntity<Void> killExcessConnections() {
        databaseMonitorService.killExcessConnections();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/foreign-keys")
    public ResponseEntity<List<Map<String, Object>>> getForeignKeyInfo() {
        return ResponseEntity.ok(databaseMonitorService.getForeignKeyInfo());
    }
}