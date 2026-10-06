// ===================== region art: recolors, snow, and new props =====================
function cloneArt(a,fn){const c=document.createElement('canvas');c.width=a.cv.width;c.height=a.cv.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(a.cv,0,0);
  if(fn){const id=x.getImageData(0,0,c.width,c.height),d=id.data;fn(d,c.width,c.height);x.putImageData(id,0,0)}return Object.assign({},a,{cv:c})}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h/=6}return[h,s,l]}
function hsl2rgb(h,s,l){if(!s){const v=Math.round(l*255);return[v,v,v]}const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return[Math.round(f(h+1/3)*255),Math.round(f(h)*255),Math.round(f(h-1/3)*255)]}
// remap pixels whose hue falls in [h0,h1] (0..1): to hue h, scaling saturation and lightness
function recolor(a,h0,h1,h,sm=1,lm=1,la=0){return cloneArt(a,(d)=>{for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const [hh,ss,ll]=rgb2hsl(d[i],d[i+1],d[i+2]);const inR=h0<=h1?(hh>=h0&&hh<=h1):(hh>=h0||hh<=h1);if(!inR||ss<.08)continue;const [r,g,b]=hsl2rgb(h,Math.min(1,ss*sm),Math.min(1,Math.max(0,ll*lm+la)));d[i]=r;d[i+1]=g;d[i+2]=b}})}
// warm/cool tint of everything (used for sandstone and mossy variants)
function tintArt(a,col,k){const tr=(col>>16)&255,tg=(col>>8)&255,tb=col&255;return cloneArt(a,(d)=>{for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const l=(d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255;d[i]=d[i]*(1-k)+tr*l*1.25*k;d[i+1]=d[i+1]*(1-k)+tg*l*1.25*k;d[i+2]=d[i+2]*(1-k)+tb*l*1.25*k}})}
// snow on every surface that faces up (pixels with empty space above)
function snowify(a,depth=3,amt=1){return cloneArt(a,(d,w,h)=>{const al=(x,y)=>y<0?0:d[(y*w+x)*4+3];const src=new Uint8Array(w*h);for(let y=0;y<h;y++)for(let x=0;x<w;x++)src[y*w+x]=al(x,y)>0?1:0;
  for(let x=0;x<w;x++){let run=0;for(let y=0;y<h;y++){const i=y*w+x;if(!src[i]){run=0;continue}const top=y===0||!src[i-w];if(top)run=depth+((x*7+y*3)%3===0?1:0);if(run>0){const k=i*4,l=(d[k]*.3+d[k+1]*.59+d[k+2]*.11)/255,sh=x>0&&src[i-1]&&!(y>0&&src[i-w-1])?.0:.04;const v=Math.min(255,200+l*55)*amt+d[k]*(1-amt);d[k]=v-8-sh*255;d[k+1]=v-2-sh*200;d[k+2]=Math.min(255,v+6);run--}}}})}
function propBamboo(seed){const R=mulberry(seed),pb=new PB(46,96),cx=23,base=92;
  for(let k=0;k<5;k++){const x=cx+(k-2)*6+(R()-.5)*3,h=60+R()*30,lean=(R()-.5)*8;for(let y=0;y<h;y++){const t=y/h,px=x+lean*t*t,node=(y%13)<1.2;pb.rect(Math.round(px)-1,base-y,3,1,(i)=>node?0x8aa04a:i===0?0xa8c86a:i===2?0x4a6a2a:0x6a8a3a)}
    for(let j=0;j<4;j++){const ly=base-h*(.5+j*.13),lx=x+lean*(.5+j*.13)**2,dir=j&1?1:-1;pb.tri([lx,ly],[lx+dir*14,ly+3+R()*3],[lx+dir*10,ly+6],(u,v)=>v<.4?0x7aa848:0x4a7a2a)}}
  pb.outline(0x16200e);return{cv:pb.canvas(),ox:cx,oy:base,r:9,tall:1}}
