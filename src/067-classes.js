// ===================== class identity, combo, skill ranks, revised skills and evolutions =====================
Object.assign(ELC,{rage:['#ffd0b0','#ff4a2a','#a8141a'],void:['#f4e0ff','#c08aff','#6a2aba'],nature:['#eaffb8','#7ae84a','#2a8a3a'],song:['#fff6c0','#ffd86a','#5ae0c8'],holy:['#ffffff','#fff0a0','#e8c050']});
Object.assign(ELSL,{rage:'#ff5a3a',void:'#c08aff',nature:'#8af05a',song:'#ffe08a',holy:'#fff0a0'});
const CLS_EL={g:'rage',l:'void',a:'nature'};
const EVO_LV=20;
const EVO={
  cav:{cls:'g',n:'Cavaleiro',el:'rage',aura:'#ffc84a',look:{cape:0xe8e0d0,trim:0xe8c050},pas:'+15% de defesa e 12% de chance de bloquear qualquer golpe.',d:'Tanque que protege o grupo: escudo, provocação e muralha sagrada.'},
  ber:{cls:'g',n:'Berserker',el:'rage',aura:'#ff2a1a',look:{cape:0x5a0a0a,trim:0xc8201a},pas:'Até +40% de dano quanto menos vida você tiver. Golpes roubam 4% do dano como vida.',d:'Dano bruto: sangramento, roubo de vida e fúria rubra.'},
  cac:{cls:'a',n:'Caçador',el:'nature',aura:'#6ae04a',look:{cape:0x2a5a2a,trim:0x9ae85a},pas:'A cada 5 disparos, 2 flechas extras saem juntas.',d:'Mestre das flechas: perfurantes, explosivas, elementais e a Flecha do Dragão.'},
  bar:{cls:'a',n:'Bardo',el:'song',aura:'#ffd86a',look:{cape:0x2a7a8a,trim:0xffd86a},pas:'Com uma canção ativa, as flechas causam +15% de dano.',d:'Arco e alaúde: canções para o grupo, confusão e o Grande Concerto.'},
  arq:{cls:'m',n:'Arquimago',el:'storm',aura:'#7ab8ff',look:{cape:0x1a1a5a,trim:0x9ad8ff},pas:'+20% de dano de habilidades. Congelados recebem +50% de dano de fogo.',d:'Fogo, gelo e raio combinados em áreas enormes.'},
  sac:{cls:'m',n:'Sacerdote',el:'holy',aura:'#fff0a0',look:{cape:0xf0ece0,trim:0xe8c050},pas:'Curas 20% mais fortes e que também curam o grupo por perto.',d:'Luz sagrada: cura em grupo, bênçãos e a Graça Divina.'},
  som:{cls:'l',n:'Sombra',el:'void',aura:'#b06aff',look:{cape:0x1a0a2a,trim:0xb06aff},pas:'+50% de dano crítico.',d:'Clones e teleportes: ataca de todos os lados.'},
  env:{cls:'l',n:'Envenenador',el:'void',aura:'#9a5ae8',look:{cape:0x1a2a1a,trim:0x9ae85a},pas:'Golpes acumulam veneno (até 5 cargas): cada carga dá +6% de dano no alvo.',d:'Venenos que se acumulam, nuvens tóxicas e a Praga.'}};
