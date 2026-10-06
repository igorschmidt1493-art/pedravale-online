// ===================== progression extras: refining, pets, world events, professions, achievements =====================
Object.assign(BASES,{
  minerio:{n:'Minério de Ferro',t:'mat',sell:6,ic:['ore',0x8a8a94,0xc8703a],d:'Usado no refino. Encontrado em veios de pedra brilhante.'},
  cristal_bruto:{n:'Cristal Bruto',t:'mat',sell:20,ic:['ore',0x9ae8ff,0xffffff],d:'Achado raro de mineração. Alquimistas adoram.'},
  peixe:{n:'Peixe',t:'mat',sell:5,ic:['fish',0x8ab8d8,0x4a6a8a],d:'Base de poções de vida.'},
  peixe_raro:{n:'Peixe Dourado',t:'mat',sell:30,ic:['fish',0xf0c040,0xa87a1a],d:'Raro. Ingrediente de elixires.'},
  bota_velha:{n:'Bota Velha',t:'mat',sell:1,ic:['boots',0x5a4a3a,0x3a2a1a],d:'Alguém perdeu isto no rio. Faz tempo.'},
  elixir_forca:{n:'Elixir de Força',t:'use',buff:'str',dur:300,ic:['potion',0xd83a3a,0x5a1a1a],d:'+20% de dano por 5 minutos.'},
  elixir_pedra:{n:'Elixir de Pele de Pedra',t:'use',buff:'skin',dur:300,ic:['potion',0x9a9aa6,0x3a3a44],d:'+30 de defesa por 5 minutos.'},
  elixir_sorte:{n:'Elixir da Sorte',t:'use',buff:'luck',dur:300,ic:['potion',0xd8b048,0x6a4a1a],d:'Mais chance de itens raros por 5 minutos.'}
});
// ---------- refining (+1 .. +10) ----------
const REF_RATE=[100,100,95,90,80,65,50,40,30,20];
const refCost=up=>({gold:Math.round(40*Math.pow(up+1,1.6)),ore:Math.ceil((up+1)/2)});
const oreCount=()=>countItem('minerio')+countItem('ferro_velho');
function takeOre(n){const a=Math.min(n,countItem('minerio'));if(a)takeItem('minerio',a);if(n-a>0)takeItem('ferro_velho',n-a)}
function refineMenu(nm){const opts=[];for(const sl of ['arma','escudo','cabeca','peito','pernas','pes','maos']){const it=P.eq[sl];if(!it)continue;const b=BASES[it.id];if(!b.atk&&!b.def)continue;const up=it.up||0;if(up>=10)continue;const c=refCost(up);opts.push({l:`${b.n} +${up} → +${up+1} · ${REF_RATE[up]}% · ${c.gold} ouro · ${c.ore} minério`,f:()=>doRefine(sl,nm)})}
  dlg(nm,`Cada nível de refino dá +7% de ataque ou defesa ao item. A partir do +6, uma falha faz o item cair um nível. Minério sai de veios brilhantes nas rochas (e ferro velho também serve). Você tem ${oreCount()} minério(s) e ${P.gold} ouro.`,[...opts,{l:'Agora não'}])}
function doRefine(sl,nm){const it=P.eq[sl];if(!it)return;const up=it.up||0,c=refCost(up);if(P.gold<c.gold||oreCount()<c.ore){toast('Faltam materiais',`Precisa de ${c.gold} ouro e ${c.ore} minério`);sfx('no');refineMenu(nm);return}
  P.gold-=c.gold;takeOre(c.ore);const b=BASES[it.id];
  if(Math.random()*100<REF_RATE[up]){it.up=up+1;sfx('lvl');burstAt(P.x,P.y,0xffd23a,30,80);toast('Refino bem-sucedido!',`${b.n} +${it.up}`);log(`Refino: ${b.n} agora é +${it.up}.`,'loot','#ffa53a');PS().refine=Math.max(PS().refine,it.up)}
  else{if(up>=6){it.up=up-1;toast('O refino falhou',`${b.n} caiu para +${it.up}`)}else toast('O refino falhou','Os materiais se perderam');sfx('no');shake=Math.max(shake,.2);burstAt(P.x,P.y,0x6a6a74,20,60)}
  P.look=playerLook(P);uiDirty=1;achCheck();save();refineMenu(nm)}
