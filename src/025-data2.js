// ===================== regions: creatures, gear, shops, travel =====================
// Every region follows the same level curve as Pedravale: city safe zone, 1–5 near the walls,
// 5–9 further out, an elite around 10 and a cave with a level 14 boss.
const TIER={
  t1:{lv:2,hp:70,atk:9,def:2,spd:2.4,exp:14,gold:[1,5],ai:'boar',aggro:0,eq:.05,r:.4,rs:12},
  t2:{lv:5,hp:125,atk:15,def:4,spd:3.5,exp:30,gold:[3,9],ai:'wolf',aggro:6,eq:.08,r:.4,rs:14},
  t3:{lv:6,hp:140,atk:17,def:4,spd:3,exp:36,gold:[4,12],ai:'goblin',noFlee:1,aggro:5,eq:.1,r:.34,rs:15},
  t3a:{lv:7,hp:110,atk:16,def:3,spd:3,exp:42,gold:[5,14],ai:'archer',aggro:7,eq:.1,r:.34,rs:16},
  t4:{lv:9,hp:270,atk:24,def:10,spd:2.4,exp:72,gold:[8,20],ai:'guard',aggro:5,eq:.14,r:.4,rs:20},
  elite:{lv:10,hp:620,atk:28,def:8,spd:3.6,exp:260,gold:[30,60],aggro:8,eq:.7,r:.55,rs:150,elite:1},
  c1:{lv:9,hp:210,atk:22,def:7,spd:2.7,exp:64,gold:[6,16],ai:'goblin',noFlee:1,aggro:6,eq:.12,r:.36,rs:22},
  c2:{lv:10,hp:170,atk:21,def:5,spd:2.6,exp:70,gold:[6,16],ai:'archer',aggro:8,eq:.12,r:.34,rs:22},
  c3:{lv:11,hp:280,atk:26,def:6,spd:3,exp:95,gold:[10,22],ai:'ghost',aggro:9,eq:.15,r:.38,rs:28},
  boss:{lv:14,hp:3400,atk:38,def:12,spd:2.6,exp:1500,gold:[220,380],ai:'boss',aggro:9,eq:1,r:.62,rs:280,boss:1}};
