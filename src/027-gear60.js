// ===================== gear tiers 20 → 60 (one full set per class every 5 levels) =====================
const GEAR_TIERS=[
  {lv:20,key:'gl',adj:'Glacial',reg:'gelvar',c1:0xbfe0f0,c2:0x5a8ab0,el:'frost'},
  {lv:25,key:'mm',adj:'de Mamute',reg:'gelvar',c1:0x8a6a4a,c2:0xe8dcc0,el:null},
  {lv:30,key:'sm',adj:'Samurai',reg:'kazemura',c1:0x8a2a2a,c2:0x1a1a22,el:null},
  {lv:35,key:'on',adj:'Oni',reg:'kazemura',c1:0x5a1a2a,c2:0xd8402a,el:'fire'},
  {lv:40,key:'su',adj:'do Sultão',reg:'qasr',c1:0xe8d8b0,c2:0xc8a040,el:null},
  {lv:45,key:'so',adj:'Solar',reg:'qasr',c1:0xffd06a,c2:0xd86a1a,el:'fire'},
  {lv:50,key:'an',adj:'Ancestral',reg:'aldeia',c1:0x3a6a3a,c2:0xd8c890,el:'poison'},
  {lv:55,key:'fr',adj:'da Fera Rubra',reg:'aldeia',c1:0x8a1a1a,c2:0x2a1a14,el:null},
  {lv:60,key:'dr',adj:'do Dragão',reg:null,c1:0x2a6a5a,c2:0xffd86a,el:'storm'}];
const GEAR_SETS={
  g:[['arma','Espada',{wt:'sword',as:.95,k:2.5,b:6,ic:'sword'}],['arma','Espadão',{wt:'greatsword',two:1,as:.62,k:4.6,b:8,ic:'sword',odd:1}],['escudo','Escudo',{sh:'kite',d:.9,ic:'shield'}],['cabeca','Elmo',{hd:['bascinet','winged','plumed','greathelm','kabuto'],d:1.1,ic:'greathelm'}],['peito','Armadura',{ct:'plate',d:2.1,b:6,ic:'plate'}],['pernas','Grevas',{d:.9,ic:'legs'}],['pes','Botas de Placa',{d:.5,ic:'boots'}],['maos','Manoplas',{d:.45,ic:'gloves'}]],
  a:[['arma','Arco',{wt:'bow',as:1.05,k:2.45,b:6,ic:'bow'}],['arma','Besta',{wt:'crossbow',as:.5,k:3.7,b:8,pierce:2,ic:'crossbow',odd:1}],['escudo','Aljava',{sh:'quiver',fixK:[['dmg',.25]],ic:'quiver'}],['cabeca','Capuz',{hd:['hood','coif','hood','furhat','hood'],d:.7,ic:'hood'}],['peito','Gibão',{ct:'leather',d:1.4,b:4,ic:'chest'}],['pernas','Perneiras',{d:.7,ic:'legs'}],['pes','Botas',{d:.45,fixK:[['speed',.12]],ic:'boots'}],['maos','Braçadeiras',{d:.4,fixK:[['crit',.08]],ic:'gloves'}]],
  m:[['arma','Cajado',{wt:'staff',as:.9,k:2.35,b:6,ic:'staff'}],['arma','Cetro',{wt:'wand',as:1.1,k:1.9,b:5,ic:'wand',odd:1}],['escudo','Tomo',{sh:'tome',fixK:[['mp',2],['skill',.25]],ic:'tome'}],['cabeca','Chapéu',{hd:['hat','crown','hat','turban','crown'],d:.5,fixK:[['int',.12]],ic:'hat'}],['peito','Manto',{ct:'robe',d:.9,b:2,fixK:[['mp',1.6]],ic:'robe'}],['pernas','Calças Bordadas',{d:.5,ic:'legs'}],['pes','Sandálias',{d:.4,fixK:[['mp',.8]],ic:'boots'}],['maos','Luvas Rúnicas',{d:.35,fixK:[['skill',.15]],ic:'gloves'}]],
  l:[['arma','Adaga',{wt:'dagger',as:1.25,k:2.05,b:6,ic:'dagger'}],['arma','Foice',{wt:'scythe',two:1,as:.78,k:3.6,b:8,ic:'scythe',odd:1}],['escudo','Adaga Secundária',{sh:'dagger',fixK:[['crit',.1]],ic:'dagger'}],['cabeca','Máscara',{hd:['assassin','assassin','wraps','assassin','assassin'],d:.6,ic:'hood'}],['peito','Couraça',{ct:'leather',d:1.25,b:4,ic:'chest'}],['pernas','Calças Sombrias',{d:.6,ic:'legs'}],['pes','Botas Silenciosas',{d:.45,fixK:[['speed',.1]],ic:'boots'}],['maos','Luvas de Lâmina',{d:.4,fixK:[['crit',.1]],ic:'gloves'}]]};
