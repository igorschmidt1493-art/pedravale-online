// ===================== skill trees: 3 branches per class + evolution branch, assignable hotbar =====================
// node: [code, branch, tier, levelReq, kind('a' active / 'p' passive)]
const BRANCHES={g:['Armas','Defesa','Fúria'],a:['Precisão','Sobrevivência','Natureza'],m:['Gelo','Raio','Arcano'],l:['Sombras','Lâminas','Venenos']};
const TREE={
  g:[['gQ',0,0,1,'a'],['g1',0,1,5,'a'],['gp3',0,2,10,'p'],['gT',0,3,8,'a'],['g4',0,4,18,'a'],
     ['gE',1,0,3,'a'],['g2',1,1,7,'a'],['gp1',1,2,10,'p'],['gp4',1,3,15,'p'],
     ['gR',2,0,5,'a'],['gp2',2,1,6,'p'],['g3',2,2,12,'a'],['gp5',2,3,16,'p']],
  a:[['aQ',0,0,1,'a'],['a1',0,1,5,'a'],['ap1',0,2,9,'p'],['a3',0,3,18,'a'],
     ['aE',1,0,3,'a'],['aR',1,1,5,'a'],['ap2',1,2,9,'p'],['ap4',1,3,15,'p'],
     ['a2',2,0,4,'a'],['ap3',2,1,7,'p'],['aT',2,2,8,'a'],['a4',2,3,12,'a']],
  m:[['mQ',0,0,1,'a'],['m1',0,1,5,'a'],['mp2',0,2,10,'p'],['m5',0,3,18,'a'],
     ['mE',1,0,3,'a'],['mR',1,1,5,'a'],['mp3',1,2,10,'p'],['mp4',1,3,15,'p'],
     ['m2',2,0,3,'a'],['m3',2,1,8,'a'],['mp1',2,2,9,'p'],['m4',2,3,12,'a']],
  l:[['lQ',0,0,1,'a'],['lR',0,1,5,'a'],['l2',0,2,10,'a'],['lp4',0,3,15,'p'],
     ['lE',1,0,3,'a'],['l3',1,1,6,'a'],['lp2',1,2,10,'p'],['lT',1,3,8,'a'],
     ['l1',2,0,3,'a'],['lp3',2,1,7,'p'],['lp1',2,2,10,'p'],['l4',2,3,14,'a']]};
