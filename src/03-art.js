// ===================== procedural art: props, buildings, nature, icons =====================
function inPoly(px,py,pts){let ins=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const xi=pts[i][0],yi=pts[i][1],xj=pts[j][0],yj=pts[j][1];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))ins=!ins}return ins}
function hull(pts){pts=pts.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}up.pop();lo.pop();return lo.concat(up)}
// iso box: N = screen pos of north corner of the footprint (image coords)
function isoBox(pb,N,w,h,ht,fT,fL,fR){const E=[N[0]+w*32,N[1]+w*16],S=[N[0]+(w-h)*32,N[1]+(w+h)*16],W=[N[0]-h*32,N[1]+h*16];
  if(fR)pb.para(S,[E[0]-S[0],E[1]-S[1]],[0,-ht],fR);if(fL)pb.para(W,[S[0]-W[0],S[1]-W[1]],[0,-ht],fL);if(fT)pb.para([N[0],N[1]-ht],[E[0]-N[0],E[1]-N[1]],[W[0]-N[0],W[1]-N[1]],fT);return{N,E,S,W}}
function bricks(hu,hv,rowH,bw,seed,cA,cB,mortar){const row=Math.floor(hv/rowH),off=(row&1)*bw/2,bx=(hu+off)/bw,fx=bx-Math.floor(bx);if(hv-row*rowH<1||fx*bw<1)return mortar;let c=mix(cA,cB,hash(row,Math.floor(bx),seed));if(hv-row*rowH>=rowH-1)c=tone(c,.18);return c}

// ---------- buildings ----------
// culture-specific wall materials
function styleWall(o,face,u,hu,hv,facePx,px,py,baseH,wh,seed){let c;const S=o.style;
  if(S==='log'){if(hv<baseH)return bricks(hu,hv,5,9,seed,0x8a8a92,0x6e6e78,0x3a3a44);const band=7,bi=Math.floor((hv-baseH)/band),bf=((hv-baseH)%band)/band;
    c=mix(o.wall,tone(o.wall,-.18),hash(bi,Math.floor(hu/11),seed));c=tone(c,.2-bf*.46+(bf<.14?.08:0));if(bf>.86)c=0x1a100a;if(hash(Math.floor(hu/3),bi,seed+4)<.07)c=tone(c,-.16);
    if(hu<4.5||hu>facePx-4.5){const d=Math.abs(bf-.45);c=d<.32?mix(0xd0a874,0x8a6a44,d*3):0x2a1a10}return c}
  if(S==='jp'){if(hv<baseH)return bricks(hu,hv,4,10,seed,0x8a8a88,0x6e6e6c,0x3a3a3a);const lv=(hv-baseH)/(wh-baseH),post=hu<3||hu>facePx-3||(hu%26)<2.4,beam=Math.abs(lv-.34)<.03||lv>.94||lv<.04;
    if(post||beam)return beam&&lv>.94?tone(o.timber,-.2):o.timber;if(lv<.34){c=mix(0x5e3e2c,0x4a3020,((Math.floor(hu/2))&1)*.4);if((hu%5)<1)c=0x2a1a12;return c}
    return mix(o.wall,0xfaf2e2,hash(px>>1,py>>1,seed)*.35+vn(hu*.1,hv*.1,seed)*.2)}
  if(S==='adobe'){c=mix(o.wall,tone(o.wall,-.1),vn(hu*.08,hv*.08,seed)*.8+hash(px,py,seed)*.12);if(hv<7)c=mix(c,0x8a6a4a,.5*(1-hv/7));if(vn(hu*.05,hv*.14,seed+3)>.74)c=tone(c,-.07);
    const vy=wh-11;if(hv>vy&&hv<vy+3.2){const m=hu%16;if(m<4)c=0x5a3a22;else if(m<5)c=0x2e1c10}if(hv>wh-2.5)c=tone(o.wall,.14);
    for(const op of (o.open&&o.open[face])||[])if(op.t==='door'){const top=op.v1*wh;if(u>op.u0-.05&&u<op.u1+.05&&hv>top+1&&hv<top+9){c=(Math.floor(hu/4)&1)?(o.awning||0x2a6ab0):0xf0e6d0;if(hv>top+7.5)c=tone(c,-.32)}}return c}
  if(S==='hut'){if(hv<baseH)return mix(0x5a4028,0x4a3420,hash(px>>1,py,seed));const w1=((Math.floor((hu+hv)/4))+(Math.floor((hu-hv+400)/4)))&1;c=mix(o.wall,tone(o.wall,-.24),w1*.65+hash(px,py,seed)*.2);if(hu<3||hu>facePx-3||Math.abs(hu-facePx/2)<1.5)c=o.timber;return c}
  return null}
