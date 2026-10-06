// ===================== dungeons 2: pyramids, secret lairs, stronger tiers, quests =====================
Object.assign(TIER,{
  h1:{lv:14,hp:380,atk:30,def:9,spd:2.8,exp:140,gold:[12,26],ai:'goblin',noFlee:1,aggro:7,eq:.2,r:.38,rs:26},
  h2:{lv:15,hp:300,atk:29,def:7,spd:2.6,exp:150,gold:[12,26],ai:'archer',aggro:8,eq:.2,r:.36,rs:26},
  h3:{lv:15,hp:520,atk:34,def:14,spd:2.5,exp:190,gold:[14,30],ai:'guard',aggro:6,eq:.24,r:.42,rs:30},
  h4:{lv:15,hp:340,atk:31,def:8,spd:3.1,exp:160,gold:[12,26],ai:'ghost',aggro:9,eq:.2,r:.38,rs:30},
  sboss:{lv:16,hp:4800,atk:44,def:14,spd:3,exp:2200,gold:[300,520],ai:'boss',aggro:10,eq:1,r:.8,rs:300,boss:1},
  hboss:{lv:18,hp:6200,atk:50,def:16,spd:2.7,exp:2800,gold:[400,700],ai:'boss',aggro:10,eq:1,r:.75,rs:320,boss:1}});
