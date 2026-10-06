// ===================== input, audio, save, boot =====================
addEventListener('resize',resize);
addEventListener('keydown',e=>{initAudio();if(state!=='play')return;const tg=e.target;if(tg&&tg.tagName==='INPUT'){if(e.key==='Escape')tg.blur();return}const k=e.key.toLowerCase();if(e.repeat&&!'wasd'.includes(k)&&!k.startsWith('arrow'))return;input.keys[k]=true;
  if(k===' '||k==='shift'){doDash();e.preventDefault()}else if('qertgzx'.includes(k)&&k.length===1)useSkill(k.toUpperCase());else if(k>='1'&&k<='4')usePotion(['pot_hp1','pot_hp2','pot_mp','scroll'][+k-1]);else if(k==='f')fKey();else if(k==='k')toggleAch();else if(k==='m')toggleWorldMap();else if(k==='n')toggleTree();
  else if(k==='i')toggleWin('#invWin',()=>uiDirty=1);else if(k==='c')toggleWin('#charWin',()=>uiDirty=1);else if(k==='j')toggleWin('#questWin',()=>uiDirty=1);else if(k==='h')toggleWin('#helpWin');else if(k==='p'){CFG.pixelFinish=(CFG.pixelFinish+1)%3;toast('Acabamento pixel',['desligado','suave','completo'][CFG.pixelFinish]);try{localStorage.setItem('pedravale-pix',CFG.pixelFinish)}catch(e){}}else if(k==='enter'){$('#chatin').focus();e.preventDefault()}
  else if(k==='escape'){for(const w of document.querySelectorAll('.win.modal'))if(w.id!=='death')hideWin('#'+w.id);hideTip()}else if(k==='+'||k==='=')setZoom(1);else if(k==='-')setZoom(-1);if(k.startsWith('arrow'))e.preventDefault()});
addEventListener('keyup',e=>{input.keys[e.key.toLowerCase()]=false});addEventListener('blur',()=>{input.keys={};input.mdown=false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{initAudio();if(e.pointerType==='touch'){enableTouch();return}if(state!=='play'||!P||P.dead||e.button!==0)return;if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();input.mx=e.clientX;input.my=e.clientY;
  const bx=e.clientX*DPR/K,by=e.clientY*DPR/K;for(const n of npcs)if(n.m===M.id&&!n.hidden&&n._bb&&bx>=n._bb[0]&&bx<=n._bb[0]+n._bb[2]&&by>=n._bb[1]&&by<=n._bb[1]+n._bb[3]){if(dist(n,P)<2.4){talk(n);return}}input.mdown=true});
addEventListener('pointerup',e=>{if(e.pointerType!=='touch')input.mdown=false});
addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;input.mx=e.clientX;input.my=e.clientY;if(state!=='play'||e.target!==cv){hoverMob=null;return}const bx=e.clientX*DPR/K,by=e.clientY*DPR/K;let best=null;for(const m of mobs){if(m.m!==M.id||m.dying||!m._bb)continue;const q=m._bb;if(bx>=q[0]&&bx<=q[0]+q[2]&&by>=q[1]&&by<=q[1]+q[3])best=m}hoverMob=best;let npc=false;for(const n of npcs)if(n.m===M.id&&!n.hidden&&n._bb&&bx>=n._bb[0]&&bx<=n._bb[0]+n._bb[2]&&by>=n._bb[1]&&by<=n._bb[1]+n._bb[3])npc=true;cv.className=npc?'talk':''});
cv.addEventListener('wheel',e=>{e.preventDefault();setZoom(e.deltaY<0?1:-1)},{passive:false});
// touch controls
function enableTouch(){if(input.touch)return;input.touch=true;$('#touch').hidden=false;document.body.classList.add('touch')}
(()=>{const area=$('#joy'),knob=$('#joyK');let id=null,ox=0,oy=0;area.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();id=e.pointerId;const r=area.getBoundingClientRect();ox=r.left+r.width/2;oy=r.top+r.height/2;area.setPointerCapture(id);mv(e)});
  const mv=e=>{if(e.pointerId!==id)return;let dx=e.clientX-ox,dy=e.clientY-oy;const l=Math.hypot(dx,dy),R=48;if(l>R){dx=dx/l*R;dy=dy/l*R}knob.style.transform=`translate(${dx}px,${dy}px)`;input.joy=l<8?null:[dx/R,dy/R]};
  area.addEventListener('pointermove',mv);const up=e=>{if(e.pointerId!==id)return;id=null;input.joy=null;knob.style.transform=''};area.addEventListener('pointerup',up);area.addEventListener('pointercancel',up);
  for(const bt of document.querySelectorAll('#touch [data-a]'))bt.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();const a=bt.dataset.a;if(a==='atk'){input.mdown=true;const u=()=>{input.mdown=false;bt.removeEventListener('pointerup',u);bt.removeEventListener('pointercancel',u)};bt.addEventListener('pointerup',u);bt.addEventListener('pointercancel',u)}else if(a==='dash')doDash();else if(a==='f')fKey();else if(a==='pot')usePotion(bestPot());else if(a==='chat'){document.body.classList.toggle('chaton');if(document.body.classList.contains('chaton'))$('#chatin').focus()}else if(a==='ach')toggleAch();else if(a==='i')toggleWin('#invWin',()=>uiDirty=1);else useSkill(a)})})();
