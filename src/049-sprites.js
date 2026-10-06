// ===================== sprite-sheet characters (replaces procedural drawing where a sheet exists) =====================
// sheet rows: 0 S · 1 SW · 2 W · 3 NW · 4 N ; SE/E/NE are mirrored. Anchor = bottom-centre of the cell.
const SPR={};
// game dir8: 0 S,1 SE,2 E,3 NE,4 N,5 NW,6 W,7 SW  ->  [row, mirrored]
const SPR_DIR=[[0,0],[1,1],[2,1],[3,1],[4,0],[3,0],[2,0],[1,0]];
const SPR_CLASS={g:'warrior'};
function loadSprites(){for(const name in SPRITE_SHEETS){const S=SPRITE_SHEETS[name],o={ready:0,frames:{},cw:S.cw,ch:S.ch,count:S.frames};SPR[name]=o;let left=Object.keys(S.src).length;
  for(const anim in S.src){const img=new Image();img.onload=()=>{const n=S.frames[anim],rows=[];for(let r=0;r<5;r++){const row=[];for(let i=0;i<n;i++){const [c,x]=mk(S.cw,S.ch);x.imageSmoothingEnabled=false;x.drawImage(img,i*S.cw,r*S.ch,S.cw,S.ch,0,0,S.cw,S.ch);const [cm,xm]=mk(S.cw,S.ch);xm.imageSmoothingEnabled=false;xm.translate(S.cw,0);xm.scale(-1,1);xm.drawImage(c,0,0);
        row.push([{cv:c,ax:S.cw/2,ay:S.ch-2},{cv:cm,ax:S.cw/2,ay:S.ch-2}])}rows.push(row)}o.frames[anim]=rows;if(--left===0){o.ready=1;if(typeof P!=='undefined'&&P){P.look=playerLook(P)}}};img.src=S.src[anim]}}}
const sprReady=n=>SPR[n]&&SPR[n].ready;
function sprFrameFor(e){const S=SPR[e.look.sprite],d=e.spinT>0?Math.floor(T*30)%8:((e.d8||0)&7),[row,mir]=SPR_DIR[d],a=e.anim||'idle';let anim='idle',i=0;
  if((a==='atk'||a==='cast'||a==='bow')&&e.atkDur>0&&e.atkT>0){anim='attack';i=Math.min(S.count.attack-1,Math.max(0,Math.floor((1-e.atkT/e.atkDur)*S.count.attack)))}
  else if(a==='walk'||a==='dash'){anim='walk';i=Math.floor((e.animT!=null&&e.type==='pc'?e.animT*11:T*11+(e.x||0)))%S.count.walk}
  else{anim='idle';i=Math.floor(T*5+(e.x||0)*.7)%S.count.idle}
  return S.frames[anim][row][(i+S.count[anim])%S.count[anim]][mir]}
const entFrame=(e,dir,anim,frame)=>e.look&&e.look.sprite&&sprReady(e.look.sprite)?sprFrameFor(e):charFrame(e.look,dir,anim,frame);
{const _pl=playerLook;playerLook=function(p){const L=_pl(p);if(p&&SPR_CLASS[p.cls]){L.sprite=SPR_CLASS[p.cls];delete L._k}return L}}
loadSprites();
