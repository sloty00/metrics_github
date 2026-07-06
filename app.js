async function cargarDashboard() {
    const container = document.getElementById('dashboard-container');
    
    try {
        const [metricsRes, skillsRes] = await Promise.all([
            fetch('./data/metrics.json'),
            fetch('./data/skills.json')
        ]);
        
        const metrics = await metricsRes.json();
        const skills = await skillsRes.json();
        
        let htmlContent = `<h2>Habilidades Técnicas</h2>`;
        htmlContent += skills.data.map(item => {
            const barColor = item.type === 'language' ? '#007bff' : '#28a745';
            return `
                <div class="stat-card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <strong>${item.name}</strong>
                        <span>${item.score}%</span>
                    </div>
                    <div style="background: #e0e0e0; border-radius: 4px; height: 12px; width: 100%;">
                        <div style="background: ${barColor}; height: 100%; width: ${item.score}%; border-radius: 4px;"></div>
                    </div>
                </div>
            `;
        }).join('');

        htmlContent += `<h2 style="margin-top: 2rem;">Métricas Generales</h2>`;
        htmlContent += Object.entries(metrics).map(([key, value]) => {
            if (key === 'proyectos_por_lenguaje' || key === 'data' || key === 'skills_dashboard') return ''; // Saltamos procesados
            
            return `
                <div class="stat-card">
                    <h3>${key.replace(/_/g, ' ').toUpperCase()}</h3>
                    <p>${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</p>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="stats-grid">${htmlContent}</div>`;
        
    } catch (e) {
        container.innerHTML = `<p>Error al cargar los datos: ${e.message}</p>`;
    }
}

cargarDashboard();
