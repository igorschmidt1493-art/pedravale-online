// ===================== combat feel: classic MMORPG hit sparks, bouncing damage numbers, punchy sounds =====================
function hitSnd(o){const w=P&&P.eq&&P.eq.arma&&BASES[P.eq.arma.id];if(o.melee===undefined&&P&&(P.cls==='a'))return'hita';if(P&&(P.cls==='m'))return'hitm';if(w&&(w.wt==='mace'||w.wt==='club'||w.wt==='greatsword'))return'hitb';return'hit'}
function hitFx(m,crit,o){const el=o.el||(P?clsEl(P):null),col=crit?'#ffe36a':(ELSL[el]||'#ffffff');fx.push({type:'hitfx',x:m.x,y:m.y,t:0,life:crit?.3:.2,crit,col,rot:Math.random()*.8,glow:1,small:!!o.quiet});
  if(!m.def.boss&&m.def.ai!=='dummy'){m.flinch=.16;if(!o.quiet)m.stunT=Math.max(m.stunT||0,.1)}else m.flinch=.1;if(crit){hitstop=Math.max(hitstop,.06);shake=Math.max(shake,.16)}}
function drawHitFx(f,k){const [x,y]=iso(f.x,f.y),cy=y-16,s=(f.small?.6:1)*(f.crit?1.5:1),R=(8+k*16)*s;b.save();b.translate(Math.round(x),Math.round(cy));b.rotate(f.rot);b.globalAlpha=1-k;
  b.fillStyle='#ffffff';const spikes=f.crit?8:4;b.beginPath();for(let i=0;i<spikes*2;i++){const a=i/(spikes*2)*Math.PI*2,r=i%2?R*.22:R*(i%4===0?1:.7);b.lineTo(Math.cos(a)*r,Math.sin(a)*r)}b.closePath();b.fill();
  b.globalAlpha=(1-k)*.85;b.fillStyle=f.col;b.beginPath();b.arc(0,0,R*.32*(1-k*.5),0,7);b.fill();
  b.strokeStyle=f.col;b.lineWidth=f.crit?2:1;b.globalAlpha=(1-k)*.7;for(let i=0;i<6;i++){const a=i/6*6.283+.3,r0=R*.45,r1=R*1.25;b.beginPath();b.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);b.lineTo(Math.cos(a)*r1,Math.sin(a)*r1);b.stroke()}
  b.restore();b.globalAlpha=1;b.lineWidth=1}
function drawDmgNum(t,fs,toD){const k=t.t/t.life,tt=Math.min(t.t,1.2),dir=t.vx>=0?1:-1;
  const [dx,dy]=toD(t.wx+dir*(10+26*tt),t.wy-14-150*tt+190*tt*tt);const crit=t.big,pop=t.t<.1?1.7-t.t*7:1,sz=Math.round(fs*(crit?1.75:1.35)*pop);
  vx.globalAlpha=k>.75?(1-k)/.25:1;
  if(crit){const R=sz*1.05;vx.save();vx.translate(dx,dy-sz*.35);vx.rotate(t.t*2);vx.fillStyle='#d8301a';vx.beginPath();for(let i=0;i<20;i++){const a=i/20*Math.PI*2,r=i%2?R*.55:R;vx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}vx.closePath();vx.fill();vx.fillStyle='#ff9a2a';vx.beginPath();for(let i=0;i<20;i++){const a=i/20*Math.PI*2+.15,r=i%2?R*.4:R*.72;vx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}vx.closePath();vx.fill();vx.restore()}
  vx.font=`700 ${sz}px "Pixelify Sans", monospace`;vx.lineJoin='round';vx.lineWidth=Math.max(3,sz/3.2);vx.strokeStyle=crit?'#3a0a00':'#1a0e0a';vx.strokeText(t.txt,dx,dy);
  const gr=vx.createLinearGradient(0,dy-sz,0,dy);if(crit){gr.addColorStop(0,'#fffbd0');gr.addColorStop(1,'#ffc21a')}else if(t.col==='#ffffff'){gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#d8d0c0')}else{gr.addColorStop(0,t.col);gr.addColorStop(1,t.col)}
  vx.fillStyle=gr;vx.fillText(t.txt,dx,dy);vx.globalAlpha=1}
// ===================== level-gap balance (stops kiting monsters far above your level) =====================
const isRangedHit=o=>!o.melee&&P&&(P.cls==='a'||P.cls==='m'||o.el==='song');
function lvGap(m){return(m.lv||1)-(P?P.lv:1)}
function lvPen(m,o){const g=lvGap(m);if(g<=2)return 1;return Math.max(.25,1-.07*(g-2)-(isRangedHit(o)?.03*(g-2):0))}
function lvMiss(m,o){const g=lvGap(m);if(g<=2||m.def.ai==='dummy')return false;const ch=Math.min(.6,.06*(g-2)+(isRangedHit(o)?.04*(g-2):0));if(Math.random()<ch){if(!o.quiet){addText(m,'Errou','#cfc6b8');sfx('swing')}if(isRangedHit(o))rangedProvoke(m);return true}if(isRangedHit(o))rangedProvoke(m);return false}
function rangedProvoke(m){if(m.def.boss||m.def.ai==='dummy'||!P)return;const dd=Math.hypot(m.x-P.x,m.y-P.y);if(dd<4.5)return;m.target=P;m.ret=false;const g=lvGap(m);m.buffT=Math.max(m.buffT||0,g>=3?5:2.5);
  if(g>=3&&!(m.lungeCD>T)&&dd>5&&dd<11){m.lungeCD=T+6;const a=Math.atan2(P.y-m.y,P.x-m.x),st=Math.min(dd-1.6,3.2);let nx=m.x+Math.cos(a)*st,ny=m.y+Math.sin(a)*st;if(!blockedAt(M,nx,ny,.3)){ghostFx(m,'#ff8a6a');m.x=nx;m.y=ny;addText(m,'Avança!','#ff8a6a');dust(m.x,m.y,6)}}}