// ---------- pets ----------
const PETS={lobinho:{n:'Lobinho',look:'wolf',price:300},raposa:{n:'Raposinha da Neve',look:'raposa_neve',price:300},kitsune_pet:{n:'Kitsune Mirim',look:'kitsune',price:450},hiena_pet:{n:'Filhote de Hiena',look:'hiena',price:300},sapinho:{n:'Sapinho-Flecha',look:'sapo',price:250},onca_pet:{n:'Oncinha',look:'onca',price:500},tanuki_pet:{n:'Tanuki',look:'tanuki',price:250}};
let pet=null;
const petLook=k=>{const L=MLOOK[PETS[k].look];return Object.assign({},L,{scale:(L.scale||1)*(L.crawler?.75:.58)})};
function petMenu(nm){const opts=Object.entries(PETS).map(([k,p])=>({l:`${p.n} · ${p.price} ouro`,f:()=>{if(P.pet&&P.pet.kind===k){toast('Já é seu',p.n);return}if(P.gold<p.price){toast('Ouro insuficiente',`${p.n} custa ${p.price}`);sfx('no');return}P.gold-=p.price;P.pet={kind:k,name:p.n};pet=null;sfx('chime');toast('Novo mascote!',p.n);log(`${p.n} agora te acompanha. Ele ajuda nas lutas.`,'loot','#ffa53a');PS().pet=1;achCheck();uiDirty=1;save()}}));
  if(P.pet)opts.push({l:`Guardar ${P.pet.name}`,f:()=>{P.pet=null;pet=null;log('Seu mascote foi descansar.','sys');save()}});
  dlg(nm,'Cada mascote te segue por todo canto e morde quem estiver lutando com você. Escolha um amigo:',[...opts,{l:'Agora não'}])}
function updPet(dt){if(!P||!P.pet||state!=='play'){pet=null;return}
  if(!pet||pet.kind!==P.pet.kind)pet={type:'pet',kind:P.pet.kind,name:P.pet.name,x:P.x-.6,y:P.y+.6,d8:0,anim:'idle',frame:0,animT:0,look:petLook(P.pet.kind),atkCD:0,target:null,m:M.id};
  pet.m=M.id;pet.atkCD-=dt;pet.animT+=dt;const t0=pet.target;
  if(!t0||t0.dying||t0.dead||t0.m!==M.id||Math.hypot(t0.x-P.x,t0.y-P.y)>7){pet.target=null;for(const m of mobs)if(m.m===M.id&&!m.dying&&!m.dead&&m.def.ai!=='dummy'&&!m.sleep&&(m.target===P||m.hpShow>0)&&Math.hypot(m.x-P.x,m.y-P.y)<6){pet.target=m;break}}
  let tx,ty;if(pet.target){tx=pet.target.x;ty=pet.target.y}else{const a=(P.lastMove||0)+Math.PI;tx=P.x+Math.cos(a)*.9;ty=P.y+Math.sin(a)*.9}
  if(Math.hypot(P.x-pet.x,P.y-pet.y)>9){pet.x=P.x;pet.y=P.y}
  const dx=tx-pet.x,dy=ty-pet.y,dd=Math.hypot(dx,dy),near=pet.target?.6+pet.target.r:.25;
  if(dd>near){const sp=(pet.target?5.2:Math.min(6.5,1.5+dd*2.4))*dt,st=Math.min(sp,dd-near);pet.x+=dx/dd*st;pet.y+=dy/dd*st;pet.d8=dir8(scrAng(dx,dy));pet.anim='walk';pet.frame=Math.floor(pet.animT*10)%8}
  else{pet.anim=pet.atkCD>1.1?'atk':'idle';pet.frame=pet.anim==='atk'?2:0;if(pet.target&&pet.atkCD<=0){pet.atkCD=1.4;pet.d8=dir8(scrAng(dx,dy));hitMob(pet.target,.15,{quiet:1,pet:1});burstAt(pet.target.x,pet.target.y,0xffffff,4,40)}}}