function makeBuilding(o,night){
  const W=o.w,H=o.h,wh=o.wallH,rh=o.roofH||0,sp=o.spire||0,M=10;
  const cw=(W+H)*32+M*2,chh=(W+H)*16+wh+rh+M*2+sp;
  const ox=H*32+M,oy=wh+rh+M+sp;const pb=new PB(cw,chh);
  const N=[ox,oy],E=[ox+W*32,oy+W*16],S=[ox+(W-H)*32,oy+(W+H)*16],Wp=[ox-H*32,oy+H*16];
  const up=(p,h)=>[p[0],p[1]-h];const nU=up(N,wh),eU=up(E,wh),sU=up(S,wh),wU=up(Wp,wh);
  const stone=o.style==='stone',baseH=stone?wh:o.baseH||9,seed=o.seed;
  const lights=[];let smoke=null;
  const opening=(list,u,v,facePx)=>{for(const op of list||[]){if(u<op.u0||u>op.u1||v<op.v0||v>op.v1)continue;const wp=(op.u1-op.u0)*facePx,hp=(op.v1-op.v0)*wh,lx=(u-op.u0)*facePx,ly=(v-op.v0)*wh;const arch=stone||op.t==='door'||o.style==='adobe'?Math.max(0,1-Math.abs((lx-wp/2)/(wp/2)))*Math.min(6,wp*.5):0;
      if(ly>hp-((stone||o.style==='adobe')?Math.min(6,wp*.5)-arch:0)&&(stone||o.style==='adobe'))continue;
      if(op.t==='door'&&o.style==='jp'&&ly>hp*.58&&lx>1.5&&lx<wp-1.5){const cx2=Math.abs(lx-wp/2),cy2=Math.abs(ly-hp*.8);return(cx2*cx2+cy2*cy2<5)?0xf0ece0:(Math.abs(lx-wp/2)<.6?0x1a2440:0x2a3a6a)}
      if(op.t==='win'&&o.style==='jp'){if(lx<1.2||lx>wp-1.2||ly<1.2||ly>hp-1.2)return o.timber;if((Math.floor(lx)%4)===0||(Math.floor(ly)%4)===0)return 0x3a2a20;return night?0xffd890:0xf0e6cc}
      if(op.t==='win'&&o.style==='adobe'){if(lx<1.2||lx>wp-1.2||ly<1.2)return tone(o.wall,-.3);if(((Math.floor(lx)+Math.floor(ly))&1)===0)return night?0xffc870:0x1a3a3a;return night?0xc8762a:0x2a8a8a}
      if(op.t==='door'){if(lx<1.5||lx>wp-1.5||ly>hp-1.5)return stone?0xd0c8b8:0x3a2a20;if(Math.abs(ly-hp*.3)<1||Math.abs(ly-hp*.72)<1)return 0x34343c;if(Math.abs(lx-wp*.78)<1&&Math.abs(ly-hp*.48)<1.2)return 0xe8c050;const pl=Math.floor(lx/4),dc=o.door||0x7a4e2c;return(lx%4<1)?tone(dc,-.45):mix(dc,tone(dc,-.12),hash(pl,1,seed))}
      if(lx<1.5||lx>wp-1.5||ly<1.5||ly>hp-1.5)return ly<1.5?(stone?0xd8d0c0:0xa89a86):(stone?0xc8c0b0:0x3a2a20);
      if(Math.abs(lx-wp/2)<.8||Math.abs(ly-hp*.55)<.7)return stone?0x8a8478:0x3a2a20;
      if(night)return mix(0xffd88a,0xe8742a,1-ly/hp);return(lx+(hp-ly)*.7<wp*.55)?0x6a7e94:0x222e42}return null};
  const wallFn=(face,lit)=>(u,v,px,py)=>{const facePx=(face==='L'?W:H)*32,hu=u*facePx,hv=v*wh;
    const op=opening(o.open&&o.open[face],u,v,facePx);if(op!=null)return tone(op,lit?0:-.28);
    let c=styleWall(o,face,u,hu,hv,facePx,px,py,baseH,wh,seed);if(c!=null){if(hv<2.5)c=tone(c,-.25);return tone(c,lit?.06:-.46)}
    if(hv<baseH||stone){c=bricks(hu,hv,stone?6:5,stone?13:9,seed+(face==='L'?0:5),o.stoneA||0xa8a296,o.stoneB||0x8a8478,0x4a4652);
      if(stone&&(hu<3||hu>facePx-3))c=tone(o.stoneA||0xa8a296,.15)}
    else if(o.style==='log'){const row=Math.floor((hv-baseH)/7),f=((hv-baseH)%7)/7;c=mix(o.wall,tone(o.wall,-.16),hash(row,Math.floor(hu/38),seed)*.8);c=tone(c,.16-Math.abs(f-.45)*.5);if(f<.12)c=tone(o.wall,-.48);if(hash(px>>1,py,seed)<.08)c=tone(c,-.12);if(hu<5||hu>facePx-5){c=((row+(face==='L'?0:1))&1)?tone(o.wall,.12):tone(o.wall,-.05);if(Math.hypot(((hu<5?hu:facePx-hu)-2.5),(f-.5)*7)<1.2)c=tone(o.wall,-.35)}}
    else if(o.style==='shoji'){const lv2=hv-baseH,cols2=Math.max(2,Math.round(facePx/26)),cw3=facePx/cols2,k2=Math.floor(hu/cw3),lu2=hu-k2*cw3;if(lv2<10){c=mix(o.timber,tone(o.timber,.1),(Math.floor(hu/5)&1)*.5);if(lv2<1.5)c=tone(o.timber,-.3)}else{const post=lu2<2.2||hu<3||hu>facePx-3,rail=hv>wh-5||Math.abs(lv2-10)<1.4;if(post||rail)c=post&&hv>wh-5?tone(o.timber,-.2):o.timber;else{const gx2=(lu2%8)<1,gy2=((lv2)%9)<1;c=gx2||gy2?tone(o.timber,.15):mix(o.wall,tone(o.wall,-.06),hash(px>>2,py>>2,seed)*.6)}}}
    else if(o.style==='adobe'){c=mix(o.wall,tone(o.wall,-.08),vn(px*.12,py*.12,seed)*.9);if(hash(px,py,seed)<.04)c=tone(c,-.08);const st2=hv/wh;if(st2<.14)c=mix(c,tone(o.wall,-.28),(.14-st2)/.14);if(hu<2.5||hu>facePx-2.5)c=tone(o.wall,.1);if(hv>wh-11&&hv<wh-7&&(hu%16)>4&&(hu%16)<8)c=0x5a3a22;if(hv>wh-3)c=tone(o.wall,.14)}
    else if(o.style==='bamboo'){const k3=Math.floor(hu/4.2),f3=(hu%4.2)/4.2;c=mix(o.wall,tone(o.wall,-.14),hash(k3,1,seed)*.7);c=tone(c,.14-Math.abs(f3-.4)*.6);if(((hv+k3*5)%22)<1.4)c=tone(o.wall,-.32);if(hv<baseH+3||Math.abs(hv-wh*.55)<1.6||hv>wh-3)c=o.timber}
    else{c=mix(o.wall,tone(o.wall,-.12),hash(px>>1,py>>1,seed)*.5);
      const cols=Math.max(2,Math.round(facePx/44)),cw2=facePx/cols,k=Math.floor(hu/cw2),lu=hu-k*cw2,lv=(hv-baseH)/(wh-baseH);
      const fl=o.floors||1,st=(wh-baseH)/fl,lvF=((hv-baseH)%st)/st;const beam=hu<3||hu>facePx-3||lu<2.5||hv<baseH+3||hv>wh-3||(fl>1&&Math.abs(hv-baseH-st)<2.5)||((k+(face==='L'?0:1))%2===0&&Math.abs(lu/cw2-lvF)*cw2<2);
      if(beam)c=(hv>wh-3.6||hv<baseH+.8)?tone(o.timber,-.3):o.timber}
    if(hv<2.5)c=tone(c,-.25);return tone(c,lit?.06:-.46)};
  const gableFn=(lit)=>(u,v,px,py)=>{let c=mix(o.gable||o.wall,tone(o.gable||o.wall,-.1),hash(px,py>>2,seed));if(stone)c=bricks(px,py,6,13,seed+9,o.stoneA||0xa8a296,o.stoneB||0x8a8478,0x4a4652);else if(px%6===0)c=tone(o.timber,-.1);return tone(c,lit?.06:-.46)};
  const roofFn=(lenU,lenV,tl,ridgeV=1)=>(u,v,px,py)=>{if(v<0)return 0x2e2018;
    if(o.roofStyle==='kawara'){const rows=Math.max(3,Math.round(lenV/4)),rv=v*rows,r=Math.floor(rv),fr=rv-r,su=u*lenU/6,si=Math.floor(su),fu=su-si;let c=mix(o.roof,o.roof2||tone(o.roof,-.2),hash(r,si,seed+3)*.45);const arc=Math.abs(fu-.5)*2;c=tone(c,.24-arc*.36-(fr<.18?.34:0)+(fr>.72?.08:0));if(v>ridgeV-.07)c=tone(o.roof,.2);if(v<.05)c=tone(o.roof,-.25);return tone(c,tl)}
    if(o.roofStyle==='thatch'){const sh=hash(Math.floor(u*lenU/1.6),Math.floor(v*lenV/6),seed);let c=mix(o.roof,o.roof2||tone(o.roof,-.25),sh*.8);if((v*lenV)%9<1.4)c=tone(c,-.32);if(hash(px,py,seed+7)<.12)c=tone(c,.16);if(v<.05&&hash(px,1,seed)<.5)return null;if(v>ridgeV-.07)c=tone(o.roof,-.22);return tone(c,tl)}const rows=Math.max(3,Math.round(lenV/5)),rv=v*rows,r=Math.floor(rv),fr=rv-r,su=u*lenU/7+(r&1)*.5,si=Math.floor(su),fu=su-si;
    let c=mix(o.roof,o.roof2||tone(o.roof,-.25),hash(r,si,seed+3)*.85);if(fr<.24)c=tone(c,-.42);else if(fu<.09)c=tone(c,-.25);else if(fr>.8)c=tone(c,.12);
    if(vn(u*5,v*4,seed)>.7&&hash(px,py,seed)>.4)c=mix(c,0x5e7a3e,.4);if(v>ridgeV-.05)c=tone(o.roof,.05);return tone(c,tl)};
  // back roof plane, walls, gable, front roof plane
  if(rh>0){
    if(o.ridge==='y'){const RN=up([(nU[0]+eU[0])/2,(nU[1]+eU[1])/2],rh),RS=up([(wU[0]+sU[0])/2,(wU[1]+sU[1])/2],rh);
      const V1=[RN[0]-nU[0],RN[1]-nU[1]];pb.para(nU,[wU[0]-nU[0],wU[1]-nU[1]],V1,roofFn(H*32,Math.hypot(V1[0],V1[1]),-.1),-.06,1.06,-.1,1);
      pb.para(Wp,[S[0]-Wp[0],S[1]-Wp[1]],[0,-wh],wallFn('L',true));pb.para(S,[E[0]-S[0],E[1]-S[1]],[0,-wh],wallFn('R',false));
      pb.tri(wU,sU,RS,gableFn(true));
      const V2=[RN[0]-eU[0],RN[1]-eU[1]];pb.para(eU,[sU[0]-eU[0],sU[1]-eU[1]],V2,roofFn(H*32,Math.hypot(V2[0],V2[1]),-.42),-.06,1.06,-.1,1);
      if(o.chimney){const b=[nU[0]+(wU[0]-nU[0])*.3+V1[0]*.6,nU[1]+(wU[1]-nU[1])*.3+V1[1]*.6];smoke=chim(b)}
    }else{const RW=up([(nU[0]+wU[0])/2,(nU[1]+wU[1])/2],rh),RE=up([(eU[0]+sU[0])/2,(eU[1]+sU[1])/2],rh);
      const V1=[RW[0]-nU[0],RW[1]-nU[1]];pb.para(nU,[eU[0]-nU[0],eU[1]-nU[1]],V1,roofFn(W*32,Math.hypot(V1[0],V1[1]),-.12),-.05,1.05,-.1,1);
      if(o.chimney){const b=[nU[0]+(eU[0]-nU[0])*.72+V1[0]*.55,nU[1]+(eU[1]-nU[1])*.72+V1[1]*.55];smoke=chim(b)}
      pb.para(S,[E[0]-S[0],E[1]-S[1]],[0,-wh],wallFn('R',false));pb.para(Wp,[S[0]-Wp[0],S[1]-Wp[1]],[0,-wh],wallFn('L',true));
      pb.tri(sU,eU,RE,gableFn(false));
      const V2=[RW[0]-wU[0],RW[1]-wU[1]];pb.para(wU,[sU[0]-wU[0],sU[1]-wU[1]],V2,roofFn(W*32,Math.hypot(V2[0],V2[1]),.16),-.05,1.05,-.1,1)}
  }else{pb.para(S,[E[0]-S[0],E[1]-S[1]],[0,-wh],wallFn('R',false));pb.para(Wp,[S[0]-Wp[0],S[1]-Wp[1]],[0,-wh],wallFn('L',true));pb.para(nU,[eU[0]-nU[0],eU[1]-nU[1]],[wU[0]-nU[0],wU[1]-nU[1]],(u,v,px,py)=>tone(mix(o.stoneA||0xa8a296,0x8a8478,hash(px>>2,py>>2,seed)),.2))}
  function chim(b){const top=[b[0],b[1]-20];isoBox(pb,[b[0],b[1]-4],.25,.25,20,(u,v,px,py)=>0x2a2420,(u,v,px,py)=>bricks(u*8,v*20,4,6,seed,0x9a5a48,0x7a4a3a,0x3a2a2a),(u,v,px,py)=>tone(bricks(u*8,v*20,4,6,seed+1,0x9a5a48,0x7a4a3a,0x3a2a2a),-.4));return[top[0]+4-ox,top[1]-2-oy]}
  if(sp){const cx=(nU[0]+sU[0])/2,cy=(nU[1]+sU[1])/2-rh+6;isoBox(pb,[cx,cy-12],.5,.5,22,null,(u,v)=>bricks(u*16,v*22,6,10,seed,0xb8b0a2,0x9a9286,0x4a4652),(u,v)=>tone(bricks(u*16,v*22,6,10,seed+2,0xb8b0a2,0x9a9286,0x4a4652),-.45));
    const bN=[cx,cy-34],bE=[cx+16,cy-26],bS=[cx,cy-18],bW=[cx-16,cy-26],A=[cx,cy-34-sp+10];pb.tri(bW,bS,A,()=>tone(o.roof,.1));pb.tri(bS,bE,A,()=>tone(o.roof,-.4));pb.line(A[0],A[1],A[0],A[1]-8,0xe8c050);pb.line(A[0]-3,A[1]-5,A[0]+3,A[1]-5,0xe8c050)}
  if(rh===0&&o.parapet){const rim=tone(o.stoneA||o.wall,.22);for(const [a,b2] of [[nU,eU],[eU,sU],[sU,wU],[wU,nU]])pb.thick(a[0],a[1]-1,b2[0],b2[1]-1,2,()=>rim)}
  if(o.dome){const ctr=[(nU[0]+sU[0])/2,(nU[1]+sU[1])/2-(rh||0)],r=Math.min(W,H)*11;pb.rect(ctr[0]-r*.8,ctr[1]-r*.35,r*1.6,r*.35,(i)=>tone(o.stoneA||o.wall,i<r*.8?.05:-.2));pb.ell(ctr[0],ctr[1]-r*.35,r*.85,r*.9,(nx,ny,px,py)=>ny>0?null:tone(o.dome,.25-(nx*.45+ny*.25)+(((px+py)>>2)&1?.03:0)));pb.thick(ctr[0],ctr[1]-r*1.2,ctr[0],ctr[1]-r*1.2-8,1.5,()=>0xd8b048)}
  // window light points (relative to anchor)
  for(const face of ['L','R'])for(const op of (o.open&&o.open[face])||[]){if(op.t==='door')continue;const uc=(op.u0+op.u1)/2,vc=(op.v0+op.v1)/2;const P0=face==='L'?Wp:S,P1=face==='L'?S:E;lights.push([P0[0]+(P1[0]-P0[0])*uc-ox,P0[1]+(P1[1]-P0[1])*uc-wh*vc-oy+6])}
  pb.outline(0x1c1822);
  return{cv:pb.canvas(),ox,oy,lights,smoke}
}
function bldShadow(w,h,ht){const N=[0,0],E=[w*32,w*16],S=[(w-h)*32,(w+h)*16],W=[-h*32,h*16],d=[ht*.75,ht*.38];return hull([N,E,S,W,...[N,E,S,W].map(p=>[p[0]+d[0],p[1]+d[1]])])}

