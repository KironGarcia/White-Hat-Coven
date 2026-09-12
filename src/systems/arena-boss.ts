/**
 * Lógica da arena do Phishing Man:
 * mago no piso, tap para atirar, patch abre o coração do boss
 * (caixa-hit aleatória na arena). Vírus caem. Anzol: desce e sobe
 * (primeira vez aos 7 s, depois a cada 7 s). Pesca a orb se tocar;
 * o teto da caixa-hit rebate o anzol.
 */

import {
  ANZOL_PISHING,
  CARRINHO_ANZOL,
  DISPARO_IMPACTO_TAMANHO,
  DISPARO_SALIDA,
  DISPARO_VIAGEM,
  HITBOX_PLATAFORMA,
  HIT_BOX_BOSS_TAMANHO,
  MINI_BOT_ZOMBIE,
  MOEDA_PLATAFORMA_TAMANHO,
  PATCH_TAMANHO,
  VIRUS_BOSS_TAMANHO,
  BAU_PIX_FECHADO,
} from '../assets';
import {
  ATRASO_PRIMEIRO_PATCH_S,
  CHANCE_MWR1_PHISHING,
  CHANCE_PATCH_BOSS,
  CHANCE_PATCH_QUEDA,
  CHANCE_PATCH_QUEDA_ENCANTO,
  DANO_DISPARO_ENCANTO,
  DANO_DISPARO_NORMAL,
  DURACAO_AGACHADO_S,
  DURACAO_HIT_BOSS_S,
  DURACAO_IMPACTO_DISPARO_S,
  DURACAO_MORTO_BOSS_S,
  DURACAO_MORTO_S,
  DURACAO_SALIDA_DISPARO_S,
  DURACAO_STUN_PATCH_ENCANTO_S,
  DURACAO_STUN_PATCH_S,
  ESCALA_ANZOL,
  ESCALA_CARRINHO_ANZOL,
  ESCALA_HITBOX_BOSS_ALTURA,
  ESCALA_HITBOX_BOSS_LARGURA,
  ESCALA_PATCH,
  ESCALA_SPRITE,
  ESCALA_VIRUS_BOSS,
  GAP_HITBOX_BOSS_MAX,
  GAP_HITBOX_BOSS_MIN,
  HITS_VIRUS_PARA_MORRER,
  HITS_VIRUS_ENCANTO_PARA_MORRER,
  IMPULSO_SALTO,
  INTERVALO_DISPARO_BOSS_S,
  INTERVALO_DROP_BOSS_S,
  INVENCIVEL_APOS_VIRUS_S,
  DESCIDA_ANZOL_S,
  DURACAO_HAHAHA_BOSS_S,
  DURACAO_PISCA_SOLTA_ORB_S,
  MARGEM_HIT_ANZOL_PX,
  MARGEM_HIT_ORB_PX,
  MARGEM_PONTA_ORB_PX,
  MAX_DISPAROS_NA_TELA,
  MAX_VIRUS_NA_TELA,
  PARADO_ANZOL_S,
  PATRULHA_ANZOL_S,
  PONTA_ANZOL_ART,
  SEQUESTRO_ORB_S,
  SUBIDA_ANZOL_S,
  VELOCIDADE_CARRINHO_ANZOL,
  VELOCIDADE_DISPARO_BOSS,
  VELOCIDADE_PATCH_QUEDA,
  VELOCIDADE_PLATAFORMA_BOSS,
  VELOCIDADE_MINIMA_TILT_BOSS,
  VELOCIDADE_VIRUS_BOSS,
  VELOCIDADE_QUEDA_MINI_BOT,
  VELOCIDADE_DISPARO_INFECTADO,
  VIDAS_INICIO,
  ZONA_ARRANQUE_TILT_BOSS,
  ZONA_MORTA_TILT_BOSS,
  ESCALA_MINI_BOT_ZOMBIE,
  INTERVALO_MINI_BOT_S,
  CHANCE_MINI_BOT_QUEDA,
  INTERVALO_RETRY_MINI_BOT_S,
  PASSOS_DANCA_MINI_BOT,
  TEMPO_PASSO_DANCA_MINI_BOT_S,
  AMPLITUDE_DANCA_MINI_BOT_PX,
  DURACAO_PISCA_MINI_BOT_S,
  INTERVALO_TIRO_RAJADA_S,
  ESPERA_RAJADA_ORB_S,
  FATOR_SUBIDA_ORB_INFECTADA,
  MARGEM_JUSTA_RAJADA_PX,
  DURACAO_PISCA_VOLTA_ORB_S,
  CHANCE_MOEDA_ARENA_CAPITAO,
  CHANCE_MOEDA_PIRATA_ARENA,
  MAX_MOEDAS_ARENA,
  VELOCIDADE_MOEDA_ARENA,
  ESCALA_BAU_PIX,
  INTERVALO_BAU_PIX_S,
  DURACAO_FRAME_BAU_PIX_S,
  VELOCIDADE_BAU_PIX,
  PENALIDADE_MOEDA_PIRATA,
  PENALIDADE_ROUBO_S,
  INTERVALO_ROUBO_S,
  ESCALA_MOEDA,
} from '../constants';
import { vidasMaximas } from './pontuacao';
import type {
  BarraBrecha,
  DisparoBoss,
  EstadoAnzol,
  EstadoArenaBoss,
  EtiquetaHitbox,
  HitboxBoss,
  MiniBotZombie,
  MoedaArena,
  BauPixArena,
  PatchBoss,
  TipoTelaBoss,
  VirusBoss,
} from '../entities/arena-boss';
import { posicionarOrbAcimaDaCabeca, seguirAcimaDaCabeca, type EstadoOrb } from '../entities/orb';
import {
  ALTURA_JOGADOR,
  LARGURA_JOGADOR,
  hitboxDoJogador,
  larguraHitboxJogador,
  type EstadoJogador,
} from '../entities/jogador';
import type { LayoutBossTela } from './layout-boss';

let proximoId = 1;

const ETIQUETAS_NORMAIS: EtiquetaHitbox[] = [
  'Plataforma.1',
  'Plataforma.2',
  'Plataforma.3',
];

function sortearEntre(minimo: number, maximo: number): number {
  return minimo + Math.random() * (maximo - minimo);
}

function sortearEtiqueta(encantoAtivo: boolean): EtiquetaHitbox {
  if (encantoAtivo) {
    return ETIQUETAS_NORMAIS[Math.floor(Math.random() * ETIQUETAS_NORMAIS.length)];
  }
  if (Math.random() < CHANCE_MWR1_PHISHING) return 'Plataforma.mwr1';
  return ETIQUETAS_NORMAIS[Math.floor(Math.random() * ETIQUETAS_NORMAIS.length)];
}

function larguraCarrinho(): number {
  return CARRINHO_ANZOL.largura * ESCALA_CARRINHO_ANZOL;
}

function alturaCarrinho(): number {
  return CARRINHO_ANZOL.altura * ESCALA_CARRINHO_ANZOL;
}

function larguraAnzol(): number {
  return ANZOL_PISHING.largura * ESCALA_ANZOL;
}

function alturaAnzol(): number {
  return ANZOL_PISHING.altura * ESCALA_ANZOL;
}

function yCarrinhoNaFaixa(layout: LayoutBossTela): number {
  return layout.divisor.y + (layout.divisor.h - alturaCarrinho()) / 2;
}

function limitesCarrinho(layout: LayoutBossTela): { minX: number; maxX: number } {
  const w = larguraCarrinho();
  return {
    minX: layout.divisor.x + 4,
    maxX: layout.divisor.x + layout.divisor.w - w - 4,
  };
}

function criarAnzolInicial(layout: LayoutBossTela): EstadoAnzol {
  const { minX, maxX } = limitesCarrinho(layout);
  const xCarrinho = (minX + maxX) / 2;
  const yC = yCarrinhoNaFaixa(layout);
  const yRecolhido = yC + alturaCarrinho() - 6;
  const xAnzol = xCarrinho + larguraCarrinho() / 2 - larguraAnzol() / 2;
  return {
    xCarrinho,
    yCarrinho: yC,
    xAnzol,
    yAnzol: yRecolhido,
    fase: 'patrulha',
    tempoFaseS: 0,
    direcao: 1,
    yRecolhido,
    yAlvo: yRecolhido,
  };
}

function tamanhoCaixaHit(): { largura: number; altura: number } {
  return {
    largura: HIT_BOX_BOSS_TAMANHO.largura,
    altura: HIT_BOX_BOSS_TAMANHO.altura,
  };
}

/** Sorteia um ponto estático: abaixo do anzol recolhido (5 mm) e 2 cm acima da orb. */
function sortearPosicaoCaixaHit(
  layout: LayoutBossTela,
  orb: EstadoOrb,
  largura: number,
  altura: number,
  evitar: BarraBrecha | null,
): { x: number; y: number } {
  const xMin = layout.arena.x + 4;
  const xMax = layout.arena.x + layout.arena.w - largura - 4;
  const yAnzolRecolhido = yCarrinhoNaFaixa(layout) + alturaCarrinho() - 6;
  const yMin = yAnzolRecolhido + alturaAnzol() + MARGEM_HIT_ANZOL_PX;
  const yMax = Math.max(yMin, orb.y - MARGEM_HIT_ORB_PX - altura);

  let x = sortearEntre(xMin, Math.max(xMin, xMax));
  let y = sortearEntre(yMin, yMax);

  for (let i = 0; i < 16; i++) {
    x = sortearEntre(xMin, Math.max(xMin, xMax));
    y = sortearEntre(yMin, yMax);
    if (!evitar) break;
    const sobrepoe =
      x + largura > evitar.x &&
      x < evitar.x + evitar.largura &&
      y + altura > evitar.y &&
      y < evitar.y + evitar.altura;
    if (!sobrepoe) break;
  }
  return { x, y };
}

