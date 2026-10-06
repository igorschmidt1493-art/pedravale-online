# Código-fonte do Pedravale

O jogo é montado a partir dos módulos `0*.js` (concatenados em ordem alfabética) + `shell.html`.

    cd src
    python3 build.py final  ../pedravale.html            # versão de arquivo único
    python3 build.py server ../public/index.html         # versão do servidor online (WebSocket)
    python3 build.py test   t.html                       # versão com window.__dbg para testes

Sprites definitivos ficam em `assets/sprites/` (recortados com `recortar_spritesheet.py`) e entram no jogo via `048-sprites-data.js`.