function propTorii(){const pb=new PB(132,120),cx=66,base=112;const red=0xc8301e,dk=0x1a1418;
  for(const sd of [-1,1]){const x=cx+sd*40;pb.rect(x-3,base-86,7,86,(i)=>i<2?tone(red,.2):i>4?tone(red,-.3):red);pb.rect(x-5,base-6,11,6,dk)}
  pb.rect(cx-50,base-72,100,6,(i,j)=>j<2?tone(red,.15):red);pb.rect(cx-3,base-80,7,8,red);
  for(let x=-62;x<=62;x++){const lift=Math.pow(Math.abs(x)/62,3)*7;pb.rect(cx+x,Math.round(base-92-lift),1,8,(i,j)=>j<2?0x3a3438:dk)}
  pb.outline(0x0c0a0c);return{cv:pb.canvas(),ox:cx,oy:base,tall:1}}
function propToro(){const pb=new PB(30,56),cx=15,base=52,st=0x8a8a84;pb.rect(cx-7,base-4,15,4,tone(st,-.2));pb.rect(cx-2,base-22,5,18,(i)=>tone(st,i<1?.15:i>3?-.25:0));pb.rect(cx-6,base-24,13,3,st);
  pb.rect(cx-5,base-34,11,10,(i,j)=>(i>1&&i<9&&j>2&&j<8)?0xffd890:tone(st,i<2?.1:-.15));pb.tri([cx-11,base-34],[cx+11,base-34],[cx,base-44],(u,v)=>tone(st,v<.5?.1:-.2));pb.rect(cx-1,base-47,3,3,st);
  pb.outline(0x1a1a1c);return{cv:pb.canvas(),ox:cx,oy:base,r:5,light:[0,-29]}}
function propPagoda(){const pb=new PB(180,380),G=370;const wall=0xe8dcc4,post=0x8a2a1e,roof=0x2e3440;let top=null,y=G;
  const tiers=[[3,58],[2.4,44],[1.8,38]];
  for(const [s2,ht] of tiers){const N=[90,y-s2*2*16];isoBox(pb,N,s2,s2,ht,null,(u,v)=>(u<.05||u>.95||Math.abs(u-.5)<.035)?post:(v>.3&&v<.72&&((u*6|0)&1))?0x3a2a22:tone(wall,.04),(u,v)=>(u<.05||u>.95||Math.abs(u-.5)<.035)?tone(post,-.25):(v>.3&&v<.72&&((u*6|0)&1))?0x2a1e18:tone(wall,-.2));
    const cy=N[1]-ht+s2*16,rw=s2+.9,Nr=[90,cy-rw*16+5],E=[Nr[0]+rw*32,Nr[1]+rw*16],S=[Nr[0],Nr[1]+rw*32],W=[Nr[0]-rw*32,Nr[1]+rw*16],apex=[90,cy-20-s2*3];
    pb.tri(Nr,W,apex,()=>tone(roof,.14));pb.tri(E,Nr,apex,()=>tone(roof,-.02));pb.tri(W,S,apex,(u,v)=>tone(roof,((v*9|0)&1?-.05:.05)+.06));pb.tri(S,E,apex,(u,v)=>tone(roof,((v*9|0)&1?-.1:0)-.18));
    for(const q of [W,E,S])pb.thick(q[0],q[1],q[0]+(q===W?-6:q===E?6:0),q[1]-5,2,()=>0x1a1e26);
    top=apex;y=apex[1]+18}
  pb.thick(top[0],top[1],top[0],top[1]-26,2,()=>0xd8b048);for(let i=0;i<4;i++)pb.ell(top[0],top[1]-6-i*5,3-i*.4,1.4,()=>0xd8b048);
  pb.outline(0x0c0a10);return{cv:pb.canvas(),ox:90,oy:G-6*16,tall:1}}
