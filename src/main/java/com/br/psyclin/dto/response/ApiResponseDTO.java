package com.br.psyclin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO padrão para respostas da API
 * @param <T> Tipo de dados retornados
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseDTO<T> {
    
    private boolean success;
    private String message;
    private T data;
    private String error;
    
    /**
     * Resposta de sucesso com dados
     */
    public static <T> ApiResponseDTO<T> success(T data) {
        return new ApiResponseDTO<>(true, "Operação realizada com sucesso", data, null);
    }
    
    /**
     * Resposta de sucesso com mensagem personalizada
     */
    public static <T> ApiResponseDTO<T> success(String message, T data) {
        return new ApiResponseDTO<>(true, message, data, null);
    }
    
    /**
     * Resposta de erro
     */
    public static <T> ApiResponseDTO<T> error(String error) {
        return new ApiResponseDTO<>(false, null, null, error);
    }
    
    /**
     * Resposta de erro com mensagem personalizada
     */
    public static <T> ApiResponseDTO<T> error(String message, String error) {
        return new ApiResponseDTO<>(false, message, null, error);
    }
}