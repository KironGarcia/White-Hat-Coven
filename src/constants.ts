/**
 * Constantes da Demo 1 — FPS de animação (tabela do brief),
 * física da run e parâmetros de spawn aleatório.
 */

// ============================================================
// 🔧 FLAGS DE DESENVOLVIMENTO — remover antes do APK final
// ============================================================
/**
 * Força a run a iniciar na fase indicada (1|2|3|4) independentemente do progresso salvo.
 * null = comportamento normal (fase 1).
 * ⚠️ Mudar para null antes de buildar o APK de produção!
 * Tipo inline para evitar import circular com progressao-fases.ts.
 */
export const DEV_FORCA_FASE: 1 | 2 | 3 | 4 | null = null;
/**
 * Força o boss Capitão Pirata a aparecer na altitude indicada (em metros).
 * null = comportamento normal.
 * ⚠️ Mudar para null antes de buildar o APK de produção!
 */
export const DEV_BOSS_CAPITAO_ALTITUDE: number | null = null;
/**
 * Se true, limpa o histórico de URLs conhecidas no startup (phishing man aparece como 1º contato).
 * ⚠️ Mudar para false antes de buildar o APK de produção!
 */
export const DEV_RESET_FLAGS_CONHECIDAS = false;
// ============================================================

// ---------- FPS de animação (tabela oficial do brief) ----------

export const FPS_MAGO_RUN = 16;
export const FPS_MAGO_INTRO = 5;
export const FPS_MAGO_MORTO = 13;
export const FPS_ORB = 13;
/** Bob do orb estático na janela de stun do boss (3 frames). */
export const FPS_ORB_STATICO = 6;
export const FPS_BOTAO_MADEIRA = 2;
export const FPS_MOEDA = 9;
/** Bob leve dos itens na loja (2 frames sobe/desce). */
export const FPS_ITEM_LOJA = 2;
/** Orb Runa: giro no próprio eixo (mesma lógica da moeda). */
export const FPS_ORB_RUNA = 8;
/** Orb Robô: pisca luz acesa/apagada (2 frames). */
export const FPS_ORB_ROBOT = 3;

/** Escala dos botões de madeira (itens da loja). +5 mm sobre 1.39 ≈ 1.58. */
export const ESCALA_BOTAO_MADEIRA = 1.58;
/**
 * Escala do BOTON-RPG nos menus: mesma largura visual do madeira 1.58
 * (102 × 1.58) no frame de 288 px, para não refazer âncoras da intro.
 */
export const ESCALA_BOTAO_RPG = (102 * ESCALA_BOTAO_MADEIRA) / 288;
/** Intro (Jogar / Sair): +3 mm na largura visual em relação ao RPG padrão. */
export const AUMENTO_BOTAO_INTRO_PX = 3 * (160 / 25.4);
export const ESCALA_BOTAO_RPG_INTRO =
  (102 * ESCALA_BOTAO_MADEIRA + AUMENTO_BOTAO_INTRO_PX) / 288;
/** +7 mm no Sair da loja (3 mm originais + 4 mm deste ajuste) vs o madeira antigo. */
export const AUMENTO_SAIR_LOJA_PX = 7 * (160 / 25.4);
/** Tempo do pose agachado no pouso (sensação de amortecer). */
export const DURACAO_AGACHADO_S = 0.09;
/** Tempo do pose parado/esticado antes de ir ao ar. */
export const DURACAO_PARADO_S = 0.08;
/** Pose de morto visível antes de reviver ou encerrar a run. */
export const DURACAO_MORTO_S = 0.8;
/** Última vida na arena do boss: pose de morto curta antes de fechar. */
export const DURACAO_MORTO_BOSS_S = 0.5;
/** Ao sair da loja (e depois do boss): run congelada com contagem no centro. */
export const SEGUNDOS_RETORNO = 3;
/** Corações no começo da run (a carta de 7 dias sobe o máximo depois). */
export const VIDAS_INICIO = 2;
export const VIDAS_MAX = 2;
/** Com a carta de 7 dias ativa: 3 corações. */
export const VIDAS_COM_CARTA = 3;
/** Duração da carta de 7 dias (ms). */
export const DURACAO_CARTA_7DIAS_MS = 7 * 24 * 60 * 60 * 1000;
/** Prêmio da roleta de recorde: pacote extra. */
export const MOEDAS_BONUS_ROLETA = 50;