function aplicarCaixaHitAleatoria(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  orb: EstadoOrb,
  evitar: BarraBrecha | null,
): void {
  const { largura, altura } = tamanhoCaixaHit();
  const pos = sortearPosicaoCaixaHit(layout, orb, largura, altura, evitar);
  arena.barra = { x: pos.x, y: pos.y, largura, altura };
}

function abrirPontoFragil(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  orb: EstadoOrb,
): void {
  arena.tempoStunS = arena.encantoAtivo
    ? DURACAO_STUN_PATCH_ENCANTO_S
    : DURACAO_STUN_PATCH_S;
  aplicarCaixaHitAleatoria(arena, layout, orb, null);
}

/** Caiu no teto da caixa-hit / hit-box (ou nasceu dentro dela): não atravessa. */
function bateuTetoDaCaixaHit(
  x: number,
  yAntes: number,
  yDepois: number,
  largura: number,
  altura: number,
  caixa: { x: number; y: number; largura: number; altura: number },
): boolean {
  const sobrepoeX = x + largura > caixa.x && x < caixa.x + caixa.largura;
  if (!sobrepoeX) return false;
  const teto = caixa.y;
  const baseAntes = yAntes + altura;
  const baseDepois = yDepois + altura;
  if (baseAntes <= teto && baseDepois >= teto) return true;
  return retangulosColidem(
    x,
    yDepois,
    largura,
    altura,
    caixa.x,
    caixa.y,
    caixa.largura,
    caixa.altura,
  );
}

export function pedirDisparoArena(arena: EstadoArenaBoss): void {
  if (arena.fase !== 'janela_patch') return;
  if (orbForaDaCabeca(arena)) return;
  if (arena.tempoMortoS > 0) return;
  arena.pedidosDisparo += 1;
}

function criarHitbox(
  y: number,
  layout: LayoutBossTela,
  encantoAtivo: boolean,
): HitboxBoss {
  const largura = HITBOX_PLATAFORMA.largura * ESCALA_HITBOX_BOSS_LARGURA;
  const altura = HITBOX_PLATAFORMA.altura * ESCALA_HITBOX_BOSS_ALTURA;
  const xMin = layout.arena.x + 4;
  const xMax = layout.arena.x + layout.arena.w - largura - 4;
  return {
    id: proximoId++,
    x: sortearEntre(xMin, Math.max(xMin, xMax)),
    y,
    largura,
    altura,
    etiqueta: sortearEtiqueta(encantoAtivo),
  };
}

function talvezCriarPatch(hitbox: HitboxBoss): PatchBoss | null {
  if (Math.random() >= CHANCE_PATCH_BOSS) return null;
  const largura = PATCH_TAMANHO.largura * ESCALA_PATCH;
  const altura = PATCH_TAMANHO.altura * ESCALA_PATCH;
  return {
    id: proximoId++,
    x: hitbox.x + hitbox.largura / 2 - largura / 2,
    y: hitbox.y - altura - 6,
    largura,
    altura,
  };
}

/** Preenche a arena com hit-boxes iniciais (sem cruzar o box do boss). */
function criarHitboxesIniciais(
  layout: LayoutBossTela,
  encantoAtivo: boolean,
): HitboxBoss[] {
  const hitboxes: HitboxBoss[] = [];
  const baseY = layout.arena.y + layout.arena.h - 50;
  let y = baseY;
  const base = criarHitbox(y, layout, encantoAtivo);
  base.x = layout.arena.x + layout.arena.w / 2 - base.largura / 2;
  base.etiqueta = 'Plataforma.1';
  hitboxes.push(base);

  while (y > layout.tetoY + 20) {
    y -= sortearEntre(GAP_HITBOX_BOSS_MIN, GAP_HITBOX_BOSS_MAX);
    if (y < layout.tetoY + 8) break;
    hitboxes.push(criarHitbox(y, layout, encantoAtivo));
  }
  return hitboxes;
}

export function criarArenaInicial(
  layout: LayoutBossTela,
  encantoAtivo: boolean,
  vidas = VIDAS_INICIO,
  tipoTela: TipoTelaBoss = 'phishing_man',
  moedasIniciais = 0,
): EstadoArenaBoss {
  return {
    hitboxes: [],
    patch: null,
    barra: null,
    disparos: [],
    tempoRecargaDisparoS: 0,
    pedidosDisparo: 0,
    virus: [],
    anzol: tipoTela === 'phishing_man' ? criarAnzolInicial(layout) : null,
    orbAmarrada: false,
    tempoSequestroOrbS: 0,
    tempoInvencivelS: 0,
    tempoAteDropS: 0.8,
    tempoNaLutaS: 0,
    fase: 'janela_patch',
    vivo: true,
    vidas: Math.max(1, Math.min(vidasMaximas(), vidas)),
    tempoMortoS: 0,
    encantoAtivo,
    bossHp: 100,
    bossHpMax: 100,
    tempoStunS: 0,
    tempoHitBossS: 0,
    tokenHitBoss: 0,
    tempoHahahaBossS: 0,
    tokenHahahaBoss: 0,
    tempoPiscaSoltaOrbS: 0,
    tipoTela,
    miniBots: [],
    tempoAteMiniBotS: 0.8,
    faseInfeccao: 'inativa',
    disparosInfectados: [],
    ladoInfeccao: 'esquerda',
    colunasRajada: [],
    indiceTiroRajada: 0,
    tempoProximoTiroRajadaS: 0,
    moedasRun: Math.max(0, Math.floor(moedasIniciais)),
    tempoHitMoedasS: 0,
    moedasArena: [],
    bauPix: null,
    tempoAteBauS: 2.2,
    roboAtivo: false,
    tempoRouboS: 0,
    avisoRouboPendente: false,
    idPatchAoIniciarRoubo: -1,
  };
}

/** HP zerou: congela a luta para a fala de vitória. */
export function iniciarVitoriaArena(arena: EstadoArenaBoss): void {
  arena.fase = 'vitoria';
  arena.patch = null;
  arena.hitboxes = [];
  arena.barra = null;
  arena.disparos = [];
  arena.virus = [];
  arena.anzol = null;
  arena.pedidosDisparo = 0;
  arena.tempoStunS = 0;
  arena.tempoRecargaDisparoS = 0;
  arena.tempoHitBossS = 0;
  arena.tempoHitMoedasS = 0;
  arena.tempoHahahaBossS = 0;
  arena.tempoSequestroOrbS = 0;
  arena.tempoPiscaSoltaOrbS = 0;
  arena.orbAmarrada = false;
  arena.miniBots = [];
  arena.disparosInfectados = [];
  arena.faseInfeccao = 'inativa';
  arena.colunasRajada = [];
  arena.indiceTiroRajada = 0;
  arena.moedasArena = [];
  arena.bauPix = null;
  arena.roboAtivo = false;
}

export function posicionarJogadorNaArena(
  jogador: EstadoJogador,
  layout: LayoutBossTela,
  _arena: EstadoArenaBoss,
): void {
  jogador.x = layout.arena.x + layout.arena.w / 2 - LARGURA_JOGADOR / 2;
  jogador.y = layout.pisoY - ALTURA_JOGADOR;
  jogador.vx = 0;
  jogador.vy = 0;
  jogador.pose = 'parado';
  jogador.tempoPose = 0;
}

/**
 * Move hit-boxes (e patch) para baixo. Recicla só abaixo da barra do marco.
 */
export function atualizarHitboxesArena(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  dt: number,
): void {
  if (arena.fase !== 'plataformas') return;

  const dy = VELOCIDADE_PLATAFORMA_BOSS * dt;
  for (const hitbox of arena.hitboxes) hitbox.y += dy;
  if (arena.patch) arena.patch.y += dy;

  const teto = layout.tetoY;
  const base = layout.arena.y + layout.arena.h - 8;

  for (let i = arena.hitboxes.length - 1; i >= 0; i--) {
    if (arena.hitboxes[i].y > base) arena.hitboxes.splice(i, 1);
  }

  if (arena.patch && arena.patch.y > base) {
    arena.patch = null;
  }

  if (arena.hitboxes.length === 0) {
    const nova = criarHitbox(teto + 8, layout, arena.encantoAtivo);
    arena.hitboxes.push(nova);
    if (!arena.patch) arena.patch = talvezCriarPatch(nova);
    return;
  }

  let maisAlta = Math.min(...arena.hitboxes.map((h) => h.y));
  while (maisAlta > teto + GAP_HITBOX_BOSS_MIN) {
    maisAlta -= sortearEntre(GAP_HITBOX_BOSS_MIN, GAP_HITBOX_BOSS_MAX);
    if (maisAlta < teto + 4) break;
    const nova = criarHitbox(maisAlta, layout, arena.encantoAtivo);
    arena.hitboxes.push(nova);
    if (!arena.patch) arena.patch = talvezCriarPatch(nova);
  }
}

/** O mago não atravessa a barra do marco; ao tocar o teto, começa a cair. */
export function limitarTetoDaArena(
  jogador: EstadoJogador,
  layout: LayoutBossTela,
): void {
  if (jogador.y < layout.tetoY) {
    jogador.y = layout.tetoY;
    if (jogador.vy < 0) jogador.vy = 180;
  }
}

