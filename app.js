async function cargarDashboard() {
    try {
        const response = await fetch('./data/metrics.json');
        const metrics = await response.json();
        const container = document.getElementById('dashboard-container');
        
        container.innerHTML = Object.entries(metrics).map(([key, value]) => {
            let displayValue = value;
            
            // Si es el objeto de lenguajes, calculamos porcentajes
            if (key === 'proyectos_por_lenguaje' && typeof value === 'object' && value !== null) {
                const totalProyectos = Object.values(value).reduce((a, b) => a + b, 0);
                displayValue = Object.entries(value)
                    .map(([lang, count]) => {
                        const porcentaje = ((count / totalProyectos) * 100).toFixed(1);
                        return `${lang}: ${count} (${porcentaje}%)`;
                    })
                    .join('<br>');
            } else if (Array.isArray(value)) {
                displayValue = value.join(', ');
            } else if (typeof value === 'object' && value !== null) {
                displayValue = Object.entries(value)
                    .map(([k, v]) => `${k}: ${v}`)
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
