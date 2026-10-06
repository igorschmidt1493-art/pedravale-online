// ===================== regions: terrain, cities, outdoor maps and caves =====================
const SNOWCOB=28,PACKED=29,BRICK=26,SNOW=13,ICE=14,DUNE=15,JUNGLE=16,MUD=17,JGRASS=18,RAKE=19,STILE=20,SNOWPATH=21,ICECAVE=22,VOLC=23,TOMB=24,MOSSCAVE=25;
const NOJIT={[BRICK]:1,[RAKE]:1,[STILE]:1,[TOMB]:1,[ICECAVE]:0};
const MINI_EXTRA={[SNOWCOB]:'#c8ccd6',[PACKED]:'#8a5a3a',[BRICK]:'#9a6a54',[SNOW]:'#e8eef6',[ICE]:'#9ac8e0',[DUNE]:'#d8b47a',[JUNGLE]:'#2e5a2a',[MUD]:'#6a5236',[JGRASS]:'#6a8a4a',[RAKE]:'#d8d4c8',[STILE]:'#c8a070',[SNOWPATH]:'#b8c4d4',[ICECAVE]:'#6a8aa0',[VOLC]:'#3a3036',[TOMB]:'#9a8060',[MOSSCAVE]:'#3a4a32'};
function shadeBiome(m,t,fx,fy,wx,wy,n1,n2){let c;
  switch(t){
    case BRICK:{const gx=fx*4,gy=fy*4,iy=Math.floor(gy),blk=(Math.floor(fx*2)+Math.floor(fy*2))&1;let ix,ux,uy;if(blk){ix=Math.floor(gx/2+(iy&1)*.5);ux=(gx/2+(iy&1)*.5)-ix;uy=gy-iy}else{const jx=Math.floor(gx),jy=Math.floor(gy/2+(jx&1)*.5);ix=jx*31+jy;ux=gx-jx;uy=(gy/2+(jx&1)*.5)-jy}
      if(ux<.06||uy<.1&&blk||(!blk&&(ux<.1||uy<.06)))c=0x3a2a26;else{c=mix(0x8a5444,0xa86a52,hash(ix,iy,74));if(hash(ix,iy,75)<.15)c=mix(c,0x6e6a66,.6);if(uy<.22||ux<.16)c=tone(c,.1);if(uy>.8)c=tone(c,-.12);if(hash(wx,wy,76)<.05)c=tone(c,-.08)}break}
    case SNOW:{c=mix(0xcdd6e4,0xeef2f8,n1*.8+n2*.35);const h=hash(wx,wy>>1,51);if(h>.993)c=0xffffff;else if(h<.04)c=tone(c,-.08);if(vn(fx*.5,fy*.5,52)>.72)c=mix(c,0xb4c4da,.35);break}
    case ICE:{c=mix(0x84b4cc,0xa4cce0,n2*.8+n1*.2);const cr=Math.abs(Math.sin(fx*2.6+vn(fx*.9,fy*.9,53)*6+fy*.8));if(cr<.035)c=0xe8f8ff;else if(cr<.07)c=tone(c,.12);if(Math.sin((wx-wy*2)*.18)>.97)c=0xd8f0ff;break}
    case DUNE:{c=mix(0xc69e62,0xdcb878,n1*.7+n2*.3);const rp=Math.sin((fx*1.1+fy*.6)*9+vn(fx*.4,fy*.4,54)*4);if(rp>.82)c=tone(c,-.12);else if(rp<-.9)c=tone(c,.08);if(hash(wx>>1,wy>>1,55)<.02)c=0xa88a58;break}
    case JUNGLE:{c=mix(0x1c381c,0x2c5428,n1*.8+n2*.3);const h=hash(wx>>1,wy>>1,56);if(h<.06)c=h<.03?0x4a3a1a:0x3a5a1e;else if(h>.9985)c=pick2(wx,wy,[0xff4a6a,0xffd040,0xc85aff]);if(hash(wx,wy>>2,57)<.12)c=tone(c,-.25);break}
    case MUD:{c=mix(0x4a3a24,0x604a2e,n2*.8+n1*.2);if(vn(fx*.6,fy*.6,58)>.7){c=mix(0x2e3a34,0x4a5a50,n2);if(Math.sin(wy*.6+fx*3)>.95)c=0x8a9a90}else if(hash(wx>>1,wy>>1,59)<.05)c=0x3a2a1a;break}
    case JGRASS:{c=mix(0x466a36,0x6a8c48,n1*.85+n2*.3);const h=hash(wx,(wy+((wx*7)&3))>>2,60);if(h<.15)c=tone(c,-.28);else if(h>.96)c=tone(c,.25);if(hash(wx>>1,wy>>1,61)>.993)c=pick2(wx,wy,[0xf4b8cc,0xf0a0bc,0xffd8e4]);break}
    case RAKE:{const r=Math.sin(fy*22+Math.sin(fx*1.3)*1.2);c=r>.5?0xd6d2c4:0xb8b4a6;if(hash(wx,wy,62)<.04)c=tone(c,-.1);break}
    case STILE:{const gx=fx*2,gy=fy*2,ix=Math.floor(gx),iy=Math.floor(gy),ux=gx-ix,uy=gy-iy;if(ux<.07||uy<.07)c=0x7a5a3a;else{c=((ix+iy)&1)?mix(0xc89a68,0xd4a874,hash(ix,iy,63)):mix(0xdcc090,0xe6cc9c,hash(ix,iy,63));if((ix%4===0&&iy%4===0)&&ux>.3&&ux<.7&&uy>.3&&uy<.7)c=0x2a7a8a;if(ux<.15||uy<.15)c=tone(c,.12)}break}
    case SNOWPATH:{c=mix(0xaab4c4,0xc4ccda,n2*.7+n1*.3);const ry=(fx-Math.floor(fx));if(Math.abs(ry-.3)<.04||Math.abs(ry-.7)<.04)c=tone(c,-.12);if(hash(wx>>1,wy>>1,64)<.04)c=0x8a94a4;break}
    case ICECAVE:{c=mix(0x4e6c80,0x7090a8,n2*.8+n1*.3);const cr=Math.abs(Math.sin(fx*3.1+vn(fx,fy,65)*5));if(cr<.04)c=0xbfe8ff;if(hash(wx>>1,wy>>1,66)<.03)c=0xd8f0ff;break}
    case VOLC:{c=mix(0x2a2428,0x3c3238,n2*.8+n1*.3);const v=Math.abs(Math.sin((fx*2+fy*1.3)*2.2+vn(fx*1.2,fy*1.2,67)*6));if(v<.03)c=0xff7a2a;else if(v<.06)c=0x8a2a1a;if(hash(wx>>1,wy>>1,68)<.04)c=0x18121a;break}
    case TOMB:{const gx=fx*1.5,gy=fy*1.5,ix=Math.floor(gx),iy=Math.floor(gy),ux=gx-ix,uy=gy-iy;if(ux<.05||uy<.05)c=0x4a3a28;else{c=mix(0x8a7050,0xa08462,hash(ix,iy,69));if(hash(ix,iy,70)<.2&&ux>.25&&ux<.75&&uy>.25&&uy<.75&&hash(Math.floor(ux*6),Math.floor(uy*6)+ix*7,71)<.3)c=0x5a4430;if(ux<.12||uy<.12)c=tone(c,.1)}break}
    case MOSSCAVE:{c=mix(0x26342a,0x3a4a32,n2*.8+n1*.3);const h=hash(wx>>1,wy>>1,72);if(h<.006)c=0x8affa0;else if(h<.05)c=0x4a6a32;if(vn(fx*.4,fy*.4,73)>.72)c=mix(0x1e2e30,0x34484a,n2);break}
    case SNOWCOB:{vor(fx*1.9,fy*1.9,74);const e=VO.f2-VO.f1;if(e<.09)c=mix(0xdce4ee,0xf0f4f8,hash(wx,wy,75));else{c=mix(0x6e6a70,0x8e8890,VO.id);if(VO.id>.75)c=mix(c,0x8a7a6a,.4);if(e<.17)c=tone(c,VO.dx+VO.dy<0?.25:-.3);if(vn(fx*.5,fy*.5,76)>.62)c=mix(c,0xe6ecf4,.75)}break}
    case PACKED:{c=mix(0x6a4430,0x845a3e,n1*.7+n2*.4);const h=hash(wx>>1,wy>>1,77);if(h<.05)c=pick2(wx,wy,[0x3a5a1e,0x8a6a2a,0x5a3a1e]);else if(h>.985)c=0xa8805a;if(vn(fx*.7,fy*.7,78)>.74)c=mix(c,0x3e3a30,.5);if(hash(wx,wy>>2,79)<.08)c=tone(c,-.18);break}
    default:c=m.bg}
  return c}