// ---------- skill data: revised base skills + evolution sets ----------
Object.assign(SKILLS.g.Q,{n:'Golpe Giratório',mp:14,cd:7,d:'Gira por até 2,4s (segure a tecla) atingindo e puxando todos ao redor (55% por giro).'});
Object.assign(SKILLS.g.E,{d:'Avança em linha, atordoa quem atingir (120%). Quem for jogado contra a parede fica atordoado o dobro.'});
Object.assign(SKILLS.g.R,{d:'Por 8s: +25% de dano e +20 de defesa. Inimigos próximos ficam com MEDO por 1,5s.'});
Object.assign(SKILLS.g.T,{n:'Fenda Sísmica',d:'Abre uma fissura em linha no chão (300%) que lança os inimigos para o alto.'});
Object.assign(SKILLS.l.E,{n:'Leque de Adagas',mp:12,cd:5,d:'Arremessa 5 adagas em leque (80% cada) que atravessam um inimigo e causam sangramento.'});
Object.assign(SKILLS.l.T,{n:'Dança das Lâminas',mp:26,cd:12,d:'Salta entre até 5 inimigos golpeando cada um (220%). Executa quem tiver menos de 30% de vida.'});
const mkSet=(base,over)=>{const o={};for(const k in base)o[k]=Object.assign({},base[k],{code:k==='atk'?null:(base===SKILLS.h?'h':base===SKILLS.g?'g':base===SKILLS.a?'a':base===SKILLS.m?'m':'l')+k});for(const k in over)o[k]=Object.assign({},o[k]||{},over[k]);return o};
SKILLS.cav=mkSet(SKILLS.g,{Q:{n:'Giro do Bastião',d:'Giro do guerreiro (+25%) que também cria um escudo de 12% da vida máxima por 5s.'},E:{n:'Investida Sagrada',d:'Investida (+25%) com atordoamento mais longo.'},R:{n:'Grito do Bastião',d:'Grito de Guerra (+25%) que também dá +25 de defesa e provoca os inimigos próximos.'},T:{n:'Fenda Sísmica',d:'Fissura em linha (+25%) que lança os inimigos.'},G:{n:'Muralha Sagrada',mp:35,cd:40,lv:EVO_LV,code:'cavG',d:'Por 6s: dano recebido −60%, provoca todos ao redor e devolve 30% do dano.'}});
SKILLS.ber=mkSet(SKILLS.g,{Q:{n:'Giro Sangrento',d:'Giro (+25%) que faz sangrar e rouba vida.'},E:{n:'Investida Brutal'},R:{n:'Sede de Sangue',d:'Grito de Guerra (+25%) e roubo de vida de 15% por 8s.'},T:{n:'Fenda Rubra'},G:{n:'Fúria Rubra',mp:30,cd:40,lv:EVO_LV,code:'berG',d:'Por 8s: +50% de dano e velocidade de ataque, cada golpe cura 3% e você não pode ser atordoado.'}});
SKILLS.cac=mkSet(SKILLS.a,{atk:{n:'Disparo Verde',d:'Flecha com energia da floresta.'},Q:{n:'Flecha Perfurante',mp:12,cd:4,code:'cacQ',d:'Flecha pesada que atravessa todos em linha (260%) e empurra.'},E:{n:'Flecha Explosiva',mp:14,cd:6,code:'cacE',d:'Explode na área (200%) e deixa o chão em chamas por 3s.'},R:{n:'Aljava Elemental',mp:0,cd:1,code:'cacR',d:'Troca suas flechas entre fogo, gelo e veneno.'},T:{n:'Chuva de Flechas',d:'Área no cursor: rajadas verdes (+25%).'},G:{n:'Flecha do Dragão',mp:40,cd:30,lv:EVO_LV,code:'cacG',d:'Uma flecha gigante cruza a tela atingindo tudo no caminho (600%).'}});
SKILLS.bar=mkSet(SKILLS.a,{atk:{n:'Acorde',d:'Flecha encantada com música.'},Q:{n:'Nota Cortante',mp:10,cd:3,code:'barQ',d:'Onda sonora que atravessa 3 inimigos (160%) e ricocheteia.'},E:{n:'Canção',mp:10,cd:3,code:'barE',d:'Alterna a canção (20s, vale para o grupo): Coragem +20% de dano · Vida 1,5% de vida por segundo · Ritmo +20% de ataque e velocidade.'},R:{n:'Dissonância',mp:16,cd:10,code:'barR',d:'Os inimigos na área ficam confusos por 4s e às vezes se atacam.'},T:{n:'Chuva de Flechas'},G:{n:'Grande Concerto',mp:40,cd:40,lv:EVO_LV,code:'barG',d:'Inimigos ao redor dormem por 5s e o grupo ganha +30% de dano e todas as canções por 10s.'}});
SKILLS.arq=mkSet(SKILLS.m,{Q:{n:'Lança de Gelo Maior'},E:{n:'Raio em Cadeia'},R:{n:'Tempestade Maior'},T:{n:'Meteoro',mp:30,cd:9,lv:8,code:'arqT',d:'Um meteoro cai no cursor (350%) e deixa o chão em chamas.'},G:{n:'Cataclismo',mp:50,cd:45,lv:EVO_LV,code:'arqG',d:'Congela a área, faz chover meteoros e raios por 3s.'}});
SKILLS.sac=mkSet(SKILLS.h,{Q:{n:'Luz Purificadora'},E:{n:'Cura Maior',d:'Recupera 42% da vida e cura o grupo por perto.'},R:{n:'Bênção'},T:{n:'Santuário'},G:{n:'Graça Divina',mp:45,cd:60,lv:EVO_LV,code:'sacG',d:'Cura total, remove efeitos e, se você cair nos próximos 20s, volta com metade da vida. O grupo por perto recupera 40%.'}});
SKILLS.som=mkSet(SKILLS.l,{Q:{n:'Passo Sombrio',d:'Teleporte às costas (+25%) que deixa um clone golpeando por 3s.'},E:{n:'Leque de Adagas'},R:{n:'Furtividade'},T:{n:'Dança das Sombras',d:'Dança das Lâminas (+25%) que atinge até 7 inimigos.'},G:{n:'Legião Sombria',mp:40,cd:40,lv:EVO_LV,code:'somG',d:'Três clones lutam ao seu lado por 8s.'}});
SKILLS.env=mkSet(SKILLS.l,{Q:{n:'Passo Tóxico',d:'Teleporte às costas (+25%) que deixa uma nuvem de veneno.'},E:{n:'Leque Envenenado',d:'Adagas (+25%) que envenenam.'},R:{n:'Furtividade'},T:{n:'Dança Venenosa'},G:{n:'Praga',mp:40,cd:40,lv:EVO_LV,code:'envG',d:'Nuvem tóxica por 6s: envenena e faz os inimigos dentro receberem +30% de dano.'}});
// ---------- helpers ----------
const clsEl=p=>{const e=p&&p.evo&&EVO[p.evo];return e?e.el:p?CLS_EL[p.cls]||null:null};
const liveMobs=()=>mobs.filter(m=>m.m===M.id&&!m.dying&&!m.dead);
const mobsNear=(x,y,r)=>liveMobs().filter(m=>Math.hypot(m.x-x,m.y-y)<r+m.r);
function skCode(p,k){const s=skillSet(p)[k];return s&&s.code||setCode(p)+k}
function skRank(k){return(P&&P.skr&&P.skr[k])||1}
function skPoints(){let used=0;for(const k in P.skr||{})used+=P.skr[k]-1;return Math.max(0,P.lv-1-used)}
function rankUp(k){if(skPoints()<=0||skRank(k)>=5)return;P.skr=P.skr||{};P.skr[k]=skRank(k)+1;sfx('lvl');toast('Habilidade melhorada',`${(skillSet(P)[k]||{}).n} · nível ${P.skr[k]}`);uiDirty=1;save()}
// ---------- combo ----------
const CB={n:0,t:0,last:0};
function comboHit(skill){if(T-CB.last<.12)return;CB.last=T;CB.n=Math.min(99,CB.n+1);CB.t=P.cls==='l'?3:2.8;
  if(P.cls==='g'&&!P.furyReady){P.fury=Math.min(100,(P.fury||0)+(skill?9:6)*(1+pr('gp5')*.15));if(P.fury>=100){P.furyReady=1;addText(P,'FÚRIA!','#ff5a3a',1);sfx('shout');burstAt(P.x,P.y,0xff4a2a,20,80)}}
  if(CB.n%10===0){addText(P,`COMBO x${CB.n}!`,ELSL[clsEl(P)]||'#ffd23a',1);sfx('chime');elemBurst(clsEl(P),P.x,P.y,14)}const s=PS();s.combo=Math.max(s.combo||0,CB.n)}
function comboMult(o){const k=o.skill?(P.lastSk&&T-P.lastSk.t<3?P.lastSk.k:'Q'):'atk',r=skRank(k);
  const per=o.skill?.012+.006*(r-1):.008+.004*(r-1),cap=o.skill?.6+.1*(r-1):.4;let m=(1+(r-1)*.12)*(1+Math.min(cap,CB.n*per));
  if(o.skill&&P.evo)m*=1.25;if(o.skill&&P.furyAmp>T)m*=1.5;return m}
const comboCrit=()=>P.cls==='l'?Math.min(30,CB.n*3):0;
function skillUsed(k){if(P.lastSk&&T-P.lastSk.t<2.5&&P.lastSk.k!==k){CB.n=Math.min(99,CB.n+2);CB.t=Math.max(CB.t,2.8);addText(P,'Encadeado!',ELSL[clsEl(P)]||'#ffd23a')}P.lastSk={k,t:T};
  if(P.furyReady){P.furyReady=0;P.fury=0;P.furyAmp=T+2.2;const sk=skillSet(P)[k];P.mp+=sk.mp||0;fx.push({type:'ring',x:P.x,y:P.y,r:2,t:0,life:.45,col:'#ff4a2a'})}}
// ---------- stats hooks ----------
function evoStat(p){const o={atk:1,aspd:1,def:0,speed:1};if(!p)return o;const now=typeof T==='number'?T:0;
  if(p.evo==='ber'){const d0=p._mhp||1;o.atk*=1+.4*Math.max(0,1-(p.hp||d0)/d0);if(p.redT>0){o.atk*=1.5;o.aspd*=1.5}}
  if(p.evo==='arq')o.atk*=1;const sg=p.songT>0?p.song:p.songR&&p.songR.t>0?p.songR.id:null,con=p.concertT>0||(p.songR&&p.songR.t>0&&p.songR.id==='concerto');
  if(sg==='coragem'||con)o.atk*=1.2;if(sg==='ritmo'||con){o.aspd*=1.2;o.speed*=1.15}if(con)o.atk*=1.3;if(p.wallT>0)o.def+=40;return o}
function evoDmg(m,o){let k=treeDmg(m,o);if(P.evo==='arq'&&o.skill)k*=1.2;if(P.evo==='arq'&&m.frozenT>0&&(o.burn||o.el==='fire'))k*=1.5;if(P.evo==='bar'&&(P.songT>0||P.concertT>0)&&!o.melee)k*=1.15;if(P.evo==='env'&&m.venom)k*=1+.06*m.venom;if(m.vulnT>0)k*=1.3;return k}
const critMult=()=>P.evo==='som'?2.1:1.6;
function evoTaken(dmg,src){const p=P;if(p.evo==='cav'&&Math.random()<.12){addText(p,'Bloqueou!','#e8e0d0');sfx('block');return 0}
  if(p.wallT>0){if(src&&src.hp!=null&&!src.dying){src.hp-=Math.round(dmg*.3);src.flash=.1;if(src.hp<=0)killMob(src,P)}dmg*=.4}
  if(p.shieldHp>0){const a=Math.min(p.shieldHp,dmg);p.shieldHp-=a;dmg-=a;if(a)addText(p,'Escudo','#cfe8ff')}return Math.round(dmg)}
