async function cargarDashboard() {
    const container = document.getElementById('dashboard-container');
    
    try {
        const [metricsRes, skillsRes] = await Promise.all([
            fetch('./data/metrics.json'),
            fetch('./data/skills.json')
        ]);
        
        const metrics = await metricsRes.json();
        const skills = await skillsRes.json();
        
        const skillsHtml = skills.data.map(item => {
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

        const metricsHtml = Object.entries(metrics).map(([key, value]) => {
            if (['proyectos_por_lenguaje', 'data', 'skills_dashboard'].includes(key)) return '';
            return `
                <div class="stat-card-small">
                    <span>${key.replace(/_/g, ' ')}</span>
                    <p>${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</p>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <h3>Habilidades Técnicas</h3>
            <div class="skills-grid">${skillsHtml}</div>
            
            <h3 style="margin-top: 3rem;">Métricas Generales</h3>
            <div class="metrics-grid">${metricsHtml}</div>
        `;

        const labels = skills.data.map(i => i.name);
        const scores = skills.data.map(i => i.score);
        
        new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Nivel (%)', data: scores, backgroundColor: '#36a2eb' }] },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
        });

        new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: { labels, datasets: [{ data: scores, backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
        
    } catch (e) {
        container.innerHTML = `<p>Error al cargar los datos: ${e.message}</p>`;
    }
}

cargarDashboard();
