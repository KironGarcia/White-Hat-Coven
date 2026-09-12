/**
 * Mapa central de assets da Demo 1.
 * Todos os arquivos vivem na raiz do WHC (midia/ e sprites-piskel/).
 * Nenhum path fora desta lista pode ser usado no código.
 *
 * Os grids de frames foram medidos pixel a pixel nos sheets do Piskel:
 *   Mago.png ............... 414x66 = 9 frames de 46x66 (backup do ciclo antigo)
 *   Mago-intro.png ......... 123x44 = 3 frames de 41x44
 *   Bonton-madera-presion .. 204x26 = 2 frames de 102x26 (idle / pressionado)
 *   BOTON-RPG .............. 576x77 = 2 frames de 288x77 (idle / pressionado)
 *   Moneda-plataforma ...... 108×36 = 4 frames de 27px (coleta na run)
 *   Moneda-pirata .......... mesmo grid 4×27; infectada — não usar na run
 *
 * Pixel art no celular: os PNGs usados pelo jogo estão pré-escalados 8x
 * (nearest-neighbor). O código ainda usa tamanhos LOGICOS (ex.: 46x44) para layout.
 * Masters 1x para editar no Piskel: subpastas master dentro de mago-sprites, ORBs, Tienda e Boss.
 * Header/fundo/rodapé/moldura/itens da loja também vão 8x nearest (tamanhos lógicos 1x).
 */

export interface SpriteSheet {
  /** Fonte da imagem (require estático — exigência do Metro). */
  imagem: number;
  larguraFrame: number;
  alturaFrame: number;
  totalFrames: number;
}

export interface ImagemEstatica {
  imagem: number;
  largura: number;
  altura: number;
}

// ---------- Fundos (estáticos, sem animação) ----------

export const FUNDO_INTRO = require('../midia/tela-intro.png');
export const FUNDO_FASE_1 = require('../midia/fondo-fase1.png');
export const FUNDO_FASE_2 = require('../midia/fondo-fase2.png');
export const FUNDO_FASE_3 = require('../midia/fondo-fase3.png');
export const FUNDO_FASE_4 = require('../midia/fondo-fase4.png');

// ---------- Mago — poses estáticas da run ----------

/** Em pé / esticado — logo após o agachado. */
export const MAGO_PARADO: ImagemEstatica = {
  imagem: require('../sprites-piskel/mago-sprites/Mago-parado.png'),
  largura: 40,
  altura: 44,
};

/** Pouso agachado — no instante em que toca a plataforma. */
export const MAGO_AGACHADO: ImagemEstatica = {
  imagem: require('../sprites-piskel/mago-sprites/mago-agachado.png'),
  largura: 42,
  altura: 39,
};

/** No ar — braços abertos enquanto sobe/cai. */
export const MAGO_AR: ImagemEstatica = {
  imagem: require('../sprites-piskel/mago-sprites/Mago-ar.png'),
  largura: 46,
  altura: 44,
};

/** Sem plataforma — pose de morto na run e no game over. */
export const MAGO_MORTO: ImagemEstatica = {
  imagem: require('../sprites-piskel/mago-sprites/Mago-muerto.png'),
  largura: 46,
  altura: 44,
};

/** Coração cheio do HUD (some da tela quando perde a vida). */
export const CORAZON: ImagemEstatica = {
  imagem: require('../sprites-piskel/mago-sprites/Corazon.png'),
  largura: 8,
  altura: 8,
};

/**
 * Caixa lógica do mago na física (pés alinhados embaixo).
 * Usa a maior pose (ar) para a hitbox ficar estável entre estados.
 */
export const MAGO_CAIXA: ImagemEstatica = {
  imagem: MAGO_AR.imagem,
  largura: 46,
  altura: 44,
};