// ---------- Escala de renderização dos sprites (pixel art ampliada) ----------

export const ESCALA_SPRITE = 2;
/**
 * Orb com skin: +2 mm na largura visual. A orb original (azul/ouro) não muda.
 * 16 = largura lógica da orb clássica — o extra de 2 mm entra na escala.
 */
export const ESCALA_ORB_SKIN = ESCALA_SPRITE + (2 * (160 / 25.4)) / 16;
/**
 * Escala das plataformas (~8 mm menor que escala 2 na largura típica).
 * Separada do orb para não encolher o companheiro.
 */
export const ESCALA_PLATAFORMA = 1.46;
/**
 * Escala do mago na run / game over.
 * Antes era 2 (~88 px de altura); −5 mm ≈ −19 px → ~1.57.
 */
export const ESCALA_MAGO = 1.57;
/** Moeda (tamanho visual); animator arredonda px para não sangrar o frame vizinho. */
export const ESCALA_MOEDA = 1.5;

// ---------- Física da run (px/s e px/s²) ----------

/** Gravidade aplicada ao mago. */
export const GRAVIDADE = 1800;
/** Impulso vertical do salto — regra única: ao pousar numa plataforma, o mago salta. */
export const IMPULSO_SALTO = -950;
/**
 * Fase 4: o arco fica mais rápido (menos tempo no ar para mirar).
 * Gravidade e impulso sobem no mesmo fator — a altura do pulo quase não muda.
 */
export const FATOR_PULO_FASE_4 = 1.32;
/** Velocidade horizontal máxima gerada pelo tilt. */
export const VELOCIDADE_TILT_MAX = 520;
/** Multiplicador do valor do sensor (eixo x) para velocidade horizontal. */
export const SENSIBILIDADE_TILT = 900;
/**
 * Tilt só na arena do boss (a run não usa isto).
 * Mais baixo que o stun antigo (1700/980) para não “escorregar”
 * ao centrar o celular; zona morta zera o vx no centro.
 */
/** Teto e arranque da corrida na arena (a parada no centro não muda). */
export const VELOCIDADE_TILT_STUN_MAX = 640 * 1.4;
export const SENSIBILIDADE_TILT_STUN = 980 * 1.4;
/** Zona morta no centro (valor já calibrado pelo tilt.ts). */
export const ZONA_MORTA_TILT_BOSS = 0.07;
/** Já parado: limiar menor para voltar a andar (a parada continua no 0,07). */
export const ZONA_ARRANQUE_TILT_BOSS = 0.035;
/** Fora da zona morta, mínimo de velocidade — sem andar de arrasto. */
export const VELOCIDADE_MINIMA_TILT_BOSS = 180 * 1.4;
/** Intervalo de leitura do sensor de inclinação (ms). */
export const INTERVALO_SENSOR_MS = 16;

// ---------- Câmera / altitude ----------

/** Linha da tela (fração da altura) acima da qual a câmera acompanha o mago. */
export const LINHA_CAMERA = 0.45;
/** Conversão de pixels subidos para metros de altitude no HUD. */
export const PX_POR_METRO = 50;

// ---------- Spawn aleatório de plataformas ----------

/** Espaçamento vertical mínimo entre plataformas (px). */
export const GAP_PLATAFORMA_MIN = 90;
/** Espaçamento vertical máximo entre plataformas (px). */
export const GAP_PLATAFORMA_MAX = 170;
/**
 * Distância horizontal máxima entre centros de plataformas vizinhas (px).
 * Cabe no salto + tilt, sem deixar a próxima inacessível na outra ponta da tela.
 */
