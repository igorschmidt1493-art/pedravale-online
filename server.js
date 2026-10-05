// Pedravale — servidor online (etapa 2a: sala ao vivo)
// Serve o jogo em "/" e mantém uma sala em tempo real em "/ws":
// cada jogador publica o próprio estado (posição, visual, chat) e o servidor repassa para todos.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = 64;          // limite de jogadores ao mesmo tempo
const MAX_PRESENCE = 4096;       // bytes por estado de jogador
const MAX_MSGS_PER_SEC = 40;     // proteção contra spam

const INDEX = path.join(__dirname, 'public', 'index.html');

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (url === '/health') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
  if (url === '/' || url === '/index.html') {
    fs.readFile(INDEX, (err, buf) => {
      if (err) { res.writeHead(500); return res.end('Jogo não encontrado'); }
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' });
      res.end(buf);
    });
    return;
  }
  res.writeHead(404, { 'content-type': 'text/plain' }); res.end('404');
});

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 8192 });
const clients = new Map(); // id -> { ws, presence, budget, last }
let nextId = 1;

function send(ws, obj) { if (ws.readyState === 1) ws.send(JSON.stringify(obj)); }
function broadcast(obj, exceptId) {
  const s = JSON.stringify(obj);
  for (const [id, c] of clients) if (id !== exceptId && c.ws.readyState === 1) c.ws.send(s);
}

wss.on('connection', (ws) => {
  if (clients.size >= MAX_PLAYERS) { send(ws, { t: 'full' }); return ws.close(); }
  const id = 'p' + (nextId++).toString(36) + Math.random().toString(36).slice(2, 6);
  const c = { ws, presence: {}, budget: MAX_MSGS_PER_SEC, last: Date.now(), alive: true };
  clients.set(id, c);
  // apresenta quem já está na sala
  const others = [];
  for (const [oid, o] of clients) if (oid !== id) others.push({ peer: oid, presence: o.presence });
  send(ws, { t: 'hello', you: id, peers: others });

  ws.on('pong', () => { c.alive = true; });
  ws.on('message', (raw) => {
    const now = Date.now();
    c.budget = Math.min(MAX_MSGS_PER_SEC, c.budget + (now - c.last) / 1000 * MAX_MSGS_PER_SEC); c.last = now;
    if (c.budget < 1) return; c.budget -= 1;
    if (raw.length > MAX_PRESENCE) return;
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (!m || m.t !== 'p' || typeof m.presence !== 'object' || m.presence === null || Array.isArray(m.presence)) return;
    c.presence = m.presence;
    broadcast({ t: 'up', peer: id, presence: c.presence }, id);
  });
  ws.on('close', () => { clients.delete(id); broadcast({ t: 'left', peer: id }); });
  ws.on('error', () => {});
});

// derruba conexões mortas
setInterval(() => {
  for (const [id, c] of clients) {
    if (!c.alive) { c.ws.terminate(); clients.delete(id); broadcast({ t: 'left', peer: id }); continue; }
    c.alive = false; try { c.ws.ping(); } catch {}
  }
}, 20000);

server.listen(PORT, () => console.log(`Pedravale online na porta ${PORT}`));