const GEAR_ACC=[['anel','Anel',[['for',.12],['des',.12]],'ring'],['anel','Selo',[['int',.12],['skill',.2]],'ring'],['colar','Amuleto',[['hp',3],['def',.3]],'amulet'],['colar','Pingente',[['dmg',.2],['crit',.08]],'amulet']];
const GEAR_SHOP={};
(function buildGear(){GEAR_TIERS.forEach((T,ti)=>{const L=T.lv,price=Math.round(55*Math.pow(L,1.55)/10)*10;
  for(const cls in GEAR_SETS)for(const [slot,base,o] of GEAR_SETS[cls]){if(o.odd&&ti%2===0&&L<60)continue;if(!o.odd&&slot==='arma'&&ti%2===1&&L<60)continue;
    const id=`g${L}_${cls}_${slot}${o.odd?'2':''}`,b={n:`${base} ${T.adj}`,t:'eq',slot,lv:L,buy:price*(slot==='arma'?2:slot==='peito'?1.6:1),ic:[o.ic,T.c1,T.c2]};
    if(slot!=='pernas'&&slot!=='pes'&&slot!=='maos'||cls)b.cls=cls;if(slot==='pernas'||slot==='pes'||slot==='maos')delete b.cls;
    if(o.wt){b.wt=o.wt;b.atk=Math.round(o.k*L+o.b);b.as=o.as;if(o.two)b.two=1;if(o.pierce)b.pierce=o.pierce;if(o.wt==='staff'||o.wt==='wand')b.orb=T.c2;if(T.el==='fire'&&cls==='g')b.fire=1;if(T.el==='frost'&&cls==='g')b.frost=1;if(T.el==='storm'&&cls==='g')b.storm=1}
    if(o.d)b.def=Math.round(o.d*L+(o.b||0));if(o.sh){b.sh=o.sh;b.col=T.c1}if(o.hd){b.hd=o.hd[ti%o.hd.length];b.col=T.c1;b.col2=T.c2}if(o.ct){b.ct=o.ct;b.col=T.c1;b.trim=T.c2}if(slot==='pernas'||slot==='pes'||slot==='maos')b.col=T.c1;
    if(o.sh==='quiver'&&T.el)b.arrow=T.el==='storm'?'frost':T.el;
    const fx=(o.fixK||[]).map(([a,k])=>[a,Math.max(1,Math.round(k*L))]);if(slot==='arma'||slot==='peito')fx.push([cls==='m'?'int':cls==='g'?'for':'des',Math.round(L/8)]);if(fx.length)b.fix=fx;
    if(L>=60){b.dropOnly=1;if(b.atk)b.atk=Math.round(b.atk*1.3);if(b.def)b.def=Math.round(b.def*1.3);b.lore='Forjado com escamas de dragão. Só cai dos chefes mais fortes.'}
    BASES[id]=b;if(T.reg&&(slot==='arma'||slot==='escudo'||slot==='peito'||slot==='cabeca'))(GEAR_SHOP[T.reg]=GEAR_SHOP[T.reg]||[]).push(id)}
  for(const [slot,base,fix,ic] of GEAR_ACC){const id=`g${L}_${slot}_${base}`;BASES[id]={n:`${base} ${T.adj}`,t:'eq',slot,lv:L,buy:price,fix:fix.map(([a,k])=>[a,Math.max(1,Math.round(k*L))]),ic:[ic,T.c1,T.c2]}}});
  for(const k in BASES){const b=BASES[k];if(b.t==='eq'&&/^g\d\d_/.test(k)&&!DROP_POOL.includes(k))DROP_POOL.push(k)}
  for(const reg in GEAR_SHOP)if(SHOP[reg])SHOP[reg]=SHOP[reg].concat(GEAR_SHOP[reg].filter(id=>!SHOP[reg].includes(id)))})();