// ---------- world events ----------
const EV={t:420,cur:null};
const EV_FERAS={world:'lobo_alfa',gelo:'urso_polar',japao:'tengu',deserto:'serpente_areia',selva:'boitata'};
function evAnnounce(title,txt){toast(title,txt);log(`★ ${title}: ${txt}`,'loot','#ffd23a');sfx('roar')}
function startEvent(kind){
  if(kind==='estrelas'){if(!isNight())kind='invasao';else{EV.cur={kind,t:300,title:'Chuva de Estrelas',desc:'+50% de XP de monstros'};evAnnounce('Chuva de Estrelas','Por 5 minutos, todo monstro dá +50% de XP.');return}}
  if(kind==='invasao'){const W=MAPS.world,list=[];for(const k of ['goblin','goblin','goblin','goblin','goblin_arq','goblin_arq','goblin_guer','goblin_xama']){const g=spawnMob(k,W,[33,17,38,25]);g.def=Object.assign({},g.def,{rs:0});g.ev=1;if(P.map==='world')g.target=P;list.push(g)}
    EV.cur={kind,t:300,title:'Invasão Goblin',desc:'Goblins atacam o portão leste de Pedravale',mobs:list,hit:0};evAnnounce('Invasão Goblin!','Goblins estão atacando o portão leste de Pedravale. Defenda a vila!');return}
  if(kind==='fera'){const id=pick(Object.keys(EV_FERAS)),m=MAPS[id];let x,y;for(let i=0;i<200;i++){x=rint(4,m.w-5)+.5;y=rint(4,m.h-5)+.5;if(!m.solid[Math.floor(y)*m.w+Math.floor(x)]&&!safeAt(m,x,y)&&Math.hypot(x-28,y-28)>14)break}
    const g=spawnMob(EV_FERAS[id],m,null,[x,y]);g.def=Object.assign({},g.def,{rs:0,n:g.def.n+' Lendário'});g.maxHp=Math.round(g.maxHp*3);g.hp=g.maxHp;g.atk*=1.3;g.legend=1;g.champ=1;g.look=Object.assign({},g.look,{scale:(g.look.scale||1)*1.3});
    const reg=regionAt(m,x,y);EV.cur={kind,t:480,title:'Fera Lendária',desc:`${g.def.n} em ${m.name} (${reg.n})`,mob:g,map:id};evAnnounce('Fera Lendária!',`${g.def.n} apareceu em ${m.name}, perto de ${reg.n}. Ela aparece em dourado no minimapa.`)}}
function endEvent(win){const e=EV.cur;EV.cur=null;if(!e)return;
  if(e.kind==='invasao'){for(const g of e.mobs)if(!g.dying&&!g.dead)g.dying=.5;if(win&&e.hit>0){gainExp(450,1);P.gold+=220;const pool=DROP_POOL.filter(id=>BASES[id].lv<=P.lv+2);loots.push({item:makeItem(pick(pool),Math.max(1,rollRar(2))),x:P.x,y:P.y,m:M.id,t:180,age:0});evAnnounce('Vila defendida!','+450 XP, +220 ouro e um equipamento.');PS().events++;achCheck()}else if(!win)log('A invasão acabou. Os goblins recuaram.','sys')}
  if(e.kind==='fera'){if(win){gainExp(600,1);const rare=Object.keys(BASES).filter(id=>BASES[id].dropOnly&&BASES[id].lv<=P.lv+4);if(rare.length){const id=pick(rare);loots.push({item:makeItem(id,BASES[id].u?0:2),x:P.x,y:P.y,m:M.id,t:180,age:0})}evAnnounce('Lenda derrotada!','+600 XP e um item raro.');PS().legends++;PS().events++;achCheck()}else if(e.mob&&!e.mob.dying&&!e.mob.dead){e.mob.dying=.6;log('A fera lendária sumiu na névoa.','sys')}}
  if(e.kind==='estrelas')log('A chuva de estrelas terminou.','sys')}
function updEvents(dt){if(state!=='play'||!P)return;EV.t-=dt;const e=EV.cur;
  if(e){e.t-=dt;if(e.kind==='invasao'){if(e.mobs.every(g=>g.dying||g.dead))endEvent(true);else if(e.t<=0)endEvent(false)}else if(e.kind==='fera'){if(e.mob.dead||e.mob.dying)endEvent(e.mob.killedByP);else if(e.t<=0)endEvent(false)}else if(e.t<=0)endEvent(true)}
  else if(EV.t<=0){EV.t=rnd(600,900);startEvent(pick(['invasao','fera','fera','estrelas']))}}
const evXp=()=>EV.cur&&EV.cur.kind==='estrelas'?1.5:1;
// ---------- professions: mining, fishing, alchemy ----------
function PROF(){return P.prof||(P.prof={min:0,pes:0,alq:0})}
const profLv=xp=>1+Math.floor(Math.sqrt(xp/6));
function addMineNodes(m,n,ART,R){let k=0;for(let i=0;i<600&&k<n;i++){const x=1+Math.floor(R()*(m.w-2)),y=1+Math.floor(R()*(m.h-2));if(m.solid[y*m.w+x]||m.safeR&&x>=m.safeR[0]-1&&x<m.safeR[2]+1&&y>=m.safeR[1]-1&&y<m.safeR[3]+1)continue;const t=tAt(m,x,y);if(t===WATER||t===VOID||t===BRIDGE)continue;if(m.id==='world'&&x>=11&&x<=31&&y>=11&&y<=31)continue;if(m.objs.some(o=>Math.abs(o.x-x-.5)<1.5&&Math.abs(o.y-y-.5)<1.5))continue;if(m.acts.some(a=>Math.abs(a.x-x)<3&&Math.abs(a.y-y)<3))continue;
  const o=prop(m,x,y,ART.oreNode);m.acts.push({kind:'mine',x:x+.5,y:y+.9,obj:o,t:0,label:'Minerar veio'});k++}}