Object.assign(MOBS,{
  boitata_rei:mob('boss',{n:'Boitatá Ancestral',ai:'boss',fam:'espírito',look:'boitata_rei',minions:['boitata_filhote','aranha'],r:.9,drops:[['escama_fogo',1],['arco_selva',.35],['chama_boitata',.4],['pot_hp2',1]]}),
  boitata_filhote:mob('c1',{n:'Cria do Boitatá',ai:'wolf',fam:'espírito',look:'boitata_filhote',drops:[['escama_fogo',.15]]}),
  // pirâmide do deserto
  escaravelho:mob('h1',{n:'Escaravelho Dourado',fam:'fera',look:'escaravelho',drops:[['po_sol',.4],['pot_hp2',.08]]}),
  sacerdote_morto:mob('h2',{n:'Sacerdote Morto',ai:'shaman',fam:'morto-vivo',look:'sacerdote_morto',drops:[['po_sol',.4],['pot_mp',.2]]}),
  guarda_chacal:mob('h3',{n:'Guarda-Chacal',fam:'morto-vivo',look:'guarda_chacal',block:1,drops:[['po_sol',.5],['pot_hp2',.1]]}),
  anubis:mob('hboss',{n:'Anúbis, o Pesador de Almas',ai:'lich',fam:'morto-vivo',look:'anubis',minions:['guarda_chacal','sacerdote_morto'],drops:[['cetro_anubis',.45],['mascara_farao',.35],['anel_areia',.5],['pot_hp2',1]]}),
  // pirâmide da selva
  onca_negra:mob('h1',{n:'Onça-Negra',ai:'wolf',fam:'fera',look:'onca_negra',drops:[['couro',.6],['pot_hp2',.08]]}),
  guardiao_musgo:mob('h3',{n:'Guardião de Musgo',fam:'elemental',look:'guardiao_musgo',drops:[['seiva',.5],['pot_hp2',.1]]}),
  espirito_ancestral:mob('h4',{n:'Espírito Ancestral',fam:'espírito',look:'espirito_ancestral',drops:[['seiva',.4],['pot_mp',.2]]}),
  mapinguari_anciao:mob('hboss',{n:'Mapinguari Ancião',fam:'fera',look:'mapinguari',minions:['onca_negra','guardiao_musgo'],r:.85,drops:[['coroa_folhas',.5],['garra_mapinguari',.45],['amuleto_selva',.5],['pot_hp2',1]]}),
  // segredos
  lobo_glacial:mob('h1',{n:'Lobo Glacial',ai:'wolf',fam:'fera',look:'lobo_glacial',drops:[['pele_neve',.6]]}),
  mamute:mob('sboss',{n:'Mamute Ancestral',ai:'boss',fam:'fera',look:'mamute',minions:['lobo_glacial','golem_gelo'],r:1,drops:[['presa_mamute',.5],['anel_inverno',.5],['pot_hp2',1]]}),
  kitsune_fogo:mob('h4',{n:'Kitsune de Fogo-Fátuo',ai:'wolf',fam:'espírito',look:'kitsune_fogo',drops:[['cauda_kitsune',.6]]}),
  kyubi:mob('sboss',{n:'Kyūbi, a Raposa de Nove Caudas',ai:'wolf',alpha:1,fam:'espírito',look:'kyubi',r:.9,drops:[['amuleto_kitsune',.55],['katana_lua',.25],['pot_hp2',1]]})
});
MOBS.mapinguari.n='Mapinguari Jovem';
Object.assign(BASES,{
  chama_boitata:{n:'Chama do Boitatá',t:'eq',slot:'colar',lv:12,u:1,fix:[['dmg',10],['hp',30]],ic:['amulet',0xff8a2a,0xfff0a0],lore:'Ela nunca apaga. Nem embaixo d’água.'},
  cetro_anubis:{n:'Cetro de Anúbis',t:'eq',slot:'arma',cls:'m',wt:'staff',atk:30,lv:16,u:1,orb:0x5affd0,fix:[['skill',15],['int',5]],ic:['staff',0x1a1a22,0xd8b048],lore:'Pesa a alma de quem é atingido.'},
  anel_areia:{n:'Anel das Areias Eternas',t:'eq',slot:'anel',lv:16,u:1,fix:[['crit',6],['speed',6],['des',4]],ic:['ring',0xd8b048,0x2a8a9a]},
  garra_mapinguari:{n:'Garra do Mapinguari',t:'eq',slot:'arma',cls:'l',wt:'dagger',atk:26,as:1.2,lv:16,u:1,fix:[['life',4],['crit',6]],ic:['dagger',0x3a2a1a,0xf0e8d8],lore:'Ainda cheira a floresta molhada.'},
  amuleto_selva:{n:'Coração da Selva',t:'eq',slot:'colar',lv:16,u:1,fix:[['regen',6],['hp',50]],ic:['amulet',0x3a8a3a,0x9ae85a]},
  presa_mamute:{n:'Presa de Mamute',t:'eq',slot:'arma',cls:'g',wt:'mace',atk:34,as:.8,lv:15,u:1,fix:[['for',5],['vsBeast',20]],ic:['mace',0xf0e8d8,0x8a6a4a],lore:'Uma clava feita de marfim antigo.'},
  anel_inverno:{n:'Anel do Inverno Sem Fim',t:'eq',slot:'anel',lv:15,u:1,fix:[['def',8],['hp',40],['mp',30]],ic:['ring',0xbfe8ff,0x5ab0e0]},
  amuleto_kitsune:{n:'Amuleto da Nona Cauda',t:'eq',slot:'colar',lv:15,u:1,fix:[['skill',12],['crit',5],['speed',5]],ic:['amulet',0xe8843a,0xfff4e0],lore:'Nove fios de pelo trançados. Um deles ainda arde.'}
});
// ---------- region quests ----------
// type: kill (n of a creature), boss (defeat once), item (bring n of an item)
const RQ={
  gelo_lobos:{t:'Matilha da Encosta',type:'kill',mob:'lobo_neve',n:8,xp:300,gold:120,items:['manto_pele'],offer:'Os lobos da neve estão atacando nossas renas. Derrube oito deles na Encosta e no Bosque de Pinheiros.',done:'Pelos deuses do gelo, as renas vão dormir tranquilas. Leve isto.'},
  gelo_yeti:{t:'O Rugido do Planalto',type:'kill',mob:'yeti',n:4,xp:520,gold:180,items:['pot_hp2','pot_hp2','machado_nordico'],offer:'Yetis desceram do Planalto Branco. Quatro deles bastam para mostrar que Gelvar não tem medo.',done:'Os yetis voltaram para as montanhas. Bom trabalho.'},
  gelo_rainha:{t:'A Rainha do Inverno',type:'boss',mob:'rainha_gelo',n:1,xp:900,gold:320,items:['cajado_gelo'],offer:'A Gruta Congelada, a sudeste, tem uma rainha que nunca morreu. Enquanto ela respirar, o inverno não acaba.',done:'Sinto o vento mais morno. Você quebrou a coroa dela.'},
  gelo_mamute:{t:'O Cristal que Canta',type:'boss',mob:'mamute',n:1,xp:1200,gold:400,items:['pot_hp2','pot_hp2'],offer:'Quando eu era menina, ouvi um cristal cantar no canto noroeste do mapa, entre os pinheiros. Dizem que, atrás dele, dorme um mamute mais velho que a montanha. Procure o cristal azul diferente dos outros.',done:'Então era verdade... O mamute dormia mesmo atrás do cristal.'},
  jp_kitsune:{t:'Raposas Travessas',type:'kill',mob:'kitsune',n:8,xp:300,gold:120,items:['kimono'],offer:'As kitsunes roubam o arroz das oferendas. Espante oito delas pelos arrozais.',done:'O templo agradece. As oferendas voltaram a ficar inteiras.'},
  jp_oni:{t:'Chifres no Desfiladeiro',type:'kill',mob:'oni',n:4,xp:520,gold:180,items:['pot_hp2','pot_hp2','katana'],offer:'Onis desceram do Desfiladeiro Vermelho. Quatro chifres, e a vila respira de novo.',done:'Quatro chifres de oni. Você tem a coragem de um samurai.'},
  jp_shogun:{t:'O Xogum das Cinzas',type:'boss',mob:'oni_shogun',n:1,xp:900,gold:320,items:['do_samurai'],offer:'Na Caverna do Oni, a sudeste, o Xogum reúne um exército. Derrote-o antes do próximo festival.',done:'O festival vai acontecer. Graças a você.'},
  jp_kyubi:{t:'A Nona Cauda',type:'boss',mob:'kyubi',n:1,xp:1200,gold:400,items:['pot_hp2','pot_hp2'],offer:'Medito há trinta anos neste vale. A oeste, no bambuzal, existe um pequeno santuário de raposa. Quem faz uma reverência diante dele encontra a Kyūbi.',done:'A Kyūbi descansa. O bambuzal ficou em silêncio.'},
  ds_escorp:{t:'Ferrões na Estrada',type:'kill',mob:'escorpiao',n:10,xp:260,gold:120,items:['tunica_areia'],offer:'Escorpiões estão picando os camelos das caravanas. Dez deles e a estrada fica segura.',done:'As caravanas voltaram a cantar. Obrigado, viajante.'},
  ds_ferrao:{t:'Remédio de Ferrão',type:'item',item:'ferrao',n:6,xp:240,gold:160,items:['pot_hp2','pot_hp2','pot_mp'],offer:'Faço antídotos com ferrão de escorpião. Me traga seis e eu pago bem.',done:'Seis ferrões perfeitos. Este antídoto vai salvar muita gente.'},
  ds_farao:{t:'O Faraó Desperto',type:'boss',mob:'farao',n:1,xp:900,gold:320,items:['cajado_sol'],offer:'Na Tumba, a sudeste, o Faraó acordou. Coloque-o para dormir de novo.',done:'O Faraó dorme. As areias param de sussurrar.'},
  ds_anubis:{t:'A Balança de Anúbis',type:'boss',mob:'anubis',n:1,xp:1600,gold:550,items:['pot_hp2','pot_hp2','pot_hp2'],offer:'A grande pirâmide, no canto sudoeste, guarda Anúbis. Só os mais fortes voltam de lá. Você é forte?',done:'Você voltou da pirâmide! As lendas vão falar de você.'},
  sv_sapo:{t:'Sapos Venenosos',type:'kill',mob:'sapo',n:10,xp:260,gold:120,items:['colete_cobra'],offer:'Os sapos-flecha envenenaram o igarapé. Dez deles, e a água volta a ficar limpa.',done:'A água está limpa de novo. A aldeia agradece.'},
  sv_seiva:{t:'Seiva para a Vó',type:'item',item:'seiva',n:6,xp:240,gold:160,items:['pot_hp2','pot_hp2','pot_mp'],offer:'A seiva viva dos homens-planta cura febre. Me traga seis potes.',done:'Seis potes de seiva! Ninguém mais vai ter febre neste inverno de chuva.'},
  sv_boitata:{t:'A Cobra de Fogo',type:'boss',mob:'boitata_rei',n:1,xp:900,gold:320,items:['cajado_raiz'],offer:'No Templo Perdido, a sudeste, mora o Boitatá Ancestral. Ele queima a mata à noite. Apague esse fogo.',done:'A mata não queima mais. Você enfrentou o Boitatá!'},
  sv_mapinguari:{t:'O Gigante da Pirâmide',type:'boss',mob:'mapinguari_anciao',n:1,xp:1600,gold:550,items:['pot_hp2','pot_hp2','pot_hp2'],offer:'Na pirâmide do canto sudoeste vive o Mapinguari Ancião, de um olho só e boca na barriga. Só vá se estiver pronto.',done:'O gigante caiu. Você é o maior caçador que esta aldeia já viu.'}
};
function rqState(id){return P.q[id]||0}
function rqCount(id){const q=RQ[id];return q.type==='item'?countItem(q.item):(P.q[id+'_c']||0)}
function rqReady(id){return rqState(id)===1&&rqCount(id)>=RQ[id].n}
function rqTxt(id){const q=RQ[id],tgt=q.type==='item'?BASES[q.item].n:MOBS[q.mob].n;return{t:q.t,s:['',()=>rqReady(id)?`Pronto! Volte e fale com quem te deu a missão.`:q.type==='boss'?`Derrote ${tgt}.`:`${q.type==='item'?'Junte':'Derrote'} ${q.n}× ${tgt} (${Math.min(rqCount(id),q.n)}/${q.n}).`,'Concluída.']}}
function rqOnKill(kind){for(const id in RQ){const q=RQ[id];if(q.type!=='item'&&q.mob===kind&&rqState(id)===1){const c=(P.q[id+'_c']||0)+1;P.q[id+'_c']=c;if(c<=q.n){log(`${q.t}: ${Math.min(c,q.n)}/${q.n}`,'sys');if(c===q.n){toast('Missão pronta',q.t);sfx('ok')}}uiDirty=1}}}
function rqTalk(n){const nm=n.n;const list=n.quests||[];
  for(const id of list)if(rqReady(id)){const q=RQ[id];if(q.type==='item')takeItem(q.item,q.n);P.q[id]=2;PS().quests++;achCheck();gainExp(q.xp,1);P.gold+=q.gold;for(const it of q.items){const i=makeItem(it,it.startsWith('pot')?0:2);if(!addItem(i))loots.push({item:i,x:P.x,y:P.y,m:M.id,t:300,age:0})}sfx('lvl');log(`Missão concluída: ${q.t}. +${q.xp} XP, +${q.gold} ouro.`,'loot','#ffa53a');uiDirty=1;dlg(nm,q.done,[{l:'Obrigado'}]);return}
  for(const id of list)if(rqState(id)===1){const q=RQ[id];dlg(nm,`${q.offer} — ${rqTxt(id).s[1]()}`,[{l:'Vou cuidar disso'}]);return}
  for(const id of list)if(rqState(id)===0){const q=RQ[id];dlg(nm,q.offer,[{l:'Aceito',pri:1,f:()=>{P.q[id]=1;if(q.type!=='item')P.q[id+'_c']=0;log('Missão: '+q.t,'sys');sfx('ok');uiDirty=1}},{l:'Agora não'}]);return}
  dlg(nm,n.after||'Você já fez muito por nós. Volte sempre.',[{l:'Até mais'}])}
// Items that never appear in a shop are stronger: +30% attack/defence.
{const sold=new Set();for(const k in SHOP)for(const id of SHOP[k])sold.add(id);for(const id in BASES){const b=BASES[id];if(b.t!=='eq'||sold.has(id))continue;b.dropOnly=1;if(b.atk)b.atk=Math.round(b.atk*1.3);if(b.def)b.def=Math.max(1,Math.round(b.def*1.3))}
  for(const id of ['gorro_pele','manto_pele','machado_nordico','arco_osso','adaga_gelo','kasa','kimono','katana','yumi','tanto','turbante','tunica_areia','cimitarra','arco_composto','cajado_sol','khanjar','colete_cobra','machete','cajado_raiz','zarabatana'])if(!DROP_POOL.includes(id))DROP_POOL.push(id)}
