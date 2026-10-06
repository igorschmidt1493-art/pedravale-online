// ===================== maps, terrain painting, world generation =====================
const GRASS=0,DIRT=1,COBBLE=2,WATER=3,SAND=4,FOREST=5,FIELD=6,BRIDGE=7,CAVE=8,VOID=9,GRAVE=10;
const SOLID_T={[WATER]:1,[VOID]:1};
function makeMap(id,w,h,o){return Object.assign({id,w,h,plants:[],terr:new Uint8Array(w*h),solid:new Uint8Array(w*h),objs:[],shadows:[],decals:[],chunks:new Map(),spawns:[],regions:[],dark:0,bg:0x0b0a10,npcs:[],acts:[],waterTiles:[]},o)}
const inb=(m,x,y)=>x>=0&&y>=0&&x<m.w&&y<m.h;
const tAt=(m,x,y)=>{x=Math.floor(x);y=Math.floor(y);return(x<0||y<0||x>=m.w||y>=m.h)?-1:m.terr[y*m.w+x]};
const solidAt=(m,x,y)=>{x=Math.floor(x);y=Math.floor(y);return x<0||y<0||x>=m.w||y>=m.h||m.solid[y*m.w+x]===1};
function addObj(m,o){const [wx,wy]=wpx(o.x,o.y);o.wx=wx;o.wy=wy;o.bb=[wx-o.ox,wy-o.oy,wx-o.ox+o.cv.width,wy-o.oy+o.cv.height];if(o.block)for(const [x,y] of o.block)if(inb(m,x,y))m.solid[y*m.w+x]=1;m.objs.push(o);return o}
function prop(m,tx,ty,art,ex){const o=Object.assign({x:tx+.5,y:ty+.5,k:tx+ty+1,cv:art.cv,ox:art.ox,oy:art.oy,block:[[tx,ty]],tall:art.tall},ex||{});if(art.light&&!o.light)o.light={dx:art.light[0],dy:art.light[1],r:120,night:1};if(art.fire&&!o.fire)o.fire={dx:art.fire[0],dy:art.fire[1],s:4};if(art.r&&!o.noShadow)m.shadows.push({e:1,x:o.x,y:o.y,rx:art.r*1.1,ry:art.r*.45,dx:art.r*.35,dy:2});return addObj(m,o)}
function decal(m,wx,wy,art){m.decals.push({wx,wy,cv:art.cv,ox:art.ox,oy:art.oy})}
// ---------- terrain painting (per pixel, world space) ----------
function shadeGround(m,fx,fy,wx,wy){
  if(fx<0||fy<0||fx>=m.w||fy>=m.h)return m.bg;
  const t0=m.terr[(fy|0)*m.w+(fx|0)];let t=t0,jx=0,jy=0;
  if(t0!==BRIDGE&&t0!==VOID&&t0!==11&&!NOJIT[t0]){jx=(vn(fx*1.3,fy*1.3,7)-.5)*.84;jy=(vn(fx*1.3+40,fy*1.3,8)-.5)*.84;const tj=tAt(m,fx+jx,fy+jy);if(tj>=0&&tj!==BRIDGE&&tj!==VOID&&tj!==CAVE)t=tj}
  const te=t0===BRIDGE?BRIDGE:tAt(m,fx+jx+.07,fy+jy+.07),edge=te!==t&&te>=0&&te!==BRIDGE&&t!==BRIDGE;
  let c;const n1=vn(fx*.18,fy*.18,1),n2=vn(fx*.9,fy*.9,2);
  switch(t){
    case GRASS:case GRAVE:case FOREST:{const g=t===GRAVE;c=t===FOREST?mix(0x2a3e32,0x3e5238,n1*.8+n2*.3):g?mix(0x34443e,0x46564a,n1*.7+n2*.3):mix(0x3a5238,0x58704a,n1*.85+n2*.3);if(t===GRASS&&n1>.68)c=mix(c,0x7a7a52,(n1-.68)*1.6);
      const h=hash(wx,(wy+((wx*7)&3))>>2,3);if(h<.16)c=tone(c,-.32);else if(h>.955)c=tone(c,.3);
      if(t===FOREST){const l=hash(wx>>1,wy>>1,5);if(l<.05)c=l<.025?0x6a4a30:0x5a5232}
      if(!g&&t===GRASS&&hash(wx>>1,wy>>1,9)>.9985)c=pick2(wx,wy,[0xffffff,0xffe066,0xc89aff,0xff8a9a]);break}
    case DIRT:{c=mix(0x5e5048,0x766656,n2*.8+n1*.3);const h=hash(wx>>1,wy>>1,5);if(h<.035)c=0x48403c;else if(h>.975)c=0x948270;if(hash(wx,wy>>1,6)<.06)c=tone(c,-.15);break}
    case SAND:c=mix(0x9a9078,0xaea488,n2);if(hash(wx>>1,wy>>1,4)<.05)c=0x847a64;break;
    case COBBLE:{vor(fx*1.9,fy*1.9,11);const e=VO.f2-VO.f1;if(e<.07)c=0x1e262c;else{c=mix(0x4e6266,0x667a7a,VO.id);if(VO.id>.82)c=mix(c,0x6a6070,.5);if(vn(fx*.4,fy*.4,31)>.6)c=mix(c,0x584c62,.35);if(e<.17)c=tone(c,VO.dx+VO.dy<0?.28:-.32);if(hash(wx,wy,12)<.05)c=tone(c,-.12)}break}
    case FIELD:{const r=(fy*2.6)%1;const wheat=vn(fx*.25,fy*.25,13)>.45;if(r<.32)c=mix(0x3e3028,0x34281e,hash(wx,wy>>1,2));else{c=wheat?mix(0x8e7c4a,0xa4905a,n2):mix(0x3e5a38,0x52704a,n2);const h=hash(wx,wy>>2,3);if(h<.25)c=tone(c,-.3);else if(h>.9)c=tone(c,.3)}break}
    case WATER:{c=mix(0x16283a,0x22384c,n2*.7+n1*.3);const near=tAt(m,fx+jx+.24,fy+jy+.24)!==WATER||tAt(m,fx+jx-.24,fy+jy-.24)!==WATER||tAt(m,fx+jx+.24,fy+jy-.24)!==WATER;if(near)c=mix(c,0x3a5a6e,.5);const s=Math.sin(wy*.55+vn(fx*.8,fy*.8,3)*7);if(s>.965)c=0x7a98aa;if(edge)c=0x8aa4b0;break}
    case BRIDGE:{const pf=fx*4.2,pl=Math.floor(pf);if(pf-pl<.12)c=0x3a2618;else{c=mix(0x4e3a2c,0x5e4634,hash(pl,1,4));if(hash(pl,Math.floor(wy/3),5)<.2)c=tone(c,-.15)}const ey=fy-Math.floor(fy);break}
    case CAVE:{const n3=vn(fx*.6,fy*.6,21);c=mix(0x4a3a2c,0x6a5440,n3*.8+n2*.3);const h=hash(wx>>1,wy>>1,22);if(h<.05)c=0x2e241c;else if(h>.96)c=0x8a7458;if(vn(fx*.35,fy*.35,24)>.7){const w=vn(fx*.35,fy*.35,24);c=mix(0x1e2a30,0x3a4a50,(w-.7)*3);if(Math.sin(wy*.6+fx*3)>.95)c=0x7a8a90}break}
    case 11:{const gx=fx*2,gy=fy*2,ix=Math.floor(gx),iy=Math.floor(gy),ux=gx-ix,uy=gy-iy;if(ux<.06||uy<.06)c=0x14121a;else{const dark=(ix+iy)&1;c=dark?mix(0x2a2a36,0x343444,hash(ix,iy,31)):mix(0x8a8a98,0x9e9eac,hash(ix,iy,31));const vein=Math.abs(Math.sin((fx*3+fy*1.7)*3+vn(fx*2,fy*2,33)*5));if(vein<.06)c=tone(c,dark?.2:-.2);if(ux<.14||uy<.14)c=tone(c,.15);if(vn(fx*.3,fy*.3,34)>.68)c=mix(c,0x2a6a5a,.35)}break}
    case 12:{const n3=vn(fx*.5,fy*.5,41);c=mix(0x14262c,0x22403e,n3*.8+n2*.3);const h=hash(wx>>1,wy>>1,42);if(h<.008)c=0x8affe8;else if(h<.016)c=0xd08aff;else if(hash(wx,wy>>2,43)<.12)c=tone(c,-.3);break}
    default:c=shadeBiome(m,t,fx,fy,wx,wy,n1,n2)}
  if(edge&&t!==WATER)c=tone(c,-.22);
  return c}
