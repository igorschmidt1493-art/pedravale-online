// ===================== multiplayer (Claude room: live presence) =====================
// Each open copy of the page publishes its player as presence; everyone else draws it.
// Monsters, loot and quests stay local to each player in this stage.
let netA=null,netSk=null,netSkK=0,party=null,pendingInv=null,netInv=null,netInvK=0,netChatG=null;const remotes=new Map();let NET=null,netState='off',netLast='',netT=0,netAct=0,netPrevAtk=0,netChatK=0,netChatT='';
const NET_ANIMS=['atk','bow','cast'],NET_SLOTS=['arma','escudo','cabeca','peito','pernas','pes','maos'];
function wsRoom(){let ws=null,conn=false,retry=1000,meId=null;const connH=[],peerH=[],peers=new Map(),mine={};
  const mkPeer=(peer,presence)=>Object.freeze({peer,by:null,isMe:false,sameTab:false,kind:'viewer',guest:false,presence:presence&&typeof presence==='object'?presence:{},updatedAt:Date.now()});
  const emit=ch=>{const arr=[...peers.values()];for(const h of peerH)h({peers:arr,joined:ch.joined||[],updated:ch.updated||[],left:ch.left||[]})};
  const setConn=c=>{conn=c;for(const h of connH)h(c)};
  function open(){try{ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws')}catch(e){setTimeout(open,retry);return}
    ws.onopen=()=>{retry=1000;setConn(true);if(Object.keys(mine).length)ws.send(JSON.stringify({t:'p',presence:mine}))};
    ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(_){return}if(!m)return;
      if(m.t==='hello'){meId=m.you;const old=new Map(peers);peers.clear();const joined=[],updated=[];for(const p of m.peers||[]){const pp=mkPeer(p.peer,p.presence);peers.set(p.peer,pp);(old.has(p.peer)?updated:joined).push(pp);old.delete(p.peer)}emit({joined,updated,left:[...old.values()]})}
      else if(m.t==='up'){const had=peers.has(m.peer),pp=mkPeer(m.peer,m.presence);peers.set(m.peer,pp);emit(had?{updated:[pp]}:{joined:[pp]})}
      else if(m.t==='left'){const pp=peers.get(m.peer);if(pp){peers.delete(m.peer);emit({left:[pp]})}}
      else if(m.t==='full'){netState='full'}};
    ws.onclose=()=>{setConn(false);setTimeout(open,retry);retry=Math.min(15000,retry*1.6)};ws.onerror=()=>{}}
  open();
  return{me:()=>meId,connected:()=>conn,onConnection:h=>{connH.push(h);setTimeout(()=>h(conn),0);return()=>{}},onPeers:h=>{peerH.push(h);return()=>{}},
    presence:async o=>{for(const k in o){if(o[k]===null)delete mine[k];else mine[k]=o[k]}if(ws&&ws.readyState===1)ws.send(JSON.stringify({t:'p',presence:mine}))}}}
function netInit(){if(NET_WS&&/^https?:$/.test(location.protocol)){netAttach(wsRoom());return}
  try{if(!window.claude||typeof window.claude.use!=='function')return}catch(e){return}
  window.claude.use('room').then(room=>{if(room)netAttach(room)}).catch(()=>{})}
function netAttach(room){{NET=room;netState=room.connected()?'on':'wait';
    room.onConnection(c=>{netState=c?'on':'wait'},()=>{netState='off';remotes.clear()});
    room.onPeers(ch=>{for(const p of ch.left){const r=remotes.get(p.peer);if(r){remotes.delete(p.peer);if(state==='play')log(`${r.name} saiu do mundo.`,'sys')}}
      for(const p of ch.joined)if(!p.sameTab)netPeer(p);for(const p of ch.updated)if(!p.sameTab)netPeer(p)},()=>{netState='off';remotes.clear()})}}