/** Pouso nas hit-boxes; .mwr1 desaparece (sem inverter o fluxo). */
export function resolverPousoArena(
  jogador: EstadoJogador,
  baseAnterior: number,
  arena: EstadoArenaBoss,
  impulsoSalto: number,
  duracaoAgachado: number,
): void {
  if (arena.fase === 'janela_patch') return;
  if (jogador.vy <= 0) return;

  const caixa = hitboxDoJogador(jogador);
  for (let i = 0; i < arena.hitboxes.length; i++) {
    const hitbox = arena.hitboxes[i];
    const topo = hitbox.y;
    const cruzou = baseAnterior <= topo && caixa.base >= topo;
    const sobrepoeX =
      caixa.direita > hitbox.x && caixa.esquerda < hitbox.x + hitbox.largura;
    if (cruzou && sobrepoeX) {
      jogador.y = topo - ALTURA_JOGADOR;
      jogador.vy = impulsoSalto;
      jogador.pose = 'agachado';
      jogador.tempoPose = duracaoAgachado;
      if (hitbox.etiqueta === 'Plataforma.mwr1') {
        arena.hitboxes.splice(i, 1);
      }
      return;
    }
  }
}

/** Coleta do patch → limpa plataformas, abre janela de hit. */
export function tentarColetarPatch(
  jogador: EstadoJogador,
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
): boolean {
  if (!arena.patch || arena.fase !== 'plataformas') return false;
  const caixa = hitboxDoJogador(jogador);
  const p = arena.patch;
  const colide =
    caixa.direita > p.x &&
    caixa.esquerda < p.x + p.largura &&
    caixa.base > p.y &&
    caixa.topo < p.y + p.altura;
  if (!colide) return false;

  arena.patch = null;
  arena.hitboxes = [];
  arena.fase = 'janela_patch';
  arena.disparos = [];
  arena.tempoRecargaDisparoS = 0.2;
  abrirPontoFragil(arena, layout, {
    x: jogador.x,
    y: jogador.y - 8,
  });
  jogador.y = layout.pisoY - ALTURA_JOGADOR;
  jogador.vy = 0;
  jogador.pose = 'parado';
  jogador.tempoPose = 0;
  return true;
}

/** Só tilt horizontal no piso; trava nas bordas da arena. */
export function atualizarJogadorNoPiso(
  jogador: EstadoJogador,
  tiltX: number,
  dt: number,
  layout: LayoutBossTela,
  velocidadeMax: number,
  sensibilidade: number,
): void {
  // Sinal invertido igual à run.
  // Parado: limiar menor (arranque). Em movimento: zona morta para parar (sem escorregar).
  const bruto = -tiltX;
  const parado = Math.abs(jogador.vx) < 1;
  const limiar = parado ? ZONA_ARRANQUE_TILT_BOSS : ZONA_MORTA_TILT_BOSS;
  let vxAlvo = 0;
  if (Math.abs(bruto) > limiar) {
    vxAlvo = Math.max(
      -velocidadeMax,
      Math.min(velocidadeMax, bruto * sensibilidade),
    );
    if (Math.abs(vxAlvo) < VELOCIDADE_MINIMA_TILT_BOSS) {
      vxAlvo = Math.sign(vxAlvo) * VELOCIDADE_MINIMA_TILT_BOSS;
    }
  }
  jogador.vx = vxAlvo;
  jogador.x += jogador.vx * dt;
  jogador.vy = 0;
  jogador.y = layout.pisoY - ALTURA_JOGADOR;

  if (jogador.vx < -20) jogador.direcao = 'esquerda';
  else if (jogador.vx > 20) jogador.direcao = 'direita';

  const xMin = layout.arena.x;
  const xMax = layout.arena.x + layout.arena.w - LARGURA_JOGADOR;
  if (jogador.x < xMin) jogador.x = xMin;
  if (jogador.x > xMax) jogador.x = xMax;
}

/** Ponto frágil some depois de 10 s; aí o patch pode cair de novo. */
export function atualizarStunPatch(
  arena: EstadoArenaBoss,
  _layout: LayoutBossTela,
  _jogador: EstadoJogador,
  dt: number,
): void {
  if (arena.fase !== 'janela_patch') return;
  if (arena.tempoStunS <= 0) {
    if (arena.barra) arena.barra = null;
    return;
  }
  arena.tempoStunS -= dt;
  if (arena.tempoStunS <= 0) {
    arena.tempoStunS = 0;
    arena.barra = null;
  }
}

function encerrarJanelaPatch(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  jogador: EstadoJogador,
): void {
  arena.fase = 'plataformas';
  arena.barra = null;
  arena.disparos = [];
  arena.tempoRecargaDisparoS = 0;
  arena.tempoStunS = 0;
  arena.patch = null;
  arena.hitboxes = criarHitboxesIniciais(layout, arena.encantoAtivo);
  posicionarJogadorNaArena(jogador, layout, arena);
  jogador.vy = IMPULSO_SALTO;
  jogador.pose = 'ar';
}

/** Caixa-hit fica parada — só existe enquanto o patch está ativo. */
export function atualizarBarraBrecha(
  _arena: EstadoArenaBoss,
  _layout: LayoutBossTela,
  _dt: number,
): void {
  // Posição é sorteada na abertura e no acerto; não persegue a tela.
}

function criarDisparoNaOrb(orb: EstadoOrb, larguraOrb: number): DisparoBoss {
  const largura = DISPARO_SALIDA.largura * ESCALA_SPRITE;
  const altura = DISPARO_SALIDA.altura * ESCALA_SPRITE;
  return {
    id: proximoId++,
    x: orb.x + larguraOrb / 2 - largura / 2,
    y: orb.y - altura + 8,
    largura,
    altura,
    fase: 'salida',
    tempoFaseS: 0,
  };
}

function disparoAcertouBarra(
  x: number,
  y: number,
  largura: number,
  altura: number,
  arena: EstadoArenaBoss,
): boolean {
  const barra = arena.barra;
  if (!barra) return false;
  return retangulosColidem(
    x,
    y,
    largura,
    altura,
    barra.x,
    barra.y,
    barra.largura,
    barra.altura,
  );
}

function disparoAcertouVirus(
  x: number,
  y: number,
  largura: number,
  altura: number,
  arena: EstadoArenaBoss,
): VirusBoss | null {
  let alvo: VirusBoss | null = null;
  for (const virus of arena.virus) {
    if (!retangulosColidem(x, y, largura, altura, virus.x, virus.y, virus.largura, virus.altura)) {
      continue;
    }
    if (!alvo || virus.y + virus.altura > alvo.y + alvo.altura) {
      alvo = virus;
    }
  }
  return alvo;
}

function aplicarImpactoDisparo(disparo: DisparoBoss, yImpacto: number): void {
  disparo.fase = 'impacto';
  disparo.tempoFaseS = 0;
  const largura = DISPARO_IMPACTO_TAMANHO.largura * ESCALA_SPRITE;
  const altura = DISPARO_IMPACTO_TAMANHO.altura * ESCALA_SPRITE;
  const centroTiro = disparo.x + disparo.largura / 2;
  disparo.y = yImpacto - altura / 2;
  disparo.largura = largura;
  disparo.altura = altura;
  disparo.x = centroTiro - largura / 2;
}

function hitsParaDerrubarMob(arena: EstadoArenaBoss): number {
  return arena.encantoAtivo
    ? HITS_VIRUS_ENCANTO_PARA_MORRER
    : HITS_VIRUS_PARA_MORRER;
}

function aplicarHitVirus(arena: EstadoArenaBoss, virus: VirusBoss): void {
  virus.hits += 1;
  if (virus.hits < hitsParaDerrubarMob(arena)) return;
  arena.virus = arena.virus.filter((v) => v.id !== virus.id);
}

function disparoAcertouMiniBot(
  x: number,
  y: number,
  largura: number,
  altura: number,
  arena: EstadoArenaBoss,
): MiniBotZombie | null {
  let alvo: MiniBotZombie | null = null;
  for (const bot of arena.miniBots) {
    if (bot.tempoPiscaSumirS > 0) continue;
    if (!retangulosColidem(x, y, largura, altura, bot.x, bot.y, bot.largura, bot.altura)) {
      continue;
    }
    if (!alvo || bot.y + bot.altura > alvo.y + alvo.altura) {
      alvo = bot;
    }
  }
  return alvo;
}

function aplicarHitMiniBot(arena: EstadoArenaBoss, bot: MiniBotZombie): void {
  bot.hits += 1;
  if (bot.hits < hitsParaDerrubarMob(arena)) return;
  arena.miniBots = arena.miniBots.filter((b) => b.id !== bot.id);
}