function pick2(x,y,a){return a[Math.floor(hash(x,y,99)*a.length)]}
const CH=256;
function buildChunk(m,cx,cy){const [cv,x]=mk(CH,CH);const id=x.createImageData(CH,CH),d=new Uint32Array(id.data.buffer);
  for(let py=0;py<CH;py++){const wy=cy*CH+py;for(let px=0;px<CH;px++){const wx=cx*CH+px;const fx=(wx/32+wy/16)/2,fy=(wy/16-wx/32)/2;const c=shadeGround(m,fx,fy,wx,wy);d[py*CH+px]=0xff000000|((c&255)<<16)|(c&0xff00)|((c>>16)&255)}}
  x.putImageData(id,0,0);const X0=cx*CH,Y0=cy*CH;
  const shPass=(sc,al,blur)=>{x.save();if(blur)x.filter=`blur(${blur}px)`;x.fillStyle=`rgba(16,20,52,${al})`;for(const s of m.shadows){if(s.e){const [wx,wy]=wpx(s.x,s.y),ex=wx+s.dx*sc-X0,ey=wy+s.dy*sc-Y0,rx=s.rx*sc,ry=s.ry*sc;if(ex+rx<-20||ey+ry<-20||ex-rx>CH+20||ey-ry>CH+20)continue;x.beginPath();x.ellipse(ex,ey,rx,ry,0,0,7);x.fill()}else{let a=1e9,b=1e9,c2=-1e9,d2=-1e9;for(const p of s.pts){a=Math.min(a,p[0]);c2=Math.max(c2,p[0]);b=Math.min(b,p[1]);d2=Math.max(d2,p[1])}if(c2<X0-20||d2<Y0-20||a>X0+CH+20||b>Y0+CH+20)continue;const cxp=(a+c2)/2,cyp=(b+d2)/2;x.beginPath();s.pts.forEach((p,i)=>{const px=cxp+(p[0]-cxp)*sc-X0,py=cyp+(p[1]-cyp)*sc-Y0;i?x.lineTo(px,py):x.moveTo(px,py)});x.closePath();x.fill()}}x.restore()};
  shPass(1.12,.16,7);shPass(1,.27,0);shPass(.9,.12,3);
  for(const dc of m.decals){const dx=dc.wx-dc.ox-X0,dy=dc.wy-dc.oy-Y0;if(dx>CH||dy>CH||dx+dc.cv.width<0||dy+dc.cv.height<0)continue;x.drawImage(dc.cv,Math.round(dx),Math.round(dy))}
  return cv}
function getChunk(m,cx,cy,allow){const k=cx+','+cy;let c=m.chunks.get(k);if(c)return c;if(!allow)return null;c=buildChunk(m,cx,cy);m.chunks.set(k,c);if(m.chunks.size>90){const first=m.chunks.keys().next().value;m.chunks.delete(first)}return c}
// ---------- decal art ----------
function decalArt(){const tuft=(c)=>{const pb=new PB(12,10);for(let i=0;i<5;i++){const x=2+i*2,h=4+((i*7)%4);pb.line(x,9,x+(i<2?-1:i>2?1:0),9-h,i%2?tone(c,-.25):c)}pb.outline(tone(c,-.6));return{cv:pb.canvas(),ox:6,oy:9}};
  const flowers=(c)=>{const pb=new PB(14,10);for(const [x,y] of [[3,4],[8,3],[6,7],[11,6]]){pb.line(x,y+1,x,y+3,0x3a6a2a);pb.set(x,y,c);pb.set(x-1,y,tone(c,-.2));pb.set(x+1,y,tone(c,-.2));pb.set(x,y-1,tone(c,.3))}return{cv:pb.canvas(),ox:7,oy:8}};
  const mush=()=>{const pb=new PB(10,9);pb.rect(4,4,2,4,0xe8e0d0);pb.ell(5,3.5,4,2.6,(nx,ny)=>((nx*5|0)+(ny*4|0))%3===0?0xffffff:0xd8402a);pb.outline(0x2a1414);return{cv:pb.canvas(),ox:5,oy:8}};
  const peb=()=>{const pb=new PB(10,6);pb.ell(3,3,2.4,1.6,(nx,ny)=>tone(0xa8a6b0,-(nx*.3+ny*.4)));pb.ell(7,4,1.8,1.2,(nx,ny)=>tone(0x8a8894,-(nx*.3+ny*.4)));pb.outline(0x3a3840);return{cv:pb.canvas(),ox:5,oy:4}};
  return{tuft:[tuft(0x5a9a3e),tuft(0x6aa848),tuft(0x4a7a36)],flow:[flowers(0xffffff),flowers(0xffe066),flowers(0xc89aff),flowers(0xff7a8a)],mush:mush(),peb:peb(),ftuft:tuft(0x3e6a30)}}
