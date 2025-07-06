document.addEventListener('DOMContentLoaded', () => {
    fetchPacientes();
});

function fetchPacientes() {
    fetch('http://localhost:5128/api/pacientes')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar pacientes');
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('tabela-pacientes');
            tbody.innerHTML = '';

            data.forEach(paciente => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td class="border px-4 py-2">${paciente.id}</td>
          <td class="border px-4 py-2">${paciente.rgPac}</td>
          <td class="border px-4 py-2">${paciente.estRgPac}</td>
          <td class="border px-4 py-2">${paciente.statusPac ? 'Ativo' : 'Inativo'}</td>
        `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar pacientes:', error);
            alert('Erro ao carregar pacientes. Verifique o console.');
        });
}