/** Avança um tiro. Devolve false quando o impacto acabou e pode sair da lista. */
function avancarUmDisparo(
  disparo: DisparoBoss,
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  orb: EstadoOrb,
  larguraOrb: number,
  dt: number,
): boolean {
  disparo.tempoFaseS += dt;
  const centroX = orb.x + larguraOrb / 2;

  if (disparo.fase === 'salida') {
    const largura = DISPARO_SALIDA.largura * ESCALA_SPRITE;
    const altura = DISPARO_SALIDA.altura * ESCALA_SPRITE;
    disparo.largura = largura;
    disparo.altura = altura;
    disparo.x = centroX - largura / 2;
    disparo.y = orb.y - altura + 8;
    if (disparo.tempoFaseS >= DURACAO_SALIDA_DISPARO_S) {
      disparo.fase = 'viagem';
      disparo.tempoFaseS = 0;
      const larguraV = DISPARO_VIAGEM.largura * ESCALA_SPRITE;
      const alturaV = DISPARO_VIAGEM.altura * ESCALA_SPRITE;
      const base = disparo.y + disparo.altura;
      disparo.largura = larguraV;
      disparo.altura = alturaV;
      disparo.x = centroX - larguraV / 2;
      disparo.y = base - alturaV;
    }
    return true;
  }

  if (disparo.fase === 'viagem') {
    const yAntes = disparo.y;
    disparo.y -= VELOCIDADE_DISPARO_BOSS * dt;
    const yVarredura = Math.min(disparo.y, yAntes);
    const hVarredura =
      Math.max(disparo.y + disparo.altura, yAntes + disparo.altura) - yVarredura;
    const virusAtingido = disparoAcertouVirus(
      disparo.x,
      yVarredura,
      disparo.largura,
      hVarredura,
      arena,
    );
    const botAtingido = disparoAcertouMiniBot(
      disparo.x,
      yVarredura,
      disparo.largura,
      hVarredura,
      arena,
    );
    const virusMaisBaixo =
      !!virusAtingido &&
      (!botAtingido ||
        virusAtingido.y + virusAtingido.altura >= botAtingido.y + botAtingido.altura);
    if (virusAtingido && virusMaisBaixo) {
      aplicarHitVirus(arena, virusAtingido);
      aplicarImpactoDisparo(
        disparo,
        virusAtingido.y + virusAtingido.altura / 2,
      );
      return true;
    }
    if (botAtingido) {
      aplicarHitMiniBot(arena, botAtingido);
      aplicarImpactoDisparo(disparo, botAtingido.y + botAtingido.altura / 2);
      return true;
    }
    if (
      disparoAcertouBarra(
        disparo.x,
        yVarredura,
        disparo.largura,
        hVarredura,
        arena,
      )
    ) {
      const caixa = arena.barra!;
      aplicarImpactoDisparo(disparo, caixa.y + caixa.altura);
      arena.bossHp = Math.max(
        0,
        arena.bossHp -
          (arena.encantoAtivo ? DANO_DISPARO_ENCANTO : DANO_DISPARO_NORMAL),
      );
      arena.tempoHitBossS = DURACAO_HIT_BOSS_S;
      arena.tokenHitBoss += 1;
      aplicarCaixaHitAleatoria(arena, layout, orb, caixa);
      return true;
    }
    if (disparo.y <= layout.tetoY) {
      aplicarImpactoDisparo(disparo, layout.tetoY);
    }
    return true;
  }

  return disparo.tempoFaseS < DURACAO_IMPACTO_DISPARO_S;
}

/**
 * Um tiro por tap. Vários podem voar ao mesmo tempo — não espera a animação.
 * Devolve quantos tiros nasceram neste quadro (para o som).
 */
export function atualizarDisparoArena(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  orb: EstadoOrb,
  larguraOrb: number,
  dt: number,
): number {
  if (arena.fase !== 'janela_patch') return 0;

  let nascidos = 0;
  arena.tempoRecargaDisparoS -= dt;
  while (
    arena.pedidosDisparo > 0 &&
    arena.tempoRecargaDisparoS <= 0 &&
    !orbForaDaCabeca(arena) &&
    arena.disparos.length < MAX_DISPAROS_NA_TELA
  ) {
    arena.disparos.push(criarDisparoNaOrb(orb, larguraOrb));
    arena.tempoRecargaDisparoS = INTERVALO_DISPARO_BOSS_S;
    arena.pedidosDisparo -= 1;
    nascidos += 1;
  }

  arena.disparos = arena.disparos.filter((disparo) =>
    avancarUmDisparo(disparo, arena, layout, orb, larguraOrb, dt),
  );
  return nascidos;
}

function xAleatorioDrop(
  layout: LayoutBossTela,
  largura: number,
  faixaProibida?: { x: number; largura: number },
): number | null {
  const xMin = layout.arena.x + 8;
  const xMax = layout.arena.x + layout.arena.w - largura - 8;
  if (xMax <= xMin) return xMin;
  if (!faixaProibida) return sortearEntre(xMin, xMax);

  const livreEsqMax = faixaProibida.x - largura;
  const livreDirMin = faixaProibida.x + faixaProibida.largura;
  const intervalos: { a: number; b: number }[] = [];
  if (livreEsqMax > xMin) {
    intervalos.push({ a: xMin, b: Math.min(xMax, livreEsqMax) });
  }
  if (livreDirMin < xMax) {
    intervalos.push({ a: Math.max(xMin, livreDirMin), b: xMax });
  }
  const validos = intervalos.filter((i) => i.b > i.a);
  if (validos.length === 0) return null;
  const escolhido = validos[Math.floor(Math.random() * validos.length)];
  return sortearEntre(escolhido.a, escolhido.b);
}

function criarVirusQueda(
  layout: LayoutBossTela,
  faixaProibida?: { x: number; largura: number },
): VirusBoss | null {
  const largura = VIRUS_BOSS_TAMANHO.largura * ESCALA_VIRUS_BOSS;
  const altura = VIRUS_BOSS_TAMANHO.altura * ESCALA_VIRUS_BOSS;
  const x = xAleatorioDrop(layout, largura, faixaProibida);
  if (x == null) return null;
  return {
    id: proximoId++,
    x,
    y: layout.tetoY - altura,
    largura,
    altura,
    hits: 0,
  };
}

function criarPatchQueda(layout: LayoutBossTela): PatchBoss {
  const largura = PATCH_TAMANHO.largura * ESCALA_PATCH;
  const altura = PATCH_TAMANHO.altura * ESCALA_PATCH;
  return {
    id: proximoId++,
    x: xAleatorioDrop(layout, largura) ?? layout.arena.x + 8,
    y: layout.tetoY - altura,
    largura,
    altura,
  };
}

function retangulosColidem(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax + aw > bx && ax < bx + bw && ay + ah > by && ay < by + bh;
}

/** Patch e vírus caem da linha do boss. Patch não nasce durante os 10 s. */
export function atualizarDropsArena(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  dt: number,
  faixaProibidaVirus?: { x: number; largura: number },
): void {
  if (arena.fase !== 'janela_patch') return;

  arena.tempoNaLutaS += dt;

  if (arena.patch) {
    arena.patch.y += VELOCIDADE_PATCH_QUEDA * dt;
    if (arena.patch.y > layout.pisoY) arena.patch = null;
  }

  const vivos: VirusBoss[] = [];
  for (const virus of arena.virus) {
    const yAntes = virus.y;
    virus.y += VELOCIDADE_VIRUS_BOSS * dt;
    if (
      arena.barra &&
      bateuTetoDaCaixaHit(
        virus.x,
        yAntes,
        virus.y,
        virus.largura,
        virus.altura,
        arena.barra,
      )
    ) {
      continue;
    }
    if (virus.y < layout.pisoY + virus.altura) vivos.push(virus);
  }
  arena.virus = vivos;

  arena.tempoAteDropS -= dt;
  if (arena.tempoAteDropS > 0) return;
  arena.tempoAteDropS = INTERVALO_DROP_BOSS_S;

  const podePatch =
    !arena.patch &&
    arena.tempoStunS <= 0 &&
    arena.barra == null &&
    arena.tempoNaLutaS >= ATRASO_PRIMEIRO_PATCH_S;
  const chancePatch = arena.encantoAtivo
    ? CHANCE_PATCH_QUEDA_ENCANTO
    : CHANCE_PATCH_QUEDA;
  if (podePatch && Math.random() < chancePatch) {
    arena.patch = criarPatchQueda(layout);
    return;
  }
  const pausarVirusNovos = (arena.faseInfeccao ?? 'inativa') !== 'inativa';
  if (arena.tipoTela === 'capitao_pirata') {
    nascerDropCapitao(arena, layout, faixaProibidaVirus, pausarVirusNovos);
    return;
  }
  if (!pausarVirusNovos && arena.virus.length < MAX_VIRUS_NA_TELA) {
    const virus = criarVirusQueda(layout, faixaProibidaVirus);
    if (virus) arena.virus.push(virus);
  }
}

export function tentarColetarPatchQueda(
  jogador: EstadoJogador,
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  orb: EstadoOrb,
): boolean {
  if (!arena.patch || arena.fase !== 'janela_patch') return false;
  if (arena.tempoStunS > 0) return false;
  const caixa = hitboxDoJogador(jogador);
  const p = arena.patch;
  const colide =
    caixa.direita > p.x &&
    caixa.esquerda < p.x + p.largura &&
    caixa.base > p.y &&
    caixa.topo < p.y + p.altura;
  if (!colide) return false;
  arena.patch = null;
  pararRouboCapitao(arena);
  abrirPontoFragil(arena, layout, orb);
  return true;
}