const NEWSK={
  g1:{n:'Corte Duplo',mp:8,cd:3,d:'Dois cortes rápidos à frente (140% cada). O segundo faz sangrar.'},
  g2:{n:'Provocação Férrea',mp:10,cd:12,d:'Provoca todos num raio de 6 e cria um escudo de 15% da vida por 4s.'},
  g3:{n:'Salto Esmagador',mp:18,cd:10,d:'Salta até o cursor e esmaga a área (250%), atordoando por 1s.'},
  g4:{n:'Lâmina Ardente',mp:20,cd:25,d:'Por 8s, seus golpes queimam e causam +40% de dano.'},
  a1:{n:'Tiro Certeiro',mp:9,cd:4,d:'Disparo concentrado que atravessa tudo (220%) com +30% de chance de crítico.'},
  a2:{n:'Flecha Enraizante',mp:10,cd:7,d:'Raízes prendem o alvo por 2,5s (150%).'},
  a3:{n:'Rajada',mp:20,cd:10,d:'Dispara 8 flechas em sequência na direção do cursor (70% cada).'},
  a4:{n:'Falcão',mp:16,cd:9,d:'Seu falcão mergulha em até 4 inimigos perto do cursor (160% cada).'},
  m1:{n:'Nova Gélida',mp:16,cd:8,d:'Anel de gelo ao seu redor (120%) que congela por 1,5s.'},
  m2:{n:'Bola de Fogo',mp:12,cd:3,d:'Projétil que explode em área (200%) e queima.'},
  m3:{n:'Teleporte Arcano',mp:10,cd:6,d:'Teleporta até o cursor (máx. 6 passos).'},
  m4:{n:'Escudo de Mana',mp:15,cd:20,d:'Por 10s, metade do dano recebido sai da mana em vez da vida.'},
  m5:{n:'Nevasca',mp:30,cd:14,d:'Tempestade de neve no cursor por 4s: dano contínuo, lentidão e chance de congelar.'},
  l1:{n:'Lâmina Venenosa',mp:8,cd:10,d:'Os próximos 6 ataques envenenam e causam +30% de dano.'},
  l2:{n:'Bomba de Fumaça',mp:14,cd:14,d:'Nuvem que cega os inimigos (lentos e perdidos) por 4s e te deixa furtivo por 3s.'},
  l3:{n:'Golpe nos Rins',mp:10,cd:7,d:'Golpe no inimigo mais perto do cursor (180%) que atordoa por 1,8s.'},
  l4:{n:'Frasco Tóxico',mp:16,cd:10,d:'Arremessa um frasco: nuvem venenosa por 4s, inimigos dentro recebem +30% de dano.'},
  gp1:{n:'Pele de Ferro',p:1,d:'+6 de defesa e +3% de vida por nível.'},gp2:{n:'Sede de Batalha',p:1,d:'Cada abate cura 1% da vida por nível.'},gp3:{n:'Mestre de Armas',p:1,d:'+4% de dano por nível.'},gp4:{n:'Bastião',p:1,d:'+3% de chance de bloquear golpes por nível.'},gp5:{n:'Fúria Crescente',p:1,d:'A barra de Fúria enche 15% mais rápido por nível.'},
  ap1:{n:'Olho de Águia',p:1,d:'+3% de crítico por nível.'},ap2:{n:'Pés Leves',p:1,d:'+3% de velocidade de movimento por nível.'},ap3:{n:'Flechas Afiadas',p:1,d:'+4% de dano à distância por nível.'},ap4:{n:'Instinto',p:1,d:'+3% de esquiva por nível.'},
  mp1:{n:'Mente Vasta',p:1,d:'+6% de mana máxima por nível.'},mp2:{n:'Frio Penetrante',p:1,d:'+6% de dano contra congelados e lentos por nível.'},mp3:{n:'Sobrecarga',p:1,d:'+4% de dano de habilidades por nível.'},mp4:{n:'Concentração',p:1,d:'−3% de recarga das habilidades por nível.'},
  lp1:{n:'Reflexos',p:1,d:'+3% de esquiva por nível.'},lp2:{n:'Lâminas Afiadas',p:1,d:'+8% de dano crítico por nível.'},lp3:{n:'Toxinas',p:1,d:'+5% de dano contra envenenados e sangrando por nível.'},lp4:{n:'Sombra Viva',p:1,d:'Ataque da furtividade causa +20% por nível.'}};
for(const k in NEWSK)NEWSK[k].lv=1;
// definitions by code (base sets + evolution codes + new tree skills)
const SKDEF={};for(const s of ['g','a','m','l','h'])for(const k of ['Q','E','R','T'])if(SKILLS[s][k])SKDEF[s+k]=Object.assign({},SKILLS[s][k],{code:s+k});
for(const e in EVO)for(const k in SKILLS[e]){const s=SKILLS[e][k];if(k!=='atk'&&s.code&&!SKDEF[s.code])SKDEF[s.code]=Object.assign({},s)}
for(const k in NEWSK)SKDEF[k]=Object.assign({code:k},NEWSK[k]);
const nodeOf=(cls,code)=>(TREE[cls]||[]).find(n=>n[0]===code);
function evoNodes(p){if(!p.evo)return[];const e=SKILLS[p.evo],out=[];for(const k of ['Q','E','R','T'])if(e[k]&&e[k].code&&!nodeOf(p.cls,e[k].code))out.push([e[k].code,3,out.length,EVO_LV,'a']);return out}
function skDefFor(p,code){const d=SKDEF[code];if(!d)return null;if(p.evo){const e=SKILLS[p.evo];for(const k in e)if(e[k].code===code&&k!=='atk')return Object.assign({},d,{n:e[k].n,d:e[k].d||d.d})}return d}
function ensureTree(p){p.sk=p.sk||{};p.bar=p.bar||{};if(!p._treeInit){p._treeInit=1;const old=p.skr||{};for(const k of ['Q','E','R','T']){const c=p.cls+k;if(SKDEF[c]&&p.sk[c]==null&&p.lv>=(SKDEF[c].lv||1))p.sk[c]=old[k]||1}if(old.atk&&!p.sk.atk)p.sk.atk=old.atk;
    if(!Object.keys(p.bar).length)for(const k of ['Q','E','R','T'])if(SKDEF[p.cls+k])p.bar[k]=p.cls+k}
  // base skills auto-learn at their level
  for(const k of ['Q','E','R','T']){const c=p.cls+k;if(SKDEF[c]&&p.sk[c]==null&&p.lv>=(SKDEF[c].lv||1)){p.sk[c]=1;if(!Object.values(p.bar).includes(c)&&!p.bar[k])p.bar[k]=c}}}
