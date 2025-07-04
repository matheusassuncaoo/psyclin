/**
 * @fileoverview Script global para gerenciar botões de ajuda em todas as páginas
 * Redireciona para a página de ajuda quando o botão é clicado
 * @version 1.0.0
 * @author Sistema Psyclin
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configurar todos os botões de ajuda na página
    configurarBotoesAjuda();
});

/**
 * Configura todos os botões de ajuda para redirecionar para a página de ajuda
 */
function configurarBotoesAjuda() {
    // Selecionar todos os botões com a classe 'button-help'
    const botoesAjuda = document.querySelectorAll('.button-help');
    
    botoesAjuda.forEach(botao => {
        // Adicionar evento de clique
        botao.addEventListener('click', function(event) {
            event.preventDefault();
            abrirPaginaAjuda();
        });
        
        // Adicionar cursor pointer se não estiver definido
        botao.style.cursor = 'pointer';
        
        // Melhorar acessibilidade
        if (!botao.hasAttribute('tabindex')) {
            botao.setAttribute('tabindex', '0');
        }
        
        // Adicionar evento de teclado para acessibilidade
        botao.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                abrirPaginaAjuda();
            }
        });
    });
    
    console.log(`✅ Configurados ${botoesAjuda.length} botão(ões) de ajuda`);
}

/**
 * Abre a página de ajuda
 */
function abrirPaginaAjuda() {
    // Armazenar a página atual para possível retorno
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('psyclin_ultima_pagina', window.location.href);
    }
    
    // Redirecionar para a página de ajuda
    window.location.href = '/view/html/ajuda/ajuda.html';
}

/**
 * Função para voltar da página de ajuda para a última página visitada
 * Esta função é chamada pelo botão "Voltar" na página de ajuda
 */
function voltarUltimaPagina() {
    if (typeof(Storage) !== "undefined") {
        const ultimaPagina = localStorage.getItem('psyclin_ultima_pagina');
        if (ultimaPagina) {
            window.location.href = ultimaPagina;
            return;
        }
    }
    
    // Fallback: voltar usando history.back() ou ir para dashboard
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/view/html/dashboard/dashboard.html';
    }
}

// Tornar a função disponível globalmente
window.voltarUltimaPagina = voltarUltimaPagina;