// ---------- world ----------
const riverX=y=>45+Math.round(Math.sin(y/7)*1.6);
function genWorld(ART){const m=makeMap('world',64,64,{name:'Terras de Pedravale',dark:0,bg:0x161e1a});const R=mulberry(9001);const T=(x,y,t)=>{if(inb(m,x,y))m.terr[y*m.w+x]=t};const G=(x,y)=>tAt(m,x,y);
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){let t=GRASS;if((x>=31&&y>=24)||(x>=48&&y>=12)||x<2||y<2||x>61||y>61)t=FOREST;if(x>=2&&x<=10&&y>=13&&y<=29)t=GRAVE;T(x,y,t)}
  for(const [x0,y0,x1,y1] of [[14,2,19,8],[24,2,31,5],[24,7,31,9],[34,2,41,8]])for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)T(x,y,FIELD);
  for(let y=0;y<64;y++){const rx=riverX(y);for(let x=rx;x<=rx+2;x++)T(x,y,WATER);for(const x of [rx-1,rx+3])if(G(x,y)!==WATER)T(x,y,SAND)}
  for(let y=44;y<56;y++)for(let x=3;x<17;x++){const d=((x+.5-9.5)/5.5)**2+((y+.5-50)/4.2)**2;if(d<1)T(x,y,WATER);else if(d<1.45&&G(x,y)!==WATER)T(x,y,SAND)}
  const road=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const t=G(x,y);if(t===WATER||t===SAND&&(G(x-1,y)===WATER||G(x+1,y)===WATER))T(x,y,BRIDGE);else if(t!==COBBLE&&t!==BRIDGE)T(x,y,DIRT)}};
  road(3,20,11,22);road(31,20,61,22);road(20,0,22,11);road(20,31,22,51);road(23,49,61,51);road(56,23,57,48);road(56,35,63,36);
  for(let y=12;y<=30;y++)for(let x=12;x<=30;x++){const st=(x>=20&&x<=22)||(y>=20&&y<=22)||Math.hypot(x+.5-21.5,y+.5-21.5)<4.6;T(x,y,st?COBBLE:GRASS)}
  for(let y=50;y<=60;y++)for(let x=49;x<=61;x++)if(Math.hypot(x+.5-55.5,y+.5-55.5)<5.2)T(x,y,G(x,y)===DIRT?DIRT:GRASS);
  for(let i=0;i<m.w*m.h;i++)if(SOLID_T[m.terr[i]])m.solid[i]=1;
  for(let y=0;y<64;y++)for(let x=0;x<64;x++)if(m.terr[y*64+x]===WATER)m.waterTiles.push([x,y]);
  const reserve=new Set();const res=(x,y)=>reserve.add(x+','+y);const isRes=(x,y)=>reserve.has(x+','+y);
  // --- town walls ---
  for(let y=12;y<=30;y++)for(let x=12;x<=30;x++){if(!(x===12||x===30||y===12||y===30))continue;if((x>=20&&x<=22)||(y>=20&&y<=22))continue;const corner=(x===12||x===30)&&(y===12||y===30),post=(x===19||x===23)&&(y===12||y===30)||(y===19||y===23)&&(x===12||x===30);prop(m,x,y,corner||post?ART.wallT:ART.wall[(x+y)%3],{noShadow:1});res(x,y)}
  m.shadows.push({pts:[[ ...wpx(12,30)],[...wpx(31,30)],[...wpx(31,31)],[...wpx(12,31)]].map(p=>[p[0]+10,p[1]+5])});
  // --- buildings ---
  const bld=(x0,y0,o,ex)=>{const day=makeBuilding(o,false),night=makeBuilding(o,true);const k=x0+y0+(o.w+o.h)/2;const bl=[];for(let i=0;i<o.w;i++)for(let j=0;j<o.h;j++){bl.push([x0+i,y0+j]);res(x0+i,y0+j)}
    const ob=addObj(m,Object.assign({x:x0,y:y0,k,cv:day.cv,cvN:night.cv,ox:day.ox,oy:day.oy,block:bl,tall:1,wins:day.lights,smoke:day.smoke},ex||{}));const [ax,ay]=wpx(x0,y0);m.shadows.push({pts:bldShadow(o.w,o.h,o.wallH+(o.roofH||0)*.6).map(p=>[p[0]+ax,p[1]+ay])});return ob};
  // openings in real pixel sizes: character is ~40px tall (≈1,8 m) → storey ≈ 64px, door ≈ 48px
  const D=(wh,u,w=.16,h=48)=>({t:'door',u0:u-w/2,u1:u+w/2,v0:0,v1:h/wh});
  const Wn=(wh,u,w=.12,sill=22,h=24,fl=0,st=64)=>({t:'win',u0:u-w/2,u1:u+w/2,v0:(sill+fl*st)/wh,v1:(sill+h+fl*st)/wh});
  const row=(wh,n,fl,st,w=.12,sill=22,h=24,skip)=>{const a=[];for(let i=0;i<n;i++){const c=(i+.5)/n;if(skip&&Math.abs(c-skip)<.12)continue;a.push(Wn(wh,c,w,sill,h,fl,st))}return a};
  // Banco: pedra, um pavimento alto com janelas em arco
  bld(14,15,{w:5,h:3,wallH:84,roofH:44,ridge:'x',style:'stone',stoneA:0x8a8a94,stoneB:0x6e6e7a,roof:0x2e3a50,roof2:0x232c3e,seed:11,open:{L:[D(84,.5,.13,56),...row(84,4,0,0,.08,26,40,.5)],R:row(84,2,0,0,.13,26,40)}});
  // Templo: nave alta, janelas góticas, torre
  bld(24,14,{w:4,h:4,wallH:104,roofH:52,ridge:'y',style:'stone',stoneA:0x9a96a2,stoneB:0x7a7684,roof:0x343a4c,roof2:0x282c3a,spire:70,seed:12,open:{L:[D(104,.5,.18,62),Wn(104,.17,.1,30,54),Wn(104,.83,.1,30,54)],R:row(104,3,0,0,.09,30,54)}});
  // Forja: um pavimento
  bld(14,24,{w:4,h:3,wallH:62,roofH:36,ridge:'x',style:'timber',floors:1,wall:0x9c958a,timber:0x2e2420,roof:0x4a3a3e,roof2:0x382c30,seed:13,chimney:1,baseH:14,open:{L:[D(62,.5),Wn(62,.18),Wn(62,.82)],R:row(62,1,0,0,.16)}});
  // Taverna: dois pavimentos
  bld(25,26,{w:4,h:3,wallH:116,roofH:46,ridge:'x',style:'timber',floors:2,wall:0x948c80,timber:0x2a201c,roof:0x3a3e4a,roof2:0x2c303a,seed:14,chimney:1,baseH:14,open:{L:[D(116,.5,.16,50),Wn(116,.17),Wn(116,.83),...row(116,4,1,58)],R:[...row(116,2,0,0),...row(116,2,1,58)]}});
  // casas fora dos muros (alternam 1 e 2 pavimentos)
  const houseP=[[16,33,0x968e84,0x4a3a3e],[25,33,0x8e887e,0x3a4048],[34,13,0x9a9084,0x4a4038],[5,32,0x8a847a,0x3e3a44]];houseP.forEach(([x,y,w,r],i)=>{const two=i%2===1,wh=two?112:64;bld(x,y,{w:3,h:3,wallH:wh,roofH:two?42:38,ridge:i%2?'y':'x',style:'timber',floors:two?2:1,wall:w,timber:0x2a201c,roof:r,seed:30+i,chimney:1,baseH:14,open:{L:[D(wh,.42),Wn(wh,.8),...(two?row(wh,2,1,56):[])],R:[...row(wh,1,0,0,.18),...(two?row(wh,1,1,56,.18):[])]}},{home:i})});
  m.homes=houseP.map(([x,y])=>[x+1.5,y+3.4]);
  // town props
  prop(m,21,21,ART.well);res(21,21);
  const lampAt=[[19,19],[23,19],[19,23],[23,23],[19,13],[23,13],[13,19],[13,23],[29,19],[29,23],[19,29],[23,29],[11,19],[31,19],[19,31],[23,31],[44,19],[50,23],[20,48]];for(const [x,y] of lampAt){prop(m,x,y,ART.lampD,{cvN:ART.lampN.cv,light:{dx:0,dy:-54,r:130,night:1},light2:{dx:0,dy:-6,r:95,night:1,a:.5}});res(x,y)}
  prop(m,24,19,ART.stall,{block:[[24,19],[25,19]],x:25,y:19.5,k:44.5});res(24,19);res(25,19);
  prop(m,18,24,ART.forge,{light:{dx:0,dy:-14,r:110},fire:{dx:0,dy:-26,s:4}});res(18,24);prop(m,18,26,ART.anvil);res(18,26);
  for(const [x,y,a] of [[13,27,'barrel'],[13,28,'barrel'],[14,28,'crate'],[29,25,'barrel'],[24,29,'crate'],[29,29,'hay'],[28,24.5,'hay']]){const tx=Math.floor(x),ty=Math.floor(y);prop(m,tx,ty,a==='barrel'?ART.barrel[(tx+ty)%2]:a==='crate'?ART.crate:ART.hay);res(tx,ty)}
  for(const [x,y,ic] of [[19,17,'coin'],[23,17,'sun'],[19,25,'anvil'],[24,28,'mug'],[23,18,'potion']]){prop(m,x,y,ART.sign[ic]);res(x,y)}
  // cemetery
  for(let y=13;y<=29;y++)for(let x=2;x<=10;x++){if(!(x===2||x===10||y===13||y===29))continue;const gate=x===10&&y>=20&&y<=22;if(gate)continue;const ax=(y===13||y===29)?'x':'y';prop(m,x,y,ART.ifence[ax],{noShadow:1});res(x,y)}
  bld(6,14,{w:2,h:2,wallH:66,roofH:30,ridge:'x',style:'stone',stoneA:0x6a6a74,stoneB:0x54545e,roof:0x2a2e3a,seed:15,open:{L:[{t:'door',u0:.32,u1:.68,v0:0,v1:50/66}],R:[]}});
  for(const x of [4,6,8])for(const y of [17,19,23,25,27]){if(x===4&&y===27)continue;if(R()<.85){prop(m,x,y,ART.grave[(x*3+y)%ART.grave.length]);res(x,y)}}
  m.acts.push({kind:'grave',x:4.5,y:27.5,obj:prop(m,4,27,ART.graveOld)});res(4,27);
  for(const [x,y] of [[3,15],[9,27],[3,22]]){prop(m,x,y,ART.dead[(x+y)%ART.dead.length],{tall:1});res(x,y)}
  for(const [x,y] of [[11,19],[11,23]])if(!isRes(x,y)){prop(m,x,y,ART.torchpost,{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:115}});res(x,y)}
  for(const [x,y] of [[9,19.6],[9,22.4]])addObj(m,{x,y,k:x+y,cv:ART.candles.cv,ox:ART.candles.ox,oy:ART.candles.oy,light:{dx:0,dy:-8,r:70,a:.8}});
  addObj(m,{x:7.6,y:17.6,k:25.2,cv:ART.lantern.cv,ox:ART.lantern.ox,oy:ART.lantern.oy,light:{dx:0,dy:-30,r:110,cold:1},light2:{dx:0,dy:-4,r:80,a:.6}});
  m.acts.push({kind:'enter',to:'cripta',x:7.2,y:16.8,label:'Abrir a porta do mausoléu',msg:'A porta range. Uma escada desce para o escuro, e o ar cheira a cera e pó de osso.'});
  prop(m,28,17,ART.cellar);res(28,17);m.acts.push({kind:'sealed',x:28.5,y:18.4});
  // fields
  for(const [x0,y0,x1,y1] of [[14,2,19,8],[24,2,31,5],[24,7,31,9],[34,2,41,8]]){for(let x=x0-1;x<=x1+1;x++)for(const y of [y0-1,y1+1])if(!isRes(x,y)&&G(x,y)!==DIRT&&G(x,y)!==COBBLE&&(x+y)%3){prop(m,x,y,ART.fence.x,{noShadow:1});res(x,y)}}
  for(const [x,y] of [[16,9],[33,4],[42,6],[27,10]]){prop(m,x,y,ART.hay);res(x,y)}
  // bridge rails
  for(const [by0,by1] of [[20,22],[49,51]])for(let x=30;x<62;x++)for(const y of [by0-1,by1+1])if(G(x,y)===WATER||((G(x,y)===SAND)&&G(x,by0)===BRIDGE)){if(G(x,by0)!==BRIDGE)continue;prop(m,x,y,ART.fence.x,{noShadow:1,block:G(x,y)===WATER?null:[[x,y]]});res(x,y)}
  // goblin camp + cave
  for(const [x,y,c] of [[51,52,0],[57,51,1],[51,57,2]]){const t=ART.tent[c];const bl=[[x,y],[x+1,y],[x,y+1],[x+1,y+1]];bl.forEach(p=>res(...p));addObj(m,{x,y,k:x+y+2,cv:t.cv,ox:t.ox,oy:t.oy,block:bl,tall:1});m.shadows.push({pts:bldShadow(2,2,24).map(p=>{const [ax,ay]=wpx(x,y);return[p[0]+ax,p[1]+ay]})})}
  prop(m,55,55,ART.campfire,{fire:{dx:0,dy:-4,s:6},light:{dx:0,dy:-8,r:150}});res(55,55);
  for(const [x,y] of [[54,53],[57,57]]){prop(m,x,y,ART.totem);res(x,y)}
  for(const [x,y] of [[53,55],[58,54],[56,58]]){prop(m,x,y,ART.crate);res(x,y)}
  {const bl=[];for(let i=58;i<=60;i++)for(let j=57;j<=58;j++){bl.push([i,j]);res(i,j)}const cave=addObj(m,{x:59.5,y:59,k:117.6,cv:ART.cave.cv,ox:ART.cave.ox,oy:ART.cave.oy,block:bl,tall:1,light:{dx:-14,dy:-56,r:90}});m.acts.push({kind:'cave',x:58.4,y:59.6,obj:cave});m.shadows.push({e:1,x:59.5,y:59,rx:70,ry:18,dx:16,dy:0})}
  {const g=ART.gate;addObj(m,{x:62.5,y:36,k:98.6,cv:g.cv,ox:g.ox,oy:g.oy,tall:1});for(const [x,y] of [[62,33],[62,38]])prop(m,x,y,ART.tower,{block:[[x,y]]});for(let y=30;y<=41;y++)if(y<35||y>36){res(63,y);prop(m,63,y,ART.pal.y,{noShadow:1})}m.acts.push({kind:'enter',to:'forte',x:61.6,y:35.6,label:'Entrar no Forte Goblin',msg:'Tambores ecoam além da paliçada. Você está no território do Rei Goblin.'});res(62,35);res(62,36)}
  // chests
  for(const [x,y,id] of [[37,61,'bosque']]){const tx=Math.floor(x),ty=Math.floor(y);const o=prop(m,tx,ty,ART.chest);res(tx,ty);m.acts.push({kind:'chest',id,x:tx+.5,y:ty+.5,obj:o})}
  for(let i=0;i<4;i++){const x=36+i,y=60;res(x,y)}res(36,61);res(38,61);
  // tochas ao longo das estradas e acampamentos abandonados (só fogueira, sem ninguém)
  for(const [x,y] of [[8,19],[4,23],[22,8],[19,4],[34,19],[40,23],[52,19],[58,23],[23,36],[19,42],[27,48],[35,52],[42,48],[55,26],[58,32],[55,40],[58,46],[52,52],[62,48]]){if(!isRes(x,y)&&!m.solid[y*64+x]&&G(x,y)!==WATER){prop(m,x,y,ART.torchpost,{fire:{dx:0,dy:-50,s:2},light:{dx:0,dy:-46,r:120}});res(x,y)}}
  const camp=(cx,cy,i)=>{for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)res(x,y);if(G(cx,cy)===WATER)return;prop(m,cx,cy,ART.campfire,{fire:{dx:0,dy:-4,s:5},light:{dx:0,dy:-8,r:150}});prop(m,cx+1,cy-1,ART.log,{block:null});addObj(m,{x:cx-.8,y:cy+1.2,k:cx+cy+.4,cv:ART.bedroll[i%2].cv,ox:ART.bedroll[i%2].ox,oy:ART.bedroll[i%2].oy});if(i%2===0)prop(m,cx-1,cy-1,ART.crate);else{const t=ART.tent[i%3];addObj(m,{x:cx+1,y:cy+1,k:cx+cy+4,cv:t.cv,ox:t.ox,oy:t.oy,block:[[cx+1,cy+1],[cx+2,cy+1],[cx+1,cy+2],[cx+2,cy+2]],tall:1})}};
  [[7,40],[26,57],[36,45],[40,28],[30,14],[53,30],[12,60],[44,58]].forEach(([x,y],i)=>camp(x,y,i));
  // círculo de pedras do bosque (segredo)
  {const cx=38.5,cy=36.5;for(let y=34;y<=39;y++)for(let x=36;x<=41;x++)res(x,y);const stones=[];for(let i=0;i<7;i++){const a=i/7*6.283+.3,x=Math.floor(cx+Math.cos(a)*2.4),y=Math.floor(cy+Math.sin(a)*2.4);if(!stones.some(s=>s[0]===x&&s[1]===y)){stones.push([x,y]);prop(m,x,y,ART.stone[i%3])}}
    const pl=[];for(const [dx,dy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const x=Math.floor(cx+dx*1.1),y=Math.floor(cy+dy*1.1);const o=prop(m,x,y,ART.plant.c,{block:null,noShadow:1});o.plant={t:0,lit:ART.plantLit.c.cv};pl.push(o)}m.plants.push(...pl);m.circle={x:cx,y:cy,plants:pl,open:false}}
  for(let i=0;i<70;i++){const x=rint(2,61),y=rint(2,61);const t=G(x,y);if(isRes(x,y)||m.solid[y*64+x])continue;if(!(t===FOREST||t===GRAVE||(t===GRASS&&(x<12||y>40))||(t===SAND)))continue;const k=t===GRAVE?'g':i%3===0?'m':'c';const o=prop(m,x,y,ART.plant[k],{block:null,noShadow:1});o.plant={t:0,lit:ART.plantLit[k].cv};m.plants.push(o);res(x,y)}
  // nature
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){const t=G(x,y);if(isRes(x,y)||m.solid[y*64+x])continue;if(t!==GRASS&&t!==FOREST&&t!==GRAVE)continue;if(x>=12&&x<=30&&y>=12&&y<=30)continue;if(x>=2&&x<=10&&y>=13&&y<=29)continue;
    const nearRoad=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const tt=G(x+dx,y+dy);return tt===DIRT||tt===BRIDGE||tt===COBBLE});const border=x<2||y<2||x>61||y>61;const r=R();
    let art=null,tall=1;
    if(border&&r<.85)art=R()<.5?ART.pine[R()*ART.pine.length|0]:ART.oak[R()*ART.oak.length|0];
    else if(t===FOREST&&!nearRoad){if(Math.hypot(x+.5-55.5,y+.5-55.5)<6.5)art=null;else if(r<.14)art=R()<.42?ART.pine[R()*ART.pine.length|0]:R()<.2?ART.autumn[R()*ART.autumn.length|0]:ART.oak[R()*ART.oak.length|0];else if(r<.2){art=ART.bush[R()*ART.bush.length|0];tall=0}else if(r<.22){art=ART.rock[R()*ART.rock.length|0];tall=0}}
    else if(t===GRASS&&!nearRoad&&y>11){if(r<.022)art=ART.oak[R()*ART.oak.length|0];else if(r<.05){art=ART.bush[R()*ART.bush.length|0];tall=0}else if(r<.062){art=ART.rock[R()*ART.rock.length|0];tall=0}}
    if(art)prop(m,x,y,art,{tall})}
  // decals
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){const t=G(x,y);for(let k=0;k<3;k++){const fx=x+R(),fy=y+R(),[wx,wy]=wpx(fx,fy);const r=R();
    if(t===GRASS||t===GRAVE){if(r<.18)decal(m,wx,wy,ART.dec.tuft[R()*3|0]);else if(r<.215&&t===GRASS&&!(x>=12&&x<=30&&y>=12&&y<=30&&R()<.5))decal(m,wx,wy,ART.dec.flow[R()*4|0])}
    else if(t===FOREST){if(r<.16)decal(m,wx,wy,ART.dec.ftuft);else if(r<.18)decal(m,wx,wy,ART.dec.mush)}
    else if(t===DIRT&&r<.05)decal(m,wx,wy,ART.dec.peb)}}
  // regions (first match wins)
  m.regions=[{n:'Vila de Pedravale',r:[12,12,30,30],lv:'Zona segura',dg:0},{n:'Portões do Forte Goblin',r:[58,31,63,40],lv:'Níveis 10–15',dg:4},{n:'Cemitério Antigo',r:[2,13,10,29],lv:'Calmo... de dia',dg:1},{n:'Toca dos Goblins (entrada)',r:[49,49,62,62],lv:'Níveis 7–11',dg:3},{n:'Terras Goblins',r:[47,12,63,63],lv:'Níveis 6–11',dg:3},{n:'Margens do Rio Claro',r:[42,0,47,63],lv:'Níveis 3–8',dg:2},{n:'Bosque de Vellmor',r:[31,24,46,63],lv:'Níveis 4–9',dg:2},{n:'Campos de Trigo',r:[0,0,46,11],lv:'Níveis 1–4',dg:1},{n:'Planície do Sul',r:[0,31,30,63],lv:'Níveis 2–6',dg:1},{n:'Arredores de Pedravale',r:[0,0,63,63],lv:'Níveis 1–5',dg:1}];
  m.spawns=[['espantalho',[16,5,16,5],1],['espantalho',[27,3,27,3],1],['espantalho',[29,8,29,8],1],['espantalho',[37,5,37,5],1],['javali',[14,1,42,11],8],['javali',[3,33,29,61],6],['lobo',[32,25,43,60],9],['lobo',[3,40,29,61],3],['goblin',[49,24,62,60],7],['goblin_arq',[49,36,62,60],4],['goblin_guer',[51,46,62,60],2]];
  m.dummies=[[24.5,24.4],[26.3,24.2],[28,23.8]];
  m.spawnPt=[21.5,24.6];m.temple=[26.5,20.9];m.caveOut=[57.6,60.6];
  m.npcDefs=[
    {id:'osvaldo',n:'Osvaldo, o Banqueiro',x:16.4,y:18.8,look:{skin:SKINS[0],hair:0x8a8a8a,hs:'short',beard:1,chest:0x2e3e6a,ct:'robe',robe:1,trim:0xe8c050,legs:0x2a2a3a,boots:0x2a2018},role:'bank'},
    {id:'elen',n:'Irmã Elen',x:25.6,y:18.8,look:{skin:SKINS[1],hair:0xe8e0d0,hs:'long',chest:0xe8e2d4,ct:'robe',robe:1,trim:0xc8a050,legs:0xe8e2d4,boots:0x8a7a6a,hd:'hood',hdCol:0xf0ece0},role:'temple'},
    {id:'lia',n:'Lia, a Mercadora',x:24.6,y:20.4,look:{skin:SKINS[0],hair:0x9a3a22,hs:'long',chest:0x3e6a3a,ct:'robe',robe:1,trim:0xe8d8a0,legs:0x3e6a3a,boots:0x4a3222},role:'shop'},
    {id:'bruno',n:'Bruno, o Ferreiro',x:18.7,y:25.3,look:{skin:SKINS[2],hair:0x2a1e18,hs:'bald',beard:1,chest:0x8a6a5a,ct:'apron',legs:0x4a3a2a,boots:0x2a1e14,gloves:0x4a3020,wt:'mace',wcol:0x8a8a98},role:'smith'},
    {id:'ilsa',n:'Ilsa, a Caçadora',x:32.2,y:23.6,look:{skin:SKINS[1],hair:0xc8984e,hs:'long',chest:0x5a4a2a,ct:'leather',legs:0x4a3a2a,boots:0x3a2a1a,hd:'hood',hdCol:0x3e5a32,wt:'bow',wcol:0x6a4428,cape:0x3e5a32,sh:'quiver'},role:'hunter'},
    {id:'guarda',n:'Sentinela Rurik',x:31.6,y:19.4,look:{skin:SKINS[0],hair:0x3a2a22,chest:0x8a909a,ct:'chain',legs:0x4a4a5a,boots:0x2a2a30,hd:'helm',hdCol:0x9098a4,wt:'spear',sh:'kite',shCol:0x2e4a8a,cape:0x2e4a7a},role:'guard'},
    {id:'tome',n:'Tomé',x:18.2,y:27,look:{skin:SKINS[2],hair:0x2a1e18,hs:'short',chest:0x7a6a4a,ct:'cloth',legs:0x4a3a2a,boots:0x3a2a1a,scale:.85},role:'tome',hidden:1},
    {id:'aldo',n:'Aldo',x:21,y:25,look:{skin:SKINS[1],hair:0xc8984e,hs:'short',chest:0x6a7a4a,ct:'cloth',legs:0x5a4a3a,boots:0x3a2a1a},role:'villager',route:[[21.2,25.5],[21.4,17.6],[17,21.4],[26,21.6],[21.4,29.2]],home:0},
    {id:'mirela',n:'Mirela',x:23,y:21,look:{skin:SKINS[0],hair:0x3a2a22,hs:'long',chest:0x8a4a5a,ct:'robe',robe:1,legs:0x8a4a5a,boots:0x3a2a1a},role:'villager',route:[[23.5,21.4],[28.5,21.2],[21.3,14],[21.4,28],[16,21.5]],home:1}
  ];
  return m}