function mineNode(a){if(a.t>0)return;P.atkAnim='atk';P.atkDur=P.atkT=.4;sfx('block');for(let i=0;i<3;i++)later(i*.13,()=>burstAt(a.x,a.y-.3,0xffd890,6,60));
  later(.4,()=>{const lv=profLv(PROF().min),n=1+(Math.random()<.25+lv*.04?1:0);const it=makeItem('minerio',0);it.n=n;if(!addItem(it))loots.push({item:it,x:a.x,y:a.y,m:M.id,t:120,age:0});let msg=`+${n} Minério de Ferro`;if(Math.random()<.06+lv*.01){const c=makeItem('cristal_bruto',0);if(!addItem(c))loots.push({item:c,x:a.x,y:a.y,m:M.id,t:120,age:0});msg+=' e um Cristal Bruto!'}
    addText(P,msg,'#ffd890');a.t=80;a.obj.cv=ART.oreDone.cv;PROF().min+=1;PS().ore++;if(profLv(PROF().min)>lv)toast('Mineração',`Nível ${profLv(PROF().min)}`);achCheck();uiDirty=1})}
function tickNodes(dt){for(const a of M.acts)if(a.kind==='mine'){if(a.t>0){a.t-=dt;if(a.t<=0)a.obj.cv=ART.oreNode.cv}else if(Math.random()<dt*2.2&&Math.abs(a.x-P.x)+Math.abs(a.y-P.y)<16){const [wx,wy]=wpx(a.x,a.y-.4);fx.push({type:'px',x:wx+rnd(-9,9),y:wy-rnd(4,16),vx:0,vy:-6,g:0,t:0,life:.5,col:pick(['#fff8d0','#ffd86a','#ffb04a']),glow:1,sz:2})}}}
function updEvTick(){if(EV.cur){EV._u=(EV._u||0)+1;if(EV._u%30===0)uiDirty=1}}
function waterSpot(){for(const r of [1,1.4,1.9])for(let i=0;i<12;i++){const ang=i/12*6.283,x=P.x+Math.cos(ang)*r,y=P.y+Math.sin(ang)*r;if(tAt(M,x,y)===WATER)return[x,y]}return null}
function startFish(w){P.fish={x:w[0],y:w[1],t:rnd(2.2,5.5),bite:0,win:0};P.d8=dir8(scrAng(w[0]-P.x,w[1]-P.y));sfx('swing');log('Você lança a linha... aperte F quando o peixe morder.','sys')}
function updFish(dt){const f=P.fish;if(!f)return;if(P.moving||P.dead||P.atkT>0){P.fish=null;return}f.t-=dt;if(!f.bite&&f.t<=0){f.bite=1;f.win=.95;addText(P,'!','#ffd23a',1);sfx('chime')}else if(f.bite){f.win-=dt;if(f.win<=0){P.fish=null;addText(P,'Escapou...','#cfc6b8')}}}
function reelFish(){const f=P.fish;P.fish=null;if(!f.bite){addText(P,'Cedo demais','#cfc6b8');return}const lv=profLv(PROF().pes),r=Math.random();let id='peixe',n=1;
  if(r<.05)id='bota_velha';else if(r<.12+lv*.01){const g=rint(20,80)+lv*5;P.gold+=g;addText(P,`Tesouro! +${g} ouro`,'#ffd23a',1);sfx('coin');PROF().pes+=2;PS().fish++;achCheck();return}else if(r<.27+lv*.02)id='peixe_raro';
  const it=makeItem(id,0);it.n=n;if(!addItem(it))loots.push({item:it,x:P.x,y:P.y,m:M.id,t:120,age:0});addText(P,`+${BASES[id].n}`,id==='peixe_raro'?'#ffd23a':'#bfe8ff',id==='peixe_raro');burstAt(f.x,f.y,0xbfe8ff,10,50);sfx('pick');PROF().pes+=1;PS().fish++;if(profLv(PROF().pes)>lv)toast('Pesca',`Nível ${profLv(PROF().pes)}`);achCheck();uiDirty=1}