// ---------- nature ----------
const PAL_OAK=[0x8aa468,0x5e7e4c,0x3e5e40,0x2a4436,0x1a2c2c],PAL_AUT=[0xd8a05a,0xb87038,0x8a4a2a,0x5e3024,0x3a1e24],PAL_PINE=[0x6a8a68,0x46684e,0x2e4c40,0x1e3632,0x122224];
function makeTree(seed,kind){const R=mulberry(seed);
  if(kind==='pine'){const W=64,H=116,cx=32,base=112,pb=new PB(W,H);
    pb.rect(cx-3,92,6,20,(i,j,px)=>i<2?0x7a5a3e:i<4?0x5a3e2a:0x3a2a24);
    for(let k=5;k>=0;k--){const top=6+k*14,bot=top+24+k*1.5,hw=7+k*4.4+R()*2;for(let py=top;py<=bot;py++){const t=(py-top)/(bot-top),half=hw*Math.pow(t,.9);for(let px=Math.floor(cx-half);px<=Math.ceil(cx+half);px++){if(py>bot-4&&hash(px>>1,k,seed)<.45)continue;const nx=(px+.5-cx)/(half+1);const l=-nx*.7+(1-t)*.45-.15+(hash(px>>1,py>>1,seed)-.5)*.45;pb.set(px,py,PAL_PINE[l>.55?0:l>.15?1:l>-.25?2:l>-.6?3:4])}}}
    pb.outline(0x12261e);return{cv:pb.canvas(),ox:cx,oy:base,r:16}}
  if(kind==='dead'){const W=60,H=90,cx=30,base=86,pb=new PB(W,H);const br=(x,y,a,len,w,d)=>{const ex=x+Math.cos(a)*len,ey=y+Math.sin(a)*len;pb.thick(x,y,ex,ey,w,(u,v)=>v<.4?0x7a6a5e:v<.75?0x5a4a42:0x3a2e2e);if(d>0){br(ex,ey,a-.35-R()*.4,len*.7,Math.max(1.2,w*.68),d-1);br(ex,ey,a+.35+R()*.4,len*.7,Math.max(1.2,w*.68),d-1)}};br(cx,base,-Math.PI/2+(R()-.5)*.2,24,5,4);pb.outline(0x1a1418);return{cv:pb.canvas(),ox:cx,oy:base,r:6}}
  const bush=kind==='bush',W=bush?44:84,H=bush?36:112,cx=W/2,base=H-4,pb=new PB(W,H),pal=kind==='autumn'?PAL_AUT:PAL_OAK;
  if(!bush){const tt=60;for(let y=tt;y<=base;y++){const t=(y-tt)/(base-tt),half=2.6+t*2.2+(y>base-5?(y-base+5)*.9:0);for(let x=Math.floor(cx-half);x<=Math.ceil(cx+half);x++){const f=(x+.5-(cx-half))/(half*2);let c=f<.3?0x8a6648:f<.68?0x684a34:0x3e2e2c;if(hash(x,y>>2,seed)<.22)c=tone(c,-.25);pb.set(x,y,c)}}
    pb.thick(cx,74,cx-12,54,3,()=>0x5a4030);pb.thick(cx,70,cx+13,52,3,()=>0x4a3428)}
  const blobs=[];const n=bush?5:10+(R()*4|0);for(let i=0;i<n;i++){const a=R()*Math.PI*2,d=R()*(bush?8:17);blobs.push([cx+Math.cos(a)*d*1.2,(bush?18:44)+Math.sin(a)*d*.8-R()*5,(bush?7:10)+R()*(bush?4:7)])}
  if(!bush)blobs.push([cx,28,12],[cx-13,52,10],[cx+13,52,10],[cx,56,11]);
  blobs.sort((a,b)=>a[1]-b[1]);
  for(const [bx,by,r] of blobs)pb.ell(bx,by,r,r*.9,(nx,ny,px,py)=>{const l=-(nx*.55+ny*.8)*.95+(hash(px>>2,py>>2,seed)-.5)*.6+(hash(px>>1,py>>1,seed+3)-.5)*.25;let k=l>.6?0:l>.2?1:l>-.25?2:l>-.62?3:4;if(nx*nx+ny*ny>.8&&ny>-.2)k=Math.min(4,k+1);return pal[k]});
  pb.outline(kind==='autumn'?0x22100e:0x0c1614);return{cv:pb.canvas(),ox:cx,oy:base,r:bush?14:22}}
function makeRock(seed,sz){const R=mulberry(seed),W=Math.round(30*sz)+8,H=Math.round(24*sz)+8,cx=W/2,cy=H-5-7*sz,pb=new PB(W,H),pts=[];for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=(10+R()*4)*sz;pts.push([cx+Math.cos(a)*r*1.15,Math.min(H-4,cy+Math.sin(a)*r*.75-(Math.sin(a)<0?4*sz:0))])}
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){if(!inPoly(px+.5,py+.5,pts))continue;const nx=(px-cx)/(13*sz),ny=(py-cy+3*sz)/(10*sz);vor(px/(5*sz),py/(4*sz),seed);let l=-(nx*.5+ny*.75)+(VO.id-.5)*.55;if(VO.f2-VO.f1<.08)l-=.3;let c=[0xa8acb4,0x82869a,0x60647a,0x464a5e,0x2e3242][l>.55?0:l>.15?1:l>-.25?2:l>-.65?3:4];if(ny<-.35&&vn(px/4,py/4,seed)>.55)c=mix(c,0x6a8a4a,.6);pb.set(px,py,c)}
  pb.outline(0x22202c);return{cv:pb.canvas(),ox:cx,oy:H-5,r:10*sz}}

// ---------- props ----------
function propLamp(night){const pb=new PB(18,70),cx=9;pb.rect(cx-1,18,3,48,(i)=>i===0?0x5a5a6a:0x2a2a34);pb.rect(cx-3,64,7,4,0x34343e);pb.rect(cx-2,62,5,2,0x4a4a58);
  pb.rect(cx-4,8,9,11,(i,j)=>(i===0||i===8||j===0||j===10||i===4)?0x22222a:(night?mix(0xfff0b0,0xffb04a,j/10):(i<4?0xc8d4d8:0x8a9aa8)));pb.rect(cx-5,6,11,2,0x2a2a34);pb.rect(cx-2,4,5,2,0x2a2a34);pb.set(cx,3,0x2a2a34);pb.outline(0x14141a);return{cv:pb.canvas(),ox:cx,oy:67,light:[0,-54]}}
function propBarrel(seed){const pb=new PB(22,26),cx=11;for(let y=6;y<23;y++){const bul=Math.sin((y-6)/17*Math.PI)*1.5,half=7.5+bul;for(let x=Math.floor(cx-half);x<Math.ceil(cx+half);x++){const f=(x+.5-(cx-half))/(half*2);let c=f<.3?0x9a6a40:f<.7?0x7a5232:0x4a3226;if((x-cx+20)%4===0)c=tone(c,-.2);if(y===9||y===10||y===18||y===19)c=f<.3?0x8a8a96:f<.7?0x5a5a66:0x3a3a46;pb.set(x,y,c)}}
  pb.ell(cx,6,7.5,3,(nx,ny)=>nx*nx+ny*ny>.55?0x5a3a24:0x8a6440);pb.outline(0x1e1610);return{cv:pb.canvas(),ox:cx,oy:22,r:7}}
function propCrate(seed){const pb=new PB(40,40);isoBox(pb,[20,10],.55,.55,16,(u,v,px,py)=>(Math.abs(u-v)<.08||u<.08||v<.08||u>.92||v>.92)?0x6a4428:0xa8784a,(u,v,px,py)=>(u<.08||u>.92||v<.1||v>.9||Math.abs(u-v)<.1)?0x6a4428:mix(0x9a6a40,0x8a5a36,hash(px>>2,1,seed)),(u,v,px,py)=>tone((u<.08||u>.92||v<.1||v>.9||Math.abs(u-(1-v))<.1)?0x6a4428:0x8a5a36,-.4));pb.outline(0x1e1610);return{cv:pb.canvas(),ox:20,oy:28,r:9}}
function propWell(){const pb=new PB(60,66),cx=30;pb.ell(cx,48,20,11,(nx,ny,px,py)=>{const d=nx*nx+ny*ny;if(d<.45)return mix(0x1e3a54,0x2a5070,(ny+1)/2);return bricks(px,py,4,7,3,0xb0a898,0x8a8478,0x4a4652)});for(let y=48;y<58;y++)for(let x=cx-20;x<=cx+20;x++){const nx=(x-cx)/20;if(Math.abs(nx)<=1&&y<48+Math.sqrt(1-nx*nx)*11+8&&y>48+Math.sqrt(1-nx*nx)*11-1)pb.set(x,y,tone(bricks(x,y,4,7,4,0xb0a898,0x8a8478,0x4a4652),nx>0?-.4:0))}
  pb.rect(cx-17,18,3,32,0x6a4a2e);pb.rect(cx+14,18,3,32,0x4a3220);pb.tri([cx-24,22],[cx+24,22],[cx,6],(u,v)=>u>v?0x8a3a2e:0xa84a3a);pb.rect(cx-24,21,49,2,0x5a2a22);pb.line(cx,22,cx,40,0x8a7a5a);pb.rect(cx-2,40,4,4,0x6a4a2e);pb.outline(0x1c1620);return{cv:pb.canvas(),ox:cx,oy:56,r:18}}
function propStall(seed,c1,c2){const pb=new PB(96,92);const N=[46,26];isoBox(pb,[N[0],N[1]+18],1.3,.6,10,(u,v,px,py)=>{const h=hash(px>>2,py>>2,seed);return h<.25?0xd8402a:h<.45?0xe8c050:h<.6?0x6aa84a:0x9a6a40},(u,v)=>v>.7?0x7a5232:0x6a4428,(u,v)=>0x4a3020);
  for(const [x,y] of [[N[0]-18,N[1]+28],[N[0]+40,N[1]+40],[N[0]-18+40,N[1]+48],[N[0]-18,N[1]+28+0]])pb.rect(x,y-30,2,30,0x5a3a24);
  pb.para([N[0]-26,N[1]+2],[44,22],[18,-10],(u,v)=>(Math.floor(u*8)&1)?c1:c2,0,1,0,1);pb.para([N[0]-26,N[1]+2],[44,22],[0,6],(u,v)=>tone((Math.floor(u*8)&1)?c1:c2,-.25));
  pb.outline(0x1c1620);return{cv:pb.canvas(),ox:56,oy:63,r:14}}
function propFence(axis,iron,gate){const pb=new PB(40,40),cx=20,cy=30;const A=axis==='x'?[cx-16,cy-8]:[cx+16,cy-8],B=axis==='x'?[cx+16,cy+8]:[cx-16,cy+8];
  if(iron){const n=8;for(let i=0;i<=n;i++){const t=i/n,x=A[0]+(B[0]-A[0])*t,y=A[1]+(B[1]-A[1])*t,hgt=(i===0||i===n)?24:20;pb.rect(x,y-hgt,1+(i===0||i===n?1:0),hgt,i%2?0x2a2a34:0x3a3a48);pb.set(x,y-hgt-1,0x5a5a6a);pb.set(x,y-hgt-2,0x5a5a6a)}pb.line(A[0],A[1]-17,B[0],B[1]-17,0x2a2a34);pb.line(A[0],A[1]-5,B[0],B[1]-5,0x2a2a34);if(gate)pb.line(A[0],A[1]-20,B[0],B[1]-20,0x3a3a48)}
  else{for(const P of [A,B])pb.rect(P[0]-1,P[1]-16,3,16,(i)=>i===0?0x9a7048:0x6a4a2e);for(const h of [6,12])pb.thick(A[0],A[1]-h,B[0],B[1]-h,2.4,(u,v)=>v<.5?0x9a7048:0x6a4a2e)}
  pb.outline(0x16141a);return{cv:pb.canvas(),ox:cx,oy:cy}}