export const ALCANCE_HORIZONTAL_MAX = 200;
/** Margem horizontal mínima até as bordas da tela (px). */
export const MARGEM_HORIZONTAL = 8;
/** Distância acima do topo da tela em que novas plataformas nascem (px). */
export const MARGEM_SPAWN_TOPO = 60;
/** 1 cm em px de tela (mesmo critério dos mm do boss: 160 dpi). */
export const CM_EM_PX = 10 * (160 / 25.4);
/** Oscilação da plataforma móvel: 1 cm pra cada lado (não atravessa a tela). */
export const DESLOCAMENTO_PLATAFORMA_MOVEL_PX = CM_EM_PX;
/** Um vai-e-volta completo da plataforma móvel (antes 3,4 s). */
export const PERIODO_PLATAFORMA_MOVEL_S = 2.0;
/** Chance de nascer móvel (fase 2+), no meio das normais. */
export const CHANCE_PLATAFORMA_MOVEL = 0.27;
/** Chance de nascer quebradiza (fase 3+). */
export const CHANCE_PLATAFORMA_QUEBRA = 0.24;
/** Pisca 1 vez no pouso, espera um pouco e some. */
export const PISCAS_PLATAFORMA_QUEBRA = 1;
export const DURACAO_MEIO_PISCA_QUEBRA_S = 0.2;
/** Tempo sólido depois do pisca — some em 0,5 s. */
export const ATRASO_SUMICO_QUEBRA_S = 0.5;

// ---------- Moedas ----------

/** Chance de uma plataforma nova nascer com moeda em cima (30%). */
export const CHANCE_MOEDA = 0.3;
/** Distância vertical da moeda acima do centro da plataforma (px). */
export const ALTURA_MOEDA_SOBRE_PLATAFORMA = 14;

// ---------- Fase 4 — dificuldade extra ----------

/**
 * Redução de 5% nas chances de plataformas móveis e quebradizas na fase 4.
 * Dá espaço para os novos elementos (zombies + moedas piratas) sem sobrecarregar.
 */
export const FATOR_REDUCAO_ESPECIAL_FASE4 = 0.95;

/** Chance de um mini-zombie nascer em plataformas fixas da fase 4. */
export const CHANCE_MINIBOT_ZOMBIE_FASE4 = 0.22;
/** Velocidade horizontal do mini-zombie (px/s). */
export const VELOCIDADE_MINIBOT_ZOMBIE_PX = 42;
/** Escala de renderização do mini-zombie na run (+2 mm em relação à versão anterior). */
export const ESCALA_MINIBOT_ZOMBIE_RUN = 0.78;
/** FPS da animação de caminhada do mini-zombie. */
export const FPS_MINIBOT_ZOMBIE = 4;

/** Chance de uma moeda nascer como moeda pirata na fase 4. */
export const CHANCE_MOEDA_PIRATA_FASE4 = 0.30;
/**
 * Penalidade em moedas ao tocar uma moeda pirata durante a run.
 * Menos que na arena (5) para não frustrar demais.
 */
export const PENALIDADE_MOEDA_PIRATA_RUN = 3;

// ---------- Orb (companheiro) ----------

/** Fator de perseguição do orb ao mago (quanto maior, mais colado). */
export const ORB_FATOR_PERSEGUICAO = 6;
/** Deslocamento do orb em relação ao mago (px de tela). */
export const ORB_OFFSET_X = -46;
export const ORB_OFFSET_Y = -30;
/** Só orb com skin: +1 mm de distância do mago (a original não muda). */
export const ORB_SKIN_EXTRA_DISTANCIA_PX = 1 * (160 / 25.4);
/**
 * Afastamento quando o mago encosta na orb: mais rápido que a perseguição,
 * mas interpolado (nunca 1.0 — isso virava micro-teleporte).
 */
