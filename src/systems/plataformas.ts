/**
 * Spawn e reciclagem de plataformas.
 * Fake entra na cadeia (armadilha). Loja é extra ao lado: 50 m, 200 m, depois de 300 em 300.
 * Fase 2+: móveis (1 cm pra cada lado). Fase 3+: quebradizas (pisca 1×, espera e some).
 * Primeira fake da run: 150 m (o 20 m de Dev está desligado por agora).
 */

import { PLATAFORMA_FAKE, PLATAFORMA_TIENDA, PLATAFORMAS } from '../assets';
import {
  ALCANCE_HORIZONTAL_MAX,
  CHANCE_PLATAFORMA_FAKE,
  CHANCE_PLATAFORMA_MOVEL,
  CHANCE_PLATAFORMA_QUEBRA,
  DESLOCAMENTO_PLATAFORMA_MOVEL_PX,
  DURACAO_MEIO_PISCA_QUEBRA_S,
  ATRASO_SUMICO_QUEBRA_S,
  ESCALA_PLATAFORMA,
  FRACAO_PISO_PLATAFORMA_TIENDA,
  GAP_PLATAFORMA_MAX,
  GAP_PLATAFORMA_MIN,
  MARGEM_HORIZONTAL,
  MARGEM_SPAWN_TOPO,
  PASSO_TIENDA_METROS,
  PERIODO_PLATAFORMA_MOVEL_S,
  PISCAS_PLATAFORMA_QUEBRA,
  ALTITUDE_PRIMEIRA_TIENDA,
  ALTITUDE_MIN_PLATAFORMA_TIENDA,
  FATOR_REDUCAO_ESPECIAL_FASE4,
  CHANCE_MINIBOT_ZOMBIE_FASE4,
  VELOCIDADE_MINIBOT_ZOMBIE_PX,
  ESCALA_MINIBOT_ZOMBIE_RUN,
  FPS_MINIBOT_ZOMBIE,
} from '../constants';
import { MINI_BOT_ZOMBIE_TAMANHO } from '../assets';
import type { Moeda } from '../entities/moeda';
import type { Plataforma } from '../entities/plataforma';
import type { FaseMapa } from './progressao-fases';

let proximoId = 1;

function sortearEntre(minimo: number, maximo: number): number {
  return minimo + Math.random() * (maximo - minimo);
}

interface OpcoesGerar {
  /** Se false, nunca nasce fake (iniciais / abaixo do limiar / já tem uma na tela). */
  permitirFake?: boolean;
  /** Primeira fake da faixa. */
  forcarFake?: boolean;
  /** Plataforma de baixo — o X novo fica ao alcance do salto. */
  anterior?: Plataforma;
  /** 1 = só normais; 2+ móvel; 3+ quebra. */
  faseMapa?: FaseMapa;
}

/** X aleatório, mas vizinho da anterior para não travar a subida. */
function sortearX(
  larguraTela: number,
  largura: number,
  anterior?: Plataforma,
  folgaExtra = 0,
): number {
  const xMin = MARGEM_HORIZONTAL + folgaExtra;
  const xMax = larguraTela - largura - MARGEM_HORIZONTAL - folgaExtra;
  if (xMax <= xMin) return Math.max(MARGEM_HORIZONTAL, xMin);
  if (!anterior) return sortearEntre(xMin, xMax);

  const centroAnt = anterior.x + anterior.largura / 2;
  const centroMin = Math.max(xMin + largura / 2, centroAnt - ALCANCE_HORIZONTAL_MAX);
  const centroMax = Math.min(xMax + largura / 2, centroAnt + ALCANCE_HORIZONTAL_MAX);
  const centro =
    centroMin >= centroMax
      ? Math.max(xMin + largura / 2, Math.min(xMax + largura / 2, centroAnt))
      : sortearEntre(centroMin, centroMax);
  return centro - largura / 2;
}

/** Não deixa a oscilação de 1 cm encostar na vizinha do lado / passar por cima. */
function oscilacaoBateNaVizinha(
  xBase: number,
  largura: number,
  y: number,
  altura: number,
  vizinha?: Plataforma,
): boolean {
  if (!vizinha) return false;
  const amp = DESLOCAMENTO_PLATAFORMA_MOVEL_PX;
  const sobrepoeY =
    y < vizinha.y + vizinha.altura && vizinha.y < y + altura;
  if (!sobrepoeY) return false;
  const xMin = xBase - amp;
  const xMax = xBase + largura + amp;
  const vMin = vizinha.x;
  const vMax = vizinha.x + vizinha.largura;
  return xMin < vMax && xMax > vMin;
}

