/**
 * Entidade do mago (jogador): dados, dimensões em tela e hitbox.
 * Coordenadas em pixels de tela; origem no canto superior esquerdo.
 * Pose visual: máquina de estados agachado → parado → ar.
 */

import { MAGO_CAIXA } from '../assets';
import { ESCALA_MAGO } from '../constants';

export const LARGURA_JOGADOR = MAGO_CAIXA.largura * ESCALA_MAGO;
export const ALTURA_JOGADOR = MAGO_CAIXA.altura * ESCALA_MAGO;

/** O sprite do mago tem margens; a hitbox é mais estreita. */
const MARGEM_HITBOX_X = LARGURA_JOGADOR * 0.25;

/** Largura real da caixa de colisão (para vãos da rajada). */
export function larguraHitboxJogador(): number {
  return LARGURA_JOGADOR - MARGEM_HITBOX_X * 2;
}

/** Poses estáticas da run (não é mais o sheet de 9 frames). */
export type PoseMago = 'agachado' | 'parado' | 'ar' | 'muerto';

export interface EstadoJogador {
  /** Canto superior esquerdo da caixa lógica (pés embaixo). */
  x: number;
  y: number;
  vx: number;
  vy: number;
  direcao: 'esquerda' | 'direita';
  /** Pose desenhada neste instante. */
  pose: PoseMago;
  /** Tempo restante na pose atual antes de avançar na sequência. */
  tempoPose: number;
}

/** Mago nasce em pé sobre a plataforma-base, no centro da tela. */
export function criarJogador(larguraTela: number, alturaTela: number): EstadoJogador {
  return {
    x: (larguraTela - LARGURA_JOGADOR) / 2,
    y: alturaTela - 90 - ALTURA_JOGADOR,
    vx: 0,
    vy: 0,
    direcao: 'direita',
    pose: 'parado',
    tempoPose: 0,
  };
}

export interface Hitbox {
  esquerda: number;
  direita: number;
  topo: number;
  base: number;
}

export function hitboxDoJogador(jogador: EstadoJogador): Hitbox {
  return {
    esquerda: jogador.x + MARGEM_HITBOX_X,
    direita: jogador.x + LARGURA_JOGADOR - MARGEM_HITBOX_X,
    topo: jogador.y,
    base: jogador.y + ALTURA_JOGADOR,
  };
}