const RECIPES=[
  {n:'2× Poção de Vida Média',out:['pot_hp2',2],ing:[[['peixe','peixe_raro'],2]],gold:20},
  {n:'2× Poção de Mana',out:['pot_mp',2],ing:[[['peixe','peixe_raro'],1],[['cristal_gelo','po_sol','cauda_kitsune','seiva','cristal_bruto','veneno_sapo'],1]],gold:20},
  {n:'Elixir de Força',out:['elixir_forca',1],ing:[[['presa','ferrao','chifre_oni','couro','pele_neve'],3],[['peixe_raro'],1]],gold:60},
  {n:'Elixir de Pele de Pedra',out:['elixir_pedra',1],ing:[[['minerio','ferro_velho'],3],[['escama_jacare','escama_areia','pele_neve','couro','escama_fogo'],2]],gold:60},
  {n:'Elixir da Sorte',out:['elixir_sorte',1],ing:[[['peixe_raro'],1],[['cristal_bruto','escama_fogo','po_sol','cauda_kitsune'],1]],gold:100}];
const ingHave=([ids,n])=>ids.reduce((s,id)=>s+countItem(id),0)>=n;
function ingTake([ids,n]){for(const id of ids){const k=Math.min(n,countItem(id));if(k){takeItem(id,k);n-=k}if(n<=0)break}}
function alchemyMenu(nm){const opts=RECIPES.map(r=>{const ok=r.ing.every(ingHave)&&P.gold>=r.gold;const need=r.ing.map(([ids,n])=>`${n}× ${ids.map(i=>BASES[i].n).slice(0,2).join(' ou ')}${ids.length>2?'...':''}`).join(' + ');return{l:`${ok?'✔':'✗'} ${r.n} — ${need} + ${r.gold} ouro`,pri:ok?1:0,f:()=>{if(!ok){toast('Faltam ingredientes',need);sfx('no');alchemyMenu(nm);return}P.gold-=r.gold;r.ing.forEach(ingTake);const it=makeItem(r.out[0],0);it.n=r.out[1];if(!addItem(it))loots.push({item:it,x:P.x,y:P.y,m:M.id,t:120,age:0});sfx('drink');burstAt(P.x,P.y,0x9ae85a,20,50);toast('Alquimia',r.n);PROF().alq+=1;PS().alq++;achCheck();uiDirty=1;alchemyMenu(nm)}}});
  dlg(nm,`Alquimia (nível ${profLv(PROF().alq)}): misturo o que você trouxer. Peixe vem da pesca (F perto da água), minério dos veios brilhantes nas rochas.`,[...opts,{l:'Agora não'}])}
// ---------- achievements, titles and online ranking ----------
function PS(){return P.stats||(P.stats={kills:0,bosses:0,champs:0,elites:0,cities:[],fish:0,ore:0,alq:0,refine:0,events:0,legends:0,quests:0,secret:0,pet:0})}
const ACH=[
  {id:'k1',n:'Primeiro Sangue',d:'Derrote um monstro',f:s=>s.kills>=1},
  {id:'k100',n:'Caçador',d:'Derrote 100 monstros',f:s=>s.kills>=100,title:'Caçador'},
  {id:'k1000',n:'Exterminador',d:'Derrote 1000 monstros',f:s=>s.kills>=1000,title:'Exterminador'},
  {id:'boss1',n:'Matador de Chefes',d:'Derrote um chefe',f:s=>s.bosses>=1},
  {id:'boss10',n:'Lenda das Masmorras',d:'Derrote 10 chefes',f:s=>s.bosses>=10,title:'Lenda das Masmorras'},
  {id:'champ10',n:'Campeão dos Campeões',d:'Derrote 10 campeões ou elites',f:s=>s.champs+s.elites>=10,title:'Campeão'},
  {id:'cities',n:'Viajante',d:'Visite as 5 cidades',f:s=>s.cities.length>=5,title:'Viajante'},
  {id:'lv10',n:'Aventureiro',d:'Chegue ao nível 10',f:()=>P.lv>=10},
  {id:'lv20',n:'Veterano',d:'Chegue ao nível 20',f:()=>P.lv>=20,title:'Veterano'},
  {id:'ref7',n:'Mão de Ferreiro',d:'Refine um item a +7',f:s=>s.refine>=7},
  {id:'ref10',n:'Mestre Forjador',d:'Refine um item a +10',f:s=>s.refine>=10,title:'Mestre Forjador'},
  {id:'pet',n:'Melhor Amigo',d:'Adote um mascote',f:s=>s.pet>0},
  {id:'fish10',n:'Pescador',d:'Pesque 10 vezes',f:s=>s.fish>=10},
  {id:'fish50',n:'Rei do Anzol',d:'Pesque 50 vezes',f:s=>s.fish>=50,title:'Rei do Anzol'},
  {id:'ore50',n:'Minerador',d:'Minere 50 veios',f:s=>s.ore>=50,title:'Minerador'},
  {id:'alq5',n:'Alquimista',d:'Crie 5 receitas',f:s=>s.alq>=5,title:'Alquimista'},
  {id:'event1',n:'Defensor',d:'Vença um evento de mundo',f:s=>s.events>=1,title:'Defensor'},
  {id:'legend1',n:'Caçador de Lendas',d:'Derrote uma fera lendária',f:s=>s.legends>=1,title:'Caçador de Lendas'},
  {id:'quest10',n:'Herói do Povo',d:'Conclua 10 missões das regiões',f:s=>s.quests>=10,title:'Herói do Povo'},
  {id:'secret',n:'Segredos Antigos',d:'Derrote um chefe de dungeon secreta',f:s=>s.secret>=1,title:'Guardião de Segredos'}];
