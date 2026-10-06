import numpy as np
from PIL import Image
from scipy import ndimage
SHEETS=[('idle','warrior_idle_src.png',4),('walk','warrior_walk_src.png',9),('attack','warrior_attack_src.png',8)]
def clean(a,attack=False):
    a=a.copy();al=a[:,:,3]
    r,g,b=[a[:,:,i].astype(int) for i in range(3)]
    kill=al<200
    if attack:  # bluish-white slash glow
        kill|=((b>170)&(b>r+25)&((r+g+b)/3>140))|((np.minimum(np.minimum(r,g),b)>232)&(b>=r))
    a[kill]=0;a[~kill,3]=255;return a
def peaks(proj,k):
    # pick k centers by splitting into k groups via kmeans on mass positions
    xs=np.repeat(np.arange(len(proj)),proj.astype(int))
    if len(xs)>200000: xs=xs[::len(xs)//200000+1]
    c=np.linspace(xs.min(),xs.max(),k)
    for _ in range(60):
        lab=np.argmin(np.abs(xs[:,None]-c[None,:]),1)
        c=np.array([xs[lab==i].mean() if (lab==i).any() else c[i] for i in range(k)])
    return np.sort(c)
out={}
for name,f,k in SHEETS:
    a=np.array(Image.open(f).convert('RGBA'));a=clean(a,name=='attack');m=a[:,:,3]>0
    # rows by vertical gaps
    rows=m.sum(1);runs=[];s=None
    for i,v in enumerate(rows>0):
        if v and s is None:s=i
        if not v and s is not None:
            if i-s>40:runs.append((s,i))
            s=None
    if s is not None:runs.append((s,len(rows)))
    # merge tiny gaps -> expect 5
    while len(runs)>5:
        gaps=[runs[i+1][0]-runs[i][1] for i in range(len(runs)-1)];j=int(np.argmin(gaps));runs[j]=(runs[j][0],runs[j+1][1]);del runs[j+1]
    assert len(runs)==5,(name,runs)
    frames=[]
    for (y0,y1) in runs:
        band=m[y0:y1]
        # body mass only (exclude thin effects) for centers
        c=peaks(band.sum(0),k);bounds=[0]+[int((c[i]+c[i+1])/2) for i in range(k-1)]+[a.shape[1]]
        row=[]
        for i in range(k):
            sub=a[y0:y1,bounds[i]:bounds[i+1]];sm=sub[:,:,3]>0
            lab,n=ndimage.label(ndimage.binary_dilation(sm,iterations=2))
            if n>1:
                sizes=ndimage.sum(sm,lab,range(1,n+1));big=np.argmax(sizes)+1;keep=sm&(lab==big)
                sub=sub.copy();sub[~keep]=0;sm=keep
            ys,xs=np.nonzero(sm)
            feet=ys.max();fx=xs[ys>feet-12].mean()
            yA,xA=ys.min(),xs.min();sub=sub[yA:feet+1,xA:xs.max()+1]
            row.append((sub,feet-yA,fx-xA,0,0,0))
        frames.append(row)
    out[name]=frames
# scale: body height of front idle frames -> 62 px
def h(fr):return np.median([f[1]-f[3] for f in fr[0]])
target=56
res={}
for name,frames in out.items():
    sc=target/h(frames);cells=[]
    for row in frames:
        rr=[]
        for sub,feet,fx,top,x0,x1 in row:
            im=Image.fromarray(sub);W=max(1,round(im.width*sc));H=max(1,round(im.height*sc))
            sm=im.resize((W,H),Image.BOX);arr=np.array(sm);arr[arr[:,:,3]<110]=0;arr[arr[:,:,3]>=110,3]=255
            rr.append((arr,feet*sc,fx*sc))
        cells.append(rr)
    res[name]=cells
# uniform cell size over all sheets
CW=0;CH=0
for name,cells in res.items():
    for row in cells:
        for arr,feet,fx in row:
            CW=max(CW,2*max(fx,arr.shape[1]-fx));CH=max(CH,feet)
CW=int(np.ceil(CW))+4;CH=int(np.ceil(CH))+4
print('cell',CW,CH)
meta={}
for name,cells in res.items():
    k=len(cells[0]);sheet=Image.new('RGBA',(CW*k,CH*5),(0,0,0,0))
    for r,row in enumerate(cells):
        for i,(arr,feet,fx) in enumerate(row):
            ox=int(round(i*CW+CW/2-fx));oy=int(round(r*CH+CH-2-feet))
            sheet.alpha_composite(Image.fromarray(arr),(max(0,ox),max(0,oy)))
    sheet.save(f'warrior_{name}.png',optimize=True);meta[name]=k
print(meta,CW,CH)
import json;json.dump({'cw':CW,'ch':CH,'frames':meta},open('meta.json','w'))