function genDungeon(ART){const m=makeMap('dungeon',40,40,{name:'Toca dos Goblins',dark:.7,bg:0x0a0806,indoor:1,tint:0xc0a488,soft:'rgba(110,60,20,.22)',darkCol:'22,12,6'});const R=mulberry(4242);
  m.terr.fill(VOID);const room=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)m.terr[y*40+x]=CAVE};
  room(3,3,9,9);room(10,5,14,6);room(15,2,23,10);room(18,11,19,15);room(12,16,25,24);room(26,19,28,20);room(29,17,34,23);room(18,25,19,28);room(10,29,28,37);
  for(let i=0;i<1600;i++)if(m.terr[i]===VOID)m.solid[i]=1;
  const isF=(x,y)=>tAt(m,x,y)===CAVE;
  for(let y=0;y<40;y++)for(let x=0;x<40;x++){if(isF(x,y))continue;let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(isF(x+i,y+j))near=true;if(!near)continue;
    const short=isF(x-1,y)||isF(x,y-1)||isF(x-1,y-1);const front=isF(x+1,y)||isF(x,y+1);const r=R();const deco=!short&&front?(r<.16?'torch':r<.24?'banner':null):null;
    const art=ART.rwall[(short?'s':'t')+(deco==='banner'?'beam':deco||'')+((x*7+y)%3)]||ART.rwall[(short?'s':'t')+((x*7+y)%3)];
    const o=addObj(m,{x:x+.5,y:y+.5,k:x+y+1+(short?.4:0),cv:art.cv,ox:art.ox,oy:art.oy,tall:short?0:1,wall:1});if(art.flame){o.fire={dx:art.flame[0],dy:art.flame[1],s:3};o.light={dx:art.flame[0],dy:art.flame[1]+4,r:200}}}
  const P=(x,y,a,ex)=>prop(m,x,y,a,ex);
  for(let i=0;i<30;i++){const x=3+R()*30,y=3+R()*34;if(tAt(m,x,y)===CAVE&&!solidAt(m,x,y)){const [wx,wy]=wpx(x,y);decal(m,wx,wy,R()<.5?ART.dec.mush:ART.dec.peb)}}
  P(4,4,ART.stairs,{block:[[4,4]],light:{dx:0,dy:-20,r:120,cold:1}});m.acts.push({kind:'exit',x:5,y:5});
  P(19,30,ART.throne);for(const [x,y] of [[13,31],[25,31],[13,35],[25,35]])P(x,y,ART.pillar);
  P(33,19,ART.cage,{block:null});
  for(const [x,y,a] of [[8,8,'barrel'],[16,3,'crate'],[22,9,'barrel'],[13,23,'crate'],[24,17,'barrel'],[34,22,'crate'],[11,36,'barrel'],[27,36,'crate']])P(x,y,a==='barrel'?ART.barrel[0]:ART.crate);
  for(let i=0;i<26;i++){const x=3+R()*30,y=3+R()*34;if(tAt(m,x,y)===CAVE){const [wx,wy]=wpx(x,y);decal(m,wx,wy,ART.bones[i%3])}}
  P(16,17,ART.campfire,{fire:{dx:0,dy:-4,s:5},light:{dx:0,dy:-8,r:140}});
  m.regions=[{n:'Toca dos Goblins',r:[0,0,40,40],lv:'Níveis 8–13',dg:3}];
  m.spawns=[['goblin',[15,2,23,10],4],['goblin_arq',[12,16,25,24],3],['goblin_guer',[12,16,25,24],2],['goblin',[12,16,25,24],2],['goblin',[29,17,34,23],2]];
  m.boss=['goblin_chefe',[19.5,33.5]];m.spawnPt=[6.5,6.5];
  m.npcDefs=[{id:'tome_cage',n:'Tomé',x:33.5,y:19.6,look:{skin:SKINS[2],hair:0x2a1e18,hs:'short',chest:0x7a6a4a,ct:'cloth',legs:0x4a3a2a,boots:0x3a2a1a,scale:.85},role:'tome_cage'}];
  return m}