export const MAGO_INTRO_FRAMES: number[] = [
  require('../sprites-piskel/mago-sprites/Mago-intro-f1.png'),
  require('../sprites-piskel/mago-sprites/Mago-intro-f2.png'),
  require('../sprites-piskel/mago-sprites/Mago-intro-f3.png'),
];

export const MAGO_INTRO_TAMANHO = { largura: 41, altura: 44 };

/** Sheet antigo em faixa — backup; intro usa MAGO_INTRO_FRAMES. */
export const MAGO_INTRO: SpriteSheet = {
  imagem: require('../sprites-piskel/mago-sprites/Mago-intro.png'),
  larguraFrame: 41,
  alturaFrame: 44,
  totalFrames: 3,
};

/** Sheet antigo de 9 frames — backup; a run não usa mais. */
export const MAGO_RUN: SpriteSheet = {
  imagem: require('../sprites-piskel/mago-sprites/Mago.png'),
  larguraFrame: 46,
  alturaFrame: 66,
  totalFrames: 9,
};

// ---------- Orb — poses estáticas da run ----------

/** Com o mago agachado ou parado/esticado. */
export const ORB_NORMAL: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/Orb-azul-normal.png'),
  largura: 16,
  altura: 21,
};

/** Mago no ar subindo (vy < 0). */
export const ORB_SUBIDA: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/Orb-azul-subida.png'),
  largura: 16,
  altura: 31,
};

/** Mago no ar caindo (vy > 0). */
export const ORB_BAJADA: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/Orb-azul-bajada.png'),
  largura: 16,
  altura: 26,
};

/** Caixa lógica do orb (maior pose = subida). */
export const ORB_CAIXA: ImagemEstatica = {
  imagem: ORB_SUBIDA.imagem,
  largura: 16,
  altura: 31,
};

/** Orb estático (stun do boss) — 3 frames, sheet 78×29. */
export const ORB_STATICO_FRAMES: number[] = [
  require('../sprites-piskel/ORBs/Orb-azul-statico-f1.png'),
  require('../sprites-piskel/ORBs/Orb-azul-statico-f2.png'),
  require('../sprites-piskel/ORBs/Orb-azul-statico-f3.png'),
];
export const ORB_STATICO_TAMANHO = { largura: 26, altura: 29 };

/** Orb dourada da run (encanto ativo). */
export const ORB_OURO_NORMAL: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/Orb-ouro-normal.png'),
  largura: 16,
  altura: 21,
};
export const ORB_OURO_SUBIDA: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/Orb-ouro-subida.png'),
  largura: 16,
  altura: 31,
};
export const ORB_OURO_BAJADA: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/Orb-ouro-bajada.png'),
  largura: 16,
  altura: 26,
};

/** Super orb no stun (encanto) — 3 frames, sheet 87×34. */
export const ORB_STATICO_OURO_FRAMES: number[] = [
  require('../sprites-piskel/ORBs/Super-Orb-statico-f1.png'),
  require('../sprites-piskel/ORBs/Super-Orb-statico-f2.png'),
  require('../sprites-piskel/ORBs/Super-Orb-statico-f3.png'),
];
export const ORB_STATICO_OURO_TAMANHO = { largura: 29, altura: 34 };

/** Disparo: faísca de saída. */
export const DISPARO_SALIDA: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/disparo-salida.png'),
  largura: 7,
  altura: 11,
};

/** Disparo: projétil em viagem (sobe). */
export const DISPARO_VIAGEM: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/Disparo-viagem.png'),
  largura: 5,
  altura: 37,
};

/** Disparo: impacto na linha do marco (2 frames). */
export const DISPARO_IMPACTO_FRAMES: number[] = [
  require('../sprites-piskel/ORBs/disparo-impacto-f1.png'),
  require('../sprites-piskel/ORBs/disparo-impacto-f2.png'),
];
export const DISPARO_IMPACTO_TAMANHO = { largura: 30, altura: 11 };

