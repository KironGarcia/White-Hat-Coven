/**
 * Catálogo da loja (Demo 1).
 * Skins, poção e carta de 7 dias: moedas do jogo.
 * Pacotes de moedas: Em breve (IAP ainda não existe).
 */

import type { SpriteSheet } from '../assets';
import {
  ITEM_BAU_MOEDAS,
  ITEM_BOLSA_MOEDAS,
  ITEM_CARTA_7DIAS,
  ITEM_PACOTE_MINI_MOEDAS,
  ITEM_POCION_VIDA,
} from '../assets';
import type { IdSkin } from './skins';

export type TipoItemLoja = 'iap' | 'moeda_jogo' | 'skin';

/** Tabela de preços em moedas. null = Em breve (não se compra ainda). */
export const PRECOS_MOEDAS_LOJA: Record<string, number | null> = {
  'pocion-vida': 100,
  'carta-7dias': 350,
  'gorro-tec': 700,
  'gorro-viking': 1200,
  'orb-robot': 800,
  'orb-runa': 1300,
  'bau-moedas': null,
  'bolsa-moedas': null,
  'pacote-mini-moedas': null,
};

export function precoEmMoedas(id: string): number | null {
  return PRECOS_MOEDAS_LOJA[id] ?? null;
}

export interface ItemLoja {
  id: string;
  nome: string;
  descricao: string;
  /** Sheet de 2 frames (bob) dos itens clássicos. Skins usam o catálogo próprio. */
  arte?: SpriteSheet;
  tipo: TipoItemLoja;
  /** Presente só nos itens de skin (liga ao catálogo data/skins). */
  skin?: IdSkin;
}

export const ITENS_LOJA: ItemLoja[] = [
  // Skins primeiro na vitrine — preço em moedas do jogo.
  {
    id: 'gorro-tec',
    nome: 'Gorro Tec',
    descricao: 'Chapéu do tecnomago',
    tipo: 'skin',
    skin: 'gorro-tec',
  },
  {
    id: 'gorro-viking',
    nome: 'Gorro Viking',
    descricao: 'Elmo com chifres',
    tipo: 'skin',
    skin: 'gorro-viking',
  },
  {
    id: 'orb-robot',
    nome: 'Orb Robô',
    descricao: 'Companheiro robótico',
    tipo: 'skin',
    skin: 'orb-robot',
  },
  {
    id: 'orb-runa',
    nome: 'Orb Runa',
    descricao: 'Runa giratória',
    tipo: 'skin',
    skin: 'orb-runa',
  },
  {
    id: 'pocion-vida',
    nome: 'Poção de vida',
    descricao: 'Recupera 1 coração',
    arte: ITEM_POCION_VIDA,
    tipo: 'moeda_jogo',
  },
  {
    id: 'carta-7dias',
    nome: 'Carta 7 dias',
    descricao: '1 coração extra por 7 dias',
    arte: ITEM_CARTA_7DIAS,
    tipo: 'moeda_jogo',
  },
  {
    id: 'bau-moedas',
    nome: 'Baú de moedas',
    descricao: '500 moedas extras',
    arte: ITEM_BAU_MOEDAS,
    tipo: 'iap',
  },
  {
    id: 'bolsa-moedas',
    nome: 'Bolsa de moedas',
    descricao: '300 moedas extras',
    arte: ITEM_BOLSA_MOEDAS,
    tipo: 'iap',
  },
  {
    id: 'pacote-mini-moedas',
    nome: 'Pacote mini',
    descricao: '100 moedas extras',
    arte: ITEM_PACOTE_MINI_MOEDAS,
    tipo: 'iap',
  },
];