$('#zIn').onclick=()=>setZoom(1);$('#zOut').onclick=()=>setZoom(-1);
$('#bInv').onclick=()=>toggleWin('#invWin',()=>uiDirty=1);$('#bChar').onclick=()=>toggleWin('#charWin',()=>uiDirty=1);$('#bQuest').onclick=()=>toggleWin('#questWin',()=>uiDirty=1);$('#bAch').onclick=toggleAch;$('#bWorld').onclick=toggleWorldMap;$('#bTree').onclick=toggleTree;$('#bHelp').onclick=()=>toggleWin('#helpWin');
$('#bSnd').onclick=()=>{initAudio();toggleWin('#sndWin')};$('#bMenu').onclick=toMenu;$('#piYes').onclick=acceptInv;$('#piNo').onclick=declineInv;$('#bRevive').onclick=revive;
// draggable windows (desktop)
document.querySelectorAll('.win.modal .tb').forEach(tb=>tb.addEventListener('pointerdown',e=>{if(e.target.closest('button')||innerWidth<760)return;const w=tb.parentElement,r=w.getBoundingClientRect(),ox=e.clientX-r.left,oy=e.clientY-r.top;w.style.transform='none';w.style.left=r.left+'px';w.style.top=r.top+'px';w.style.right='auto';
  const mv=ev=>{w.style.left=clamp(ev.clientX-ox,0,innerWidth-80)+'px';w.style.top=clamp(ev.clientY-oy,0,innerHeight-40)+'px'};const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)}));