const cleanTxt=(s,n)=>String(s==null?'':s).replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩]/g,'').slice(0,n);
function netLook(k){if(!k||typeof k!=='object')return null;const eq={};const e=k.eq&&typeof k.eq==='object'?k.eq:{};
  for(const sl of NET_SLOTS){const id=e[sl];if(typeof id==='string'&&BASES[id]&&BASES[id].slot===sl)eq[sl]={id}}
  return playerLook({eq,skin:clamp(k.sk|0,0,SKINS.length-1),hairC:clamp(k.hc|0,0,HAIRC.length-1),hs:['short','long','bald'].includes(k.hs)?k.hs:'short',capeC:clamp(k.cp|0,0,CAPES.length-1),beard:!!k.bd,evo:EVO[k.ev]?k.ev:null})}
function netPeer(p){const s=p.presence;if(!s||!s.n||typeof s.m!=='string'||!MAPS[s.m]){if(remotes.has(p.peer))remotes.delete(p.peer);return}
  const x=+s.x,y=+s.y;if(!isFinite(x)||!isFinite(y))return;let r=remotes.get(p.peer);
  if(!r){r={type:'remote',peer:p.peer,x,y,tx:x,ty:y,d8:0,anim:'idle',frame:0,animT:0,atkT:0,atkDur:.3,act:s.a&&s.a.k||0,chatK:s.ch&&s.ch.k||0,lookKey:''};remotes.set(p.peer,r);if(state==='play')log(`${cleanTxt(s.n,16)} entrou no mundo.`,'sys');if(state==='play')sfx('chime')}
  r.name=cleanTxt(s.n,16)||'Aventureiro';r.lv=clamp(s.lv|0,1,99);r.cls=CLASSES[s.c]?s.c:'g';r.m=s.m;r.tx=x;r.ty=y;r.d8=clamp(s.d|0,0,7);r.moving=!!s.mv;r.dead=!!s.dd;r.guest=!!p.guest;r.st=!!s.st;r.hp=clamp(+s.hp||0,0,1);r.pt=typeof s.pt==='string'?s.pt.slice(0,40):null;r.pe=PETS[s.pe]?s.pe:null;r.bk=clamp(s.bk|0,0,99999);r.ac=clamp(s.ac|0,0,99);r.ti=ACH.some(a=>a.title===s.ti)?s.ti:null;r.ev=EVO[s.ev]?s.ev:null;r.sg=['coragem','vida','ritmo','concerto'].includes(s.sg)?s.sg:null;if(s.pf&&s.pf.k!==r.pfK){const f0=r.pfK===undefined;r.pfK=s.pf.k;if(!f0)onRemoteParty(r,s.pf)}
  if(s.inv&&s.inv.k!==r.invK){r.invK=s.inv.k;if(state==='play'&&s.inv.to===netMe()&&typeof s.inv.pt==='string'&&s.inv.pt!==party){pendingInv={from:p.peer,name:r.name,pt:s.inv.pt.slice(0,40),t:T};showInv()}}
  if(s.sk&&s.sk.k!==r.skK){const first=r.skK===undefined;r.skK=s.sk.k;const c=String(s.sk.id||'');if(!first&&/^(([gamlh]|cav|ber|cac|bar|arq|sac|som|env)[QERTG]|[gaml][1-5])$/.test(c)&&r.m===M.id){const a=+s.sk.a||0;let tx=+s.sk.tx,ty=+s.sk.ty;if(!isFinite(tx)||Math.hypot(tx-r.tx,ty-r.ty)>12){tx=r.tx;ty=r.ty}remoteSkillFx(r,c,a,tx,ty)}}
  const lk=JSON.stringify(s.k||{});if(lk!==r.lookKey){r.lookKey=lk;r.look=netLook(s.k)||playerLook({eq:{},skin:0,hairC:0,hs:'short',capeC:0});if(SPR_CLASS[r.cls])r.look=Object.assign({},r.look,{sprite:SPR_CLASS[r.cls]})}
  if(s.a&&s.a.k!==r.act){r.act=s.a.k;const an=NET_ANIMS.includes(s.a.an)?s.a.an:'atk';r.atkAnim=an;r.atkT=r.atkDur=.3;const a=+s.a.a||0;
    if(r.m===M.id){if(an==='atk'){const el=r.ev&&EVO[r.ev]?EVO[r.ev].el:CLS_EL[r.cls];fx.push({type:'slash',x:r.x,y:r.y,a,r:1.5,t:0,life:.18,arc:2,col:ELSL[el]});if(el)arcTrail(el,r.x,r.y,a,1.4,1.8)}else if(an==='bow')later(.1,()=>shoot('v',r.x,r.y,a,r.look&&r.look.wt==='crossbow'?21:15,r.look&&r.look.wt==='crossbow'?'quarrel':'arrow',0,{el:r.ev==='bar'?'song':'nature'}));else later(.12,()=>shoot('v',r.x,r.y,a,10.5,r.look&&r.look.holy?'holy':'bolt',0,{}))}}
  {const seen=new Set();r.mobs=r.mobs||new Map();if(Array.isArray(s.mb))for(const q of s.mb.slice(0,8)){if(!Array.isArray(q)||!MOBS[q[1]])continue;const id=String(q[0]);seen.add(id);let g=r.mobs.get(id);const def=MOBS[q[1]];if(!g){g={type:'rmob',def,kind:q[1],x:+q[2],y:+q[3],d8:0,anim:'idle',frame:0,dying:0};r.mobs.set(id,g)}
      g.tx=+q[2];g.ty=+q[3];g.hpF=clamp(+q[4]||0,0,1);g.d8=clamp(q[5]|0,0,7);g.anim=['idle','walk','atk','cast','stun','bow'][q[6]|0]||'idle';g.frame=clamp(q[7]|0,0,7);g.champ=!!q[8];g.m=r.m;g.owner=r.name;g.look=g.champ?Object.assign({},MLOOK[def.look],{scale:(MLOOK[def.look].scale||1)*1.18}):MLOOK[def.look]}
    for(const [id,g] of r.mobs)if(!seen.has(id)){if(g.hpF<=.02&&!g.dying)g.dying=.6;else if(!g.dying)r.mobs.delete(id)}}
  if(s.ch&&s.ch.k!==r.chatK){r.chatK=s.ch.k;const t=cleanTxt(s.ch.t,120),g=s.ch.g;if(t){if(g){if(party&&g===party)log(`[Grupo] ${r.name}: ${t}`,'party')}else{say(r,t,4.5);log(`${r.name}: ${t}`,'friend')}}}}
