# Pedravale Online

Servidor do Pedravale: serve o jogo e mantém a sala ao vivo onde os jogadores se veem.

## Publicar no Render (grátis)

1. Crie uma conta em https://github.com e um repositório novo (ex.: `pedravale-online`).
2. No repositório, clique em **Add file → Upload files** e arraste TUDO que está nesta pasta
   (`server.js`, `package.json`, `.gitignore`, `LEIA-ME.md` e a pasta `public`). Clique em **Commit changes**.
3. Crie uma conta em https://render.com (pode entrar com o GitHub).
4. No Render: **New → Web Service** → escolha o repositório `pedravale-online`.
5. Preencha:
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**
6. Clique em **Create Web Service** e espere aparecer "Live" (2–4 minutos).
7. O endereço fica no topo da página, tipo `https://pedravale-online.onrender.com`. É esse link que você manda para os amigos.

## Atualizar o jogo

Quando receber um `index.html` novo, substitua o arquivo dentro de `public/` no GitHub
(abra a pasta `public` → **Add file → Upload files**). O Render publica sozinho em alguns minutos.

## Observações

- No plano grátis, o servidor "dorme" depois de 15 minutos sem ninguém. O primeiro acesso depois disso demora uns 50 segundos para abrir.
- Cada jogador continua com o progresso salvo no próprio navegador.
- Nesta etapa, monstros e loot ainda são separados para cada jogador; os jogadores se veem, conversam e veem os ataques uns dos outros.
