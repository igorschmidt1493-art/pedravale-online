import sys,glob
parts=sorted(glob.glob('0*.js'))
js='\n'.join(open(p).read() for p in parts)
mode=sys.argv[1] if len(sys.argv)>1 else 'final'
js='const NET_WS='+('true' if mode=='server' else 'false')+';\n'+js
if len(sys.argv)>1 and sys.argv[1]=='test':
    js+="\nwindow.__dbg={get P(){return P},get M(){return M},MAPS,mobs,changeMap,setTime:v=>{TIME=v},gainExp,get state(){return state},PB,makeBuilding,drawHumanoid,playerLook,npcs,talk,interact,interactables,useSkill,doDash,spawnMob,get loots(){return loots},get teles(){return teles},startGame,talk:n=>talk(n),hitMobDbg:m=>hitMob(m,99,{}),tip:it=>itemTipHTML(it),revive:()=>revive(),MLOOK,charFrame,slotOf:id=>BASES[id].slot,makeItem,equipFromInv,zones,projs,fx,D,CB,SPR,entFrame,toggleTree,learnNode,assign,TREE,BASES,FIELDS,toggleWorldMap,EVO,SKILLS,useSkill:k=>useSkill(k),skCode,evoMenu,rankUp,skPoints,EV,startEvent,endEvent,refineMenu,doRefine,petMenu,alchemyMenu,get pet(){return pet},fKey,toggleAch,PS,ACH,achCheck,startFish,reelFish,waterSpot,mineNode,usePotion,addItem};"
shell=open('shell.html').read()
out=shell.replace('/*JS*/',js)
if len(sys.argv)>1 and sys.argv[1] in ('test','standalone','server'):out='<!doctype html>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'+out
open(sys.argv[2] if len(sys.argv)>2 else 'pedravale.html','w').write(out)
open('all.js','w').write("'use strict';(()=>{"+js+"})();")
print(len(out))