// ---------- generic outdoor region with a walled city in the middle ----------
function genRegion(ART,S){const N=56,m=makeMap(S.id,N,N,{name:S.name,dark:0,bg:S.bg,climate:S.climate,mood:S.mood,city:S.city,gradeTint:S.gradeTint,oSoft:S.oSoft});const R=mulberry(S.seed);
  const T=(x,y,t)=>{if(inb(m,x,y))m.terr[y*N+x]=t},G=(x,y)=>tAt(m,x,y),C=28;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)T(x,y,S.ground(x,y,R));
  if(S.water)S.water(T,G,R);
  const road=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const t=G(x,y);if(t===WATER)T(x,y,BRIDGE);else if(t!==BRIDGE)T(x,y,S.road)}};
  road(27,0,29,N-1);road(0,27,N-1,29);road(45,29,46,46);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(Math.hypot(x+.5-C-.5,y+.5-C-.5)<6.2)T(x,y,S.plaza);
  for(let i=0;i<N*N;i++)if(SOLID_T[m.terr[i]])m.solid[i]=1;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(m.terr[y*N+x]===WATER)m.waterTiles.push([x,y]);
  const reserve=new Set(),res=(x,y)=>reserve.add(x+','+y),isRes=(x,y)=>reserve.has(x+','+y);
  // city wall
  if(S.wall)for(let y=18;y<=38;y++)for(let x=18;x<=38;x++){if(!(x===18||x===38||y===18||y===38))continue;if((x>=26&&x<=30)||(y>=26&&y<=30))continue;const ax=(y===18||y===38)?'x':'y';prop(m,x,y,S.wall[ax],{noShadow:1});res(x,y)}
  // buildings
  const bld=(x0,y0,o)=>{let day=makeBuilding(o,false),night=makeBuilding(o,true);if(S.snowRoof){day=snowify(day,4);night=snowify(night,4,.85)}const k=x0+y0+(o.w+o.h)/2;const bl=[];for(let i=0;i<o.w;i++)for(let j=0;j<o.h;j++){bl.push([x0+i,y0+j]);res(x0+i,y0+j)}
    addObj(m,{x:x0,y:y0,k,cv:day.cv,cvN:night.cv,ox:day.ox,oy:day.oy,block:bl,tall:1,wins:day.lights,smoke:day.smoke});const [ax,ay]=wpx(x0,y0);m.shadows.push({pts:bldShadow(o.w,o.h,o.wallH+(o.roofH||0)*.6).map(p=>[p[0]+ax,p[1]+ay])})};
  const D=(wh,u,w=.16,h=48)=>({t:'door',u0:u-w/2,u1:u+w/2,v0:0,v1:h/wh}),Wn=(wh,u,w=.12,sill=22,h=24,fl=0,st=64)=>({t:'win',u0:u-w/2,u1:u+w/2,v0:(sill+fl*st)/wh,v1:(sill+h+fl*st)/wh});
  const homes=[];
  if(S.buildings){for(const [x,y,o0] of S.buildings){let ok=true;for(let i=0;i<o0.w;i++)for(let j=0;j<o0.h;j++)if(isRes(x+i,y+j))ok=false;if(!ok)continue;const wh=o0.wallH||64,fl=o0.floors||1,two=fl>1;const o=Object.assign({ridge:(x+y)%2?'x':'y',seed:S.seed+x*13+y,baseH:12,open:{L:[D(wh,.36,.16,Math.min(52,wh*.7)),Wn(wh,.74,.12,22,24),...(two?[Wn(wh,.3,.12,22,24,1,(wh-12)/fl),Wn(wh,.74,.12,22,24,1,(wh-12)/fl)]:[])],R:[Wn(wh,.3,.14),Wn(wh,.72,.14),...(two?[Wn(wh,.3,.14,22,24,1,(wh-12)/fl),Wn(wh,.72,.14,22,24,1,(wh-12)/fl)]:[])]}},o0);bld(x,y,o);homes.push([x+o0.w*.36,y+o0.h+.5])}}
  else (S.houses||[]).forEach(([x,y,w,h],i)=>{const two=i%2===1,wh=two?112:64,o=Object.assign({w,h,wallH:wh,roofH:two?42:38,ridge:i%2?'y':'x',floors:two?2:1,seed:S.seed+i,chimney:S.chimney?1:0,baseH:12,open:{L:[D(wh,.42),Wn(wh,.8),...(two?[Wn(wh,.3,.12,22,24,1,56),Wn(wh,.75,.12,22,24,1,56)]:[])],R:[Wn(wh,.5,.18),...(two?[Wn(wh,.5,.18,22,24,1,56)]:[])]}},S.house(i,two));bld(x,y,o);homes.push([x+w*.42,y+h+.5])});
  if(!S.buildings)for(const [x,y,w,h] of [[24,19,2,2],[36,23,2,2],[21,31,2,2],[36,31,2,2]]){let ok=true;for(let i=0;i<w;i++)for(let j=0;j<h;j++)if(isRes(x+i,y+j))ok=false;if(!ok)continue;const o=Object.assign({w,h,wallH:58,roofH:30,ridge:(x+y)%2?'x':'y',floors:1,seed:S.seed+x*7+y,chimney:S.chimney?1:0,baseH:10,open:{L:[D(58,.5,.22,44)],R:[Wn(58,.5,.22)]}},S.house(9,false));o.wallH=58;o.floors=1;o.roofH=Math.min(o.roofH||30,36);bld(x,y,o);homes.push([x+w*.5,y+h+.5])}
  m.homes=homes;
  const P=(x,y,a,ex)=>{res(x,y);return prop(m,x,y,a,ex)};
  if(S.landmark)S.landmark(m,{P,res,isRes,G,T,R,addObj});
  if(S.dungeons)S.dungeons(m,{P,res,isRes,G,T,R,addObj});
  // fill the city: crates, barrels, gardens and other clutter in the free corners
  if(S.cityProps){let n=0;for(let k=0;k<400&&n<22;k++){const x=19+Math.floor(R()*19),y=19+Math.floor(R()*19);if(isRes(x,y)||m.solid[y*N+x])continue;const t=G(x,y);if(t===S.plaza||t===S.road||t===BRIDGE||t===WATER)continue;if((x>=26&&x<=30)||(y>=26&&y<=30))continue;
    let nearB=false;for(const [hx,hy] of homes)if(Math.abs(hx-x-.5)<1.2&&Math.abs(hy-y-.5)<1.2)nearB=true;if(nearB)continue;const [a,ex]=S.cityProps[Math.floor(R()*S.cityProps.length)];P(x,y,a,Object.assign({},ex||{}));n++}}
  if(S.decor){const tryP=(x,y,a,ex)=>{if(isRes(x,y)||m.solid[y*N+x]||(x>=27&&x<=29)||(y>=27&&y<=29))return null;return P(x,y,a,ex)};const dec=(x,y,a)=>{const [wx,wy]=wpx(x,y);decal(m,wx,wy,a)};S.decor(m,{P,tryP,dec,res,isRes,G,R})}
  // abandoned camps with a fire (light out in the wilds)
  for(const [cx,cy,i] of [[11,11,0],[44,13,1],[12,39,2],[22,49,3],[49,23,4],[36,46,5]]){let ok=true;for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)if(isRes(x,y)||m.solid[y*N+x]||G(x,y)===WATER)ok=false;if(!ok)continue;for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)res(x,y);
    prop(m,cx,cy,ART.campfire,{fire:{dx:0,dy:-4,s:5},light:{dx:0,dy:-8,r:160}});prop(m,cx+1,cy-1,ART.log,{block:null});addObj(m,{x:cx-.8,y:cy+1.2,k:cx+cy+.4,cv:ART.bedroll[i%2].cv,ox:ART.bedroll[i%2].ox,oy:ART.bedroll[i%2].oy});if(i%2){const t=ART.tent[i%3];addObj(m,{x:cx+1,y:cy+1,k:cx+cy+4,cv:t.cv,ox:t.ox,oy:t.oy,block:[[cx+1,cy+1],[cx+2,cy+1],[cx+1,cy+2],[cx+2,cy+2]],tall:1})}else prop(m,cx-1,cy-1,ART.crate)}
  // lights around the plaza and along the roads
  for(const [x,y] of [[23,23],[33,23],[23,33],[33,33],[26,20],[30,20],[26,36],[30,36],[20,26],[20,30],[36,26],[36,30]])if(!isRes(x,y)&&!m.solid[y*N+x])P(x,y,S.lamp.art,S.lamp.ex);
  for(const [x,y] of [[26,10],[30,4],[10,26],[4,30],[26,46],[30,52],[46,26],[52,30],[44,38],[26,4],[30,13],[13,30],[4,26],[30,43],[26,52],[43,30],[52,26],[47,34],[44,42],[26,15],[15,26],[30,41],[41,26]])if(!isRes(x,y)&&!m.solid[y*N+x]&&G(x,y)!==WATER)P(x,y,ART.torchpost,{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:120}});
  // portal stone next to the traveller
  P(24,31,ART.portalBase,{block:null,noShadow:1,portal:1,keep:1,light:{dx:0,dy:-28,r:100,cold:1}});
  // cave mouth (south-east)
  {const bl=[];for(let i=46;i<=48;i++)for(let j=45;j<=46;j++){bl.push([i,j]);res(i,j)}const ca=S.caveArt;const cave=addObj(m,{x:47.5,y:47,k:94.6,cv:ca.cv,ox:ca.ox,oy:ca.oy,block:bl,tall:1,light:{dx:-14,dy:-56,r:90}});m.acts.push({kind:'enter',to:S.cave,x:46.4,y:47.6,label:S.caveLabel,msg:S.caveMsg,obj:cave});m.shadows.push({e:1,x:47.5,y:47,rx:70,ry:18,dx:16,dy:0});for(let i=44;i<=49;i++)for(let j=44;j<=49;j++)res(i,j)}
  m.caveOut=[46.4,48.8];
  // nature
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=G(x,y);if(isRes(x,y)||m.solid[y*N+x])continue;if(x>=18&&x<=38&&y>=18&&y<=38)continue;if(t===S.road||t===BRIDGE||t===WATER)continue;
    const near=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const tt=G(x+dx,y+dy);return tt===S.road||tt===BRIDGE});const border=x<2||y<2||x>N-3||y>N-3;
    const pick=S.flora(t,R(),border,near,x,y,R);if(pick){const [art,tall,ex]=pick;prop(m,x,y,art,Object.assign({tall},ex||{}))}}
  // decals
  if(S.decal)for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=G(x,y);for(let k=0;k<2;k++){const r=R(),d=S.decal(t,r,R);if(d){const [wx,wy]=wpx(x+R(),y+R());decal(m,wx,wy,d)}}}
  // regions, spawns and city people
  const Z=S.zones;
  m.regions=[{n:S.city,r:[18,18,38,38],lv:'Zona segura',dg:0},{n:Z[4],r:[38,38,55,55],lv:'Níveis 8–12',dg:4},{n:Z[5],r:[42,0,55,14],lv:'Níveis 9–12',dg:4},{n:Z[0],r:[0,0,55,16],lv:'Níveis 1–4',dg:1},{n:Z[1],r:[0,17,17,38],lv:'Níveis 3–6',dg:1},{n:Z[2],r:[39,17,55,38],lv:'Níveis 4–8',dg:2},{n:Z[3],r:[0,39,55,55],lv:'Níveis 5–9',dg:2},{n:S.name,r:[0,0,55,55],lv:'Níveis 1–9',dg:1}];
  const M5=S.mobs;m.spawns=[[M5[0],[6,3,50,15],7],[M5[1],[3,20,15,36],4],[M5[1],[41,20,52,36],3],[M5[2],[41,20,52,36],3],[M5[2],[6,40,36,52],3],[M5[3],[6,40,36,52],4],[M5[4],[38,38,52,52],3],[M5[5],[45,4,52,11],1]];
  m.spawnPt=[27.5,31.2];m.temple=[27.5,31.2];m.safeR=[18,18,39,39];
  const V=S.people;m.npcDefs=[
    {id:S.id+'_viajante',n:V.travel[0],x:25.4,y:31.4,look:V.travel[1],role:'travel'},
    {id:S.id+'_mercador',n:V.shop[0],x:31.6,y:25.6,look:V.shop[1],role:'rshop',shop:S.shop},
    {id:S.id+'_curandeira',n:V.heal[0],x:25.4,y:25.6,look:V.heal[1],role:'temple'},
    {id:S.id+'_ancião',n:V.elder[0],x:31.6,y:31.6,look:V.elder[1],role:'quest',quests:S.questsB,after:V.elder[2]},
    {id:S.id+'_contratante',n:V.hunter[0],x:24.6,y:28.6,look:V.hunter[1],role:'quest',quests:S.questsA,after:V.hunter[2]},
    {id:S.id+'_guarda1',n:V.guard[0],x:30.8,y:19.4,look:V.guard[1],role:'talker',lines:V.guard[2]},
    {id:S.id+'_guarda2',n:V.guard[0]+' ',x:25.8,y:37.4,look:V.guard[1],role:'talker',lines:V.guard[2]},
    ...(V.out||[]).map(([n,x,y,look,role,extra],i)=>Object.assign({id:S.id+'_fora'+i,n,x,y,look,role},extra)),
    ...V.folk.map(([n,look],i)=>({id:S.id+'_morador'+i,n,x:28.5+(i?2:-2),y:28.5,look,role:'villager',route:i?[[31,28.5],[28.5,22],[34,28.4],[28.5,34.5]]:[[26,28.5],[28.5,34],[22,28.4],[28.5,22.5]],home:i%Math.max(1,homes.length)}))];
  return m}