export const ORB_FATOR_AFASTAMENTO = 16;

// ---------- Áudio (APK: android.resource, sem downloadAsync) ----------
/** Pacote Android — precisa bater com app.json. */
export const PACOTE_ANDROID = 'com.whitehatcoven.demo1';
/** Volume da música na intro. */
export const VOLUME_MUSICA_INTRO = 1;
/** 30% a menos que a intro (0.7) durante a subida. */
export const VOLUME_MUSICA_RUN = 0.7;
/** Música do boss (aviso + arena): +15% sobre os 30%. */
export const VOLUME_MUSICA_BATALHA = 0.3 * 1.15;
/** 30% a menos no pulo. */
export const VOLUME_SFX_PULO = 0.7;
/** Disparo em 10%. */
export const VOLUME_SFX_DISPARO = 0.1;
/** Moeda mais baixa (50%). */
export const VOLUME_SFX_MOEDA = 0.5;

// ---------- Plataforma fake (invasão) / régua de bosses ----------

/**
 * Grade oficial de altitude (m) dos bosses.
 * Depois de 1100: soma 150 a cada um.
 */
export const ALTITUDES_BOSS_OFICIAL = [
  150, 350, 500, 650, 800, 950, 1100,
] as const;
/** Depois da última da lista, cada boss seguinte. */
export const PASSO_BOSS_DEPOIS_DA_GRADE = 150;
/** Primeiro boss de produto. */
export const ALTITUDE_GRADE_BOSS = ALTITUDES_BOSS_OFICIAL[0];
/** Primeira fake da run (sempre a grade oficial no APK). */
export const ALTITUDE_FAKE_FASE_1 = ALTITUDE_GRADE_BOSS;
/**
 * Polimento de aula: primeira fake em 10 m. Desligado — a run usa 150 m.
 * Para reativar, volte o atalho em altitudePrimeiroBoss().
 */
export const ALTITUDE_FAKE_DEV_POLIMENTO = 10;
/**
 * Polimento de aula: trava a tag (sem sorteio). Desligado.
 *
 * http://pishing-man/email | /wpp | /vishing
 * http://zombie-net/smart-tv | /camera | /botnet
 * http://capitan-pix/pix | /yape | /zelle
 */
export const URL_AULA_POLIMENTO = '';
/** Chance por plataforma nova depois da fake garantida — baixa para não nascerem seguidas. */
export const CHANCE_PLATAFORMA_FAKE = 0.1;
/** Primeira loja extra (não compete com fake nem com a cadeia). */
export const ALTITUDE_PRIMEIRA_TIENDA = 50;
/** Segunda loja; depois uma a cada PASSO_TIENDA_METROS (200, 500, 800…). */
export const ALTITUDE_MIN_PLATAFORMA_TIENDA = 200;
/** Distância (m) entre faixas depois da segunda loja. */
export const PASSO_TIENDA_METROS = 300;
/**
 * Fração da altura da arte da loja onde fica o “chão” de pouso.
 * 0 = topo; 0.5 = meio (entra na loja em vez de bater no telhado).
 */
export const FRACAO_PISO_PLATAFORMA_TIENDA = 0.5;

// ---------- Persistência ----------