function onPlayerHit(m,o,dmg){comboHit(!!o.skill);treeOnHit(m,o);const d=D();
  if(P.evo==='ber'){const ls=(P.buff.lust>0?.15:0)+.04+(P.redT>0?.0:0);P.hp=Math.min(d.maxHp,P.hp+dmg*ls+(P.redT>0?d.maxHp*.03:0))}
  if(P.evo==='env'&&m.def.ai!=='dummy'){m.venom=Math.min(5,(m.venom||0)+1);if(!o.quiet){m.bleedT=Math.max(m.bleedT||0,4);m.bleedTick=m.bleedTick||.5;m.poison=1;m.burn=0}}
  if(P.evo==='ber'&&o.skill&&P.lastSk&&P.lastSk.k==='Q'&&m.def.ai!=='dummy'){m.bleedT=4;m.bleedTick=.5;m.burn=0;m.poison=0}}
// ---------- revised base skills and evolution skills ----------
function evoSkill(code,k,p,a,ax,ay,ptAt,sk,d){if(treeSkill(code,k,p,a,ax,ay,ptAt,sk,d))return true;const el=clsEl(p),col=ELSL[el]||'#ffffff';
  switch(code){
    case'gQ':{p.spin={t:2.4,tick:0,el:wElem(p),key:k,min:.6};sfx('whirl');dust(p.x,p.y,10);return true}
    case'gT':{p.atkAnim='atk';p.atkDur=p.atkT=.48;p.aimLock=a;later(.28,()=>{const el2=wElem(p),hit=new Set(),segs=[];shake=Math.max(shake,.5);hitstop=Math.max(hitstop,.06);sfx('boom');let pts=[];for(let i=0;i<=8;i++){const t=i*.85;pts.push([p.x+Math.cos(a)*(.6+t)+rnd(-.15,.15),p.y+Math.sin(a)*(.6+t)+rnd(-.15,.15)])}segs.push(pts);for(let c=0;c<3;c++){const st=pick(pts),ba=a+rnd(-1.4,1.4);segs.push([st,[st[0]+Math.cos(ba)*.8,st[1]+Math.sin(ba)*.8],[st[0]+Math.cos(ba+.3)*1.4,st[1]+Math.sin(ba+.3)*1.4]])}fx.push({type:'crack',segs,t:0,life:1.8,el:el2});
      pts.forEach((q,i)=>later(i*.06,()=>{const [wx,wy]=wpx(q[0],q[1]);for(let j=0;j<6;j++)fx.push({type:'px',x:wx+rnd(-8,8),y:wy+rnd(-4,4),vx:rnd(-30,30),vy:rnd(-150,-70),g:360,t:0,life:rnd(.4,.8),col:pick(['#6a5a48','#8a7a62','#4a3e32']),sz:3});elemBurst(el2,q[0],q[1],5);dust(q[0],q[1],3);for(const m of mobsNear(q[0],q[1],1.1))if(!hit.has(m.id)){hit.add(m.id);hitMob(m,3,elemO(el2,{skill:1,breakGuard:1,stun:.9,knock:1}));if(!m.def.boss)m.liftT=.65}}));p.aimLock=null});return true}
    case'lE':{p.atkAnim='atk';p.atkDur=p.atkT=.26;sfx('swing');later(.06,()=>{for(let i=-2;i<=2;i++)shoot('p',p.x,p.y,a+i*.2,17,'dagger',.8,{skill:1,el:'void',bleed:p.evo==='env'?0:.5,poison:p.evo==='env'?1:0,pierce:1});burstAt(p.x,p.y,0xb06aff,10,60)});return true}
    case'lT':{const max=p.evo==='som'?7:5;let pool=liveMobs().filter(m=>m.def.ai!=='dummy'&&Math.hypot(m.x-ax,m.y-ay)<6&&dist(m,p)<9).sort((m1,m2)=>Math.hypot(m1.x-ax,m1.y-ay)-Math.hypot(m2.x-ax,m2.y-ay)).slice(0,max);if(!pool.length){p.mp+=sk.mp;p.cds[k]=0;addText(p,'Sem alvo','#cfc6b8');return true}
      p.ifr=.25+pool.length*.14;pool.forEach((t,i)=>later(i*.14,()=>{if(t.dying||t.dead)return;const ba=Math.random()*6.283;let nx=t.x+Math.cos(ba)*(t.r+.55),ny=t.y+Math.sin(ba)*(t.r+.55);if(blockedAt(M,nx,ny,.3)){nx=t.x;ny=t.y+t.r+.5}ghostFx(p,'#b06aff');p.x=nx;p.y=ny;unstick(M,p);p.d8=dir8(scrAng(t.x-p.x,t.y-p.y));p.atkAnim='atk';p.atkDur=p.atkT=.14;const sa=Math.atan2(t.y-p.y,t.x-p.x);fx.push({type:'slash',x:p.x,y:p.y,a:sa,r:1.4,t:0,life:.16,arc:1.8,col:i%2?'#e8c8ff':'#a46aff'});arcTrail('void',p.x,p.y,sa,1.2,1.8);const ex=t.hp<t.maxHp*.3&&!t.def.boss;hitMob(t,ex?6:2.2,{skill:1,melee:1,breakGuard:1,poison:p.evo==='env'?1:0});if(ex)addText(t,'EXECUÇÃO!','#c08aff',1);elemBurst('void',t.x,t.y,10);sfx('swing');shake=Math.max(shake,.12)}));return true}
    case'cavG':{p.wallT=6;for(const m of mobsNear(p.x,p.y,7))if(!m.def.boss||1){m.target=p;m.ret=false}fx.push({type:'ring',x:p.x,y:p.y,r:2.6,t:0,life:.6,col:'#ffd86a'});burstAt(p.x,p.y,0xffd86a,30,90);addText(p,'Muralha Sagrada!','#ffd86a',1);sfx('shout');return true}
    case'berG':{p.redT=8;p.stun=0;fx.push({type:'roar',x:p.x,y:p.y,t:0,life:.7});for(let i=0;i<3;i++)later(i*.1,()=>fx.push({type:'ring',x:p.x,y:p.y,r:1.6+i,t:0,life:.45,col:'#ff2a1a'}));burstAt(p.x,p.y,0xff2a1a,34,110);addText(p,'FÚRIA RUBRA!','#ff3a2a',1);sfx('shout');shake=Math.max(shake,.25);return true}
    case'cacQ':{p.atkAnim='bow';p.atkDur=p.atkT=.36;later(.14,()=>{shoot('p',p.x,p.y,a,24,'bigarrow',2.6,elemO(aElem(p)||'nature',{skill:1,pierce:99,knock:3}));projs[projs.length-1].life=.62;projs[projs.length-1].r=.4;sfx('xbow');shake=Math.max(shake,.1)});return true}
    case'cacE':{p.atkAnim='bow';p.atkDur=p.atkT=.32;later(.12,()=>{shoot('p',p.x,p.y,a,17,'arrow',.6,{skill:1,el:'fire',onHit:(m)=>{boomAt(m.x,m.y)}});sfx('bow')});return true}
    case'cacR':{const L=['fire','frost','poison'],i=(L.indexOf(p.qel)+1)%3;p.qel=L[i];addText(p,{fire:'Flechas de fogo',frost:'Flechas de gelo',poison:'Flechas de veneno'}[p.qel],ELSL[p.qel],1);elemBurst(p.qel,p.x,p.y,16);sfx('chime');return true}
    case'cacG':{p.atkAnim='bow';p.atkDur=p.atkT=.6;p.aimLock=a;addText(p,'Flecha do Dragão!','#8af05a',1);later(.35,()=>{shoot('p',p.x,p.y,a,20,'dragon',6,{skill:1,el:'nature',pierce:99,knock:4,breakGuard:1});const pr=projs[projs.length-1];pr.life=1.1;pr.r=.7;shake=Math.max(shake,.4);hitstop=Math.max(hitstop,.06);sfx('roar');fx.push({type:'ring',x:p.x,y:p.y,r:1.6,t:0,life:.4,col:'#8af05a'});p.aimLock=null});return true}
    case'barQ':{p.atkAnim='bow';p.atkDur=p.atkT=.3;later(.1,()=>{shoot('p',p.x,p.y,a,15,'note',1.6,{skill:1,el:'song',pierce:3,onHit:noteBounce});sfx('chime')});return true}
    case'barE':{const L=['coragem','vida','ritmo'],i=(L.indexOf(p.song)+1)%3;p.song=L[i];p.songT=20;netPartyFx={k:(netPartyFx?netPartyFx.k:0)+1,t:'song',v:p.song};addText(p,{coragem:'♪ Canção da Coragem',vida:'♪ Balada da Vida',ritmo:'♪ Ritmo Veloz'}[p.song],'#ffe08a',1);fx.push({type:'ring',x:p.x,y:p.y,r:2.4,t:0,life:.6,col:'#ffd86a'});notes(p.x,p.y,10);sfx('chime');return true}
    case'barR':{const [tx,ty]=ptAt(8);p.atkAnim='cast';p.atkDur=p.atkT=.3;fx.push({type:'ring',x:tx,y:ty,r:2.6,t:0,life:.6,col:'#5ae0c8'});notes(tx,ty,14);for(const m of mobsNear(tx,ty,2.6)){if(m.def.boss){m.slowT=Math.max(m.slowT||0,3);continue}m.confT=4;addText(m,'Confuso','#5ae0c8')}sfx('scare');return true}
    case'barG':{p.concertT=10;netPartyFx={k:(netPartyFx?netPartyFx.k:0)+1,t:'song',v:'concerto'};for(const m of mobsNear(p.x,p.y,5)){if(m.def.boss){m.slowT=5;continue}m.stunT=Math.max(m.stunT||0,5);m.sleepT=5;addText(m,'Zzz','#bfe8ff')}for(let i=0;i<4;i++)later(i*.15,()=>fx.push({type:'ring',x:p.x,y:p.y,r:1.5+i*1.2,t:0,life:.6,col:i&1?'#5ae0c8':'#ffd86a'}));notes(p.x,p.y,30);addText(p,'Grande Concerto!','#ffd86a',1);sfx('victory');return true}
    case'arqT':{const [tx,ty]=ptAt(8);p.atkAnim='cast';p.atkDur=p.atkT=.45;teles.push({shape:'circle',x:tx,y:ty,r:2.2,t:0,dur:.7,team:'p',col:'#ff8a2a',fire:()=>{meteorAt(tx,ty,2.2,3.5)}});fx.push({type:'meteor',x:tx,y:ty,t:0,life:.7});sfx('cast');return true}
    case'arqG':{const [tx,ty]=ptAt(8);p.atkAnim='cast';p.atkDur=p.atkT=.6;fx.push({type:'ring',x:tx,y:ty,r:3.5,t:0,life:.8,col:'#bfe8ff'});for(const m of mobsNear(tx,ty,3.5))hitMob(m,1,{skill:1,freeze:2.4,quiet:1});sfx('freeze');addText(p,'Cataclismo!','#9ad8ff',1);
      for(let i=0;i<6;i++)later(.4+i*.42,()=>{const x=tx+rnd(-2.4,2.4),y=ty+rnd(-2.4,2.4);fx.push({type:'meteor',x,y,t:0,life:.45});later(.45,()=>meteorAt(x,y,1.6,1.8))});for(let i=0;i<8;i++)later(.5+i*.3,()=>{const x=tx+rnd(-3,3),y=ty+rnd(-3,3);zap(x,y);for(const m of mobsNear(x,y,1.2))hitMob(m,1,{skill:1,shock:1,quiet:1})});return true}
    case'sacG':{const dd=D();p.hp=dd.maxHp;p.mp=Math.min(dd.maxMp,p.mp+dd.maxMp*.2);p.slowT=0;p.stun=0;p.angelT=20;netPartyFx={k:(netPartyFx?netPartyFx.k:0)+1,t:'heal',v:40};for(let i=0;i<3;i++)later(i*.15,()=>fx.push({type:'ring',x:p.x,y:p.y,r:1.4+i*1.1,t:0,life:.6,col:'#fff0a0'}));burstAt(p.x,p.y,0xfff0a0,40,70);addText(p,'Graça Divina','#fff0a0',1);sfx('heal');return true}
    case'somG':{clones.length=0;for(let i=0;i<3;i++){const ang=i/3*6.283;clones.push({type:'clone',clone:1,x:p.x+Math.cos(ang),y:p.y+Math.sin(ang),t:8,cd:.3+i*.2,d8:0,anim:'idle',frame:0,m:M.id,look:p.look})}burstAt(p.x,p.y,0x7a3ac8,30,70);addText(p,'Legião Sombria!','#c08aff',1);sfx('blink');return true}
    case'envG':{const [tx,ty]=ptAt(7);clouds.push({x:tx,y:ty,r:3,t:6,tick:0,mult:.35,vuln:1,m:M.id});fx.push({type:'ring',x:tx,y:ty,r:3,t:0,life:.6,col:'#9a5ae8'});addText(p,'Praga!','#c08aff',1);sfx('cast');return true}
  }return false}