// ---------- caves ----------
const LAYOUTS={A:{rooms:[[3,3,9,9],[10,5,14,6],[15,2,23,10],[18,11,19,15],[12,16,25,24],[26,19,28,20],[29,17,34,23],[18,25,19,28],[10,29,28,37],[4,12,8,24],[9,18,11,19],[30,26,35,34],[29,29,29,31]],throne:[19,30],boss:[19.5,33.5],pillars:[[13,31],[25,31],[13,35],[25,35]],rects:[[15,2,23,10],[12,16,25,24],[29,17,34,23],[4,12,8,24],[30,26,35,34]]},
  B:{rooms:[[3,3,9,9],[10,6,16,7],[17,3,25,11],[20,12,21,17],[13,18,28,26],[29,21,31,22],[32,18,36,26],[20,27,21,29],[14,30,27,37],[5,10,7,16],[3,17,11,24]],throne:[20,31],boss:[20.5,34.5],pillars:[[15,32],[26,32],[15,36],[26,36]],rects:[[17,3,25,11],[13,18,28,26],[32,18,36,26],[3,17,11,24],[13,18,28,26]]},
  C:{rooms:[[3,3,8,8],[9,5,30,6],[31,3,37,12],[33,13,34,20],[24,21,37,27],[22,23,23,24],[10,20,21,28],[15,29,16,31],[8,32,30,38]],throne:[19,33],boss:[19.5,35.6],pillars:[[11,33],[27,33],[11,37],[27,37]],rects:[[31,3,37,12],[24,21,37,27],[10,20,21,28],[9,5,30,6],[24,21,37,27]]}};
function addBossChest(m,ART){if(!m.boss)return;const [bx,by]=m.boss[1];for(const [dx,dy] of [[0,3],[2,2],[-2,2],[3,0],[-3,0],[0,-3],[2,-2],[-2,-2]]){const x=Math.floor(bx+dx),y=Math.floor(by+dy);if(!inb(m,x,y)||m.solid[y*m.w+x]||tAt(m,x,y)===VOID||tAt(m,x,y)===WATER)continue;if(m.objs.some(o=>Math.floor(o.x)===x&&Math.floor(o.y)===y))continue;const o=prop(m,x,y,ART.chest);m.acts.push({kind:'bchest',id:m.id,x:x+.5,y:y+.5,obj:o,label:'Abrir o baú do chefe'});return}}
function genCaveR(ART,S){const m=makeMap(S.id,40,40,{name:S.name,dark:S.dark||.7,bg:0x0a0806,indoor:1,tint:S.tint,soft:S.soft,darkCol:S.darkCol,parent:S.parent});const R=mulberry(S.seed);
  m.terr.fill(VOID);const room=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)m.terr[y*40+x]=S.floor};const LY=LAYOUTS[S.layout||'A'];
  for(const r of LY.rooms)room(...r);
  for(let i=0;i<1600;i++)if(m.terr[i]===VOID)m.solid[i]=1;
  const isF=(x,y)=>tAt(m,x,y)===S.floor,WL=ART[S.walls];
  for(let y=0;y<40;y++)for(let x=0;x<40;x++){if(isF(x,y))continue;let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(isF(x+i,y+j))near=true;if(!near)continue;
    const short=isF(x-1,y)||isF(x,y-1)||isF(x-1,y-1),front=isF(x+1,y)||isF(x,y+1),r=R(),deco=!short&&front?(r<.18?'torch':r<.24?'beam':null):null;
    const art=WL[(short?'s':'t')+(deco||'')+((x*7+y)%3)]||WL[(short?'s':'t')+((x*7+y)%3)];
    const o=addObj(m,{x:x+.5,y:y+.5,k:x+y+1+(short?.4:0),cv:art.cv,ox:art.ox,oy:art.oy,tall:short?0:1,wall:1});if(art.flame){o.fire={dx:art.flame[0],dy:art.flame[1],s:3,pal:S.flame};o.light={dx:art.flame[0],dy:art.flame[1]+4,r:190,cold:S.flame==='ghost'?1:0}}if(art.light&&!art.flame)o.light={dx:art.light[0],dy:art.light[1],r:150,cold:1}}
  const P=(x,y,a,ex)=>prop(m,x,y,a,ex);
  P(4,4,ART.stairs,{block:[[4,4]],light:{dx:0,dy:-20,r:120,cold:1}});m.acts.push({kind:'exit',x:5,y:5,label:'Voltar à superfície',to:S.parent,at:S.out});
  P(LY.throne[0],LY.throne[1],S.throne);for(const [x,y] of LY.pillars)P(x,y,S.pillar);
  for(const [x,y,a,ex] of S.props)if(isF(x,y)&&!m.solid[y*40+x])P(x,y,a,ex);
  for(let i=0;i<34;i++){const x=3+R()*32,y=3+R()*34;if(isF(Math.floor(x),Math.floor(y))){const [wx,wy]=wpx(x,y);const d=S.decals[i%S.decals.length];if(d)decal(m,wx,wy,d)}}
  m.regions=[{n:S.name,r:[0,0,40,40],lv:S.lv||'Níveis 8–14',dg:S.dg||3}];const RC=LY.rects;
  m.spawns=[[S.mobs[0],RC[0],3],[S.mobs[0],RC[1],2],[S.mobs[1],RC[1],2],[S.mobs[1],RC[2],1],[S.mobs[2],RC[3],2],[S.mobs[2],RC[4],2],[S.mobs[0],RC[4],1]];
  m.boss=[S.boss,LY.boss];m.spawnPt=[6.5,6.5];m.npcDefs=[];
  return m}
