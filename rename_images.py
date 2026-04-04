import os
import shutil

dir_path = r'c:\Documentos\Trabalhos I.A\WebSiteObservatório\Website_Fiocruz_Pesquisadores\images'
files = os.listdir(dir_path)

mapping = {
    'COLORIDA': 'logo-colorida.png',
    'BRANCA': 'logo-branca.png',
    'SÍMBOLO COLORIDO': 'logo-simbolo-colorido.png',
    'SÍMBOLO BRANCO': 'logo-simbolo-branco.png',
    'SÍMBOLO PRETO (1)': 'logo-simbolo-preto-backup.png',
    'SÍMBOLO PRETO': 'logo-simbolo-preto.png',
}

# Second try for normalized characters if first fails
mapping_fallback = {
    'SIMBOLO COLORIDO': 'logo-simbolo-colorido.png',
    'SIMBOLO BRANCO': 'logo-simbolo-branco.png',
    'SIMBOLO PRETO': 'logo-simbolo-preto.png',
}

for f in files:
    full_path = os.path.join(dir_path, f)
    renamed = False
    for key, new_name in mapping.items():
        if key in f:
            new_path = os.path.join(dir_path, new_name)
            print(f"Renaming {f} to {new_name}")
            shutil.move(full_path, new_path)
            renamed = True
            break
    if not renamed:
        for key, new_name in mapping_fallback.items():
            if key in f.upper().replace('Í', 'I'):
                new_path = os.path.join(dir_path, new_name)
                print(f"Fallback Renaming {f} to {new_name}")
                shutil.move(full_path, new_path)
                break