function achCheck(){if(!P)return;P.ach=P.ach||{};const s=PS();for(const a of ACH)if(!P.ach[a.id]&&a.f(s)){P.ach[a.id]=1;toast('Conquista desbloqueada!',a.n+(a.title?` · título "${a.title}"`:''));log(`🏆 Conquista: ${a.n}${a.title?` (título "${a.title}" liberado)`:''}`,'loot','#ffd23a');sfx('victory');uiDirty=1}}
function onKillStats(m){const s=PS();s.kills++;treeOnKill();if(m.def.boss&&P.q.evo===1){P.q.evo=2;toast('A Prova do Mestre','Volte ao Mestre Varek em Pedravale para escolher seu caminho');uiDirty=1}if(m.def.boss){s.bosses++;if(m.kind==='mamute'||m.kind==='kyubi')s.secret++}if(m.champ)s.champs++;if(m.def.elite)s.elites++;if(m.legend)m.killedByP=1;if(m.ev&&EV.cur&&EV.cur.kind==='invasao')EV.cur.hit++;achCheck()}
function onMapStats(id){const m=MAPS[id];if(!P||!m)return;markSeen(id);const c=id==='world'?'world':m.city?id:null;if(c){const s=PS();if(!s.cities.includes(c)){s.cities.push(c);achCheck()}}}
function renderAch(tab){const body=$('#achBody');if(!body)return;body.textContent='';const tabs=document.createElement('div');tabs.className='achtabs';for(const [k,n] of [['ach','Conquistas'],['tit','Títulos'],['prof','Profissões'],['rank','Ranking online']]){const b=document.createElement('button');b.type='button';b.className='btn'+(tab===k?' pri':'');b.textContent=n;b.onclick=()=>renderAch(k);tabs.appendChild(b)}body.appendChild(tabs);
  const box=document.createElement('div');box.className='achlist';body.appendChild(box);P.ach=P.ach||{};
  const row=(l,r,done)=>{const d=document.createElement('div');d.className='achrow'+(done?' done':'');const a=document.createElement('b');a.textContent=l;const c=document.createElement('span');c.textContent=r;d.appendChild(a);d.appendChild(c);box.appendChild(d);return d};
  if(tab==='ach'){const n=ACH.filter(a=>P.ach[a.id]).length;row(`${n}/${ACH.length} conquistas`,'',0);for(const a of ACH)row(`${P.ach[a.id]?'🏆':'○'} ${a.n}`,a.d+(a.title?` · título: ${a.title}`:''),P.ach[a.id])}
  else if(tab==='tit'){const ts=ACH.filter(a=>a.title&&P.ach[a.id]);if(!ts.length)row('Nenhum título ainda','Conquistas com título liberam nomes especiais.',0);const none=row('Sem título','Clique para remover o título',!P.title);none.onclick=()=>{P.title=null;renderAch('tit');save()};for(const a of ts){const d=row(`«${a.title}»`,P.title===a.title?'Em uso':'Clique para usar',P.title===a.title);d.onclick=()=>{P.title=a.title;renderAch('tit');save()}}}
  else if(tab==='prof'){const p=PROF();for(const [k,n,d] of [['min','Mineração','Veios brilhantes nas rochas (F para minerar)'],['pes','Pesca','F perto da água; aperte F de novo quando aparecer "!"'],['alq','Alquimia','Fale com as curandeiras e escolha Alquimia']])row(`${n} · nível ${profLv(p[k])}`,`${p[k]} pontos · ${d}`,0)}
  else{const list=[{n:P.name+' (você)',lv:P.lv,bk:PS().bosses,ac:Object.keys(P.ach).length},...[...remotes.values()].map(r=>({n:r.name,lv:r.lv,bk:r.bk||0,ac:r.ac||0}))].sort((a,b)=>b.lv-a.lv||b.bk-a.bk||b.ac-a.ac);list.forEach((e,i)=>row(`${i+1}º ${e.n}`,`Nível ${e.lv} · ${e.bk} chefes · ${e.ac} conquistas`,i===0));if(list.length===1)row('Só você online agora','Quando amigos entrarem, eles aparecem aqui.',0)}}
