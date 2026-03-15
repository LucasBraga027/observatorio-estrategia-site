import os
import re

directory = r"c:\Users\lucas\OneDrive\Documentos\Trabalhos I.A\WebSiteObservatório\Website_Fiocruz_Pesquisadores"
exclude_dirs = ['_site', '.git', '.jekyll-cache']
include_extensions = ['.html', '.md']

# Regex to safely replace absolute paths (href="/..." or src="/...")
# We only want to replace paths that start with a single slash, not //
pattern_href = re.compile(r'href="/([^/][^"]*)"')
pattern_src = re.compile(r'src="/([^/][^"]*)"')

for root, dirs, files in os.walk(directory):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if any(file.endswith(ext) for ext in include_extensions):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Replace href="/path" with href="{{ site.baseurl }}/path"
            new_content = pattern_href.sub(r'href="{{ site.baseurl }}/\1"', content)
            new_content = pattern_src.sub(r'src="{{ site.baseurl }}/\1"', new_content)

            # Special case for href="/" to href="{{ site.baseurl }}/"
            new_content = new_content.replace('href="/"', 'href="{{ site.baseurl }}/"')

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated: {file_path}")

# Update _config.yml
config_path = os.path.join(directory, '_config.yml')
with open(config_path, 'r', encoding='utf-8') as f:
    config_content = f.read()

config_content = config_content.replace('url: ""', 'url: "https://lucasbraga027.github.io"')
config_content = config_content.replace('baseurl: ""', 'baseurl: "/observatorio-estrategia-site"')

with open(config_path, 'w', encoding='utf-8') as f:
    f.write(config_content)
print("Updated: _config.yml")
