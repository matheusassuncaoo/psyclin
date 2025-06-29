package com.br.psyclin.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuração de segurança do Spring Security.
 * Por enquanto, permite acesso livre a todos os endpoints para desenvolvimento.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita CSRF para APIs REST
            .csrf(csrf -> csrf.disable())
            
            // Configuração de CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configuração de autorização
            .authorizeHttpRequests(auth -> auth
                // Permite acesso a todos os endpoints sem autenticação
                .anyRequest().permitAll()
            )
            
            // Configuração de sessão (stateless para APIs REST)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite requisições de qualquer origem (para desenvolvimento)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // Permite todos os métodos HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Permite todos os headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permite credenciais
        configuration.setAllowCredentials(true);
        
        // Configura para todos os endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