function buildArt(){const A={};
  A.oak=[1,2,3,4,5,6].map(s=>makeTree(100+s,'oak'));A.autumn=[1,2,3].map(s=>makeTree(150+s,'autumn'));A.pine=[1,2,3,4].map(s=>makeTree(200+s,'pine'));A.dead=[1,2].map(s=>makeTree(250+s,'dead'));A.bush=[1,2,3,4].map(s=>makeTree(300+s,'bush'));
  A.rock=[1,2,3,4].map(s=>makeRock(400+s,.6+((s*37)%5)/10));A.wall=[1,2,3].map(s=>propTownWall(500+s,0));A.wallT=propTownWall(510,1);
  A.lampD=propLamp(false);A.lampN=propLamp(true);A.well=propWell();A.stall=propStall(7,0xc83a2a,0xf0e6d0);A.forge=propForge();A.anvil=propAnvil();
  A.barrel=[propBarrel(1),propBarrel(2)];A.crate=propCrate(3);A.hay=propHay();A.chest=propChest(false);A.chestOpen=propChest(true);
  A.sign={};for(const k of ['coin','sun','anvil','mug','potion','sword'])A.sign[k]=propSign(k);
  A.fence={x:propFence('x',0),y:propFence('y',0)};A.ifence={x:propFence('x',1),y:propFence('y',1)};A.grave=[0,1,2,0,1].map((k,i)=>propGrave(600+i,k));A.graveOld=propGrave(666,2);
  A.cave=propCave();A.tent=[0x6a5e4a,0x5e4a3a,0x545440].map((c,i)=>propTent(700+i,c));A.campfire=propCampfireBase();A.totem=propTotem();
  A.stairs=propStairs();A.throne=propThrone();A.pillar=propPillar(9);A.cage=propCage();A.bones=[1,2,3].map(propBones);
  A.dwall={};for(const t of ['t','s'])for(let i=0;i<3;i++){A.dwall[t+i]=propDungeonWall(800+i,t==='t',null);if(t==='t'){A.dwall['ttorch'+i]=propDungeonWall(820+i,1,'torch');A.dwall['tbanner'+i]=propDungeonWall(840+i,1,'banner')}}
  A.cwall={};for(const t of ['t','s'])for(let i=0;i<3;i++){A.cwall[t+i]=propWall2(860+i,t==='t',null,CRYPT_PAL);if(t==='t'){A.cwall['tcandle'+i]=propWall2(870+i,1,'candle',CRYPT_PAL);A.cwall['tskulls'+i]=propWall2(880+i,1,'skulls',CRYPT_PAL)}}
  A.sarc=[propSarcophagus(1,0),propSarcophagus(2,1)];A.candles=propCandles(5);A.skullpile=propSkullPile(6);A.altar=propAltar();
  A.pal={x:propPalisade(1,'x'),y:propPalisade(2,'y')};A.tower=propTower(3);A.banner=[propBanner(1,0x8a2a2a),propBanner(2,0x5a2a6a)];A.drum=propDrum();A.gate=propGate();
  A.cellar=propCellar();
  A.rwall={};A.swall={};for(const t of ['t','s'])for(let i=0;i<3;i++){A.rwall[t+i]=propRockWall(1000+i,t==='t',null,ROCK_CAVE);A.swall[t+i]=propRockWall(1100+i,t==='t',null,ROCK_SANCT);if(t==='t'){A.rwall['ttorch'+i]=propRockWall(1010+i,1,'torch',ROCK_CAVE);A.rwall['tbeam'+i]=propRockWall(1020+i,1,'beam',ROCK_CAVE);A.swall['tcrystal'+i]=propRockWall(1110+i,1,'crystal',ROCK_SANCT)}}
  A.plant={c:propGlowPlant(1,0x5ad8ff,0),m:propGlowPlant(2,0xd87aff,0),g:propGlowPlant(3,0x8affa0,0)};A.plantLit={c:propGlowPlant(1,0x5ad8ff,1),m:propGlowPlant(2,0xd87aff,1),g:propGlowPlant(3,0x8affa0,1)};
  A.torchpost=propTorchPost();A.lantern=propLantern();A.portalBase=propPortalBase();A.bedroll=[propBedroll(1,0x8a3a3a),propBedroll(2,0x3a5a7a)];A.log=propLog();A.stone=[1,2,3].map(propStandingStone);A.crystal={c:propCrystal(1,0x5ad8ff),m:propCrystal(2,0xd87aff)};
  A.dec=decalArt();buildArt2(A);return A}
