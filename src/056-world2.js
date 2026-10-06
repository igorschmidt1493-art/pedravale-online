// ===================== world progression 1→60: level offsets, connecting fields, multi-floor dungeons =====================
const LVOFF={gelo:12,gruta_gelo:12,caverna_mamute:12,japao:22,caverna_oni:22,santuario_kyubi:22,deserto:32,tumba:32,piramide_akhet:32,selva:40,templo_selva:40,piramide_sol:40};
const FIELDS=[
  {id:'f_gelo',spec:'gelo',name:'Encosta Gelada',off:6,from:'world',to:'gelo',seed:9101},
  {id:'f_japao',spec:'japao',name:'Trilha dos Mil Toriis',off:16,from:'gelo',to:'japao',seed:9202},
  {id:'f_deserto',spec:'deserto',name:'Estrada das Caravanas',off:26,from:'japao',to:'deserto',seed:9303},
  {id:'f_selva',spec:'selva',name:'Rio das Serpentes',off:36,from:'deserto',to:'selva',seed:9404}];
const FLOORS={gruta_gelo:['B','C'],caverna_oni:['B','C'],tumba:['C','B'],templo_selva:['B','C']};
const shiftLv=(s,off)=>off?String(s).replace(/\d+/g,n=>String(+n+off)):s;
function freeNear(m,x0,y0,r=10){for(let rr=0;rr<=r;rr+=.5)for(let i=0;i<24;i++){const a=i/24*6.283,x=Math.floor(x0+Math.cos(a)*rr),y=Math.floor(y0+Math.sin(a)*rr);if(!inb(m,x,y)||m.solid[y*m.w+x]||tAt(m,x,y)===WATER)continue;if(m.objs.some(o=>Math.abs(o.x-x-.5)<1&&Math.abs(o.y-y-.5)<1))continue;return[x,y]}return[Math.floor(x0),Math.floor(y0)]}
function warpAt(ART,m,x0,y0,to,at,label){const [x,y]=freeNear(m,x0,y0);for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]])if(inb(m,x+dx,y+dy)&&!m.objs.some(o=>o.wall&&Math.floor(o.x)===x+dx&&Math.floor(o.y)===y+dy))m.solid[(y+dy)*m.w+x+dx]=0;
  addObj(m,{x:x+.5,y:y+.5,k:x+y+1,cv:ART.portalBase.cv,ox:ART.portalBase.ox,oy:ART.portalBase.oy,portal:1,keep:1,warp:1,light:{dx:0,dy:-28,r:110,cold:1}});
  m.acts.push({kind:'enter',to,at,x:x+.5,y:y+.5,label,warp:1,auto:1});return[x+.5,y+.5]}
