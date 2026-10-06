// ===================== game data (balance lives here) =====================
// RITMO: todos os números de progressão e combate ficam aqui
const CFG={pixelFinish:1,
  xpA:60,xpB:12,xpC:2.6,          // XP para o próximo nível = xpA·nv^1.6 + xpB·nv^xpC  (nv5 ≈ 1.6k, nv10 ≈ 7k)
  discoverXp:[0,13,21,29,37],      // XP por descobrir região, por nível de perigo
  ptsPerLevel:3,deathXpLoss:.05,deathGoldLoss:.3,
  dayLength:1200,moveSpeed:3.3,      // ritmo cadenciado, estilo Ragnarok clássico
  dashCD:6.5,dashDist:2.6,atkSlow:1.55,skillCD:1.35,mobSpd:.8,shakeK:.45,potCD:12,
  regenSafe:.08,regenOut:.012,regenCombat:.003,
  mobHp:1.35,mobAtk:1.15,eqDrop:.5};
const need=lv=>Math.round(CFG.xpA*Math.pow(lv,1.6)+CFG.xpB*Math.pow(lv,CFG.xpC));
const RAR=[{n:'Comum',c:'#d8d0c0',m:1,a:0},{n:'Incomum',c:'#6ad06a',m:1.12,a:1},{n:'Raro',c:'#5aa8ff',m:1.25,a:2},{n:'Épico',c:'#c47aff',m:1.4,a:3},{n:'Único',c:'#ffa53a',m:1,a:0}];
const STATN={for:'Força',des:'Destreza',int:'Inteligência',vit:'Vitalidade'};
const CLASSES={
  g:{n:'Guerreiro',main:'for',st:{for:8,des:4,int:2,vit:7},hp:30,role:'Corpo a corpo, escudo, resiste na linha de frente.',hair:0},
  a:{n:'Arqueiro',main:'des',st:{for:4,des:9,int:3,vit:5},hp:10,role:'Ataca à distância, móvel, arma armadilhas.',hair:1},
  m:{n:'Mago',main:'int',st:{for:2,des:4,int:10,vit:5},hp:0,role:'Magia elemental, controle e dano em área.',hair:2},
  l:{n:'Assassino',main:'des',st:{for:5,des:9,int:2,vit:5},hp:15,role:'Some nas sombras, aparece pelas costas e executa.',hair:1}
};
const SKILLS={
  g:{
    atk:{n:'Golpe',d:'Corte em arco à frente.',cd:.55},
    Q:{n:'Golpe Giratório',mp:12,cd:5,lv:1,d:'Gira a lâmina e atinge todos ao redor (160%).'},
    E:{n:'Investida de Escudo',mp:10,cd:7,lv:3,d:'Avança em linha, atordoa quem atingir (120%). Quebra guarda.'},
    R:{n:'Grito de Guerra',mp:15,cd:18,lv:5,d:'Por 8s: +25% de dano e +20 de defesa.'},
    T:{n:'Golpe Esmagador',mp:20,cd:10,lv:8,d:'Golpe pesado em cone (300%) que empurra. Quebra guarda.'}},
  a:{
    atk:{n:'Disparo',d:'Flecha na direção do cursor.',cd:.6},
    Q:{n:'Tiro Triplo',mp:10,cd:4,lv:1,d:'Três flechas em leque (90% cada).'},
    E:{n:'Salto Evasivo',mp:8,cd:6,lv:3,d:'Salta para trás, invulnerável durante o salto.'},
    R:{n:'Armadilha',mp:12,cd:9,lv:5,d:'Arma uma armadilha que prende e fere (200%). Máx. 2.'},
    T:{n:'Chuva de Flechas',mp:22,cd:12,lv:8,d:'Área no cursor: 6 rajadas de 60%.'}},
  m:{
    atk:{n:'Projétil Arcano',d:'Esfera mágica na direção do cursor.',cd:.72},
    Q:{n:'Lança de Gelo',mp:12,cd:3,lv:1,d:'Estilhaço em linha reta que atravessa até 4 inimigos (130%) e os CONGELA por 2,6s. Chefes só ficam lentos.'},
    E:{n:'Raio',mp:14,cd:2.5,lv:3,d:'Relâmpago no inimigo mais perto do cursor (180%), saltando para mais 2. DOBRO de dano em congelados, que se estilhaçam.'},
    R:{n:'Tempestade',mp:28,cd:10,lv:5,d:'Seis raios caem na área do cursor (100% cada). Também dobram contra congelados.'}},
  l:{
    atk:{n:'Lâminas Gêmeas',d:'Cortes rápidos. +60% pelas costas ou em quem não te viu.',cd:.42},
    Q:{n:'Passo Sombrio',mp:10,cd:5,lv:1,d:'Teleporta para as costas do inimigo mais perto do cursor. O próximo golpe é crítico.'},
    E:{n:'Investida Letal',mp:12,cd:7,lv:3,d:'Atravessa os inimigos (140%) e causa sangramento por 4s.'},
    R:{n:'Furtividade',mp:16,cd:16,lv:5,d:'Invisível por 6s, +30% de velocidade. Atacar das sombras causa 300%.'},
    T:{n:'Lâmina Oculta',mp:24,cd:12,lv:8,d:'Salta no alvo e executa: 450%, dobrado se o alvo tiver menos de 30% de vida.'}}
};
SKILLS.h={
    atk:{n:'Raio Sagrado',d:'Projétil de luz. +50% contra mortos-vivos.',cd:.72},
    Q:{n:'Luz Purificadora',mp:14,cd:4,lv:1,d:'Feixe que atravessa até 3 inimigos (170%). Dobro contra mortos-vivos.'},
    E:{n:'Cura Maior',mp:18,cd:6,lv:3,d:'Recupera 35% do HP máximo e remove lentidão.'},
    R:{n:'Bênção',mp:16,cd:20,lv:5,d:'Por 12s: +25 de defesa e recupera 2% do HP por segundo.'},
    T:{n:'Santuário',mp:30,cd:16,lv:8,d:'Círculo sagrado por 6s: cura você e fere os inimigos dentro (60% por pulso).'}};