function netSpec(){const eq={};for(const sl of NET_SLOTS)if(P.eq[sl])eq[sl]=P.eq[sl].id;return{eq,sk:P.skin|0,hc:P.hairC|0,hs:P.hs,cp:P.capeC|0,bd:P.beard?1:0,ev:P.evo||undefined}}
function netChat(t,g){netChatK++;netChatT=cleanTxt(t,120);netChatG=g||null}
function netSkill(id,a,tx,ty){netSkK++;netSk={k:netSkK,id,a:+(+a||0).toFixed(2),tx:+(+tx||0).toFixed(1),ty:+(+ty||0).toFixed(1)}}
function netLeave(){if(NET)NET.presence({n:null,ch:null,a:null,pt:null,inv:null,sk:null}).catch(()=>{});netLast='';party=null;pendingInv=null;netInv=null;hideInv()}
function netTick(dt){
  for(const r of remotes.values()){const dx=r.tx-r.x,dy=r.ty-r.y,dd=Math.hypot(dx,dy);if(dd>5){r.x=r.tx;r.y=r.ty}else{const k=Math.min(1,dt*12);r.x+=dx*k;r.y+=dy*k}
    if(r.mobs)for(const [id,g] of r.mobs){if(g.dying){g.dying-=dt;if(g.dying<=0)r.mobs.delete(id);continue}const gx=g.tx-g.x,gy=g.ty-g.y;if(Math.hypot(gx,gy)>4){g.x=g.tx;g.y=g.ty}else{const k=Math.min(1,dt*10);g.x+=gx*k;g.y+=gy*k}}
    r.animT+=dt;if(r.bub&&(r.bub.t-=dt)<=0)r.bub=null;r.atkT-=dt;if(r.spinT>0)r.spinT-=dt;if(r.buff&&r.buff.war>0)r.buff.war-=dt;
    if(r.atkT>0){r.anim=r.atkAnim;r.frame=clamp(Math.floor((1-r.atkT/r.atkDur)*4),0,3)}else if(r.moving||dd>.05){r.anim='walk';r.frame=Math.floor(r.animT*10)%8}else{r.anim='idle';r.frame=Math.floor(r.animT*2)%2}}
  if(!NET||state!=='play'||!P)return;
  if(P.atkT>netPrevAtk+.01){netAct++;let a=0;try{a=P.aimLock!=null?P.aimLock:aimA()}catch(e){}netA={k:netAct,an:NET_ANIMS.includes(P.atkAnim)?P.atkAnim:'atk',a:+(+a||0).toFixed(2)}}netPrevAtk=P.atkT;
  netT-=dt;if(netT>0)return;netT=.1;
  const o={n:P.name,lv:P.lv,c:P.cls,m:M.id,x:+P.x.toFixed(2),y:+P.y.toFixed(2),d:P.d8|0,mv:P.moving?1:0,dd:P.dead?1:0,k:netSpec()};if(P.pet)o.pe=P.pet.kind;if(P.evo)o.ev=P.evo;if(P.songT>0)o.sg=P.song;if(P.concertT>0)o.sg='concerto';if(netPartyFx)o.pf=netPartyFx;if(P.title)o.ti=P.title;o.bk=PS().bosses;o.ac=Object.keys(P.ach||{}).length;if(netA)o.a=netA;if(netChatK)o.ch=netChatG?{k:netChatK,t:netChatT,g:netChatG}:{k:netChatK,t:netChatT};if(netSk)o.sk=netSk;{const AC={idle:0,walk:1,atk:2,cast:3,stun:4,bow:5};const fm=mobs.filter(m=>m.m===M.id&&!m.dead&&(m.target===P||m.hpShow>0||m.dying)&&m.def.ai!=='dummy'&&Math.hypot(m.x-P.x,m.y-P.y)<14).sort((a,c)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(c.x-P.x,c.y-P.y)).slice(0,6);o.mb=fm.map(m=>[m.id,m.kind,+m.x.toFixed(2),+m.y.toFixed(2),m.dying?0:+(m.hp/m.maxHp).toFixed(2),m.d8|0,AC[m.anim]||0,m.frame|0,m.champ?1:0])}if(P.stealth>0)o.st=1;o.hp=+(P.hp/Math.max(1,D().maxHp)).toFixed(2);if(party)o.pt=party;if(netInv)o.inv=netInv;
  const js=JSON.stringify(o);if(js===netLast)return;netLast=js;NET.presence(o).catch(()=>{})}