// ---------- the four regions ----------
const LAMP_WARM=a=>({art:a.torchpost,ex:{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:120}}});
function regionSpecs(A){const SK=SKINS,b=(x,y)=>x<3||y<3||x>52||y>52;
  return{
  gelo:{id:'gelo',name:'Picos de Gelvar',city:'Gelvar',seed:7101,bg:0x2a3440,climate:'snow',mood:'neve',road:SNOWPATH,plaza:SNOWCOB,gradeTint:0xc4d4ec,oSoft:'rgba(70,120,190,.16)',snowRoof:1,chimney:1,
    ground:(x,y)=>(!b(x,y)&&Math.hypot(x-28,y-28)>13&&vn(x*.13,y*.13,81)>.66)?ICE:SNOW,
    wall:A.palSnow,houses:[[20,19,4,3],[32,19,4,3],[20,33,4,3],[32,33,4,3]],
    buildings:(()=>{const L=(w,h,wh,fl,wall,roof,ex)=>Object.assign({w,h,wallH:wh,floors:fl,roofH:wh>90?48:42,style:'log',wall,timber:0x2e1c12,roof,roof2:tone(roof,-.18),chimney:1,door:0x5a3622,stoneA:0x6a6a70,stoneB:0x54545c},ex||{});
      return[[20,19,L(5,3,74,1,0x6a4630,0x46383a,{ridge:'x',roofH:52})],[32,19,L(4,3,116,2,0x5e4230,0x3a3036)],[20,33,L(4,3,70,1,0x725036,0x4a3c36)],[32,33,L(4,3,112,2,0x684830,0x40343a,{ridge:'y'})],
        [25,19,L(2,2,62,1,0x6e4a32,0x4a3a36)],[36,23,L(2,3,60,1,0x5a3e2a,0x3e3434)],[21,31,L(2,2,60,1,0x76523a,0x44383a)],[36,31,L(2,2,62,1,0x684630,0x4a3c3a)],[19,23,L(2,2,58,1,0x6a4834,0x3c3236)],[34,36,L(2,2,58,1,0x5e4230,0x463a38)]]})(),
    house:(i,two)=>({style:'timber',wall:0x6a4a34,timber:0x2e1e14,roof:0x4a3a3a,roof2:0x3a2c2c}),
    decor:(m,h)=>{for(const [x,y] of [[24,24],[32,24],[24,32],[32,32]])h.tryP(x,y,A.campfire,{fire:{dx:0,dy:-4,s:4},light:{dx:0,dy:-8,r:130}});for(const [x,y] of [[21,22],[23,22],[33,22],[35,22]])h.tryP(x,y,A.bannerBlue);for(const [x,y] of [[22,26],[34,30],[25,35]])h.tryP(x,y,A.runestone[(x+y)%3]);for(let i=0;i<26;i++)h.dec(19+h.R()*18,19+h.R()*18,A.dec2.prints)},
    landmark:(m,h)=>{h.P(28,28,A.iceObelisk,{light:{dx:0,dy:-50,r:150,cold:1}});for(const [x,y] of [[24,26],[33,31]])h.P(x,y,A.snowman)},
    lamp:{art:A.lampSnow,ex:{cvN:A.lampSnowN.cv,light:{dx:0,dy:-54,r:130,night:1},light2:{dx:0,dy:-6,r:95,night:1,a:.5}}},caveArt:A.caveIce,cave:'gruta_gelo',caveLabel:'Entrar na Gruta Congelada',caveMsg:'O vento para de repente. Lá dentro, o gelo canta baixinho.',
    flora:(t,r,border,near,x,y,R)=>{if(t===ICE)return r<.02?[A.iceCrystal[r*100%2|0],0,{light:{dx:0,dy:-20,r:70,cold:1}}]:null;if(border&&r<.82)return[A.pineSnow[R()*4|0],1];if(near)return null;
      return r<.075?[A.pineSnow[R()*4|0],1]:r<.09?[A.deadSnow[R()*2|0],1]:r<.11?[A.rockSnow[R()*4|0],0]:r<.125?[A.bushSnow[R()*4|0],0]:r<.13?[A.iceCrystal[R()*2|0],0,{light:{dx:0,dy:-20,r:70,cold:1}}]:null},
    zones:['Encosta do Vento','Bosque de Pinheiros','Lago Congelado','Planalto Branco','Garganta de Gelo','Pico do Urso'],
    mobs:['raposa_neve','lobo_neve','saqueador_gelo','cacador_gelo','yeti','urso_polar'],shop:'gelvar',questsA:['gelo_lobos','gelo_yeti'],questsB:['gelo_rainha'],
    cityProps:[[A.barrel[0]],[A.barrel[1]],[A.crate],[A.snowman],[A.bushSnow[0]],[A.rockSnow[1]],[A.hay],[A.iceCrystal[0],{light:{dx:0,dy:-20,r:70,cold:1}}]],
    dungeons:(m,h)=>{for(let y=4;y<=9;y++)for(let x=4;x<=9;x++)h.res(x,y);h.P(6,6,A.iceObelisk,{light:{dx:0,dy:-50,r:170,cold:1}});m.acts.push({kind:'enter',to:'caverna_mamute',x:6.6,y:7.6,label:'Tocar o cristal que canta',needQ:'gelo_mamute',msg:'O cristal vibra numa nota grave e a neve atrás dele desaba. Uma passagem desce para o escuro.'})},
    people:{travel:['Hjalmar, o Guardião do Portal',{skin:SK[0],hair:0xd8d0c0,hs:'long',beard:1,chest:0x3a4a6a,ct:'robe',robe:1,trim:0xbfe8ff,legs:0x2a3450,boots:0x2a2018,hd:'furhat',hdCol:0xd8d0c4,wt:'staff',wcol:0x8ab8d8,orb:0x9ae8ff}],
      shop:['Sigrid, a Mercadora',{skin:SK[0],hair:0xe8c070,hs:'long',chest:0x8a3a2a,ct:'leather',legs:0x4a3a2a,boots:0x3a2a1a,hd:'furhat',hdCol:0xc8c0b4}],
      heal:['Mãe Astrid',{skin:SK[0],hair:0xe8e8e8,hs:'long',chest:0xd8dce4,ct:'robe',robe:1,trim:0x5ab0e0,legs:0xd8dce4,boots:0x8a7a6a,hd:'hood',hdCol:0xe8eef4}],
      elder:['Jarl Eirik',{skin:SK[0],hair:0xc8a050,hs:'long',beard:1,chest:0x6a2a2a,ct:'chain',legs:0x3a2a2a,boots:0x2a1a14,hd:'furhat',hdCol:0x8a6a4a,cape:0x5a2a2a,wt:'axe',wcol:0xc8d0dc},'Gelvar está em dívida com você.'],
      hunter:['Ulf, o Caçador',{skin:SK[0],hair:0x8a5a2a,hs:'short',beard:1,chest:0xd8dce4,ct:'leather',legs:0x6a6a74,boots:0x3a2a1a,hd:'hood',hdCol:0xe8eef4,wt:'bow',wcol:0xe8e0d0,sh:'quiver'},'As trilhas estão mais seguras graças a você.'],
      guard:['Guarda de Gelvar',{skin:SK[0],hair:0x8a6a4a,hs:'short',beard:1,chest:0x8a909a,ct:'chain',legs:0x4a4a5a,boots:0x2a2a30,hd:'furhat',hdCol:0xd8d0c4,wt:'spear',wcol:0x8a8a98,sh:'kite',shCol:0x2e4a8a},['Fique de olho no céu. Quando neva forte, os yetis descem.','O Jarl paga bem quem ajuda a vila.','Já ouviu falar do cristal que canta? Bobagem de velha, eu acho.']],
      out:[['Velha Runa',12.5,9.5,{skin:SK[0],hair:0xe8e8e8,hs:'long',chest:0x5a4a6a,ct:'robe',robe:1,legs:0x5a4a6a,boots:0x3a2a1a,hd:'hood',hdCol:0x6a5a7a},'quest',{quests:['gelo_mamute'],after:'O mamute dorme de novo, graças a você.'}],
        ['Lenhador Gunnar',41.5,33.5,{skin:SK[0],hair:0x8a5a2a,hs:'short',beard:1,chest:0x8a3a2a,ct:'leather',legs:0x4a3a2a,boots:0x3a2a1a,hd:'furhat',hdCol:0x8a6a4a,wt:'axe',wcol:0xb8c0cc},'talker',{lines:['O gelo do lago aguenta você, mas não aguenta um urso.','Corto lenha aqui faz vinte anos. Os pinheiros do norte cantam quando venta.','Se for para o Planalto, leve poção. Os yetis batem forte.']}]],
      folk:[['Bjorn',{skin:SK[0],hair:0xc85a2a,hs:'short',beard:1,chest:0x5a4a3a,ct:'leather',legs:0x4a3a2a,boots:0x3a2a1a,hd:'furhat',hdCol:0x8a6a4a}],['Freya',{skin:SK[1],hair:0xe8d8a0,hs:'long',chest:0x3a5a7a,ct:'robe',robe:1,legs:0x3a5a7a,boots:0x3a2a1a}]]}},
  japao:{id:'japao',name:'Vale de Kazemura',city:'Kazemura',seed:7202,bg:0x1e2a1e,climate:'temperate',gradeTint:0xf0d4dc,oSoft:'rgba(200,110,140,.12)',mood:'japao',road:DIRT,plaza:BRICK,
    ground:(x,y)=>(!b(x,y)&&((x>=7&&x<=20&&y>=5&&y<=12)||(x>=34&&x<=46&&y>=5&&y<=12)))?FIELD:JGRASS,
    water:(T,G)=>{for(let y=0;y<56;y++){const rx=40+Math.round(Math.sin(y/6)*1.3);for(let x=rx;x<=rx+1;x++)T(x,y,WATER)}for(let y=36;y<48;y++)for(let x=6;x<20;x++)if(((x+.5-12.5)/5.5)**2+((y+.5-42)/4.4)**2<1)T(x,y,WATER)},
    wall:A.fenceDark,houses:[[20,19,4,3],[20,33,4,3],[32,33,4,3]],
    buildings:(()=>{const J=(w,h,wh,fl,ex)=>Object.assign({w,h,wallH:wh,floors:fl,roofH:wh>90?40:34,style:'shoji',wall:0xece4d0,timber:0x2e1e16,roof:0x3a404c,roof2:0x2a303a,roofStyle:'kawara',door:0x6a3a22,stoneA:0x6a6a64,stoneB:0x58585a,baseH:10},ex||{});
      return[[20,19,J(5,3,70,1,{ridge:'x'})],[20,33,J(4,3,108,2,{roof:0x2e3a4a})],[32,33,J(4,3,70,1,{roof:0x4a3a3a,roof2:0x3a2c2c})],
        [25,19,J(2,2,60,1)],[36,24,J(2,2,60,1,{roof:0x3a4a3a})],[21,31,J(2,2,60,1)],[36,31,J(2,3,104,2)],[19,24,J(2,2,58,1,{roof:0x4a3a3a})],[34,36,J(2,2,58,1)]]})(),
    house:(i,two)=>({style:'timber',wall:0xe8e0cc,timber:0x2a1c14,roof:0x2e3440,roof2:0x242a34,gable:0xe8e0cc}),
    decor:(m,h)=>{for(let t=22;t<=34;t+=1.6){h.dec(28.5,t,A.dec2.step[Math.floor(t)%3]);h.dec(t,28.5,A.dec2.step[Math.floor(t+1)%3])}for(let i=0;i<40;i++)h.dec(19+h.R()*18,19+h.R()*18,A.dec2.petals);for(const [x,y] of [[22,22],[35,26],[23,35],[33,30]])h.tryP(x,y,A.sakura[(x+y)%4],{tall:1})},
    landmark:(m,h)=>{const pg=A.pagoda;const bl=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++){bl.push([32+i,20+j]);h.res(32+i,20+j)}h.addObj(m,{x:32,y:20,k:55,cv:pg.cv,ox:pg.ox,oy:pg.oy,block:bl,tall:1});m.shadows.push({pts:bldShadow(3,3,90).map(p=>{const [ax,ay]=wpx(32,20);return[p[0]+ax,p[1]+ay]})});
      h.P(28,28,A.toro,{light:{dx:0,dy:-29,r:120}});for(const [x,y] of [[24,24],[32,32],[24,32],[32,24]])if(!h.isRes(x,y))h.P(x,y,A.toro,{light:{dx:0,dy:-29,r:110}});
      for(const y of [16,40]){const t=A.torii;h.addObj(m,{x:28.5,y:y+.5,k:28+y+1.2,cv:t.cv,ox:t.ox,oy:t.oy,block:[[26,y],[30,y]],tall:1});h.res(26,y);h.res(30,y)}},
    lamp:{art:A.toro,ex:{light:{dx:0,dy:-29,r:110}}},caveArt:A.caveVolc,cave:'caverna_oni',caveLabel:'Entrar na Caverna do Oni',caveMsg:'Cheiro de enxofre e incenso velho. Tambores ao longe.',
    flora:(t,r,border,near,x,y,R)=>{if(t===FIELD)return null;if(border&&r<.82)return[R()<.5?A.bamboo[R()*3|0]:A.pine[R()*4|0],1];if(near)return null;
      return r<.05?[A.sakura[R()*4|0],1]:r<.075&&x<20?[A.bamboo[R()*3|0],1]:r<.09?[A.pine[R()*4|0],1]:r<.1?[A.autumn[R()*3|0],1]:r<.115?[A.rock[R()*4|0],0]:r<.13?[A.bush[R()*4|0],0]:null},
    decal:(t,r,R)=>t===JGRASS?(r<.15?A.dec.tuft[R()*3|0]:r<.18?A.dec.flow[R()*4|0]:null):null,
    zones:['Arrozais do Norte','Bambuzal Sussurrante','Margens do Riacho','Lagoa das Carpas','Desfiladeiro Vermelho','Pico do Tengu'],
    mobs:['tanuki','kitsune','ronin','ninja','oni','tengu'],shop:'kazemura',questsA:['jp_kitsune','jp_oni'],questsB:['jp_shogun'],
    cityProps:[[A.toro,{light:{dx:0,dy:-29,r:100}}],[A.bamboo[0],{tall:1}],[A.bush[1]],[A.barrel[0]],[A.crate],[A.sakura[0],{tall:1}],[A.rock[2]],[A.foxShrine]],
    dungeons:(m,h)=>{for(let y=21;y<=26;y++)for(let x=3;x<=8;x++)h.res(x,y);h.P(5,23,A.foxShrine,{light:{dx:0,dy:-14,r:80}});for(const [x,y] of [[4,25],[7,22]])h.P(x,y,A.toro,{light:{dx:0,dy:-29,r:100}});m.acts.push({kind:'enter',to:'santuario_kyubi',x:5.5,y:24.4,label:'Fazer uma reverência ao santuário',needQ:'jp_kyubi',msg:'Nove chamas azuis acendem em volta do santuário. O chão se abre numa escada de pedra.'})},
    people:{travel:['Mestra Hana, a Guardiã do Portal',{skin:SK[1],hair:0x1a1418,hs:'long',chest:0xe8e2d4,ct:'robe',robe:1,trim:0xc8302a,legs:0xc8302a,boots:0x2a2a30,wt:'staff',wcol:0x6a4a2a,orb:0xff8aa8}],
      shop:['Kenji, o Mercador',{skin:SK[1],hair:0x1a1418,hs:'short',chest:0x3a4a6a,ct:'robe',robe:1,trim:0xe8e0cc,legs:0x2a2a3a,boots:0x2a1e14,hd:'kasa',hdCol:0xc8a858}],
      heal:['Sacerdotisa Aiko',{skin:SK[1],hair:0x1a1418,hs:'long',chest:0xf0ece0,ct:'robe',robe:1,trim:0xc8302a,legs:0xc8302a,boots:0xe8e0cc}],
      elder:['Daimyō Takeda',{skin:SK[1],hair:0x1a1418,hs:'long',chest:0x2a2a3a,ct:'plate',trim:0xd8b048,legs:0x2a2a3a,boots:0x1a1418,hd:'kabuto',hdCol:0x2a2a34,hdCol2:0xd8b048,wt:'sword',wcol:0xe8eef8},'Kazemura honra seu nome.'],
      hunter:['Sacerdote Haru',{skin:SK[1],hair:0x1a1418,hs:'bald',chest:0xf0ece0,ct:'robe',robe:1,trim:0xc8302a,legs:0xc8302a,boots:0xe8e0cc},'Os espíritos do vale estão em paz.'],
      guard:['Guarda de Kazemura',{skin:SK[1],hair:0x1a1418,hs:'long',chest:0x6a1a22,ct:'plate',trim:0xd8b048,legs:0x2a2a3a,boots:0x1a1418,hd:'kabuto',hdCol:0x2a2a34,hdCol2:0xd8b048,wt:'spear',wcol:0x8a8a98},['As lanternas ficam acesas a noite toda. Os espíritos gostam.','Cuidado com os ninjas nas Margens do Riacho.','O monge do bambuzal fala por enigmas. Mas nunca mente.']],
      out:[['Monge Sora',10.5,24.5,{skin:SK[1],hs:'bald',chest:0xd8902a,ct:'robe',robe:1,legs:0xd8902a,boots:0x6a4a2a,wt:'staff',wcol:0x6a4a2a},'quest',{quests:['jp_kyubi'],after:'O bambuzal agradece seu silêncio.'}],
        ['Pescador Goro',16.5,36.5,{skin:SK[1],hair:0x1a1418,hs:'short',chest:0x3a5a7a,ct:'cloth',legs:0x2a3a4a,boots:0x3a2a1a,hd:'kasa',hdCol:0xc8a858},'talker',{lines:['As carpas desta lagoa vivem mais que eu.','À noite, raposas brincam na beira da água. Não olhe nos olhos delas.','Os kappas roubam pepinos. E às vezes pescadores.']}]],
      folk:[['Taro',{skin:SK[1],hair:0x1a1418,hs:'short',chest:0x6a7a4a,ct:'cloth',legs:0x4a4a3a,boots:0x3a2a1a,hd:'kasa',hdCol:0xc8a858}],['Yumi',{skin:SK[1],hair:0x1a1418,hs:'long',chest:0x8a2a3a,ct:'robe',robe:1,trim:0xe8c050,legs:0x8a2a3a,boots:0x3a2a1a}]]}},
  deserto:{id:'deserto',name:'Dunas de Al-Rimal',city:'Qasr al-Nur',seed:7303,bg:0x3a2e1e,climate:'desert',gradeTint:0xfcd8a0,oSoft:'rgba(230,150,60,.18)',mood:'deserto',road:SAND,plaza:STILE,
    ground:(x,y)=>vn(x*.14,y*.14,82)>.6?SAND:DUNE,
    water:(T,G)=>{for(const [cx,cy,r] of [[12,13,3.6],[44,40,2.6]])for(let y=0;y<56;y++)for(let x=0;x<56;x++){const d=Math.hypot(x+.5-cx,y+.5-cy);if(d<r)T(x,y,WATER);else if(d<r+2.2&&G(x,y)!==WATER)T(x,y,GRASS)}},
    wall:A.fenceSand,houses:[[20,19,4,3],[20,33,4,3],[32,33,4,3]],
    buildings:(()=>{const Q=(w,h,wh,fl,wall,door,ex)=>Object.assign({w,h,wallH:wh,floors:fl,roofH:0,parapet:1,style:'adobe',wall,stoneA:tone(wall,-.05),stoneB:tone(wall,-.15),timber:0x5a3a22,door,baseH:0},ex||{});
      return[[20,19,Q(4,3,70,1,0xe2cca4,0x2a6ab0,{dome:0x2a8a9a})],[20,33,Q(4,3,100,2,0xd8bc92,0x8a2a2a)],[32,33,Q(4,3,96,2,0xead6b4,0x2a8a9a,{dome:0xd8b048})],
        [25,19,Q(2,2,64,1,0xdcc29a,0x3a6ab0)],[36,24,Q(2,2,60,1,0xe6d0aa,0x8a3a2a)],[21,31,Q(2,2,62,1,0xd4b68c,0x2a6ab0,{dome:0x3a6ab0})],[36,31,Q(2,3,92,2,0xe0c8a0,0x2a8a9a)],[19,24,Q(2,2,58,1,0xd8c098,0x6a2a5a)],[34,36,Q(2,2,58,1,0xe8d4b0,0x2a6ab0)]]})(),
    house:(i,two)=>({style:'stone',stoneA:0xd8c09a,stoneB:0xc0a47c,roof:0xc8a878,roof2:0xb8966a,roofH:12}),
    decor:(m,h)=>{for(const [x,y,i] of [[24.6,24.4,0],[32.4,31.2,1],[25.2,23,2],[30.6,25.2,1],[26,32.6,0]])h.dec(x,y,A.dec2.rug[i]);for(const [x,y] of [[22,22],[23,36],[36,26],[19,30],[37,22]])h.tryP(x,y,A.palm[(x+y)%3],{tall:1});for(const [x,y] of [[24,33],[33,24]])h.tryP(x,y,A.pots[(x+y)%2])},
    landmark:(m,h)=>{const pl=A.palace;const bl=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++){bl.push([32+i,19+j]);h.res(32+i,19+j)}h.addObj(m,{x:32,y:19,k:55,cv:pl.cv,ox:pl.ox,oy:pl.oy,block:bl,tall:1});m.shadows.push({pts:bldShadow(4,4,110).map(p=>{const [ax,ay]=wpx(32,19);return[p[0]+ax,p[1]+ay]})});
      h.P(28,28,A.fountain);A.stallDesert.forEach((st,i)=>{const [x,y]=[[23,25],[32,30],[24,22]][i];h.res(x,y);h.res(x+1,y);prop(m,x,y,st,{block:[[x,y],[x+1,y]],x:x+1,y:y+.5,k:x+y+1.5})});for(const [x,y] of [[25,24],[31,32],[26,33]])if(!h.isRes(x,y))h.P(x,y,A.pots[(x+y)%2])},
    lamp:{art:A.lampBrass,ex:{cvN:A.lampBrassN.cv,light:{dx:0,dy:-54,r:130,night:1},light2:{dx:0,dy:-6,r:95,night:1,a:.5}}},caveArt:A.caveSand,cave:'tumba',caveLabel:'Descer à Tumba do Faraó',caveMsg:'Areia escorre pelos degraus. As paredes estão cobertas de símbolos que parecem se mexer.',
    flora:(t,r,border,near,x,y,R)=>{if(t===GRASS)return r<.3?[A.palm[R()*3|0],1]:r<.4?[A.bush[R()*4|0],0]:null;if(border&&r<.7)return R()<.75?[A.rockSand[R()*4|0],0]:[A.palm[R()*3|0],1];if(near)return null;
      return r<.012?[A.palm[R()*3|0],1]:r<.04?[A.dryBush[R()*4|0],0]:r<(t===SAND?.08:.055)?[A.rockSand[R()*4|0],0]:null},
    decal:(t,r,R)=>(t===SAND&&r<.05)?A.dec.peb:null,
    zones:['Oásis do Norte','Mar de Areia','Rochedos Vermelhos','Caminho das Caravanas','Vale dos Reis','Duna da Serpente'],
    mobs:['escorpiao','hiena','saqueador_duna','atirador_duna','guardiao_arenito','serpente_areia'],shop:'qasr',questsA:['ds_escorp','ds_ferrao'],questsB:['ds_farao','ds_anubis'],
    cityProps:[[A.pots[0]],[A.pots[1]],[A.crate],[A.palm[0],{tall:1}],[A.dryBush[0]],[A.barrel[1]],[A.rockSand[2]]],
    dungeons:(m,h)=>{const x0=4,y0=44,w=6;const bl=[];for(let y=y0-1;y<=y0+w+1;y++)for(let x=x0-1;x<=x0+w+1;x++)h.res(x,y);for(let j=0;j<w;j++)for(let i=0;i<w;i++)bl.push([x0+i,y0+j]);const py=A.pyramid;h.addObj(m,{x:x0,y:y0,k:x0+y0+w,cv:py.cv,ox:py.ox,oy:py.oy,block:bl,tall:1});m.shadows.push({pts:bldShadow(w,w,120).map(p=>{const [ax,ay]=wpx(x0,y0);return[p[0]+ax,p[1]+ay]})});
      for(const [x,y] of [[6,51],[8,51]])h.P(x,y,A.torchpost,{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:130}});m.acts.push({kind:'enter',to:'piramide_akhet',x:7,y:50.6,label:'Entrar na Pirâmide de Akhet',msg:'O ar lá dentro é frio como pedra de túmulo. Algo pesa cada passo seu.'})},
    people:{travel:['Nadira, a Guardiã do Portal',{skin:SK[2],hair:0x1a1418,hs:'long',chest:0x2a4a8a,ct:'robe',robe:1,trim:0xe8c050,legs:0x2a4a8a,boots:0x4a3222,hd:'turban',hdCol:0xe8e0cc,wt:'staff',wcol:0xc8a050,orb:0xffd060}],
      shop:['Karim, o Mercador',{skin:SK[2],hair:0x1a1418,hs:'short',beard:1,chest:0x8a3a2a,ct:'robe',robe:1,trim:0xe8c050,legs:0x5a3a2a,boots:0x4a3222,hd:'turban',hdCol:0xe8e0cc}],
      heal:['Sábia Layla',{skin:SK[2],hair:0x1a1418,hs:'long',chest:0xe8e0cc,ct:'robe',robe:1,trim:0x2a8a9a,legs:0xe8e0cc,boots:0x8a6a4a,hd:'hood',hdCol:0x2a8a9a}],
      elder:['Sultana Zahra',{skin:SK[2],hair:0x1a1418,hs:'long',chest:0x2a8a9a,ct:'robe',robe:1,trim:0xe8c050,legs:0x2a8a9a,boots:0xd8b048,hd:'crown',hdCol:0xe8c050},'Qasr al-Nur canta seu nome nas praças.'],
      hunter:['Boticário Idris',{skin:SK[2],hair:0x1a1418,hs:'short',beard:1,chest:0x6a3a5a,ct:'robe',robe:1,trim:0xe8c050,legs:0x4a2a3a,boots:0x4a3222,hd:'turban',hdCol:0x6a3a5a},'Meus antídotos salvaram muita gente.'],
      guard:['Guarda de Qasr',{skin:SK[2],hair:0x1a1418,hs:'short',beard:1,chest:0xd8b048,ct:'chain',legs:0xe8e0c8,boots:0x4a3222,hd:'turban',hdCol:0xe8e0cc,wt:'spear',wcol:0x8a8a98,sh:'kite',shCol:0x2a8a9a},['Não durma no deserto sem fogueira. Os escorpiões gostam de calor.','A pirâmide do sudoeste? Ninguém que entrou voltou falando.','O oásis do norte é o lugar mais bonito que você vai ver.']],
      out:[['Caravaneiro Faris',13.5,18.5,{skin:SK[2],hair:0x1a1418,hs:'short',beard:1,chest:0x8a6a4a,ct:'cloth',legs:0x6a5a3a,boots:0x4a3222,hd:'turban',hdCol:0xc8b088},'talker',{lines:['Três semanas de caravana e o oásis ainda me emociona.','Viu uma serpente de areia? Corra para o lado, nunca em linha reta.','Dizem que a pirâmide guarda a balança que pesa as almas.']}],
        ['Arqueóloga Selma',12.5,42.5,{skin:SK[0],hair:0xc8984e,hs:'long',chest:0xb89868,ct:'leather',legs:0x6a5a3a,boots:0x4a3222,hd:'straw',hdCol:0xc8a858},'talker',{lines:['Estou estudando a pirâmide há meses. Os símbolos falam de um juiz com cabeça de chacal.','Se entrar lá, não toque nos jarros. Confie em mim.','A tumba do sudeste é menor, mas o faraó de lá acordou mal-humorado.']}]],
      folk:[['Samir',{skin:SK[2],hair:0x1a1418,hs:'short',chest:0xc8b088,ct:'cloth',legs:0x8a6a4a,boots:0x4a3222,hd:'turban',hdCol:0x3a6ab0}],['Amira',{skin:SK[2],hair:0x1a1418,hs:'long',chest:0x9a2a5a,ct:'robe',robe:1,legs:0x9a2a5a,boots:0x4a3222}]]}},
  selva:{id:'selva',name:'Selva de Yara',city:'Aldeia do Rio',seed:7404,bg:0x0e1a0e,climate:'jungle',mood:'selva',road:MUD,plaza:PACKED,gradeTint:0xb4dcac,oSoft:'rgba(30,120,70,.2)',
    ground:()=>JUNGLE,
    water:(T,G)=>{for(let y=0;y<56;y++){const rx=41+Math.round(Math.sin(y/5.5)*2.6);for(let x=rx;x<=rx+2;x++)T(x,y,WATER);for(const x of [rx-1,rx+3])if(G(x,y)!==WATER)T(x,y,MUD)}},
    wall:A.pal,houses:[[20,19,3,3],[33,19,3,3],[20,34,3,3],[33,34,3,3]],
    buildings:(()=>{const B=(w,h,ex)=>Object.assign({w,h,wallH:56,floors:1,roofH:58,style:'bamboo',wall:0xb89a5a,timber:0x5a3a1a,roof:0xc8a858,roof2:0x9a7a38,roofStyle:'thatch',door:0x6a4a2a,stoneA:0x4a3020,stoneB:0x3a2414,baseH:14},ex||{});
      return[[20,19,B(4,3,{ridge:'x',roofH:64})],[33,19,B(3,3,{wall:0xa88a4a})],[20,33,B(3,3,{roof:0xb89848})],[33,33,B(4,3,{ridge:'y',roofH:62,wall:0xc0a464})],
        [25,19,B(2,2,{roofH:46})],[36,24,B(2,2,{roofH:46,wall:0xa8884a})],[21,31,B(2,2,{roofH:44})],[37,30,B(1,2,{roofH:40})],[19,24,B(2,2,{roofH:44,roof:0xb89848})],[34,37,B(2,1,{roofH:36})]]})(),
    house:(i,two)=>({style:'timber',wall:0x9a7a4a,timber:0x4a3018,roof:0xb89848,roof2:0x9a7a38,roofH:two?54:48,floors:1,wallH:64}),
    decor:(m,h)=>{for(const [x,y] of [[24,24],[32,24],[24,32],[32,32]])h.tryP(x,y,A.torchpost,{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:120}});for(let i=0;i<40;i++)h.dec(19+h.R()*18,19+h.R()*18,A.dec2.leaves);for(const [x,y] of [[22,22],[35,26],[23,36],[36,35]])h.tryP(x,y,A.jungle[(x+y)%6],{tall:1})},
    landmark:(m,h)=>{h.P(28,28,A.campfire,{fire:{dx:0,dy:-4,s:6},light:{dx:0,dy:-8,r:160}});for(const [x,y] of [[25,25],[31,31]])h.P(x,y,A.totem);for(const [x,y] of [[31,24],[24,32]])h.P(x,y,A.log,{block:null})},
    lamp:LAMP_WARM(A),caveArt:A.caveMoss,cave:'templo_selva',caveLabel:'Entrar no Templo Perdido',caveMsg:'Raízes engolem as pedras antigas. Algo grande respira lá no fundo.',
    flora:(t,r,border,near,x,y,R)=>{if(t===MUD)return r<.04?[A.fern[R()*4|0],0]:null;if(border&&r<.9)return[R()<.6?A.jungle[R()*6|0]:A.jungleTall[R()*4|0],1];if(near)return r<.06?[A.fern[R()*4|0],0]:null;
      return r<.12?[A.jungle[R()*6|0],1]:r<.16?[A.jungleTall[R()*4|0],1]:r<.26?[A.fern[R()*4|0],0]:r<.272?[A.giantFlower[R()*3|0],0]:r<.276?[A.ruin,1]:r<.28?[A.stoneMoss[R()*3|0],1]:null},
    decal:(t,r,R)=>t===JUNGLE?(r<.2?A.dec.ftuft:r<.23?A.dec.mush:null):null,
    zones:['Clareira dos Sapos','Mata Fechada','Beira do Rio','Igapó','Ruínas Engolidas','Coração da Selva'],
    mobs:['sapo','onca','homem_planta','planta_cuspideira','jacare','boitata'],shop:'aldeia',questsA:['sv_sapo','sv_seiva'],questsB:['sv_boitata','sv_mapinguari'],
    cityProps:[[A.fern[0]],[A.fern[2]],[A.giantFlower[0]],[A.giantFlower[2]],[A.crate],[A.barrel[0]],[A.log,{block:null}],[A.totem]],
    dungeons:(m,h)=>{const x0=4,y0=44,w=6;const bl=[];for(let y=y0-1;y<=y0+w+1;y++)for(let x=x0-1;x<=x0+w+1;x++)h.res(x,y);for(let j=0;j<w;j++)for(let i=0;i<w;i++)bl.push([x0+i,y0+j]);const py=A.stepPyramid;h.addObj(m,{x:x0,y:y0,k:x0+y0+w,cv:py.cv,ox:py.ox,oy:py.oy,block:bl,tall:1});m.shadows.push({pts:bldShadow(w,w,120).map(p=>{const [ax,ay]=wpx(x0,y0);return[p[0]+ax,p[1]+ay]})});
      for(const [x,y] of [[6,51],[8,51]])h.P(x,y,A.torchpost,{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:130}});m.acts.push({kind:'enter',to:'piramide_sol',x:7,y:50.6,label:'Entrar na Pirâmide do Sol Verde',msg:'Raízes cobrem os degraus. Lá do fundo vem um cheiro de bicho grande.'})},
    people:{travel:['Iara, a Guardiã do Portal',{skin:SK[2],hair:0x1a1418,hs:'long',chest:0x3a6a3a,ct:'robe',robe:1,trim:0xe8c050,legs:0x3a6a3a,boots:0x4a3222,hd:'leafcrown',hdCol:0x3a8a3a,wt:'staff',wcol:0x5a3a1a,orb:0x9ae85a}],
      shop:['Caio, o Mercador',{skin:SK[2],hair:0x1a1418,hs:'short',chest:0x8a6a3a,ct:'leather',legs:0x5a4a2a,boots:0x3a2a1a}],
      heal:['Vó Jandira',{skin:SK[2],hair:0xe8e8e8,hs:'long',chest:0xe8e0cc,ct:'robe',robe:1,trim:0x3a8a3a,legs:0xe8e0cc,boots:0x5a4a2a}],
      elder:['Cacique Ubiratã',{skin:SK[2],hair:0x1a1418,hs:'long',chest:0x8a6a3a,ct:'leather',legs:0x5a4a2a,boots:0x3a2a1a,hd:'leafcrown',hdCol:0x3a8a3a,wt:'staff',wcol:0x5a3a1a,orb:0x9ae85a},'A aldeia conta suas histórias em volta da fogueira.'],
      hunter:['Vó Jurema',{skin:SK[2],hair:0xe8e8e8,hs:'long',chest:0x6a8a4a,ct:'robe',robe:1,legs:0x6a8a4a,boots:0x5a4a2a},'Com sua ajuda, o rio voltou a sorrir.'],
      guard:['Vigia da Aldeia',{skin:SK[2],hair:0x1a1418,hs:'short',chest:0x6a5a3a,ct:'leather',legs:0x5a4a2a,boots:0x3a2a1a,wt:'spear',wcol:0x8a6a3a},['O rio sobe rápido quando chove. E aqui sempre chove.','Ouviu um estalo de fogo na mata à noite? É o Boitatá passeando.','Na pirâmide do canto vive um gigante de um olho só. Nem os caçadores vão lá.']],
      out:[['Barqueiro Tião',38.5,12.5,{skin:SK[2],hair:0x1a1418,hs:'short',chest:0x3a6a8a,ct:'cloth',legs:0x2a3a4a,boots:0x3a2a1a,hd:'straw',hdCol:0xc8a858},'talker',{lines:['Remo neste rio desde menino. Jacaré grande não se assusta com grito.','As plantas que cospem não andam. Fique longe da boca delas.','À noite o rio brilha. Uns dizem que é o Boitatá.']}],
        ['Bióloga Clara',14.5,30.5,{skin:SK[0],hair:0x8a5a2a,hs:'long',chest:0x5a7a4a,ct:'leather',legs:0x4a5a3a,boots:0x3a2a1a,hd:'hood',hdCol:0x4a6a3a},'talker',{lines:['Os sapos-flecha são lindos. E mortais.','A onça-pintada só ataca quando você chega perto demais do território dela.','As flores gigantes cheiram mal de propósito. Atraem moscas.']}]],
      folk:[['Raoni',{skin:SK[2],hair:0x1a1418,hs:'short',chest:0x6a5a3a,ct:'cloth',legs:0x5a4a2a,boots:0x3a2a1a}],['Moema',{skin:SK[2],hair:0x1a1418,hs:'long',chest:0xc8603a,ct:'robe',robe:1,legs:0xc8603a,boots:0x3a2a1a}]]}}}}