function sortearEspecial(faseMapa: FaseMapa): 'movel' | 'quebra' | null {
  if (faseMapa < 2) return null;
  // Fase 4: -5% nas especiais (dá espaço para zombies e moedas piratas).
  const fator = faseMapa >= 4 ? FATOR_REDUCAO_ESPECIAL_FASE4 : 1;
  const r = Math.random();
  if (faseMapa >= 3) {
    if (r < CHANCE_PLATAFORMA_QUEBRA * fator) return 'quebra';
    if (r < (CHANCE_PLATAFORMA_QUEBRA + CHANCE_PLATAFORMA_MOVEL) * fator) return 'movel';
    return null;
  }
  if (r < CHANCE_PLATAFORMA_MOVEL * fator) return 'movel';
  return null;
}

function aplicarEspecial(
  plataforma: Plataforma,
  especial: 'movel' | 'quebra' | null,
  larguraTela: number,
  anterior?: Plataforma,
): void {
  if (!especial) return;
  if (especial === 'quebra') {
    plataforma.ehQuebra = true;
    plataforma.estadoQuebra = 'inteira';
    plataforma.visivelPisca = true;
    plataforma.piscasFeitos = 0;
    return;
  }

  const amp = DESLOCAMENTO_PLATAFORMA_MOVEL_PX;
  const xMin = MARGEM_HORIZONTAL + amp;
  const xMax = larguraTela - plataforma.largura - MARGEM_HORIZONTAL - amp;
  if (xMax < xMin) return;
  const xBase = Math.max(xMin, Math.min(xMax, plataforma.x));
  if (
    oscilacaoBateNaVizinha(
      xBase,
      plataforma.largura,
      plataforma.y,
      plataforma.altura,
      anterior,
    )
  ) {
    return;
  }
  plataforma.ehMovel = true;
  plataforma.xBase = xBase;
  plataforma.x = xBase;
  plataforma.faseOscilacao = Math.random() * PERIODO_PLATAFORMA_MOVEL_S;
}

/** Cria uma plataforma de tipo e posição horizontal aleatórios na altura y. */
export function gerarPlataforma(
  y: number,
  larguraTela: number,
  opcoes: OpcoesGerar = {},
): Plataforma {
  const permitirFake = opcoes.permitirFake ?? false;
  const forcarFake = opcoes.forcarFake ?? false;
  const anterior = opcoes.anterior;
  const faseMapa = opcoes.faseMapa ?? 1;
  const vizinhaEhFake = anterior?.ehFake === true;

  if (
    !vizinhaEhFake &&
    (forcarFake || (permitirFake && Math.random() < CHANCE_PLATAFORMA_FAKE))
  ) {
    const largura = PLATAFORMA_FAKE.largura * ESCALA_PLATAFORMA;
    const altura = PLATAFORMA_FAKE.altura * ESCALA_PLATAFORMA;
    const x = sortearX(larguraTela, largura, anterior);
    return { id: proximoId++, x, y, tipo: -1, largura, altura, ehFake: true };
  }

  const tipo = Math.floor(Math.random() * PLATAFORMAS.length);
  const arte = PLATAFORMAS[tipo];
  const largura = arte.largura * ESCALA_PLATAFORMA;
  const altura = arte.altura * ESCALA_PLATAFORMA;
  const especial = sortearEspecial(faseMapa);
  const folgaMovel = especial === 'movel' ? DESLOCAMENTO_PLATAFORMA_MOVEL_PX : 0;
  const x = sortearX(larguraTela, largura, anterior, folgaMovel);
  const plataforma: Plataforma = { id: proximoId++, x, y, tipo, largura, altura };
  aplicarEspecial(plataforma, especial, larguraTela, anterior);

  // Fase 4: zombie nasce apenas em plataformas fixas (não móvel, não quebra).
  // Nunca em duas plataformas consecutivas — garante sempre uma opção segura acima.
  if (faseMapa >= 4 && !plataforma.ehMovel && !plataforma.ehQuebra && !anterior?.zombie) {
    if (Math.random() < CHANCE_MINIBOT_ZOMBIE_FASE4) {
      const zW = MINI_BOT_ZOMBIE_TAMANHO.largura * ESCALA_MINIBOT_ZOMBIE_RUN;
      plataforma.zombie = {
        x: x + largura / 2 - zW / 2,
        dir: (Math.random() < 0.5 ? 1 : -1) as 1 | -1,
        frameTimer: 0,
        frameAtual: 0,
      };
    }
  }

  return plataforma;
}