function propGrave(seed,kind){const R=mulberry(seed),pb=new PB(26,34),cx=13,base=30;const stone=(px,py,lit)=>{let c=mix(0x9a98a4,0x84828e,hash(px>>1,py>>1,seed));if(vn(px/3,py/3,seed)>.68)c=mix(c,0x5e7a4a,.5);return tone(c,lit)};
  if(kind===0){pb.rect(cx-6,base-18,12,18,(i,j,px,py)=>{if(j<3&&(i<1||i>10))return null;if(j<1&&(i<3||i>8))return null;return stone(px,py,i<3?.15:i>9?-.4:0)});pb.rect(cx-3,base-13,6,1,0x4a4852);pb.rect(cx-2,base-10,4,1,0x4a4852)}
  else if(kind===1){pb.rect(cx-2,base-24,4,24,(i,j,px,py)=>stone(px,py,i<1?.15:i>2?-.4:0));pb.rect(cx-7,base-18,14,4,(i,j,px,py)=>stone(px,py,j<1?.15:j>2?-.4:0))}
  else{pb.rect(cx-5,base-26,10,26,(i,j,px,py)=>{if(j<6&&Math.abs(i-4.5)>j*.9)return null;return stone(px,py,i<3?.15:i>7?-.4:0)})}
  pb.ell(cx+2,base+1,9,3,(nx,ny,px,py)=>pb.has(px,py)?null:0x4a3a2a);pb.outline(0x1a1820);return{cv:pb.canvas(),ox:cx,oy:base,r:6}}
function propCave(){const pb=new PB(170,120),cx=85,base=108;const R=mulberry(77);const pts=[];for(let i=0;i<16;i++){const a=Math.PI+i/15*Math.PI,r=56+R()*14;pts.push([cx+Math.cos(a)*r*1.35,base-8+Math.sin(a)*r*1.05])}pts.push([cx+76,base],[cx-76,base]);
  for(let py=0;py<120;py++)for(let px=0;px<170;px++){if(!inPoly(px+.5,py+.5,pts))continue;const nx=(px-cx)/76,ny=(py-base+40)/60;vor(px/9,py/7,5);let l=-(nx*.5+ny*.7)+(VO.id-.5)*.6;if(VO.f2-VO.f1<.07)l-=.35;let c=[0xc8c4cc,0x9a98a6,0x726f82,0x524f64,0x36344a][l>.5?0:l>.12?1:l>-.25?2:l>-.6?3:4];if(ny<-.6&&vn(px/6,py/6,2)>.5)c=mix(c,0x5a7a44,.65);pb.set(px,py,c)}
  pb.ell(cx-6,base-20,24,22,(nx,ny)=>ny>.7?null:mix(0x050408,0x1a1420,Math.max(0,-ny)*.6+(nx*nx)*.4));
  pb.rect(cx-32,base-48,5,46,(i)=>i<2?0x8a6644:0x5a3e2a);pb.rect(cx+16,base-48,5,46,(i)=>i<2?0x7a5a3a:0x4a3220);pb.rect(cx-34,base-50,57,5,(i,j)=>j<2?0x8a6644:0x5a3e2a);
  pb.ell(cx-6,base-56,7,7,(nx,ny)=>0xe8e0d0);pb.rect(cx-9,base-57,2,2,0x1a1418);pb.rect(cx-4,base-57,2,2,0x1a1418);
  pb.outline(0x16141e);return{cv:pb.canvas(),ox:cx,oy:base}}
function propTent(seed,c){const o=makeBuilding({w:2,h:2,wallH:3,roofH:28,ridge:'y',style:'timber',wall:c,timber:tone(c,-.4),roof:c,roof2:tone(c,-.3),seed,open:{}});return o}
function propCampfireBase(){const pb=new PB(40,24),cx=20,cy=14;for(let a=0;a<12;a++){const an=a/12*Math.PI*2,px=cx+Math.cos(an)*13,py=cy+Math.sin(an)*6;pb.ell(px,py,3,2.2,(nx,ny)=>ny<0?0x9a98a4:0x5a5866)}pb.thick(cx-9,cy+3,cx+9,cy-3,3,(u,v)=>v<.5?0x7a5232:0x4a3020);pb.thick(cx-9,cy-3,cx+9,cy+3,3,(u,v)=>v<.5?0x6a4428:0x3a2418);pb.ell(cx,cy,5,2.5,0x2a1a14);pb.outline(0x16120e);return{cv:pb.canvas(),ox:cx,oy:cy+4,r:12}}
function propTotem(){const pb=new PB(24,60),cx=12;pb.rect(cx-2,14,5,44,(i)=>i<2?0x8a6644:0x5a3e2a);pb.ell(cx,12,6,6,(nx,ny)=>tone(0xe8e0cc,-(nx*.4+ny*.5)));pb.rect(cx-3,11,2,2,0x1a1418);pb.rect(cx+2,11,2,2,0x1a1418);pb.rect(cx-2,15,5,1,0x1a1418);for(const [x,y,c] of [[cx-6,22,0xc83a2a],[cx+5,26,0x3a8ac8],[cx-5,30,0xe8c050]])pb.rect(x,y,2,7,c);pb.outline(0x16120e);return{cv:pb.canvas(),ox:cx,oy:58,r:5}}
function propHay(){const pb=new PB(36,30);isoBox(pb,[18,8],.5,.5,12,(u,v,px,py)=>mix(0xe8c870,0xc8a848,hash(px,py,2)),(u,v,px,py)=>(px%3===0)?0xa88a3a:mix(0xd8b858,0xc8a848,hash(px,py,3)),(u,v,px,py)=>tone((px%3===0)?0xa88a3a:0xc8a848,-.4));pb.outline(0x2a1e10);return{cv:pb.canvas(),ox:18,oy:24,r:8}}
function propChest(open){const pb=new PB(36,32);const N=[18,12];isoBox(pb,N,.42,.32,10,(u,v)=>0x6a4428,(u,v)=>(u<.1||u>.9||Math.abs(u-.5)<.06)?0x5a5a66:(v>.6&&open?0x3a2416:0x8a5a34),(u,v)=>tone((u<.1||u>.9)?0x5a5a66:0x8a5a34,-.4));
  if(open){pb.para([N[0]-10,N[1]-10+5],[13.4,6.7],[0,-9],(u,v)=>v>.85?0x5a5a66:0x9a6a40);pb.rect(N[0]-6,N[1]-2,6,3,0xffd050)}else{pb.para([N[0]-10,N[1]-10+5],[13.4,6.7],[13,-6.5],(u,v)=>(u<.1||u>.9||Math.abs(u-.5)<.08)?0x6a6a78:0xa8784a);pb.rect(N[0]-2,N[1]+4,3,3,0xe8c050)}
  pb.outline(0x1a1410);return{cv:pb.canvas(),ox:18,oy:24,r:7}}
function propSign(icon){const pb=new PB(30,46),cx=15;pb.rect(cx-1,14,3,30,(i)=>i<1?0x9a7048:0x5a3e2a);pb.rect(cx-12,6,24,14,(i,j)=>(i<1||i>22||j<1||j>12)?0x4a3020:(j<7?0xb08a5a:0x9a764a));
  const P=(x,y,c)=>pb.set(cx-12+x,6+y,c);const draw={coin:()=>{for(let y=3;y<11;y++)for(let x=8;x<16;x++)if((x-11.5)**2+(y-6.5)**2<14)P(x,y,(x+y)%5?0xe8c050:0xfff0a0)},anvil:()=>{for(let x=6;x<18;x++)P(x,5,0x3a3a46);for(let x=8;x<16;x++)P(x,6,0x3a3a46);for(let x=10;x<14;x++){P(x,7,0x3a3a46);P(x,8,0x3a3a46)}for(let x=8;x<16;x++)P(x,9,0x3a3a46)},potion:()=>{for(let y=3;y<6;y++)P(12,y,0x6a4a2a);for(let y=6;y<11;y++)for(let x=9;x<15;x++)P(x,y,y<8?0xff6a5a:0xd8343a)},mug:()=>{for(let y=4;y<11;y++)for(let x=8;x<14;x++)P(x,y,y<6?0xfff0d0:0xe8a83a);P(14,6,0x6a4a2a);P(15,7,0x6a4a2a);P(14,8,0x6a4a2a)},sun:()=>{for(let y=3;y<11;y++)for(let x=8;x<16;x++)if((x-11.5)**2+(y-6.5)**2<10)P(x,y,0xfff0a0);P(11,2,0xfff0a0);P(11,11,0xfff0a0);P(7,6,0xfff0a0);P(16,6,0xfff0a0)},sword:()=>{for(let i=0;i<8;i++)P(7+i,9-i,0xe8eef8);P(8,7,0xe8c050);P(10,9,0xe8c050)}};(draw[icon]||draw.coin)();
  pb.outline(0x16120e);return{cv:pb.canvas(),ox:cx,oy:44,r:4}}
function propTownWall(seed,tall){const ht=tall?74:46,pb=new PB(36,ht+26);isoBox(pb,[18,ht+4],1,1,ht,(u,v,px,py)=>tone(mix(0x7e828c,0x686c78,hash(px>>2,py>>2,seed)),.12),(u,v,px,py)=>{let c=bricks(u*32,v*ht,6,12,seed,0x767a86,0x60646e,0x2a2c34);if(vn(u*4,v*3,seed)>.68)c=mix(c,0x3e5a44,.45);return c},(u,v,px,py)=>tone(bricks(u*32,v*ht,6,12,seed+1,0x767a86,0x60646e,0x2a2c34),-.45));return{cv:pb.canvas(),ox:18,oy:ht+4,tall:1}}
function propDungeonWall(seed,tall,deco){const ht=tall?60:14,pb=new PB(36,ht+26);let flame=null;
  const brickL=(u,v,px,py)=>{let c=bricks(u*32,v*ht,7,13,seed,0x8e5258,0x7a444c,0x34202c);if(hash(px>>2,py>>2,seed)<.06)c=mix(c,0x4a6a52,.5);if(deco==='banner'&&u>.28&&u<.72&&v>.22&&v<.88){const lu=(u-.28)/.44,lv=(v-.22)/.66;if(lv<.12&&Math.abs(lu-.5)<.55)return 0x3a2a20;if(1-lv<Math.abs(lu-.5)*.6)return c;c=lu<.12||lu>.88?0x5a1a1e:0x8a2a2e;if(Math.abs(lu-.5)<.14&&Math.abs(lv-.45)<.12)c=0xe8c050}return tone(c,.04)};
  isoBox(pb,[18,ht+4],1,1,ht,(u,v,px,py)=>{vor(u*3,v*3,seed);let c=mix(0x3e5c5c,0x4a6a68,VO.id);if(VO.f2-VO.f1<.08)c=0x22323a;if(u<.05||v<.05)c=tone(c,.25);return c},brickL,(u,v,px,py)=>tone(bricks(u*32,v*ht,7,13,seed+1,0x8e5258,0x7a444c,0x34202c),-.5));
  if(deco==='torch'&&tall){const x=18-16+16*.5,y=ht+4+8+8*.5-ht*.55;pb.rect(x-2,y,5,2,0x2a2a34);pb.rect(x,y-6,2,7,0x6a4428);flame=[x+1-18,y-7-(ht+4)]}
  return{cv:pb.canvas(),ox:18,oy:ht+4,tall:tall?1:0,flame}}
