import requests
import json
import os

token = os.environ['GITHUB_TOKEN']
headers = {'Authorization': f'token {token}'}

def get_data():
    # Consulta tu perfil y repos
    user = requests.get('https://api.github.com/user', headers=headers).json()
    repos = requests.get('https://api.github.com/user/repos?per_page=100', headers=headers).json()
    
    # Lógica de cálculo (Tu Dashboard Personalizado)
    metrics = {
        "resiliencia": {"valor": 12, "etiqueta": "Servicios Desacoplados"},
        "commits_totales": sum(r['size'] for r in repos), # Ejemplo de métrica propia
        "repos_activos": len([r for r in repos if not r['archived']]),
        "followers": user['followers'],
        "fecha": "2026-07-04"
    }
    
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)

if __name__ == "__main__":
    get_data()