/** Disparo dourado (encanto) — mesma geometria do azul. */
export const DISPARO_SALIDA_OURO: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/disparo-salida-ouro.png'),
  largura: 7,
  altura: 11,
};
export const DISPARO_VIAGEM_OURO: ImagemEstatica = {
  imagem: require('../sprites-piskel/ORBs/Disparo-viagem-ouro.png'),
  largura: 5,
  altura: 37,
};
export const DISPARO_IMPACTO_OURO_FRAMES: number[] = [
  require('../sprites-piskel/ORBs/disparo-impacto-ouro-f1.png'),
  require('../sprites-piskel/ORBs/disparo-impacto-ouro-f2.png'),
];

// ---------- UI ----------

export const BOTAO_MADEIRA: SpriteSheet = {
  imagem: require('../sprites-piskel/Tienda/Bonton-madera-presion.png'),
  larguraFrame: 102,
  alturaFrame: 26,
  totalFrames: 2,
};

/** Menu / intro / aviso — sheet idle + pressionado. */
export const BOTAO_RPG: SpriteSheet = {
  imagem: require('../sprites-piskel/mago-sprites/BOTON-RPG.png'),
  larguraFrame: 288,
  alturaFrame: 77,
  totalFrames: 2,
};

export const MOEDA_PLATAFORMA_FRAMES: number[] = [
  require('../sprites-piskel/Tienda/Moneda-plataforma-f1.png'),
  require('../sprites-piskel/Tienda/Moneda-plataforma-f2.png'),
  require('../sprites-piskel/Tienda/Moneda-plataforma-f3.png'),
  require('../sprites-piskel/Tienda/Moneda-plataforma-f4.png'),
];

/** Tamanho de cada frame da moeda de plataforma (célula centrada). */
export const MOEDA_PLATAFORMA_TAMANHO = { largura: 36, altura: 36 };

/**
 * Moeda pirata (infectada) — outro propósito / loja / boss.
 * NÃO usar como coleta da run.
 * Sheet: 108×36 = 4 frames de 27px (não 3×36).
 */
export const MOEDA_PIRATA: SpriteSheet = {
  imagem: require('../sprites-piskel/Tienda/Moneda-pirata.png'),
  larguraFrame: 27,
  alturaFrame: 36,
  totalFrames: 4,
};

// ---------- Plataformas (estáticas) ----------

export const PLATAFORMAS: ImagemEstatica[] = [
  { imagem: require('../sprites-piskel/plataformas/plataforma-1.png'), largura: 56, altura: 25 },
  { imagem: require('../sprites-piskel/plataformas/plataforma-2.png'), largura: 48, altura: 26 },
  { imagem: require('../sprites-piskel/plataformas/plataforma-4.png'), largura: 54, altura: 29 },
];

/** Armadilha de phishing — pousar dispara a tela de invasão. */
export const PLATAFORMA_FAKE: ImagemEstatica = {
  imagem: require('../sprites-piskel/plataformas/plataforma-3-fake.png'),
  largura: 56,
  altura: 27,
};

// ---------- Boss / invasão (UI intermediária) ----------

/** Glitch de fundo — sheet 256×65 = 4 frames de 64×65. */
export const GLICH_HAKEO: SpriteSheet = {
  imagem: require('../sprites-piskel/Boss/Glich-Hakeo.png'),
  larguraFrame: 64,
  alturaFrame: 65,
  totalFrames: 4,
};

/** Frames separados do glitch (evita faixa 4× largura da tela no Android). */
export const GLICH_HAKEO_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Glich-Hakeo-f1.png'),
  require('../sprites-piskel/Boss/Glich-Hakeo-f2.png'),
  require('../sprites-piskel/Boss/Glich-Hakeo-f3.png'),
  require('../sprites-piskel/Boss/Glich-Hakeo-f4.png'),
];

/** Gray Mage na tela de aviso pós-hack. */
export const GRAY_MAGO_AVISO: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/Gray-mago-aviso.png'),
  largura: 64,
  altura: 71,
};