/** Vírus no mago = perde um coração, pose e som de morto. */
export function verificarHitVirus(
  jogador: EstadoJogador,
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
): boolean {
  if (arena.fase !== 'janela_patch') return false;
  if (arena.tempoMortoS > 0 || arena.tempoInvencivelS > 0) return false;
  // O sprite do mago é maior que só o chapéu: se o vírus encosta no corpo,
  // conta como hit (antes só o chapéu descontava e o 1º toque “não fazia nada”).
  const caixa = hitboxDoJogador(jogador);
  for (let i = arena.virus.length - 1; i >= 0; i--) {
    const v = arena.virus[i];
    const colide = retangulosColidem(
      v.x,
      v.y,
      v.largura,
      v.altura,
      caixa.esquerda,
      caixa.topo,
      caixa.direita - caixa.esquerda,
      caixa.base - caixa.topo,
    );
    if (!colide) continue;
    arena.virus.splice(i, 1);
    arena.vidas -= 1;
    jogador.pose = 'muerto';
    jogador.vx = 0;
    jogador.vy = 0;
    jogador.y = layout.pisoY - ALTURA_JOGADOR;
    arena.tempoMortoS = DURACAO_MORTO_BOSS_S;
    return true;
  }
  return false;
}

export function atualizarInvencivelArena(arena: EstadoArenaBoss, dt: number): void {
  if (arena.tempoInvencivelS <= 0) return;
  arena.tempoInvencivelS -= dt;
  if (arena.tempoInvencivelS < 0) arena.tempoInvencivelS = 0;
}

function alinharAnzolAoCarrinho(anzol: EstadoAnzol): void {
  anzol.xAnzol = anzol.xCarrinho + larguraCarrinho() / 2 - larguraAnzol() / 2;
}

function yAlvoAnzolNaOrb(
  orb: EstadoOrb,
  _alturaOrb: number,
  yRecolhido: number,
  layout: LayoutBossTela,
): number {
  const offsetPonta = (PONTA_ANZOL_ART.y / PONTA_ANZOL_ART.altura) * alturaAnzol();
  const yAnzol = orb.y + MARGEM_PONTA_ORB_PX - offsetPonta;
  const yMax = layout.pisoY - alturaAnzol();
  return Math.max(yRecolhido + 16, Math.min(yAnzol, yMax));
}

function velocidadeDescidaAnzol(anzol: EstadoAnzol): number {
  const dist = Math.max(1, anzol.yAlvo - anzol.yRecolhido);
  return Math.max(dist / DESCIDA_ANZOL_S, 850);
}

function velocidadeSubidaAnzol(anzol: EstadoAnzol): number {
  const dist = Math.max(1, anzol.yAlvo - anzol.yRecolhido);
  return dist / SUBIDA_ANZOL_S;
}

function patrulharCarrinho(anzol: EstadoAnzol, layout: LayoutBossTela, dt: number): void {
  const { minX, maxX } = limitesCarrinho(layout);
  anzol.xCarrinho += anzol.direcao * VELOCIDADE_CARRINHO_ANZOL * dt;
  if (anzol.xCarrinho <= minX) {
    anzol.xCarrinho = minX;
    anzol.direcao = 1;
  } else if (anzol.xCarrinho >= maxX) {
    anzol.xCarrinho = maxX;
    anzol.direcao = -1;
  }
}

function tentarRebaterAnzolNaHit(
  arena: EstadoArenaBoss,
  anzol: EstadoAnzol,
  yAnzolAntes: number,
): boolean {
  if (!arena.barra) return false;
  if (
    !bateuTetoDaCaixaHit(
      anzol.xAnzol,
      yAnzolAntes,
      anzol.yAnzol,
      larguraAnzol(),
      alturaAnzol(),
      arena.barra,
    )
  ) {
    return false;
  }
  anzol.fase = 'subindo';
  anzol.tempoFaseS = 0;
  anzol.yAnzol = arena.barra.y - alturaAnzol();
  return true;
}

function orbForaDaCabeca(arena: EstadoArenaBoss): boolean {
  const infeccao = arena.faseInfeccao ?? 'inativa';
  return (
    arena.orbAmarrada ||
    arena.tempoSequestroOrbS > 0 ||
    arena.tempoPiscaSoltaOrbS > 0 ||
    infeccao !== 'inativa'
  );
}

/** Orb fora da cabeça (pesca, infecção ou pisca de volta). */
export function orbEstaForaDaCabeca(arena: EstadoArenaBoss): boolean {
  return orbForaDaCabeca(arena);
}

function pontaDoAnzol(anzol: EstadoAnzol): { x: number; y: number } {
  return {
    x: anzol.xAnzol + (PONTA_ANZOL_ART.x / PONTA_ANZOL_ART.largura) * larguraAnzol(),
    y: anzol.yAnzol + (PONTA_ANZOL_ART.y / PONTA_ANZOL_ART.altura) * alturaAnzol(),
  };
}

function amarrarOrbNoAnzol(
  orb: EstadoOrb,
  anzol: EstadoAnzol,
  larguraOrb: number,
  _alturaOrb: number,
): void {
  const ponta = pontaDoAnzol(anzol);
  orb.x = ponta.x - larguraOrb / 2;
  orb.y = ponta.y - MARGEM_PONTA_ORB_PX;
}

function anzolTocouOrb(
  anzol: EstadoAnzol,
  orb: EstadoOrb,
  larguraOrb: number,
  _alturaOrb: number,
  yAnzolAntes?: number,
): boolean {
  const ponta = pontaDoAnzol(anzol);
  const m = MARGEM_PONTA_ORB_PX;
  const offsetY = (PONTA_ANZOL_ART.y / PONTA_ANZOL_ART.altura) * alturaAnzol();
  const pontaYAntes =
    yAnzolAntes == null ? ponta.y : yAnzolAntes + offsetY;
  const yVar = Math.min(ponta.y, pontaYAntes) - m / 2;
  const hVar = Math.max(ponta.y, pontaYAntes) + m - yVar;
  return retangulosColidem(
    ponta.x - m / 2,
    yVar,
    m,
    Math.max(m, hVar),
    orb.x,
    orb.y,
    larguraOrb,
    m,
  );
}

function tentarPescarOrb(
  arena: EstadoArenaBoss,
  anzol: EstadoAnzol,
  orb: EstadoOrb,
  larguraOrb: number,
  alturaOrb: number,
  yAnzolAntes?: number,
): void {
  if (orbForaDaCabeca(arena)) return;
  if (!anzolTocouOrb(anzol, orb, larguraOrb, alturaOrb, yAnzolAntes)) return;
  arena.orbAmarrada = true;
  arena.tempoHahahaBossS = DURACAO_HAHAHA_BOSS_S;
  arena.tokenHahahaBoss += 1;
}

export function atualizarAnzolArena(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  orb: EstadoOrb,
  larguraOrb: number,
  alturaOrb: number,
  dt: number,
): void {
  const anzol = arena.anzol;
  if (!anzol || arena.fase !== 'janela_patch') return;

  anzol.yCarrinho = yCarrinhoNaFaixa(layout);
  anzol.yRecolhido = anzol.yCarrinho + alturaCarrinho() - 6;
  const yAnzolAntes = anzol.yAnzol;

  if (anzol.fase === 'patrulha') {
    patrulharCarrinho(anzol, layout, dt);
    alinharAnzolAoCarrinho(anzol);
    anzol.yAnzol = anzol.yRecolhido;
    if (!orbForaDaCabeca(arena)) {
      anzol.tempoFaseS += dt;
      if (anzol.tempoFaseS >= PATRULHA_ANZOL_S) {
        anzol.fase = 'descendo';
        anzol.tempoFaseS = 0;
        anzol.yAlvo = yAlvoAnzolNaOrb(orb, alturaOrb, anzol.yRecolhido, layout);
      }
    }
    return;
  }

  alinharAnzolAoCarrinho(anzol);

  if (anzol.fase === 'descendo') {
    anzol.yAnzol += velocidadeDescidaAnzol(anzol) * dt;
    if (tentarRebaterAnzolNaHit(arena, anzol, yAnzolAntes)) return;
    tentarPescarOrb(arena, anzol, orb, larguraOrb, alturaOrb, yAnzolAntes);
    if (anzol.yAnzol >= anzol.yAlvo) {
      anzol.yAnzol = anzol.yAlvo;
      anzol.fase = 'parado';
      anzol.tempoFaseS = 0;
    }
    return;
  }

  if (anzol.fase === 'parado') {
    anzol.yAnzol = anzol.yAlvo;
    tentarPescarOrb(arena, anzol, orb, larguraOrb, alturaOrb);
    anzol.tempoFaseS += dt;
    if (anzol.tempoFaseS >= PARADO_ANZOL_S) {
      anzol.fase = 'subindo';
      anzol.tempoFaseS = 0;
    }
    return;
  }

  if (anzol.fase === 'subindo') {
    anzol.yAnzol -= velocidadeSubidaAnzol(anzol) * dt;
    if (anzol.yAnzol <= anzol.yRecolhido) {
      anzol.yAnzol = anzol.yRecolhido;
      anzol.fase = 'patrulha';
      anzol.tempoFaseS = 0;
    }
  }
}