function propPalm(seed){const R=mulberry(seed),pb=new PB(110,130),cx=55,base=124;const lean=(R()-.5)*30,h=78+R()*20;let tx=cx,ty=base;
  for(let i=0;i<h;i++){const t=i/h,x=cx+lean*t*t,y=base-i;pb.rect(Math.round(x)-3,Math.round(y),6,1,(k)=>((i%6)<1?0x6a4a2a:k<2?0xa8845a:k>3?0x5a3a20:0x8a6a42));tx=x;ty=y}
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2+R()*.3,len=30+R()*12,dx=Math.cos(a),dy=Math.sin(a)*.5;for(let s=0;s<len;s++){const t=s/len,x=tx+dx*s,y=ty+dy*s+t*t*16-4;const w=Math.max(1,Math.round(5*(1-t)));pb.rect(Math.round(x),Math.round(y),1,w,(i,j)=>j===0?0x8ac85a:(s%3===0?0x2a5a1e:0x4a8a32))}}
  for(let i=0;i<3;i++)pb.ell(tx+(i-1)*4,ty+4,3,3,()=>0x5a3a1a);
  pb.outline(0x12200c);return{cv:pb.canvas(),ox:cx,oy:base,r:10,tall:1}}
function propPalace(){const pb=new PB(240,280),G=270,w=4,h=4,ht=72,N=[120,G-(w+h)*16];const st=0xd8c09a,st2=0xc0a47c;
  isoBox(pb,N,w,h,ht,(u,v)=>tone(st,.12-((u*8|0)+(v*8|0)&1?.03:0)),(u,v)=>{const ar=Math.abs((u*8)%1-.5)<.17&&v>.38&&v<.78,door=Math.abs(u-.5)<.07&&v<.55;return door?0x2a1e18:ar?0x3a2e28:((v*16|0)%4===0?tone(st,-.1):st)},(u,v)=>{const ar=Math.abs((u*8)%1-.5)<.17&&v>.38&&v<.78;return ar?0x2a1e18:((v*16|0)%4===0?tone(st2,-.25):tone(st2,-.15))});
  const cx=120,cy=N[1]-ht+(w+h)*8;pb.rect(cx-36,cy-36,72,36,(i)=>tone(st,i<36?.05:-.18));
  pb.ell(cx,cy-36,40,42,(nx,ny,px,py)=>ny>0?null:tone(ny<-.78?0x6ac8d8:0x2a8a9a,.25-(nx*.4+ny*.2)+(((px+py)>>2)&1?.04:0)));
  pb.thick(cx,cy-78,cx,cy-96,2,()=>0xd8b048);pb.ell(cx,cy-99,4,4,(nx)=>nx>.2?null:0xe8c050);
  for(const [mx,my] of [[N[0]-h*32+6,N[1]+h*16],[N[0]+w*32-6,N[1]+w*16]]){pb.rect(mx-5,my-130,11,130,(i)=>tone(st,i<3?.12:i>8?-.25:0));pb.ell(mx,my-132,8,8,(nx,ny)=>ny>0?null:0x2a8a9a);pb.rect(mx-7,my-104,15,3,tone(st,-.3));pb.thick(mx,my-140,mx,my-148,1,()=>0xd8b048)}
  pb.outline(0x1a1208);return{cv:pb.canvas(),ox:120,oy:N[1],tall:1}}
function propSnowman(){const pb=new PB(30,46),cx=15,base=42;pb.ell(cx,base-8,10,8,(nx,ny)=>tone(0xeef4fa,.08-(nx*.2+ny*.3)));pb.ell(cx,base-21,7,6,(nx,ny)=>tone(0xeef4fa,.12-(nx*.2+ny*.3)));pb.ell(cx,base-31,5,5,(nx,ny)=>tone(0xf4f8fc,.15-(nx*.2+ny*.3)));
  pb.set(cx-2,base-32,0x1a1a1e);pb.set(cx+2,base-32,0x1a1a1e);pb.rect(cx,base-30,4,1,0xe8742a);pb.rect(cx-6,base-37,12,2,0x2a2a34);pb.rect(cx-4,base-42,8,5,0x2a2a34);pb.rect(cx-7,base-26,14,2,0xc83a2a);
  pb.thick(cx-7,base-21,cx-14,base-27,1,()=>0x5a3a1a);pb.thick(cx+7,base-21,cx+13,base-28,1,()=>0x5a3a1a);pb.outline(0x2a3440);return{cv:pb.canvas(),ox:cx,oy:base,r:6}}