/** Chave do recorde de altitude no armazenamento local (isolado da Demo 1). */
export const CHAVE_RECORDE_ALTITUDE = '@whc_demo1/recorde_altitude';
/** Carteira total de moedas (todas as runs + IAP futuros — nunca a sessão sozinha). */
export const CHAVE_MOEDAS_TOTAL = '@whc_demo1/moedas_total';
/** Poções de vida compradas na loja (ainda não usadas na run). */
export const CHAVE_POCOES_VIDA = '@whc_demo1/pocoes_vida';
/** Fim da carta de 7 dias (timestamp ms) — 3 corações enquanto vigente. */
export const CHAVE_CARTA_7DIAS_ATE = '@whc_demo1/carta_7dias_ate';
/** Skins compradas (lista de ids — inventário do jogador). */
export const CHAVE_SKINS_COMPRADAS = '@whc_demo1/skins_compradas';
/** Gorro equipado no mago (id ou vazio = mago original). */
export const CHAVE_SKIN_GORRO_EQUIPADA = '@whc_demo1/skin_gorro_equipada';
/** Skin equipada na orb companheira (id ou vazio = orb azul original). */
export const CHAVE_SKIN_ORB_EQUIPADA = '@whc_demo1/skin_orb_equipada';
/** Flags/encantos já obtidos (lista de URLs do boss). */
export const CHAVE_FLAGS_CONHECIDAS = '@whc_demo1/flags_conhecidas';
/** Estado pendente de invasão (sair ao Oráculo sem perder o progresso). */
export const CHAVE_INVASAO_PENDENTE = '@whc_demo1/invasao_pendente';
/** Idioma do jogo (pt / en / es) na demo standalone. */
export const CHAVE_IDIOMA_JOGO = '@whc_demo1/idioma';
/** Tutorial de tap-para-atirar (só a primeira vez no primeiro boss). */
export const CHAVE_TUTORIAL_TAP_BOSS = '@whc_demo1/tutorial_tap_boss';
/** Tutorial da hit-box (“dispare aqui”) — uma vez. */
export const CHAVE_TUTORIAL_HIT_BOX = '@whc_demo1/tutorial_hit_box';
/** Tutorial do patch (“colete este item”) — uma vez. */
export const CHAVE_TUTORIAL_PATCH = '@whc_demo1/tutorial_patch';
/** Tutorial: pendrive para o roubo do Capitão (uma vez no jogo). */
export const CHAVE_TUTORIAL_ROUBO_CAPITAO = '@whc_demo1/tutorial_roubo_capitao';
/** Tutorial da plataforma-loja na run (só a primeira vez). */
export const CHAVE_TUTORIAL_LOJA_RUN = '@whc_demo1/tutorial_loja_run';
/** Tutorial da plataforma fake na run (só a primeira vez). */
export const CHAVE_TUTORIAL_ARMADILHA_RUN = '@whc_demo1/tutorial_armadilha_run';
/** Já rodou o wipe único para gravação (não apaga de novo). */
export const CHAVE_RESET_GRAVACAO = '@whc_demo1/reset_gravacao_2026_09_03';
/** Uma vez: tira a carta de 7 dias que a roleta podia dar sem mostrar. */
export const CHAVE_RESET_CARTA_FANTASMA = '@whc_demo1/reset_carta_fantasma_2026_09_04';
/** Duração dos avisos da arena (tap / hit-box / patch). */
export const DURACAO_TUTORIAL_ARENA_S = 3;

// ---------- Arena do boss (layout em px da arte 470×709) ----------

export const MARCO_ART_LARGURA = 470;
export const MARCO_ART_ALTURA = 709;

/** Retângulos internos do PNG do marco (470×709), medidos no alpha. */
export const MARCO_REGIOES_ART = {
  url: { x: 69, y: 18, w: 298, h: 34 },
  bossBox: { x: 34, y: 65, w: 404, h: 157 },
  divisor: { y: 222, h: 16 },
  arena: { x: 34, y: 238, w: 404, h: 423 },
  pisoTopoArt: 661,
} as const;

export const FPS_PISHING_MAN = 3;
/** Hit do boss: 2 frames, 2 ciclos, depois volta ao idle. */
export const FPS_PISHING_MAN_HIT = 3;
export const CICLOS_HIT_BOSS = 2;
export const FRAMES_HIT_BOSS = 2;
export const DURACAO_HIT_BOSS_S =
  (CICLOS_HIT_BOSS * FRAMES_HIT_BOSS) / FPS_PISHING_MAN_HIT;
