/**
 * Roleta de recorde: monta a lista (sem skins já possuídas) e sorteia.
 */

import {
  PREMIOS_ROLETA,
  type PremioRoleta,
} from '../data/roleta-recorde';
import { ehIdSkin } from '../data/skins';
import { skinComprada } from './skins';

/** Premios que ainda fazem sentido dar (skins que você já tem saem). */
export function premiosRoletaDisponiveis(): PremioRoleta[] {
  return PREMIOS_ROLETA.filter((premio) => {
    if (premio.tipo !== 'skin') return true;
    return ehIdSkin(premio.id) && !skinComprada(premio.id);
  });
}

/** Sorteio ponderado. Sempre cai em alguém (moedas nunca saem da lista). */
export function sortearPremioRoleta(pool: PremioRoleta[]): PremioRoleta {
  if (pool.length === 0) {
    return PREMIOS_ROLETA[0];
  }
  const total = pool.reduce((soma, premio) => soma + premio.peso, 0);
  let resto = Math.random() * total;
  for (const premio of pool) {
    resto -= premio.peso;
    if (resto <= 0) return premio;
  }
  return pool[pool.length - 1];
}