// ---------- audio ----------
let AC=null,soundOn=true,BUS=null;function initAudio(){if(AC){if(AC.state==='suspended')AC.resume();return}try{AC=new(window.AudioContext||window.webkitAudioContext)();setupAudio()}catch(e){}}
function beep(f,d,type,vol,slide,delay=0){if(!soundOn||!AC)return;try{const t0=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t0+d);g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g).connect(BUS?BUS.sfx:AC.destination);o.start(t0);o.stop(t0+d+.03)}catch(e){}}
function noise(d,vol,f=800,delay=0){if(!soundOn||!AC)return;try{const t0=AC.currentTime+delay,len=Math.floor(AC.sampleRate*d),bf=AC.createBuffer(1,len,AC.sampleRate),da=bf.getChannelData(0);for(let i=0;i<len;i++)da[i]=(Math.random()*2-1)*(1-i/len);const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();fl.type='lowpass';fl.frequency.value=f;s.buffer=bf;g.gain.value=vol;s.connect(fl).connect(g).connect(BUS?BUS.sfx:AC.destination);s.start(t0)}catch(e){}}
function sfx(k){switch(k){case'hit':beep(120,.09,'sine',.32,-70);beep(240,.05,'square',.07,-140);noise(.06,.3,2600);noise(.03,.18,6000,.005);break;case'crit':beep(95,.14,'sine',.42,-50);beep(420,.08,'square',.1,-260);noise(.1,.38,3200);beep(1250,.16,'triangle',.09,-500,.02);beep(1880,.1,'triangle',.05,-700,.03);break;case'hitb':beep(80,.12,'sine',.38,-40);noise(.08,.32,900);beep(160,.06,'square',.06,-80);break;case'hita':noise(.04,.26,4200);beep(320,.04,'triangle',.08,-200);beep(110,.06,'sine',.2,-50);break;case'hitm':beep(660,.08,'sine',.12,-300);noise(.05,.2,5000);beep(140,.07,'sine',.22,-60);break;case'swing':noise(.09,.04,2600);break;case'bow':beep(520,.06,'triangle',.03,-300);break;case'bolt':beep(700,.12,'sine',.03,-400);break;case'fire':noise(.25,.06,900);beep(200,.2,'sawtooth',.02,-80);break;case'ice':beep(1200,.2,'triangle',.025,-600);noise(.2,.04,4000);break;case'blink':beep(900,.15,'sine',.03,600);break;case'cast':beep(300,.4,'sine',.03,300);break;case'rain':noise(.08,.03,3000);break;case'trap':beep(260,.05,'square',.03,-100);break;
  case'hurt':beep(120,.12,'sawtooth',.04,-50);break;case'block':beep(900,.05,'square',.03,-300);noise(.04,.05,5000);break;case'boom':noise(.4,.12,500);beep(70,.35,'sine',.08,-30);break;case'thud':noise(.2,.1,400);break;case'dash':noise(.12,.04,1800);break;case'shout':beep(220,.3,'sawtooth',.03,80);break;case'roar':beep(110,.6,'sawtooth',.05,-40);noise(.5,.04,600);break;case'howl':beep(420,.8,'sine',.025,180);break;
  case'lvl':[392,523,659,784].forEach((f,i)=>beep(f,.2,'triangle',.05,0,i*.08));break;case'pick':beep(880,.06,'triangle',.035,300);break;case'coin':beep(1320,.05,'square',.02,0);beep(1760,.06,'square',.02,0,.05);break;case'heal':beep(520,.3,'sine',.05,500);break;case'drink':beep(300,.12,'sine',.04,250);break;case'equip':noise(.06,.05,2000);beep(400,.05,'triangle',.03,0);break;case'ok':beep(660,.08,'triangle',.04);beep(990,.1,'triangle',.04,0,.07);break;case'no':beep(160,.1,'square',.03);break;case'scare':noise(.5,.08,600);beep(90,.5,'sawtooth',.05,-40);beep(140,.4,'triangle',.03,-60,.1);break;case'whirl':noise(.35,.07,1800);noise(.2,.05,900,.15);break;case'zap':noise(.14,.09,5000);beep(1400,.07,'square',.03,-1100);noise(.25,.06,300,.04);break;case'thunder':noise(.45,.14,400);beep(55,.4,'sawtooth',.06,-25);noise(.12,.08,5000);break;case'freeze':beep(1600,.25,'triangle',.03,-900);noise(.25,.05,6000);break;case'shatter':noise(.25,.1,7000);[1800,2400,1500].forEach((f,i)=>beep(f,.08,'triangle',.03,-500,i*.03));break;case'xbow':beep(240,.08,'square',.04,-140);noise(.06,.06,3000);break;case'chime':[1320,1760,2093].forEach((f,i)=>beep(f,.5,'sine',.02,0,i*.06));break;case'chest':beep(520,.1,'triangle',.04);beep(780,.1,'triangle',.04,0,.1);beep(1040,.2,'triangle',.04,0,.2);break;case'door':noise(.3,.05,300);break;case'die':beep(200,.8,'sawtooth',.05,-150);break;case'victory':[523,659,784,1046].forEach((f,i)=>beep(f,.3,'triangle',.05,0,i*.14));break}}
// ---------- save ----------
const SKEY='pedravale-mmo-v1';
function serialize(){if(!P)return null;const o={};for(const k of ['name','cls','skin','hairC','hs','capeC','beard','lv','exp','pts','st','gold','inv','eq','bank','q','flags','map','x','y','hp','mp','title','pet','prof','stats','ach','evo','skr','sk','bar'])o[k]=P[k];o.time=TIME;return o}
const SLOTKEY='pedravale-slots-v1',MAXSLOTS=6;let curSlot=-1;
function loadSlots(){try{const a=JSON.parse(localStorage.getItem(SLOTKEY)||'null');if(Array.isArray(a))return a.filter(Boolean)}catch(e){}const old=loadSave();return old?[old]:[]}
function saveSlots(a){try{localStorage.setItem(SLOTKEY,JSON.stringify(a))}catch(e){}}
function save(){const d=serialize();if(!d)return;const a=loadSlots();if(curSlot<0||curSlot>a.length)curSlot=a.length;d.slot=curSlot;a[curSlot]=d;saveSlots(a)}
function loadSave(){try{const s=localStorage.getItem(SKEY);return s?JSON.parse(s):null}catch(e){return null}}
function toMenu(){if(state!=='play')return;save();closeCircle();netLeave();document.querySelectorAll('.win').forEach(w=>w.hidden=true);for(const s of ['#hudChar','#xpbar','#actionbar','#mapbox','#chat','#zoomBox','#bossbar','#prompt','#qTrack'])if($(s))$(s).hidden=true;bossActive=null;
  for(const id in MAPS)for(const a of MAPS[id].acts)if(a.kind==='chest'&&ART.chest)a.obj.cv=ART.chest.cv;
  state='intro';$('#intro').hidden=false;introUI()}