function toggleAch(){const w=$('#achWin');if(!w)return;if(w.hidden){renderAch('ach');showWin('#achWin')}else hideWin('#achWin')}
function featuresTick(dt){classTick(dt);warpTick(dt);updEvTick();updPet(dt);updEvents(dt);updFish(dt);tickNodes(dt)}
// ---------- hooks: art, world setup, input, render ----------
function propOre(lit){const pb=new PB(40,34),cx=20,base=29;pb.ell(cx,base-9,15,10,(nx,ny)=>tone(lit?0x7a7480:0x5a5660,.12-(nx*.25+ny*.35)+((((nx+1)*6|0)+((ny+1)*5|0))&1?.05:-.03)));pb.ell(cx+8,base-5,7,5,(nx,ny)=>tone(lit?0x6a6470:0x4e4a54,.1-(nx*.2+ny*.3)));pb.ell(cx-9,base-4,6,4,(nx,ny)=>tone(0x605a66,.08-(nx*.2+ny*.3)));
  if(lit){const R=mulberry(77);for(let i=0;i<9;i++){const x=cx-10+Math.floor(R()*20),y=base-16+Math.floor(R()*11),c=i%3===0?0xffe9a0:i%3===1?0xe8903a:0xc8703a;pb.set(x,y,c);pb.set(x+1,y,tone(c,-.15));if(i%3===0)pb.set(x,y-1,0xfff8e0)}}
  pb.outline(0x1a1820);return{cv:pb.canvas(),ox:cx,oy:base,r:9}}
function buildArtFeat(A){A.oreNode=propOre(1);A.oreDone=propOre(0)}
function freeSpot(m,x0,y0,taken){for(let r=0;r<8;r+=.5)for(let i=0;i<16;i++){const a=i/16*6.283,x=x0+Math.cos(a)*r,y=y0+Math.sin(a)*r,tx=Math.floor(x),ty=Math.floor(y);if(!inb(m,tx,ty)||m.solid[ty*m.w+tx])continue;let ok=true;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(m.solid[(ty+dy)*m.w+tx+dx])ok=false;if(!ok)continue;if(taken.some(n=>Math.hypot(n.x-x,n.y-y)<1.6))continue;return[tx+.5,ty+.5]}return[x0,y0]}
const PETMAN={skin:0,hair:0x5a3a22,hs:'short',chest:0x5a6a3a,ct:'leather',legs:0x4a3a2a,boots:0x3a2a1a,hd:'hood',hdCol:0x4a5a2a,cape:0x6a4a2a};
const REFMAN={skin:2,hair:0x2a1e18,hs:'bald',beard:1,chest:0x6a4a3a,ct:'apron',legs:0x3a2a22,boots:0x2a1e14,gloves:0x3a2418,wt:'mace',wcol:0x9a9aa8};
function addFeatureWorld(ART){const look=(L,o)=>Object.assign({},L,{skin:SKINS[L.skin]},o||{});
  const W=MAPS.world;{const [x,y]=freeSpot(W,20.5,26.5,W.npcDefs);W.npcDefs.push({id:'pets_ped',n:'Dona Matilde, a Tratadora',x,y,look:look(PETMAN,{hair:0xc8c0b0,hs:'long'}),role:'pets'})}
  for(const c of CITIES){if(c.map==='world')continue;const m=MAPS[c.map];if(!m)continue;const sh=m.npcDefs.find(n=>n.role==='rshop'),base=sh?sh.look:{};
    const [x1,y1]=freeSpot(m,29.5,22.8,m.npcDefs);m.npcDefs.push({id:m.id+'_ferreiro',n:'Mestre do Refino',x:x1,y:y1,look:Object.assign(look(REFMAN),{skin:base.skin||SKINS[2],hd:base.hd,hdCol:base.hdCol}),role:'refine'});
    const [x2,y2]=freeSpot(m,23.2,30.2,m.npcDefs);m.npcDefs.push({id:m.id+'_tratador',n:'Tratador de Mascotes',x:x2,y:y2,look:Object.assign(look(PETMAN),{skin:base.skin||SKINS[1],hd:base.hd||'hood',hdCol:base.hdCol||0x4a5a2a,chest:base.chest||0x5a6a3a}),role:'pets'})}
  let s=901;for(const id in MAPS){const m=MAPS[id];if(id==='santuario'||id==='cripta')continue;addMineNodes(m,id==='world'||CITIES.some(c=>c.map===id)?11:4,ART,mulberry(s++))}}
