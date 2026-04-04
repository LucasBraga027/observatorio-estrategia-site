import yaml
import re

with open('C:\\Documentos\\Trabalhos I.A\\WebSiteObservatório\\Website_Fiocruz_Pesquisadores\\_data\\team.yml', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'image: "https://ui-avatars.com/api/\?name=Thiago\+Almeida[^"]*"', 'image: "/images/thiago-almeida.jpeg"', text)
text = re.sub(r'image: "https://ui-avatars.com/api/\?name=Cristina\+Dusi[^"]*"', 'image: "/images/cristina-dusi.jpeg"', text)
text = re.sub(r'image: "https://ui-avatars.com/api/\?name=João\+Paulo[^"]*"', 'image: "/images/joao-paulo-nascimento.jpeg"', text)
text = re.sub(r'image: "https://ui-avatars.com/api/\?name=Camila\+Braga[^"]*"', 'image: "/images/camila-braga.jpeg"', text)
text = re.sub(r'image: "https://ui-avatars.com/api/\?name=Tatiana\+Dornelas[^"]*"', 'image: "/images/tatiana-dornelas.jpeg"', text)
text = re.sub(r'image: "https://ui-avatars.com/api/\?name=Lívia\+Almada[^"]*"', 'image: "/images/livia-almada.jpeg"', text)
text = re.sub(r'image: "https://ui-avatars.com/api/\?name=Livia\+Almada[^"]*"', 'image: "/images/livia-almada.jpeg"', text)
text = re.sub(r'image: "https://ui-avatars.com/api/\?name=Mariana\+Paes[^"]*"', 'image: "/images/mariana-paes.jpeg"', text)
text = re.sub(r'image: "https://ui-avatars.com/api/\?name=Mariana\+Paes\+Fonseca[^"]*"', 'image: "/images/mariana-paes.jpeg"', text)

with open('C:\\Documentos\\Trabalhos I.A\\WebSiteObservatório\\Website_Fiocruz_Pesquisadores\\_data\\team.yml', 'w', encoding='utf-8') as f:
    f.write(text)