function startGame(data,cfg){
  if(data&&data.slot!=null)curSlot=data.slot;
  if(data){P=hydrate(Object.assign({},data));TIME=data.time??TIME;if(!MAPS[P.map])P.map='world'}else{P=newPlayer(cfg)}
  M=MAPS[P.map];if(solidAt(M,P.x,P.y)){P.map='world';M=MAPS.world;P.x=M.spawnPt[0];P.y=M.spawnPt[1]}unstick(M,P);
  if(P.q.filho>=2){const t=npcs.find(n=>n.id==='tome');if(t)t.hidden=0;const c=npcs.find(n=>n.id==='tome_cage');if(c)c.hidden=1}
  for(const id in MAPS)for(const a of MAPS[id].acts)if(a.kind==='chest'&&P.flags.chests[a.id])a.obj.cv=ART.chestOpen.cv;if(P.flags.santuario)openCircle(true);
  state='play';$('#intro').hidden=true;for(const s of ['#hudChar','#xpbar','#actionbar','#mapbox','#chat','#zoomBox'])showWin(s);buildActionBar();cam.init=false;try{if(matchMedia('(pointer: coarse)').matches)enableTouch()}catch(e){}touchSet='';
  log(`Bem-vindo a Pedravale, ${P.name}.`,'sys');log('Os outros aventureiros desta versão são simulados. O mundo é seu para explorar: nenhuma missão é obrigatória.','sys');
  if(!data)showWin('#helpWin');uiDirty=1;updHud();save()}