function netCount(){let n=0;for(const r of remotes.values())n++;return n}

function netMe(){if(!NET)return null;try{if(NET.me)return NET.me();const me=NET.peers().find(p=>p.sameTab);return me?me.peer:null}catch(e){return null}}
function partyMembers(){const out=[];if(!party)return out;for(const r of remotes.values())if(r.pt===party)out.push(r);return out}
function findRemote(name){const n=name.toLowerCase().trim();if(!n)return null;let best=null;for(const r of remotes.values()){const rn=r.name.toLowerCase();if(rn===n)return r;if(!best&&rn.startsWith(n))best=r}return best}
function showInv(){const w=$('#partyInv');if(!w||!pendingInv)return;$('#piTxt').textContent=`${pendingInv.name} te convidou para o grupo.`;w.hidden=false;sfx('chime');log(`${pendingInv.name} te convidou para o grupo. Clique em Aceitar ou digite /aceitar.`,'party')}
function hideInv(){const w=$('#partyInv');if(w)w.hidden=true}
function acceptInv(){if(!pendingInv)return;party=pendingInv.pt;log(`Você entrou no grupo de ${pendingInv.name}.`,'party');toast('Grupo formado',`Você e ${pendingInv.name} agora caçam juntos`);pendingInv=null;hideInv();netLast=''}
function declineInv(){if(pendingInv)log(`Convite de ${pendingInv.name} recusado.`,'sys');pendingInv=null;hideInv()}
function partyCmd(t){const [cmd,...rest]=t.slice(1).split(/\s+/);const arg=rest.join(' ');const c=(cmd||'').toLowerCase();
  if(['grupo','convidar','party','pt','invite'].includes(c)){if(!NET||netState==='off'){log('Você não está conectado a outros jogadores agora.','sys');return true}if(!arg){log('Use: /grupo NomeDoJogador','sys');return true}
    const r=findRemote(arg);if(!r){log(`Ninguém chamado "${cleanTxt(arg,16)}" online agora.`,'sys');return true}if(party&&r.pt===party){log(`${r.name} já está no seu grupo.`,'sys');return true}
    if(!party)party=netMe()||('g'+Math.random().toString(36).slice(2,9));netInvK++;netInv={to:r.peer,k:netInvK,pt:party};netLast='';log(`Convite enviado para ${r.name}.`,'party');return true}
  if(c==='aceitar'){if(pendingInv)acceptInv();else log('Nenhum convite pendente.','sys');return true}
  if(c==='recusar'){declineInv();return true}
  if(c==='sair'){if(party){party=null;netInv=null;netLast='';log('Você saiu do grupo.','party')}else log('Você não está em um grupo.','sys');return true}
  if(c==='g'){if(!party){log('Você não está em um grupo.','sys');return true}if(arg){log(`[Grupo] ${P.name}: ${arg}`,'party');netChat(arg,party)}return true}
  if(c==='ajuda'||c==='comandos'){log('Comandos: /grupo Nome (convidar) · /aceitar · /recusar · /sair · /g mensagem (chat do grupo)','sys');return true}
  log('Comando desconhecido. Digite /ajuda.','sys');return true}