function propPillar(seed){const pb=new PB(30,80),cx=15;for(let y=10;y<72;y++)for(let x=cx-7;x<=cx+7;x++){const f=(x-cx)/7;let c=f<-.4?0xc8c0b8:f<.3?0x9a948c:0x6a6474;if(((x-cx+8)%4)===0)c=tone(c,-.15);pb.set(x,y,c)}pb.rect(cx-10,72,21,6,(i)=>i<8?0xa8a29a:0x6a6474);pb.rect(cx-10,6,21,5,(i)=>i<8?0xb8b2aa:0x6a6474);pb.outline(0x1a1820);return{cv:pb.canvas(),ox:cx,oy:76,r:8,tall:1}}
function propThrone(){const pb=new PB(50,70),cx=25;pb.rect(cx-14,10,28,40,(i,j)=>(i<2||i>25||j<2)?0x5a3a24:mix(0x8a2a2e,0x6a1e22,j/40));for(const x of [cx-14,cx+12])pb.rect(x,4,3,8,0xe8c050);pb.rect(cx-18,40,36,22,(i,j)=>j<3?0x9a6a40:i<18?0x7a5232:0x4a3020);pb.ell(cx,12,5,5,(nx,ny)=>tone(0xe8e0cc,-(nx*.4+ny*.4)));pb.outline(0x16120e);return{cv:pb.canvas(),ox:cx,oy:62,r:14}}
function propCage(){const pb=new PB(44,64),cx=22;const N=[cx,18];isoBox(pb,[cx,50],.8,.8,0,null,null,null);for(let i=0;i<=10;i++){const t=i/10;const a=[cx-26+26*t,50+13*t-13],b=[cx+26*t,50+13-13*t];pb.rect(a[0],a[1]-36,1,36,0x3a3a46);pb.rect(b[0],b[1]-36,1,36,0x2a2a34)}pb.line(cx-26,24,cx,11,0x4a4a58);pb.line(cx,11,cx+26,24,0x4a4a58);pb.line(cx-26,24,cx,37,0x4a4a58);pb.line(cx,37,cx+26,24,0x4a4a58);pb.outline(0x14141a);return{cv:pb.canvas(),ox:cx,oy:50}}
function propBones(seed){const pb=new PB(26,14),R=mulberry(seed);for(let i=0;i<4;i++){const x=4+R()*16,y=4+R()*6,a=R()*3;pb.line(x,y,x+Math.cos(a)*6,y+Math.sin(a)*3,0xe8e0cc)}pb.ell(14,6,3,2.4,0xe8e0cc);pb.set(13,6,0x2a2020);pb.set(15,6,0x2a2020);pb.outline(0x2a2420);return{cv:pb.canvas(),ox:13,oy:9}}
function propStairs(){const pb=new PB(80,70);for(let k=0;k<6;k++)isoBox(pb,[40+k*5,60-k*7-16],1.2,1,6,(u,v,px,py)=>tone(0x8a8a96,.1-k*.05),(u,v)=>0x5a5a68,(u,v)=>0x3a3a4a);pb.outline(0x12121a);return{cv:pb.canvas(),ox:40,oy:44}}
function propAnvil(){const pb=new PB(40,40),cx=20;pb.rect(cx-6,22,12,10,(i)=>i<4?0x6a5a4a:0x4a3a30);pb.rect(cx-10,14,20,6,(i,j)=>j<2?0x8a8a98:i<10?0x5a5a68:0x3a3a48);pb.rect(cx+10,15,5,3,0x5a5a68);pb.rect(cx-4,20,8,3,0x3a3a48);pb.outline(0x14141a);return{cv:pb.canvas(),ox:cx,oy:32,r:8}}
function propForge(){const pb=new PB(70,70);const o=isoBox(pb,[35,40],1,1,22,(u,v,px,py)=>(u>.25&&u<.75&&v>.25&&v<.75)?mix(0xff9a3a,0xc8401a,hash(px,py,1)):tone(bricks(px,py,4,8,2,0x8a5a48,0x6a4438,0x2a1a1a),.1),(u,v,px,py)=>(u>.3&&u<.7&&v<.55)?mix(0xffb050,0xd0501a,v):bricks(u*32,v*22,5,9,4,0x8a5a48,0x6a4438,0x2a1a1a),(u,v,px,py)=>tone(bricks(u*32,v*22,5,9,5,0x8a5a48,0x6a4438,0x2a1a1a),-.45));pb.outline(0x16100e);return{cv:pb.canvas(),ox:35,oy:40,light:[0,-14],fire:[0,-24]}}

// ---------- item & skill icons ----------
function itemIcon(shape,c1,c2){const pb=new PB(20,20);const s=pb;const L=(c,l)=>tone(c,l);
  const f={
    potion:()=>{s.rect(8,2,4,2,0x8a6a42);s.rect(8,4,4,3,0xd8e0e8);s.ell(10,12,6,6,(nx,ny)=>nx*nx+ny*ny>.75?L(c1,-.4):(ny<-.2?0xe8f0f8:L(c1,-(nx*.3+ny*.3))));s.set(8,10,0xffffff)},
    scroll:()=>{s.rect(4,4,12,12,(i,j)=>j%3===0&&i>2&&i<10?L(c2,-.2):c1);s.rect(3,3,14,2,c2);s.rect(3,15,14,2,c2)},
    tusk:()=>{for(let i=0;i<12;i++)s.rect(4+i,14-Math.round(Math.sin(i/12*Math.PI)*8)-i*.3,2,3,i<4?c2:c1)},
    hide:()=>{s.ell(10,10,8,7,(nx,ny)=>Math.abs(nx)>.85&&Math.abs(ny)<.4?null:L(c1,-(nx*.3+ny*.4)));s.rect(6,8,8,1,c2)},
    cloth:()=>{s.para([3,5],[14,2],[0,11],(u,v)=>(Math.floor(u*5+v*3)&1)?c1:c2)},
    fish:()=>{s.ell(9,10,7,4,(nx,ny)=>L(ny<0?c1:c2,-(nx*.3+ny*.6)));for(let k=0;k<5;k++)s.rect(15+Math.floor(k/2),10-k,1,1+k*2,c2);s.rect(5,9,1,1,0x101014);s.rect(4,8,1,1,0xffffff);for(let k=0;k<3;k++)s.rect(8+k*2,8,1,4,L(c1,-.2))},ore:()=>{s.ell(10,11,7,5,(nx,ny)=>L(c1,-(nx*.5+ny*.6)+(hash(Math.round(nx*4),Math.round(ny*4),1)-.5)*.6))},
    sword:()=>{s.thick(5,15,16,4,2.6,(u,v)=>v<.5?0xffffff:c1);s.thick(3,13,8,18,2,()=>c2);s.rect(3,16,2,2,c2)},
    mace:()=>{s.thick(5,17,12,8,2.2,()=>c2);s.ell(13,6,4,4,(nx,ny)=>L(c1,-(nx*.4+ny*.5)));s.set(13,1,c1);s.set(18,6,c1);s.set(13,11,c1)},
    axe:()=>{s.thick(5,17,13,4,2.2,()=>c2);s.ell(14,6,5,4,(nx,ny)=>nx<-.2?null:L(c1,-(nx*.3+ny*.5)))},
    bow:()=>{for(let i=0;i<=14;i++){const a=-1.2+i/14*2.4;s.rect(6+Math.cos(a)*8,10+Math.sin(a)*8,2,2,c1)}s.line(14,3,14,17,c2)},
    staff:()=>{s.thick(5,18,12,6,2,()=>c1);s.ell(13,5,3.5,3.5,(nx,ny)=>ny<-.3?0xffffff:c2)},
    shield:()=>{s.ell(10,10,7,8,(nx,ny)=>nx*nx+ny*ny>.72?c2:L(c1,-(nx*.3+ny*.3)));s.ell(10,10,2,2,c2)},
    quiver:()=>{s.thick(6,17,13,5,5,(u,v)=>v<.5?c1:L(c1,-.3));for(const x of [11,13,15])s.rect(x,2,1,4,c2)},
    tome:()=>{s.rect(4,4,12,13,(i,j)=>i<2?L(c1,-.4):c1);s.rect(9,8,4,4,c2);s.rect(15,5,1,11,0xe8e0d0)},
    hood:()=>{s.ell(10,11,7,7,(nx,ny)=>(Math.abs(nx)<.5&&ny>-.1&&ny<.75)?0x2a2028:L(c1,-(nx*.3+ny*.3)))},
    helm:()=>{s.ell(10,10,7,7,(nx,ny)=>ny>.7?null:(Math.abs(ny-.05)<.12&&Math.abs(nx)<.6)?0x14141a:L(c1,-(nx*.4+ny*.4)));s.rect(9,10,2,6,c2)},
    hat:()=>{s.ell(10,14,8,3,(nx,ny)=>L(c1,-.2));s.tri([5,14],[15,14],[12,2],()=>c1);s.rect(6,12,9,2,c2)},
    chest:()=>{s.rect(5,4,10,13,(i,j)=>L(c1,i<3?.15:i>7?-.35:0));s.rect(2,4,3,7,c1);s.rect(15,4,3,7,L(c1,-.3));s.rect(8,4,4,2,c2);s.rect(5,13,10,1,c2)},
    robe:()=>{s.para([6,3],[8,0],[-3,15],(u,v)=>L(c1,u<.3?.15:u>.7?-.35:0));s.para([6,3],[8,0],[3,15],(u,v)=>L(c1,u<.3?.15:u>.7?-.35:0));s.rect(9,3,2,15,c2)},
    legs:()=>{s.rect(5,3,10,5,c1);s.rect(5,8,4,10,c1);s.rect(11,8,4,10,L(c1,-.3));s.rect(5,7,10,1,c2)},
    gloves:()=>{s.rect(5,6,8,10,(i)=>L(c1,i<3?.1:-.2));s.rect(13,8,3,4,c1);s.rect(5,14,8,2,c2)},
    boots:()=>{s.rect(5,3,6,12,(i)=>L(c1,i<2?.1:-.15));s.rect(5,13,11,4,c1);s.rect(5,16,11,1,c2)},
    ring:()=>{s.ell(10,11,6,6,(nx,ny)=>nx*nx+ny*ny<.4?null:L(c1,-(nx*.4+ny*.4)));s.ell(10,5,2.5,2.5,c2)},
    amulet:()=>{s.line(4,3,10,10,c2);s.line(16,3,10,10,c2);s.ell(10,13,4,4,(nx,ny)=>L(c1,-(nx*.4+ny*.4)))},
    dagger:()=>{s.thick(6,14,15,5,2.2,(u,v)=>v<.5?0xffffff:c1);s.thick(4,12,8,16,1.6,()=>0x3a3a44);s.thick(4,16,2,18,1.8,()=>c2)},
    plate:()=>{s.rect(5,5,10,12,(i,j)=>Math.abs(i-4)<1?tone(c1,.5):tone(c1,i<4?.15:-.3));s.ell(4,6,3.4,2.6,(nx,ny)=>tone(c1,.3-ny*.4));s.ell(16,6,3.4,2.6,(nx,ny)=>tone(c1,-.1-ny*.4));s.rect(5,15,10,1,c2)},
    ahood:()=>{s.ell(10,11,7,7.5,(nx,ny)=>(Math.abs(nx)<.45&&ny>-.15&&ny<.8)?0x16121c:tone(c1,-(nx*.3+ny*.3)));s.tri([7,4],[13,4],[10,1],()=>c1);s.rect(4,17,12,1,c2)},
    beanie:()=>{s.ell(10,12,7,6,(nx,ny)=>ny>.3?null:tone(c1,((Math.round((nx+1)*5))&1)?-.15:.05));s.rect(3,12,14,3,tone(c1,-.3));s.ell(10,5,2.4,2.2,c2)},
    apple:()=>{s.ell(10,11,6,6,(nx,ny)=>nx<-.3&&ny<-.2?0xffb0a0:tone(c1,-(nx*.3+ny*.3)));s.line(1,10,19,10,c2);s.rect(17,9,2,3,0xb8bcc8);s.rect(1,8,2,4,0xd83a3a);s.set(10,4,0x5aa03a)},
    wolfhead:()=>{s.ell(10,11,7,6.5,(nx,ny)=>tone(c1,-(nx*.3+ny*.3)));s.tri([4,7],[8,5],[4,1],()=>c1);s.tri([16,7],[12,5],[16,1],()=>c1);s.ell(10,13,3.5,2.5,c2);s.rect(9,12,2,1,0x141018);s.set(7,9,0xffd04a);s.set(13,9,0xffd04a)},
    straw:()=>{s.ell(10,13,9,3,(nx,ny,px)=>px%3?c1:tone(c1,-.2));s.ell(10,9,5,4,(nx,ny)=>ny>.4?null:tone(c1,.15-ny*.2));s.rect(5,10,10,2,c2)},
    flowers:()=>{s.ell(10,11,7,4,(nx,ny)=>nx*nx+ny*ny<.55?null:c1);for(const [x,y,c] of [[4,10,c2],[8,7,0xffe066],[13,8,c2],[16,11,0xffffff],[10,14,0xffe066],[5,13,0xc89aff]]){s.rect(x-1,y-1,3,3,c);s.set(x,y,0xffd040)}},
    jester:()=>{s.rect(5,13,10,3,0xe8c050);s.thick(7,13,3,4,3,()=>c1);s.thick(13,13,17,4,3,()=>c2);s.ell(3,4,2,2,0xffd040);s.ell(17,4,2,2,0xffd040)},
    pot:()=>{s.ell(10,11,7,5,(nx,ny)=>ny>.3?null:tone(c1,.2-(nx*.3+ny*.4)));s.rect(2,11,16,2,c2);s.thick(16,10,19,8,1.6,()=>c2)},
    greathelm:()=>{s.ell(10,11,7,7,(nx,ny)=>(Math.abs(ny-.05)<.12&&Math.abs(nx)<.7)||(Math.abs(nx)<.08&&ny>0&&ny<.6)?0x0e0e14:tone(c1,.2-(nx*.4+ny*.4)));s.thick(10,4,15,1,2.4,()=>c2);s.thick(15,1,18,4,2,()=>c2)},
    crossbow:()=>{s.thick(4,15,16,6,2.4,()=>c1);for(let i=0;i<=10;i++){const t=i/10;s.rect(11+(t-.5)*-10+Math.sin(t*3.14)*2,3+t*10-((t-.5)*0),2,2,c2)}s.line(8,3,16,13,0xe8e0d0)},
    scythe:()=>{s.thick(4,18,13,3,2,()=>0x5a3e28);for(let i=0;i<9;i++)s.rect(13-i*1.2+Math.sin(i/8*3)*1,3+i*.9+Math.sin(i/8*3.1)*2,2,2,i<2?0xffffff:c1)},
    wand:()=>{s.thick(5,17,13,7,1.8,()=>c1);s.ell(14,5,2.6,2.6,(nx,ny)=>ny<-.3?0xffffff:c2);s.set(17,3,c2);s.set(11,3,c2)},
    antlers:()=>{for(const sd of [-1,1]){s.thick(10+sd*2,16,10+sd*6,7,2,()=>c1);s.thick(10+sd*4,11,10+sd*8,9,1.5,()=>c1);s.thick(10+sd*6,7,10+sd*5,2,1.5,()=>c1);s.set(10+sd*5,2,c2)}},
    crown:()=>{s.rect(4,10,12,5,(i)=>tone(c1,i<4?.2:-.1));for(const x of [4,9,14])s.tri([x,10],[x+2,10],[x+1,5],()=>c1);s.rect(9,12,2,2,c2)},
    coin:()=>{s.ell(10,10,7,7,(nx,ny)=>nx*nx+ny*ny>.7?0xa8782a:(ny<-.2?0xfff0a0:0xe8c050))}
  };(f[shape]||f.coin)();pb.outline(0x16121a);return pb.canvas()}
