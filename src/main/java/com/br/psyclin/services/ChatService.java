package com.br.psyclin.services;

import com.br.psyclin.dto.request.ChatRequest;
import com.br.psyclin.dto.response.ChatResponse;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

/**
 * Serviço responsável por processar mensagens do chat AI.
 * Implementa limitações de segurança e privacidade para uso educacional.
 */
@Service
public class ChatService {
    
    @Autowired(required = false)
    private OpenAiChatModel chatModel;
    
    // Lista de tópicos proibidos
    private static final List<String> TOPICOS_PROIBIDOS = Arrays.asList(
        "diagnóstico", "medicamento", "prescrição", "tratamento específico",
        "dados pessoais", "telefone", "endereço", "cpf", "rg",
        "informações confidenciais", "prontuário específico",
        "terapia individual", "caso clínico real"
    );
    
    public ChatResponse processarMensagem(ChatRequest request) {
        try {
            String mensagem = request.getMessage().toLowerCase();
            
            // Verificar se contém tópicos proibidos
            for (String proibido : TOPICOS_PROIBIDOS) {
                if (mensagem.contains(proibido)) {
                    return ChatResponse.limitation(
                        "Desculpe, não posso fornecer informações sobre " + proibido + ". " +
                        "Como assistente educacional, posso ajudar apenas com conceitos gerais de psicologia, " +
                        "métodos de estudo e orientações acadêmicas."
                    );
                }
            }
            
            // Verificar se o OpenAI está disponível
            if (chatModel == null) {
                return responderSemIA(request.getMessage());
            }
            
            // Criar prompt com contexto educacional
            String promptContextualizado = criarPromptEducacional(request.getMessage());
            
            // Obter resposta da IA
            String resposta = chatModel.call(promptContextualizado);
            
            return ChatResponse.success(resposta);
            
        } catch (Exception e) {
            System.err.println("Erro no ChatService: " + e.getMessage());
            e.printStackTrace();
            
            // Se houver erro com a IA, usar fallback
            return responderSemIA(request.getMessage());
        }
    }
    
    private ChatResponse responderSemIA(String mensagem) {
        String mensagemLower = mensagem.toLowerCase();
        
        // Respostas baseadas em palavras-chave
        if (mensagemLower.contains("oi") || mensagemLower.contains("olá") || mensagemLower.contains("hello")) {
            return ChatResponse.success(
                "Olá! 👋 Sou o assistente educacional do Psyclin. Posso ajudar com:\n\n" +
                "• Conceitos básicos de psicologia\n" +
                "• Teorias e escolas psicológicas\n" +
                "• Métodos de pesquisa\n" +
                "• Ética profissional\n" +
                "• Técnicas de entrevista\n" +
                "• Uso do sistema Psyclin\n\n" +
                "Como posso te ajudar hoje?"
            );
        }
        
        if (mensagemLower.contains("anamnese")) {
            return ChatResponse.success(
                "📋 **Anamnese em Psicologia:**\n\n" +
                "A anamnese é uma entrevista estruturada para coletar informações sobre:\n\n" +
                "• **Histórico pessoal** - desenvolvimento, educação\n" +
                "• **Histórico familiar** - dinâmica, relacionamentos\n" +
                "• **Histórico social** - relacionamentos, trabalho\n" +
                "• **Motivo da consulta** - queixas principais\n" +
                "• **Expectativas** - objetivos do processo\n\n" +
                "**Dica:** Sempre mantenha postura ética e confidencialidade. Para casos práticos, consulte seu supervisor!"
            );
        }
        
        if (mensagemLower.contains("sistema") || mensagemLower.contains("psyclin")) {
            return ChatResponse.success(
                "🖥️ **Sistema Psyclin:**\n\n" +
                "Funcionalidades principais:\n\n" +
                "• **Dashboard** - visão geral dos dados\n" +
                "• **Pacientes** - cadastro e gestão\n" +
                "• **Profissionais** - controle de usuários\n" +
                "• **Anamneses** - formulários estruturados\n" +
                "• **Consultas** - agendamento e controle\n" +
                "• **Relatórios** - documentos e estatísticas\n\n" +
                "Precisa de ajuda com alguma funcionalidade específica?"
            );
        }
        
        if (mensagemLower.contains("ética")) {
            return ChatResponse.success(
                "⚖️ **Ética em Psicologia:**\n\n" +
                "Princípios fundamentais:\n\n" +
                "• **Sigilo profissional** - confidencialidade absoluta\n" +
                "• **Competência** - atuar dentro de suas qualificações\n" +
                "• **Integridade** - honestidade e transparência\n" +
                "• **Responsabilidade** - compromisso social\n" +
                "• **Respeito** - dignidade humana\n\n" +
                "Sempre consulte o Código de Ética do Psicólogo (CFP) para orientações específicas!"
            );
        }
        
        // Resposta genérica educacional
        return ChatResponse.success(
            "🎓 Sou um assistente educacional focado em psicologia e uso do sistema Psyclin.\n\n" +
            "Posso ajudar com conceitos teóricos, orientações acadêmicas e navegação no sistema.\n\n" +
            "**Exemplos do que posso explicar:**\n" +
            "• 'O que é anamnese?'\n" +
            "• 'Como funciona o sistema?'\n" +
            "• 'Ética em psicologia'\n" +
            "• 'Teorias psicológicas'\n\n" +
            "Para questões clínicas específicas, sempre consulte seu supervisor ou professor orientador!"
        );
    }
    
    private String criarPromptEducacional(String mensagemUsuario) {
        return String.format("""
            Você é um assistente educacional especializado em psicologia, criado para ajudar estudantes e profissionais em formação.
            
            DIRETRIZES IMPORTANTES:
            - Forneça apenas informações educacionais e conceituais
            - NÃO dê conselhos médicos, diagnósticos ou tratamentos específicos
            - NÃO solicite ou processe informações pessoais dos usuários
            - Foque em conceitos teóricos, métodos de estudo e orientações acadêmicas
            - Se perguntado sobre casos específicos, oriente para supervisão profissional
            
            TÓPICOS PERMITIDOS:
            - Conceitos básicos de psicologia
            - Teorias e escolas psicológicas
            - Métodos de pesquisa
            - Ética profissional
            - Técnicas de entrevista e observação
            - Elaboração de relatórios e documentos
            - História da psicologia
            
            Pergunta do usuário: %s
            
            Responda de forma educativa, clara e sempre dentro das diretrizes estabelecidas.
            """, mensagemUsuario);
    }
}