// ---------- cemetery crypt ----------
const CRYPT=11;
function genCrypt(ART){const m=makeMap('cripta',36,36,{name:'Cripta Esquecida',dark:.72,bg:0x050708,indoor:1,tint:0x7a94b8,soft:'rgba(30,100,110,.28)',darkCol:'4,12,18'});const R=mulberry(777);m.terr.fill(VOID);
  const room=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)m.terr[y*36+x]=CRYPT};
  room(3,3,9,9);room(10,5,15,6);room(16,2,26,10);room(20,11,21,15);room(12,16,30,23);room(10,18,11,19);room(2,15,9,22);room(20,24,21,27);room(11,28,30,34);
  for(let i=0;i<36*36;i++)if(m.terr[i]===VOID)m.solid[i]=1;const isF=(x,y)=>tAt(m,x,y)===CRYPT;
  for(let y=0;y<36;y++)for(let x=0;x<36;x++){if(isF(x,y))continue;let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(isF(x+i,y+j))near=true;if(!near)continue;
    const short=isF(x-1,y)||isF(x,y-1)||isF(x-1,y-1),front=isF(x+1,y)||isF(x,y+1),r=R();const deco=!short&&front?(r<.14?'candle':r<.3?'skulls':null):null;const art=ART.cwall[(short?'s':'t')+(deco||'')+((x*7+y)%3)]||ART.cwall[(short?'s':'t')+((x*7+y)%3)];
    const o=addObj(m,{x:x+.5,y:y+.5,k:x+y+1+(short?.4:0),cv:art.cv,ox:art.ox,oy:art.oy,tall:short?0:1,wall:1});if(art.flame){o.fire={dx:art.flame[0],dy:art.flame[1],s:2,pal:'ghost'};o.light={dx:art.flame[0],dy:art.flame[1]+4,r:160,cold:1}}}
  const P=(x,y,a,ex)=>prop(m,x,y,a,ex);
  P(4,4,ART.stairs,{light:{dx:0,dy:-20,r:120,cold:1}});m.acts.push({kind:'exit',x:5,y:5,label:'Subir ao cemitério',to:'world',at:[7.2,17.4]});
  for(const [x,y] of [[16,18],[16,21],[22,18],[22,21],[28,18],[28,21],[14,29],[26,29],[14,33],[26,33]])P(x,y,ART.pillar);
  for(const [x,y,o] of [[19,4,0],[23,4,1],[19,8,1],[23,8,0],[13,20,0],[19,19,1],[25,19,0],[19,22,0],[25,22,1]])addObj(m,{x:x,y:y,k:x+y+1.2,cv:ART.sarc[o].cv,ox:ART.sarc[o].ox,oy:ART.sarc[o].oy,block:[[x,y],[x+1,y]]});
  for(const [x,y] of [[6,7],[17,3],[25,9],[13,17],[29,22],[3,16],[8,21],[12,34],[29,33],[17,29],[23,29]]){const c=ART.candles;const o=P(x,y,c,{block:null});o.fires=c.flames;o.firePal='ghost';o.light={dx:0,dy:-14,r:130,cold:1}}
  for(const [x,y] of [[24,3],[16,9],[12,23],[30,16],[3,21],[11,31],[30,30]])P(x,y,ART.skullpile);
  P(20,29,ART.altar,{block:[[20,29],[21,29]],light:{dx:4,dy:-30,r:170,cold:1}});
  for(let i=0;i<46;i++){const x=2+R()*30,y=2+R()*32;if(tAt(m,x,y)===CRYPT){const [wx,wy]=wpx(x,y);decal(m,wx,wy,ART.bones[i%3])}}
  {const o=prop(m,3,18,ART.chest);m.acts.push({kind:'chest',id:'mausoleu',x:3.5,y:18.5,obj:o})}
  m.regions=[{n:'Cripta Esquecida',r:[0,0,36,36],lv:'Níveis 9–14',dg:3}];
  m.spawns=[['esqueleto',[16,2,26,10],4],['esq_arq',[12,16,30,23],3],['esqueleto',[12,16,30,23],3],['espectro',[12,16,30,23],1],['espectro',[2,15,9,22],1],['esqueleto',[2,15,9,22],1]];
  m.boss=['abade',[20.5,31.6]];m.spawnPt=[6.5,6.5];m.npcDefs=[];return m}