/** HAHAHA: sheet 4 frames; começa no riso e dá um “há” extra (fecha + abre). */
export const FPS_PISHING_MAN_HAHAHA = 5;
export const FRAMES_HAHAHA_BOSS = 4;
/** Poses na tela: abre, fecha, abre + fecha, abre. */
export const PASSOS_HAHAHA_BOSS = 5;
export const DURACAO_HAHAHA_BOSS_S = PASSOS_HAHAHA_BOSS / FPS_PISHING_MAN_HAHAHA;
/** Frame 0 é pose normal (boca fechada); começa no riso e segue o ciclo abre/fecha. */
export const FRAME_INICIAL_HAHAHA_BOSS = 1;
/** +2,5 mm além de preencher o retângulo. */
export const AUMENTO_BOSS_PX = 2.5 * (160 / 25.4);
/** Zombie-net: −3 mm para caber no marco sem cortar. */
export const REDUCAO_ZOMBIE_NET_PX = 3 * (160 / 25.4);
/** Capitão Pix: −5 mm (estava grande demais no marco). */
export const REDUCAO_CAPITAO_PIX_PX = 5 * (160 / 25.4);
/** Idle: desce 1 mm para a base encostar sem cortar o pé. */
export const DESCIDA_IDLE_BOSS_PX = 1 * (160 / 25.4);
/** Número de HP do boss (+1 mm). */
export const TAMANHO_FONTE_HP_BOSS = 14 + 1 * (160 / 25.4);
/** Contador de moedas da arena: o dobro do tamanho anterior. */
export const TAMANHO_FONTE_MOEDAS_ARENA = (TAMANHO_FONTE_HP_BOSS - 5) * 2;
/** Ícone do HUD de moedas (acompanha o número maior). */
export const ESCALA_MOEDA_HUD_ARENA = 0.72;
/** Mini-bot: 2 frames; dancinha a 2 fps. */
export const FPS_MINI_BOT_ZOMBIE = 2;
/** Spawn: tenta seguido; se o dado falhar, tenta de novo logo (não some 3 s). */
export const INTERVALO_MINI_BOT_S = 1.8;
export const CHANCE_MINI_BOT_QUEDA = 0.72;
export const INTERVALO_RETRY_MINI_BOT_S = 0.45;
/** Dancinha no lugar: vira no mesmo relógio dos frames (2 fps). */
export const PASSOS_DANCA_MINI_BOT = 3;
export const TEMPO_PASSO_DANCA_MINI_BOT_S = 1 / FPS_MINI_BOT_ZOMBIE;
/** Oscilação horizontal da dancinha (2 mm). */
export const AMPLITUDE_DANCA_MINI_BOT_PX = 2 * (160 / 25.4);
/** Queda do mini-bot (px/s) — número direto para o Metro pegar de verdade. */
export const VELOCIDADE_QUEDA_MINI_BOT = 320;
/** Um pisca e some depois de sequestra a orb. */
export const DURACAO_PISCA_MINI_BOT_S = 0.36;
/** Duração do hihihi (para abaixar a música e voltar). */
export const DURACAO_HIHIHI_MINIBOT_S = 0.32;
/** Orb infectada no topo: espera antes de começar a varredura. */
export const ESPERA_RAJADA_ORB_S = 0.6;
/**
 * Quanto a orb sobe até o topo depois do sequestro (era 1,6).
 * +2 no número: o roubo lê na hora, sem misturar com o primeiro tiro.
 */
export const FATOR_SUBIDA_ORB_INFECTADA = 1.6 + 2;
/** Tempo para a orb infectada ir de um tiro ao próximo (varredura + disparo). */
export const INTERVALO_TIRO_RAJADA_S = 0.3;
/** Queda da rajada: 10% mais lenta que o disparo do mago (4200). */
export const VELOCIDADE_DISPARO_INFECTADO = 3780;
/** 1 mm: encostado na borda é seguro; um milímetro para dentro toma hit. */
export const MARGEM_JUSTA_RAJADA_PX = 1 * (160 / 25.4);
/** Orb pisca duas vezes no topo antes de voltar à cabeça. */
export const DURACAO_PISCA_VOLTA_ORB_S = 0.8;

