async function cargarDashboard() {
    const container = document.getElementById('dashboard-container');
    
    try {
        const [metricsRes, skillsRes] = await Promise.all([
            fetch('./data/metrics.json'),
            fetch('./data/skills.json')
        ]);
        
        const metrics = await metricsRes.json();
        const skills = await skillsRes.json();
        
        // 1. Generar HTML de Habilidades (Cuadrícula limpia)
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

        // 2. Generar HTML de Métricas (Incluyendo todo, incluso proyectos_por_lenguaje)
        const metricsHtml = Object.entries(metrics).map(([key, value]) => {
            if (['data', 'skills_dashboard'].includes(key)) return ''; 
            
            // Si el valor es un objeto (como proyectos_por_lenguaje), lo formateamos bonito
            const displayValue = typeof value === 'object' 
                ? Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' | ') 
                : value;

            return `
                <div class="stat-card-small">
                    <span>${key.replace(/_/g, ' ')}</span>
                    <p>${displayValue}</p>
                </div>
            `;
        }).join('');

        // 3. Inyectar todo
        container.innerHTML = `
            <h3>Habilidades Técnicas</h3>
            <div class="skills-grid">${skillsHtml}</div>
            
            <h3 style="margin-top: 3rem;">Métricas Generales</h3>
            <div class="metrics-grid">${metricsHtml}</div>
        `;

        // 4. Configurar Gráficos
        const labels = skills.data.map(i => i.name);
        const scores = skills.data.map(i => i.score);
        
        // Gráfica de Barras
        new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Nivel (%)', data: scores, backgroundColor: '#36a2eb' }] },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
        });

        // Gráfica de Pastel (Dominancia)
        new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: { labels, datasets: [{ data: scores, backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Nueva Gráfica de Dona (Proyectos por Lenguaje)
        const langData = metrics.proyectos_por_lenguaje;
        new Chart(document.getElementById('langChart'), {
            type: 'doughnut',
            data: { 
                labels: Object.keys(langData), 
                datasets: [{ 
                    data: Object.values(langData), 
                    backgroundColor: ['#f1e05a', '#f34b7d', '#b07219', '#e34c26', '#4f5d95', '#3572A5', '#3178c6', '#c6538c'] 
                }] 
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
        
    } catch (e) {
        container.innerHTML = `<p>Error al cargar los datos: ${e.message}</p>`;
    }
}

cargarDashboard();