let _tsCache=null,_tsKey='';
function treeSet(p){if(!p)return SKILLS.g;if(isHealer(p)&&!p.evo)return SKILLS.h;ensureTree(p);const key=p.cls+'|'+(p.evo||'')+'|'+JSON.stringify(p.bar)+'|'+p.lv;if(_tsCache&&_tsKey===key&&_tsCache._p===p)return _tsCache;
  const base=p.evo&&SKILLS[p.evo]?SKILLS[p.evo]:SKILLS[p.cls],o={_p:p,atk:base.atk};
  for(const k of ['Q','E','R','T','Z','X']){const c=p.bar[k];if(!c||!p.sk[c])continue;const d=skDefFor(p,c);if(d)o[k]=Object.assign({},d,{code:c,lv:1})}
  if(p.evo&&SKILLS[p.evo].G)o.G=SKILLS[p.evo].G;_tsCache=o;_tsKey=key;return o}
const barSig=()=>P?(setCode(P)+JSON.stringify(P.bar||{})+(P.evo||'')):'';
function skPoints(){if(!P)return 0;ensureTree(P);let used=0;for(const c in P.sk){const base=/^[gamlh][QERT]$/.test(c);used+=P.sk[c]-(base?1:0)}const evoK=P.evo?Object.keys(P.sk).filter(c=>evoNodes(P).some(n=>n[0]===c)).length:0;return Math.max(0,P.lv-1-used+evoK)}
function skRank(k){if(!P)return 1;ensureTree(P);if(k==='atk')return P.sk.atk||1;const c=/^[QERTZXG]$/.test(k)?(P.bar&&P.bar[k]):k;return(c&&P.sk[c])||1}
const pr=c=>P&&P.sk&&P.sk[c]||0;
function nodeState(p,n){const [c,br,tier,lv]=n,learned=p.sk[c]||0,list=(TREE[p.cls]||[]).concat(evoNodes(p));const prev=list.find(q=>q[1]===br&&q[2]===tier-1);const pre=!prev||(p.sk[prev[0]]||0)>=1;return{learned,pre,lvOk:p.lv>=lv,canUp:learned<5&&pre&&p.lv>=lv&&(skPoints()>0||(br===3&&!learned))}}
function learnNode(c){const p=P,n=(TREE[p.cls]||[]).concat(evoNodes(p)).find(q=>q[0]===c);if(!n)return;const st=nodeState(p,n);if(!st.canUp){sfx('no');return}
  if(n[1]===3&&!st.learned){p.sk[c]=1}else p.sk[c]=(p.sk[c]||0)+1;sfx('lvl');burstAt(p.x,p.y,0xffd86a,14,60);
  if(n[4]==='a'&&st.learned===0){const free=['Q','E','R','T','Z','X'].find(k=>!p.bar[k]);if(free)p.bar[free]=c}
  afterBar();renderTree()}