function partyNear(){let n=0;for(const r of partyMembers())if(r.m===M.id&&!r.dead&&Math.hypot(r.x-P.x,r.y-P.y)<16)n++;return n}
function updPartyBox(){const box=$('#partyBox');if(!box)return;const mem=partyMembers();if(!party){box.hidden=true;return}box.hidden=false;
  const rows=[[P.name,P.lv,className(P),P.hp/Math.max(1,D().maxHp),M.id,true],...mem.map(r=>[r.name,r.lv,CLASSES[r.cls]?CLASSES[r.cls].n:'',r.hp,r.m,false])];
  const key=JSON.stringify(rows.map(x=>[x[0],x[1],x[2],Math.round(x[3]*20),x[4]]));if(box.dataset.k===key)return;box.dataset.k=key;box.textContent='';
  const h=document.createElement('div');h.className='pth';h.textContent=mem.length?`Grupo · ${mem.length+1}`:'Grupo · esperando aceitar';box.appendChild(h);
  for(const [n,lv,cl,hp,map,me] of rows){const row=document.createElement('div');row.className='ptr'+(me?' me':'');const nm=document.createElement('span');nm.className='ptn';nm.textContent=`${n} · ${cl} ${lv}`+(map!==M.id?' (longe)':'');const bar=document.createElement('i');const fill=document.createElement('b');fill.style.width=Math.round(clamp(hp,0,1)*100)+'%';bar.appendChild(fill);row.appendChild(nm);row.appendChild(bar);box.appendChild(row)}
  const tip=document.createElement('div');tip.className='ptt';tip.textContent=mem.length?`Bônus de XP: +${Math.round(partyNear()*15)}% (perto de você)`:'';box.appendChild(tip)}
