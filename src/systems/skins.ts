/**
 * Inventário de skins: compradas + equipadas, com cache em memória.
 * O cache permite leitura síncrona dentro do game loop (render por frame);
 * o AsyncStorage guarda o estado entre sessões (isolado da Demo 1).
 * Carregar uma vez no boot do App (carregarEstadoSkins).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CHAVE_SKIN_GORRO_EQUIPADA,
  CHAVE_SKIN_ORB_EQUIPADA,
  CHAVE_SKINS_COMPRADAS,
} from '../constants';
import {
  ehIdSkin,
  ehIdSkinGorro,
  ehIdSkinOrb,
  SKINS_GORRO,
  SKINS_ORB,
  type IdSkin,
  type IdSkinGorro,
  type IdSkinOrb,
  type SkinGorro,
  type SkinOrb,
} from '../data/skins';

let compradas: IdSkin[] = [];
let gorroAtual: IdSkinGorro | null = null;
let orbAtual: IdSkinOrb | null = null;

/** Boot: preenche o cache antes da primeira tela (falha = tudo original). */
export async function carregarEstadoSkins(): Promise<void> {
  try {
    const [brutoCompradas, brutoGorro, brutoOrb] = await Promise.all([
      AsyncStorage.getItem(CHAVE_SKINS_COMPRADAS),
      AsyncStorage.getItem(CHAVE_SKIN_GORRO_EQUIPADA),
      AsyncStorage.getItem(CHAVE_SKIN_ORB_EQUIPADA),
    ]);
    const lista = brutoCompradas ? JSON.parse(brutoCompradas) : [];
    compradas = Array.isArray(lista)
      ? lista.filter((id): id is IdSkin => typeof id === 'string' && ehIdSkin(id))
      : [];
    gorroAtual =
      brutoGorro && ehIdSkinGorro(brutoGorro) && compradas.includes(brutoGorro)
        ? brutoGorro
        : null;
    orbAtual =
      brutoOrb && ehIdSkinOrb(brutoOrb) && compradas.includes(brutoOrb)
        ? brutoOrb
        : null;
  } catch {
    compradas = [];
    gorroAtual = null;
    orbAtual = null;
  }
}

function persistir(): void {
  // Melhor esforço: o cache já vale para a sessão mesmo se o storage falhar.
  AsyncStorage.setItem(CHAVE_SKINS_COMPRADAS, JSON.stringify(compradas)).catch(
    () => {},
  );
  AsyncStorage.setItem(CHAVE_SKIN_GORRO_EQUIPADA, gorroAtual ?? '').catch(() => {});
  AsyncStorage.setItem(CHAVE_SKIN_ORB_EQUIPADA, orbAtual ?? '').catch(() => {});
}

export function skinComprada(id: IdSkin): boolean {
  return compradas.includes(id);
}

export function skinEquipada(id: IdSkin): boolean {
  return gorroAtual === id || orbAtual === id;
}

/** Gorro equipado resolvido no catálogo (null = mago original). */
export function gorroEquipado(): SkinGorro | null {
  return gorroAtual ? SKINS_GORRO[gorroAtual] : null;
}

/** Skin da orb resolvida no catálogo (null = orb azul original). */
export function orbEquipada(): SkinOrb | null {
  return orbAtual ? SKINS_ORB[orbAtual] : null;
}

/** Compra e já veste (fluxo da loja: comprar = vestir na hora). */
export function comprarSkin(id: IdSkin): void {
  if (!compradas.includes(id)) compradas = [...compradas, id];
  equiparSkin(id);
}

/** Roleta / prêmio: entra no inventário, sem vestir sozinho. */
export function adicionarSkinAoInventario(id: IdSkin): void {
  if (compradas.includes(id)) return;
  compradas = [...compradas, id];
  persistir();
}

/** Equipar troca a skin anterior do mesmo tipo automaticamente. */
export function equiparSkin(id: IdSkin): void {
  if (!compradas.includes(id)) return;
  if (ehIdSkinGorro(id)) gorroAtual = id;
  else orbAtual = id;
  persistir();
}

/** Desequipar volta ao visual original (mago / orb azul). */
export function desequiparSkin(id: IdSkin): void {
  if (gorroAtual === id) gorroAtual = null;
  if (orbAtual === id) orbAtual = null;
  persistir();
}
