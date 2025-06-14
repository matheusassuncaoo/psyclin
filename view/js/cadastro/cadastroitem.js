/**
 * @fileoverview Script para gerenciar a seleção e redirecionamento do tipo de cadastro
 * @version 1.0.0
 */

// Estado para armazenar o tipo selecionado
let tipoSelecionado = null;

/**
 * Inicializa os eventos dos cards de seleção
 */
function inicializarSelecaoTipo() {
    const cards = document.querySelectorAll('.tipo-card');
    const btnProximo = document.getElementById('btn-proximo-passo');

    // Adiciona evento de clique em cada card
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove seleção anterior
            cards.forEach(c => {
                c.classList.remove('bg-[var(--zomp-light)]', 'border-[var(--zomp)]');
                c.classList.add('border-gray-200', 'bg-white');
            });

            // Seleciona o card atual
            card.classList.remove('border-gray-200', 'bg-white');
            card.classList.add('bg-[var(--zomp-light)]', 'border-[var(--zomp)]');
            
            // Armazena o tipo selecionado
            tipoSelecionado = card.dataset.tipo;
        });
    });

    // Adiciona evento ao botão de próximo passo
    btnProximo.addEventListener('click', redirecionarCadastro);
}

/**
 * Redireciona para a página de cadastro específica baseada no tipo selecionado
 */
function redirecionarCadastro() {
    if (!tipoSelecionado) {
        alert('Por favor, selecione um tipo de cadastro');
        return;
    }

    const rotas = {
        'PROFISSIONAL': '/view/html/cadastro/cadastrarprofissional.html',
        'ANAMNESE': '/view/html/cadastro/cadastranamnese.html',
        'PACIENTE': '/view/html/cadastro/cadastrarpaciente.html',
        'ADMIN': '/view/html/cadastro/cadastraradmin.html'
    };

    const rota = rotas[tipoSelecionado];
    if (rota) {
        window.location.href = rota;
    } else {
        console.error('Tipo de cadastro não mapeado:', tipoSelecionado);
        alert('Tipo de cadastro não encontrado');
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    inicializarSelecaoTipo();
    
    // Inicializa os ícones Feather
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});