// ---------- connecting field (72×72, no city) ----------
function genField(ART,S,F){const N=72,m=makeMap(F.id,N,N,{name:F.name,dark:0,bg:S.bg,climate:S.climate,mood:S.mood,gradeTint:S.gradeTint,oSoft:S.oSoft});const R=mulberry(F.seed);
  const T=(x,y,t)=>{if(inb(m,x,y))m.terr[y*N+x]=t},G=(x,y)=>tAt(m,x,y),sc=55/N;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const sx=Math.floor(x*sc),sy=Math.floor(y*sc);T(x,y,S.ground(Math.min(52,Math.max(3,sx)),Math.min(52,Math.max(3,sy)),R))}
  if(S.id==='gelo')for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(G(x,y)===ICE&&vn(x*.09,y*.09,95)<.62)T(x,y,SNOW);
  const pond=S.id==='gelo'?ICE:WATER;for(let k=0;k<4;k++){const cx=10+R()*52,cy=8+R()*56;if(Math.abs(cy-36)<7)continue;const rr=2.5+R()*3;for(let y=Math.floor(cy-rr-2);y<=cy+rr+2;y++)for(let x=Math.floor(cx-rr-2);x<=cx+rr+2;x++)if(Math.hypot((x-cx)*1.1,y-cy)<rr+vn(x*.4,y*.4,k+90)*1.6)T(x,y,pond)}
  let yy=36;const path=[];for(let x=0;x<N;x++){yy+=Math.sin(x*.16+F.seed)*.55+(R()-.5)*.5;yy=Math.max(10,Math.min(N-11,yy));path.push([x,Math.round(yy)]);for(let d=-1;d<=1;d++){const t=G(x,Math.round(yy)+d);T(x,Math.round(yy)+d,t===WATER?BRIDGE:S.road)}}
  const side=(x0,yA,yB)=>{for(let y=Math.min(yA,yB);y<=Math.max(yA,yB);y++){const t=G(x0,y);T(x0,y,t===WATER?BRIDGE:S.road);T(x0+1,y,G(x0+1,y)===WATER?BRIDGE:S.road)}};side(24,path[24][1],12);side(48,path[48][1],60);
  for(let i=0;i<N*N;i++)if(SOLID_T[m.terr[i]])m.solid[i]=1;for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(m.terr[y*N+x]===WATER)m.waterTiles.push([x,y]);
  const reserve=new Set(),res=(x,y)=>reserve.add(x+','+y),isRes=(x,y)=>reserve.has(x+','+y),P=(x,y,a,ex)=>{res(x,y);return prop(m,x,y,a,ex)};
  for(const [x,y] of path)for(let d=-2;d<=2;d++)res(x,y+d);for(let y=0;y<N;y++){res(24,y);res(25,y);res(48,y);res(49,y)}
  // camps
  for(const [cx,cy,i] of [[18,path[18][1]-6,0],[38,path[38][1]+6,1],[58,path[58][1]-6,2],[30,14,3],[52,58,4]]){let ok=true;for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)if(!inb(m,x,y)||m.solid[y*N+x]||G(x,y)===WATER)ok=false;if(!ok)continue;for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)res(x,y);
    prop(m,cx,cy,ART.campfire,{fire:{dx:0,dy:-4,s:5},light:{dx:0,dy:-8,r:160}});prop(m,cx+1,cy-1,ART.log,{block:null});addObj(m,{x:cx-.8,y:cy+1.2,k:cx+cy+.4,cv:ART.bedroll[i%2].cv,ox:ART.bedroll[i%2].ox,oy:ART.bedroll[i%2].oy});if(i%2){const t=ART.tent[i%3];addObj(m,{x:cx+1,y:cy+1,k:cx+cy+4,cv:t.cv,ox:t.ox,oy:t.oy,block:[[cx+1,cy+1],[cx+2,cy+1],[cx+1,cy+2],[cx+2,cy+2]],tall:1})}else prop(m,cx-1,cy-1,ART.crate)}
  // lights along the road
  for(let x=6;x<N-4;x+=7){const [px,py]=path[x],sy=py+((x/7)&1?-3:3);if(inb(m,x,sy)&&!m.solid[sy*N+x]&&G(x,sy)!==WATER&&!isRes(x,sy))P(x,sy,S.lamp&&x%14===6?S.lamp.art:ART.torchpost,S.lamp&&x%14===6?S.lamp.ex:{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:120}})}
  // decals
  if(S.decal)for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=G(x,y);const r=R(),d=S.decal(t,r,R);if(d){const [wx,wy]=wpx(x+R(),y+R());decal(m,wx,wy,d)}}
  // nature
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=G(x,y);if(isRes(x,y)||m.solid[y*N+x])continue;if(t===S.road||t===BRIDGE||t===WATER)continue;const near=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const tt=G(x+dx,y+dy);return tt===S.road||tt===BRIDGE});const border=x<2||y<2||x>N-3||y>N-3;
    const pick=S.flora(t,R()*1.12,border,near,x,y,R);if(pick){const [art,tall,ex]=pick;prop(m,x,y,art,Object.assign({tall},ex||{}))}}
  // creatures: easier near the entrance, harder deeper in
  const M6=S.mobs;m.lvOff=F.off;
  m.regions=[{n:F.name+' — Entrada',r:[0,0,35,71],lv:`Níveis ${F.off+2}–${F.off+8}`,dg:2},{n:F.name+' — Interior',r:[36,0,71,71],lv:`Níveis ${F.off+6}–${F.off+12}`,dg:3},{n:F.name,r:[0,0,71,71],lv:`Níveis ${F.off+2}–${F.off+12}`,dg:2}];
  m.spawns=[[M6[0],[4,4,34,30],6],[M6[1],[4,42,34,67],5],[M6[2],[8,8,34,67],4],[M6[3],[38,4,66,30],4],[M6[4],[38,42,66,67],5],[M6[2],[40,8,66,67],3],[M6[1],[38,4,66,67],3],[M6[5],[52,10,66,26],1]];
  m.spawnPt=[3.5,path[3][1]+.5];m.npcDefs=[];m.fieldPath=path;
  {const [x,y]=freeNear(m,36,path[36][1]+2);m.npcDefs.push({id:F.id+'_mascate',n:'Mascate Viajante',x:x+.5,y:y+.5,look:Object.assign({},S.people.shop[1],{chest:tone(S.people.shop[1].chest||0x6a4a2a,-.1)}),role:'rshop',shop:S.shop})}
  return m}
