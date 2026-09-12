/**
 * Entidade da moeda de plataforma (colecionável da run).
 * A moeda-pirata é outro asset (infectada) — não usar aqui.
 */

import { MOEDA_PLATAFORMA_TAMANHO } from '../assets';
import { ESCALA_MOEDA } from '../constants';

export const LARGURA_MOEDA = MOEDA_PLATAFORMA_TAMANHO.largura * ESCALA_MOEDA;
export const ALTURA_MOEDA = MOEDA_PLATAFORMA_TAMANHO.altura * ESCALA_MOEDA;

export interface Moeda {
  id: number;
  x: number;
  y: number;
  /** Segue a plataforma móvel (mesmo id). */
  idPlataforma?: number;
  /** Fase 4: moeda infectada (pirata) — penaliza em vez de somar. */
  pirata?: boolean;
}