function propIceObelisk(){const pb=new PB(40,110),cx=20,base=104;pb.rect(cx-14,base-8,29,8,(i,j)=>tone(0x7a8a98,j<2?.1:-.15));
  pb.tri([cx-9,base-8],[cx+9,base-8],[cx,base-96],(u,v)=>u>v*.5+.25?mix(0x5ab0e0,0x9ae8ff,v):mix(0xbfe8ff,0xffffff,1-v));for(let i=0;i<5;i++)pb.set(cx-2+(i%3),base-30-i*12,0xffffff);
  pb.outline(0x1a3a5a);return{cv:pb.canvas(),ox:cx,oy:base,r:7,light:[0,-50]}}
function propGiantFlower(seed,col){const R=mulberry(seed),pb=new PB(40,40),cx=20,base=34;for(let k=0;k<5;k++){const a=k/5*Math.PI*2+R();pb.ell(cx+Math.cos(a)*8,base-8+Math.sin(a)*4,7,4.5,(nx,ny)=>tone(col,.15-(nx*.2+ny*.4)+(((nx*5)|0)&1?.06:-.04)))}
  pb.ell(cx,base-8,5,3,(nx,ny,px,py)=>hash(px,py,9)<.4?0xf0e0a0:0x3a1a10);pb.outline(0x1a0a08);return{cv:pb.canvas(),ox:cx,oy:base,r:7}}
function propFountain(){const a=propWell();return recolor(recolor(a,.5,.75,.48,1.1,1.15,.05),.05,.15,.09,.6,1.1,.08)}
function propPyramid(){const w=6,ox=212,oy=190,pb=new PB(424,400);const N=[ox,oy],E=[ox+w*32,oy+w*16],S=[ox,oy+w*32],W=[ox-w*32,oy+w*16],ap=[ox,oy+w*16-190];
  const st=0xd8b47a;pb.tri(W,S,ap,(u,v,px,py)=>{const c=(py%9)<1?tone(st,-.22):((px>>3)+(py/9|0))%2?st:tone(st,-.05);return tone(c,.08)});pb.tri(S,E,ap,(u,v,px,py)=>{const c=(py%9)<1?tone(st,-.4):tone(st,-.22);return((px>>3)+(py/9|0))%2?c:tone(c,-.04)});
  pb.tri([ap[0]-22,ap[1]+34],[ap[0]+22,ap[1]+34],ap,(u,v,px)=>px<ap[0]?0xf0d070:0xb8902a);
  const dx=ox-96,dy=oy+w*16+48;pb.rect(dx-12,dy-34,24,34,(i,j)=>j<4?tone(st,-.3):(i<2||i>21)?tone(st,-.35):0x140c08);pb.rect(dx-15,dy-38,30,4,tone(st,-.15));
  for(const sd of [-1,1])pb.rect(dx+sd*22-3,dy-30,6,30,(i)=>i<2?tone(st,.15):tone(st,-.2));
  pb.outline(0x2a1a0a);return{cv:pb.canvas(),ox,oy,tall:1}}
function propStepPyramid(){const w=6,ox=212,oy=210,pb=new PB(424,420),st=0x8a8a72,moss=0x4a6a32;let base=[ox,oy];
  for(let k=0;k<5;k++){const s2=w-k*1.1,h=26,cx=ox,cyb=oy+w*16+ (w*16-s2*16)*0 ,Nn=[cx,oy+w*16-s2*16-k*h];
    isoBox(pb,Nn,s2,s2,h,(u,v,px,py)=>hash(px>>2,py>>2,k)<.35?moss:tone(st,.12),(u,v,px,py)=>{const c=(py%8)<1?tone(st,-.3):tone(st,.02);return hash(px>>2,py>>1,k+9)<.22?moss:c},(u,v,px,py)=>{const c=(py%8)<1?tone(st,-.45):tone(st,-.22);return hash(px>>2,py>>1,k+19)<.22?tone(moss,-.2):c})}
  const tN=[ox,oy+w*16-1.4*16-5*26];isoBox(pb,[tN[0],tN[1]],1.4,1.4,34,(u,v)=>tone(st,.15),(u,v)=>Math.abs(u-.5)<.2&&v<.7?0x100c08:tone(st,0),(u,v)=>tone(st,-.25));
  const L0=[ox-w*16,oy+w*16+w*16-8];for(let i=0;i<14;i++){const t=i/14;const x=L0[0]+(ox-1.4*8-L0[0])*t,y=L0[1]+((tN[1]+34)-L0[1])*t;pb.rect(Math.round(x-14),Math.round(y),28,4,(a,b)=>b<1?tone(st,.25):tone(st,-.05))}
  const dx=ox-96,dy=oy+w*32-48+16;pb.rect(dx-11,dy-30,22,30,(i,j)=>j<3?tone(st,-.3):0x0e0a06);
  pb.outline(0x101408);return{cv:pb.canvas(),ox,oy,tall:1}}