const isHealer=p=>p.cls==='m'&&(p.evo==='sac'||(p.eq&&p.eq.escudo&&BASES[p.eq.escudo.id]&&BASES[p.eq.escudo.id].heal));
const setCode=p=>p.evo&&SKILLS[p.evo]?p.evo:isHealer(p)?'h':p.cls;
const skillSet=p=>treeSet(p);
const className=p=>p.evo&&EVO[p.evo]?EVO[p.evo].n:isHealer(p)?'Curandeiro':CLASSES[p.cls].n;
const SPEEDN=s=>s>=1.2?'Muito rápida':s>=1.05?'Rápida':s>=.9?'Normal':s>=.7?'Lenta':'Muito lenta';
const SLOTS=[['cabeca','Cabeça'],['colar','Colar'],['peito','Peito'],['arma','Arma'],['escudo','Mão sec.'],['maos','Mãos'],['pernas','Pernas'],['anel','Anel'],['pes','Pés']];
const AFF={for:{n:'Força',f:v=>`+${v} Força`},des:{n:'Destreza',f:v=>`+${v} Destreza`},int:{n:'Inteligência',f:v=>`+${v} Inteligência`},vit:{n:'Vitalidade',f:v=>`+${v} Vitalidade`},
  hp:{f:v=>`+${v} HP máximo`},mp:{f:v=>`+${v} Mana máxima`},def:{f:v=>`+${v} Defesa`},crit:{f:v=>`+${v}% chance de crítico`},aspd:{f:v=>`+${v}% velocidade de ataque`},
  speed:{f:v=>`+${v}% velocidade de movimento`},dmg:{f:v=>`+${v}% de dano`},skill:{f:v=>`+${v}% de dano de habilidades`},vsBeast:{f:v=>`+${v}% de dano contra feras`},
  vsGoblin:{f:v=>`+${v}% de dano contra goblins`},vsUndead:{f:v=>`+${v}% de dano e resistência contra mortos-vivos`},life:{f:v=>`Rouba ${v}% do dano como vida`},regen:{f:v=>`+${v} HP a cada 3s`}};