function assign(c,k){const p=P;for(const s in p.bar)if(p.bar[s]===c)delete p.bar[s];p.bar[k]=c;p.cds[k]=Math.max(p.cds[k]||0,1);afterBar();renderTree()}
function afterBar(){_tsKey='';P.look=P.look;buildActionBar();touchSet='';uiDirty=1;save()}
// ---------- passive hooks ----------
function treeStat(p,o){if(!p||!p.sk)return o;const r=c=>p.sk[c]||0;o.def+=r('gp1')*6;o.hp*=1+r('gp1')*.03;o.crit+=r('ap1')*3;o.speed*=1+r('ap2')*.03;o.dodge+=r('ap4')*3+r('lp1')*3;o.mp*=1+r('mp1')*.06;return o}
function treeDmg(m,o){let k=1;if(!P.sk)return k;k*=1+pr('gp3')*.04;if(P.cls==='a'&&!o.melee)k*=1+pr('ap3')*.04;if(o.skill)k*=1+pr('mp3')*.04;if((m.frozenT>0||m.slowT>0))k*=1+pr('mp2')*.06;if(m.bleedT>0)k*=1+pr('lp3')*.05;if(P.blazeT>T&&!o.skill)k*=1.4;if(P.venomHits>0&&!o.skill)k*=1.3;return k}
const cdMul=()=>Math.max(.6,1-pr('mp4')*.03);
// ---------- new active skills ----------
function treeSkill(code,k,p,a,ax,ay,ptAt,sk,d){
  switch(code){
    case'g1':{p.atkAnim='atk';p.atkDur=p.atkT=.36;sfx('swing');for(let i=0;i<2;i++)later(.06+i*.16,()=>{const aa=a+(i?.35:-.35);fx.push({type:'slash',x:p.x,y:p.y,a:aa,r:1.7,t:0,life:.18,arc:2,col:'#ff5a3a'});arcTrail('rage',p.x,p.y,aa,1.6,2);for(const m of mobsNear(p.x,p.y,1.9))if(angDiff(Math.atan2(m.y-p.y,m.x-p.x),a)<1.1){hitMob(m,1.4,{skill:1,melee:1,bleed:i?1:0,el:'rage'});elemBurst('rage',m.x,m.y,6)}if(i)sfx('swing')});return true}
    case'g2':{for(const m of mobsNear(p.x,p.y,6)){m.target=p;m.ret=false;addText(m,'!','#ff5a3a')}p.shieldHp=Math.round(D().maxHp*.15);p.shieldT=4;fx.push({type:'ring',x:p.x,y:p.y,r:3,t:0,life:.5,col:'#ff5a3a'});fx.push({type:'roar',x:p.x,y:p.y,t:0,life:.5});sfx('shout');addText(p,'Provocação!','#ff8a6a',1);return true}
    case'g3':{const [tx,ty]=ptAt(6);const dx=tx-p.x,dy=ty-p.y;p.dash={vx:dx/.32,vy:dy/.32,t:.32,dur:.32,leap:1};p.ifr=.4;p.atkAnim='atk';p.atkDur=p.atkT=.4;sfx('dash');later(.34,()=>{shake=Math.max(shake,.4);hitstop=Math.max(hitstop,.05);sfx('boom');fx.push({type:'ring',x:p.x,y:p.y,r:2.2,t:0,life:.4,col:'#ff5a3a'});dust(p.x,p.y,16);elemBurst('rage',p.x,p.y,20);for(const m of mobsNear(p.x,p.y,2.2))hitMob(m,2.5,{skill:1,stun:1,knock:2.5,el:'rage'})});return true}
    case'g4':{p.blazeT=T+8;addText(p,'Lâmina Ardente!','#ff8a2a',1);elemBurst('fire',p.x,p.y,24);sfx('fire');return true}
    case'a1':{p.atkAnim='bow';p.atkDur=p.atkT=.4;later(.2,()=>{p.nextCrit=Math.random()<.3?1:p.nextCrit;shoot('p',p.x,p.y,a,26,'bigarrow',2.2,elemO(aElem(p),{skill:1,pierce:99}));projs[projs.length-1].life=.6;sfx('xbow')});return true}
    case'a2':{p.atkAnim='bow';p.atkDur=p.atkT=.3;later(.1,()=>{shoot('p',p.x,p.y,a,17,'arrow',1.5,{skill:1,el:'nature',root:2.5,onHit:(m)=>{addText(m,'Preso!','#8af05a');elemBurst('nature',m.x,m.y,14)}});sfx('bow')});return true}
    case'a3':{p.atkAnim='bow';for(let i=0;i<8;i++)later(i*.11,()=>{p.atkAnim='bow';p.atkDur=p.atkT=.12;const aa=aimA()+rnd(-.07,.07);shoot('p',p.x,p.y,aa,18,'arrow',.7,elemO(aElem(p),{skill:1}));sfx('bow')});return true}
    case'a4':{const tg=liveMobs().filter(m=>m.def.ai!=='dummy'&&Math.hypot(m.x-ax,m.y-ay)<4).slice(0,4);if(!tg.length){p.mp+=sk.mp;p.cds[k]=0;addText(p,'Sem alvo','#cfc6b8');return true}sfx('howl');tg.forEach((m,i)=>later(.15+i*.18,()=>{if(m.dying)return;fx.push({type:'slash',x:m.x,y:m.y-.3,a:-1.2+i,r:1,t:0,life:.2,arc:2.4,col:'#e8dcc0'});burstAt(m.x,m.y,0xe8dcc0,12,70);hitMob(m,1.6,{skill:1,bleed:.5})}));return true}
    case'm1':{p.atkAnim='cast';p.atkDur=p.atkT=.3;fx.push({type:'ring',x:p.x,y:p.y,r:2.6,t:0,life:.45,col:'#bfe8ff'});for(let i=0;i<18;i++){const aa=i/18*6.283;elemBurst('frost',p.x+Math.cos(aa)*2.2,p.y+Math.sin(aa)*2.2,2)}for(const m of mobsNear(p.x,p.y,2.6))hitMob(m,1.2,{skill:1,freeze:1.5,el:'frost'});sfx('freeze');return true}
    case'm2':{p.atkAnim='cast';p.atkDur=p.atkT=.3;later(.1,()=>{shoot('p',p.x,p.y,a,13,'fire',2,{skill:1,burn:1,el:'fire'});sfx('fire')});return true}
    case'm3':{const [tx,ty]=ptAt(6);if(blockedAt(M,tx,ty,.3)){p.mp+=sk.mp;p.cds[k]=0;addText(p,'Caminho bloqueado','#cfc6b8');return true}burstAt(p.x,p.y,0x8ab8ff,20,60);ghostFx(p,'#8ab8ff');p.x=tx;p.y=ty;unstick(M,p);burstAt(p.x,p.y,0xbfe8ff,20,60);p.ifr=.25;sfx('blink');return true}
    case'm4':{p.manaShieldT=T+10;fx.push({type:'ring',x:p.x,y:p.y,r:1.3,t:0,life:.5,col:'#8ab8ff'});addText(p,'Escudo de Mana','#8ab8ff',1);sfx('cast');return true}
    case'm5':{const [tx,ty]=ptAt(8);p.atkAnim='cast';p.atkDur=p.atkT=.4;clouds.push({x:tx,y:ty,r:2.8,t:4,tick:0,mult:.5,frost:1,m:M.id});fx.push({type:'ring',x:tx,y:ty,r:2.8,t:0,life:.6,col:'#bfe8ff'});sfx('freeze');return true}
    case'l1':{p.venomHits=6;addText(p,'Lâmina Venenosa','#9ae85a',1);elemBurst('poison',p.x,p.y,16);sfx('drink');return true}
    case'l2':{clouds.push({x:p.x,y:p.y,r:2.5,t:4,tick:0,mult:0,smoke:1,m:M.id});p.stealth=3;for(const m of mobsNear(p.x,p.y,2.5)){if(m.target===p&&!m.def.boss){m.target=null;m.ret=true}m.slowT=Math.max(m.slowT||0,4)}burstAt(p.x,p.y,0x5a4a6a,40,50);dust(p.x,p.y,20,'#6a5a7a');addText(p,'Fumaça!','#c08aff',1);sfx('blink');return true}
    case'l3':{const t=nearestTo(ax,ay,4);if(!t){p.mp+=sk.mp;p.cds[k]=0;addText(p,'Sem alvo','#cfc6b8');return true}const ba=Math.atan2(t.y-p.y,t.x-p.x),dd=Math.max(0,dist(p,t)-t.r-.5);p.dash={vx:Math.cos(ba)*dd/.15,vy:Math.sin(ba)*dd/.15,t:.15,dur:.15};p.atkAnim='atk';p.atkDur=p.atkT=.3;later(.16,()=>{if(t.dying)return;hitMob(t,1.8,{skill:1,melee:1,stun:1.8,breakGuard:1,el:'void'});addText(t,'Atordoado!','#c08aff');elemBurst('void',t.x,t.y,14);sfx('block')});return true}
    case'l4':{const [tx,ty]=ptAt(7);p.atkAnim='atk';p.atkDur=p.atkT=.25;later(.25,()=>{clouds.push({x:tx,y:ty,r:2,t:4,tick:0,mult:.3,vuln:1,m:M.id});fx.push({type:'ring',x:tx,y:ty,r:2,t:0,life:.4,col:'#9ae85a'});burstAt(tx,ty,0x9ae85a,24,60);sfx('shatter')});return true}
  }return false}