/** Moldura da tela intermediária (aviso do Gray Mage). */
export const MARCO_TELA_INTERMEDIA: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/Marco-tela-intermedia.png'),
  largura: 405,
  altura: 641,
};

/** Moldura do chat da aula local (Gray Mage). */
export const MARCO_CHAT_MAGO: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/Marco-chat-mago.png'),
  largura: 501,
  altura: 830,
};

/** Moldura da arena do boss (470×709, interior transparente). */
export const MARCO_TELA_BOSS: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/marco-tela-boos.png'),
  largura: 470,
  altura: 709,
};

/** Piso da arena — só após coletar o patch (mesma tela do marco). */
export const PISO_TELA_BOSS: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/piso-tela-boos.png'),
  largura: 470,
  altura: 709,
};

/** Hit-box raw das plataformas na arena (recorte inferior = etiqueta). */
export const HITBOX_PLATAFORMA: ImagemEstatica = {
  imagem: require('../sprites-piskel/plataformas/Hit-box-plataforma.png'),
  largura: 56,
  altura: 13,
};

/** Patch (pendrive) — 2 frames separados (sheet 130×25). */
export const PATCH_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Patch-iten-f1.png'),
  require('../sprites-piskel/Boss/Patch-iten-f2.png'),
];
export const PATCH_TAMANHO = { largura: 65, altura: 25 };

/** Ponto frágil (barra vermelha) — PNG 105×25; na tela usa o retângulo da barra +1 mm. */
export const BARRA_ROJA_HIT: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/barra-roja-hti.png'),
  largura: 56 + 1 * (160 / 25.4),
  altura: 14 + 1 * (160 / 25.4),
};

/** Coração do boss — 2 frames (sheet HIT-box-Boss.png, 126×61 cada). */
export const HIT_BOX_BOSS_FRAMES: number[] = [
  require('../sprites-piskel/Boss/HIT-box-Boss-f1.png'),
  require('../sprites-piskel/Boss/HIT-box-Boss-f2.png'),
];
export const HIT_BOX_BOSS_TAMANHO = { largura: 126, altura: 61 };

/** Phishing-Man idle — 4 frames separados (sheet 256×63). */
export const PISHING_MAN_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Pishing-Man-f1.png'),
  require('../sprites-piskel/Boss/Pishing-Man-f2.png'),
  require('../sprites-piskel/Boss/Pishing-Man-f3.png'),
  require('../sprites-piskel/Boss/Pishing-Man-f4.png'),
];
export const PISHING_MAN_TAMANHO = { largura: 64, altura: 63 };
/** Sheet em faixa — backup; a arena usa PISHING_MAN_FRAMES. */
export const PISHING_MAN: SpriteSheet = {
  imagem: require('../sprites-piskel/Boss/Pishing-Man.png'),
  larguraFrame: 64,
  alturaFrame: 63,
  totalFrames: 4,
};

/** Phishing-Man zombando — mesmo grid 4×64. */
export const PISHING_MAN_HAHAHA: SpriteSheet = {
  imagem: require('../sprites-piskel/Boss/Pishing-Man-HAHAHA.png'),
  larguraFrame: 64,
  alturaFrame: 63,
  totalFrames: 4,
};

/** Phishing-Man hit — 2 frames separados (sheet 128×59). */
export const PISHING_MAN_HIT_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Pishing-man-hit-f1.png'),
  require('../sprites-piskel/Boss/Pishing-man-hit-f2.png'),
];
export const PISHING_MAN_HIT_TAMANHO = { largura: 64, altura: 59 };
/** Sheet em faixa — backup; a arena usa PISHING_MAN_HIT_FRAMES. */
export const PISHING_MAN_HIT: SpriteSheet = {
  imagem: require('../sprites-piskel/Boss/Pishing-man-hit.png'),
  larguraFrame: 64,
  alturaFrame: 59,
  totalFrames: 2,
};