export function atualizarSequestroOrb(
  arena: EstadoArenaBoss,
  orb: EstadoOrb,
  jogador: EstadoJogador,
  larguraOrb: number,
  alturaOrb: number,
  dt: number,
): void {
  if (arena.tipoTela === 'zombie_net') {
    if (arena.faseInfeccao === 'inativa') {
      seguirAcimaDaCabeca(orb, jogador, dt, larguraOrb, alturaOrb);
    }
    return;
  }

  const anzol = arena.anzol;

  if (arena.orbAmarrada && anzol) {
    amarrarOrbNoAnzol(orb, anzol, larguraOrb, alturaOrb);
    // O relógio de 7 s só arma quando o anzol já está recolhido em cima.
    if (anzol.fase === 'patrulha') {
      if (arena.tempoSequestroOrbS <= 0) {
        arena.tempoSequestroOrbS = SEQUESTRO_ORB_S;
      }
      arena.tempoSequestroOrbS -= dt;
      if (arena.tempoSequestroOrbS <= 0) {
        arena.tempoSequestroOrbS = 0;
        arena.orbAmarrada = false;
        arena.tempoPiscaSoltaOrbS = DURACAO_PISCA_SOLTA_ORB_S;
      }
    }
    return;
  }

  if (arena.tempoPiscaSoltaOrbS > 0 && anzol) {
    amarrarOrbNoAnzol(orb, anzol, larguraOrb, alturaOrb);
    arena.tempoPiscaSoltaOrbS -= dt;
    if (arena.tempoPiscaSoltaOrbS <= 0) {
      arena.tempoPiscaSoltaOrbS = 0;
      posicionarOrbAcimaDaCabeca(orb, jogador, larguraOrb, alturaOrb);
    }
    return;
  }

  seguirAcimaDaCabeca(orb, jogador, dt, larguraOrb, alturaOrb);
}

/** Conta a animação de hit do boss e o flash vermelho das moedas. */
export function atualizarHitBoss(arena: EstadoArenaBoss, dt: number): void {
  if (arena.tempoHitBossS > 0) {
    arena.tempoHitBossS -= dt;
    if (arena.tempoHitBossS < 0) arena.tempoHitBossS = 0;
  }
  if ((arena.tempoHitMoedasS ?? 0) > 0) {
    arena.tempoHitMoedasS -= dt;
    if (arena.tempoHitMoedasS < 0) arena.tempoHitMoedasS = 0;
  }
}

function marcarHitMoedas(arena: EstadoArenaBoss): void {
  arena.tempoHitMoedasS = DURACAO_HIT_BOSS_S;
}

/** HAHAHA uma vez após a pesca; pausa se o hit estiver na tela. */
export function atualizarHahahaBoss(arena: EstadoArenaBoss, dt: number): void {
  if ((arena.tempoHahahaBossS ?? 0) <= 0) return;
  if (arena.tempoHitBossS > 0) return;
  arena.tempoHahahaBossS -= dt;
  if (arena.tempoHahahaBossS < 0) arena.tempoHahahaBossS = 0;
}

/** Caiu da arena: perde um coração e entra na pose de morto. */
export function verificarMorteArena(
  jogador: EstadoJogador,
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
): void {
  if (arena.fase === 'janela_patch') return;
  if (arena.tempoMortoS > 0) return;
  if (jogador.y <= layout.arena.y + layout.arena.h) return;

  arena.vidas -= 1;
  arena.tempoMortoS = DURACAO_MORTO_S;
  jogador.pose = 'muerto';
  jogador.vx = 0;
  jogador.vy = 0;
  jogador.y = layout.arena.y + layout.arena.h - ALTURA_JOGADOR;
}

/** Conta o tempo de morto; revive no piso ou encerra se não restam corações. */
export function atualizarTempoMortoArena(
  arena: EstadoArenaBoss,
  jogador: EstadoJogador,
  layout: LayoutBossTela,
  dt: number,
): void {
  if (arena.tempoMortoS <= 0) return;
  arena.tempoMortoS -= dt;
  jogador.pose = 'muerto';
  jogador.vx = 0;
  jogador.vy = 0;
  if (arena.fase === 'janela_patch') {
    jogador.y = layout.pisoY - ALTURA_JOGADOR;
  } else {
    const chao = layout.arena.y + layout.arena.h - ALTURA_JOGADOR;
    if (jogador.y > chao) jogador.y = chao;
  }
  if (arena.tempoMortoS > 0) return;
  if (arena.vidas <= 0) {
    arena.vivo = false;
    return;
  }
  reviverNaArena(jogador, arena, layout);
}

function reviverNaArena(
  jogador: EstadoJogador,
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
): void {
  if (arena.fase === 'janela_patch') {
    jogador.y = layout.pisoY - ALTURA_JOGADOR;
    jogador.vx = 0;
    jogador.vy = 0;
    jogador.pose = 'parado';
    jogador.tempoPose = 0;
    arena.tempoMortoS = 0;
    arena.tempoInvencivelS = INVENCIVEL_APOS_VIRUS_S;
    return;
  }
  if (arena.hitboxes.length === 0) {
    arena.hitboxes = criarHitboxesIniciais(layout, arena.encantoAtivo);
  }
  const alvo = [...arena.hitboxes].sort((a, b) => b.y - a.y)[0];
  jogador.x = alvo
    ? alvo.x + (alvo.largura - LARGURA_JOGADOR) / 2
    : layout.arena.x + layout.arena.w / 2 - LARGURA_JOGADOR / 2;
  const xMin = layout.arena.x;
  const xMax = layout.arena.x + layout.arena.w - LARGURA_JOGADOR;
  if (jogador.x < xMin) jogador.x = xMin;
  if (jogador.x > xMax) jogador.x = xMax;
  jogador.y = (alvo?.y ?? layout.pisoY) - ALTURA_JOGADOR;
  jogador.vx = 0;
  jogador.vy = IMPULSO_SALTO * 0.7;
  jogador.pose = 'agachado';
  jogador.tempoPose = DURACAO_AGACHADO_S;
  arena.tempoMortoS = 0;
}

function tamanhoMiniBot(): { largura: number; altura: number } {
  return {
    largura: MINI_BOT_ZOMBIE.largura * ESCALA_MINI_BOT_ZOMBIE,
    altura: MINI_BOT_ZOMBIE.altura * ESCALA_MINI_BOT_ZOMBIE,
  };
}

function avancarDancaMiniBot(bot: MiniBotZombie, dt: number): void {
  bot.tempoDancaS -= dt;
  if (bot.tempoDancaS > 0) {
    bot.x = bot.xQueda + bot.direcao * AMPLITUDE_DANCA_MINI_BOT_PX;
    return;
  }
  bot.tempoDancaS = TEMPO_PASSO_DANCA_MINI_BOT_S;
  bot.passoDanca = (bot.passoDanca + 1) % PASSOS_DANCA_MINI_BOT;
  bot.direcao = bot.direcao === 1 ? -1 : 1;
  bot.x = bot.xQueda + bot.direcao * AMPLITUDE_DANCA_MINI_BOT_PX;
}

function tentarNascerMiniBot(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
): boolean {
  if (arena.tipoTela !== 'zombie_net') return false;
  if (arena.fase !== 'janela_patch') return false;
  if (arena.faseInfeccao !== 'inativa') return false;

  const { largura, altura } = tamanhoMiniBot();
  const faixaBarra = arena.barra
    ? { x: arena.barra.x, largura: arena.barra.largura }
    : undefined;
  let xQueda = xAleatorioDrop(layout, largura, faixaBarra);
  if (xQueda == null) {
    xQueda = xAleatorioDrop(layout, largura);
  }
  if (xQueda == null) return false;
  const olhaDireita = Math.random() < 0.5;

  arena.miniBots.push({
    id: proximoId++,
    x: xQueda,
    y: layout.tetoY + 2,
    largura,
    altura,
    xQueda,
    direcao: olhaDireita ? 1 : -1,
    passoDanca: 0,
    tempoDancaS: TEMPO_PASSO_DANCA_MINI_BOT_S,
    hits: 0,
    tempoPiscaSumirS: 0,
  });
  return true;
}

/**
 * Mini-bots: caem na velocidade do vírus, dancinha parado no ar.
 * Spawn aleatório — vários ao mesmo tempo. A hit-box aberta some com o que encosta no teto.
 * Devolve true se algum bot sequestra a orb neste quadro.
 */
export function atualizarMiniBotsZombie(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  orb: EstadoOrb,
  larguraOrb: number,
  alturaOrb: number,
  dt: number,
): boolean {
  if (arena.tipoTela !== 'zombie_net' || arena.fase !== 'janela_patch') return false;

  arena.tempoAteMiniBotS -= dt;
  if (arena.tempoAteMiniBotS <= 0) {
    if (arena.faseInfeccao !== 'inativa') {
      arena.tempoAteMiniBotS = INTERVALO_RETRY_MINI_BOT_S;
    } else if (Math.random() < CHANCE_MINI_BOT_QUEDA && tentarNascerMiniBot(arena, layout)) {
      arena.tempoAteMiniBotS = INTERVALO_MINI_BOT_S;
    } else {
      arena.tempoAteMiniBotS = INTERVALO_RETRY_MINI_BOT_S;
    }
  }

  let sequestrou = false;
  const restantes: MiniBotZombie[] = [];

  for (const bot of arena.miniBots) {
    if (bot.tempoPiscaSumirS > 0) {
      bot.tempoPiscaSumirS -= dt;
      if (bot.tempoPiscaSumirS > 0) restantes.push(bot);
      continue;
    }

    const yAntes = bot.y;
    bot.y += VELOCIDADE_QUEDA_MINI_BOT * dt;
    avancarDancaMiniBot(bot, dt);

    if (
      arena.barra &&
      bateuTetoDaCaixaHit(
        bot.x,
        yAntes,
        bot.y,
        bot.largura,
        bot.altura,
        arena.barra,
      )
    ) {
      continue;
    }

    if (bot.y >= layout.pisoY + bot.altura) continue;

    if (
      !sequestrou &&
      arena.faseInfeccao === 'inativa' &&
      arena.tempoMortoS <= 0 &&
      !orbForaDaCabeca(arena) &&
      retangulosColidem(
        bot.x,
        bot.y,
        bot.largura,
        bot.altura,
        orb.x,
        orb.y,
        larguraOrb,
        alturaOrb,
      )
    ) {
      sequestrou = true;
      bot.tempoPiscaSumirS = DURACAO_PISCA_MINI_BOT_S;
      arena.faseInfeccao = 'bot_sumindo';
      arena.tempoInvencivelS = Math.max(arena.tempoInvencivelS, 0.45);
    }

    restantes.push(bot);
  }

  arena.miniBots = restantes;
  return sequestrou;
}