// ---------- extra dungeon floors ----------
function genFloors(ART){const cs=caveSpecs(ART);
  for(const cave in FLOORS){const base=cs[cave];if(!base||!MAPS[cave])continue;let prev=MAPS[cave];const lays=FLOORS[cave];
    for(let f=2;f<=3;f++){const id=cave+'_'+f,LY=LAYOUTS[prev.layoutK||base.layout||'A'];
      const sp=freeNear(prev,LY.boss[0]+2.5,LY.boss[1]-2.5,6);prop(prev,sp[0],sp[1],ART.stairs,{block:null,light:{dx:0,dy:-20,r:120,cold:1}});prev.acts.push({kind:'enter',to:id,at:[6.5,7.2],x:sp[0]+.5,y:sp[1]+.5,label:`Descer ao ${f}º andar`});
      const S=Object.assign({},base,{id,name:`${base.name} — ${f}º andar`,layout:lays[f-2],seed:base.seed+f*97,parent:prev.id,out:[sp[0]+.5,sp[1]+1.6],lv:`Níveis ${10+f*3}–${16+f*3}`,dg:4,
        mobs:[base.mobs[f===2?1:2],base.mobs[0],base.mobs[f===2?2:1]],boss:f===3?base.boss+'_anc':base.mobs[2]});
      const m=genCaveR(ART,S);m.layoutK=lays[f-2];m.lvOff=(LVOFF[cave]||0)+(f===2?4:8);if(f===2){m.boss=null;m.spawns.push([base.mobs[2],LAYOUTS[lays[0]].rects[4],3])}MAPS[id]=m;if(f===3)addBossChest(m,ART);prev=m}}}
// ancestral bosses for the third floors
for(const b of ['rainha_gelo','oni_shogun','farao','boitata_rei'])if(MOBS[b])MOBS[b+'_anc']=Object.assign({},MOBS[b],{n:MOBS[b].n+' Ancestral',hp:Math.round(MOBS[b].hp*1.9),atk:Math.round(MOBS[b].atk*1.25),exp:Math.round(MOBS[b].exp*2.2),gold:[MOBS[b].gold[0]*2,MOBS[b].gold[1]*2],drops:(MOBS[b].drops||[]).concat([['g60_anel_Anel',.25],['g60_colar_Pingente',.25]])});
// ---------- build everything ----------
function genWorld2(ART){const rs=regionSpecs(ART);
  for(const F of FIELDS)MAPS[F.id]=genField(ART,rs[F.spec],F);
  genFloors(ART);
  for(const id in LVOFF)if(MAPS[id]){MAPS[id].lvOff=LVOFF[id];for(const r of MAPS[id].regions||[])r.lv=shiftLv(r.lv,LVOFF[id])}
  for(const id in MAPS){const m=MAPS[id];if(/_[23]$/.test(id))for(const r of m.regions)r.lv=shiftLv(`Níveis ${10+(id.endsWith('3')?6:3)}–${16+(id.endsWith('3')?6:3)}`,LVOFF[id.replace(/_[23]$/,'')]||0)}
  // link the chain: previous map → field (west) ... field (east) → next region
  for(const F of FIELDS){const fm=MAPS[F.id],from=MAPS[F.from],to=MAPS[F.to],path=fm.fieldPath;
    const fromPt=F.from==='world'?[44,2]:[28.5,2.2],toPt=[28.5,53.4];
    const a=warpAt(ART,from,fromPt[0],fromPt[1],F.id,[4.5,path[4][1]+.5],`${fm.name} (Nv ${F.off+2}–${F.off+12})`);
    warpAt(ART,fm,1.5,path[1][1],F.from,[a[0],a[1]+1.6],`Voltar: ${from.name}`);
    const b=warpAt(ART,to,toPt[0],toPt[1],F.id,[66.5,path[66][1]+.5],`${fm.name} (Nv ${F.off+2}–${F.off+12})`);
    warpAt(ART,fm,69.5,path[69][1],F.to,[b[0],b[1]-1.6],`Seguir para ${to.name}`)}}