function remoteSkillFx(r,c,a,tx,ty){const x=r.x,y=r.y,near=Math.hypot(x-P.x,y-P.y)<12;const c0=EVO[c.slice(0,3)]?EVO[c.slice(0,3)].cls:c[0];r.atkAnim=c0==='a'?'bow':(c0==='m'||c0==='h')?'cast':'atk';r.atkT=r.atkDur=.35;if(c.length>2||['gQ','gT','lE','lT'].includes(c)||/^[gaml]\d$/.test(c)){remoteEvoFx(r,c,a,tx,ty);return}
  switch(c){
    case'gQ':fx.push({type:'whirl',x,y,r:2.1,t:0,life:.42});r.spinT=.42;dust(x,y,8);if(near)sfx('whirl');break;
    case'gE':fx.push({type:'ring',x,y,r:1.2,t:0,life:.3,col:'#e8d8b0'});dust(x,y,8);for(let i=1;i<=5;i++)later(i*.045,()=>ghostFx(r,'#ffcc5a'));break;
    case'gR':for(let i=0;i<3;i++)later(i*.12,()=>fx.push({type:'ring',x:r.x,y:r.y,r:2.2+i*.9,t:0,life:.5,col:i===1?'#ff6a3a':'#ffcc5a'}));fx.push({type:'roar',x,y,t:0,life:.6});r.buff={war:8};burstAt(x,y,0xffcc5a,20,100);if(near)sfx('shout');break;
    case'gT':later(.3,()=>{fx.push({type:'slash',x:r.x,y:r.y,a,r:2.7,t:0,life:.3,arc:1.6,heavy:1});const segs=[];for(let k=0;k<5;k++){let ca=a+rnd(-.7,.7),cx=r.x+Math.cos(a)*.5,cy=r.y+Math.sin(a)*.5;const pts=[[cx,cy]];for(let s2=0;s2<6;s2++){ca+=rnd(-.45,.45);cx+=Math.cos(ca)*.45;cy+=Math.sin(ca)*.45;pts.push([cx,cy])}segs.push(pts)}fx.push({type:'crack',segs,t:0,life:1.6});dust(r.x+Math.cos(a)*1.5,r.y+Math.sin(a)*1.5,12);if(near){shake=Math.max(shake,.2);sfx('boom')}});break;
    case'aQ':later(.1,()=>{for(const o of [-.26,0,.26])shoot('v',r.x,r.y,a+o,15,'arrow',0,{})});break;
    case'aE':ghostFx(r);dust(x,y,6);break;
    case'aR':burstAt(x,y,0x8a7a5a,10,40);break;
    case'aT':fx.push({type:'ring',x:tx,y:ty,r:2.2,t:0,life:.5,col:'#ffe08a'});for(let i=0;i<6;i++)later(.3+i*.32,()=>{for(let j=0;j<6;j++){const aa=Math.random()*6.28,rr=Math.random()*2;fx.push({type:'arrowfall',x:tx+Math.cos(aa)*rr,y:ty+Math.sin(aa)*rr,t:0,life:.25})}});break;
    case'mQ':later(.1,()=>shoot('v',r.x,r.y,a,16,'ice',0,{}));if(near)sfx('ice');break;
    case'mE':zap(tx,ty);if(near)sfx('zap');break;
    case'mR':fx.push({type:'ring',x:tx,y:ty,r:2.6,t:0,life:.6,col:'#9ad8ff'});for(let i=0;i<6;i++)later(.55+i*.2,()=>{zap(tx+rnd(-1.8,1.8),ty+rnd(-1.8,1.8));if(near)sfx('zap')});break;
    case'lQ':burstAt(x,y,0x6a4a8a,16,40);burstAt(tx,ty,0x6a4a8a,16,40);break;
    case'lE':for(let i=1;i<=5;i++)later(i*.045,()=>ghostFx(r,'#ff6a84'));break;
    case'lR':burstAt(x,y,0x3a3448,20,30);break;
    case'lT':later(.22,()=>{burstAt(tx,ty,0xe0405e,18,80);fx.push({type:'ring',x:tx,y:ty,r:1.2,t:0,life:.3,col:'#ff6a84'})});break;
    case'hQ':later(.1,()=>shoot('v',r.x,r.y,a,18,'holy',0,{}));break;
    case'hE':burstAt(x,y,0xfff0a0,24,40);fx.push({type:'ring',x,y,r:1.4,t:0,life:.5,col:'#fff0a0'});break;
    case'hR':fx.push({type:'ring',x,y,r:2,t:0,life:.6,col:'#fff0a0'});break;
    case'hT':zones.push({x,y,r:2.4,t:6,tick:0,m:M.id,vis:1});break;
    default:burstAt(x,y,0xffffff,10,50)}}

function remoteMobs(){const out=[];for(const r of remotes.values())if(r.mobs)for(const g of r.mobs.values())out.push(g);return out}