function aproximarValor(atual: number, alvo: number, velocidade: number, dt: number): number {
  const delta = alvo - atual;
  const passo = velocidade * dt;
  if (Math.abs(delta) <= passo) return alvo;
  return atual + Math.sign(delta) * passo;
}

function prepararRajadaInfectada(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
): void {
  const lado: 'esquerda' | 'direita' = Math.random() < 0.5 ? 'esquerda' : 'direita';
  arena.ladoInfeccao = lado;
  arena.colunasRajada = montarColunasRajada(layout, lado);
  arena.indiceTiroRajada = 0;
  arena.tempoProximoTiroRajadaS = 0;
  arena.disparosInfectados = [];
}

function direcaoVarreduraOrb(colunas: number[]): number {
  if (colunas.length < 2) return 1;
  return colunas[1] >= colunas[0] ? 1 : -1;
}

function xOrbSobreTiro(xTiro: number, larguraOrb: number): number {
  return xTiro + larguraTiroInfectado() / 2 - larguraOrb / 2;
}

function xInicioVarreduraOrb(colunas: number[], larguraOrb: number): number {
  const dir = direcaoVarreduraOrb(colunas);
  const primeiro = xOrbSobreTiro(colunas[0], larguraOrb);
  const passo =
    colunas.length >= 2 ? Math.abs(colunas[1] - colunas[0]) : Math.max(larguraOrb, 48);
  return primeiro - dir * passo * 0.45;
}

function velocidadeVarreduraOrb(colunas: number[]): number {
  const passo = colunas.length >= 2 ? Math.abs(colunas[1] - colunas[0]) : 80;
  return passo / INTERVALO_TIRO_RAJADA_S;
}

function xTiroSaindoDaOrb(orb: EstadoOrb, larguraOrb: number): number {
  return orb.x + larguraOrb / 2 - larguraTiroInfectado() / 2;
}

function larguraTiroInfectado(): number {
  return DISPARO_VIAGEM.largura * ESCALA_SPRITE;
}

function alturaTiroInfectado(): number {
  return DISPARO_VIAGEM.altura * ESCALA_SPRITE;
}

/** Colunas com vão = hitbox do mago; bordas livres (1 mm de folga). */
function montarColunasRajada(layout: LayoutBossTela, lado: 'esquerda' | 'direita'): number[] {
  const hitW = larguraHitboxJogador();
  const tiroW = larguraTiroInfectado();
  const mm = MARGEM_JUSTA_RAJADA_PX;
  const primeiraEsq =
    layout.arena.x + LARGURA_JOGADOR - (LARGURA_JOGADOR - hitW) / 2 + mm;
  const ultimaDir =
    layout.arena.x +
    layout.arena.w -
    LARGURA_JOGADOR +
    (LARGURA_JOGADOR - hitW) / 2 -
    mm -
    tiroW;
  const passo = tiroW + hitW;
  const colunas: number[] = [];
  let x = primeiraEsq;
  while (x <= ultimaDir + 0.5) {
    colunas.push(x);
    x += passo;
  }
  if (colunas.length === 0) {
    colunas.push((primeiraEsq + ultimaDir) / 2);
  }
  if (lado === 'direita') colunas.reverse();
  return colunas;
}

function criarTiroInfectado(x: number, y: number): DisparoBoss {
  return {
    id: proximoId++,
    x,
    y,
    largura: larguraTiroInfectado(),
    altura: alturaTiroInfectado(),
    fase: 'viagem',
    tempoFaseS: 0,
  };
}

function aplicarDanoInfectadoNoMago(
  arena: EstadoArenaBoss,
  jogador: EstadoJogador,
  layout: LayoutBossTela,
): void {
  arena.vidas -= 1;
  jogador.pose = 'muerto';
  jogador.vx = 0;
  jogador.vy = 0;
  jogador.y = layout.pisoY - ALTURA_JOGADOR;
  arena.tempoMortoS = DURACAO_MORTO_BOSS_S;
}

/**
 * Rajada: a orb sobe, varre o topo e atira de cima dela (move → dispara → move).
 * Devolve quantos tiros nasceram neste quadro (som) e se o mago tomou hit.
 */
export function atualizarRajadaZombie(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  jogador: EstadoJogador,
  orb: EstadoOrb,
  larguraOrb: number,
  alturaOrb: number,
  dt: number,
): { tirosNascidos: number; hitMago: boolean } {
  const vazio = { tirosNascidos: 0, hitMago: false };
  if (arena.tipoTela !== 'zombie_net' || arena.fase !== 'janela_patch') return vazio;

  if (arena.faseInfeccao === 'bot_sumindo') {
    if (arena.colunasRajada.length === 0) {
      prepararRajadaInfectada(arena, layout);
    }
    const vel = velocidadeVarreduraOrb(arena.colunasRajada);
    const xInicio = xInicioVarreduraOrb(arena.colunasRajada, larguraOrb);
    orb.y = aproximarValor(orb.y, layout.tetoY + 2, vel * FATOR_SUBIDA_ORB_INFECTADA, dt);
    orb.x = aproximarValor(orb.x, xInicio, vel * FATOR_SUBIDA_ORB_INFECTADA, dt);
    const aindaPiscando = arena.miniBots.some((bot) => bot.tempoPiscaSumirS > 0);
    if (aindaPiscando) return vazio;
    const chegou =
      Math.abs(orb.y - (layout.tetoY + 2)) < 2 && Math.abs(orb.x - xInicio) < 4;
    if (!chegou) return vazio;
    orb.y = layout.tetoY + 2;
    orb.x = xInicio;
    arena.tempoProximoTiroRajadaS = ESPERA_RAJADA_ORB_S;
    arena.faseInfeccao = 'espera_rajada';
    return vazio;
  }

  if (arena.faseInfeccao === 'espera_rajada') {
    orb.y = layout.tetoY + 2;
    orb.x = xInicioVarreduraOrb(arena.colunasRajada, larguraOrb);
    arena.tempoProximoTiroRajadaS -= dt;
    if (arena.tempoProximoTiroRajadaS > 0) return vazio;
    arena.tempoProximoTiroRajadaS = 0;
    arena.faseInfeccao = 'rajada';
  }

  if (arena.faseInfeccao === 'espera_rajada' || arena.faseInfeccao === 'rajada' || arena.faseInfeccao === 'pisca_volta') {
    orb.y = layout.tetoY + 2;
  }

  let tirosNascidos = 0;
  if (arena.faseInfeccao === 'rajada' && arena.colunasRajada.length > 0) {
    const vel = velocidadeVarreduraOrb(arena.colunasRajada);
    if (arena.indiceTiroRajada < arena.colunasRajada.length) {
      const alvoX = xOrbSobreTiro(
        arena.colunasRajada[arena.indiceTiroRajada],
        larguraOrb,
      );
      orb.x = aproximarValor(orb.x, alvoX, vel, dt);
      if (Math.abs(orb.x - alvoX) < 0.5) {
        arena.disparosInfectados.push(
          criarTiroInfectado(xTiroSaindoDaOrb(orb, larguraOrb), orb.y + alturaOrb - 4),
        );
        arena.indiceTiroRajada += 1;
        tirosNascidos += 1;
      }
    }
  }

  let hitMago = false;
  const vivos: DisparoBoss[] = [];
  for (const disparo of arena.disparosInfectados) {
    if (disparo.fase === 'impacto') {
      disparo.tempoFaseS += dt;
      if (disparo.tempoFaseS < DURACAO_IMPACTO_DISPARO_S) vivos.push(disparo);
      continue;
    }

    const yAntes = disparo.y;
    disparo.y += VELOCIDADE_DISPARO_INFECTADO * dt;
    const yVar = Math.min(yAntes, disparo.y);
    const hVar =
      Math.max(yAntes + disparo.altura, disparo.y + disparo.altura) - yVar;

    if (
      arena.barra &&
      bateuTetoDaCaixaHit(
        disparo.x,
        yAntes,
        disparo.y,
        disparo.largura,
        disparo.altura,
        arena.barra,
      )
    ) {
      aplicarImpactoDisparo(disparo, arena.barra.y);
      vivos.push(disparo);
      continue;
    }

    const caixa = hitboxDoJogador(jogador);
    if (
      !hitMago &&
      arena.tempoMortoS <= 0 &&
      arena.tempoInvencivelS <= 0 &&
      retangulosColidem(
        disparo.x,
        yVar,
        disparo.largura,
        hVar,
        caixa.esquerda,
        caixa.topo,
        caixa.direita - caixa.esquerda,
        caixa.base - caixa.topo,
      )
    ) {
      hitMago = true;
      aplicarDanoInfectadoNoMago(arena, jogador, layout);
      aplicarImpactoDisparo(disparo, caixa.topo);
      vivos.push(disparo);
      continue;
    }

    if (disparo.y < layout.pisoY) {
      vivos.push(disparo);
    }
  }
  arena.disparosInfectados = vivos;

  if (arena.faseInfeccao === 'rajada') {
    const cadeiaFim =
      arena.indiceTiroRajada >= arena.colunasRajada.length &&
      arena.disparosInfectados.length === 0;
    if (cadeiaFim) {
      arena.faseInfeccao = 'pisca_volta';
      arena.tempoPiscaSoltaOrbS = DURACAO_PISCA_VOLTA_ORB_S;
    }
  }

  if (arena.faseInfeccao === 'pisca_volta') {
    arena.tempoPiscaSoltaOrbS -= dt;
    if (arena.tempoPiscaSoltaOrbS <= 0) {
      arena.tempoPiscaSoltaOrbS = 0;
      arena.faseInfeccao = 'inativa';
      arena.colunasRajada = [];
      arena.indiceTiroRajada = 0;
      posicionarOrbAcimaDaCabeca(orb, jogador, larguraOrb, alturaOrb);
    }
  }

  return { tirosNascidos, hitMago };
}

