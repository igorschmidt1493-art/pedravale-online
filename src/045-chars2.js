// ===================== crawlers (scorpion, snake, croc, frog, spider, plant) + region looks =====================
function drawCrawler(L,dir,anim,frame){const s=(L.scale||1)*1.5,S=n=>n*s,K=L.kind;const W=Math.ceil(84*s),H=Math.ceil(70*s),cx=W>>1,gy=H-Math.ceil(12*s),pb=new PB(W,H);
  const a=Math.PI/2-dir*Math.PI/4,hx=Math.cos(a),hy=Math.sin(a)*.55,px=-Math.sin(a),py=Math.cos(a)*.55;
  const walk=anim==='walk',ph=walk?frame/8*Math.PI*2:0,atk=anim==='atk'?frame/3:-1,lunge=atk>=0?Math.sin(atk*Math.PI):0,stun=anim==='stun';
  const B=L.body,D=L.dark,BE=L.belly||tone(L.body,.3),E=stun?0xffffff:(L.eyeCol||0x140c0c);
  const at=(f,r,z=0)=>[cx+hx*S(f)+px*S(r),gy-S(5)+hy*S(f)+py*S(r)-S(z)];
  const parts=[];const add=(y,fn)=>parts.push([y,fn]);
  const blob=(p,rx,ry,col,lt=.25)=>add(p[1],()=>pb.ell(p[0],p[1],S(rx),S(ry),(nx,ny,X,Y)=>{let c=ny>.45&&L.belly?BE:col;if(L.spots&&hash(X>>1,Y>>1,7)<.17)c=L.spots;if(L.stripes&&((X+Y)>>2)%3===0)c=tone(c,-.25);return tone(c,lt-(nx*.22+ny*.6))}));
  const limb=(p0,p1,w,col)=>add(Math.max(p0[1],p1[1])-1,()=>pb.thick(p0[0],p0[1],p1[0],p1[1],S(w),(u)=>tone(col,u>.8?-.25:0)));
  const eyes=(f,r,z,sz=1)=>{if(hy<-.3)return;const p0=at(f,r-1.3,z),p1=at(f,r+1.3,z);add(Math.max(p0[1],p1[1])+.5,()=>{for(const p of [p0,p1])pb.rect(Math.round(p[0]),Math.round(p[1]),Math.max(1,Math.round(S(sz))),Math.max(1,Math.round(S(sz))),E)})};
  if(K==='scorpion'){
    for(let k=0;k<4;k++)blob(at(1.8-k*2.3,0,1.5),4.2-k*.35,3-k*.2,k?B:tone(B,.08));
    for(const sd of [-1,1])for(let i=0;i<4;i++){const w=walk?Math.sin(ph+i*1.6+(sd>0?0:Math.PI))*1.2:0;limb(at(1.2-i*1.7,sd*2.4,1.5),at(1.2-i*1.7+w,sd*6.4,0),1.3,D)}
    for(const sd of [-1,1]){const reach=4.5+lunge*2.5;limb(at(3,sd*1.8,1.6),at(reach+1.5,sd*3.6,2),1.6,D);blob(at(reach+2.8,sd*3.8,2.2),2.3,1.6,tone(B,-.1));limb(at(reach+3.6,sd*3.2,2.4),at(reach+5.2,sd*2.4,2.4),.9,D)}
    const tl=[[-7,2],[-9.2,4.8],[-9.8,8.8],[-8.6,12.4],[-6,14.6],[-3+lunge*3,14.4-lunge*2]];tl.forEach(([f,z],j)=>blob(at(f,0,z+(walk?Math.sin(ph+j)*.4:0)),2.2-j*.18,1.9-j*.12,j>4?D:B));
    {const st=at(-1.4+lunge*4,0,13.4-lunge*2.6);add(st[1]+.2,()=>pb.tri([st[0]-S(1),st[1]],[st[0]+S(1),st[1]],[st[0]+hx*S(2),st[1]+S(2.4)],()=>0x1a0c08))}
    eyes(3.1,0,2.6)}
  else if(K==='snake'){const n=13;for(let i=n-1;i>=0;i--){const f=4.2-i*1.75,r=Math.sin(i*.75+(walk?ph:T*0))*2.2*(i/n+.3),z=i===0?2.4+lunge*1.5:1.2;blob(at(f+(i===0?lunge*3:0),r,z),i===0?3.4:Math.max(1.1,3-i*.15),i===0?2.6:Math.max(.9,2.3-i*.11),i===0?tone(B,.05):((i&1)&&L.bands?L.bands:B))}
    eyes(5.4+lunge*3,0,3.4+lunge*1.5);if(atk>=0){const t0=at(7+lunge*3,0,2.6),t1=at(9+lunge*4,0,2.6);add(t1[1]+1,()=>pb.thick(t0[0],t0[1],t1[0],t1[1],1,()=>0xd82a3a))}}
  else if(K==='croc'){for(let i=9;i>=0;i--){const f=5-i*2.2,r=Math.sin(i*.6+ph)*.8*(i/9),wd=i<2?3.4:i<6?4.4-i*.1:Math.max(1,4-(i-5)*.8);blob(at(f,r,1.4),wd,wd*.66,B)}
    blob(at(8.6+lunge,0,1.6),3,2.2,tone(B,.05));blob(at(11.8+lunge,0,1.4),2.4,1.6,tone(B,.1));
    if(atk>=0||lunge>.2){const p=at(11+lunge,0,.4);add(p[1]+1,()=>pb.rect(Math.round(p[0]-S(3)),Math.round(p[1]),Math.round(S(6)),1,0xf0e8d8))}
    for(const sd of [-1,1])for(const f of [3.4,-4]){const w=walk?Math.sin(ph+f+(sd>0?0:Math.PI))*1.4:0;limb(at(f,sd*3.4,1.2),at(f+w,sd*5.6,0),1.8,D)}
    eyes(9,0,3.2,1.2)}
  else if(K==='frog'){const hop=walk?Math.abs(Math.sin(ph))*S(3.5):0,z=1.6+hop/s;for(const sd of [-1,1]){blob(at(-2,sd*3.6,z-.6),2.6,1.8,tone(B,-.12));limb(at(1.8,sd*2.4,z),at(2.8,sd*3.6,0),1.3,tone(B,-.1))}
    blob(at(0,0,z),5,3.8,B,.3);for(const sd of [-1,1])blob(at(2.6,sd*2.1,z+2.4),1.5,1.4,tone(B,.2));eyes(3,0,z+3.1,1.2);
    if(atk>=0){const m0=at(4.6,0,z),m1=at(8+lunge*5,0,z+1);add(m1[1]+1,()=>pb.thick(m0[0],m0[1],m1[0],m1[1],1.2,()=>0xe85a7a))}}
  else if(K==='spider'){blob(at(-3.4,0,3.4),5.2,4.4,B,.3);blob(at(1.8,0,2.4),3.2,2.6,tone(B,-.05));
    for(const sd of [-1,1])for(let i=0;i<4;i++){const f=2.4-i*1.5,w=walk?Math.sin(ph+i*1.4+(sd>0?0:Math.PI))*1.4:0,kn=at(f+w*.5,sd*6,6),ft=at(f+1.2-i*.6+w,sd*9.4,0);limb(at(f*.5,sd*1.6,2.6),kn,1.2,D);limb(kn,ft,1,D)}
    eyes(3.6,0,3,1);if(L.marks)add(at(-3.4,0,7)[1]+1,()=>{const p=at(-3.4,0,6.4);pb.rect(Math.round(p[0]-S(1)),Math.round(p[1]),Math.max(1,Math.round(S(2))),Math.max(1,Math.round(S(3))),L.marks)})}
  else if(K==='plant'){const sw=Math.sin(T*0)+(atk>=0?lunge*2.4:0);const base=at(0,0,0),top=at(sw,0,13);
    for(const sd of [-1,1])blob(at(0,sd*3.4,.6),3.8,1.6,tone(D,.1));limb(base,top,2.4,D);
    const head=at(1+sw,0,15.5);add(head[1]+2,()=>{pb.ell(head[0],head[1],S(5.2),S(4.6),(nx,ny)=>tone(B,.25-(nx*.25+ny*.6)));const open=S(1.2+lunge*2.2);const mx=head[0]+hx*S(2.4),my=head[1]+S(1)+hy*S(2);pb.ell(mx,my,S(3),open,()=>0x3a0a14);for(let i=-2;i<=2;i++)pb.set(Math.round(mx+i*S(1.2)),Math.round(my-open+1),0xf0e8d8);for(let i=0;i<5;i++)pb.set(Math.round(head[0]-S(3)+i*S(1.5)),Math.round(head[1]-S(3.6)),L.spots||tone(B,.4))})}
  parts.sort((p,q)=>p[0]-q[0]);for(const [,fn] of parts)fn();
  pb.outline(L.outline||0x16121a);return{cv:pb.canvas(),ax:cx,ay:gy}}