/** Capitão Pix: chuva de moedas (muitas boas, algumas piratas). */
export const CHANCE_MOEDA_ARENA_CAPITAO = 0.48;
export const CHANCE_MOEDA_PIRATA_ARENA = 0.2;
export const MAX_MOEDAS_ARENA = 7;
export const VELOCIDADE_MOEDA_ARENA = 207;
export const ESCALA_BAU_PIX = 0.82;
export const INTERVALO_BAU_PIX_S = 4;
export const DURACAO_FRAME_BAU_PIX_S = 0.7;
export const VELOCIDADE_BAU_PIX = 420;
/** Roubo: −5 moedas a cada 1 s até zerar ou pegar o patch. */
export const PENALIDADE_MOEDA_PIRATA = 5;
export const PENALIDADE_ROUBO_S = 5;
export const INTERVALO_ROUBO_S = 1;
export const FPS_PATCH = 2;
export const FPS_VIRUS_BOSS = 6;
/** Vírus: −5 mm na largura visual (sprite lógico 89 px). */
export const ESCALA_VIRUS_BOSS = 0.72 - (5 * (160 / 25.4)) / 89;
/** Mini-bot: vírus + 3 mm na largura visual. */
export const ESCALA_MINI_BOT_ZOMBIE =
  (89 * ESCALA_VIRUS_BOSS + 3 * (160 / 25.4)) / 56;
/** Anzol: −2 mm na largura visual (sprite lógico 37 px) — +3 mm sobre o tamanho anterior. */
export const ESCALA_ANZOL = 1.35 - (2 * (160 / 25.4)) / 37;
/** Carrinho: −5 mm na largura visual (sprite lógico 50 px). */
export const ESCALA_CARRINHO_ANZOL = 1.45 - (5 * (160 / 25.4)) / 50;
/** Linha neon entre carrinho e anzol. */
export const COR_LINHA_ANZOL = '#7CFF3F';
export const LARGURA_LINHA_ANZOL = 3;

/** Altura visual das hit-box (igual à escala anterior). */
export const ESCALA_HITBOX_BOSS_ALTURA = 2.2;
/** Largura: −1 mm original e mais 5 mm agora. */
export const ESCALA_HITBOX_BOSS_LARGURA =
  2.2 - (1 + 5) * (160 / 25.4) / 56;
