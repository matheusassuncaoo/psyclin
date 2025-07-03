package com.br.psyclin.controllers;

import com.br.psyclin.dto.request.ChatRequest;
import com.br.psyclin.dto.response.ChatResponse;
import com.br.psyclin.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

/**
 * Controller REST para o chat AI educacional.
 * Fornece endpoints para interação com assistente virtual especializado em psicologia.
 */
@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:8080"}, maxAge = 3600)
@Validated
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    /**
     * Processa uma mensagem do chat.
     * 
     * @param request Requisição contendo a mensagem do usuário
     * @return Resposta do assistente virtual
     */
    @PostMapping("/message")
    public ResponseEntity<ChatResponse> processarMensagem(@Valid @RequestBody ChatRequest request) {
        try {
            System.out.println("📨 Recebida mensagem: " + request.getMessage());
            ChatResponse response = chatService.processarMensagem(request);
            System.out.println("✅ Resposta enviada: " + response.getMessage().substring(0, Math.min(50, response.getMessage().length())) + "...");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erro no controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(
                ChatResponse.error("Erro interno do servidor. Tente novamente.")
            );
        }
    }
    
    /**
     * Endpoint GET para testes (fallback)
     * 
     * @param message Mensagem via query parameter
     * @return Resposta do assistente virtual
     */
    @GetMapping("/message")
    public ResponseEntity<ChatResponse> processarMensagemGet(@RequestParam String message) {
        try {
            System.out.println("📨 Recebida mensagem via GET: " + message);
            ChatRequest request = new ChatRequest(message);
            ChatResponse response = chatService.processarMensagem(request);
            System.out.println("✅ Resposta enviada via GET");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erro no controller GET: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(
                ChatResponse.error("Erro interno do servidor. Tente novamente.")
            );
        }
    }
    
    /**
     * Endpoint de health check para o chat.
     * 
     * @return Status do serviço de chat
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Chat service is running");
    }
}