// ---------- mob scaling by map ----------
const atkP=L=>26+4.9*L,hpP=L=>144+23.6*L;
function scaledKind(kind,off){const k=kind+'@'+off;if(MOBS[k])return k;const d=MOBS[kind],l=d.lv||1,L=l+off;
  MOBS[k]=Object.assign({},d,{lv:L,hp:Math.round(d.hp*atkP(L)/atkP(l)*(1+off*.006)),atk:Math.round(d.atk*hpP(L)/hpP(l)*(1+off*.01)),def:Math.round((d.def||0)*(1+off*.05)),exp:Math.round(d.exp*Math.pow(need(L)/need(l),.8)),gold:[Math.round(d.gold[0]*(1+off*.09)),Math.round(d.gold[1]*(1+off*.09))]});return k}
{const _sm=spawnMob;spawnMob=function(kind,m,rect,at){const off=m&&m.lvOff||0;if(!off||!MOBS[kind]||kind==='boneco')return _sm(kind,m,rect,at);const e=_sm(scaledKind(kind,off),m,rect,at);if(e)e.kind=kind;return e}}
// ---------- warp on step (classic MMORPG portals) ----------
function warpTick(dt){if(!P||P.dead||state!=='play')return;if(!(P.flags.seen&&P.flags.seen[M.id]))markSeen(M.id);if(P.warpCD>0){P.warpCD-=dt;return}for(const a of M.acts)if(a.auto&&Math.hypot(a.x-P.x,a.y-P.y)<.75){P.warpCD=1.2;burstAt(P.x,P.y,0x9ad8ff,26,70);sfx('blink');changeMap(a.to,a.at[0],a.at[1]);burstAt(P.x,P.y,0xbfe8ff,26,70);P.warpCD=1.4;log(`Você chegou em ${M.name}.`,'sys');return}}
// ---------- world map (M) ----------
const WORLD_GRAPH=[
  {n:'Pedravale',maps:[['world','Vila de Pedravale e arredores','1–11'],['dungeon','Toca dos Goblins','7–12'],['forte','Forte Goblin','10–15'],['cripta','Cripta','8–14']]},
  {n:'Rumo ao Norte',maps:[['f_gelo','Encosta Gelada','8–18']]},
  {n:'Gelvar',maps:[['gelo','Picos de Gelvar','13–24'],['gruta_gelo','Gruta Congelada (1º andar)','20–26'],['gruta_gelo_2','Gruta Congelada (2º andar)','25–31'],['gruta_gelo_3','Gruta Congelada (3º andar)','28–34'],['caverna_mamute','Caverna do Mamute (secreta)','24–28']]},
  {n:'Rumo ao Leste',maps:[['f_japao','Trilha dos Mil Toriis','18–28']]},
  {n:'Kazemura',maps:[['japao','Vale de Kazemura','23–34'],['caverna_oni','Caverna do Oni (1º andar)','30–36'],['caverna_oni_2','Caverna do Oni (2º andar)','35–41'],['caverna_oni_3','Caverna do Oni (3º andar)','38–44'],['santuario_kyubi','Santuário da Kyūbi (secreto)','34–38']]},
  {n:'Rumo ao Sul',maps:[['f_deserto','Estrada das Caravanas','28–38']]},
  {n:'Qasr',maps:[['deserto','Dunas de Al-Rimal','33–44'],['tumba','Tumba do Faraó (1º andar)','40–46'],['tumba_2','Tumba do Faraó (2º andar)','45–51'],['tumba_3','Tumba do Faraó (3º andar)','48–54'],['piramide_akhet','Pirâmide de Akhet','45–50']]},
  {n:'Rumo à Selva',maps:[['f_selva','Rio das Serpentes','38–48']]},
  {n:'Aldeia',maps:[['selva','Selva da Aldeia','41–52'],['templo_selva','Templo Perdido (1º andar)','48–54'],['templo_selva_2','Templo Perdido (2º andar)','53–59'],['templo_selva_3','Templo Perdido (3º andar)','56–62'],['piramide_sol','Pirâmide do Sol Verde','53–58']]}];
function markSeen(id){if(!P)return;P.flags.seen=P.flags.seen||{};P.flags.seen[id]=1}
function renderWorldMap(){const body=$('#worldBody');if(!body)return;body.textContent='';const seen=(P.flags&&P.flags.seen)||{};
  const hint=document.createElement('p');hint.className='hint';hint.textContent='Siga os portais nas bordas dos mapas: cada região leva à próxima. A Guardiã do Portal de cada cidade também teleporta entre as cidades.';body.appendChild(hint);
  for(const g of WORLD_GRAPH){const sec=document.createElement('div');sec.className='wmsec';const h=document.createElement('b');h.textContent=g.n;sec.appendChild(h);
    for(const [id,n,lv] of g.maps){const row=document.createElement('div');row.className='wmrow'+(M&&M.id===id?' here':'')+(seen[id]||M.id===id?'':' unk');const a=document.createElement('span');a.textContent=(M&&M.id===id?'► ':'')+(seen[id]||M.id===id?n:'??? (não descoberto)');const c=document.createElement('span');c.className='lv';c.textContent='Nv '+lv;const fit=lv.split('–').map(Number);if(P.lv>=fit[0]-2&&P.lv<=fit[1])c.classList.add('fit');row.appendChild(a);row.appendChild(c);sec.appendChild(row)}
    body.appendChild(sec)}}
function toggleWorldMap(){const w=$('#worldWin');if(!w)return;if(w.hidden){renderWorldMap();showWin('#worldWin')}else hideWin('#worldWin')}