window.claude?.hot?.snapshot?.(()=>({save:serialize()}));
// ---------- creation ----------
const CC={name:'',cls:'g',skin:0,hairC:0,hs:'short',capeC:0,beard:false};
function swatch(box,arr,key,fmt){const el=$(box);el.innerHTML='';arr.forEach((c,i)=>{const bt=document.createElement('button');bt.type='button';bt.style.background=c==null?'repeating-linear-gradient(45deg,#2a2a34 0 4px,#4a4a58 4px 8px)':hex(c);bt.setAttribute('aria-label',(fmt||key)+' '+(i+1));bt.setAttribute('aria-pressed',CC[key]===i?'true':'false');bt.onclick=()=>{CC[key]=i;el.querySelectorAll('button').forEach((x,j)=>x.setAttribute('aria-pressed',j===i?'true':'false'))};el.appendChild(bt)})}
function introUI(){swatch('#swSkin',SKINS,'skin','Pele');swatch('#swHair',HAIRC,'hairC','Cabelo');swatch('#swCape',CAPES,'capeC','Manto');
  const cls=$('#clsBox');cls.innerHTML='';for(const k of ['g','a','m','l']){const c=CLASSES[k],bt=document.createElement('button');bt.type='button';bt.className='clsbtn';bt.dataset.k=k;bt.setAttribute('aria-pressed',CC.cls===k?'true':'false');bt.innerHTML=`<b>${c.n}</b><span>${c.role}</span><em>Principal: ${STATN[c.main]}</em>`;bt.onclick=()=>{CC.cls=k;cls.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.k===k?'true':'false'))};cls.appendChild(bt)}
  $('#hsBtn').onclick=()=>{CC.hs=CC.hs==='short'?'long':CC.hs==='long'?'bald':'short';$('#hsBtn').textContent={short:'Curto',long:'Longo',bald:'Careca'}[CC.hs]};
  $('#beardBtn').onclick=()=>{CC.beard=!CC.beard;$('#beardBtn').textContent=CC.beard?'Com barba':'Sem barba'};
  const go=$('#goBox'),slots=loadSlots();go.innerHTML='';const mkB=(t,pri,fn,parent=go,cls='')=>{const bt=document.createElement('button');bt.type='button';bt.className='btn big'+(pri?' pri':'')+(cls?' '+cls:'');bt.textContent=t;bt.onclick=()=>{initAudio();fn(bt)};parent.appendChild(bt);return bt};
  const begin=()=>{if(slots.length>=MAXSLOTS){toast('Limite de personagens',`Apague um dos ${MAXSLOTS} para criar outro`);return}CC.name=($('#heroName').value.trim()||'Aventureiro').slice(0,16);curSlot=slots.length;startGame(null,Object.assign({},CC))};
  if(slots.length){const h=document.createElement('div');h.className='lab';h.textContent=`Seus personagens (${slots.length}/${MAXSLOTS})`;go.appendChild(h);const list=document.createElement('div');list.className='slotlist';go.appendChild(list);
    slots.forEach((sv,i)=>{const row=document.createElement('div');row.className='slotrow';list.appendChild(row);const where=MAPS[sv.map]?MAPS[sv.map].name:'';mkB(`${sv.name} · ${CLASSES[sv.cls]?CLASSES[sv.cls].n:''} Nv ${sv.lv}${where?' · '+where:''}`,i===0,()=>{curSlot=i;startGame(Object.assign({},sv,{slot:i}))},row);
      mkB('Apagar',false,(bt)=>{if(bt.dataset.c){const a=loadSlots();a.splice(i,1);a.forEach((s,k)=>s.slot=k);saveSlots(a);try{localStorage.removeItem(SKEY)}catch(e){}introUI()}else{bt.dataset.c=1;bt.textContent='Confirmar?';setTimeout(()=>{if(bt.isConnected){delete bt.dataset.c;bt.textContent='Apagar'}},3000)}},row,'del')});
    mkB('Criar novo personagem com a aparência acima',false,begin)}
  else mkB('Entrar no mundo',true,begin);
  const pv=$('#prev'),px=pv.getContext('2d');let dir=0,dt0=0;(function anim(){if(state!=='intro')return;dt0++;if(dt0%40===0)dir=(dir+1)%8;const fake={eq:{},skin:CC.skin,hairC:CC.hairC,hs:CC.hs,capeC:CC.capeC,beard:CC.beard};for(const [sl,id] of Object.entries(START[CC.cls]))fake.eq[sl]={id};const L=playerLook(fake);const fr=charFrame(L,dir,'walk',Math.floor(dt0/5)%8);px.imageSmoothingEnabled=false;px.clearRect(0,0,pv.width,pv.height);px.drawImage(LS.shadow,pv.width/2-30,pv.height-26,60,22);px.drawImage(fr.cv,Math.round(pv.width/2-fr.ax*2),Math.round(pv.height-14-fr.ay*2),fr.cv.width*2,fr.cv.height*2);requestAnimationFrame(anim)})()}
// ---------- loop ----------
let last=performance.now();
function frame(now){let dt=Math.min(.05,(now-last)/1000);last=now;if(hitstop>0){hitstop-=dt*2;dt*=.5}T+=dt;shake=Math.max(0,shake-dt);lvlFx=Math.max(0,lvlFx-dt);
  if(state==='play'){updWorld(dt);updPlayer(dt);featuresTick(dt);for(const m of mobs)if(m.m===M.id)updMob(m,dt);for(let i=mobs.length-1;i>=0;i--)if(mobs[i].dead)mobs.splice(i,1);for(const n of npcs)if(n.m===M.id||n.role==='villager')updNpc(n,dt);for(const bt of bots)updBot(bt,dt);updProjs(dt);updTeles(dt);
    netTick(dt);audioTick(dt);hudT-=dt;if(hudT<=0){hudT=.1;updHud()}saveT-=dt;if(saveT<=0){saveT=15;save()}}
  else{for(const n of npcs)if(n.m==='world')updNpc(n,dt);TIME=(TIME+dt/CFG.dayLength)%1}
  tickFx(dt);try{render(dt)}catch(err){console.error(err)}requestAnimationFrame(frame)}