function treeOnHit(m,o){if(P.venomHits>0&&!o.skill&&!o.quiet&&m.def.ai!=='dummy'){P.venomHits--;m.bleedT=Math.max(m.bleedT||0,4);m.bleedTick=m.bleedTick||.5;m.poison=1;m.burn=0;elemBurst('poison',m.x,m.y,4)}if(P.blazeT>T&&!o.skill&&m.def.ai!=='dummy'){m.bleedT=Math.max(m.bleedT||0,3);m.bleedTick=m.bleedTick||.5;m.burn=1;m.poison=0;elemBurst('fire',m.x,m.y,5)}}
function treeOnKill(){const r=pr('gp2');if(r){const dd=D();P.hp=Math.min(dd.maxHp,P.hp+dd.maxHp*.01*r)}}
function treeTaken(dmg){const p=P;if(pr('gp4')&&Math.random()<pr('gp4')*.03){addText(p,'Bloqueou!','#e8e0d0');sfx('block');return 0}if(p.manaShieldT>T&&p.mp>0){const take=Math.min(p.mp,dmg*.5);p.mp-=take;dmg-=take;if(Math.random()<.3)burstAt(p.x,p.y,0x8ab8ff,4,30)}return dmg}
// ---------- tree window ----------
function treeIcon(code){if(SKICON['#'+code])return SKICON['#'+code];let url;const m=code.match(/^([gamlh])([QERT])$/);
  if(m&&!['gT','lE','lT'].includes(code))url=skillIcon(m[1],m[2]);else if(['gT','lE','lT'].includes(code))url=skillIcon(code[0],code[1]);else if(SKDEF[code]&&code.length>2&&EVO[code.slice(0,3)])url=skillIcon(code.slice(0,3),code.slice(3));
  if(!url){const [cv,x]=mk(24,24);const cls=code[0],col=ELSL[CLS_EL[cls]]||(cls==='m'?'#8ab8ff':'#ffe6b0'),passive=SKDEF[code]&&SKDEF[code].p;const g=x.createLinearGradient(0,0,24,24);g.addColorStop(0,passive?'#2a2a20':'#3a2430');g.addColorStop(1,'#0e0a14');x.fillStyle=g;x.fillRect(0,0,24,24);x.strokeStyle=col;x.fillStyle=col;x.lineWidth=2;
    const h=[...code].reduce((s,c)=>s*31+c.charCodeAt(0),7);if(passive){x.beginPath();x.arc(12,12,7,0,7);x.stroke();x.beginPath();x.moveTo(12,6);x.lineTo(12,18);x.moveTo(6,12);x.lineTo(18,12);x.stroke()}else{const n=3+h%4;x.beginPath();for(let i=0;i<n*2;i++){const a=i/(n*2)*6.283-1.57,r=i%2?4:9;x.lineTo(12+Math.cos(a)*r,12+Math.sin(a)*r)}x.closePath();x.fill();x.fillStyle='#0e0a14';x.beginPath();x.arc(12,12,2,0,7);x.fill()}
    x.globalAlpha=.8;x.lineWidth=1;x.strokeRect(.5,.5,23,23);url=cv.toDataURL()}
  return SKICON['#'+code]=url}