/** Anzol do Phishing-Man (lógico 1×; PNG 8×). */
export const ANZOL_PISHING: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/Anzol-pishingman.png'),
  largura: 37,
  altura: 56,
};

/** Carrinho do anzol na faixa do marco. */
export const CARRINHO_ANZOL: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/carril-anzol.png'),
  largura: 50,
  altura: 25,
};

/** Vírus que o boss solta na arena (2 frames). */
export const VIRUS_BOSS_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Viris-hit-f1.png'),
  require('../sprites-piskel/Boss/Viris-hit-f2.png'),
];
export const VIRUS_BOSS_TAMANHO = { largura: 89, altura: 68 };

/** Zombie-net idle — 2 frames separados (sheet 218×123). */
export const ZOMBIE_NET_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Zombie-net-f1.png'),
  require('../sprites-piskel/Boss/Zombie-net-f2.png'),
];
export const ZOMBIE_NET_TAMANHO = { largura: 109, altura: 123 };

/** Zombie-net hit — 2 frames separados no mesmo canvas do idle. */
export const ZOMBIE_NET_HIT_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Zombie-net-hit-f1.png'),
  require('../sprites-piskel/Boss/Zombie-net-hit-f2.png'),
];
export const ZOMBIE_NET_HIT_TAMANHO = { largura: 109, altura: 123 };

/** Mini-bot da botnet — 2 frames (lógico 1×; PNG 8×). Arte olha para a direita. */
export const MINI_BOT_ZOMBIE_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Mini-bot-zombie-f1.png'),
  require('../sprites-piskel/Boss/Mini-bot-zombie-f2.png'),
];
export const MINI_BOT_ZOMBIE_TAMANHO = { largura: 56, altura: 77 };
export const MINI_BOT_ZOMBIE: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/Mini-bot-zombie-f1.png'),
  largura: 56,
  altura: 77,
};

/** Capitão Pix — idle 2 frames (lógico 1×; PNG 8×). */
export const CAPITAN_PIX_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Capitan-Pix-pirate-f1.png'),
  require('../sprites-piskel/Boss/Capitan-Pix-pirate-f2.png'),
];
export const CAPITAN_PIX_TAMANHO = { largura: 115, altura: 76 };

/** Capitão Pix HAHAHA — sheet 4×115, mesmo ritmo do Phishing Man. */
export const CAPITAN_PIX_HAHAHA: SpriteSheet = {
  imagem: require('../sprites-piskel/Boss/Capitan-Pix-pirate-HAHAHA.png'),
  larguraFrame: 115,
  alturaFrame: 81,
  totalFrames: 4,
};

/** Baú Pix: tampa fechada / aberta. */
export const BAU_PIX_FECHADO: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/bau-pixpirata-fechado.png'),
  largura: 96,
  altura: 96,
};
export const BAU_PIX_ABERTO: ImagemEstatica = {
  imagem: require('../sprites-piskel/Boss/bau-pixpirata-aberto.png'),
  largura: 96,
  altura: 96,
};

/** Moeda pirata — 4 frames no canvas 36×36 (igual à moeda da run). */
export const MOEDA_PIRATA_FRAMES: number[] = [
  require('../sprites-piskel/Boss/Moneda-pirata-f1.png'),
  require('../sprites-piskel/Boss/Moneda-pirata-f2.png'),
  require('../sprites-piskel/Boss/Moneda-pirata-f3.png'),
  require('../sprites-piskel/Boss/Moneda-pirata-f4.png'),
];

// ---------- Loja (Tienda) ----------

