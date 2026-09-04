/**
 * Catálogo das técnicas de todos os bosses com tela.
 * Aviso, URL do marco e validação de encanto passam por aqui.
 */

import {
  TECNICA_PADRAO_PHISHING,
  TECNICAS_PHISHING_MAN,
  type TecnicaPhishingMan,
} from './phishing-man';
import { TECNICA_PADRAO_ZOMBIE_NET, TECNICAS_ZOMBIE_NET } from './zombie-net';
import { TECNICA_PADRAO_CAPITAO_PIX, TECNICAS_CAPITAO_PIX } from './capitao-pix';

type TipoTelaBoss = 'phishing_man' | 'zombie_net' | 'capitao_pirata';

export function todasTecnicasBoss(): TecnicaPhishingMan[] {
  return [...TECNICAS_PHISHING_MAN, ...TECNICAS_ZOMBIE_NET, ...TECNICAS_CAPITAO_PIX];
}

export function buscarTecnicaPorUrl(url: string): TecnicaPhishingMan | undefined {
  const direta = todasTecnicasBoss().find((tecnica) => tecnica.url === url);
  if (direta) return direta;
  // Save de polimento: a tag BebeM virou botnet.
  if (url === 'http://zombie-net/bebem') return TECNICAS_ZOMBIE_NET[2];
  return undefined;
}

export function sortearUrlDoBoss(tipoTela: TipoTelaBoss): string {
  if (tipoTela === 'zombie_net') {
    return TECNICAS_ZOMBIE_NET[Math.floor(Math.random() * TECNICAS_ZOMBIE_NET.length)].url;
  }
  if (tipoTela === 'capitao_pirata') {
    return TECNICAS_CAPITAO_PIX[Math.floor(Math.random() * TECNICAS_CAPITAO_PIX.length)].url;
  }
  return TECNICAS_PHISHING_MAN[Math.floor(Math.random() * TECNICAS_PHISHING_MAN.length)].url;
}

export function validarFlagDaUrl(url: string, flagDigitada: string): boolean {
  const tecnica = buscarTecnicaPorUrl(url);
  if (!tecnica) return false;
  return tecnica.flag.trim().toLowerCase() === flagDigitada.trim().toLowerCase();
}

export function tecnicaPadraoDoBoss(tipoTela: TipoTelaBoss): TecnicaPhishingMan {
  if (tipoTela === 'zombie_net') return TECNICA_PADRAO_ZOMBIE_NET;
  if (tipoTela === 'capitao_pirata') return TECNICA_PADRAO_CAPITAO_PIX;
  return TECNICA_PADRAO_PHISHING;
}