const ICON_CACHE={};function iconURL(id){if(ICON_CACHE[id])return ICON_CACHE[id];const b=BASES[id];const c=itemIcon(...b.ic);return ICON_CACHE[id]=c.toDataURL()}
function skillIcon(cls,key){const [c,x]=mk(24,24);const bg={g:['#5a2a22','#8a3a2a'],a:['#22401e','#3a6a2a'],m:['#24245a','#3a3a8a'],l:['#1e1a26','#4a2a3a'],h:['#5a4a1e','#a88a3a']}[cls];const g=x.createLinearGradient(0,0,24,24);g.addColorStop(0,bg[1]);g.addColorStop(1,bg[0]);x.fillStyle=g;x.fillRect(0,0,24,24);
  x.strokeStyle='#ffe6b0';x.fillStyle='#ffe6b0';x.lineWidth=2;const id=cls+key;x.beginPath();
  if(key==='atk'&&cls!=='l'&&cls!=='h'){if(cls==='g'){x.moveTo(5,19);x.lineTo(19,5);x.stroke();x.beginPath();x.moveTo(4,15);x.lineTo(9,20);x.stroke()}else if(cls==='a'){x.moveTo(4,20);x.lineTo(19,5);x.stroke();x.beginPath();x.moveTo(19,5);x.lineTo(13,6);x.lineTo(18,11);x.fill()}else{x.arc(12,12,5,0,7);x.fill();x.globalAlpha=.5;x.beginPath();x.arc(12,12,9,0,7);x.stroke()}}
  else if(id==='gQ'){x.arc(12,12,7,0.4,5.6);x.stroke();x.beginPath();x.moveTo(19,8);x.lineTo(19,14);x.lineTo(14,12);x.fill()}
  else if(id==='gE'){x.fillRect(5,6,8,12);x.beginPath();x.moveTo(14,12);x.lineTo(21,12);x.stroke();x.beginPath();x.moveTo(21,8);x.lineTo(21,16);x.stroke()}
  else if(id==='gR'){for(const r of [3,6,9]){x.beginPath();x.arc(8,12,r,-.9,.9);x.stroke()}}
  else if(id==='gT'){x.fillRect(9,3,6,8);x.fillRect(11,11,2,8);x.beginPath();x.moveTo(3,21);x.lineTo(21,21);x.stroke()}
  else if(id==='aQ'){for(const a of [-.5,0,.5]){x.beginPath();x.moveTo(4,20);x.lineTo(4+Math.cos(-.78+a)*17,20+Math.sin(-.78+a)*17);x.stroke()}}
  else if(id==='aE'){x.arc(12,14,7,Math.PI,0);x.stroke();x.beginPath();x.moveTo(3,14);x.lineTo(7,10);x.lineTo(8,15);x.fill()}
  else if(id==='aR'){x.arc(12,12,7,0,Math.PI);x.stroke();for(let i=6;i<=18;i+=3){x.beginPath();x.moveTo(i,12);x.lineTo(i,7);x.stroke()}}
  else if(id==='aT'){for(const i of [5,11,17]){x.beginPath();x.moveTo(i,3);x.lineTo(i,15);x.stroke();x.beginPath();x.moveTo(i-3,12);x.lineTo(i,16);x.lineTo(i+3,12);x.stroke()}}
  else if(id==='mQ'){x.fillStyle='#dff6ff';x.beginPath();x.moveTo(20,4);x.lineTo(15,7);x.lineTo(5,19);x.lineTo(8,20);x.lineTo(18,10);x.closePath();x.fill();x.beginPath();x.moveTo(4,14);x.lineTo(8,17);x.moveTo(9,9);x.lineTo(12,12);x.stroke()}
  else if(id==='mE'){x.fillStyle='#fff6a0';x.beginPath();x.moveTo(14,2);x.lineTo(6,13);x.lineTo(11,13);x.lineTo(8,22);x.lineTo(18,9);x.lineTo(13,9);x.lineTo(16,2);x.closePath();x.fill()}
  else if(id==='mR'){x.fillStyle='#8a9ab8';x.beginPath();x.arc(8,7,4,0,7);x.arc(14,6,5,0,7);x.arc(18,8,3.5,0,7);x.fill();x.strokeStyle='#fff6a0';x.lineWidth=1.5;x.beginPath();x.moveTo(9,11);x.lineTo(7,16);x.lineTo(10,16);x.lineTo(8,21);x.moveTo(16,11);x.lineTo(14,15);x.lineTo(17,15);x.lineTo(15,19);x.stroke()}
  else if(id==='mT'){x.fillStyle='#ff7a2a';x.arc(15,15,5,0,7);x.fill();x.beginPath();x.moveTo(4,4);x.lineTo(12,12);x.stroke()}
  else if(id==='hatk'){x.arc(12,12,4,0,7);x.fill();for(let a=0;a<8;a++){x.beginPath();x.moveTo(12+Math.cos(a*.785)*6,12+Math.sin(a*.785)*6);x.lineTo(12+Math.cos(a*.785)*9,12+Math.sin(a*.785)*9);x.stroke()}}
  else if(id==='hQ'){x.lineWidth=4;x.moveTo(3,20);x.lineTo(21,4);x.stroke();x.lineWidth=2;x.strokeStyle='#ffffff';x.beginPath();x.moveTo(3,20);x.lineTo(21,4);x.stroke()}
  else if(id==='hE'){x.fillRect(10,4,4,16);x.fillRect(4,10,16,4)}
  else if(id==='hR'){x.moveTo(12,3);x.lineTo(20,7);x.lineTo(18,16);x.lineTo(12,21);x.lineTo(6,16);x.lineTo(4,7);x.closePath();x.stroke();x.fillRect(11,8,2,8);x.fillRect(8,11,8,2)}
  else if(id==='hT'){x.ellipse(12,15,9,5,0,0,7);x.stroke();x.beginPath();x.moveTo(12,3);x.lineTo(12,14);x.stroke();x.beginPath();x.moveTo(8,7);x.lineTo(16,7);x.stroke()}
  else if(id==='latk'){x.moveTo(4,19);x.lineTo(11,12);x.stroke();x.beginPath();x.moveTo(20,19);x.lineTo(13,12);x.stroke()}
  else if(id==='lQ'){x.fillStyle='#b08ad8';x.arc(9,12,5,0,7);x.fill();x.fillStyle='#ffe6b0';x.beginPath();x.arc(16,12,3,0,7);x.fill()}
  else if(id==='lE'){x.moveTo(3,20);x.lineTo(21,4);x.stroke();x.fillStyle='#d83a3a';x.fillRect(8,13,3,3);x.fillRect(14,8,3,3)}
  else if(id==='lR'){x.globalAlpha=.45;x.arc(12,10,6,0,7);x.fill();x.fillRect(7,14,10,7);x.globalAlpha=1}
  else if(id==='lT'){x.moveTo(12,3);x.lineTo(12,17);x.stroke();x.beginPath();x.moveTo(8,8);x.lineTo(16,8);x.stroke();x.fillStyle='#d83a3a';x.fillRect(10,18,4,4)}
  else if(key==='dash'){x.strokeStyle='#cfe8ff';for(const y of [8,12,16]){x.beginPath();x.moveTo(3,y);x.lineTo(14,y);x.stroke()}x.beginPath();x.moveTo(14,6);x.lineTo(21,12);x.lineTo(14,18);x.stroke()}
  x.strokeStyle='#00000088';x.lineWidth=1;x.strokeRect(.5,.5,23,23);return c.toDataURL()}
