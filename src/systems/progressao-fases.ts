/**
 * Régua de fases, bosses e spawn de invasão.
 *
 * Phishing Man, Zombie-net e Capitão Pix têm arena.
 */

import { sortearUrlDoBoss } from '../data/tecnicas-boss';
import {
  ALTITUDE_FAKE_FASE_1,
  ALTITUDES_BOSS_OFICIAL,
  FATOR_PULO_FASE_4,
  GRAVIDADE,
  IMPULSO_SALTO,
  PASSO_BOSS_DEPOIS_DA_GRADE,
} from '../constants';

export type FaseMapa = 1 | 2 | 3 | 4;

/** Famílias de boss da run. */
export type IdBoss = 'phishing_man' | 'zombie_net' | 'capitao_pirata';

export const BOSSES_RUN: Record<
  IdBoss,
  { nome: string; implementado: boolean }
> = {
  phishing_man: { nome: 'Phishing-Man', implementado: true },
  zombie_net: { nome: 'Zombie-net', implementado: true },
  capitao_pirata: { nome: 'Capitão Pix', implementado: true },
};

/** Quem pode aparecer em cada mapa. Fases 1–3: um boss fixo. Fase 4: os três. */
export const POOL_BOSS_POR_FASE: Record<FaseMapa, readonly IdBoss[]> = {
  1: ['phishing_man'],
  2: ['zombie_net'],
  3: ['capitao_pirata'],
  4: ['phishing_man', 'zombie_net', 'capitao_pirata'],
};

/** Um boss por mapa nas fases 1–3 (temporário, pra chegar na fase 4). Fase 4 não troca. */
export const BOSSES_PARA_AVANCAR_FASE: Record<FaseMapa, number> = {
  1: 1,
  2: 1,
  3: 1,
  4: Number.POSITIVE_INFINITY,
};

/** Lista da run: primeira fake em 150 m (grade oficial). */
export function listaAltitudesBoss(): number[] {
  return [...ALTITUDES_BOSS_OFICIAL];
}

/** Primeira fake da run — sempre a grade oficial (150 m). */
export function altitudePrimeiroBoss(): number {
  return ALTITUDE_FAKE_FASE_1;
}

/**
 * Próxima faixa depois de vencer um boss.
 * 150 → 350 → 500 → 650 → 800 → 950 → 1100 → +150 …
 */
export function proximaAltitudeBoss(altitudeBossVencido: number): number {
  const lista = listaAltitudesBoss();
  for (const altitude of lista) {
    if (altitude > altitudeBossVencido + 0.5) return altitude;
  }
  const ancora = ALTITUDES_BOSS_OFICIAL[ALTITUDES_BOSS_OFICIAL.length - 1];
  let proxima = ancora + PASSO_BOSS_DEPOIS_DA_GRADE;
  while (proxima <= altitudeBossVencido + 0.5) {
    proxima += PASSO_BOSS_DEPOIS_DA_GRADE;
  }
  return proxima;
}

export function gravidadeDaFase(fase: FaseMapa): number {
  return fase >= 4 ? GRAVIDADE * FATOR_PULO_FASE_4 : GRAVIDADE;
}

export function impulsoDaFase(fase: FaseMapa): number {
  return fase >= 4 ? IMPULSO_SALTO * FATOR_PULO_FASE_4 : IMPULSO_SALTO;
}

function sortearItem<T>(lista: readonly T[]): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

/**
 * Quem aparece:
 * - Fase 1: só Phishing Man (a técnica — e-mail / WhatsApp / vishing — sorteia na URL).
 * - Fase 2: só Zombie-net (sorteia a técnica dele).
 * - Fase 3: só Capitão Pix (sorteia a técnica dele).
 * - Fase 4: aleatório entre os três, sem repetir o último.
 */
export function escolherTipoLogicoBoss(
  fase: FaseMapa,
  tiposVencidosNaFase: readonly IdBoss[],
): IdBoss {
  const pool = POOL_BOSS_POR_FASE[fase];
  if (fase === 4) {
    const ultimo = tiposVencidosNaFase[tiposVencidosNaFase.length - 1];
    const semUltimo = pool.filter((id) => id !== ultimo);
    return sortearItem(semUltimo.length > 0 ? semUltimo : pool);
  }
  return pool[0];
}

/** Técnica aleatória do boss que vai para a tela. */
export function sortearUrlPhishing(): string {
  return sortearUrlDoBoss('phishing_man');
}

export interface AparicaoBoss {
  /** Quem a régua acha que deveria ser. */
  tipoLogico: IdBoss;
  /** Quem a arena realmente mostra. */
  tipoTela: IdBoss;
  url: string;
}

/**
 * Monta a aparição. Os três bosses da run já têm tela própria.
 */
export function montarAparicaoBoss(
  fase: FaseMapa,
  tiposVencidosNaFase: readonly IdBoss[],
): AparicaoBoss {
  const tipoLogico = escolherTipoLogicoBoss(fase, tiposVencidosNaFase);
  const implementado = BOSSES_RUN[tipoLogico].implementado;
  const tipoTela: IdBoss = implementado ? tipoLogico : 'phishing_man';
  const url = sortearUrlDoBoss(tipoTela);
  return { tipoLogico, tipoTela, url };
}

export function avancarFaseAposVitoria(
  faseAtual: FaseMapa,
  bossesVencidosNaFase: number,
): { fase: FaseMapa; bossesVencidosNaFase: number; trocouMapa: boolean } {
  const novoTotal = bossesVencidosNaFase + 1;
  const precisa = BOSSES_PARA_AVANCAR_FASE[faseAtual];
  if (faseAtual < 4 && novoTotal >= precisa) {
    return {
      fase: (faseAtual + 1) as FaseMapa,
      bossesVencidosNaFase: 0,
      trocouMapa: true,
    };
  }
  return {
    fase: faseAtual,
    bossesVencidosNaFase: novoTotal,
    trocouMapa: false,
  };
}