Object.assign(MLOOK,{
  // neve
  raposa_neve:{beast:1,kind:'wolf',fur:0xf0f4f8,dark:0xb8c4d0,belly:0xffffff,eyeCol:0x3a3a4a,scale:.82},
  lobo_neve:{beast:1,kind:'wolf',fur:0xd8e0e8,dark:0x8a98a8,belly:0xf4f8fc,eyeCol:0x5ab0ff},
  urso_polar:{beast:1,kind:'boar',noTusk:1,ridge:0,fur:0xf0f0ea,dark:0xc8ccc4,belly:0xffffff,snout:0x2a2a30,eyeCol:0x141418,scale:1.55},
  saqueador_gelo:{skin:SKINS[0],hair:0xc8a050,hs:'long',beard:1,hd:'furhat',hdCol:0xd8d0c4,chest:0x6a5a4a,ct:'leather',legs:0x4a3a2a,boots:0x3a2a1a,wt:'axe',wcol:0xb8c0cc,cape:0x7a7a7a},
  cacador_gelo:{skin:SKINS[1],hair:0x8a6a4a,hs:'short',beard:1,hd:'hood',hdCol:0xe8eef4,chest:0xd8dce4,ct:'leather',legs:0x6a6a74,boots:0x3a2a1a,wt:'bow',wcol:0xe8e0d0,sh:'quiver'},
  yeti:{skin:0xe8eef4,eye:0x3a8aff,hs:'bald',chest:0xe8eef4,ct:'cloth',bareLegs:1,legs:0xe8eef4,boots:0xb8c4d4,scale:1.45,headScale:1.1,outline:0x2a3a4a},
  golem_gelo:{skin:0x9ad8f0,eye:0xffffff,hs:'bald',chest:0x7ac8e8,ct:'plate',bareLegs:1,legs:0x7ac8e8,boots:0x5ab0e0,scale:1.35,outline:0x1a3a5a},
  espirito_gelo:{ghost:1,skin:0xbfe8ff,eye:0xffffff,hair:0xe8f8ff,hs:'long',chest:0xbfe8ff,ct:'robe',robe:1,legs:0xbfe8ff,boots:0xa8d8f0},
  arqueiro_gelo:{skin:0x9ad8f0,eye:0xffffff,hs:'bald',chest:0x7ac8e8,ct:'plate',bareLegs:1,legs:0x7ac8e8,boots:0x5ab0e0,wt:'bow',wcol:0xbfe8ff,outline:0x1a3a5a},
  rainha_gelo:{skin:0xd8f0ff,eye:0x5affff,hair:0xffffff,hs:'long',hd:'crown',hdCol:0xbfe8ff,chest:0x5ab0e0,ct:'robe',robe:1,trim:0xffffff,legs:0x5ab0e0,boots:0x3a7ab0,wt:'staff',wcol:0xbfe8ff,orb:0x9ae8ff,scale:1.3},
  // japão
  tanuki:{beast:1,kind:'boar',noTusk:1,ridge:0,fur:0x8a6a4a,dark:0x3a2a1a,belly:0xd8c8a8,snout:0x3a2a1a,eyeCol:0x1a1010,scale:.8},
  kitsune:{beast:1,kind:'wolf',fur:0xe8843a,dark:0xa8501a,belly:0xfff4e0,eyeCol:0xffd04a,scale:.9},
  ronin:{skin:SKINS[1],hair:0x1a1418,hs:'long',hd:'kasa',hdCol:0xc8a858,chest:0x3a3a4a,ct:'cloth',legs:0x2a2a3a,boots:0x2a1e14,wt:'sword',wcol:0xe8eef8},
  ninja:{skin:SKINS[1],hs:'bald',hd:'assassin',hdCol:0x1e1e26,chest:0x1e1e26,ct:'cloth',legs:0x1e1e26,boots:0x111116,wt:'dagger',wcol:0xc8ccd4},
  oni:{skin:0xc8302a,eye:0xffe060,hair:0x1a1418,hs:'long',hd:'onihorns',chest:0xc8a040,ct:'cloth',bareLegs:1,legs:0xc8302a,boots:0x5a1a14,wt:'mace',wcol:0x2a2a30,scale:1.35,outline:0x2a0c0a},
  tengu:{skin:0xc8302a,hair:0xe8e8e8,hs:'long',hd:'tengu',chest:0xe8e2d4,ct:'robe',robe:1,trim:0xc8302a,legs:0xe8e2d4,boots:0x2a2a30,wt:'staff',wcol:0x6a4a2a,orb:0xffd060,cape:0x2a2a34},
  kappa:{skin:0x6aa44a,eye:0xffd84a,hs:'bald',headScale:1.2,scale:.85,chest:0x3a5a2a,ct:'leather',bareLegs:1,legs:0x6aa44a,boots:0x4a6a3a},
  samurai_fantasma:{ghost:1,skin:0x9ab8c8,eye:0x8affff,hd:'kabuto',hdCol:0x5a6a7a,hdCol2:0xbfe8ff,chest:0x5a6a7a,ct:'plate',trim:0x8affff,legs:0x4a5a6a,boots:0x3a4a5a,wt:'sword',wcol:0xc8f0ff,hs:'bald'},
  arqueiro_oni:{skin:0x3a5ac8,eye:0xffe060,hair:0x1a1418,hs:'long',hd:'onihorns',chest:0x6a4a2a,ct:'cloth',bareLegs:1,legs:0x3a5ac8,boots:0x1a2a5a,wt:'bow',wcol:0x2a1a14,scale:1.15,outline:0x0a0c2a},
  oni_shogun:{skin:0x8a1a1a,eye:0xffe060,hs:'bald',hd:'kabuto',hdCol:0x1a1418,hdCol2:0xd8b048,chest:0x2a1a1a,ct:'plate',trim:0xd8b048,legs:0x2a1a1a,boots:0x1a0e0e,wt:'sword',wcol:0xe8eef8,scale:1.6,outline:0x1a0606},
  // deserto
  escorpiao:{crawler:1,kind:'scorpion',body:0x9a6a32,dark:0x4a2a12,eyeCol:0x1a0a06},
  hiena:{beast:1,kind:'wolf',fur:0xb8985a,dark:0x5a4a2a,belly:0xd8c8a0,spots:0x4a3a1a,eyeCol:0xffd04a},
  saqueador_duna:{skin:SKINS[2],hair:0x1a1418,hs:'short',beard:1,hd:'turban',hdCol:0x3a3a44,chest:0xb89868,ct:'cloth',legs:0x8a6a4a,boots:0x4a3222,wt:'sword',wcol:0xe8eef8,cape:0x8a3a2a},
  atirador_duna:{skin:SKINS[2],hair:0x1a1418,hs:'short',hd:'turban',hdCol:0xc8b088,chest:0x8a6a4a,ct:'leather',legs:0x6a5a3a,boots:0x4a3222,wt:'bow',wcol:0x6a3a1a,sh:'quiver'},
  guardiao_arenito:{skin:0xc8a070,eye:0xffd060,hs:'bald',chest:0xb8905a,ct:'plate',trim:0xe8c050,bareLegs:1,legs:0xc8a070,boots:0xa88050,wt:'mace',wcol:0xa88050,sh:'kite',shCol:0xb8905a,scale:1.35,outline:0x3a2410},
  serpente_areia:{crawler:1,kind:'snake',body:0xc8a060,dark:0x6a4a22,belly:0xe8d8a8,bands:0x8a6a32,eyeCol:0xffd04a,scale:1.5},
  mumia:{skin:0xd8c8a0,eye:0x5affd0,hs:'bald',hd:'wraps',hdCol:0xd8c8a0,chest:0xc8b890,ct:'cloth',legs:0xc8b890,boots:0xb8a880},
  djinn:{ghost:1,skin:0x4a8ad8,eye:0xffe060,hs:'bald',beard:1,hair:0x1a2a5a,hd:'turban',hdCol:0xe8c050,chest:0x3a6ab0,ct:'robe',robe:1,trim:0xe8c050,legs:0x3a6ab0,boots:0x2a4a8a,scale:1.3},
  farao:{skin:0xd8c8a0,eye:0x5affd0,hs:'bald',hd:'pharaoh',hdCol:0xd8b048,chest:0xe8e0c8,ct:'robe',robe:1,trim:0xd8b048,legs:0xe8e0c8,boots:0xd8b048,wt:'staff',wcol:0xd8b048,orb:0x5affd0,scale:1.35},
  // selva
  sapo:{crawler:1,kind:'frog',body:0x3a7ad8,spots:0x14141e,eyeCol:0x14141e,scale:.9},
  onca:{beast:1,kind:'wolf',fur:0xd8a040,dark:0x8a5a1a,belly:0xf0e0b8,spots:0x2a1a10,eyeCol:0xc8e050,scale:1.1},
  homem_planta:{skin:0x4a8a3a,eye:0xffe060,hs:'bald',hd:'leafcrown',hdCol:0x3a8a3a,chest:0x3a6a2a,ct:'leather',bareLegs:1,legs:0x5a4a2a,boots:0x4a3a1a,wt:'club',wcol:0x5a3a1a,scale:1.1,outline:0x0e1a0a},
  planta_cuspideira:{crawler:1,kind:'plant',body:0x8a3a6a,dark:0x2a5a2a,spots:0xf0e070},
  jacare:{crawler:1,kind:'croc',body:0x4a6a3a,dark:0x2a3a1a,belly:0xc8c08a,eyeCol:0xe8d040,scale:1.35},
  boitata:{crawler:1,kind:'snake',body:0xff8a2a,dark:0xc8301a,belly:0xfff0a0,bands:0xffd060,eyeCol:0xffffff,scale:1.7,fire:1,outline:0x4a0a04},
  aranha:{crawler:1,kind:'spider',body:0x5a4a3a,dark:0x2a1e14,eyeCol:0xff3a2a,marks:0xc8a040,scale:1.05},
  assombracao_mata:{ghost:1,skin:0x6ac87a,eye:0xffe060,hair:0x2a5a2a,hs:'long',chest:0x2a5a3a,ct:'robe',robe:1,legs:0x2a5a3a,boots:0x1a3a2a},
  cuspideira_negra:{crawler:1,kind:'plant',body:0x3a2a4a,dark:0x1a3a1a,spots:0xd83a5a},
  mapinguari:{skin:0x5a3a24,eye:0x5a3a24,hs:'bald',hd:'cyclops',chest:0x5a3a24,ct:'cloth',bareLegs:1,legs:0x5a3a24,boots:0x3a2414,scale:1.75,headScale:1.1,outline:0x140a04}
});
MLOOK.arqueiro_tumba=Object.assign({},MLOOK.skeleton_arq,{hd:'turban',hdCol:0xc8b088});
// ---------- big furry brutes (yeti) ----------
function drawBrute(L,dir,anim,frame){const s=L.scale||1,S=n=>n*s,mirror=dir>=5,v=mirror?8-dir:dir,view=v===0||v===1?'F':v===4||v===3?'B':'S';
  const W=Math.ceil(70*s),H=Math.ceil(78*s),cx=W>>1,gy=H-Math.ceil(5*s),pb=new PB(W,H);const fur=L.fur,dk=L.dark,face=L.face,E=anim==='stun'?0xffffff:L.eyeCol;
  const walk=anim==='walk',ph=walk?frame/8*Math.PI*2:0,bob=walk?-Math.abs(Math.sin(ph))*S(1.4):0,atk=anim==='atk'||anim==='cast'?frame/3:-1,raise=atk>=0?(atk<.6?atk/.6:1-(atk-.6)/.4):0;
  const furFn=(base,lt=.2)=>(nx,ny,px,py)=>{const n=hash(px>>1,py,9);if(nx*nx+ny*ny>.8&&n<.38)return null;return tone(base,lt-(nx*.28+ny*.5)+(n<.25?-.12:0)+(((py+(px>>1))&3)===0?-.06:0))};
  const leg=(x,p)=>{const off=walk?Math.sin(ph+p)*S(2.4):0,lift=walk?Math.max(0,Math.cos(ph+p))*S(1.6):0;pb.ell(x+off*.4,gy-S(5)-lift,S(4.2),S(5.6),furFn(dk,.1));pb.ell(x+off,gy-S(1.2)-lift,S(4),S(1.8),(nx,ny)=>tone(face,-.15-ny*.2))};
  const arm=(sx,sy,hx2,hy2,far)=>{pb.thick(sx,sy,hx2,hy2,S(far?4.4:5.2),(u,vv)=>tone(far?dk:fur,(vv<.5?.08:-.2)-(far?.12:0)-u*.1));pb.ell(hx2,hy2,S(3.4),S(3),furFn(far?dk:fur,0));for(let i=-1;i<=1;i++)pb.thick(hx2+i*S(1.4),hy2+S(2),hx2+i*S(1.8),hy2+S(4),1,()=>0xf0ece0)};
  const by=gy-S(20)+bob;
  if(view==='F'||view==='B'){const front=view==='F';
    if(front){arm(cx-S(10),by-S(6),cx-S(16)+raise*S(3),by+S(14)-raise*S(28),1);arm(cx+S(10),by-S(6),cx+S(16)-raise*S(3),by+S(14)-raise*S(28),1)}
    leg(cx-S(5.5),Math.PI);leg(cx+S(5.5),0);
    pb.ell(cx,by,S(12.5),S(13.5),furFn(fur,.25));if(front)pb.ell(cx,by+S(3),S(7),S(8),furFn(tone(fur,.12),.18));
    const hy=by-S(13);pb.ell(cx,hy,S(7.5),S(7),furFn(fur,.3));
    if(front){pb.ell(cx,hy+S(1.6),S(5),S(4.2),(nx,ny)=>tone(face,.12-(nx*.2+ny*.3)));for(const sd of [-1,1])pb.rect(Math.round(cx+sd*S(2.2)-S(.6)),Math.round(hy),Math.max(1,Math.round(S(1.4))),Math.max(1,Math.round(S(1))),E);
      const open=atk>=0?S(1.6)*raise:S(.4);pb.rect(Math.round(cx-S(2.4)),Math.round(hy+S(3)),Math.round(S(4.8)),Math.max(1,Math.round(open+1)),0x2a1418);pb.set(Math.round(cx-S(1.6)),Math.round(hy+S(3)),0xf0ece0);pb.set(Math.round(cx+S(1.4)),Math.round(hy+S(3)),0xf0ece0)}
    else{arm(cx-S(10),by-S(6),cx-S(16)+raise*S(3),by+S(14)-raise*S(28),0);arm(cx+S(10),by-S(6),cx+S(16)-raise*S(3),by+S(14)-raise*S(28),0)}
    if(front){arm(cx-S(11),by-S(5),cx-S(14)+raise*S(4),by+S(12)-raise*S(30),0);arm(cx+S(11),by-S(5),cx+S(14)-raise*S(4),by+S(12)-raise*S(30),0)}}
  else{const reach=raise*S(10);
    arm(cx+S(2),by-S(7),cx+S(10)+reach,by+S(12)-raise*S(26),1);leg(cx-S(4),Math.PI);
    pb.ell(cx-S(1),by,S(13),S(12.5),furFn(fur,.25));pb.ell(cx+S(5),by+S(4),S(5.5),S(7),furFn(tone(fur,.1),.15));leg(cx+S(3),0);
    const hx2=cx+S(9),hy=by-S(10);pb.ell(hx2,hy,S(7),S(6.6),furFn(fur,.3));pb.ell(hx2+S(3.6),hy+S(1.6),S(3.6),S(3.8),(nx,ny)=>tone(face,.12-(nx*.2+ny*.3)));
    pb.rect(Math.round(hx2+S(3.8)),Math.round(hy),Math.max(1,Math.round(S(1.4))),Math.max(1,Math.round(S(1))),E);pb.rect(Math.round(hx2+S(3)),Math.round(hy+S(3.4)),Math.round(S(3.6)),Math.max(1,Math.round(1+S(1.4)*raise)),0x2a1418);
    arm(cx-S(1),by-S(6),cx+S(6)+reach,by+S(13)-raise*S(30),0)}
  pb.outline(L.outline||0x1a2230);if(mirror)pb.flipX();return{cv:pb.canvas(),ax:mirror?W-cx:cx,ay:gy}}