/** Patch estático: −5 mm e depois +2 mm na largura visual (sprite lógico 65 px). */
export const ESCALA_PATCH = 1.5 - (3 * (160 / 25.4)) / 65;
/** Velocidade vertical das plataformas na arena (px/s). */
export const VELOCIDADE_PLATAFORMA_BOSS = 70;
/** Gap vertical entre hit-boxes: menos plataformas, sem ficar inalcançável. */
export const GAP_HITBOX_BOSS_MIN = 105;
export const GAP_HITBOX_BOSS_MAX = 155;
/** Chance de etiqueta .mwr1 ao criar hit-box (Phishing Man). */
export const CHANCE_MWR1_PHISHING = 0.18;
/** Chance de nascer patch junto com uma hit-box nova (arena antiga). */
export const CHANCE_PATCH_BOSS = 0.1;
/** Patch caindo na luta nova: raro sem encanto. */
export const CHANCE_PATCH_QUEDA = 0.05;
/** Super-orb: patch cai com mais frequência. */
export const CHANCE_PATCH_QUEDA_ENCANTO = 0.27;
/** Primeiro patch só depois deste tempo na arena. */
export const ATRASO_PRIMEIRO_PATCH_S = 4;
/** Intervalo entre drops (vírus / patch) — chuva mais frenética. */
export const INTERVALO_DROP_BOSS_S = 0.55;
export const MAX_VIRUS_NA_TELA = 4;
/** Tiros da orb azul para matar vírus e mini-bot. */
export const HITS_VIRUS_PARA_MORRER = 3;
/** Com encanto (orb dourada / SUPER): 2 tiros. */
export const HITS_VIRUS_ENCANTO_PARA_MORRER = 2;
/** Queda do vírus: dá para desviar no tilt. */
export const VELOCIDADE_VIRUS_BOSS = 242;
/** Patch cai na mesma velocidade do vírus, pra não tapar o bicho. */
export const VELOCIDADE_PATCH_QUEDA = VELOCIDADE_VIRUS_BOSS;
export const INVENCIVEL_APOS_VIRUS_S = 0.9;
/** Carrinho anda na faixa. */
export const VELOCIDADE_CARRINHO_ANZOL = 95;
/** Espera recolhido: 7 s na entrada da tela e entre cada ciclo desce/sobe. */
export const PATRULHA_ANZOL_S = 7;
/** Descida rápida até a altura da orb. */
export const DESCIDA_ANZOL_S = 0.35;
/** Anzol fica parado embaixo antes de subir. */
export const PARADO_ANZOL_S = 3;
/** Tempo da subida de volta ao carrinho. */
export const SUBIDA_ANZOL_S = 2;
/** Orb fica amarrada no anzol no topo, depois que chega. */
export const SEQUESTRO_ORB_S = 7;
/** Pisca no anzol antes de voltar à cabeça. */
export const DURACAO_PISCA_SOLTA_ORB_S = 0.7;
/** Folga mínima (2 cm) entre a base da caixa-hit e a orb. */
export const MARGEM_HIT_ORB_PX = 2 * (160 / 25.4);
/** Teto da caixa-hit: 5 mm abaixo do anzol recolhido (não atravessa o meio). */
export const MARGEM_HIT_ANZOL_PX = 5 * (160 / 25.4);
/** Ponta do anzol na arte 37×56 (pixel da farpa roxa). */
export const PONTA_ANZOL_ART = { x: 6, y: 33, largura: 37, altura: 56 };
/** A ponta entra só 5 mm no topo da orb. */
export const MARGEM_PONTA_ORB_PX = 5 * (160 / 25.4);
/** Pisca da caixa-hit (2 frames do coração do boss). */
export const FPS_HIT_BOX_BOSS = 5;
/** Janela do ponto frágil após pegar o patch. */
export const DURACAO_STUN_PATCH_S = 10;
/** Encanto não alonga a janela — só faz o patch cair mais. */
export const DURACAO_STUN_PATCH_ENCANTO_S = 10;
/** Fala do Gray Mage ao zerar a vida do Phishing Man. */
export const TEXTO_VITORIA_BOSS_PHISHING =
  'Você conseguiu proteger seus sistemas, pequeno mago. Te felicito.';
/** Fala após o último boss da demo (900 m / fase 3). */
export const TEXTO_PRE_ALFA_FIM_DEMO =
  'A demo acabou. Obrigado por jogar! Em breve teremos novidades do lançamento.';
/** Dano do disparo normal (sem pelota dourada / super). */
export const DANO_DISPARO_NORMAL = 1;
/** Dano com encanto do Oráculo (orb dourada). */
export const DANO_DISPARO_ENCANTO = 5;
/** Velocidade do disparo: laser até a linha (não dura segundos). */
export const VELOCIDADE_DISPARO_BOSS = 4200;
/** Recarga mínima entre taps — não espera a animação do tiro anterior. */
export const INTERVALO_DISPARO_BOSS_S = 0.05;
/** Teto de tiros na tela ao mesmo tempo. */
export const MAX_DISPAROS_NA_TELA = 8;
/** Saída é um flash (quase 1 quadro). */
export const DURACAO_SALIDA_DISPARO_S = 0.03;
/** Impacto: 2 frames em flash rápido. */
export const DURACAO_IMPACTO_DISPARO_S = 0.08;
export const FLASH_IMPACTO_DISPARO_S = 0.03;
