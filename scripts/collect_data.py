import requests
import json
import os

token = os.environ['GITHUB_TOKEN']
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}

def get_data():
    # Obtener perfil de usuario
    user = requests.get('https://api.github.com/user', headers=headers).json()
    # Obtener repositorios
    repos = requests.get('https://api.github.com/user/repos?per_page=100&sort=updated', headers=headers).json()
    
    # Cálculos reales
    total_stars = sum(r.get('stargazers_count', 0) for r in repos)
    total_forks = sum(r.get('forks_count', 0) for r in repos)
    languages = set(r.get('language') for r in repos if r.get('language'))
    
    metrics = {
        "seguidores": user.get('followers', 0),
        "total_repos": user.get('public_repos', 0),
        "estrellas_recibidas": total_stars,
        "forks_totales": total_forks,
        "lenguajes_utilizados": list(languages),
        "ultima_actualizacion": user.get('updated_at')
    }
    
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)

if __name__ == "__main__":
    get_data()
