// Inicializa os ícones
feather.replace();

// Função para verificar conexões
async function verificarConexoes() {
    try {
        const response = await fetch('http://localhost:5128/api/database/connections');
        const data = await response.json();

        const resultadoDiv = document.getElementById('conexoes-resultado');
        let html = '<div class="overflow-x-auto"><table class="min-w-full table-auto">';
        html += '<thead><tr class="bg-gray-100"><th class="px-4 py-2">Usuário</th><th class="px-4 py-2">Conexões</th></tr></thead>';
        html += '<tbody>';

        data.forEach(item => {
            html += `<tr class="border-b">
                <td class="px-4 py-2">${item.user}</td>
                <td class="px-4 py-2">${item.connections}</td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        resultadoDiv.innerHTML = html;
    } catch (error) {
        console.error('Erro ao verificar conexões:', error);
        alert('Erro ao verificar conexões. Verifique o console para mais detalhes.');
    }
}

// Função para limpar conexões excedentes
async function limparConexoes() {
    if (!confirm('Tem certeza que deseja limpar as conexões excedentes?')) {
        return;
    }

    try {
        const response = await fetch('http://localhost:5128/api/database/kill-connections', {
            method: 'POST'
        });

        if (response.ok) {
            alert('Conexões excedentes foram limpas com sucesso!');
            verificarConexoes(); // Atualiza a lista de conexões
        } else {
            throw new Error('Erro ao limpar conexões');
        }
    } catch (error) {
        console.error('Erro ao limpar conexões:', error);
        alert('Erro ao limpar conexões. Verifique o console para mais detalhes.');
    }
}

// Função para verificar chaves estrangeiras
async function verificarChavesEstrangeiras() {
    try {
        const response = await fetch('http://localhost:5128/api/database/foreign-keys');
        const data = await response.json();

        const resultadoDiv = document.getElementById('chaves-resultado');
        let html = '<div class="overflow-x-auto"><table class="min-w-full table-auto">';
        html += '<thead><tr class="bg-gray-100">';
        html += '<th class="px-4 py-2">Tabela</th>';
        html += '<th class="px-4 py-2">Coluna</th>';
        html += '<th class="px-4 py-2">Tabela Referenciada</th>';
        html += '<th class="px-4 py-2">Coluna Referenciada</th>';
        html += '<th class="px-4 py-2">Regra de Atualização</th>';
        html += '<th class="px-4 py-2">Regra de Deleção</th>';
        html += '</tr></thead><tbody>';

        data.forEach(item => {
            html += `<tr class="border-b">
                <td class="px-4 py-2">${item.TABLE_NAME}</td>
                <td class="px-4 py-2">${item.COLUMN_NAME}</td>
                <td class="px-4 py-2">${item.REFERENCED_TABLE_NAME}</td>
                <td class="px-4 py-2">${item.REFERENCED_COLUMN_NAME}</td>
                <td class="px-4 py-2">${item.UPDATE_RULE}</td>
                <td class="px-4 py-2">${item.DELETE_RULE}</td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        resultadoDiv.innerHTML = html;
    } catch (error) {
        console.error('Erro ao verificar chaves estrangeiras:', error);
        alert('Erro ao verificar chaves estrangeiras. Verifique o console para mais detalhes.');
    }
} 