function tamanhoMoedaArena(): { largura: number; altura: number } {
  return {
    largura: MOEDA_PLATAFORMA_TAMANHO.largura * ESCALA_MOEDA,
    altura: MOEDA_PLATAFORMA_TAMANHO.altura * ESCALA_MOEDA,
  };
}

function tamanhoBauPix(): { largura: number; altura: number } {
  return {
    largura: BAU_PIX_FECHADO.largura * ESCALA_BAU_PIX,
    altura: BAU_PIX_FECHADO.altura * ESCALA_BAU_PIX,
  };
}

function criarMoedaArena(
  layout: LayoutBossTela,
  pirata: boolean,
  faixaProibida?: { x: number; largura: number },
): MoedaArena | null {
  const { largura, altura } = tamanhoMoedaArena();
  const x = xAleatorioDrop(layout, largura, faixaProibida);
  if (x == null) return null;
  return {
    id: proximoId++,
    x,
    y: layout.tetoY - altura,
    largura,
    altura,
    pirata,
  };
}

function nascerDropCapitao(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  faixaProibidaVirus: { x: number; largura: number } | undefined,
  pausarVirusNovos: boolean,
): void {
  if (!arena.moedasArena) arena.moedasArena = [];
  const r = Math.random();
  const cheio = arena.moedasArena.length >= MAX_MOEDAS_ARENA;
  if (!cheio && r < CHANCE_MOEDA_ARENA_CAPITAO) {
    const moeda = criarMoedaArena(layout, false, faixaProibidaVirus);
    if (moeda) arena.moedasArena.push(moeda);
  } else if (
    !cheio &&
    r < CHANCE_MOEDA_ARENA_CAPITAO + CHANCE_MOEDA_PIRATA_ARENA
  ) {
    const moeda = criarMoedaArena(layout, true, faixaProibidaVirus);
    if (moeda) arena.moedasArena.push(moeda);
  }
  if (!pausarVirusNovos && arena.virus.length < MAX_VIRUS_NA_TELA) {
    const virus = criarVirusQueda(layout, faixaProibidaVirus);
    if (virus) arena.virus.push(virus);
  }
}

function pararRouboCapitao(arena: EstadoArenaBoss): void {
  arena.roboAtivo = false;
  arena.tempoRouboS = 0;
}

function iniciarRouboCapitao(arena: EstadoArenaBoss): void {
  if (arena.roboAtivo) return;
  arena.roboAtivo = true;
  arena.tempoRouboS = INTERVALO_ROUBO_S;
  arena.avisoRouboPendente = true;
  arena.idPatchAoIniciarRoubo = arena.patch?.id ?? -1;
  arena.tempoHahahaBossS = DURACAO_HAHAHA_BOSS_S;
  arena.tokenHahahaBoss += 1;
}

/** Queda bloqueada pelo guarda-chuva (caixa-hit) ou por uma hit-box. */
function quedaBloqueadaPeloGuardaChuva(
  x: number,
  yAntes: number,
  yDepois: number,
  largura: number,
  altura: number,
  arena: EstadoArenaBoss,
): boolean {
  if (
    arena.barra &&
    bateuTetoDaCaixaHit(x, yAntes, yDepois, largura, altura, arena.barra)
  ) {
    return true;
  }
  for (const hitbox of arena.hitboxes) {
    if (bateuTetoDaCaixaHit(x, yAntes, yDepois, largura, altura, hitbox)) {
      return true;
    }
  }
  return false;
}

/** Hit-box guarda-chuva: some a moeda pirata (a boa atravessa). */
function pirataBateuGuardaChuva(
  moeda: MoedaArena,
  yAntes: number,
  arena: EstadoArenaBoss,
): boolean {
  return quedaBloqueadaPeloGuardaChuva(
    moeda.x,
    yAntes,
    moeda.y,
    moeda.largura,
    moeda.altura,
    arena,
  );
}

/**
 * Moedas do Capitão: caem, a boa soma +1, a pirata tira 5.
 * Hit-box só come a pirata (a boa atravessa).
 */
export function atualizarMoedasArenaCapitao(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  jogador: EstadoJogador,
  dt: number,
): { coletouBoa: boolean; coletouPirata: boolean } {
  const vazio = { coletouBoa: false, coletouPirata: false };
  if (arena.tipoTela !== 'capitao_pirata' || arena.fase !== 'janela_patch') {
    return vazio;
  }
  if (!arena.moedasArena) arena.moedasArena = [];

  let coletouBoa = false;
  let coletouPirata = false;
  const caixa = hitboxDoJogador(jogador);
  const restantes: MoedaArena[] = [];

  for (const moeda of arena.moedasArena) {
    const yAntes = moeda.y;
    moeda.y += VELOCIDADE_MOEDA_ARENA * dt;
    if (moeda.pirata && pirataBateuGuardaChuva(moeda, yAntes, arena)) {
      continue;
    }
    if (moeda.y > layout.pisoY) continue;

    const colide =
      caixa.direita > moeda.x &&
      caixa.esquerda < moeda.x + moeda.largura &&
      caixa.base > moeda.y &&
      caixa.topo < moeda.y + moeda.altura;
    if (colide && arena.tempoMortoS <= 0) {
      if (moeda.pirata) {
        arena.moedasRun = Math.max(0, arena.moedasRun - PENALIDADE_MOEDA_PIRATA);
        marcarHitMoedas(arena);
        coletouPirata = true;
      } else {
        arena.moedasRun += 1;
        coletouBoa = true;
      }
      continue;
    }
    restantes.push(moeda);
  }
  arena.moedasArena = restantes;
  return { coletouBoa, coletouPirata };
}

function criarBauPix(layout: LayoutBossTela): BauPixArena {
  const { largura, altura } = tamanhoBauPix();
  const x =
    xAleatorioDrop(layout, largura) ?? layout.arena.x + 8;
  return {
    id: proximoId++,
    x,
    y: layout.tetoY - altura,
    largura,
    altura,
    tampaAberta: true,
    tempoFrameS: DURACAO_FRAME_BAU_PIX_S,
  };
}

/**
 * Baú Pix: cai, abre/fecha a tampa, rouba a conta se tocar o mago.
 */
export function atualizarBauCapitao(
  arena: EstadoArenaBoss,
  layout: LayoutBossTela,
  jogador: EstadoJogador,
  dt: number,
): boolean {
  if (arena.tipoTela !== 'capitao_pirata' || arena.fase !== 'janela_patch') {
    return false;
  }

  if (!arena.roboAtivo && !arena.bauPix) {
    arena.tempoAteBauS -= dt;
    if (arena.tempoAteBauS <= 0) {
      arena.bauPix = criarBauPix(layout);
      arena.tempoAteBauS = INTERVALO_BAU_PIX_S;
    }
  }

  const bau = arena.bauPix;
  if (!bau) return false;

  bau.tempoFrameS -= dt;
  if (bau.tempoFrameS <= 0) {
    bau.tampaAberta = !bau.tampaAberta;
    bau.tempoFrameS = DURACAO_FRAME_BAU_PIX_S;
  }

  const yAntes = bau.y;
  bau.y += VELOCIDADE_BAU_PIX * dt;
  if (quedaBloqueadaPeloGuardaChuva(
    bau.x,
    yAntes,
    bau.y,
    bau.largura,
    bau.altura,
    arena,
  )) {
    arena.bauPix = null;
    return false;
  }
  if (bau.y > layout.pisoY) {
    arena.bauPix = null;
    return false;
  }

  const caixa = hitboxDoJogador(jogador);
  const colide =
    arena.tempoMortoS <= 0 &&
    caixa.direita > bau.x &&
    caixa.esquerda < bau.x + bau.largura &&
    caixa.base > bau.y &&
    caixa.topo < bau.y + bau.altura;
  if (!colide) return false;

  arena.bauPix = null;
  iniciarRouboCapitao(arena);
  return true;
}

/** −5 moedas por segundo enquanto o roubo estiver ligado. */
export function atualizarRouboCapitao(arena: EstadoArenaBoss, dt: number): boolean {
  if (!arena.roboAtivo || arena.fase !== 'janela_patch') return false;
  if (arena.moedasRun <= 0) {
    pararRouboCapitao(arena);
    return false;
  }
  arena.tempoRouboS -= dt;
  if (arena.tempoRouboS > 0) return false;
  arena.tempoRouboS += INTERVALO_ROUBO_S;
  arena.moedasRun = Math.max(0, arena.moedasRun - PENALIDADE_ROUBO_S);
  marcarHitMoedas(arena);
  if (arena.moedasRun <= 0) pararRouboCapitao(arena);
  return true;
}
