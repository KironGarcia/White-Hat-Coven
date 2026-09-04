/**
 * Converte regiões da arte do marco (470×709) para pixels de tela
 * quando o marco estica nos 4 cantos do palco medido (onLayout).
 */

import {
  MARCO_ART_ALTURA,
  MARCO_ART_LARGURA,
  MARCO_REGIOES_ART,
} from '../constants';

export interface RetanguloTela {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutBossTela {
  url: RetanguloTela;
  bossBox: RetanguloTela;
  divisor: RetanguloTela;
  arena: RetanguloTela;
  /** Face inferior da barra do marco: teto do mago e limite de spawn. */
  tetoY: number;
  /** Topo do piso (y) quando o patch está ativo. */
  pisoY: number;
  escalaX: number;
  escalaY: number;
}

export function calcularLayoutBoss(
  larguraTela: number,
  alturaTela: number,
): LayoutBossTela {
  const escalaX = larguraTela / MARCO_ART_LARGURA;
  const escalaY = alturaTela / MARCO_ART_ALTURA;
  const art = MARCO_REGIOES_ART;

  return {
    escalaX,
    escalaY,
    url: {
      x: art.url.x * escalaX,
      y: art.url.y * escalaY,
      w: art.url.w * escalaX,
      h: art.url.h * escalaY,
    },
    bossBox: {
      x: art.bossBox.x * escalaX,
      y: art.bossBox.y * escalaY,
      w: art.bossBox.w * escalaX,
      h: art.bossBox.h * escalaY,
    },
    divisor: {
      x: art.arena.x * escalaX,
      y: art.divisor.y * escalaY,
      w: art.arena.w * escalaX,
      h: art.divisor.h * escalaY,
    },
    arena: {
      x: art.arena.x * escalaX,
      y: art.arena.y * escalaY,
      w: art.arena.w * escalaX,
      h: art.arena.h * escalaY,
    },
    tetoY: (art.divisor.y + art.divisor.h) * escalaY,
    pisoY: art.pisoTopoArt * escalaY,
  };
}
