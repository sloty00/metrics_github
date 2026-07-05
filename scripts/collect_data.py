import requests
import json
import os

token = os.environ['GITHUB_TOKEN']
headers = {'Authorization': f'token {token}'}

def get_data():
    user = requests.get('https://api.github.com/user', headers=headers).json()
    repos = requests.get('https://api.github.com/user/repos?per_page=100', headers=headers).json()
    
    # Blindaje: verificamos que 'repos' sea una lista antes de iterar
    if isinstance(repos, list):
        total_size = sum(r.get('size', 0) for r in repos if isinstance(r, dict))
        num_repos = len([r for r in repos if isinstance(r, dict) and not r.get('archived', False)])
    else:
        # Si la API falla o devuelve otra cosa, ponemos valores por defecto
        print(f"Error detectado en la API: {repos}")
        total_size = 0
        num_repos = 0
    
    metrics = {
        "resiliencia": {"valor": 12, "etiqueta": "Servicios Desacoplados"},
        "commits_totales": total_size,
        "repos_activos": num_repos,
        "followers": user.get('followers', 0),
        "fecha": "2026-07-04"
    }
    
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)

if __name__ == "__main__":
    get_data()