const mob=(tier,o)=>Object.assign({},TIER[tier],o);
Object.assign(MOBS,{
  // --- Picos de Gelvar (neve) ---
  raposa_neve:mob('t1',{n:'Raposa da Neve',fam:'fera',look:'raposa_neve',drops:[['pele_neve',.5],['pot_hp1',.07]]}),
  lobo_neve:mob('t2',{n:'Lobo da Neve',fam:'fera',look:'lobo_neve',drops:[['pele_neve',.5],['pot_hp1',.1],['cabeca_lobo',.02]]}),
  saqueador_gelo:mob('t3',{n:'Saqueador das Geleiras',fam:'humano',look:'saqueador_gelo',drops:[['trapo',.4],['pot_hp1',.12],['gorro_pele',.02]]}),
  cacador_gelo:mob('t3a',{n:'Caçador das Geleiras',fam:'humano',look:'cacador_gelo',drops:[['pele_neve',.3],['pot_mp',.1]]}),
  yeti:mob('t4',{n:'Yeti',fam:'fera',look:'yeti',r:.5,drops:[['pele_neve',.7],['pot_hp2',.08]]}),
  urso_polar:mob('elite',{n:'Urso Polar',ai:'boar',fam:'fera',look:'urso_polar',r:.65,drops:[['pele_neve',1],['manto_pele',.3],['pot_hp2',.5]]}),
  golem_gelo:mob('c1',{n:'Golem de Gelo',fam:'elemental',look:'golem_gelo',r:.45,drops:[['cristal_gelo',.5],['pot_hp1',.1]]}),
  espirito_gelo:mob('c3',{n:'Espírito Gélido',fam:'espírito',look:'espirito_gelo',drops:[['cristal_gelo',.4],['pot_mp',.25]]}),
  arqueiro_gelo:mob('c2',{n:'Atirador de Cristal',fam:'elemental',look:'arqueiro_gelo',drops:[['cristal_gelo',.4]]}),
  rainha_gelo:mob('boss',{n:'Rainha do Inverno',ai:'lich',fam:'elemental',look:'rainha_gelo',minions:['golem_gelo','espirito_gelo'],drops:[['coroa_gelo',.5],['cajado_gelo',.35],['pot_hp2',1],['cristal_gelo',1]]}),
  // --- Vale de Kazemura (Japão) ---
  tanuki:mob('t1',{n:'Tanuki',fam:'fera',look:'tanuki',drops:[['folha_ouro',.4],['pot_hp1',.07]]}),
  kitsune:mob('t2',{n:'Kitsune',fam:'espírito',look:'kitsune',drops:[['cauda_kitsune',.4],['pot_mp',.1]]}),
  ronin:mob('t3',{n:'Rōnin Errante',fam:'humano',look:'ronin',drops:[['trapo',.4],['pot_hp1',.12],['kasa',.02]]}),
  ninja:mob('t3a',{n:'Ninja das Sombras',fam:'humano',look:'ninja',drops:[['pot_mp',.12]]}),
  oni:mob('t4',{n:'Oni',fam:'demônio',look:'oni',r:.48,drops:[['chifre_oni',.5],['pot_hp2',.08]]}),
  tengu:mob('elite',{n:'Tengu da Montanha',ai:'shaman',fam:'espírito',look:'tengu',r:.45,drops:[['leque_tengu',.3],['pot_hp2',.5]]}),
  kappa:mob('c1',{n:'Kappa',fam:'demônio',look:'kappa',drops:[['pot_hp1',.15]]}),
  samurai_fantasma:mob('c3',{n:'Samurai Fantasma',fam:'morto-vivo',look:'samurai_fantasma',drops:[['pot_mp',.25],['kabuto',.03]]}),
  arqueiro_oni:mob('c2',{n:'Arqueiro Oni',fam:'demônio',look:'arqueiro_oni',drops:[['chifre_oni',.3]]}),
  oni_shogun:mob('boss',{n:'Oni Xogum',fam:'demônio',look:'oni_shogun',minions:['oni','kappa'],r:.7,drops:[['katana_lua',.4],['kabuto',.5],['pot_hp2',1],['chifre_oni',1]]}),
  // --- Dunas de Al-Rimal (deserto) ---
  escorpiao:mob('t1',{n:'Escorpião',fam:'fera',look:'escorpiao',drops:[['ferrao',.5],['pot_hp1',.07]]}),
  hiena:mob('t2',{n:'Hiena',fam:'fera',look:'hiena',drops:[['couro',.4],['pot_hp1',.1]]}),
  saqueador_duna:mob('t3',{n:'Saqueador das Dunas',fam:'humano',look:'saqueador_duna',drops:[['trapo',.4],['pot_hp1',.12],['turbante',.02]]}),
  atirador_duna:mob('t3a',{n:'Atirador das Dunas',fam:'humano',look:'atirador_duna',drops:[['pot_mp',.1]]}),
  guardiao_arenito:mob('t4',{n:'Guardião de Arenito',fam:'elemental',look:'guardiao_arenito',r:.48,block:1,drops:[['po_sol',.4],['pot_hp2',.08]]}),
  serpente_areia:mob('elite',{n:'Serpente das Areias',ai:'wolf',fam:'fera',look:'serpente_areia',r:.6,drops:[['escama_areia',1],['pot_hp2',.5]]}),
  mumia:mob('c1',{n:'Múmia',fam:'morto-vivo',look:'mumia',drops:[['trapo',.6],['pot_hp1',.1]]}),
  djinn:mob('c3',{n:'Djinn Errante',fam:'espírito',look:'djinn',drops:[['po_sol',.4],['pot_mp',.25]]}),
  arqueiro_tumba:mob('c2',{n:'Sentinela da Tumba',fam:'morto-vivo',look:'arqueiro_tumba',drops:[['osso_antigo',.4]]}),
  farao:mob('boss',{n:'Faraó Desperto',ai:'lich',fam:'morto-vivo',look:'farao',minions:['mumia','arqueiro_tumba'],drops:[['mascara_farao',.5],['cimitarra_sol',.35],['pot_hp2',1],['po_sol',1]]}),
  // --- Selva de Yara (Amazônia) ---
  sapo:mob('t1',{n:'Sapo-Flecha',fam:'fera',look:'sapo',r:.32,drops:[['veneno_sapo',.5],['pot_hp1',.07]]}),
  onca:mob('t2',{n:'Onça-Pintada',fam:'fera',look:'onca',drops:[['couro',.5],['pot_hp1',.1]]}),
  homem_planta:mob('t3',{n:'Homem-Planta',fam:'planta',look:'homem_planta',drops:[['seiva',.5],['pot_hp1',.12]]}),
  planta_cuspideira:mob('t3a',{n:'Planta Cuspideira',fam:'planta',look:'planta_cuspideira',spd:0,drops:[['seiva',.5],['pot_mp',.1]]}),
  jacare:mob('t4',{n:'Jacaré',fam:'fera',look:'jacare',r:.55,drops:[['escama_jacare',.5],['pot_hp2',.08]]}),
  boitata:mob('elite',{n:'Boitatá',ai:'wolf',fam:'espírito',look:'boitata',r:.6,drops:[['escama_fogo',1],['pot_hp2',.5]]}),
  aranha:mob('c1',{n:'Aranha-Armadeira',fam:'fera',look:'aranha',drops:[['veneno_sapo',.4],['pot_hp1',.1]]}),
  curupira_sombra:mob('c3',{n:'Assombração da Mata',fam:'espírito',look:'assombracao_mata',drops:[['seiva',.4],['pot_mp',.25]]}),
  cuspideira_negra:mob('c2',{n:'Cuspideira Negra',fam:'planta',look:'cuspideira_negra',spd:0,drops:[['seiva',.5]]}),
  mapinguari:mob('boss',{n:'Mapinguari',fam:'fera',look:'mapinguari',minions:['aranha','homem_planta'],r:.75,drops:[['coroa_folhas',.5],['arco_selva',.35],['pot_hp2',1],['seiva',1]]})
});
// --- materials and region gear ---
Object.assign(BASES,{
  pele_neve:{n:'Pele da Neve',t:'mat',sell:9,ic:['hide',0xe8eef4,0xa8b8c8],d:'Material. Quente e macia.'},
  cristal_gelo:{n:'Cristal de Gelo',t:'mat',sell:14,ic:['ore',0x9ae8ff,0xffffff],d:'Material. Nunca derrete.'},
  folha_ouro:{n:'Folha Dourada',t:'mat',sell:8,ic:['ore',0xe8c050,0x8a6a2a],d:'Material. Tanukis adoram brilho.'},
  cauda_kitsune:{n:'Pelo de Kitsune',t:'mat',sell:12,ic:['hide',0xe8843a,0xffffff],d:'Material. Brilha de leve no escuro.'},
  chifre_oni:{n:'Chifre de Oni',t:'mat',sell:16,ic:['tusk',0xe8e0c8,0xc83a2a],d:'Material. Ainda quente.'},
  leque_tengu:{n:'Leque de Tengu',t:'eq',slot:'escudo',sh:'tome',cls:'m',lv:8,col:0xc83a2a,fix:[['skill',10],['speed',5]],ic:['robe',0xc83a2a,0xf0e8d8],lore:'Um aceno e o vento obedece.'},
  ferrao:{n:'Ferrão de Escorpião',t:'mat',sell:7,ic:['tusk',0x8a5a2a,0x3a2010],d:'Material.'},
  po_sol:{n:'Pó do Sol',t:'mat',sell:14,ic:['ore',0xffd060,0xffffff],d:'Material. Areia que guarda luz.'},
  escama_areia:{n:'Escama de Areia',t:'mat',sell:20,ic:['ore',0xc8a060,0x6a4a22],d:'Material raro.'},
  veneno_sapo:{n:'Veneno de Sapo',t:'mat',sell:9,ic:['potion',0x7ad83a,0x2a5a1a],d:'Material. Não lamba.'},
  seiva:{n:'Seiva Viva',t:'mat',sell:10,ic:['potion',0x9ae85a,0x3a6a2a],d:'Material. Pulsa como um coração.'},
  escama_jacare:{n:'Escama de Jacaré',t:'mat',sell:14,ic:['ore',0x4a6a3a,0x2a3a1a],d:'Material.'},
  escama_fogo:{n:'Escama do Boitatá',t:'mat',sell:24,ic:['ore',0xff8a2a,0xfff0a0],d:'Material raro. Queima sem fogo.'},
  // Gelvar
  gorro_pele:{n:'Gorro de Pele',t:'eq',slot:'cabeca',hd:'furhat',def:3,lv:3,buy:70,col:0xd8d0c4,fix:[['hp',15]],ic:['beanie',0xd8d0c4,0x8a6a4a]},
  manto_pele:{n:'Manto de Pele',t:'eq',slot:'peito',def:8,lv:5,buy:240,col:0xc8c0b4,ct:'leather',fix:[['hp',25]],ic:['chest',0xd8d0c4,0x8a6a4a]},
  machado_nordico:{n:'Machado Nórdico',t:'eq',slot:'arma',cls:'g',wt:'axe',atk:17,as:.78,lv:5,buy:300,ic:['axe',0xc8d0dc,0x6a4a2a]},
  arco_osso:{n:'Arco de Osso de Baleia',t:'eq',slot:'arma',cls:'a',wt:'bow',atk:13,as:1,lv:5,buy:300,ic:['bow',0xe8e0d0,0x8ab8d8]},
  cajado_gelo:{n:'Cajado do Inverno',t:'eq',slot:'arma',cls:'m',wt:'staff',atk:16,lv:8,buy:520,orb:0x9ae8ff,fix:[['skill',8]],ic:['staff',0x8ab8d8,0x9ae8ff]},
  adaga_gelo:{n:'Presa de Gelo',t:'eq',slot:'arma',cls:'l',wt:'dagger',atk:11,as:1.2,lv:5,buy:300,ic:['dagger',0xbfe8ff,0x3a5a7a]},
  coroa_gelo:{n:'Coroa do Inverno',t:'eq',slot:'cabeca',hd:'crown',def:6,lv:12,u:1,col:0xbfe8ff,fix:[['mp',40],['skill',8]],ic:['crown',0xbfe8ff,0x5ab0e0],lore:'Fria ao toque, mesmo no verão.'},
  // Kazemura
  kasa:{n:'Kasa de Palha',t:'eq',slot:'cabeca',hd:'kasa',def:2,lv:2,buy:45,col:0xc8a858,fix:[['speed',3]],ic:['straw',0xc8a858,0x5a3a20]},
  kabuto:{n:'Kabuto',t:'eq',slot:'cabeca',hd:'kabuto',cls:'g',def:10,lv:8,buy:480,col:0x2a2a34,col2:0xd8b048,fix:[['for',2]],ic:['greathelm',0x2a2a34,0xd8b048],lore:'Elmo de samurai com crista dourada.'},
  kimono:{n:'Kimono de Seda',t:'eq',slot:'peito',def:5,lv:4,buy:220,col:0x8a2a3a,trim:0xe8c050,ct:'robe',fix:[['int',2],['mp',20]],ic:['robe',0x8a2a3a,0xe8c050]},
  do_samurai:{n:'Dō Laqueado',t:'eq',slot:'peito',cls:'g',def:14,lv:8,buy:560,col:0x6a1a22,trim:0xd8b048,ct:'plate',fix:[['hp',30]],ic:['plate',0x6a1a22,0xd8b048]},
  katana:{n:'Katana',t:'eq',slot:'arma',cls:'g',wt:'sword',atk:13,as:1.1,lv:5,buy:340,ic:['sword',0xe8eef8,0x2a2a34],lore:'Corta rápido e limpo.'},
  katana_lua:{n:'Katana da Lua Crescente',t:'eq',slot:'arma',cls:'g',wt:'sword',atk:24,as:1.1,lv:12,u:1,frost:1,fix:[['crit',6]],ic:['sword',0xbfe8ff,0xd8b048],lore:'Forjada sob a lua. Deixa um rastro de geada.'},
  yumi:{n:'Yumi',t:'eq',slot:'arma',cls:'a',wt:'bow',atk:14,as:.95,lv:5,buy:320,ic:['bow',0x2a1a14,0xe8e0d0]},
  tanto:{n:'Tantō',t:'eq',slot:'arma',cls:'l',wt:'dagger',atk:10,as:1.3,lv:5,buy:300,ic:['dagger',0xe8eef8,0x8a2a3a]},
  // Qasr al-Nur
  turbante:{n:'Turbante',t:'eq',slot:'cabeca',hd:'turban',def:2,lv:2,buy:45,col:0xe8e0cc,fix:[['regen',2]],ic:['beanie',0xe8e0cc,0x3a6ab0]},
  mascara_farao:{n:'Máscara do Faraó',t:'eq',slot:'cabeca',hd:'pharaoh',def:7,lv:12,u:1,col:0xd8b048,fix:[['int',4],['vsUndead',20]],ic:['crown',0xd8b048,0x2a4a9a],lore:'O ouro ainda lembra o rosto de quem a usou.'},
  tunica_areia:{n:'Túnica de Viajante',t:'eq',slot:'peito',def:5,lv:3,buy:120,col:0xc8b088,ct:'robe',fix:[['speed',4]],ic:['robe',0xc8b088,0x8a6a3a]},
  cimitarra:{n:'Cimitarra',t:'eq',slot:'arma',cls:'g',wt:'sword',atk:12,as:1.05,lv:4,buy:280,ic:['sword',0xe8eef8,0xd8b048]},
  cimitarra_sol:{n:'Cimitarra do Sol',t:'eq',slot:'arma',cls:'g',wt:'sword',atk:22,as:1.05,lv:12,u:1,fire:1,fix:[['dmg',8]],ic:['sword',0xffd060,0xd8b048],lore:'Brilha como o meio-dia.'},
  arco_composto:{n:'Arco Composto',t:'eq',slot:'arma',cls:'a',wt:'bow',atk:15,as:1,lv:6,buy:340,ic:['bow',0x6a3a1a,0xd8b048]},
  cajado_sol:{n:'Cajado Solar',t:'eq',slot:'arma',cls:'m',wt:'staff',atk:13,lv:5,buy:300,orb:0xffd060,ic:['staff',0xc8a050,0xffd060]},
  khanjar:{n:'Khanjar',t:'eq',slot:'arma',cls:'l',wt:'dagger',atk:11,as:1.25,lv:5,buy:300,ic:['dagger',0xe8eef8,0xd8b048]},
  // Aldeia do Rio
  coroa_folhas:{n:'Coroa de Folhas',t:'eq',slot:'cabeca',hd:'leafcrown',def:5,lv:12,u:1,col:0x3a8a3a,fix:[['regen',5],['hp',40]],ic:['flowers',0x3a8a3a,0xff6a4a],lore:'Ainda cresce. Às vezes floresce.'},
  colete_cobra:{n:'Colete de Couro de Cobra',t:'eq',slot:'peito',def:7,lv:5,buy:240,col:0x4a6a3a,ct:'leather',fix:[['des',2]],ic:['chest',0x4a6a3a,0x2a3a1a]},
  arco_selva:{n:'Arco da Selva',t:'eq',slot:'arma',cls:'a',wt:'bow',atk:24,as:1.05,lv:12,u:1,fix:[['crit',5]],ic:['bow',0x3a5a2a,0x9ae85a],lore:'Feito de um galho que não parou de crescer.'},
  cajado_raiz:{n:'Cajado de Raiz',t:'eq',slot:'arma',cls:'m',wt:'staff',atk:12,lv:4,buy:280,orb:0x9ae85a,fix:[['regen',3]],ic:['staff',0x5a3a1a,0x9ae85a]},
  machete:{n:'Facão',t:'eq',slot:'arma',cls:'g',wt:'sword',atk:12,as:1.15,lv:4,buy:260,ic:['sword',0xc8ccd4,0x3a2a1a]},
  zarabatana:{n:'Zarabatana',t:'eq',slot:'arma',cls:'l',wt:'dagger',atk:10,as:1.3,lv:5,buy:300,fix:[['crit',4]],ic:['dagger',0x8a6a3a,0x7ad83a]}
});
Object.assign(SHOP,{
  gelvar:['pot_hp1','pot_hp2','pot_mp','scroll','gorro_pele','manto_pele','machado_nordico','arco_osso','adaga_gelo','cajado_gelo','aljava_gelo','botas_placa'],
  kazemura:['pot_hp1','pot_hp2','pot_mp','scroll','kasa','kimono','katana','yumi','tanto','do_samurai','kabuto','tomo_chamas'],
  qasr:['pot_hp1','pot_hp2','pot_mp','scroll','turbante','tunica_areia','cimitarra','arco_composto','cajado_sol','khanjar','aljava_fogo','grimorio_cura'],
  aldeia:['pot_hp1','pot_hp2','pot_mp','scroll','colete_cobra','machete','cajado_raiz','zarabatana','aljava_veneno','tunica_cacador','coroa_flores']
});
// Every city can send you to every other city.
const CITIES=[
  {id:'pedravale',n:'Pedravale',map:'world',at:[18.6,21.6],d:'A vila de pedra à beira do Bosque de Vellmor.'},
  {id:'gelvar',n:'Gelvar',map:'gelo',at:[27.5,31.2],d:'Fortaleza nórdica nos Picos Gelados.'},
  {id:'kazemura',n:'Kazemura',map:'japao',at:[27.5,31.2],d:'Vila de pagodes e cerejeiras no Vale do Vento.'},
  {id:'qasr',n:'Qasr al-Nur',map:'deserto',at:[27.5,31.2],d:'A cidade das cúpulas no coração das Dunas de Al-Rimal.'},
  {id:'aldeia',n:'Aldeia do Rio',map:'selva',at:[27.5,31.2],d:'Aldeia ribeirinha nas profundezas da Selva de Yara.'}];
const TRAVEL_COST=25;
