// ===================== utilities =====================
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rnd=(a,b)=>a+Math.random()*(b-a);
const rint=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const lerp=(a,b,t)=>a+(b-a)*t;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(x,y,s){let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul((s|0)+7,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296}
function vn(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const VO={f1:0,f2:0,id:0,dx:0,dy:0};
function vor(x,y,s){const xi=Math.floor(x),yi=Math.floor(y);let f1=9,f2=9,id=0,dx1=0,dy1=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx=xi+i,cy=yi+j,px=cx+.15+hash(cx,cy,s)*.7,py=cy+.15+hash(cx,cy,s+1)*.7,dx=x-px,dy=y-py,d=dx*dx+dy*dy;if(d<f1){f2=f1;f1=d;id=hash(cx,cy,s+2);dx1=dx;dy1=dy}else if(d<f2)f2=d}VO.f1=Math.sqrt(f1);VO.f2=Math.sqrt(f2);VO.id=id;VO.dx=dx1;VO.dy=dy1}
// colors are ints 0xRRGGBB
function mix(a,b,t){t=t<0?0:t>1?1:t;const ar=a>>16&255,ag=a>>8&255,ab=a&255;return((ar+((b>>16&255)-ar)*t)<<16)|((ag+((b>>8&255)-ag)*t)<<8)|((ab+((b&255)-ab)*t)|0)}
function mul(c,f){const r=Math.min(255,(c>>16&255)*f),g=Math.min(255,(c>>8&255)*f),b=Math.min(255,(c&255)*f);return(r<<16)|(g<<8)|(b|0)}
function tone(c,l){return l>=0?mix(c,0xfff2d2,l*.42):mix(mul(c,1+l*.4),0x1e2654,-l*.32)}
const hex=c=>'#'+((c&0xffffff)|0x1000000).toString(16).slice(1);
function mk(w,h){const c=document.createElement('canvas');c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x]}
// pixel buffer painter
class PB{
  constructor(w,h){this.w=Math.max(1,w|0);this.h=Math.max(1,h|0);this.d=new Uint32Array(this.w*this.h)}
  set(x,y,c){x|=0;y|=0;if(x<0||y<0||x>=this.w||y>=this.h)return;this.d[y*this.w+x]=0xff000000|((c&255)<<16)|(c&0xff00)|((c>>16)&255)}
  has(x,y){x|=0;y|=0;return x>=0&&y>=0&&x<this.w&&y<this.h&&(this.d[y*this.w+x]>>>24)>0}
  get(x,y){x|=0;y|=0;if(!this.has(x,y))return-1;const v=this.d[y*this.w+x];return((v&255)<<16)|(v&0xff00)|((v>>16)&255)}
  clear(x,y){x|=0;y|=0;if(x>=0&&y>=0&&x<this.w&&y<this.h)this.d[y*this.w+x]=0}
  rect(x,y,w,h,f){x=Math.round(x);y=Math.round(y);for(let j=0;j<h;j++)for(let i=0;i<w;i++){const c=typeof f==='function'?f(i,j,x+i,y+j):f;if(c!=null&&c>=0)this.set(x+i,y+j,c)}}
  para(O,U,V,f,u0=0,u1=1,v0=0,v1=1){const det=U[0]*V[1]-U[1]*V[0];if(Math.abs(det)<1e-6)return;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [u,v] of [[u0,v0],[u1,v0],[u0,v1],[u1,v1]]){const px=O[0]+U[0]*u+V[0]*v,py=O[1]+U[1]*u+V[1]*v;if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py}
    for(let py=Math.floor(y0);py<=Math.ceil(y1);py++)for(let px=Math.floor(x0);px<=Math.ceil(x1);px++){const dx=px+.5-O[0],dy=py+.5-O[1],u=(dx*V[1]-dy*V[0])/det,v=(U[0]*dy-U[1]*dx)/det;if(u<u0||u>u1||v<v0||v>v1)continue;const c=f(u,v,px,py);if(c!=null&&c>=0)this.set(px,py,c)}}
  tri(A,B,C,f){this.para(A,[B[0]-A[0],B[1]-A[1]],[C[0]-A[0],C[1]-A[1]],(u,v,px,py)=>u+v<=1?f(u,v,px,py):null)}
  ell(cx,cy,rx,ry,f){if(rx<=0||ry<=0)return;for(let py=Math.floor(cy-ry);py<=Math.ceil(cy+ry);py++)for(let px=Math.floor(cx-rx);px<=Math.ceil(cx+rx);px++){const nx=(px+.5-cx)/rx,ny=(py+.5-cy)/ry;if(nx*nx+ny*ny<=1){const c=typeof f==='function'?f(nx,ny,px,py):f;if(c!=null&&c>=0)this.set(px,py,c)}}}
  line(x0,y0,x1,y1,c,w=1){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy,n=0;for(;n<400;n++){if(w<=1)this.set(x0,y0,typeof c==='function'?c(n):c);else this.rect(x0-(w>>1),y0-(w>>1),w,w,typeof c==='function'?c(n):c);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
  thick(x0,y0,x1,y1,w,f){const L=Math.hypot(x1-x0,y1-y0)||1,nx=-(y1-y0)/L,ny=(x1-x0)/L;const O=[x0-nx*w/2,y0-ny*w/2];this.para(O,[x1-x0,y1-y0],[nx*w,ny*w],(u,v,px,py)=>f(u,v,px,py))}
  outline(c){const w=this.w,h=this.h,o=new Uint8Array(w*h);for(let i=0;i<w*h;i++)o[i]=(this.d[i]>>>24)?1:0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(o[i])continue;if((x>0&&o[i-1])||(x<w-1&&o[i+1])||(y>0&&o[i-w])||(y<h-1&&o[i+w]))this.set(x,y,c)}}
  flipX(){const w=this.w;for(let y=0;y<this.h;y++){const r=y*w;for(let x=0;x<w>>1;x++){const t=this.d[r+x];this.d[r+x]=this.d[r+w-1-x];this.d[r+w-1-x]=t}}return this}
  canvas(){const [c,x]=mk(this.w,this.h);const id=x.createImageData(this.w,this.h);new Uint32Array(id.data.buffer).set(this.d);x.putImageData(id,0,0);return c}
}
function whiteOf(c){if(c._w)return c._w;const [d,x]=mk(c.width,c.height);x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);c._w=d;return d}
const wpx=(x,y)=>[(x-y)*32,(x+y)*16];
const toTile=(sx,sy)=>[(sx/32+sy/16)/2,(sy/16-sx/32)/2];
// screen angle from tile-space delta
const scrAng=(dx,dy)=>Math.atan2((dx+dy)*16,(dx-dy)*32);
const dir8=a=>(((Math.round((Math.PI/2-a)/(Math.PI/4))%8)+8)%8);
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return Math.abs(d)};