let saveT=15;
function boot(hot){resize();LS=lightSprites();ART=buildArt();buildArtFeat(ART);MAPS.world=genWorld(ART);MAPS.dungeon=genDungeon(ART);MAPS.cripta=genCrypt(ART);MAPS.forte=genForte(ART);MAPS.santuario=genSantuario(ART);genAllRegions(ART);genWorld2(ART);decorateWorld(ART);addFeatureWorld(ART);MAPS.world.npcDefs.push({id:'viajante',n:'Ysolde, a Guardiã do Portal',x:17.6,y:21.6,look:{skin:SKINS[0],hair:0x8a5ad8,hs:'long',chest:0x3a2a5a,ct:'robe',robe:1,trim:0xc8a0ff,legs:0x3a2a5a,boots:0x2a2018,hd:'hood',hdCol:0x3a2a5a,wt:'staff',wcol:0x6a4a8a,orb:0xc8a0ff},role:'travel'});MAPS.world.npcDefs.push({id:'varek',n:'Mestre Varek, o Instrutor',x:22.6,y:17.4,look:{skin:SKINS[1],hair:0x8a8a8a,hs:'short',beard:1,chest:0x6a2a2a,ct:'plate',trim:0xe8c050,legs:0x3a3a44,boots:0x2a2018,cape:0x2a2a5a,hd:null,wt:'greatsword',wcol:0xd8dee8},role:'evo'});addObj(MAPS.world,{x:16.5,y:22.5,k:39.2,cv:ART.portalBase.cv,ox:ART.portalBase.ox,oy:ART.portalBase.oy,portal:1,keep:1,light:{dx:0,dy:-28,r:100,cold:1}});M=MAPS.world;
  for(const id in MAPS){const m=MAPS[id];for(const [k,r,n] of m.spawns)for(let i=0;i<n;i++)spawnMob(k,m,r);if(m.boss)spawnMob(m.boss[0],m,null,m.boss[1]);if(m.dummies)for(const d of m.dummies)spawnMob('boneco',m,null,d)}
  spawnNpcs();spawnBots();introUI();netInit();requestAnimationFrame(frame);if(hot&&hot.save)startGame(hot.save)}
const HOT=window.claude?.hot;if(HOT?.ready)HOT.ready(boot);else boot(HOT?.data??{});

// ===================== music & ambience (all synthesized, no files) =====================
const VOL={music:.55,sfx:.8,amb:.6};try{Object.assign(VOL,JSON.parse(localStorage.getItem('pedravale-vol')||'{}'))}catch(e){}
function setupAudio(){const m=AC.createGain();m.connect(AC.destination);const comp=AC.createDynamicsCompressor();comp.connect(m);
  const rev=AC.createConvolver();const len=AC.sampleRate*2.4,ir=AC.createBuffer(2,len,AC.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}rev.buffer=ir;const revG=AC.createGain();revG.gain.value=.35;rev.connect(revG).connect(comp);
  const mk2=v=>{const g=AC.createGain();g.gain.value=v;g.connect(comp);return g};
  BUS={master:m,music:mk2(VOL.music*.5),sfx:mk2(VOL.sfx),amb:mk2(VOL.amb),rev};BUS.music.connect(rev);
  // looping noise sources for rain and wind
  const nb=AC.createBuffer(1,AC.sampleRate*3,AC.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  const loop=(type,freq,q)=>{const s=AC.createBufferSource();s.buffer=nb;s.loop=true;const f=AC.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(f).connect(g).connect(BUS.amb);s.start();return{g,f}};
  BUS.rain=loop('bandpass',2200,.6);BUS.rain2=loop('lowpass',500,.5);BUS.wind=loop('bandpass',380,1.4);BUS.cave=loop('lowpass',140,2);
  musicNext=AC.currentTime+.3;applyVol()}
function applyVol(){if(!BUS)return;BUS.music.gain.value=soundOn?VOL.music*.5:0;BUS.sfx.gain.value=soundOn?VOL.sfx:0;BUS.amb.gain.value=soundOn?VOL.amb:0;try{localStorage.setItem('pedravale-vol',JSON.stringify(VOL))}catch(e){}}
for(const k of ['music','sfx','amb']){const el=$('#vol_'+k);if(!el)continue;el.value=Math.round(VOL[k]*100);el.addEventListener('input',()=>{VOL[k]=el.value/100;initAudio();applyVol()})}
$('#sndMute').addEventListener('click',()=>{soundOn=!soundOn;$('#sndMute').textContent=soundOn?'Silenciar tudo':'Reativar som';$('#bSnd').textContent=soundOn?'Som':'Mudo';applyVol()});
// instruments
const NOTE=n=>440*Math.pow(2,(n-69)/12);
function pluck(t,n,vol=.12,dur=1.6){const o=AC.createOscillator(),o2=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='triangle';o2.type='sawtooth';o.frequency.value=NOTE(n);o2.frequency.value=NOTE(n)*1.003;f.type='lowpass';f.frequency.setValueAtTime(3200,t);f.frequency.exponentialRampToValueAtTime(500,t+.5);
  const g2=AC.createGain();g2.gain.value=.18;o2.connect(g2).connect(f);o.connect(f).connect(g);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+dur);g.connect(BUS.music);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+dur+.05)}
