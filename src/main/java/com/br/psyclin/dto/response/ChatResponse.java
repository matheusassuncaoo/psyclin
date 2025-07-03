package com.br.psyclin.dto.response;

/**
 * DTO para respostas do chat AI.
 * Contém a resposta do assistente virtual e informações adicionais.
 */
public class ChatResponse {
    
    private String message;
    private boolean success;
    private String type; // "answer", "limitation", "error"
    
    public ChatResponse() {}
    
    public ChatResponse(String message, boolean success, String type) {
        this.message = message;
        this.success = success;
        this.type = type;
    }
    
    public static ChatResponse success(String message) {
        return new ChatResponse(message, true, "answer");
    }
    
    public static ChatResponse limitation(String message) {
        return new ChatResponse(message, true, "limitation");
    }
    
    public static ChatResponse error(String message) {
        return new ChatResponse(message, false, "error");
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
}
