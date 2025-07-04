/**
 * @fileoverview Script global para gerenciar botões de configurações
 * Redireciona para a página de configurações e melhora a experiência do usuário
 * @version 1.0.0
 * @author Sistema Psyclin
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configurar todos os botões de configuração
    configurarBotoesConfiguracao();
});

/**
 * Configura todos os botões de configuração para redirecionar corretamente
 */
function configurarBotoesConfiguracao() {
    // Selecionar todos os botões com classe 'button-config'
    const botoesConfig = document.querySelectorAll('.button-config');
    
    botoesConfig.forEach(botao => {
        // Se for um botão (não um link), adicionar funcionalidade de clique
        if (botao.tagName === 'BUTTON') {
            botao.addEventListener('click', function(event) {
                event.preventDefault();
                abrirPaginaConfiguracoes();
            });
        }
        
        // Melhorar acessibilidade
        if (!botao.hasAttribute('tabindex')) {
            botao.setAttribute('tabindex', '0');
        }
        
        // Adicionar evento de teclado para acessibilidade
        botao.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                abrirPaginaConfiguracoes();
            }
        });
    });
    
    console.log(`✅ Configurados ${botoesConfig.length} botão(ões) de configuração`);
}

/**
 * Abre a página de configurações
 */
function abrirPaginaConfiguracoes() {
    // Armazenar a página atual para possível retorno
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('psyclin_ultima_pagina', window.location.href);
    }
    
    // Redirecionar para a página de configurações
    window.location.href = '/view/html/configuracoes/configuracoes.html';
}

/**
 * Função para adicionar feedback visual aos botões
 */
function adicionarFeedbackVisual() {
    const botoesConfig = document.querySelectorAll('.button-config');
    
    botoesConfig.forEach(botao => {
        botao.addEventListener('mouseenter', function() {
            // Adicionar tooltip se não existir
            if (!this.hasAttribute('title')) {
                this.setAttribute('title', 'Ir para Configurações do Sistema');
            }
        });
        
        botao.addEventListener('click', function() {
            // Adicionar efeito visual de clique
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Inicializar feedback visual quando a página carregar
document.addEventListener('DOMContentLoaded', adicionarFeedbackVisual);

// Tornar funções disponíveis globalmente se necessário
window.abrirPaginaConfiguracoes = abrirPaginaConfiguracoes;
