# GitMetrics Dashboard

GitMetrics es un motor de análisis automatizado que visualiza la actividad de desarrollo y el perfil técnico en GitHub. El sistema está diseñado para transformar datos crudos de la API de GitHub en métricas accionables mediante un pipeline de automatización.

## Arquitectura de Datos
El proyecto opera bajo un modelo **Data-Driven Static Site**:

- **Colección (`scripts/collect_data.py`):** Script en Python que consume la API REST de GitHub para extraer estadísticas de repositorios, commits, lenguajes y antigüedad.
- **Persistencia (`data/`):** Almacenamiento en archivos JSON (`metrics.json`, `skills.json`) que actúan como fuente de datos para el frontend.
- **Orquestación:** GitHub Actions (`.github/workflows/daily-metrics.yml`) automatiza el ciclo de extracción y despliegue cada 24 horas.

## Tecnologías Implementadas
- **Frontend:** Vanilla JavaScript con integración de `Chart.js` para visualización.
- **Backend (Serverless):** Python 3.x ejecutado en runners de GitHub.
- **Infraestructura:** Despliegue automatizado mediante GitHub Pages.
- **Estandarización:** Uso de `shields.io` para metadata técnica.

## Flujo de Trabajo
1. **Cron:** El pipeline ejecuta la recolección de datos diariamente a las 00:00 UTC.
2. **Sincronización:** El bot de GitHub actualiza los archivos JSON en el repositorio.
3. **Despliegue:** El sitio estático se reconstruye automáticamente, reflejando las métricas más recientes sin intervención manual.

---
*Visualización técnica orientada a la transparencia del ciclo de vida del desarrollo.*
