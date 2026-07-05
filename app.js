async function cargarDashboard() {
    try {
        const response = await fetch('./data/metrics.json');
        const metrics = await response.json();
        const container = document.getElementById('dashboard-container');
        
        container.innerHTML = Object.entries(metrics).map(([key, value]) => {
            // Lógica para decidir cómo mostrar el valor
            let displayValue = value;
            
            if (Array.isArray(value)) {
                displayValue = value.join(', ');
            } else if (typeof value === 'object' && value !== null) {
                // Si es un objeto (como el nuevo contador de lenguajes)
                displayValue = Object.entries(value)
                    .map(([lang, count]) => `${lang}: ${count}`)
                    .join('<br>');
            }

            return `
                <div class="stat-card">
                    <h3>${key.replace('_', ' ').toUpperCase()}</h3>
                    <p>${displayValue}</p>
                </div>
            `;
        }).join('');
    } catch (e) {
        document.getElementById('dashboard-container').innerText = "Esperando la primera actualización...";
    }
}
cargarDashboard();