function caveSpecs(A){return{
  gruta_gelo:{id:'gruta_gelo',name:'Gruta Congelada',seed:8101,parent:'gelo',out:[46.4,48.8],floor:ICECAVE,walls:'wIce',flame:'ghost',tint:0x9ac8e8,darkCol:'6,14,28',soft:'rgba(60,120,180,.18)',dark:.66,
    throne:A.iceObelisk,pillar:A.iceCrystal[1],props:[[8,8,A.iceCrystal[0],{light:{dx:0,dy:-20,r:90,cold:1}}],[22,4,A.iceCrystal[1],{light:{dx:0,dy:-20,r:90,cold:1}}],[16,20,A.iceCrystal[0],{light:{dx:0,dy:-20,r:90,cold:1}}],[33,20,A.rockSnow[0]],[6,20,A.iceCrystal[1],{light:{dx:0,dy:-20,r:90,cold:1}}],[33,32,A.iceCrystal[0],{light:{dx:0,dy:-20,r:90,cold:1}}]],decals:[A.dec.peb],
    mobs:['golem_gelo','arqueiro_gelo','espirito_gelo'],boss:'rainha_gelo'},
  caverna_oni:{id:'caverna_oni',name:'Caverna do Oni',seed:8202,parent:'japao',out:[46.4,48.8],floor:VOLC,walls:'wVolc',flame:'fire',tint:0xd8a090,darkCol:'26,6,6',soft:'rgba(160,40,20,.2)',
    throne:A.throne,pillar:A.toro,props:[[8,8,A.toro,{light:{dx:0,dy:-29,r:110}}],[22,4,A.toro,{light:{dx:0,dy:-29,r:110}}],[16,22,A.toro,{light:{dx:0,dy:-29,r:110}}],[33,21,A.barrel[0]],[6,22,A.toro,{light:{dx:0,dy:-29,r:110}}],[33,33,A.toro,{light:{dx:0,dy:-29,r:110}}]],decals:[A.dec.peb,A.bones[0]],
    mobs:['kappa','arqueiro_oni','samurai_fantasma'],boss:'oni_shogun'},
  tumba:{id:'tumba',name:'Tumba do Faraó',seed:8303,parent:'deserto',out:[46.4,48.8],floor:TOMB,walls:'wSand',flame:'fire',tint:0xe8c890,darkCol:'24,16,6',soft:'rgba(160,110,40,.2)',
    throne:A.altar,pillar:A.pillar,props:[[8,8,A.sarc[0]],[22,4,A.sarc[1]],[16,22,A.pots[0]],[33,21,A.pots[1]],[6,14,A.sarc[0]],[33,33,A.candles,{light:{dx:0,dy:-8,r:80}}],[14,18,A.candles,{light:{dx:0,dy:-8,r:80}}]],decals:[A.bones[1],A.dec.peb],
    mobs:['mumia','arqueiro_tumba','djinn'],boss:'farao'},
  templo_selva:{id:'templo_selva',name:'Templo Perdido',seed:8404,parent:'selva',out:[46.4,48.8],floor:MOSSCAVE,walls:'wMoss',flame:'ghost',tint:0x9ad89a,darkCol:'6,18,8',soft:'rgba(40,140,60,.18)',
    throne:A.altar,pillar:A.ruin,props:[[8,8,A.giantFlower[0]],[22,4,A.stoneMoss[0]],[16,22,A.giantFlower[2]],[33,21,A.stoneMoss[1]],[6,16,A.plantLit.g,{block:null,light:{dx:0,dy:-14,r:90,cold:1}}],[33,33,A.plantLit.c,{block:null,light:{dx:0,dy:-14,r:90,cold:1}}],[20,7,A.plantLit.m,{block:null,light:{dx:0,dy:-14,r:90,cold:1}}]],decals:[A.dec.mush,A.dec.ftuft],
    mobs:['aranha','cuspideira_negra','curupira_sombra'],boss:'boitata_rei'},
  piramide_akhet:{id:'piramide_akhet',name:'Pirâmide de Akhet',layout:'C',lv:'Níveis 13–18',dg:4,seed:8505,parent:'deserto',out:[7,51.6],floor:TOMB,walls:'wSand',flame:'fire',tint:0xe8c890,darkCol:'24,16,6',soft:'rgba(160,110,40,.2)',
    throne:A.altar,pillar:A.pillar,props:[[5,5,A.candles,{light:{dx:0,dy:-8,r:80}}],[34,8,A.sarc[0]],[30,24,A.sarc[1]],[12,24,A.pots[0]],[18,22,A.candles,{light:{dx:0,dy:-8,r:80}}],[34,25,A.pots[1]],[9,34,A.candles,{light:{dx:0,dy:-8,r:80}}],[29,34,A.candles,{light:{dx:0,dy:-8,r:80}}]],decals:[A.bones[1],A.dec.peb],
    mobs:['escaravelho','sacerdote_morto','guarda_chacal'],boss:'anubis'},
  piramide_sol:{id:'piramide_sol',name:'Pirâmide do Sol Verde',layout:'C',lv:'Níveis 13–18',dg:4,seed:8606,parent:'selva',out:[7,51.6],floor:MOSSCAVE,walls:'wMoss',flame:'ghost',tint:0xa8e0a0,darkCol:'6,18,8',soft:'rgba(40,140,60,.18)',
    throne:A.altar,pillar:A.ruin,props:[[5,5,A.plantLit.g,{block:null,light:{dx:0,dy:-14,r:90,cold:1}}],[34,8,A.giantFlower[1]],[30,24,A.stoneMoss[0]],[12,24,A.plantLit.c,{block:null,light:{dx:0,dy:-14,r:90,cold:1}}],[18,22,A.giantFlower[0]],[34,25,A.plantLit.m,{block:null,light:{dx:0,dy:-14,r:90,cold:1}}],[9,34,A.totem],[29,34,A.totem]],decals:[A.dec.mush,A.dec.ftuft],
    mobs:['onca_negra','espirito_ancestral','guardiao_musgo'],boss:'mapinguari_anciao'},
  caverna_mamute:{id:'caverna_mamute',name:'Caverna do Mamute',layout:'B',lv:'Níveis 12–16',dg:4,seed:8707,parent:'gelo',out:[6.6,8.8],floor:ICECAVE,walls:'wIce',flame:'ghost',tint:0x9ac8e8,darkCol:'6,14,28',soft:'rgba(60,120,180,.18)',dark:.66,
    throne:A.iceObelisk,pillar:A.iceCrystal[0],props:[[6,6,A.iceCrystal[1],{light:{dx:0,dy:-20,r:90,cold:1}}],[21,6,A.iceCrystal[0],{light:{dx:0,dy:-20,r:90,cold:1}}],[16,22,A.bones[2]],[34,22,A.iceCrystal[1],{light:{dx:0,dy:-20,r:90,cold:1}}],[6,20,A.iceCrystal[0],{light:{dx:0,dy:-20,r:90,cold:1}}]],decals:[A.dec.peb,A.bones[0]],
    mobs:['lobo_glacial','arqueiro_gelo','espirito_gelo'],boss:'mamute'},
  santuario_kyubi:{id:'santuario_kyubi',name:'Santuário da Kyūbi',layout:'B',lv:'Níveis 12–16',dg:4,seed:8808,parent:'japao',out:[5.5,25],floor:MOSSCAVE,walls:'wVolc',flame:'ghost',tint:0xe8b8d0,darkCol:'20,8,16',soft:'rgba(180,60,120,.16)',
    throne:A.foxShrine,pillar:A.toro,props:[[6,6,A.toro,{light:{dx:0,dy:-29,r:110}}],[21,6,A.toro,{light:{dx:0,dy:-29,r:110}}],[16,22,A.sakura[1],{tall:1}],[34,22,A.toro,{light:{dx:0,dy:-29,r:110}}],[6,20,A.toro,{light:{dx:0,dy:-29,r:110}}],[24,22,A.foxShrine]],decals:[A.dec.flow[0],A.dec.flow[1]],
    mobs:['kitsune_fogo','samurai_fantasma','kitsune_fogo'],boss:'kyubi'}}}
