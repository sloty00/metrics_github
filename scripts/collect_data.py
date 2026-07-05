import requests
import json
import os

token = os.environ.get('GITHUB_TOKEN')
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}

def get_data():

    user_resp = requests.get('https://api.github.com/user', headers=headers)
    if user_resp.status_code != 200:
        print(f"Error al obtener usuario: {user_resp.status_code}")
        return
    user = user_resp.json()

    repos_resp = requests.get('https://api.github.com/user/repos?per_page=100&sort=updated', headers=headers)
    if repos_resp.status_code != 200:
        print(f"Error al obtener repositorios: {repos_resp.status_code}")
        return
    repos = repos_resp.json()
    
    total_stars = 0
    total_forks = 0
    languages = set()
    
    if isinstance(repos, list):
        for r in repos:
            if isinstance(r, dict):
                total_stars += r.get('stargazers_count', 0)
                total_forks += r.get('forks_count', 0)
                lang = r.get('language')
                if lang:
                    languages.add(lang)
    
    metrics = {
        "seguidores": user.get('followers', 0),
        "total_repos": user.get('public_repos', 0),
        "estrellas_recibidas": total_stars,
        "forks_totales": total_forks,
        "lenguajes_utilizados": list(languages),
        "ultima_actualizacion": user.get('updated_at')
    }
    
    os.makedirs('data', exist_ok=True)
    
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)

if __name__ == "__main__":
    get_data()