/**
 * Estado inicial da run: uma plataforma garantida sob o mago
 * e o resto da tela preenchido subindo com gaps aleatórios (sem fake).
 */
export function criarPlataformasIniciais(
  larguraTela: number,
  alturaTela: number,
  faseMapa: FaseMapa = 1,
): Plataforma[] {
  const iniciais: Plataforma[] = [];

  const base = gerarPlataforma(alturaTela - 90, larguraTela, { faseMapa });
  base.x = (larguraTela - base.largura) / 2;
  if (base.ehMovel) {
    base.ehMovel = false;
    base.xBase = undefined;
  }
  if (base.ehQuebra) {
    base.ehQuebra = false;
    base.estadoQuebra = undefined;
  }
  iniciais.push(base);

  let y = base.y;
  let anterior = base;
  while (y > -MARGEM_SPAWN_TOPO) {
    y -= sortearEntre(GAP_PLATAFORMA_MIN, GAP_PLATAFORMA_MAX);
    const proxima = gerarPlataforma(y, larguraTela, { anterior, faseMapa });
    iniciais.push(proxima);
    anterior = proxima;
  }
  return iniciais;
}

/**
 * Saiu da loja: troca a arte da loja por uma plataforma normal no mesmo chão,
 * para não abrir um buraco impossível na subida.
 */
export function substituirTiendaPorPlataformaNormal(
  loja: Plataforma,
  larguraTela: number,
): Plataforma {
  const superficieY = loja.y + loja.altura * FRACAO_PISO_PLATAFORMA_TIENDA;
  const tipo = Math.floor(Math.random() * PLATAFORMAS.length);
  const arte = PLATAFORMAS[tipo];
  const largura = arte.largura * ESCALA_PLATAFORMA;
  const altura = arte.altura * ESCALA_PLATAFORMA;
  const xMin = MARGEM_HORIZONTAL;
  const xMax = larguraTela - largura - MARGEM_HORIZONTAL;
  const x = Math.max(xMin, Math.min(xMax, loja.x + (loja.largura - largura) / 2));
  return {
    id: loja.id,
    x,
    y: superficieY,
    tipo,
    largura,
    altura,
  };
}

/**
 * Remove plataformas que saíram pela base e cria novas acima do topo.
 * Fake: a partir da altitude da faixa, uma garantida e depois aleatórias até o mago pisar.
 * No máximo uma fake na tela; nunca duas seguidas na cadeia.
 * Loja nasce ao lado, uma por faixa (50 m, depois 200 m, depois de 300 em 300).
 */
