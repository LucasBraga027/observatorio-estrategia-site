import requests
import yaml
import time
import random
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# --- CONFIGURAÇÕES ---
API_KEY = os.getenv("SERPAPI_KEY")

if not API_KEY or API_KEY == "SUA_CHAVE_AQUI":
    print("Erro: API_KEY não configurada. Edite o arquivo .env e adicione sua chave do SerpApi.")
    exit(1)

# --- LISTA DE PESQUISADORES E LIMITES ---
# limite: 0 significa "pegar todos". Qualquer outro número pega apenas os X mais recentes.
# DICA: Para não gastar créditos com alguém que você já puxou, basta comentar a linha (adicionar '#' no início).
PESQUISADORES = [
    # Deixando a Alexandra comentada para não buscar os artigos dela e não gastar créditos agora
    # {"nome": "Alexandra Almeida", "id": "EnBKFUAAAAAJ", "limite": 0},
    {"nome": "Francisco Bastos", "id": "dzP4uYEAAAAJ", "limite": 25} # Substitua o limite se quiser pegar todos (0)
]

print("Iniciando extração múltipla via SerpApi...")
print("Atenção: Cada artigo processado consome 1 crédito da API para buscar o link direto.\n")

todas_publicacoes = []

for pesquisador in PESQUISADORES:
    author_id = pesquisador["id"]
    limite_artigos = pesquisador["limite"]
    nome = pesquisador["nome"]

    print(f"\n========================================")
    print(f"Buscando: {nome} (ID: {author_id})")
    print(f"========================================")
    start = 0

    # Otimização: O Google Scholar só aceita num=10, 20 ou 100. Se usarmos 25, a API não retorna os artigos.
    if limite_artigos == 0:
        num_por_pagina = 100
    elif limite_artigos <= 10:
        num_por_pagina = 10
    elif limite_artigos <= 20:
        num_por_pagina = 20
    else:
        num_por_pagina = 100
    artigos_processados = 0

    while True:
        # O parâmetro sort=pubdate garante que os primeiros sejam os mais recentes!
        url_lista = f"https://serpapi.com/search.json?engine=google_scholar_author&author_id={author_id}&api_key={API_KEY}&hl=pt-br&sort=pubdate&start={start}&num={num_por_pagina}"

        try:
            response = requests.get(url_lista)
            response.raise_for_status()
            data = response.json()
            
            artigos = data.get("articles", [])
            if not artigos:
                print(f"Fim da lista para {nome}.")
                break
                
            for artigo in artigos:
                # Trava de segurança para não ultrapassar o limite definido
                if limite_artigos > 0 and artigos_processados >= limite_artigos:
                    break
                    
                titulo_artigo = artigo.get('title', 'Sem Título')
                citation_id = artigo.get('citation_id', '')
                
                print(f"[{artigos_processados + 1}] Processando: {titulo_artigo[:40]}...")
                
                link_direto = artigo.get('link', '#') 
                
                # Busca link direto da revista (Consome 1 crédito)
                if citation_id:
                    url_citacao = f"https://serpapi.com/search.json?engine=google_scholar_author&view_op=view_citation&citation_id={citation_id}&api_key={API_KEY}"
                    try:
                        res_cit = requests.get(url_citacao)
                        if res_cit.status_code == 200:
                            data_cit = res_cit.json()
                            citation = data_cit.get("citation", {})
                            
                            if "link" in citation:
                                link_direto = citation["link"]
                            elif citation.get("resources"):
                                link_direto = citation["resources"][0].get("link", link_direto)
                    except Exception as e:
                        print(f"  -> Aviso: Erro detalhe citação. Mantendo padrão.")
                
                categoria = 'preprints' if 'preprint' in titulo_artigo.lower() else 'artigos'
                
                venue_full = artigo.get('publication', 'Google Scholar')
                venue_parts = venue_full.split(',')
                venue_name = venue_parts[0] if venue_parts else venue_full
                
                pub_dict = {
                    'year': artigo.get('year', 'N/A'),
                    'category': categoria,
                    'title': titulo_artigo,
                    'authors': artigo.get('authors', f'{nome} e colaboradores'),
                    'venue': venue_name,
                    'venue_type': 'Artigo' if categoria == 'artigos' else 'Preprint',
                    'image': f"https://picsum.photos/80/110?random={random.randint(1, 100)}",
                    'link_text': "Ler Artigo",
                    'link_url': link_direto
                }
                todas_publicacoes.append(pub_dict)
                artigos_processados += 1
                
                time.sleep(0.1) 
            
            if limite_artigos > 0 and artigos_processados >= limite_artigos:
                print(f"Limite de {limite_artigos} artigos alcançado para {nome}.")
                break
                
            start += num_por_pagina
            
        except Exception as e:
            print(f"Erro na extração de {nome}: {e}")
            break

# Salva TUDO no mesmo arquivo final
if todas_publicacoes:
    try:
        # Usa o diretório exato onde o script python está localizado
        script_dir = os.path.dirname(os.path.abspath(__file__))
        data_dir = os.path.join(script_dir, '_data')
        os.makedirs(data_dir, exist_ok=True)
        OUTPUT_FILE = os.path.join(data_dir, 'publications.yml')
        
        # Carrega publicações existentes para não apagar o que já tem
        publicacoes_existentes = []
        if os.path.exists(OUTPUT_FILE):
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                dados_existentes = yaml.safe_load(f)
                if dados_existentes:
                    publicacoes_existentes = dados_existentes
                    
        # Para evitar publicações duplicadas, verificamos pelo título e evitamos duplicações
        titulos_existentes = {str(pub.get('title', '')).strip().lower() for pub in publicacoes_existentes}
        
        novas_para_adicionar = []
        for pub in todas_publicacoes:
            titulo = str(pub.get('title', '')).strip().lower()
            if titulo not in titulos_existentes:
                novas_para_adicionar.append(pub)
                titulos_existentes.add(titulo)
                
        todas_juntas = publicacoes_existentes + novas_para_adicionar
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            yaml.dump(todas_juntas, f, allow_unicode=True, sort_keys=False)
            
        print(f"\nSUCESSO! {len(novas_para_adicionar)} novos artigos adicionados.")
        print(f"O arquivo {OUTPUT_FILE} agora tem um total de {len(todas_juntas)} artigos.")
    except Exception as e:
        print(f"\nErro ao salvar o arquivo YAML: {e}")
else:
    print("\nNenhum artigo encontrado nesta extração.")