function pad(t,notes,dur,vol=.05){for(const n of notes){const o=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';o.frequency.value=NOTE(n);o.detune.value=rnd(-8,8);f.type='lowpass';f.frequency.value=700;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(f).connect(g).connect(BUS.music);o.start(t);o.stop(t+dur+.1)}}
function flute(t,n,dur,vol=.06){const o=AC.createOscillator(),lfo=AC.createOscillator(),lg=AC.createGain(),g=AC.createGain();o.type='sine';o.frequency.value=NOTE(n);lfo.frequency.value=5.2;lg.gain.value=NOTE(n)*.006;lfo.connect(lg).connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.08);g.gain.setValueAtTime(vol,t+dur*.7);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(g).connect(BUS.music);o.start(t);lfo.start(t);o.stop(t+dur+.05);lfo.stop(t+dur+.05)}
function drum(t,vol=.2,f0=110){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(40,t+.25);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g).connect(BUS.music);o.start(t);o.stop(t+.35)}
// moods: chord roots (MIDI), scale for melodies, tempo
const MOODS={
  vila:{bpm:84,chords:[[50,57,62,65],[48,55,60,64],[46,53,58,62],[48,55,60,67]],scale:[62,64,65,67,69,70,72,74],lute:1,flute:.5},
  noite:{bpm:62,chords:[[45,52,57,60],[41,48,53,57],[43,50,55,59],[40,47,52,55]],scale:[57,59,60,62,64,65,67,69],lute:.45,flute:.25},
  ermo:{bpm:72,chords:[[47,54,59,62],[43,50,55,59],[45,52,57,61],[42,49,54,57]],scale:[59,61,62,64,66,67,69,71],lute:.6,flute:.6},
  toca:{bpm:58,chords:[[38,45,50,53],[37,44,49,52],[36,43,48,51],[37,44,49,53]],scale:[50,51,53,55,56,58,60],lute:.25,flute:0,drone:1,drum:.5},
  cripta:{bpm:50,chords:[[40,47,52,55],[41,48,53,56],[38,45,50,53],[39,46,51,55]],scale:[64,65,67,68,71,72],lute:.12,flute:.35,drone:1},
  santuario:{bpm:66,chords:[[48,55,60,64],[45,52,57,64],[41,48,53,60],[43,50,55,62]],scale:[72,74,76,79,81,84],lute:.7,flute:.5},
  neve:{bpm:60,chords:[[45,52,57,60],[41,48,53,57],[43,50,55,59],[40,47,52,59]],scale:[69,71,72,74,76,77,79,81],lute:.3,flute:.75},
  japao:{bpm:70,chords:[[50,57,62,65],[46,53,58,62],[45,52,57,64],[50,57,62,69]],scale:[62,64,65,69,70,74,76,77],lute:.85,flute:.6},
  deserto:{bpm:92,chords:[[50,57,62,66],[51,58,63,67],[50,57,62,66],[48,55,60,63]],scale:[62,63,66,67,69,70,72,74],lute:.9,flute:.5,drum:.55},
  selva:{bpm:96,chords:[[43,50,55,59],[45,52,57,60],[40,47,52,55],[48,55,60,64]],scale:[67,69,71,74,76,79,81],lute:.5,flute:.6,drum:.8},
  chefe:{bpm:112,chords:[[38,45,50,53],[41,48,53,56],[36,43,48,51],[37,44,49,52]],scale:[62,63,65,67,68,70,72],lute:.9,flute:0,drum:1}};
