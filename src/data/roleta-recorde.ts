/**
 * Prêmios da roleta de recorde (só dispara em morte com recorde novo).
 * Pesos relativos: moedas quase sempre; skins raríssimas.
 * Skins já no inventário saem da lista — o prêmio nunca é “lixo”.
 */

import type { IdSkin } from './skins';

export type IdPremioRoleta = 'bonus-moedas' | 'carta-7dias' | IdSkin;

export type TipoPremioRoleta = 'moedas' | 'carta' | 'skin';

export interface PremioRoleta {
  id: IdPremioRoleta;
  tipo: TipoPremioRoleta;
  /** Peso relativo (não é % fixa — renormaliza quando uma skin some). */
  peso: number;
}

/**
 * Runa e viking: raríssimas.
 * Tec e robô: um pouco mais fáceis, ainda difíceis.
 * Carta: um pouco mais fácil que as skins “comuns”.
 * Bônus de 50 moedas: de longe o mais frequente.
 */
export const PREMIOS_ROLETA: PremioRoleta[] = [
  { id: 'bonus-moedas', tipo: 'moedas', peso: 78 },
  { id: 'carta-7dias', tipo: 'carta', peso: 8 },
  { id: 'gorro-tec', tipo: 'skin', peso: 4.5 },
  { id: 'orb-robot', tipo: 'skin', peso: 4.5 },
  { id: 'gorro-viking', tipo: 'skin', peso: 2.5 },
  { id: 'orb-runa', tipo: 'skin', peso: 2.5 },
];
