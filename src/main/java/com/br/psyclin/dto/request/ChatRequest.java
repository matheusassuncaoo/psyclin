package com.br.psyclin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para requisições do chat AI.
 * Contém a mensagem do usuário para ser processada pelo assistente virtual.
 */
public class ChatRequest {
    
    @NotBlank(message = "A mensagem não pode estar vazia")
    @Size(max = 500, message = "A mensagem deve ter no máximo 500 caracteres")
    private String message;
    
    public ChatRequest() {}
    
    public ChatRequest(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