function syncIcons(){if(!P)return;const s=treeSet(P),c=setCode(P);for(const k of ['Q','E','R','T','Z','X'])if(s[k])SKICON[c+k]=treeIcon(s[k].code)}
function renderTree(){const body=$('#treeBody');if(!body||!P)return;ensureTree(P);body.textContent='';const pts=skPoints();
  const head=document.createElement('div');head.className='trhead';head.textContent=`Pontos de habilidade: ${pts}  ·  Ganhe 1 por nível. Aprenda ou melhore até o nível 5. Ativas vão para as teclas Q E R T Z X.`;body.appendChild(head);
  const cols=document.createElement('div');cols.className='trcols';body.appendChild(cols);const br=(BRANCHES[P.cls]||[]).slice();if(P.evo)br.push(EVO[P.evo].n);
  const list=(TREE[P.cls]||[]).concat(evoNodes(P));
  br.forEach((bn,bi)=>{const col=document.createElement('div');col.className='trcol';const h=document.createElement('b');h.textContent=bn;col.appendChild(h);
    for(const n of list.filter(q=>q[1]===bi).sort((a,b)=>a[2]-b[2])){const [c,,tier,lv,kind]=n,def=skDefFor(P,c)||{n:c,d:''},st=nodeState(P,n);
      const card=document.createElement('div');card.className='trnode'+(st.learned?' on':'')+(!st.pre||!st.lvOk?' off':'');
      const img=document.createElement('img');img.alt='';img.src=treeIcon(c);card.appendChild(img);
      const info=document.createElement('div');const t=document.createElement('strong');t.textContent=def.n;info.appendChild(t);const meta=document.createElement('span');meta.className='mut';meta.textContent=` ${kind==='a'?'Ativa':'Passiva'} · Nv ${st.learned}/5${!st.lvOk?' · requer nível '+lv:''}${kind==='a'&&def.mp!=null?' · '+def.mp+' mana · '+def.cd+'s':''}`;info.appendChild(meta);
      const ds=document.createElement('div');ds.className='trd';ds.textContent=def.d||'';info.appendChild(ds);
      if(kind==='a'&&st.learned){const keys=document.createElement('div');keys.className='trkeys';for(const kk of ['Q','E','R','T','Z','X']){const bt=document.createElement('button');bt.type='button';bt.className='btn'+(P.bar[kk]===c?' pri':'');bt.textContent=kk;bt.title='Colocar na tecla '+kk;bt.onclick=()=>assign(c,kk);keys.appendChild(bt)}info.appendChild(keys)}
      card.appendChild(info);
      if(st.learned<5){const up=document.createElement('button');up.type='button';up.className='btn trup';up.textContent=st.learned?'+':'Aprender';up.disabled=!st.canUp;up.title=!st.pre?'Aprenda a habilidade de cima primeiro':!st.lvOk?'Nível insuficiente':pts<=0?'Sem pontos':'Gastar 1 ponto';up.onclick=()=>learnNode(c);card.appendChild(up)}
      col.appendChild(card)}cols.appendChild(col)});
  const pas=document.createElement('p');pas.className='hint';pas.textContent=P.cls==='g'?'Passiva da classe — Fúria: golpes enchem a barra; cheia, a próxima habilidade sai de graça e com +50%.':P.cls==='l'?'Passiva da classe — Combo: +3% de crítico por acerto seguido (até 30%).':P.cls==='a'?'Dica: acertos seguidos aumentam o combo e o dano das habilidades.':'Dica: alterne gelo e raio — raio causa o dobro em congelados.';body.appendChild(pas)}
