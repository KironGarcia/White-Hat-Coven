/**
 * Moedas da run: spawn aleatório em ALGUMAS plataformas novas
 * (CHANCE_MOEDA) e coleta por sobreposição com o mago.
 * Sem economia persistente — o contador vale só para a run atual.
 */

import {
  ALTURA_MOEDA_SOBRE_PLATAFORMA,
  CHANCE_MOEDA,
  CHANCE_MOEDA_PIRATA_FASE4,
  PENALIDADE_MOEDA_PIRATA_RUN,
} from '../constants';
import { hitboxDoJogador } from '../entities/jogador';
import type { Moeda } from '../entities/moeda';
import { ALTURA_MOEDA, LARGURA_MOEDA } from '../entities/moeda';
import type { EstadoMundo } from '../entities/mundo';
import type { Plataforma } from '../entities/plataforma';
import type { FaseMapa } from './progressao-fases';

let proximoId = 1;

/**
 * Decide (na criação de cada plataforma) se ela nasce com moeda.
 * A moeda fica acima do centro da plataforma.
 * Fase 4: 30% das moedas são piratas (penalizam ao coletar).
 */
export function talvezCriarMoeda(plataforma: Plataforma, faseMapa: FaseMapa = 1): Moeda | null {
  if (Math.random() >= CHANCE_MOEDA) return null;
  const pirata = faseMapa >= 4 && Math.random() < CHANCE_MOEDA_PIRATA_FASE4;
  return {
    id: proximoId++,
    x: plataforma.x + plataforma.largura / 2 - LARGURA_MOEDA / 2,
    y: plataforma.y - ALTURA_MOEDA - ALTURA_MOEDA_SOBRE_PLATAFORMA,
    idPlataforma: plataforma.id,
    pirata: pirata || undefined,
  };
}

/**
 * Remove moedas coletadas (overlap com o mago) e as que saíram da tela.
 * Retorna se uma moeda pirata foi capturada (para o GameScreen tocar o som certo).
 */
export function atualizarMoedas(
  mundo: EstadoMundo,
  alturaTela: number,
): { coletouPirata: boolean } {
  const caixa = hitboxDoJogador(mundo.jogador);
  let coletouPirata = false;

  for (let i = mundo.moedas.length - 1; i >= 0; i--) {
    const moeda = mundo.moedas[i];

    if (moeda.y > alturaTela + 40) {
      mundo.moedas.splice(i, 1);
      continue;
    }

    const sobrepoe =
      caixa.direita > moeda.x &&
      caixa.esquerda < moeda.x + LARGURA_MOEDA &&
      caixa.base > moeda.y &&
      caixa.topo < moeda.y + ALTURA_MOEDA;

    if (sobrepoe) {
      mundo.moedas.splice(i, 1);
      if (moeda.pirata) {
        // Moeda pirata: penaliza (mínimo 0 para não ir negativo).
        mundo.moedasColetadas = Math.max(0, mundo.moedasColetadas - PENALIDADE_MOEDA_PIRATA_RUN);
        coletouPirata = true;
      } else {
        mundo.moedasColetadas += 1;
      }
    }
  }

  return { coletouPirata };
}
