/**
 * Catálogo de skins cosméticas (gorros do mago + orbs companheiras).
 * Só aparência: nenhuma skin muda física, hitbox ou dano.
 * A hitbox do mago continua MAGO_CAIXA; a da orb continua ORB_CAIXA.
 */

import {
  GORRO_TEC_AGACHADO,
  GORRO_TEC_AR,
  GORRO_TEC_INTRO_FRAMES,
  GORRO_TEC_INTRO_TAMANHO,
  GORRO_TEC_MORTO,
  GORRO_TEC_PARADO,
  GORRO_VIKING_AGACHADO,
  GORRO_VIKING_AR,
  GORRO_VIKING_INTRO_FRAMES,
  GORRO_VIKING_INTRO_TAMANHO,
  GORRO_VIKING_MORTO,
  GORRO_VIKING_PARADO,
  ICONE_GORRO_TEC,
  ICONE_GORRO_VIKING,
  ORB_ROBOT_NORMAL_FRAMES,
  ORB_ROBOT_NORMAL_TAMANHO,
  ORB_ROBOT_SUPER_FRAMES,
  ORB_ROBOT_SUPER_TAMANHO,
  ORB_RUNA_NORMAL_FRAMES,
  ORB_RUNA_NORMAL_TAMANHO,
  ORB_RUNA_SUPER_FRAMES,
  ORB_RUNA_SUPER_TAMANHO,
  type ImagemEstatica,
  type PoseSkinGorro,
} from '../assets';
import { FPS_ORB_ROBOT, FPS_ORB_RUNA } from '../constants';
import type { PoseMago } from '../entities/jogador';

export type IdSkinGorro = 'gorro-tec' | 'gorro-viking';
export type IdSkinOrb = 'orb-robot' | 'orb-runa';
export type IdSkin = IdSkinGorro | IdSkinOrb;

export interface SkinGorro {
  id: IdSkinGorro;
  /** Uma arte por pose da run (mago completo com o gorro). */
  poses: Record<PoseMago, PoseSkinGorro>;
  /** Ciclo de intro (parado → agachado → parado) — tela de intro e arena do boss. */
  framesIntro: number[];
  tamanhoIntro: { largura: number; altura: number };
  /** Só o gorro, para a vitrine da loja (estático). */
  icone: ImagemEstatica;
}

export interface SkinOrb {
  id: IdSkinOrb;
  /** Animação única — a skin não tem poses subida/bajada/estático. */
  framesNormal: number[];
  tamanhoNormal: { largura: number; altura: number };
  /** Modo super (encanto secreto validado). */
  framesSuper: number[];
  tamanhoSuper: { largura: number; altura: number };
  fps: number;
}

export const SKINS_GORRO: Record<IdSkinGorro, SkinGorro> = {
  'gorro-tec': {
    id: 'gorro-tec',
    poses: {
      parado: GORRO_TEC_PARADO,
      agachado: GORRO_TEC_AGACHADO,
      ar: GORRO_TEC_AR,
      muerto: GORRO_TEC_MORTO,
    },
    framesIntro: GORRO_TEC_INTRO_FRAMES,
    tamanhoIntro: GORRO_TEC_INTRO_TAMANHO,
    icone: ICONE_GORRO_TEC,
  },
  'gorro-viking': {
    id: 'gorro-viking',
    poses: {
      parado: GORRO_VIKING_PARADO,
      agachado: GORRO_VIKING_AGACHADO,
      ar: GORRO_VIKING_AR,
      muerto: GORRO_VIKING_MORTO,
    },
    framesIntro: GORRO_VIKING_INTRO_FRAMES,
    tamanhoIntro: GORRO_VIKING_INTRO_TAMANHO,
    icone: ICONE_GORRO_VIKING,
  },
};

export const SKINS_ORB: Record<IdSkinOrb, SkinOrb> = {
  'orb-robot': {
    id: 'orb-robot',
    framesNormal: ORB_ROBOT_NORMAL_FRAMES,
    tamanhoNormal: ORB_ROBOT_NORMAL_TAMANHO,
    framesSuper: ORB_ROBOT_SUPER_FRAMES,
    tamanhoSuper: ORB_ROBOT_SUPER_TAMANHO,
    fps: FPS_ORB_ROBOT,
  },
  'orb-runa': {
    id: 'orb-runa',
    framesNormal: ORB_RUNA_NORMAL_FRAMES,
    tamanhoNormal: ORB_RUNA_NORMAL_TAMANHO,
    framesSuper: ORB_RUNA_SUPER_FRAMES,
    tamanhoSuper: ORB_RUNA_SUPER_TAMANHO,
    fps: FPS_ORB_RUNA,
  },
};

export function ehIdSkinGorro(id: string): id is IdSkinGorro {
  return id in SKINS_GORRO;
}

export function ehIdSkinOrb(id: string): id is IdSkinOrb {
  return id in SKINS_ORB;
}

export function ehIdSkin(id: string): id is IdSkin {
  return ehIdSkinGorro(id) || ehIdSkinOrb(id);
}