function genAllRegions(ART){const rs=regionSpecs(ART),cs=caveSpecs(ART);for(const k in rs)MAPS[k]=genRegion(ART,rs[k]);for(const k in cs)MAPS[k]=genCaveR(ART,cs[k]);for(const k in MAPS)addBossChest(MAPS[k],ART)}
// extra life and light for Pedravale's outdoors
function decorateWorld(ART){const m=MAPS.world;const free=(x,y)=>inb(m,x,y)&&!m.solid[y*m.w+x]&&tAt(m,x,y)!==WATER&&!m.objs.some(o=>Math.floor(o.x)===x&&Math.floor(o.y)===y);
  for(const [x,y] of [[33,23],[38,19],[47,23],[54,19],[19,34],[23,40],[19,46],[23,53],[30,48],[38,52],[46,48],[54,52],[59,40],[55,30],[23,14],[19,9],[23,3],[9,23],[4,19],[14,40],[10,55],[33,40],[41,33],[50,40]])if(free(x,y))prop(m,x,y,ART.torchpost,{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:120}});
  const SK=SKINS;m.npcDefs.push(
    {id:'pescador',n:'Pescador Elias',x:10.5,y:43.4,look:{skin:SK[1],hair:0x8a8a8a,hs:'short',beard:1,chest:0x3a5a7a,ct:'cloth',legs:0x3a3a4a,boots:0x3a2a1a,hd:'straw',hdCol:0xc8a858},role:'talker',lines:['O lago do sul tem peixe grande. E algo maior no fundo, dizem.','Viu a Ysolde, na vila? Ela abre portais para terras que eu nunca vou ver.','À noite, as flores-lume brilham quando a gente encosta nelas.']},
    {id:'fazendeira',n:'Fazendeira Marta',x:23.5,y:6.4,look:{skin:SK[0],hair:0xc8984e,hs:'long',chest:0x8a6a3a,ct:'cloth',legs:0x5a4a3a,boots:0x3a2a1a,hd:'straw',hdCol:0xc8a858},role:'talker',lines:['Os espantalhos ganharam vida! Eu juro que não fui eu que pus aquela abóbora.','Os javalis comem metade da minha plantação todo ano.','Se passar pelos campos à noite, cuidado com os espantalhos.']},
    {id:'lenhador',n:'Lenhador Ivo',x:36.5,y:29.6,look:{skin:SK[2],hair:0x2a1e18,hs:'short',beard:1,chest:0x6a3a2a,ct:'leather',legs:0x4a3a2a,boots:0x3a2a1a,wt:'axe',wcol:0xb8c0cc},role:'talker',lines:['O Bosque de Vellmor esconde coisas. Um círculo de pedras, por exemplo.','Ouvi lobos a noite toda. Tem um alfa por aí.','As árvores mais velhas do bosque têm nome. Eu só não sei qual.']},
    {id:'patrulheiro',n:'Patrulheiro Dario',x:46.6,y:21.4,look:{skin:SK[0],hair:0x3a2a22,hs:'short',chest:0x8a909a,ct:'chain',legs:0x4a4a5a,boots:0x2a2a30,hd:'helm',hdCol:0x9098a4,wt:'spear',wcol:0x8a8a98,sh:'kite',shCol:0x2e4a8a},role:'talker',lines:['Depois da ponte começa o território goblin. Vá preparado.','O forte goblin fica no leste. Tambores toda noite.','Os goblins arqueiros sempre ficam atrás dos guerreiros. Mire neles primeiro.']})}