function evoAfter(p,k,a,ax,ay){const c=setCode(p)+k,code=skCode(p,k);
  if(code==='gR'){for(const m of mobsNear(p.x,p.y,3.6)){if(m.def.boss||m.def.ai==='dummy')continue;m.stunT=Math.max(m.stunT||0,1.5);const ka=Math.atan2(m.y-p.y,m.x-p.x);m.kx=Math.cos(ka)*3;m.ky=Math.sin(ka)*3;addText(m,'Medo!','#ff8a6a')}
    if(p.evo==='cav'){p.buff.bless=Math.max(p.buff.bless||0,8);for(const m of mobsNear(p.x,p.y,6))m.target=p}if(p.evo==='ber')p.buff.lust=8}
  if(c==='cavQ')p.shieldHp=Math.round(D().maxHp*.12),p.shieldT=5;
  if(c==='somQ'&&p.nextCrit){clones.push({type:'clone',clone:1,x:p.x+.4,y:p.y+.4,t:3,cd:.2,d8:p.d8,anim:'idle',frame:0,m:M.id,look:p.look})}
  if(c==='envQ')clouds.push({x:p.x,y:p.y,r:1.8,t:4,tick:0,mult:.2,m:M.id});
  if(c==='sacE'){netPartyFx={k:(netPartyFx?netPartyFx.k:0)+1,t:'heal',v:25};const dd=D();p.hp=Math.min(dd.maxHp,p.hp+dd.maxHp*.07)}}