function toggleTree(){const w=$('#treeWin');if(!w)return;if(w.hidden){renderTree();showWin('#treeWin')}else hideWin('#treeWin')}
// character window: summary + shortcut to the tree
function skillsPanel(){const sk=document.createElement('div');sk.className='skills';const hd=document.createElement('div');hd.className='skhead';hd.textContent=`Pontos de habilidade: ${skPoints()}`;sk.appendChild(hd);const bt=document.createElement('button');bt.type='button';bt.className='btn pri';bt.textContent='Abrir árvore de habilidades (N)';bt.onclick=()=>{hideWin('#charWin');toggleTree()};sk.appendChild(bt);
  const s=treeSet(P);for(const k of ['Q','E','R','T','Z','X','G']){if(!s[k])continue;const r=document.createElement('div');r.className='skrow';const img=document.createElement('img');img.alt='';img.src=k==='G'?SKICON[setCode(P)+'G']||'':treeIcon(s[k].code);const t=document.createElement('div');const b=document.createElement('b');b.textContent=`[${k}] ${s[k].n}`;const m=document.createElement('span');m.className='mut';m.textContent=` Nv ${k==='G'?1:skRank(k)}/5`;t.appendChild(b);t.appendChild(m);r.appendChild(img);r.appendChild(t);sk.appendChild(r)}return sk}