// ---------- goblin fortress (outdoor) ----------
function genForte(ART){const m=makeMap('forte',46,46,{name:'Forte Goblin',dark:0,bg:0x161a14});const R=mulberry(555);const T=(x,y,t)=>{if(inb(m,x,y))m.terr[y*46+x]=t};
  for(let y=0;y<46;y++)for(let x=0;x<46;x++)T(x,y,(x<3||y<3||x>42||y>42)?FOREST:vn(x/4,y/4,9)>.42?DIRT:GRASS);
  for(let y=21;y<=23;y++)for(let x=0;x<=40;x++)T(x,y,DIRT);for(let y=5;y<=40;y++)for(let x=34;x<=40;x++)if(Math.hypot(x-37,y-22)<6)T(x,y,DIRT);
  const res=new Set();const rs=(x,y)=>res.add(x+','+y);
  // palisade ring with a west gate
  for(let y=6;y<=39;y++)for(let x=7;x<=41;x++){if(!(x===7||x===41||y===6||y===39))continue;if(x===7&&y>=20&&y<=24)continue;prop(m,x,y,(y===6||y===39)?ART.pal.x:ART.pal.y,{noShadow:1});rs(x,y)}
  for(const [x,y] of [[7,18],[7,26],[7,6],[41,6],[7,39],[41,39],[24,6],[24,39]]){prop(m,x,y,ART.tower,{block:[[x,y]]});rs(x,y)}
  prop(m,5,22,ART.gate,{block:null,k:28.5});
  const hut=(x,y,i)=>{const o=makeBuilding({w:3,h:3,wallH:40,roofH:34,ridge:i%2?'y':'x',style:'timber',wall:0x6a5a44,timber:0x3a2a1a,roof:0x8a7a4a,roof2:0x6a5a3a,seed:900+i,baseH:8,open:{L:[{t:'door',u0:.4,u1:.6,v0:0,v1:.8}],R:[]}},false);const bl=[];for(let a=0;a<3;a++)for(let b2=0;b2<3;b2++){bl.push([x+a,y+b2]);rs(x+a,y+b2)}addObj(m,{x,y,k:x+y+3,cv:o.cv,ox:o.ox,oy:o.oy,block:bl,tall:1});const [ax,ay]=wpx(x,y);m.shadows.push({pts:bldShadow(3,3,60).map(p=>[p[0]+ax,p[1]+ay])})};
  [[11,9],[18,9],[11,30],[18,31],[27,9],[27,31],[12,15],[13,26]].forEach(([x,y],i)=>hut(x,y,i));
  for(const [x,y] of [[22,15],[22,28],[31,22]]){prop(m,x,y,ART.campfire,{fire:{dx:0,dy:-4,s:6},light:{dx:0,dy:-8,r:160}});rs(x,y)}
  for(const [x,y,c] of [[34,17,0x8a2a2a],[34,27,0x8a2a2a],[30,12,0x5a2a6a],[30,33,0x5a2a6a],[10,20,0x8a2a2a],[10,24,0x8a2a2a]]){prop(m,x,y,ART.banner[c===0x8a2a2a?0:1]);rs(x,y)}
  for(const [x,y] of [[25,19],[25,25],[17,22]]){prop(m,x,y,ART.drum);rs(x,y)}for(const [x,y] of [[20,19],[29,26],[15,35]]){prop(m,x,y,ART.cage,{block:[[x,y]]});rs(x,y)}
  for(const [x,y] of [[19,13],[33,10],[16,36],[35,35],[9,12]]){prop(m,x,y,ART.totem);rs(x,y)}for(const [x,y] of [[24,12],[26,34],[32,15],[9,34]]){prop(m,x,y,ART.crate);rs(x,y)}
  prop(m,38,22,ART.throne,{light:{dx:0,dy:-30,r:130}});rs(38,22);
  for(let y=0;y<46;y++)for(let x=0;x<46;x++){if(res.has(x+','+y)||m.solid[y*46+x])continue;const t=m.terr[y*46+x];if(t!==FOREST&&!(x<7||x>41||y<6||y>39))continue;if(t===DIRT)continue;const r=R();if(r<.5)prop(m,x,y,R()<.5?ART.pine[R()*4|0]:ART.oak[R()*6|0],{tall:1})}
  for(let y=0;y<46;y++)for(let x=0;x<46;x++){const t=m.terr[y*46+x];const [wx,wy]=wpx(x+R(),y+R());if(t===GRASS&&R()<.3)decal(m,wx,wy,ART.dec.tuft[R()*3|0]);else if(t===DIRT&&R()<.12)decal(m,wx,wy,R()<.5?ART.dec.peb:ART.bones[R()*3|0])}
  m.acts.push({kind:'exit',x:3.4,y:22.5,label:'Voltar para as Terras Goblins',to:'world',at:[59.6,35.6]});
  m.regions=[{n:'Forte Goblin',r:[0,0,46,46],lv:'Níveis 10–15',dg:4}];
  m.spawns=[['goblin',[9,8,32,37],8],['goblin_arq',[9,8,34,37],5],['goblin_guer',[14,14,34,32],4],['goblin_xama',[14,12,33,33],3]];
  m.boss=['goblin_rei',[36.5,22.5]];m.spawnPt=[4.2,22.5];m.npcDefs=[];return m}