// ---------- skill helpers ----------
function boomAt(x,y){explode(x,y,1.8,2,{skill:1,burn:1,el:'fire'});clouds.push({x,y,r:1.5,t:3,tick:0,mult:.25,fire:1,m:M.id})}
function meteorAt(x,y,r,mult){explode(x,y,r,mult,{skill:1,burn:1,el:'fire'});shake=Math.max(shake,.35);clouds.push({x,y,r:r*.8,t:3,tick:0,mult:.25,fire:1,m:M.id});dust(x,y,12)}
function noteBounce(m,pr){if(pr.bounced)return;const nx=liveMobs().filter(q=>q!==m&&!pr.hit.has(q.id)&&Math.hypot(q.x-m.x,q.y-m.y)<5).sort((q1,q2)=>Math.hypot(q1.x-m.x,q1.y-m.y)-Math.hypot(q2.x-m.x,q2.y-m.y))[0];if(!nx)return;pr.bounced=1;const a2=Math.atan2(nx.y-m.y,nx.x-m.x),sp=Math.hypot(pr.vx,pr.vy);pr.vx=Math.cos(a2)*sp;pr.vy=Math.sin(a2)*sp;pr.a=a2;pr.life=Math.max(pr.life,.45);pr.o=Object.assign({},pr.o,{pierce:Math.max(pr.o.pierce||0,1)});notes(m.x,m.y,4)}
function notes(x,y,n){const [wx,wy]=wpx(x,y);for(let i=0;i<n;i++)fx.push({type:'note',x:wx+rnd(-20,20),y:wy-rnd(6,30),vx:rnd(-12,12),vy:rnd(-40,-18),t:0,life:rnd(.8,1.4),col:pick(['#ffe08a','#5ae0c8','#fff6c0'])})}
const clones=[],clouds=[];let netPartyFx=null;
// ---------- per-frame updates ----------
function classTick(dt){const p=P;if(!p||state!=='play')return;p._mhp=D().maxHp;
  if(CB.t>0){CB.t-=dt;if(CB.t<=0)CB.n=0}
  for(const k of ['redT','wallT','songT','concertT','angelT','shieldT'])if(p[k]>0)p[k]=Math.max(0,p[k]-dt);if(!(p.shieldT>0))p.shieldHp=0;if(p.buff.lust>0)p.buff.lust-=dt;if(p.redT>0)p.stun=0;
  if(p.songR&&p.songR.t>0)p.songR.t-=dt;
  const sg=p.songT>0?p.song:p.songR&&p.songR.t>0?p.songR.id:null;if((sg==='vida'||p.concertT>0||(p.songR&&p.songR.t>0&&p.songR.id==='concerto'))&&!p.dead){const dd=D();p.hp=Math.min(dd.maxHp,p.hp+dd.maxHp*.015*dt)}
  if((p.songT>0||p.concertT>0)&&Math.random()<dt*5)notes(p.x,p.y,1);
  // channelled whirlwind
  if(p.spin){const s=p.spin;s.t-=dt;s.min-=dt;s.tick-=dt;p.spinT=.12;p.atkAnim='atk';
    if(s.tick<=0){s.tick=.3;fx.push({type:'whirl',x:p.x,y:p.y,r:2.1,t:0,life:.32,el:s.el});arcTrail(s.el,p.x,p.y,0,2,6.28);pokePlants(p.x,p.y,2.1);sfx('whirl');
      for(const m of mobsNear(p.x,p.y,2.1)){hitMob(m,.55,elemO(s.el,{skill:1,knock:.3,quiet:1}));const ka=Math.atan2(p.y-m.y,p.x-m.x);if(!m.def.boss){m.kx=Math.cos(ka)*1.4;m.ky=Math.sin(ka)*1.4}elemBurst(s.el,m.x,m.y,4)}}
    const held=input.touch||input.keys[s.key.toLowerCase()];if(s.t<=0||(s.min<=0&&!held)||p.dead||p.stun>0){p.spin=null;p.spinT=0}}
  // lift / confusion / sleep
  for(const m of mobs){if(m.m!==M.id||m.dying)continue;if(m.liftT>0){m.liftT-=dt;m.z=Math.sin(Math.max(0,m.liftT)/.65*Math.PI)*26;m.stunT=Math.max(m.stunT||0,.1);if(m.liftT<=0){m.z=0;dust(m.x,m.y,4)}}
    if(m.vulnT>0)m.vulnT-=dt;
    if(m.confT>0){m.confT-=dt;m.stunT=Math.max(m.stunT||0,.1);if(Math.random()<dt*2){m.kx=rnd(-1.5,1.5);m.ky=rnd(-1.5,1.5)}if(Math.random()<dt*.6){const o=liveMobs().find(q=>q!==m&&dist(q,m)<1.8);if(o){const dm=Math.max(1,Math.round(m.atk*.8));o.hp-=dm;o.flash=.1;addText(o,dm,'#5ae0c8');if(o.hp<=0)killMob(o,P)}}if(Math.random()<dt*3)notes(m.x,m.y,1)}
    if(m.sleepT>0){m.sleepT-=dt;if(Math.random()<dt*1.5)addText(m,'z','#bfe8ff')}}
  // clouds (poison / fire ground)
  for(let i=clouds.length-1;i>=0;i--){const c=clouds[i];c.t-=dt;c.tick-=dt;if(c.m!==M.id||c.t<=0){clouds.splice(i,1);continue}
    if(Math.random()<dt*14){const a=Math.random()*6.283,r=Math.random()*c.r;const [wx,wy]=wpx(c.x+Math.cos(a)*r,c.y+Math.sin(a)*r);fx.push({type:'px',x:wx,y:wy-2,vx:rnd(-4,4),vy:c.fire?rnd(-40,-15):rnd(-14,-4),g:0,t:0,life:rnd(.5,1),col:c.fire?pick(ELC.fire):c.frost?pick(ELC.frost):c.smoke?pick(['#6a6a74','#8a8494','#4a4454']):pick(['#c08aff','#9ae85a','#6a2aba']),glow:1,sz:2})}
    if(c.tick<=0){c.tick=.5;for(const m of mobsNear(c.x,c.y,c.r)){if(c.smoke){m.slowT=Math.max(m.slowT||0,1);continue}hitMob(m,c.mult,c.fire?{skill:1,burn:1,quiet:1}:c.frost?{skill:1,slow:1.5,quiet:1,freeze:Math.random()<.12?1.4:0}:{skill:1,poison:1,quiet:1});if(c.vuln)m.vulnT=1}}}
  // shadow clones
  for(let i=clones.length-1;i>=0;i--){const c=clones[i];c.t-=dt;c.cd-=dt;c.m=M.id;if(c.t<=0){burstAt(c.x,c.y,0x7a3ac8,10,40);clones.splice(i,1);continue}
    const tg=liveMobs().filter(m=>m.def.ai!=='dummy'&&dist(m,p)<6).sort((m1,m2)=>dist(m1,c)-dist(m2,c))[0];
    const gx=tg?tg.x+Math.cos(i*2.1)*(tg.r+.5):p.x+Math.cos(T+i*2.1)*1.2,gy=tg?tg.y+Math.sin(i*2.1)*(tg.r+.5):p.y+Math.sin(T+i*2.1)*1.2,dx=gx-c.x,dy=gy-c.y,dd=Math.hypot(dx,dy);
    if(dd>.15){const st=Math.min(dd,dt*7);c.x+=dx/dd*st;c.y+=dy/dd*st;c.d8=dir8(scrAng(dx,dy));c.anim='walk';c.frame=Math.floor(T*10)%8}else{c.anim='idle';c.frame=0}
    if(tg&&c.cd<=0&&dist(tg,c)<tg.r+1){c.cd=.55;c.anim='atk';c.frame=2;c.d8=dir8(scrAng(tg.x-c.x,tg.y-c.y));const sa=Math.atan2(tg.y-c.y,tg.x-c.x);fx.push({type:'slash',x:c.x,y:c.y,a:sa,r:1.2,t:0,life:.14,arc:1.4,col:'#c08aff'});hitMob(tg,.5,{skill:1,melee:1,quiet:1});elemBurst('void',tg.x,tg.y,4)}}
  // party song / heal from remote allies
  if(party)for(const r of remotes.values()){if(r.pt!==party||r.m!==M.id||Math.hypot(r.x-p.x,r.y-p.y)>8)continue;if(r.sg)p.songR={id:r.sg,t:1}}
  // evolution aura
  if(p.evo&&Math.random()<dt*6){const [wx,wy]=wpx(p.x,p.y);fx.push({type:'px',x:wx+rnd(-10,10),y:wy-rnd(0,8),vx:rnd(-4,4),vy:rnd(-30,-12),g:0,t:0,life:rnd(.6,1),col:EVO[p.evo].aura,glow:1})}
  updComboHud()}