export const TIENDA_FUNDO: ImagemEstatica = {
  imagem: require('../sprites-piskel/Tienda/Tienda-fondo-plano-1.png.png'),
  largura: 160,
  altura: 300,
};
export const TIENDA_HEADER: ImagemEstatica = {
  imagem: require('../sprites-piskel/Tienda/Header-tienda-novo.png.png'),
  largura: 160,
  altura: 76,
};
export const TIENDA_RODAPE: ImagemEstatica = {
  imagem: require('../sprites-piskel/Tienda/Roda-pe-tienda-1.png.png'),
  largura: 160,
  altura: 19,
};
export const TIENDA_MARCO_ITEM: ImagemEstatica = {
  imagem: require('../sprites-piskel/Tienda/marco-itens-tienda.png'),
  largura: 49,
  altura: 51,
};

/** Plataforma-entrada da loja (arte alta — hitbox no meio). */
export const PLATAFORMA_TIENDA: ImagemEstatica = {
  imagem: require('../sprites-piskel/plataformas/Plataforma-tienda.png'),
  largura: 64,
  altura: 67,
};

// ---------- Skins (gorros do mago + orbs companheiras) ----------

/**
 * Pose de gorro: canvas maior que o mago original (o chapéu sobe).
 * folgaBaixo = linhas transparentes (lógicas) abaixo dos pés no canvas —
 * a render desce o desenho essa folga para o pé tocar o chão da hitbox.
 */
export interface PoseSkinGorro extends ImagemEstatica {
  folgaBaixo: number;
}

/** Gorro Tec — mago completo com chapéu de circuitos (canvas 368×390 = 8x). */
export const GORRO_TEC_PARADO: PoseSkinGorro = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-mago-tec.png'),
  largura: 46,
  altura: 48.75,
  folgaBaixo: 0,
};
export const GORRO_TEC_AR: PoseSkinGorro = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-mago-tec-AR.png'),
  largura: 46,
  altura: 48.75,
  folgaBaixo: 2.25,
};
export const GORRO_TEC_AGACHADO: PoseSkinGorro = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-mago-tec-agachado.png'),
  largura: 46,
  altura: 48.75,
  folgaBaixo: 4.875,
};
export const GORRO_TEC_MORTO: PoseSkinGorro = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-mago-tec-MOrto.png'),
  largura: 46,
  altura: 48.75,
  folgaBaixo: 2.375,
};

/** Gorro Viking — elmo com chifres (parado 360×390; demais 368×390 = 8x). */
export const GORRO_VIKING_PARADO: PoseSkinGorro = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-mago-viking.png'),
  largura: 45,
  altura: 48.75,
  folgaBaixo: 0,
};
export const GORRO_VIKING_AR: PoseSkinGorro = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-mago-viking-AR.png'),
  largura: 46,
  altura: 48.75,
  folgaBaixo: 0.125,
};
export const GORRO_VIKING_AGACHADO: PoseSkinGorro = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-mago-viking-agachado.png'),
  largura: 46,
  altura: 48.75,
  folgaBaixo: 4.875,
};
export const GORRO_VIKING_MORTO: PoseSkinGorro = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-mago-viking-MOrto.png'),
  largura: 46,
  altura: 48.75,
  folgaBaixo: 2.375,
};

/**
 * Intro das skins — mesmo ciclo da original (parado → agachado → parado).
 * Frames compostos das próprias poses, pés na base do canvas uniforme.
 * Usada na tela de intro e na arena do boss (mago andando).
 */
export const GORRO_TEC_INTRO_FRAMES: number[] = [
  require('../sprites-piskel/mago-sprites/skins/chapeu-mago-tec-intro-f1.png'),
  require('../sprites-piskel/mago-sprites/skins/chapeu-mago-tec-intro-f2.png'),
  require('../sprites-piskel/mago-sprites/skins/chapeu-mago-tec-intro-f1.png'),
];
export const GORRO_TEC_INTRO_TAMANHO = { largura: 39.75, altura: 46 };
export const GORRO_VIKING_INTRO_FRAMES: number[] = [
  require('../sprites-piskel/mago-sprites/skins/chapeu-mago-viking-intro-f1.png'),
  require('../sprites-piskel/mago-sprites/skins/chapeu-mago-viking-intro-f2.png'),
  require('../sprites-piskel/mago-sprites/skins/chapeu-mago-viking-intro-f1.png'),
];
export const GORRO_VIKING_INTRO_TAMANHO = { largura: 39, altura: 46.75 };

