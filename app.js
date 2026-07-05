async function cargarDashboard() {
    try {
        const response = await fetch('./data/metrics.json');
        const metrics = await response.json();
        const container = document.getElementById('dashboard-container');
        
        container.innerHTML = Object.entries(metrics).map(([key, value]) => `
            <div class="stat-card">
                <h3>${key.replace('_', ' ').toUpperCase()}</h3>
                <p>${Array.isArray(value) ? value.join(', ') : value}</p>
            </div>
        `).join('');
    } catch (e) {
        document.getElementById('dashboard-container').innerText = "Esperando la primera actualización...";
    }
}
cargarDashboard();