function onRemoteParty(r,f){if(!party||r.pt!==party||r.m!==M.id||Math.hypot(r.x-P.x,r.y-P.y)>9)return;if(f.t==='heal'){const dd=D(),h=Math.round(dd.maxHp*clamp(+f.v||0,0,60)/100);P.hp=Math.min(dd.maxHp,P.hp+h);addText(P,'+'+h,'#7fe08a',1);burstAt(P.x,P.y,0xfff0a0,16,40)}}
// ---------- revive (Sacerdote) ----------
function angelSave(){if(P.angelT>0){P.angelT=0;const dd=D();P.hp=Math.round(dd.maxHp*.5);P.dead=false;P.ifr=2;burstAt(P.x,P.y,0xfff0a0,40,80);addText(P,'Graça Divina!','#fff0a0',1);sfx('heal');return true}return false}
// ---------- combo HUD ----------
let cbShown=-1,cbFury=-1;
function updComboHud(){const box=$('#comboBox');if(!box)return;const n=CB.n,f=P.cls==='g'?Math.round(P.fury||0):-1;if(n===cbShown&&f===cbFury&&!(n>0))return;
  if(n!==cbShown){cbShown=n;box.querySelector('.n').textContent=n>1?`x${n}`:'';const k='atk',r=skRank(k);box.querySelector('.b').textContent=n>1?`combo · +${Math.round(Math.min(.6+.1*(skRank('Q')-1),n*(.012+.006*(skRank('Q')-1)))*100)}% nas habilidades`:'';box.style.setProperty('--cc',ELSL[clsEl(P)]||'#ffd23a')}
  box.querySelector('.t').style.width=n>1?Math.max(0,CB.t/2.8*100)+'%':'0';
  const fb=box.querySelector('.fury');fb.hidden=P.cls!=='g';if(f!==cbFury){cbFury=f;fb.querySelector('i').style.width=(P.furyReady?100:f)+'%';fb.classList.toggle('full',!!P.furyReady)}
  box.hidden=!(n>1)&&P.cls!=='g'}
// ---------- evolution master ----------
function evoMenu(nm){const q=P.q.evo||0;
  if(P.evo){const e=EVO[P.evo];dlg(nm,`Você já é ${e.n}. ${e.d} Se quiser trocar de caminho, cobro 500 ouro e você mantém o nível.`,[{l:'Trocar de caminho (500 ouro)',f:()=>{if(P.gold<500){toast('Ouro insuficiente','Custa 500');sfx('no');return}P.gold-=500;P.evo=null;P.q.evo=2;afterEvo();evoMenu(nm)}},{l:'Até mais'}]);return}
  if(P.lv<EVO_LV){dlg(nm,`Todo aventureiro chega a um ponto em que precisa escolher quem vai ser. Volte quando estiver no nível ${EVO_LV}: aí eu te dou a prova.`,[{l:'Certo'}]);return}
  if(q===0){dlg(nm,`Você está pronto para a prova. Derrote o chefe de qualquer masmorra e volte aqui. Depois disso, escolha seu caminho.`,[{l:'Aceito a prova',pri:1,f:()=>{P.q.evo=1;log('Missão: A Prova do Mestre (derrote um chefe de masmorra)','sys');sfx('ok');uiDirty=1}},{l:'Agora não'}]);return}
  if(q===1){dlg(nm,'Ainda não derrotou um chefe? Qualquer masmorra serve: a Toca dos Goblins, a Cripta, as pirâmides...',[{l:'Vou lá'}]);return}
  const opts=Object.entries(EVO).filter(([k,e])=>e.cls===P.cls).map(([k,e])=>({l:`${e.n}: ${e.d}`,pri:1,f:()=>dlg(nm,`${e.n}. ${e.d} Passiva: ${e.pas} Habilidade definitiva (G): ${SKILLS[k].G.n}. ${SKILLS[k].G.d}`,[{l:`Tornar-me ${e.n}`,pri:1,f:()=>{P.evo=k;P.q.evo=3;afterEvo();burstAt(P.x,P.y,parseInt(e.aura.slice(1),16),60,110);for(let i=0;i<3;i++)later(i*.18,()=>fx.push({type:'ring',x:P.x,y:P.y,r:1.4+i*1.2,t:0,life:.7,col:e.aura}));sfx('victory');toast('Evolução!',`Agora você é ${e.n}`);log(`Você evoluiu para ${e.n}! Nova habilidade definitiva na tecla G.`,'loot','#ffd23a');PS().evo=1;achCheck()}},{l:'Voltar',f:()=>evoMenu(nm)}])}));
  dlg(nm,'Você provou seu valor. Escolha seu caminho:',[...opts,{l:'Ainda vou pensar'}])}