// ---------- secret sanctuary (bioluminescent cave) ----------
const MOSS=12;
function genSantuario(ART){const m=makeMap('santuario',34,34,{name:'Santuário Lunar',dark:.78,bg:0x04080c,indoor:1,tint:0x6a9ec0,soft:'rgba(20,120,130,.3)',darkCol:'2,10,20'});const R=mulberry(1313);m.terr.fill(VOID);
  const ch=[[6,6,3.6],[13,11,3.4],[21,7,3.8],[26,15,4],[17,19,4.4],[8,25,3.8],[21,27,5.6]];const carve=(x,y,r)=>{for(let j=Math.floor(y-r-1);j<=y+r+1;j++)for(let i=Math.floor(x-r-1);i<=x+r+1;i++){if(!inb(m,i,j))continue;const d=Math.hypot(i+.5-x,j+.5-y)+(vn(i*.5,j*.5,5)-.5)*1.6;if(d<r)m.terr[j*34+i]=MOSS}};
  for(const [x,y,r] of ch)carve(x,y,r);for(let k=0;k<ch.length-1;k++){const [a,b2]=[ch[k],ch[k+1]];for(let t=0;t<=1;t+=.04)carve(a[0]+(b2[0]-a[0])*t,a[1]+(b2[1]-a[1])*t,1.7)}
  for(let k=0;k<26;k++){const c=ch[1+k%5];const x=Math.floor(c[0]+rnd(-c[2],c[2])*.7),y=Math.floor(c[1]+rnd(-c[2],c[2])*.7);if(tAt(m,x,y)===MOSS&&Math.hypot(x-c[0],y-c[1])>1.8&&R()<.5)m.terr[y*34+x]=WATER}
  for(let i=0;i<34*34;i++)if(m.terr[i]===VOID||m.terr[i]===WATER)m.solid[i]=1;const isF=(x,y)=>{const t=tAt(m,x,y);return t===MOSS||t===WATER};
  for(let y=0;y<34;y++)for(let x=0;x<34;x++){if(isF(x,y))continue;let near=false;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(isF(x+i,y+j))near=true;if(!near)continue;
    const short=isF(x-1,y)||isF(x,y-1)||isF(x-1,y-1),front=isF(x+1,y)||isF(x,y+1);const deco=front&&!short&&R()<.22?'crystal':null;const art=ART.swall[(short?'s':'t')+(deco||'')+((x*5+y)%3)]||ART.swall[(short?'s':'t')+((x*5+y)%3)];
    const o=addObj(m,{x:x+.5,y:y+.5,k:x+y+1+(short?.4:0),cv:art.cv,ox:art.ox,oy:art.oy,tall:short?0:1,wall:1});if(art.light)o.light={dx:art.light[0],dy:art.light[1],r:120,cold:1}}
  for(let y=0;y<34;y++)for(let x=0;x<34;x++)if(m.terr[y*34+x]===WATER)m.waterTiles.push([x,y]);
  const P=(x,y,a,ex)=>prop(m,x,y,a,ex);P(5,5,ART.stairs,{light:{dx:0,dy:-20,r:120,cold:1}});m.acts.push({kind:'exit',x:6.2,y:6.2,label:'Subir ao círculo de pedras',to:'world',at:[38.5,38.6]});
  for(let k=0;k<40;k++){const c=ch[k%ch.length];const x=Math.floor(c[0]+rnd(-c[2],c[2])*.85),y=Math.floor(c[1]+rnd(-c[2],c[2])*.85);if(tAt(m,x,y)!==MOSS||solidAt(m,x,y)||Math.hypot(x+.5-c[0],y+.5-c[1])<1.2)continue;if(R()<.3){const col=R()<.5?'c':'m';const o=P(x,y,ART.crystal[col],{light:{dx:0,dy:-18,r:110,cold:1}})}else{const k2=R()<.5?'c':'m';const o=P(x,y,ART.plant[k2],{block:null,noShadow:1});o.plant={t:0,lit:ART.plantLit[k2].cv};m.plants.push(o)}}
  for(let i=0;i<50;i++){const x=1+R()*32,y=1+R()*32;if(tAt(m,x,y)===MOSS){const [wx,wy]=wpx(x,y);decal(m,wx,wy,R()<.5?ART.dec.mush:ART.dec.ftuft)}}
  {const o=prop(m,25,13,ART.chest);m.acts.push({kind:'chest',id:'santuario',x:25.5,y:13.5,obj:o})}
  m.regions=[{n:'Santuário Lunar',r:[0,0,34,34],lv:'Níveis 10–15 · segredo',dg:3}];
  m.spawns=[['espirito',[10,8,24,12],3],['lobo_espectral',[20,11,30,20],3],['espirito',[12,15,22,23],2],['lobo_espectral',[4,21,12,29],2]];
  m.boss=['anciao',[21.5,28]];m.spawnPt=[6.8,7.2];m.npcDefs=[];return m}