Object.assign(MLOOK,{
  yeti:{brute:1,fur:0xe4ecf4,dark:0xaebccc,face:0x6a7a9a,eyeCol:0x3a8aff,scale:1.3,outline:0x26303e},
  boitata_rei:{crawler:1,kind:'snake',body:0xff8a2a,dark:0xc8301a,belly:0xfff0a0,bands:0xffd060,eyeCol:0xffffff,scale:2.9,fire:1,outline:0x4a0a04},
  boitata_filhote:{crawler:1,kind:'snake',body:0xff9a3a,dark:0xc8401a,belly:0xfff0a0,bands:0xffd060,eyeCol:0xffffff,scale:1.05,fire:1,outline:0x4a0a04},
  escaravelho:{crawler:1,kind:'spider',body:0xd8a030,dark:0x5a3a10,marks:0x2a8a9a,eyeCol:0x1a0a06,scale:1.15},
  sacerdote_morto:{skin:0xd8c8a0,eye:0x5affd0,hs:'bald',hd:'wraps',hdCol:0xc8b890,chest:0x3a2a5a,ct:'robe',robe:1,trim:0xd8b048,legs:0x3a2a5a,boots:0xb8a880,wt:'staff',wcol:0x8a6a3a,orb:0x5affd0},
  guarda_chacal:{skin:0x1a1a22,eye:0xffd060,hs:'bald',hd:'jackal',hdCol:0x1e1e26,chest:0xd8b048,ct:'plate',trim:0x2a4a9a,legs:0xe8e0c8,boots:0xd8b048,wt:'spear',wcol:0xd8b048,sh:'kite',shCol:0xd8b048,scale:1.2},
  anubis:{skin:0x1a1a22,eye:0xffd060,hs:'bald',hd:'jackal',hdCol:0x14141a,chest:0xd8b048,ct:'robe',robe:1,trim:0x2a4a9a,legs:0xe8e0c8,boots:0xd8b048,wt:'staff',wcol:0xd8b048,orb:0x5affd0,scale:1.75,outline:0x0a0a0e},
  onca_negra:{beast:1,kind:'wolf',fur:0x24202a,dark:0x100c12,belly:0x3a3440,spots:0x0a080c,eyeCol:0xffd040,scale:1.25},
  guardiao_musgo:{skin:0x6a7a5a,eye:0x9affa0,hs:'bald',hd:'leafcrown',hdCol:0x3a6a2a,chest:0x5a6a4a,ct:'plate',trim:0x3a8a3a,bareLegs:1,legs:0x6a7a5a,boots:0x4a5a3a,wt:'mace',wcol:0x6a7a5a,scale:1.4,outline:0x101a0a},
  espirito_ancestral:{ghost:1,skin:0xd8e890,eye:0xffffff,hair:0x9ae85a,hs:'long',hd:'leafcrown',hdCol:0x9ae85a,chest:0x6a8a3a,ct:'robe',robe:1,trim:0xe8c050,legs:0x6a8a3a,boots:0x4a6a2a,scale:1.15},
  lobo_glacial:{beast:1,kind:'wolf',fur:0xbfe8ff,dark:0x5ab0e0,belly:0xffffff,eyeCol:0x5affff,scale:1.15},
  mamute:{beast:1,kind:'boar',fur:0x6a4a32,dark:0x3a2618,belly:0x8a6a4a,snout:0x3a2a20,eyeCol:0x1a1010,scale:2.5},
  kitsune_fogo:{beast:1,kind:'wolf',ghost:1,fur:0x8ab8ff,dark:0x3a6ad8,belly:0xe8f4ff,eyeCol:0xffffff,scale:1.05},
  kyubi:{beast:1,kind:'wolf',fur:0xf4f0e0,dark:0xd8b048,belly:0xffffff,eyeCol:0xff5a3a,scale:2.2,fire:1}
});