function afterEvo(){P.look=playerLook(P);P.cds.G=0;buildActionBar();touchSet='';uiDirty=1;save()}
// look and naming hooks
{const _pl=playerLook;playerLook=function(p){const L=_pl(p);const e=p&&p.evo&&EVO[p.evo];if(e){Object.assign(L,{cape:e.look.cape,trim:e.look.trim,evoAura:e.aura});delete L._k}return L}}
{const _si=skillIcon;skillIcon=function(c,k){const s=SKILLS[c]&&SKILLS[c][k];if(EVO[c]&&s&&s.code&&s.code.length===2&&!['gT','lE','lT'].includes(s.code))return _si(s.code[0],s.code[1]);if(EVO[c]&&k==='atk')return _si(EVO[c].cls==='m'&&c==='sac'?'h':EVO[c].cls,'atk');if(EVO[c]||(c==='l'&&(k==='E'||k==='T'))||(c==='g'&&k==='T'))return evoIcon(c,k,s);return _si(c,k)}}
function evoIcon(c,k,s){const base=EVO[c]?EVO[c].cls:c,code=s&&s.code||c+k;
  const [cv,x]=mk(24,24);const col=EVO[c]?EVO[c].aura:ELSL[CLS_EL[c]]||'#ffe6b0';const g=x.createLinearGradient(0,0,24,24);g.addColorStop(0,'#3a2440');g.addColorStop(1,'#0e0a14');x.fillStyle=g;x.fillRect(0,0,24,24);x.strokeStyle=col;x.fillStyle=col;x.lineWidth=2;x.beginPath();
  const K=code.slice(-1),id=code;
  if(id==='lE'){for(const a of [-.6,-.3,0,.3,.6]){x.beginPath();x.moveTo(5,19);x.lineTo(5+Math.cos(-.78+a)*15,19+Math.sin(-.78+a)*15);x.stroke()}}
  else if(id==='lT'){for(let i=0;i<4;i++){const a=i*1.57+.4;x.beginPath();x.moveTo(12,12);x.lineTo(12+Math.cos(a)*9,12+Math.sin(a)*9);x.stroke()}x.beginPath();x.arc(12,12,3,0,7);x.fill()}
  else if(id==='gT'){x.moveTo(3,20);x.lineTo(8,15);x.lineTo(11,17);x.lineTo(15,11);x.lineTo(18,13);x.lineTo(21,5);x.stroke()}
  else if(id==='cavG'){x.moveTo(12,3);x.lineTo(20,7);x.lineTo(19,15);x.lineTo(12,21);x.lineTo(5,15);x.lineTo(4,7);x.closePath();x.stroke();x.fillRect(11,7,2,10);x.fillRect(8,10,8,2)}
  else if(id==='berG'){for(const r of [4,7,10]){x.beginPath();x.arc(12,12,r,0,7);x.stroke()}x.beginPath();x.arc(12,12,2,0,7);x.fill()}
  else if(id==='cacQ'||id==='cacG'){x.lineWidth=id==='cacG'?4:3;x.moveTo(3,21);x.lineTo(20,4);x.stroke();x.beginPath();x.moveTo(21,3);x.lineTo(13,5);x.lineTo(19,11);x.fill()}
  else if(id==='cacE'){x.arc(13,11,6,0,7);x.fill();for(let i=0;i<8;i++){const a=i*.785;x.beginPath();x.moveTo(13+Math.cos(a)*7,11+Math.sin(a)*7);x.lineTo(13+Math.cos(a)*10,11+Math.sin(a)*10);x.stroke()}}
  else if(id==='cacR'){x.fillStyle='#ff8a2a';x.fillRect(4,6,4,12);x.fillStyle='#bfe8ff';x.fillRect(10,6,4,12);x.fillStyle='#9ae85a';x.fillRect(16,6,4,12)}
  else if(code.startsWith('bar')){x.fillRect(6,15,5,4);x.fillRect(14,13,5,4);x.fillRect(10,5,2,12);x.fillRect(17,4,2,11);x.fillRect(10,4,9,2);if(K==='R'){x.beginPath();x.arc(12,12,10,0,7);x.stroke()}if(K==='G'){x.beginPath();x.arc(12,12,10,0,3.14);x.stroke()}}
  else if(id==='arqT'||id==='arqG'){x.arc(15,15,5,0,7);x.fill();x.beginPath();x.moveTo(11,11);x.lineTo(3,3);x.stroke();x.beginPath();x.moveTo(14,9);x.lineTo(8,2);x.stroke()}
  else if(id==='sacG'){x.arc(12,12,5,0,7);x.fill();for(let i=0;i<8;i++){const a=i*.785;x.beginPath();x.moveTo(12+Math.cos(a)*7,12+Math.sin(a)*7);x.lineTo(12+Math.cos(a)*11,12+Math.sin(a)*11);x.stroke()}}
  else if(id==='somG'){for(const ox of [6,12,18]){x.beginPath();x.arc(ox,9,3,0,7);x.fill();x.fillRect(ox-3,12,6,8)}}
  else if(id==='envG'){for(const [ox,oy,r] of [[8,13,5],[15,10,6],[14,17,4]]){x.beginPath();x.arc(ox,oy,r,0,7);x.fill()}x.fillStyle='#1a0a2a';x.fillRect(10,11,2,2);x.fillRect(15,11,2,2)}
  else{x.arc(12,12,7,0,7);x.stroke()}
  x.globalAlpha=.8;x.lineWidth=1;x.strokeRect(.5,.5,23,23);return cv.toDataURL()}
// ---------- character window: skill ranks ----------
function skillRow(k){const s=skillSet(P)[k];const r=skRank(k),pts=skPoints(),lock=s.lv&&P.lv<s.lv;const e=document.createElement('div');e.className='skrow'+(lock?' locked':'');
  const img=document.createElement('img');img.alt='';img.src=SKICON[setCode(P)+k]||'';const box=document.createElement('div');const b=document.createElement('b');b.textContent=`[${k==='atk'?'Mouse':k}] ${s.n}`;const m=document.createElement('span');m.className='mut';m.textContent=` ${k==='atk'?'ataque básico':s.mp+' mana · '+s.cd+'s'}${lock?' · nível '+s.lv:''} · Nv ${r}/5`;
  const dsc=document.createElement('span');dsc.textContent=(s.d||'')+` Dano +${(r-1)*12}% · bônus de combo ${k==='atk'?'+'+(0.8+.4*(r-1)).toFixed(1)+'% por acerto (máx. 40%)':'+'+(1.2+.6*(r-1)).toFixed(1)+'% por acerto (máx. '+(60+10*(r-1))+'%)'}.`;
  box.appendChild(b);box.appendChild(m);box.appendChild(document.createElement('br'));box.appendChild(dsc);e.appendChild(img);e.appendChild(box);
  if(r<5&&!lock){const up=document.createElement('button');up.type='button';up.className='btn skup';up.textContent='+';up.title='Melhorar (1 ponto de habilidade)';up.disabled=pts<=0;up.onclick=()=>rankUp(k);e.appendChild(up)}return e}
function skillsPanel(){const sk=document.createElement('div');sk.className='skills';const hd=document.createElement('div');hd.className='skhead';const pts=skPoints();hd.textContent=`Pontos de habilidade: ${pts}`+(P.evo?` · ${EVO[P.evo].n}: ${EVO[P.evo].pas}`:P.cls==='g'?' · Passiva Fúria: golpes enchem a barra; cheia, a próxima habilidade sai de graça e com +50%.':P.cls==='l'?' · Passiva Combo: +3% de crítico por acerto seguido (até 30%).':'');sk.appendChild(hd);
  for(const k of ['atk',...skKeys(P)])sk.appendChild(skillRow(k));return sk}