function propFoxShrine(){const pb=new PB(34,44),cx=17,base=40;pb.rect(cx-10,base-5,21,5,0x6a6a64);pb.rect(cx-7,base-24,15,19,(i,j)=>i<2?0xd8402a:i>12?0x8a2a1e:0xc83a26);pb.tri([cx-12,base-24],[cx+12,base-24],[cx,base-34],(u,v)=>v<.4?0x3a3e48:0x2a2e38);
  pb.ell(cx,base-14,4,5,(nx,ny)=>tone(0xf4f0e0,.1-ny*.3));for(const sd of [-1,1])pb.tri([cx+sd*2,base-18],[cx+sd*4,base-18],[cx+sd*3.5,base-22],()=>0xf4f0e0);pb.set(cx-1,base-14,0xd8402a);pb.set(cx+1,base-14,0xd8402a);
  pb.outline(0x1a0a08);return{cv:pb.canvas(),ox:cx,oy:base,r:6}}
function buildArt2(A){
  // snow
  A.pineSnow=A.pine.map(t=>snowify(t,3));A.deadSnow=A.dead.map(t=>snowify(t,2));A.rockSnow=A.rock.map(t=>snowify(t,3));A.bushSnow=A.bush.map(t=>snowify(t,2));
  A.snowman=propSnowman();A.iceObelisk=propIceObelisk();A.iceCrystal=[propCrystal(41,0x9ae8ff),propCrystal(42,0xbfe8ff)];
  // japan
  A.sakura=A.oak.slice(0,4).map(t=>recolor(t,.15,.5,.93,.75,1.25,.12));A.bamboo=[1,2,3].map(s=>propBamboo(900+s));A.torii=propTorii();A.toro=propToro();A.pagoda=propPagoda();
  // desert
  A.palm=[1,2,3].map(s=>propPalm(950+s));A.dryBush=A.bush.map(t=>recolor(t,.12,.5,.11,.55,1.15,.08));A.rockSand=A.rock.map(t=>tintArt(t,0xd8b07a,.7));A.palace=propPalace();A.fountain=propFountain();
  A.stallDesert=[propStall(77,0x2a6ab0,0xf0e6d0),propStall(78,0xd8a030,0xf0e6d0),propStall(79,0x9a2a5a,0xf0d8a0)];A.pots=[tintArt(A.barrel[0],0xc8703a,.8),tintArt(A.barrel[1],0xb85a2a,.8)];
  // jungle
  A.jungle=A.oak.map(t=>recolor(t,.12,.5,.32,1.35,.8,-.04));A.jungleTall=A.pine.map(t=>recolor(t,.12,.6,.36,1.2,.85,-.02));A.fern=A.bush.map(t=>recolor(t,.12,.5,.3,1.5,.95,0));
  A.giantFlower=[propGiantFlower(1,0xd83a3a),propGiantFlower(2,0xe8742a),propGiantFlower(3,0xc83a9a)];A.ruin=tintArt(A.pillar,0x5a7a4a,.55);A.stoneMoss=A.stone.map(t=>tintArt(t,0x5a7a4a,.5));
  // cave mouths and walls per climate
  A.caveIce=snowify(tintArt(A.cave,0x8ab8d8,.55),4);A.caveVolc=tintArt(A.cave,0x6a4a4a,.6);A.caveSand=tintArt(A.cave,0xd8b07a,.6);A.caveMoss=tintArt(A.cave,0x5a7a4a,.6);
  const walls=(pal,base,deco)=>{const w={};for(const t of ['t','s'])for(let i=0;i<3;i++){w[t+i]=propRockWall(base+i,t==='t',null,pal);if(t==='t'){w['ttorch'+i]=propRockWall(base+10+i,1,deco,pal);w['tbeam'+i]=propRockWall(base+20+i,1,'beam',pal)}}return w};
  A.wIce=walls([0xd8eef8,0xa8cce0,0x7aa4c0,0x4a7a98,0x2a4a68],1200,'crystal');A.wVolc=walls([0x6a5a5e,0x52444a,0x3c3036,0x2a2026,0x160e12],1240,'torch');
  A.wSand=walls([0xd8b888,0xb8966a,0x96764e,0x6e5436,0x463420],1280,'torch');A.wMoss=walls([0x6a7a5a,0x4e5e44,0x3a4834,0x283426,0x182018],1320,'crystal');
  // biome fences
  A.fenceDark={x:tintArt(A.fence.x,0x4a3a3a,.5),y:tintArt(A.fence.y,0x4a3a3a,.5)};A.fenceSand={x:tintArt(A.wall[0],0xd8b888,.75),y:tintArt(A.wall[1],0xd8b888,.75)};
  A.palSnow={x:snowify(A.pal.x,2),y:snowify(A.pal.y,2)};
  A.lampSnow=snowify(A.lampD,2);A.lampSnowN=snowify(A.lampN,2,.85);A.lampBrass=tintArt(A.lampD,0xd8a848,.6);A.lampBrassN=tintArt(A.lampN,0xd8a848,.45);
  A.bannerBlue=tintArt(A.banner[0],0x3a5ab0,.7);A.bannerGold=tintArt(A.banner[0],0xd8a848,.7);A.runestone=A.stone.map(t=>snowify(t,2));
  A.dec2={step:[1,2,3].map(s=>{const pb=new PB(26,14);pb.ell(13,7,11-s,5.5-s*.4,(nx,ny,px,py)=>tone(0x8a8a86,.15-(nx*.2+ny*.4)+(hash(px,py,s)<.15?-.1:0)));pb.outline(0x3a3a38);return{cv:pb.canvas(),ox:13,oy:7}}),
    rug:[[0x8a2a2a,0xd8b048],[0x2a4a8a,0xe8d8b0],[0x2a6a5a,0xd87a3a]].map(([c1,c2])=>{const pb=new PB(48,26);pb.para([24,1],[22,11],[-22,11],(u,v)=>{const b=u<.08||u>.92||v<.08||v>.92;const md=Math.abs(u-.5)+Math.abs(v-.5)<.22;return b?c2:md?tone(c2,-.1):((Math.floor(u*8)+Math.floor(v*8))&1?c1:tone(c1,-.18))});return{cv:pb.canvas(),ox:24,oy:12}}),
    petals:(()=>{const pb=new PB(20,10);for(let i=0;i<9;i++)pb.set((i*7)%19,(i*5)%9,[0xf6c0d0,0xf0a0bc,0xffe0ea][i%3]);return{cv:pb.canvas(),ox:10,oy:5}})(),
    leaves:(()=>{const pb=new PB(20,10);for(let i=0;i<10;i++)pb.rect((i*7)%18,(i*3)%9,2,1,[0x8a6a2a,0x5a7a2a,0xa8582a][i%3]);return{cv:pb.canvas(),ox:10,oy:5}})(),
    prints:(()=>{const pb=new PB(24,12);for(let i=0;i<4;i++)pb.rect(2+i*5,2+((i&1)?4:0),2,2,0xb4c0d0);return{cv:pb.canvas(),ox:12,oy:6}})()};
  A.pyramid=propPyramid();A.stepPyramid=propStepPyramid();A.foxShrine=propFoxShrine();
  return A}