/** Ícones dos gorros na vitrine da loja (aparados no alpha; estáticos). */
export const ICONE_GORRO_TEC: ImagemEstatica = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-tienda-tec.png'),
  largura: 35.6,
  altura: 19.9,
};
export const ICONE_GORRO_VIKING: ImagemEstatica = {
  imagem: require('../sprites-piskel/mago-sprites/skins/chapeu-tienda-viking.png'),
  largura: 36.9,
  altura: 30,
};

/**
 * Orb Runa — gira no próprio eixo (7 frames, mesma lógica da moeda).
 * Frames fatiados da folha original; canvas uniforme 293×468 / 287×467.
 */
export const ORB_RUNA_NORMAL_FRAMES: number[] = [
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-normal-f1.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-normal-f2.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-normal-f3.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-normal-f4.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-normal-f5.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-normal-f6.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-normal-f7.png'),
];
export const ORB_RUNA_NORMAL_TAMANHO = { largura: 16.3, altura: 26 };
export const ORB_RUNA_SUPER_FRAMES: number[] = [
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-super-f1.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-super-f2.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-super-f3.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-super-f4.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-super-f5.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-super-f6.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-runa-super-f7.png'),
];
export const ORB_RUNA_SUPER_TAMANHO = { largura: 16, altura: 26 };

/** Orb Robô — pisca como sistema vivo latente (2 frames: luz acesa/apagada). */
export const ORB_ROBOT_NORMAL_FRAMES: number[] = [
  require('../sprites-piskel/ORBs/skins-orb/ORB-robot-normal-f1.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-robot-normal-f2.png'),
];
export const ORB_ROBOT_NORMAL_TAMANHO = { largura: 22.3, altura: 18 };
export const ORB_ROBOT_SUPER_FRAMES: number[] = [
  require('../sprites-piskel/ORBs/skins-orb/ORB-robot-super-f1.png'),
  require('../sprites-piskel/ORBs/skins-orb/ORB-robot-super-f2.png'),
];
export const ORB_ROBOT_SUPER_TAMANHO = { largura: 21.8, altura: 18 };

/** Itens da loja: sheet horizontal de 2 frames (sobe/desce). Tamanhos lógicos 1x. */
export const ITEM_POCION_VIDA: SpriteSheet = {
  imagem: require('../sprites-piskel/Tienda/Pocion-vida.png'),
  larguraFrame: 51,
  alturaFrame: 42,
  totalFrames: 2,
};
export const ITEM_CARTA_7DIAS: SpriteSheet = {
  imagem: require('../sprites-piskel/Tienda/Carta-7dias.png'),
  larguraFrame: 28,
  alturaFrame: 47,
  totalFrames: 2,
};
export const ITEM_BAU_MOEDAS: SpriteSheet = {
  imagem: require('../sprites-piskel/Tienda/Bau-monedas.png'),
  larguraFrame: 69,
  alturaFrame: 61,
  totalFrames: 2,
};
export const ITEM_BONUS_MOEDAS: SpriteSheet = {
  imagem: require('../sprites-piskel/Tienda/Bonus-monedas.png'),
  larguraFrame: 60,
  alturaFrame: 47,
  totalFrames: 2,
};
export const ITEM_BOLSA_MOEDAS: SpriteSheet = {
  imagem: require('../sprites-piskel/Tienda/bolsa-monedas.png'),
  larguraFrame: 47,
  alturaFrame: 49,
  totalFrames: 2,
};
export const ITEM_PACOTE_MINI_MOEDAS: SpriteSheet = {
  imagem: require('../sprites-piskel/Tienda/paket-mini-monedas.png'),
  larguraFrame: 69,
  alturaFrame: 49,
  totalFrames: 2,
};