// ---------- remote visuals for the new skills ----------
function remoteEvoFx(r,c,a,tx,ty){const ev=EVO[c.slice(0,3)],col=ev?ev.aura:ELSL[CLS_EL[c[0]]]||'#ffffff',x=r.x,y=r.y,near=Math.hypot(x-P.x,y-P.y)<12,K=c.slice(-1);
  if(c==='lE'||c.endsWith('E')&&(c.startsWith('som')||c.startsWith('env'))){later(.06,()=>{for(let i=-2;i<=2;i++)shoot('v',r.x,r.y,a+i*.2,17,'dagger',0,{el:'void'})});return}
  if(c==='lT'||K==='T'&&(c.startsWith('som')||c.startsWith('env'))){for(let i=1;i<=5;i++)later(i*.1,()=>ghostFx(r,'#b06aff'));burstAt(tx,ty,0xb06aff,24,80);return}
  if(c==='gT'||K==='T'&&(c.startsWith('cav')||c.startsWith('ber'))){later(.28,()=>{const pts=[];for(let i=0;i<=8;i++)pts.push([r.x+Math.cos(a)*(.6+i*.85),r.y+Math.sin(a)*(.6+i*.85)]);fx.push({type:'crack',segs:[pts],t:0,life:1.6,el:'rage'});if(near){shake=Math.max(shake,.2);sfx('boom')}});return}
  if(c==='gQ'||K==='Q'&&(c.startsWith('cav')||c.startsWith('ber'))){for(let i=0;i<8;i++)later(i*.3,()=>fx.push({type:'whirl',x:r.x,y:r.y,r:2.1,t:0,life:.32,el:'rage'}));r.spinT=2.4;if(near)sfx('whirl');return}
  if(c==='cacQ'||c==='cacG'){later(c==='cacG'?.35:.14,()=>shoot('v',r.x,r.y,a,c==='cacG'?20:24,c==='cacG'?'dragon':'bigarrow',0,{el:'nature'}));return}
  if(c==='cacE'){later(.12,()=>shoot('v',r.x,r.y,a,17,'arrow',0,{el:'fire'}));return}
  if(c==='barQ'){later(.1,()=>shoot('v',r.x,r.y,a,15,'note',0,{el:'song'}));return}
  if(c==='arqT'){fx.push({type:'meteor',x:tx,y:ty,t:0,life:.7});later(.7,()=>{fx.push({type:'ring',x:tx,y:ty,r:2.2,t:0,life:.35,col:'#ffb060'});burstAt(tx,ty,0xff7a2a,26,70);if(near)sfx('boom')});return}
  if(c==='arqG'){fx.push({type:'ring',x:tx,y:ty,r:3.5,t:0,life:.8,col:'#bfe8ff'});for(let i=0;i<6;i++)later(.4+i*.42,()=>fx.push({type:'meteor',x:tx+rnd(-2.4,2.4),y:ty+rnd(-2.4,2.4),t:0,life:.45}));return}
  if(c.startsWith('bar')){notes(K==='R'?tx:x,K==='R'?ty:y,14)}
  if(['sac','som','env','cav','ber','arq','cac','bar'].includes(c.slice(0,3))&&['Q','E','R','T'].includes(K)){const base=SKILLS[c.slice(0,3)][K];if(base&&base.code&&base.code.length===2&&remoteBase(r,base.code,a,tx,ty))return}
  for(let i=0;i<3;i++)later(i*.12,()=>fx.push({type:'ring',x:r.x,y:r.y,r:1.4+i*.9,t:0,life:.5,col}));burstAt(x,y,parseInt(col.slice(1),16),26,90);if(near)sfx('shout')}
function remoteBase(r,code,a,tx,ty){remoteSkillFx(r,code,a,tx,ty);return true}
{const _ba=basicAttack;basicAttack=function(){_ba();const p=P;if(p.evo==='cac'){p.shots=(p.shots||0)+1;if(p.shots%5===0){const a=p.aimLock!=null?p.aimLock:aimA();later(.14,()=>{for(const o of [-.14,.14])shoot('p',p.x,p.y,a+o,15,'arrow',.8,elemO(aElem(p),{}));burstAt(p.x,p.y,0x8af05a,8,40)})}}if(p.evo==='bar')later(.12,()=>notes(p.x,p.y,2))}}
// ---------- projectile looks for the new skills ----------
function drawProjX(p,x,y,h,dx,dy,L){const k=p.kind;
  if(k==='dagger'){const sp=T*30;b.save();b.translate(Math.round(x),Math.round(y-h));b.rotate(sp);b.fillStyle='#e8e0f0';b.fillRect(-4,-1,6,2);b.fillStyle='#6a2aba';b.fillRect(2,-1,2,2);b.restore();b.globalAlpha=.45;b.fillStyle='#c08aff';b.fillRect(Math.round(x-dx*6)-1,Math.round(y-h-dy*6)-1,3,3);b.globalAlpha=1;b.fillStyle='rgba(0,0,0,.25)';b.fillRect(Math.round(x)-2,Math.round(y),4,1);L.push([x,y-h,26,2]);return true}
  if(k==='note'){const bob=Math.sin(T*20)*2;b.strokeStyle='#5ae0c8';b.globalAlpha=.55;b.lineWidth=2;b.beginPath();b.arc(x-dx*4,y-h-dy*4,6,sa2(dx,dy)-1.1,sa2(dx,dy)+1.1);b.stroke();b.globalAlpha=1;b.lineWidth=1;b.fillStyle='#ffe08a';b.fillRect(Math.round(x)-2,Math.round(y-h+bob),4,3);b.fillRect(Math.round(x)+1,Math.round(y-h+bob)-6,1,7);b.fillRect(Math.round(x)+1,Math.round(y-h+bob)-6,4,2);L.push([x,y-h,40,2]);return true}
  if(k==='bigarrow'||k==='dragon'){const big=k==='dragon',len=big?26:14,w=big?5:3;b.strokeStyle=big?'#3a8a2a':'#8a6a3a';b.lineWidth=w-1;b.beginPath();b.moveTo(x-dx*len,y-h-dy*len);b.lineTo(x+dx*len*.5,y-h+dy*len*.5);b.stroke();b.fillStyle=big?'#eaffb8':'#e8e8f0';b.beginPath();b.moveTo(x+dx*(len*.5+w*2.2),y-h+dy*(len*.5+w*2.2));b.lineTo(x+dx*len*.5-dy*w*1.4,y-h+dy*len*.5+dx*w*1.4);b.lineTo(x+dx*len*.5+dy*w*1.4,y-h+dy*len*.5-dx*w*1.4);b.fill();b.lineWidth=1;
    b.globalAlpha=.35;b.strokeStyle='#8af05a';b.lineWidth=big?10:5;b.beginPath();b.moveTo(x-dx*len*(big?2.4:1.6),y-h-dy*len*(big?2.4:1.6));b.lineTo(x,y-h);b.stroke();b.globalAlpha=1;b.lineWidth=1;
    if(big&&Math.random()<.9)for(let i=0;i<3;i++)fx.push({type:'px',x:x+sx0-dx*rnd(0,30)+rnd(-6,6),y:y+sy0-h-dy*rnd(0,30)+rnd(-6,6),vx:rnd(-20,20),vy:rnd(-30,10),g:0,t:0,life:rnd(.3,.6),col:pick(ELC.nature),glow:1,sz:2});
    L.push([x,y-h,big?120:50,2]);b.fillStyle='rgba(0,0,0,.25)';b.fillRect(Math.round(x)-3,Math.round(y),6,1);return true}
  return false}
const sa2=(dx,dy)=>Math.atan2(dy,dx);
try{const v=localStorage.getItem('pedravale-pix');if(v!=null&&['0','1','2'].includes(v))CFG.pixelFinish=+v}catch(e){}
