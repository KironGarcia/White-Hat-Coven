/**
 * Entidade do orb azul companheiro.
 * Poses estáticas alinhadas ao mago: normal / subida / bajada.
 * Segue o mago com um leve atraso suave (interpolação).
 */

import { ORB_CAIXA } from '../assets';
import {
  ESCALA_SPRITE,
  ORB_FATOR_AFASTAMENTO,
  ORB_FATOR_PERSEGUICAO,
  ORB_OFFSET_X,
  ORB_OFFSET_Y,
} from '../constants';
import {
  ALTURA_JOGADOR,
  LARGURA_JOGADOR,
  type EstadoJogador,
  type PoseMago,
} from './jogador';

export const LARGURA_ORB = ORB_CAIXA.largura * ESCALA_SPRITE;
export const ALTURA_ORB = ORB_CAIXA.altura * ESCALA_SPRITE;

/** Poses do orb na run (estáticas, não sheet em loop). */
export type PoseOrb = 'normal' | 'subida' | 'bajada';

export interface EstadoOrb {
  x: number;
  y: number;
}

/** Caixa visual da orb — usada para não cruzar o mago na tela. */
export interface EvitarMagoOrb {
  larguraVisual: number;
  alturaVisual: number;
  offsetVisualX: number;
  offsetVisualY: number;
  folgaPx: number;
}

export function criarOrb(jogador: EstadoJogador): EstadoOrb {
  return {
    x: jogador.x + ORB_OFFSET_X,
    y: jogador.y + ORB_OFFSET_Y,
  };
}

/**
 * Persegue o mago com suavização proporcional ao tempo do frame.
 * extraOffsetX negativo = mais à esquerda (usado só na skin).
 * Se evitar está definido e as caixas se encostam, o alvo X vai para a
 * esquerda e o fator sobe — desliza rápido, sem pular de lugar.
 */
export function seguirJogador(
  orb: EstadoOrb,
  jogador: EstadoJogador,
  dt: number,
  extraOffsetX = 0,
  evitar?: EvitarMagoOrb,
): void {
  let alvoX = jogador.x + ORB_OFFSET_X + extraOffsetX;
  const alvoY = jogador.y + ORB_OFFSET_Y;
  const fatorY = Math.min(1, ORB_FATOR_PERSEGUICAO * dt);
  let fatorX = fatorY;

  if (evitar) {
    const visEsq = orb.x + evitar.offsetVisualX;
    const visDir = visEsq + evitar.larguraVisual;
    const visTopo = orb.y + evitar.offsetVisualY;
    const visBase = visTopo + evitar.alturaVisual;
    const magoEsq = jogador.x;
    const magoDir = jogador.x + LARGURA_JOGADOR;
    const magoTopo = jogador.y;
    const magoBase = jogador.y + ALTURA_JOGADOR;
    // Zona macia: começa a sair um pouco antes do cruzamento duro.
    const aviso = evitar.folgaPx;
    const encostaX = visEsq < magoDir && visDir > magoEsq - aviso;
    const encostaY = visTopo < magoBase && visBase > magoTopo;
    if (encostaX && encostaY) {
      alvoX = magoEsq - evitar.offsetVisualX - evitar.larguraVisual - evitar.folgaPx;
      // Teto 0.65: mesmo em frame lento não vira teleporte.
      fatorX = Math.min(0.65, ORB_FATOR_AFASTAMENTO * dt);
    }
  }

  orb.x += (alvoX - orb.x) * fatorX;
  orb.y += (alvoY - orb.y) * fatorY;
}

/** Extra de largura da skin cresce para a esquerda, não contra o mago. */
export function offsetVisualOrbSkin(larguraVisual: number, alturaVisual: number): {
  x: number;
  y: number;
} {
  return {
    x: LARGURA_ORB - larguraVisual,
    y: (ALTURA_ORB - alturaVisual) / 2,
  };
}

/**
 * No stun: orb parado acima da cabeça, só acompanha o X (e o Y da cabeça).
 */
export function seguirAcimaDaCabeca(
  orb: EstadoOrb,
  jogador: EstadoJogador,
  dt: number,
  larguraOrb: number,
  alturaOrb: number,
): void {
  const alvoX = jogador.x + LARGURA_JOGADOR / 2 - larguraOrb / 2;
  const alvoY = jogador.y - alturaOrb - 6;
  const fator = Math.min(1, ORB_FATOR_PERSEGUICAO * dt);
  orb.x += (alvoX - orb.x) * fator;
  orb.y += (alvoY - orb.y) * fator;
}

export function posicionarOrbAcimaDaCabeca(
  orb: EstadoOrb,
  jogador: EstadoJogador,
  larguraOrb: number,
  alturaOrb: number,
): void {
  orb.x = jogador.x + LARGURA_JOGADOR / 2 - larguraOrb / 2;
  orb.y = jogador.y - alturaOrb - 6;
}

/**
 * Deriva a pose do orb a partir do mago.
 * - agachado / parado → normal
 * - ar + subindo (vy < 0) → subida
 * - ar + caindo (vy >= 0) → bajada
 * (No eixo Y da tela, negativo = sobe.)
 */
export function poseOrbDoJogador(jogador: EstadoJogador): PoseOrb {
  if (jogador.pose === 'muerto') return 'normal';
  const poseChao: PoseMago[] = ['agachado', 'parado'];
  if (poseChao.includes(jogador.pose)) return 'normal';
  return jogador.vy < 0 ? 'subida' : 'bajada';
}