export function reciclarPlataformas(
  plataformas: Plataforma[],
  larguraTela: number,
  alturaTela: number,
  altitudeMetros: number,
  ultimaFaixaTienda: number | null,
  faseMapa: FaseMapa = 1,
  jaSpawnouFakeDestaFaixa = false,
  altitudeProximoBoss = 0,
): {
  novas: Plataforma[];
  ultimaFaixaTienda: number | null;
  jaSpawnouFakeDestaFaixa: boolean;
} {
  for (let i = plataformas.length - 1; i >= 0; i--) {
    if (plataformas[i].y > alturaTela + 40) plataformas.splice(i, 1);
    else if (plataformas[i].estadoQuebra === 'sumiu') plataformas.splice(i, 1);
  }

  let spawnouFaixa = jaSpawnouFakeDestaFaixa;
  const faixaAberta = altitudeMetros >= altitudeProximoBoss;
  let temFakeNaTela = plataformas.some((plataforma) => plataforma.ehFake);
  const aindaSemGarantida = faixaAberta && !spawnouFaixa;

  if (plataformas.length === 0) {
    const emergencia = gerarPlataforma(alturaTela * 0.55, larguraTela, {
      permitirFake: false,
      forcarFake: faixaAberta && !temFakeNaTela && aindaSemGarantida,
      faseMapa,
    });
    if (emergencia.ehFake) {
      temFakeNaTela = true;
      spawnouFaixa = true;
    }
    plataformas.push(emergencia);
    return {
      novas: [emergencia],
      ultimaFaixaTienda,
      jaSpawnouFakeDestaFaixa: spawnouFaixa,
    };
  }

  const novas: Plataforma[] = [];
  let faixaUsada = ultimaFaixaTienda;
  const cadeia = plataformas.filter((plataforma) => !plataforma.ehTienda);
  const baseCadeia = cadeia.length > 0 ? cadeia : plataformas;
  let maisAlta = baseCadeia.reduce((a, b) => (a.y < b.y ? a : b));
  let topo = maisAlta.y;
  while (topo > -MARGEM_SPAWN_TOPO) {
    topo -= sortearEntre(GAP_PLATAFORMA_MIN, GAP_PLATAFORMA_MAX);
    const forcarFake =
      faixaAberta && !temFakeNaTela && !spawnouFaixa;
    const permitirFake = faixaAberta && !temFakeNaTela && !forcarFake;
    const nova = gerarPlataforma(topo, larguraTela, {
      permitirFake,
      forcarFake,
      anterior: maisAlta.ehTienda ? undefined : maisAlta,
      faseMapa,
    });
    if (nova.ehFake) {
      temFakeNaTela = true;
      spawnouFaixa = true;
    }
    plataformas.push(nova);
    novas.push(nova);
    maisAlta = nova;

    const faixa = faixaTiendaAtual(altitudeMetros);
    if (faixa != null && faixa !== faixaUsada && !nova.ehFake) {
      const extra = criarTiendaAoLado(nova, larguraTela);
      if (extra) {
        plataformas.push(extra);
        faixaUsada = faixa;
      }
    }
  }
  return {
    novas,
    ultimaFaixaTienda: faixaUsada,
    jaSpawnouFakeDestaFaixa: spawnouFaixa,
  };
}

/** Oscilação lenta + pisca da quebra. Moeda móvel acompanha o x. */
export function atualizarPlataformasEspeciais(
  plataformas: Plataforma[],
  moedas: Moeda[],
  dt: number,
): void {
  for (const plataforma of plataformas) {
    if (plataforma.ehMovel && plataforma.xBase != null) {
      plataforma.faseOscilacao = (plataforma.faseOscilacao ?? 0) + dt;
      const angulo =
        ((plataforma.faseOscilacao % PERIODO_PLATAFORMA_MOVEL_S) /
          PERIODO_PLATAFORMA_MOVEL_S) *
        Math.PI *
        2;
      const novoX =
        plataforma.xBase + Math.sin(angulo) * DESLOCAMENTO_PLATAFORMA_MOVEL_PX;
      const dx = novoX - plataforma.x;
      plataforma.x = novoX;
      if (dx !== 0) {
        for (const moeda of moedas) {
          if (moeda.idPlataforma === plataforma.id) moeda.x += dx;
        }
      }
    }

    if (plataforma.ehQuebra && plataforma.estadoQuebra === 'piscando') {
      plataforma.tempoPisca = (plataforma.tempoPisca ?? 0) - dt;
      if ((plataforma.tempoPisca ?? 0) > 0) continue;
      plataforma.tempoPisca = DURACAO_MEIO_PISCA_QUEBRA_S;
      const iaVisivel = plataforma.visivelPisca !== false;
      plataforma.visivelPisca = !iaVisivel;
      if (iaVisivel) {
        plataforma.piscasFeitos = (plataforma.piscasFeitos ?? 0) + 1;
      } else if ((plataforma.piscasFeitos ?? 0) >= PISCAS_PLATAFORMA_QUEBRA) {
        plataforma.estadoQuebra = 'aviso';
        plataforma.visivelPisca = true;
        plataforma.tempoPisca = ATRASO_SUMICO_QUEBRA_S;
      }
    }

    if (plataforma.ehQuebra && plataforma.estadoQuebra === 'aviso') {
      plataforma.tempoPisca = (plataforma.tempoPisca ?? 0) - dt;
      if ((plataforma.tempoPisca ?? 0) > 0) continue;
      plataforma.estadoQuebra = 'sumiu';
      plataforma.visivelPisca = false;
      for (let i = moedas.length - 1; i >= 0; i--) {
        if (moedas[i].idPlataforma === plataforma.id) moedas.splice(i, 1);
      }
    }

    // Mini-zombie: caminha de um lado ao outro sobre a plataforma.
    if (plataforma.zombie) {
      const zW = MINI_BOT_ZOMBIE_TAMANHO.largura * ESCALA_MINIBOT_ZOMBIE_RUN;
      const xMin = plataforma.x;
      const xMax = plataforma.x + plataforma.largura - zW;

      plataforma.zombie.x += plataforma.zombie.dir * VELOCIDADE_MINIBOT_ZOMBIE_PX * dt;

      if (plataforma.zombie.x <= xMin) {
        plataforma.zombie.x = xMin;
        plataforma.zombie.dir = 1;
      } else if (plataforma.zombie.x >= xMax) {
        plataforma.zombie.x = xMax;
        plataforma.zombie.dir = -1;
      }

      // Animação: alterna entre frame 0 e 1.
      plataforma.zombie.frameTimer += dt;
      const frameInterval = 1 / FPS_MINIBOT_ZOMBIE;
      if (plataforma.zombie.frameTimer >= frameInterval) {
        plataforma.zombie.frameTimer -= frameInterval;
        plataforma.zombie.frameAtual = plataforma.zombie.frameAtual === 0 ? 1 : 0;
      }
    }
  }
}