// soft light sprites
function lightSprites(){const [ls,lx]=mk(128,128);const g=lx.createRadialGradient(64,64,0,64,64,64);[[0,1],[.36,1],[.36,.82],[.58,.82],[.58,.56],[.78,.56],[.78,.28],[.93,.28],[.93,0],[1,0]].forEach(([o,a])=>g.addColorStop(o,`rgba(0,0,0,${a})`));lx.fillStyle=g;lx.fillRect(0,0,128,128);
  const [gs,gx]=mk(128,128);const g2=gx.createRadialGradient(64,64,0,64,64,64);g2.addColorStop(0,'rgba(255,190,110,.55)');g2.addColorStop(.4,'rgba(255,140,60,.2)');g2.addColorStop(1,'rgba(255,100,40,0)');gx.fillStyle=g2;gx.fillRect(0,0,128,128);
  const [cs,cx]=mk(128,128);const g3=cx.createRadialGradient(64,64,0,64,64,64);g3.addColorStop(0,'rgba(140,200,255,.5)');g3.addColorStop(.5,'rgba(110,160,255,.15)');g3.addColorStop(1,'rgba(90,120,255,0)');cx.fillStyle=g3;cx.fillRect(0,0,128,128);
  const [fs,fxx]=mk(64,64);const g5=fxx.createRadialGradient(32,32,0,32,32,32);g5.addColorStop(0,'rgba(220,255,130,.6)');g5.addColorStop(.5,'rgba(180,240,90,.18)');g5.addColorStop(1,'rgba(150,220,60,0)');fxx.fillStyle=g5;fxx.fillRect(0,0,64,64);
  const [ss,sx]=mk(48,18);const g4=sx.createRadialGradient(24,9,0,24,9,24);g4.addColorStop(0,'rgba(18,22,48,.42)');g4.addColorStop(.7,'rgba(18,22,48,.22)');g4.addColorStop(1,'rgba(18,22,48,0)');sx.setTransform(1,0,0,.375,0,5.6);sx.fillStyle=g4;sx.fillRect(0,0,48,48);
  const [sf,sfx]=mk(128,128);{const g=sfx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.5,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');sfx.fillStyle=g;sfx.fillRect(0,0,128,128)}
  return{light:ls,glow:gs,cold:cs,shadow:ss,fly:fs,soft:sf}}

// ---------- crypt & goblin fortress props ----------
function propWall2(seed,tall,deco,P){const ht=tall?60:14,pb=new PB(36,ht+26);let flame=null;
  const fL=(u,v,px,py)=>{let c=bricks(u*32,v*ht,7,13,seed,P.a,P.b,P.m);if(hash(px>>2,py>>2,seed)<.07)c=mix(c,P.moss,.45);
    if(deco==='skulls'&&u>.25&&u<.75&&v>.3&&v<.66){const lu=(u-.25)/.5,lv=(v-.3)/.36;if(lv>.9||lu<.06||lu>.94)return 0x14101a;c=0x0e0a12;for(const sx of [.25,.5,.75]){const dx=(lu-sx)*14,dy=(lv-.55)*10;if(dx*dx+dy*dy<4.4){c=(Math.abs(dx+.8)<.6||Math.abs(dx-.8)<.6)&&Math.abs(dy+.2)<.6?0x1a1218:tone(0xd8d0bc,.1-dx*.08-dy*.06)}}}
    return tone(c,.04)};
  isoBox(pb,[18,ht+4],1,1,ht,(u,v,px,py)=>{vor(u*3,v*3,seed);let c=mix(P.t1,P.t2,VO.id);if(VO.f2-VO.f1<.08)c=tone(P.t1,-.5);if(u<.05||v<.05)c=tone(c,.25);return c},fL,(u,v,px,py)=>tone(bricks(u*32,v*ht,7,13,seed+1,P.a,P.b,P.m),-.5));
  if((deco==='torch'||deco==='candle')&&tall){const x=10,y=ht+4+12-ht*.55;pb.rect(x-2,y,5,2,0x2a2a34);if(deco==='candle'){pb.rect(x-1,y-5,3,5,0xe8e0cc);pb.rect(x+2,y-3,2,3,0xd8d0bc)}else pb.rect(x,y-6,2,7,0x6a4428);flame=[x+1-18,y-7-(ht+4)]}
  return{cv:pb.canvas(),ox:18,oy:ht+4,tall:tall?1:0,flame}}
const CRYPT_PAL={a:0x5a5666,b:0x4a4656,m:0x1a1620,moss:0x4a3a5a,t1:0x3a3646,t2:0x46404e};
const FORT_PAL={a:0x6a4a32,b:0x5a3e2a,m:0x2a1a12,moss:0x4a5a32,t1:0x4a3a2a,t2:0x5a4632};
function propSarcophagus(seed,lidOff){const pb=new PB(70,52);const N=[30,22];isoBox(pb,[N[0],N[1]+8],1.4,.7,14,(u,v,px,py)=>{if(lidOff&&u>.1&&u<.9&&v>.15&&v<.85)return 0x0c0a10;let c=mix(0x7a7684,0x6a6674,hash(px>>2,py>>2,seed));if(Math.abs(u-.5)<.04||Math.abs(v-.5)<.06&&u>.2&&u<.8)c=tone(c,-.3);return tone(c,.2)},(u,v,px,py)=>tone(bricks(u*45,v*14,5,10,seed,0x6a6674,0x5a5664,0x2a2632),.05),(u,v,px,py)=>tone(bricks(u*22,v*14,5,10,seed+1,0x6a6674,0x5a5664,0x2a2632),-.45));
  if(!lidOff){pb.ell(N[0]+6,N[1]+2,5,3,(nx,ny)=>tone(0xb8b2c0,.2-(nx*.3+ny*.4)));pb.thick(N[0]+8,N[1]+6,N[0]+26,N[1]+15,3,(u,v)=>tone(0x8a8696,v<.5?.2:-.1))}else{pb.para([N[0]-26,N[1]+18],[28,14],[4,-8],(u,v)=>tone(0x7a7684,v>.8?.2:-.1))}
  pb.outline(0x0e0c14);return{cv:pb.canvas(),ox:N[0]+3,oy:N[1]+25,r:14}}
function propCandles(seed){const R=mulberry(seed),pb=new PB(26,24),fl=[];for(let i=0;i<5;i++){const x=4+R()*18|0,h=4+R()*8|0,y=22;pb.rect(x,y-h,2,h,(ii)=>ii?0xc8c0ac:0xf0e8d4);fl.push([x-13+1,y-h-1-20])}pb.ell(13,21,11,3,(nx,ny,px,py)=>pb.has(px,py)?null:0xd8d0bc);pb.outline(0x1a1418);return{cv:pb.canvas(),ox:13,oy:20,flames:fl,r:6}}
function propSkullPile(seed){const R=mulberry(seed),pb=new PB(40,32);const sk=(x,y)=>{pb.ell(x,y,4.2,3.8,(nx,ny)=>tone(0xd8d0bc,.25-(nx*.4+ny*.5)));pb.rect(x-2.4,y,2,2,0x1a1218);pb.rect(x+.6,y,2,2,0x1a1218);pb.rect(x-1,y+2.6,3,1,0x3a2e2e)};for(let row=0;row<3;row++)for(let i=0;i<4-row;i++)sk(8+i*8+row*4+(R()-.5)*2,26-row*6+(R()-.5)*2);pb.outline(0x1a1218);return{cv:pb.canvas(),ox:20,oy:28,r:12}}
function propAltar(){const pb=new PB(80,70);const N=[40,26];isoBox(pb,[N[0],N[1]+16],1.4,.9,18,(u,v,px,py)=>(u>.15&&u<.85&&v>.2&&v<.8)?((Math.floor(u*8)+Math.floor(v*6))%2?0x4a2a5a:0x3a1e4a):tone(0x7a7684,.2),(u,v,px,py)=>(u>.35&&u<.65&&v>.3)?0x3a1e4a:tone(bricks(u*45,v*18,6,11,4,0x6a6674,0x5a5664,0x2a2632),.05),(u,v,px,py)=>tone(bricks(u*29,v*18,6,11,5,0x6a6674,0x5a5664,0x2a2632),-.45));
  pb.ell(N[0]+4,N[1]+4,6,6,(nx,ny)=>nx<-.2&&ny<-.2?0xffffff:tone(0xb07aff,-(nx*.3+ny*.3)));pb.outline(0x0e0c14);return{cv:pb.canvas(),ox:N[0]+3,oy:N[1]+34,light:[4,-30],r:16}}
function propPalisade(seed,axis){const pb=new PB(40,64),cx=20,cy=56;const A=axis==='x'?[cx-16,cy-8]:[cx+16,cy-8],B=axis==='x'?[cx+16,cy+8]:[cx-16,cy+8];const n=6;
  for(let i=0;i<=n;i++){const t=i/n,x=A[0]+(B[0]-A[0])*t,y=A[1]+(B[1]-A[1])*t,h=40+(hash(i,seed,3)*6|0);for(let j=0;j<h;j++){const top=j>h-5;const w=top?Math.max(0,2-(j-(h-5))*.5):2.5;for(let k=-w;k<=w;k++)pb.set(x+k,y-j,tone(k<0?0x7a5638:0x5a3e28,top?.15:(k>1?-.3:0)))}}
  pb.thick(A[0],A[1]-14,B[0],B[1]-14,2,()=>0x3a2818);pb.thick(A[0],A[1]-30,B[0],B[1]-30,2,()=>0x3a2818);pb.outline(0x140c08);return{cv:pb.canvas(),ox:cx,oy:cy,tall:1}}
function propTower(seed){const pb=new PB(80,150),cx=40,base=144;const posts=[[-22,-4],[22,-4],[-10,6],[10,-14]];
  for(const [dx,dy] of posts)pb.thick(cx+dx,base+dy,cx+dx*.8,base+dy-90,4,(u,v)=>v<.5?0x7a5638:0x4a3220);pb.thick(cx-22,base-30,cx+22,base-60,2,()=>0x4a3220);pb.thick(cx+22,base-30,cx-22,base-60,2,()=>0x4a3220);
  isoBox(pb,[cx,base-106],1.1,1.1,8,(u,v,px,py)=>((px+py)%5?0x7a5a3a:0x5a3e28),(u,v)=>(Math.floor(u*8)%2?0x6a4a2e:0x5a3e28),(u,v)=>tone(0x5a3e28,-.4));
  for(let i=0;i<5;i++){const x=cx-30+i*15;pb.rect(x,base-128,2,14,0x5a3e28)}
  pb.tri([cx-40,base-118],[cx+40,base-118],[cx,base-146],(u,v)=>u>v?tone(0x8a7a4a,-.3):0x9a8a52);pb.outline(0x140c08);return{cv:pb.canvas(),ox:cx,oy:base-4,tall:1,r:20}}
function propBanner(seed,col){const pb=new PB(24,70),cx=8;pb.rect(cx,6,2,62,(i)=>i?0x4a3220:0x7a5638);pb.rect(cx-1,4,4,3,0xc8a050);pb.para([cx+2,8],[12,0],[0,30],(u,v)=>{if(v>.85&&Math.abs(u-.5)>(1-v)*3)return null;let c=tone(col,.15-u*.4);if(Math.hypot(u-.5,(v-.4)*1.4)<.25)c=0xd8d0bc;if(Math.hypot(u-.5,(v-.4)*1.4)<.25&&Math.abs(v-.42)<.05&&Math.abs(u-.5)>.07)c=0x1a1218;return c});pb.outline(0x140c08);return{cv:pb.canvas(),ox:cx+1,oy:66,r:3}}
function propDrum(){const pb=new PB(30,30),cx=15;for(let y=8;y<26;y++){const half=10+Math.sin((y-8)/18*Math.PI)*1.2;for(let x=Math.floor(cx-half);x<Math.ceil(cx+half);x++){const f=(x-(cx-half))/(half*2);let c=f<.3?0x9a6a40:f<.7?0x7a5232:0x4a3226;if(y===12||y===22)c=0xd8d0bc;pb.set(x,y,c)}}pb.ell(cx,8,10,3.4,(nx,ny)=>tone(0xc8b088,.1-ny*.3));pb.line(cx+6,2,cx+2,7,0x5a3e28);pb.outline(0x140c08);return{cv:pb.canvas(),ox:cx,oy:25,r:9}}
function propGate(){const pb=new PB(120,130),cx=60,base=118;for(const dx of [-34,34]){pb.thick(cx+dx,base+dx*.25,cx+dx,base+dx*.25-100,9,(u,v)=>v<.4?0x7a5638:v<.75?0x5a3e28:0x3a2818);pb.tri([cx+dx-6,base+dx*.25-100],[cx+dx+6,base+dx*.25-100],[cx+dx,base+dx*.25-112],()=>0x7a5638)}
  pb.thick(cx-40,base-92-8,cx+40,base-92+8,7,(u,v)=>v<.5?0x6a4a2e:0x3a2818);pb.ell(cx,base-96,8,7,(nx,ny)=>tone(0xd8d0bc,.2-(nx*.4+ny*.5)));pb.rect(cx-4,base-96,3,3,0x1a1218);pb.rect(cx+2,base-96,3,3,0x1a1218);
  for(const [x,c] of [[cx-26,0x8a2a2a],[cx+18,0x5a2a6a]])pb.para([x,base-86],[8,4],[0,26],(u,v)=>tone(c,.1-u*.3));pb.outline(0x140c08);return{cv:pb.canvas(),ox:cx,oy:base,tall:1}}
function propCellar(){const pb=new PB(48,34);pb.para([6,20],[30,-12],[10,10],(u,v,px,py)=>{if(Math.abs(u-.5)<.03)return 0x1a1a22;let c=(Math.floor(u*6)&1)?0x4a4a56:0x3e3e4a;if(v<.1||v>.9||u<.05||u>.95)c=0x2a2a34;return tone(c,.15-v*.3)});pb.ell(23,20,3.6,3.2,(nx,ny)=>tone(0xd8d0bc,.15-(nx*.3+ny*.4)));pb.set(22,20,0x1a1218);pb.set(24,20,0x1a1218);pb.thick(6,20,16,30,2,()=>0x5a5a66);pb.outline(0x0e0c12);return{cv:pb.canvas(),ox:22,oy:26}}
// ---------- organic rock walls, glow plants, camp props ----------
const ROCK_CAVE=[0xa08a74,0x7e6a58,0x5e4e42,0x44382e,0x2a221c],ROCK_SANCT=[0x6a8aa0,0x4e6a82,0x3a5068,0x283a50,0x18243a];
function propRockWall(seed,tall,deco,pal){const R=mulberry(seed),ht=tall?58+R()*14:14,W=48,H=Math.ceil(ht)+34,pb=new PB(W,H),cx=24,base=H-12;let flame=null,light=null;
  const layers=tall?5:1;for(let l=0;l<layers;l++){const n=l===0?3:2;for(let i=0;i<n;i++){const bx=cx+(R()-.5)*14,by=base-l*(ht/layers)-(R()*4),rx=(19-l*1.6)*(.8+R()*.3),ry=9*(.8+R()*.3);
    pb.ell(bx,by,rx,ry,(nx,ny,px,py)=>{vor(px/6,py/5,seed+l*7+i);let L=-(nx*.5+ny*.75)+(VO.id-.5)*.5;if(VO.f2-VO.f1<.07)L-=.35;let c=pal[L>.5?0:L>.12?1:L>-.25?2:L>-.62?3:4];if(ny<-.5&&hash(px>>1,py>>1,seed)<.15)c=mix(c,pal===ROCK_CAVE?0x5a6a3a:0x4ad0c0,.5);return c})}}
  if(deco==='beam'&&tall){pb.rect(cx-14,base-50,4,46,(i)=>i<2?0x8a6a44:0x5a4028);pb.rect(cx+10,base-44,4,40,(i)=>i<2?0x7a5a3a:0x4a3420);pb.thick(cx-16,base-50,cx+16,base-44,4,(u,v)=>v<.5?0x8a6a44:0x4a3420)}
  if(deco==='torch'&&tall){const x=cx-6,y=base-26;pb.rect(x,y,2,9,0x6a4428);pb.rect(x-1,y+2,4,1,0x3a3a44);flame=[x+1-cx,y-1-base+12]}
  if(deco==='crystal'){const x=cx-4+R()*8,y=base-(tall?20:6);for(let k=0;k<3;k++){const h=10+R()*12,ox=(k-1)*5;pb.tri([x+ox-3,y],[x+ox+3,y],[x+ox+(R()-.5)*3,y-h],(u,v)=>u>v?0x6ad8ff:0xc8f4ff)}light=[x-cx,y-8-base+12]}
  pb.outline(0x0e0a0a);return{cv:pb.canvas(),ox:cx,oy:base-12+12,tall:tall?1:0,flame,light}}
function propGlowPlant(seed,col,lit){const R=mulberry(seed),pb=new PB(26,30),cx=13,base=27;for(let i=0;i<4;i++){const a=-Math.PI/2+(i-1.5)*.5;pb.thick(cx,base,cx+Math.cos(a)*9,base+Math.sin(a)*12,2,(u,v)=>v<.5?0x3a6a4a:0x24443a)}
  const pods=[[cx-6,base-12],[cx+5,base-14],[cx,base-18],[cx-2,base-8],[cx+7,base-7]];for(const [x,y] of pods){pb.ell(x,y,2.6,2.6,(nx,ny)=>lit?(nx*nx+ny*ny<.3?0xffffff:mix(col,0xffffff,.45)):tone(col,-.25-(nx*.3+ny*.3)*.4))}
  pb.outline(lit?tone(col,-.3):0x0e1612);return{cv:pb.canvas(),ox:cx,oy:base,r:5}}
function propPortalBase(){const pb=new PB(56,30),cx=28,cy=15;pb.ell(cx,cy,26,12,(nx,ny,px,py)=>{const r=Math.hypot(nx,ny);if(r>.86)return tone(0x5a5a6a,.1-ny*.3);if(r>.74)return (Math.atan2(ny,nx)*6|0)%2?0x9ad8ff:0x3a4a6a;return null});pb.outline(0x101018);return{cv:pb.canvas(),ox:cx,oy:cy}}
function propLantern(){const pb=new PB(18,44),cx=8;pb.rect(cx,12,2,30,(i)=>i<1?0x5a5a66:0x2a2a34);pb.rect(cx-2,40,6,3,0x2a2a34);pb.rect(cx,10,7,2,0x3a3a44);pb.rect(cx+5,12,1,3,0x3a3a44);pb.rect(cx+2,15,8,2,0x2a2a34);pb.rect(cx+3,17,6,8,(i,j)=>j<1||j>6?0x2a2a34:(i===0||i===5)?0x3a3a44:j<4?0xe8fff0:0x9ae8c8);pb.rect(cx+2,25,8,2,0x2a2a34);pb.rect(cx+5,27,2,1,0x2a2a34);pb.outline(0x0c0a10);return{cv:pb.canvas(),ox:cx,oy:42}}
function propTorchPost(){const pb=new PB(12,56),cx=6;pb.rect(cx-1,10,3,44,(i)=>i<1?0x8a6644:0x4a3220);pb.rect(cx-2,8,5,3,0x3a3a44);pb.rect(cx-1,4,3,5,0x6a4428);pb.outline(0x140c08);return{cv:pb.canvas(),ox:cx,oy:53,fire:[0,-50]}}
function propBedroll(seed,col){const pb=new PB(44,24);pb.para([4,12],[30,10],[6,-6],(u,v,px,py)=>u<.18?tone(0xd8d0bc,.1-v*.2):tone(col,(Math.floor(u*10)&1?.05:-.1)-v*.25));pb.outline(0x140c0a);return{cv:pb.canvas(),ox:22,oy:16}}
function propLog(){const pb=new PB(40,22);pb.thick(5,14,34,8,7,(u,v)=>v<.3?0x8a6644:v<.7?0x6a4a30:0x3e2a1c);pb.ell(34,8,3.4,3.6,(nx,ny)=>nx*nx+ny*ny<.35?0xb08a5a:0x8a6644);pb.outline(0x140c08);return{cv:pb.canvas(),ox:20,oy:14,r:9}}
function propStandingStone(seed){const R=mulberry(seed),h=26+R()*14,pb=new PB(26,Math.ceil(h)+10),cx=13,base=Math.ceil(h)+6;for(let y=0;y<h;y++){const t=y/h,half=6-t*2.2+Math.sin(y*.7+seed)*.6;for(let x=Math.floor(cx-half);x<=cx+half;x++){vor(x/5,y/5,seed);let c=[0xa8a8b4,0x82828e,0x60606e][x<cx-1?0:x<cx+2?1:2];if(VO.f2-VO.f1<.08)c=tone(c,-.3);if(hash(x>>1,y>>1,seed)<.12)c=mix(c,0x5a7a4a,.5);if(Math.abs(y-h*.55)<1.2&&Math.abs(x-cx)<3)c=0x6ad8ff;pb.set(x,base-y,c)}}pb.outline(0x16141c);return{cv:pb.canvas(),ox:cx,oy:base,r:7,tall:1}}
function propCrystal(seed,col){const R=mulberry(seed),pb=new PB(30,44),cx=15,base=40;for(let k=0;k<4;k++){const h=14+R()*20,ox=(k-1.5)*5,lean=(R()-.5)*6;pb.tri([cx+ox-3.5,base],[cx+ox+3.5,base],[cx+ox+lean,base-h],(u,v)=>u>v?col:mix(col,0xffffff,.55))}pb.outline(tone(col,-.6));return{cv:pb.canvas(),ox:cx,oy:base,r:6}}
