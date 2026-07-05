import requests
import json
import os

token = os.environ.get('GITHUB_TOKEN')
headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}

def get_issue_count():
    url = 'https://api.github.com/search/issues?q=author:sloty00+is:issue'
    response = requests.get(url, headers=headers)
    return response.json().get('total_count', 0) if response.status_code == 200 else 0

# Nueva función para contar commits por repo
def get_repo_commits(repo_name):
    # Pedimos los commits del repo
    url = f'https://api.github.com/repos/sloty00/{repo_name}/commits?per_page=1'
    # Usamos Link header para obtener el último número de página (total de commits)
    response = requests.get(url, headers=headers)
    if 'Link' in response.headers:
        # El encabezado Link contiene el total de páginas
        links = response.headers['Link']
        if 'rel="last"' in links:
            # Extraemos el número de la última página
            last_page = links.split('page=')[-1].split('>')[0]
            return int(last_page)
    return 0 if response.status_code != 200 else 1

def get_data():
    user_resp = requests.get('https://api.github.com/user', headers=headers)
    user = user_resp.json() if user_resp.status_code == 200 else {}
    
    repos_resp = requests.get('https://api.github.com/user/repos?per_page=100', headers=headers)
    repos = repos_resp.json() if repos_resp.status_code == 200 else []
    
    total_stars = 0
    total_forks = 0
    total_commits = 0
    languages = set()
    
    if isinstance(repos, list):
        for r in repos:
            total_stars += r.get('stargazers_count', 0)
            total_forks += r.get('forks_count', 0)
            total_commits += get_repo_commits(r.get('name'))
            if r.get('language'):
                languages.add(r.get('language'))
    
    metrics = {
        "seguidores": user.get('followers', 0),
        "total_repos": user.get('public_repos', 0),
        "estrellas_recibidas": total_stars,
        "forks_totales": total_forks,
        "issues_creados": get_issue_count(),
        "total_commits": total_commits,
        "lenguajes_utilizados": list(languages),
        "ultima_actualizacion": user.get('updated_at')
    }
    
    os.makedirs('data', exist_ok=True)
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)

if __name__ == "__main__":
    get_data()