function fKey(){if(!P||P.dead)return;if(P.fish){reelFish();return}const it=nearestInteract();if(it){interact(it);return}const w=waterSpot();if(w&&!M.indoor){startFish(w);return}}
function drawFishLine(b){const f=P.fish;const [hx,hy]=wpx(P.x,P.y),[fx2,fy2]=wpx(f.x,f.y);const x0=hx-sx0,y0=hy-sy0-30,x1=fx2-sx0,y1=fy2-sy0+(f.bite?Math.sin(T*30)*2+2:Math.sin(T*3)*1);b.strokeStyle='rgba(240,240,230,.75)';b.lineWidth=1;b.beginPath();b.moveTo(x0,y0);b.quadraticCurveTo((x0+x1)/2,Math.min(y0,y1)-10,x1,y1);b.stroke();b.fillStyle='#e8402a';b.fillRect(Math.round(x1)-1,Math.round(y1)-2,3,2);b.fillStyle='#fff';b.fillRect(Math.round(x1)-1,Math.round(y1),3,1);
  if(Math.random()<(f.bite?.5:.04))fx.push({type:'px',x:fx2+rnd(-4,4),y:fy2,vx:rnd(-12,12),vy:rnd(-30,-10),t:0,life:.4,col:'#cfeaff',g:80})}
const rPets=new Map();
function remotePets(){const out=[];for(const r of remotes.values()){if(!r.pe||!r.look){rPets.delete(r);continue}let q=rPets.get(r);if(!q||q.kind!==r.pe){q={type:'pet',kind:r.pe,x:r.x-.6,y:r.y+.6,d8:0,anim:'idle',frame:0,look:petLook(r.pe),m:r.m};rPets.set(r,q)}q.m=r.m;const tx=r.x-.7,ty=r.y+.5,dx=tx-q.x,dy=ty-q.y,d=Math.hypot(dx,dy);if(d>8){q.x=tx;q.y=ty}else if(d>.3){const st=Math.min(d-.3,.08+d*.06);q.x+=dx/d*st;q.y+=dy/d*st;q.d8=dir8(scrAng(dx,dy));q.anim='walk';q.frame=Math.floor(T*10)%8}else{q.anim='idle';q.frame=0}out.push(q)}return out}
function refGlow(L){const w=P.eq&&P.eq.arma;if(!w||(w.up||0)<7)return;const [wx,wy]=wpx(P.x,P.y);L.push([wx-sx0,wy-sy0-22,40+(w.up-7)*8,0,.18+(w.up-7)*.04,1]);if(Math.random()<.12+(w.up-7)*.05)fx.push({type:'px',x:wx+rnd(-10,10),y:wy-rnd(14,34),vx:rnd(-6,6),vy:rnd(-24,-8),t:0,life:.6,col:w.up>=10?'#ff7a3a':w.up>=9?'#c8a0ff':'#ffe08a',g:-10,glow:1})}
// ---------- mobile buttons with skill icons and cooldowns ----------
const bestPot=()=>{const d=D();if(P.hp/d.maxHp<.999||P.mp/d.maxMp>.3){for(const id of ['pot_hp2','pot_hp1'])if(countItem(id))return id}return countItem('pot_mp')?'pot_mp':'pot_hp1'};
let touchSet='';
function updTouch(){if(!input.touch||!P)return;const code=barSig();const bts=document.querySelectorAll('#touch .sk');
  if(touchSet!==code){touchSet=code;for(const bt of bts){const a=bt.dataset.a,ic=a==='pot'?null:SKICON[setCode(P)+a];if(ic)bt.style.backgroundImage=`url(${ic})`}}
  for(const bt of bts){const a=bt.dataset.a,cd=bt.querySelector('.cd');if(a==='dash'){cd.style.height=(P.cds.dash/CFG.dashCD*100)+'%';continue}
    if(a==='pot'){const id=bestPot();bt.style.backgroundImage=`url(${iconURL(id)})`;bt.querySelector('.pn').textContent=countItem(id);cd.style.height=(P.cds.pot/CFG.potCD*100)+'%';continue}
    const s=skillSet(P)[a];if(!s){bt.classList.add('lock');bt.hidden=a==='G';continue}bt.hidden=false;const locked=P.lv<s.lv;bt.classList.toggle('lock',locked);bt.classList.toggle('nomana',!locked&&P.mp<s.mp);cd.style.height=(P.cds[a]/(s.cd*CFG.skillCD)*100)+'%';bt.querySelector('b').textContent=locked?'Nv'+s.lv:a}}
