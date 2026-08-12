async function cargarDashboard() {
    const container = document.getElementById('dashboard-container');
    
    try {
        // 1. Fetch con validación explícita de respuesta HTTP 200
        const [metricsRes, skillsRes] = await Promise.all([
            fetch('./data/metrics.json').catch(() => fetch('./metrics.json')),
            fetch('./data/skills.json').catch(() => fetch('./skills.json'))
        ]);

        if (!metricsRes.ok) throw new Error(`No se pudo cargar metrics.json (Status: ${metricsRes.status})`);
        if (!skillsRes.ok) throw new Error(`No se pudo cargar skills.json (Status: ${skillsRes.status})`);
        
        const metrics = await metricsRes.json();
        const skills = await skillsRes.json();
        
        if (!skills || !Array.isArray(skills.data)) {
            throw new Error("El formato de skills.json no contiene un array 'data' válido.");
        }

        // 2. Generar HTML de Habilidades
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

        // 3. Generar HTML de Métricas
        const metricsHtml = Object.entries(metrics).map(([key, value]) => {
            if (['data', 'skills_dashboard'].includes(key)) return ''; 
            
            const displayValue = typeof value === 'object' && value !== null
                ? Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' | ') 
                : value;

            return `
                <div class="stat-card-small">
                    <span>${key.replace(/_/g, ' ')}</span>
                    <p>${displayValue}</p>
                </div>
            `;
        }).join('');

        // Inyección en el DOM
        if (container) {
            container.innerHTML = `
                <h3>Habilidades Técnicas</h3>
                <div class="skills-grid">${skillsHtml}</div>
                
                <h3 style="margin-top: 3rem;">Métricas Generales</h3>
                <div class="metrics-grid">${metricsHtml}</div>
            `;
        }

        // 4. Renderizado seguro de Gráficos (solo si los canvas existen)
        const labels = skills.data.map(i => i.name);
        const scores = skills.data.map(i => i.score);
        
        const barCanvas = document.getElementById('barChart');
        if (barCanvas) {
            new Chart(barCanvas, {
                type: 'bar',
                data: { labels, datasets: [{ label: 'Nivel (%)', data: scores, backgroundColor: '#36a2eb' }] },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
            });
        }

        const pieCanvas = document.getElementById('pieChart');
        if (pieCanvas) {
            new Chart(pieCanvas, {
                type: 'pie',
                data: { labels, datasets: [{ data: scores, backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'] }] },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        const langCanvas = document.getElementById('langChart');
        const langData = metrics.proyectos_por_lenguaje;
        if (langCanvas && langData && typeof langData === 'object') {
            new Chart(langCanvas, {
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
        }
        
    } catch (e) {
        console.error('Error detectado en cargarDashboard:', e);
        if (container) {
            container.innerHTML = `<p style="color: #dc3545; font-weight: bold;">Error al cargar los datos: ${e.message}</p>`;
        }
    }
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', cargarDashboard);