const AFF_POOL=[['for',1,4],['des',1,4],['int',1,4],['vit',1,4],['hp',8,30],['mp',6,24],['def',1,5],['crit',1,4],['aspd',2,7],['speed',2,6],['dmg',2,8],['skill',3,10],['vsBeast',5,15],['vsGoblin',5,15],['life',1,3],['regen',1,4]];
// icon: [shape, primary color, secondary]
const BASES={
  pot_hp1:{n:'Poção de Vida Pequena',t:'use',hp:60,buy:15,ic:['potion',0xd8343a,0x8a1a22],d:'Recupera 60 HP. Recarga de 12s, compartilhada entre poções.'},
  pot_hp2:{n:'Poção de Vida Média',t:'use',hp:160,buy:45,ic:['potion',0xff8a3a,0xa8481a],d:'Recupera 160 HP. Recarga de 12s, compartilhada entre poções.'},
  pot_mp:{n:'Poção de Mana',t:'use',mp:60,buy:25,ic:['potion',0x4a7ae8,0x1e3a8a],d:'Recupera 60 de mana. Recarga de 12s, compartilhada entre poções.'},
  scroll:{n:'Pergaminho de Retorno',t:'use',recall:1,buy:30,ic:['scroll',0xe8d8b0,0xa8783a],d:'Após 3s parado, leva você ao templo de Pedravale.'},
  presa:{n:'Presa de Javali',t:'mat',sell:7,ic:['tusk',0xf0e6d0,0xb8a888],d:'Material. Ferreiros e alquimistas pagam bem.'},
  couro:{n:'Couro de Lobo',t:'mat',sell:10,ic:['hide',0x8a8088,0x5a525a],d:'Material para curtumes e armaduras leves.'},
  trapo:{n:'Trapo Goblin',t:'mat',sell:5,ic:['cloth',0x8a7a4a,0x5a4a2a],d:'Pano sujo, mas tecido com fibra resistente.'},
  ferro_velho:{n:'Ferro Velho',t:'mat',sell:12,ic:['ore',0x8a8a96,0x4a4a56],d:'Pedaços de armas goblins. Pode ser refundido.'},
  chave_osso:{n:'Chave de Osso',t:'quest',sell:0,ic:['tusk',0xd8d0bc,0x9a5aff],d:'Fria ao toque. O símbolo dela é o mesmo da porta selada sob o templo de Pedravale.'},
  osso_antigo:{n:'Osso Antigo',t:'mat',sell:14,ic:['tusk',0xe8e0cc,0x8a8070],d:'Material. Alquimistas pagam bem por ossos da cripta.'},
  pele_alfa:{n:'Pele do Lobo Alfa',t:'quest',sell:0,ic:['hide',0x3a3640,0xc8c0c8],d:'Uma pele enorme, com uma cicatriz antiga no flanco.'},
  // weapons
  esp_curta:{n:'Espada Curta',t:'eq',slot:'arma',cls:'g',wt:'sword',atk:6,as:1,lv:1,buy:60,ic:['sword',0xd8dee8,0x8a6a3a]},
  espadao:{n:'Espadão',t:'eq',slot:'arma',cls:'g',wt:'greatsword',two:1,atk:30,as:.45,lv:4,buy:300,d:'Golpe muito lento. Cada impacto solta um raio que fere tudo ao redor.',ic:['sword',0xd8e0f0,0x5a6a8a]},
  espadao_trovao:{n:'Espadão do Trovão',t:'eq',slot:'arma',cls:'g',wt:'greatsword',two:1,storm:1,atk:48,as:.42,lv:8,buy:720,fix:[['crit',4]],d:'Forjado num carvalho atingido por raio. A lâmina zune antes da tempestade.',ic:['sword',0x9ae8ff,0x3a4a7a]},
  esp_longa:{n:'Espada Longa',t:'eq',slot:'arma',cls:'g',wt:'sword',atk:15,as:.95,lv:6,buy:320,ic:['sword',0xe8eef8,0xc8a050]},
  maca:{n:'Maça de Ferro',t:'eq',slot:'arma',cls:'g',wt:'mace',atk:12,as:.85,lv:4,ic:['mace',0x9a9aa8,0x6a4a2a]},
  arco_curto:{n:'Arco Curto',t:'eq',slot:'arma',cls:'a',wt:'bow',atk:6,as:1.1,lv:1,buy:60,ic:['bow',0x9a6a3a,0xe8e0d0]},
  arco_longo:{n:'Arco Longo',t:'eq',slot:'arma',cls:'a',wt:'bow',atk:15,as:.95,lv:6,buy:320,ic:['bow',0x6a4428,0xe8e0d0]},
  cajado:{n:'Cajado de Freixo',t:'eq',slot:'arma',cls:'m',wt:'staff',atk:6,lv:1,buy:60,orb:0x8ab8ff,ic:['staff',0x8a6a42,0x8ab8ff]},
  cajado_rubi:{n:'Cajado de Rubi',t:'eq',slot:'arma',cls:'m',wt:'staff',atk:14,lv:6,buy:320,orb:0xff5a4a,ic:['staff',0x5a3a28,0xff5a4a]},
  martelo:{n:'Martelo do Aprendiz',t:'eq',slot:'arma',cls:'g',wt:'mace',atk:16,as:.85,lv:5,u:1,fix:[['vsGoblin',20],['for',2]],ic:['mace',0xc8a050,0x6a4a2a],lore:'Primeira peça forjada por Tomé. A cabeça é torta, mas o ferro é honesto.'},
  arco_cacador:{n:'Arco do Caçador',t:'eq',slot:'arma',cls:'a',wt:'bow',atk:17,as:1.05,lv:6,u:1,fix:[['vsBeast',20],['crit',4]],ic:['bow',0x4a3020,0xf0e0b0],lore:'Ilsa caçou com ele por trinta invernos.'},
  machado_chefe:{n:'Machado do Chefe',t:'eq',slot:'arma',cls:'g',wt:'axe',atk:26,as:.8,lv:10,u:1,fix:[['crit',6],['life',3]],ic:['axe',0xb8b0b8,0x5a3a22],lore:'Lascado de tanto bater em escudos alheios.'},
  // offhand
  escudo_mad:{n:'Escudo de Madeira',t:'eq',slot:'escudo',cls:'g',sh:'round',def:4,lv:1,buy:40,col:0x8a5a32,ic:['shield',0x8a5a32,0x8a8a96]},
  escudo_fer:{n:'Escudo de Ferro',t:'eq',slot:'escudo',cls:'g',sh:'kite',def:10,lv:6,buy:280,col:0x8a9098,ic:['shield',0x9aa0aa,0x3a4a8a]},
  aljava_fogo:{n:'Aljava de Flechas de Fogo',t:'eq',slot:'escudo',cls:'a',sh:'quiver',arrow:'fire',lv:2,buy:90,fix:[['dmg',3]],ic:['quiver',0x7a3a1a,0xff8a2a],lore:'Pontas embebidas em resina. Queimam o alvo por 3s.'},
  aljava_gelo:{n:'Aljava de Flechas de Gelo',t:'eq',slot:'escudo',cls:'a',sh:'quiver',arrow:'frost',lv:2,buy:90,fix:[['dmg',3]],ic:['quiver',0x3a5a7a,0xbfe8ff],lore:'Pontas de cristal frio. Deixam lento e às vezes congelam.'},
  aljava_veneno:{n:'Aljava de Flechas Venenosas',t:'eq',slot:'escudo',cls:'a',sh:'quiver',arrow:'poison',lv:3,buy:110,fix:[['dmg',3]],ic:['quiver',0x2a4a22,0x7ad83a],lore:'Veneno de sapo do brejo. Dano contínuo por 5s.'},
  aljava:{n:'Aljava de Couro',t:'eq',slot:'escudo',cls:'a',sh:'quiver',lv:1,buy:40,fix:[['dmg',4]],ic:['quiver',0x7a5232,0xe8e0d0]},
  tomo:{n:'Tomo do Aprendiz',t:'eq',slot:'escudo',cls:'m',sh:'tome',lv:1,buy:40,fix:[['mp',20]],ic:['tome',0x5a3a8a,0xe8c050]},
  espada_gelo:{n:'Espada de Gelo',t:'eq',slot:'arma',cls:'g',wt:'sword',frost:1,atk:11,as:1,lv:2,buy:60,ic:['sword',0xbfe8ff,0x3a6a9a],lore:'(Item de teste visual) Deixa geada por onde passa. Golpes deixam lento e às vezes congelam.'},
  espada_fogo:{n:'Espada de Fogo',t:'eq',slot:'arma',cls:'g',wt:'sword',fire:1,atk:10,as:1,lv:1,buy:30,fix:[['dmg',5]],ic:['sword',0xffa040,0xc83a1a],lore:'(Item de teste visual) A lâmina nunca esfria. Golpes queimam o alvo por 3s.'},
  machado_guerra:{n:'Machado de Guerra',t:'eq',slot:'arma',cls:'g',wt:'axe',atk:19,as:.72,lv:4,buy:240,ic:['axe',0xb8b0b8,0x5a3a22],lore:'Lento, mas cada golpe conta.'},
  besta_leve:{n:'Besta Leve',t:'eq',slot:'arma',cls:'a',wt:'crossbow',atk:14,as:.62,lv:2,buy:150,pierce:1,ic:['crossbow',0x6a4428,0x9aa0aa],lore:'Dispara virotes que atravessam um inimigo. Recarrega devagar.'},
  besta_pesada:{n:'Besta Pesada',t:'eq',slot:'arma',cls:'a',wt:'crossbow',atk:30,as:.5,lv:7,buy:540,pierce:2,fix:[['crit',4]],ic:['crossbow',0x4a3020,0xc8ccd8],lore:'Atravessa dois inimigos. Dizem que fura até escudo de goblin.'},
  varinha:{n:'Varinha de Salgueiro',t:'eq',slot:'arma',cls:'m',wt:'wand',atk:4,as:1.4,lv:2,buy:90,orb:0x9affd0,ic:['wand',0x8a6a42,0x9affd0],lore:'Dano baixo, conjuração rápida.'},
  foice:{n:'Foice Sombria',t:'eq',slot:'arma',cls:'l',wt:'scythe',two:1,atk:15,as:.8,lv:3,buy:260,ic:['scythe',0xc8ccd8,0x2a2030],lore:'Usa as duas mãos. Corte largo que acerta todos à frente.'},
  foice_ceifadora:{n:'Ceifadora',t:'eq',slot:'arma',cls:'l',wt:'scythe',two:1,atk:30,as:.78,lv:8,buy:620,fix:[['life',3]],ic:['scythe',0xd8d0e8,0x5a1a2a],lore:'Cada colheita alimenta quem a empunha.'},
  grimorio_cura:{n:'Grimório da Cura',t:'eq',slot:'escudo',cls:'m',sh:'tome',heal:1,lv:1,buy:120,col:0xe8dcb8,fix:[['mp',20],['regen',2]],ic:['tome',0xe8dcb8,0xe8c050],lore:'Com este livro na mão, suas magias deixam de queimar e passam a curar. Troca as habilidades do Mago pelas do Curandeiro.'},
  tomo_chamas:{n:'Tomo das Chamas',t:'eq',slot:'escudo',cls:'m',sh:'tome',lv:4,buy:260,col:0x8a2a1a,fix:[['skill',10],['int',2]],ic:['tome',0x8a2a1a,0xffa040],lore:'Para quem prefere ver o mundo arder.'},
  adaga:{n:'Adaga de Ferro',t:'eq',slot:'arma',cls:'l',wt:'dagger',atk:5,as:1.25,lv:1,buy:60,ic:['dagger',0xd8dee8,0x4a3020]},
  adaga_serr:{n:'Adaga Serrilhada',t:'eq',slot:'arma',cls:'l',wt:'dagger',atk:12,as:1.2,lv:6,buy:320,fix:[['crit',3]],ic:['dagger',0xb8c4d0,0x6a2a2a]},
  adaga_sec:{n:'Adaga de Mão Esquerda',t:'eq',slot:'escudo',cls:'l',sh:'dagger',lv:1,buy:40,fix:[['aspd',5]],ic:['dagger',0xc8ced8,0x2a2a34]},
  presa_noturna:{n:'Presa Noturna',t:'eq',slot:'escudo',cls:'l',sh:'dagger',lv:6,buy:280,fix:[['crit',4],['aspd',6]],ic:['dagger',0x8a7aaa,0x1e1a2a]},
  cajado_ossos:{n:'Cajado de Ossos',t:'eq',slot:'arma',cls:'m',wt:'staff',atk:22,lv:11,u:1,orb:0xb07aff,fix:[['skill',12],['vsUndead',15]],ic:['staff',0xd8d0c0,0xb07aff],lore:'O Abade nunca precisou de bengala. Precisava de obediência.'},
  // armor
  armadura_rec:{n:'Armadura de Recruta',t:'eq',slot:'peito',cls:'g',def:6,lv:1,buy:80,col:0x8a929e,ct:'plate',ic:['plate',0x9aa2ae,0x5a3a22]},
  peitoral_aco:{n:'Peitoral de Aço',t:'eq',slot:'peito',cls:'g',def:15,lv:7,buy:480,col:0xa8b0bc,ct:'plate',fix:[['hp',20]],ic:['plate',0xb8c0cc,0xc8a050]},
  armadura_real:{n:'Armadura do Rei Goblin',t:'eq',slot:'peito',cls:'g',def:22,lv:12,u:1,col:0xb89a4a,ct:'plate',fix:[['vit',4],['vsGoblin',15]],ic:['plate',0xc8a850,0x6a4a2a],lore:'Forjada com ouro roubado de três vilas. Ainda cheira a fumaça.'},
  coifa:{n:'Coifa de Malha',t:'eq',slot:'cabeca',hd:'coif',def:4,lv:3,buy:110,col:0x8a909a,ic:['helm',0x9aa0aa,0x5a6070]},
  barbuta:{n:'Barbuta',t:'eq',slot:'cabeca',hd:'barbute',cls:'g',def:8,lv:6,buy:300,col:0xa0a8b4,fix:[['crit',2]],ic:['greathelm',0xa8b0bc,0x3a3a44],lore:'Fenda em T. Você vê pouco, mas o inimigo vê menos ainda do seu rosto.'},
  elmo_alado:{n:'Elmo Alado',t:'eq',slot:'cabeca',hd:'winged',cls:'g',def:9,lv:8,buy:460,col:0xc8ccd4,col2:0xf4f0e8,fix:[['speed',4]],ic:['helm',0xd0d4dc,0xf4f0e8],lore:'As asas não voam. Mas assustam.'},
  elmo_penacho:{n:'Elmo de Penacho',t:'eq',slot:'cabeca',hd:'plumed',cls:'g',def:11,lv:9,buy:520,col:0x9aa2ae,col2:0x3a5ac8,fix:[['hp',40]],ic:['greathelm',0xa8b0bc,0x3a5ac8],lore:'Usado nos torneios da capital. Aqui, só nos campos de batalha.'},
  bacinete:{n:'Bacinete de Viseira',t:'eq',slot:'cabeca',hd:'bascinet',cls:'g',def:13,lv:10,buy:640,col:0x8a929e,fix:[['vit',3]],ic:['greathelm',0x9aa2ae,0x2a2a34],lore:'A viseira pontuda desvia golpes. E parece um focinho.'},
  brigantina:{n:'Brigantina',t:'eq',slot:'peito',def:9,lv:4,buy:220,col:0x6a3a2a,ct:'brig',fix:[['for',1]],ic:['chest',0x7a4232,0xc8c0a8]},
  sobreveste:{n:'Sobreveste de Cruzado',t:'eq',slot:'peito',cls:'g',def:13,lv:6,buy:420,col:0x8a909a,trim:0xe8e4d8,ct:'tabard',fix:[['vsUndead',12]],ic:['chest',0xe8e4d8,0xc83a3a],lore:'Malha por baixo, fé por cima.'},
  placas_negras:{n:'Armadura de Placas Negras',t:'eq',slot:'peito',cls:'g',def:18,lv:9,buy:700,col:0x3a3a48,trim:0xb83a3a,ct:'plate',fix:[['for',3]],ic:['plate',0x4a4a58,0xb83a3a],lore:'Ninguém sabe quem a usou antes. Cheira a fumaça.'},
  armadura_dourada:{n:'Armadura Dourada',t:'eq',slot:'peito',cls:'g',def:20,lv:10,buy:900,col:0xc8a850,trim:0xf4e4a8,ct:'plate',fix:[['hp',40]],ic:['plate',0xd8b860,0xf4e4a8],lore:'Brilha tanto que os goblins atacam primeiro quem a veste.'},
  tunica_cacador:{n:'Túnica de Caçador',t:'eq',slot:'peito',def:5,lv:3,buy:120,col:0x3a5a2a,ct:'leather',fix:[['des',2]],ic:['chest',0x4a6a32,0x2a3a1a]},
  manto_estrelado:{n:'Manto Estrelado',t:'eq',slot:'peito',def:6,lv:8,buy:480,col:0x1e1e44,trim:0xc8d8ff,ct:'robe',fix:[['int',3],['mp',30]],ic:['robe',0x2a2a5a,0xc8d8ff]},
  grevas_negras:{n:'Grevas Negras',t:'eq',slot:'pernas',cls:'g',def:9,lv:9,buy:380,col:0x3a3a48,ic:['legs',0x4a4a58,0x2a2a34]},
  botas_placa:{n:'Botas de Placa',t:'eq',slot:'pes',cls:'g',def:4,lv:6,buy:200,col:0x9aa2ae,ic:['boots',0xa8b0bc,0x5a6070]},
  grevas_rec:{n:'Grevas de Recruta',t:'eq',slot:'pernas',cls:'g',def:3,lv:1,buy:40,col:0x6e7480,ic:['legs',0x8a909a,0x4a505a]},
  gibao_sombra:{n:'Gibão das Sombras',t:'eq',slot:'peito',cls:'l',def:5,lv:1,buy:60,col:0x2e2a36,ct:'leather',ic:['chest',0x3a3444,0x8a2a2e]},
  // head items with personality
  galhada_lunar:{n:'Galhada Lunar',t:'eq',slot:'cabeca',hd:'antlers',def:4,lv:12,u:1,col:0xc8d8e0,fix:[['crit',5],['speed',6],['regen',3]],ic:['antlers',0xd8e8f0,0x5ad8ff],lore:'Cresce um pouco a cada lua cheia.'},
  anel_lua:{n:'Anel da Lua',t:'eq',slot:'anel',lv:12,u:1,fix:[['des',3],['int',3],['skill',10]],ic:['ring',0xc8e8ff,0x5ad8ff],lore:'Brilha fraco no escuro, como um vagalume preso.'},
  pagina:{n:'Página Rasgada',t:'quest',sell:0,ic:['scroll',0xd8c8a0,0x5a4a3a],d:'"...quatro flores-lume em volta das pedras antigas do bosque. Acenda todas de uma vez, sob a lua, e o chão vai se lembrar do caminho..."'},
  capuz_assassino:{n:'Capuz do Assassino',t:'eq',slot:'cabeca',hd:'assassin',def:2,lv:1,buy:60,col:0xd8d2c8,fix:[['crit',2]],ic:['ahood',0xe0dad0,0x8a2a2e],lore:'Branco como a lenda. Ninguém lembra do rosto.'},
  gorro:{n:'Gorro de Lã',t:'eq',slot:'cabeca',hd:'beanie',def:1,lv:1,buy:25,col:0x8a3a3a,fix:[['regen',2]],ic:['beanie',0x9a3a3a,0xe8e0d0],lore:'Tricotado pela avó de alguém. Esquenta até a alma.'},
  maca_tell:{n:'Maçã de Guilherme Tell',t:'eq',slot:'cabeca',hd:'apple',lv:3,fix:[['crit',8],['des',2]],ic:['apple',0xd8302a,0x6a4428],lore:'Uma flecha atravessou a maçã, não a cabeça. Dá sorte. Dizem.'},
  cabeca_lobo:{n:'Cabeça de Lobo',t:'eq',slot:'cabeca',hd:'wolf',def:4,lv:5,col:0x6e6a74,fix:[['vsBeast',12],['for',2]],ic:['wolfhead',0x7e7a84,0xd8d0d0],lore:'Os lobos te olham diferente quando você usa isso.'},
  chapeu_palha:{n:'Chapéu de Palha',t:'eq',slot:'cabeca',hd:'straw',def:1,lv:1,buy:20,col:0xc8a858,fix:[['speed',4]],ic:['straw',0xd8b860,0x8a2a2a]},
  coroa_flores:{n:'Coroa de Flores',t:'eq',slot:'cabeca',hd:'flowers',lv:2,fix:[['hp',20],['regen',3]],ic:['flowers',0x5a8a3a,0xf08ab0]},
  chapeu_bobo:{n:'Chapéu de Bobo',t:'eq',slot:'cabeca',hd:'jester',def:1,lv:4,col:0xa83a3a,fix:[['aspd',6],['speed',3]],ic:['jester',0xb83a3a,0x3a7a3a],lore:'Roubado de um bardo. Os goblins usavam pra rir dos prisioneiros.'},
  panela:{n:'Panela da Lia',t:'eq',slot:'cabeca',hd:'pot',def:5,lv:1,buy:35,col:0x6a6a74,ic:['pot',0x7a7a86,0x3a3a44],lore:'"Me devolve depois!" — Lia'},
  elmo_cavaleiro:{n:'Elmo de Cavaleiro',t:'eq',slot:'cabeca',hd:'greathelm',def:10,lv:7,buy:380,col:0x9aa2ae,fix:[['hp',30]],ic:['greathelm',0xa8b0bc,0xc83a3a]},
  coroa_abade:{n:'Coroa do Abade',t:'eq',slot:'cabeca',hd:'crown',def:5,lv:12,u:1,col:0xd8d0c0,fix:[['int',4],['mp',40],['vsUndead',20]],ic:['crown',0xd8d0c0,0x9a5aff],lore:'Osso entalhado com nomes de quem ele enterrou.'},
  coroa_goblin:{n:'Coroa do Rei Goblin',t:'eq',slot:'cabeca',hd:'crown',def:6,lv:13,u:1,col:0xe8c050,fix:[['crit',6],['dmg',8]],ic:['crown',0xe8c050,0x3ad04a],lore:'Grande demais pra cabeça de um goblin. Ele usava assim mesmo.'},
  capuz:{n:'Capuz de Couro',t:'eq',slot:'cabeca',hd:'hood',def:2,lv:1,buy:30,col:0x4a5a32,ic:['hood',0x4a5a32,0x2a3420]},
  elmo:{n:'Elmo de Ferro',t:'eq',slot:'cabeca',hd:'helm',def:6,lv:5,buy:180,col:0x9098a4,ic:['helm',0x9aa2ae,0x4a5262]},
  chapeu:{n:'Chapéu de Aprendiz',t:'eq',slot:'cabeca',hd:'hat',def:1,lv:1,buy:30,col:0x3a3a7a,fix:[['int',1]],ic:['hat',0x3a3a7a,0xe8c050]},
  tunica:{n:'Túnica de Linho',t:'eq',slot:'peito',def:2,lv:1,buy:30,col:0x9a8462,ct:'cloth',ic:['chest',0x9a8462,0x6a5a42]},
  gibao:{n:'Gibão de Couro',t:'eq',slot:'peito',def:6,lv:3,buy:140,col:0x7a5232,ct:'leather',ic:['chest',0x7a5232,0x4a3020]},
  cota:{n:'Cota de Malha',t:'eq',slot:'peito',def:12,lv:7,buy:420,col:0x8a909a,ct:'chain',ic:['chest',0x9aa0aa,0x5a6070]},
  veste:{n:'Veste de Aprendiz',t:'eq',slot:'peito',def:1,lv:1,buy:30,col:0x4a3a7a,ct:'robe',fix:[['mp',10]],ic:['robe',0x4a3a7a,0xe8c050]},
  manto_arc:{n:'Manto Arcano',t:'eq',slot:'peito',def:5,lv:6,buy:360,col:0x2a3a6a,ct:'robe',fix:[['mp',30],['skill',5]],ic:['robe',0x2a3a6a,0x8ab8ff]},
  calcas:{n:'Calças de Linho',t:'eq',slot:'pernas',def:1,lv:1,buy:20,col:0x5a4a3a,ic:['legs',0x5a4a3a,0x3a2e24]},
  perneiras:{n:'Perneiras de Couro',t:'eq',slot:'pernas',def:3,lv:3,buy:90,col:0x5a3e28,ic:['legs',0x6a4a2e,0x3a2818]},
  grevas:{n:'Grevas de Ferro',t:'eq',slot:'pernas',def:7,lv:7,buy:260,col:0x7a808a,ic:['legs',0x8a909a,0x4a505a]},
  luvas:{n:'Luvas de Couro',t:'eq',slot:'maos',def:1,lv:1,buy:20,col:0x6a4a2e,ic:['gloves',0x6a4a2e,0x3a2818]},
  manoplas:{n:'Manoplas',t:'eq',slot:'maos',def:4,lv:6,buy:200,col:0x8a909a,ic:['gloves',0x9aa0aa,0x4a505a]},
  botas:{n:'Botas de Couro',t:'eq',slot:'pes',def:1,lv:1,buy:20,col:0x4a3222,ic:['boots',0x5a3a26,0x2e1e14]},
  botas_mens:{n:'Botas do Mensageiro',t:'eq',slot:'pes',def:2,lv:4,col:0x6a4a6a,fix:[['speed',8]],ic:['boots',0x6a4a7a,0xe8c050],lore:'Gastas na sola, leves como pena.'},
  anel_cobre:{n:'Anel de Cobre',t:'eq',slot:'anel',lv:1,ic:['ring',0xd08a4a,0x8a4a2a]},
  anel_guardiao:{n:'Anel do Guardião',t:'eq',slot:'anel',lv:1,u:1,fix:[['vit',3],['def',5],['vsUndead',25]],ic:['ring',0x8ad0e8,0xe8e8f0],lore:'"Lembre-se de mim." O nome gravado por dentro foi raspado.'},
  colar_presas:{n:'Colar de Presas',t:'eq',slot:'colar',lv:2,fix:[['vsBeast',8]],ic:['amulet',0xf0e6d0,0x6a4a2e]},
  amuleto_cacador:{n:'Amuleto do Caçador',t:'eq',slot:'colar',lv:5,u:1,fix:[['vsBeast',15],['crit',3]],ic:['amulet',0x6ad06a,0x4a3020],lore:'Um dente do Lobo Alfa preso num cordão de couro.'}
};
const DROP_POOL=['esp_curta','esp_longa','maca','arco_curto','arco_longo','cajado','cajado_rubi','escudo_mad','escudo_fer','aljava','tomo','capuz','elmo','chapeu','tunica','gibao','cota','veste','manto_arc','calcas','perneiras','grevas','luvas','manoplas','botas','botas_mens','anel_cobre','colar_presas','adaga','adaga_serr','adaga_sec','presa_noturna','armadura_rec','peitoral_aco','grevas_rec','gibao_sombra','capuz_assassino','gorro','chapeu_palha','elmo_cavaleiro','machado_guerra','espadao','besta_leve','besta_pesada','varinha','foice','foice_ceifadora','tomo_chamas','coifa','barbuta','brigantina','sobreveste','tunica_cacador','botas_placa','elmo_alado'];
const SHOP={
  lia:['pot_hp1','pot_hp2','pot_mp','scroll','grimorio_cura','tomo_chamas','gorro','chapeu_palha','panela'],
  bruno:['espada_gelo','espadao','espada_fogo','esp_curta','machado_guerra','arco_curto','besta_leve','cajado','varinha','adaga','foice','escudo_mad','aljava','aljava_fogo','aljava_gelo','aljava_veneno','tomo','adaga_sec','armadura_rec','grevas_rec','gibao_sombra','capuz_assassino','capuz','chapeu','tunica','veste','gibao','calcas','perneiras','luvas','botas','coifa','brigantina','tunica_cacador','barbuta','sobreveste','botas_placa'],
  brunoMestre:['esp_longa','arco_longo','espadao_trovao','besta_pesada','cajado_rubi','adaga_serr','foice_ceifadora','escudo_fer','presa_noturna','elmo','elmo_cavaleiro','peitoral_aco','cota','manto_arc','grevas','manoplas','elmo_alado','elmo_penacho','bacinete','placas_negras','armadura_dourada','grevas_negras','manto_estrelado']
};
const MOBS={
  javali:{n:'Javali',lv:2,hp:70,atk:9,def:2,spd:2.4,exp:14,gold:[1,5],ai:'boar',aggro:0,fam:'fera',look:'boar',drops:[['presa',.55],['pot_hp1',.07],['coroa_flores',.02]],eq:.05,r:.42,rs:12},
  lobo:{n:'Lobo',lv:5,hp:125,atk:15,def:4,spd:3.5,exp:30,gold:[3,9],ai:'wolf',aggro:6,fam:'fera',look:'wolf',drops:[['couro',.5],['pot_hp1',.1],['cabeca_lobo',.025]],eq:.08,r:.4,rs:14},
  lobo_alfa:{n:'Lobo Alfa',lv:10,hp:620,atk:28,def:8,spd:3.9,exp:260,gold:[30,60],ai:'wolf',alpha:1,aggro:8,fam:'fera',look:'alpha',drops:[['pele_alfa',1],['couro',1],['cabeca_lobo',.5]],eq:.7,r:.55,rs:150,elite:1},
  espantalho:{n:'Espantalho',lv:5,hp:170,atk:16,def:6,spd:2.6,exp:40,gold:[2,8],ai:'scarecrow',aggro:0,fam:'assombração',look:'scarecrow',drops:[['trapo',.6],['chapeu_palha',.08],['pot_hp1',.15]],eq:.08,r:.34,rs:40},
  goblin:{n:'Goblin',lv:6,hp:140,atk:17,def:4,spd:3,exp:36,gold:[4,12],ai:'goblin',aggro:5,fam:'goblin',look:'goblin',drops:[['trapo',.5],['pot_hp1',.12],['chapeu_bobo',.03]],eq:.1,r:.34,rs:15},
  goblin_arq:{n:'Goblin Arqueiro',lv:7,hp:110,atk:16,def:3,spd:3,exp:42,gold:[5,14],ai:'archer',aggro:7,fam:'goblin',look:'goblin_arq',drops:[['trapo',.45],['pot_mp',.1],['maca_tell',.015]],eq:.1,r:.34,rs:16},
  goblin_guer:{n:'Goblin Guerreiro',lv:9,hp:270,atk:24,def:10,spd:2.4,exp:72,gold:[8,20],ai:'guard',aggro:5,fam:'goblin',look:'goblin_guer',block:1,drops:[['ferro_velho',.5],['pot_hp2',.08]],eq:.14,r:.38,rs:20},
  goblin_chefe:{n:'Goblin Chefe',lv:12,hp:2400,atk:34,def:12,spd:2.7,exp:950,gold:[150,260],ai:'boss',aggro:8,fam:'goblin',look:'goblin_chefe',boss:1,drops:[['machado_chefe',.4],['pot_hp2',1],['ferro_velho',1]],eq:1,r:.62,rs:240},
  guardiao:{n:'Guardião Esquecido',lv:11,hp:950,atk:30,def:10,spd:3.1,exp:420,gold:[60,120],ai:'ghost',aggro:10,fam:'morto-vivo',look:'guardiao',drops:[['anel_guardiao',1]],eq:.5,r:.4,rs:0,elite:1},
  goblin_xama:{n:'Goblin Xamã',lv:9,hp:150,atk:18,def:3,spd:2.8,exp:60,gold:[8,18],ai:'shaman',aggro:7,fam:'goblin',look:'goblin_xama',drops:[['pot_mp',.3],['trapo',.4]],eq:.14,r:.34,rs:20},
  goblin_rei:{n:'Rei Goblin',lv:15,hp:4200,atk:42,def:16,spd:2.8,exp:1800,gold:[300,500],ai:'boss',aggro:9,fam:'goblin',look:'goblin_rei',boss:1,drops:[['coroa_goblin',.5],['armadura_real',.35],['pot_hp2',1]],eq:1,r:.7,rs:300},
  esqueleto:{n:'Esqueleto',lv:9,hp:210,atk:22,def:7,spd:2.6,exp:64,gold:[6,16],ai:'goblin',noFlee:1,aggro:6,fam:'morto-vivo',look:'skeleton',drops:[['osso_antigo',.55],['pot_hp1',.1]],eq:.12,r:.34,rs:22},
  esq_arq:{n:'Esqueleto Arqueiro',lv:10,hp:170,atk:21,def:5,spd:2.6,exp:70,gold:[6,16],ai:'archer',aggro:8,fam:'morto-vivo',look:'skeleton_arq',drops:[['osso_antigo',.5],['pot_mp',.1]],eq:.12,r:.34,rs:22},
  espectro:{n:'Espectro',lv:11,hp:280,atk:26,def:6,spd:3,exp:95,gold:[10,22],ai:'ghost',aggro:9,fam:'morto-vivo',look:'espectro',drops:[['pot_mp',.25]],eq:.15,r:.36,rs:28},
  abade:{n:'Abade Caveira',lv:14,hp:3400,atk:38,def:12,spd:2.4,exp:1500,gold:[220,380],ai:'lich',aggro:9,fam:'morto-vivo',look:'abade',boss:1,drops:[['chave_osso',1],['coroa_abade',.5],['cajado_ossos',.35],['pot_hp2',1],['osso_antigo',1]],eq:1,r:.55,rs:280},
  espirito:{n:'Espírito do Bosque',lv:11,hp:250,atk:24,def:5,spd:3.2,exp:92,gold:[8,20],ai:'ghost',aggro:8,fam:'espírito',look:'espirito',drops:[['pot_mp',.25]],eq:.15,r:.36,rs:26},
  lobo_espectral:{n:'Lobo Espectral',lv:12,hp:300,atk:28,def:7,spd:4,exp:110,gold:[8,20],ai:'wolf',aggro:8,fam:'espírito',look:'lobo_espectral',drops:[['couro',.3],['cabeca_lobo',.04]],eq:.15,r:.42,rs:26},
  anciao:{n:'Ancião Lunar',lv:15,hp:3800,atk:40,def:12,spd:3.6,exp:1700,gold:[250,400],ai:'wolf',alpha:1,aggro:10,fam:'espírito',look:'anciao',boss:1,drops:[['galhada_lunar',.6],['anel_lua',.6],['pot_hp2',1]],eq:1,r:.8,rs:300},
  boneco:{n:'Boneco de Treino',lv:1,hp:1e9,atk:0,def:0,spd:0,exp:0,gold:[0,0],ai:'dummy',aggro:0,fam:'objeto',look:'dummy',drops:[],eq:0,r:.35,rs:0}
};
const BOT_NAMES=[['Kael_BR','g'],['Lunna','m'],['xX_Ceifador_Xx','l'],['TioDoPão','g'],['Ravena','a'],['Mago_Sem_Mana','m']];
const BOT_LINES=['alguém pt pra Toca dos Goblins?','vendo couro de lobo, chama pv','o javali me jogou na parede kkkk','dica: o javali fica tonto se bater em pedra','alguém viu o Lobo Alfa? dizem que aparece no bosque','lag hoje hein','farmando goblin arqueiro, que raiva','vou upar até o 10 hoje','o Chefe Goblin bate muito, levem poção','alguém sabe o que tem no cemitério à noite?','o Bruno vende coisa melhor depois que você ajuda ele','de noite a vila fica linda','kkkkkkk','afk 5 min, não me matem','dash no momento certo salva vida','guerreiro: bate nas costas do goblin de escudo','a porta do mausoléu no cemitério abre... lá embaixo é cheio de caveira','o forte goblin fica no fim da estrada leste, nem tenta antes do 12','assassino em furtividade passa pelos arqueiros fácil','alguém já viu a Maçã de Guilherme Tell? quero muito','to com a panela da Lia na cabeça kkkkk','bati numa planta no bosque e ela acendeu kkk que isso','tem um círculo de pedra no meio do bosque, alguém sabe pra que serve?'];