/** Começa o pisca (1 vez) e depois espera antes de tirar o chão. */
export function iniciarQuebraPlataforma(plataforma: Plataforma): void {
  if (!plataforma.ehQuebra) return;
  if (plataforma.estadoQuebra !== 'inteira') return;
  plataforma.estadoQuebra = 'piscando';
  plataforma.visivelPisca = true;
  plataforma.piscasFeitos = 0;
  plataforma.tempoPisca = DURACAO_MEIO_PISCA_QUEBRA_S;
}

/** 50; depois 200, 500, 800… — uma loja extra por faixa. */
export function faixaTiendaAtual(altitudeMetros: number): number | null {
  if (altitudeMetros < ALTITUDE_PRIMEIRA_TIENDA) return null;
  if (altitudeMetros < ALTITUDE_MIN_PLATAFORMA_TIENDA) {
    return ALTITUDE_PRIMEIRA_TIENDA;
  }
  const degrau = Math.floor(
    (altitudeMetros - ALTITUDE_MIN_PLATAFORMA_TIENDA) / PASSO_TIENDA_METROS,
  );
  return ALTITUDE_MIN_PLATAFORMA_TIENDA + degrau * PASSO_TIENDA_METROS;
}

/** Loja extra no lado com mais espaço — o chão alinha com a plataforma da cadeia. */
function criarTiendaAoLado(
  vizinha: Plataforma,
  larguraTela: number,
): Plataforma | null {
  const largura = PLATAFORMA_TIENDA.largura * ESCALA_PLATAFORMA;
  const altura = PLATAFORMA_TIENDA.altura * ESCALA_PLATAFORMA;
  const folga = 18 + (vizinha.ehMovel ? DESLOCAMENTO_PLATAFORMA_MOVEL_PX : 0);
  const xMin = MARGEM_HORIZONTAL;
  const xMax = larguraTela - largura - MARGEM_HORIZONTAL;
  const espacoEsq = vizinha.x - xMin;
  const espacoDir = larguraTela - MARGEM_HORIZONTAL - (vizinha.x + vizinha.largura);

  let x: number | null = null;
  if (espacoDir >= largura + folga && espacoDir >= espacoEsq) {
    x = Math.min(xMax, vizinha.x + vizinha.largura + folga);
  } else if (espacoEsq >= largura + folga) {
    x = Math.max(xMin, vizinha.x - folga - largura);
  } else if (espacoDir >= largura + folga) {
    x = Math.min(xMax, vizinha.x + vizinha.largura + folga);
  }
  if (x == null) return null;

  const superficieY = vizinha.y;
  return {
    id: proximoId++,
    x,
    y: superficieY - altura * FRACAO_PISO_PLATAFORMA_TIENDA,
    tipo: -2,
    largura,
    altura,
    ehTienda: true,
  };
}