let musicNext=0,bar=0,curMood='vila';
function pickMood(){if(state!=='play')return'noite';if(bossActive&&!bossActive.dying)return'chefe';if(M.id==='santuario')return'santuario';if(M.id==='cripta')return'cripta';if(M.indoor)return'toca';if(M.mood)return M.mood;if(isNight())return'noite';const r=regionAt(M,P.x,P.y);return r.dg===0?'vila':'ermo'}
function scheduleMusic(){if(!AC||!BUS)return;const want=pickMood();if(want!==curMood&&bar%2===0)curMood=want;const md=MOODS[curMood],beat=60/md.bpm;
  while(musicNext<AC.currentTime+.6){const t=musicNext,ch=md.chords[bar%md.chords.length];
    pad(t,ch.slice(0,3).map(n=>n+12),beat*4,curMood==='toca'?.035:.028);if(md.drone)pad(t,[ch[0]-12],beat*4,.05);
    for(let i=0;i<8;i++){if(Math.random()<md.lute){const n=ch[[0,1,2,3,2,1,2,3][i]]+12;pluck(t+i*beat/2,n,.07+(i===0?.04:0),beat*2.2)}}
    if(md.flute&&Math.random()<md.flute){let tt=t+beat*rint(0,1);for(let k=0;k<rint(2,4);k++){const d=beat*pick([1,1.5,2]);flute(tt,pick(md.scale),d,.045);tt+=d}}
    if(md.drum)for(let i=0;i<4;i++)if(i%2===0||md.drum>.8)drum(t+i*beat,i===0?.22:.12,i===0?100:150);
    musicNext+=beat*4;bar++}}
let stepT=0,cricketT=0,fireT=0;
function audioTick(dt){if(!AC||!BUS)return;scheduleMusic();const now=AC.currentTime,w=!M.indoor,night=isNight();
  const set=(node,v)=>node.g.gain.setTargetAtTime(v,now,.4);const rn=rainNow(),cl=M.climate;set(BUS.rain,w?rn*.22:0);set(BUS.rain2,w?rn*.18:0);set(BUS.wind,w?.03+(night?.03:0)+rn*.04+(cl==='snow'?.07:cl==='desert'?.04:0):0);set(BUS.cave,w?0:.18);
  BUS.wind.f.frequency.setTargetAtTime(300+Math.sin(T*.3)*120,now,.5);
  // footsteps by terrain
  if(P&&P.moving&&!P.dead&&!P.dash){stepT-=dt;if(stepT<=0){stepT=.34;const t=tAt(M,P.x,P.y);const hard=t===COBBLE||t===CAVE||t===BRIDGE;stepSound(hard?(t===BRIDGE?'wood':'stone'):(weather.rain>.3&&w?'mud':'grass'))}}else stepT=0;
  // night crickets & owls, fire crackle near flames
  if(w&&night&&weather.rain<.3){cricketT-=dt;if(cricketT<=0){cricketT=rnd(.15,.9);const f=rnd(4200,5200);for(let i=0;i<3;i++)ambBeep(f,.025,'sine',.012,0,i*.05)}}
  fireT-=dt;if(fireT<=0){fireT=rnd(.06,.25);let nearF=99;for(const o of M.objs)if(o.fire){const d=Math.hypot(o.x-P.x,o.y-P.y);if(d<nearF)nearF=d}if(nearF<6){const v=.05*(1-nearF/6);ambNoise(.02,v,2500+Math.random()*2000)}}}
function ambBeep(f,d,type,vol,slide,delay=0){const t0=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g).connect(BUS.amb);o.start(t0);o.stop(t0+d+.02)}
function ambNoise(d,vol,f){const len=Math.floor(AC.sampleRate*d),bf=AC.createBuffer(1,len,AC.sampleRate),da=bf.getChannelData(0);for(let i=0;i<len;i++)da[i]=(Math.random()*2-1)*(1-i/len);const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();fl.type='bandpass';fl.frequency.value=f;s.buffer=bf;g.gain.value=vol;s.connect(fl).connect(g).connect(BUS.amb);s.start()}
function stepSound(k){const p={stone:[.05,.07,1800],wood:[.06,.08,700],grass:[.07,.045,900],mud:[.09,.06,500]}[k];const len=Math.floor(AC.sampleRate*p[0]),bf=AC.createBuffer(1,len,AC.sampleRate),da=bf.getChannelData(0);for(let i=0;i<len;i++)da[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();fl.type=k==='stone'?'bandpass':'lowpass';fl.frequency.value=p[2]*rnd(.85,1.15);s.buffer=bf;g.gain.value=p[1];s.connect(fl).connect(g).connect(BUS.sfx);s.start()}
