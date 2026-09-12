/**
 * Persistência do recorde de altitude e da carteira total de moedas
 * (isolada da Demo 1 — nada compartilhado com o app ARGOS).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CHAVE_CARTA_7DIAS_ATE,
  CHAVE_MOEDAS_TOTAL,
  CHAVE_POCOES_VIDA,
  CHAVE_RECORDE_ALTITUDE,
  DURACAO_CARTA_7DIAS_MS,
  VIDAS_COM_CARTA,
  VIDAS_MAX,
} from '../constants';

export async function carregarRecorde(): Promise<number> {
  try {
    const valor = await AsyncStorage.getItem(CHAVE_RECORDE_ALTITUDE);
    return valor ? Number(valor) : 0;
  } catch {
    return 0;
  }
}

/**
 * Salva a altitude se for recorde novo.
 * Devolve { recorde, novoRecorde } para a tela de fim de run.
 */
export async function registrarAltitude(
  altitudeMetros: number,
): Promise<{ recorde: number; novoRecorde: boolean }> {
  const recordeAtual = await carregarRecorde();
  if (altitudeMetros > recordeAtual) {
    try {
      await AsyncStorage.setItem(CHAVE_RECORDE_ALTITUDE, String(altitudeMetros));
    } catch {
      // Sem armazenamento disponível: segue o jogo com o recorde em memória.
    }
    return { recorde: altitudeMetros, novoRecorde: true };
  }
  return { recorde: recordeAtual, novoRecorde: false };
}

/** Dev: zera o recorde para testar a roleta (não mexe em moedas nem skins). */
export async function zerarRecorde(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CHAVE_RECORDE_ALTITUDE);
  } catch {
    // Sem storage: a próxima leitura já trata como 0.
  }
}

/** Saldo total acumulado no jogo inteiro (não a sessão da run). */
export async function carregarMoedasTotais(): Promise<number> {
  try {
    const valor = await AsyncStorage.getItem(CHAVE_MOEDAS_TOTAL);
    const n = valor ? Number(valor) : 0;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

/**
 * Soma moedas da run (na morte) ou IAP à carteira total.
 * A loja mostra carteira + sessão; a persistência só acontece no fim da run.
 */
export async function adicionarMoedasTotais(quantidade: number): Promise<number> {
  const ganho = Math.max(0, Math.floor(quantidade));
  const atual = await carregarMoedasTotais();
  const novo = atual + ganho;
  try {
    await AsyncStorage.setItem(CHAVE_MOEDAS_TOTAL, String(novo));
  } catch {
    // Mantém o valor calculado mesmo se o storage falhar.
  }
  return novo;
}

/**
 * Compra com moedas: usa carteira + sessão da run.
 * Se der certo, grava o novo saldo (a sessão entra na carteira e o preço sai).
 */
export async function gastarMoedas(
  preco: number,
  moedasSessao: number,
): Promise<{ ok: boolean; novoSaldo: number }> {
  const precoInt = Math.max(0, Math.floor(preco));
  const sessao = Math.max(0, Math.floor(moedasSessao));
  const carteira = await carregarMoedasTotais();
  const disponivel = carteira + sessao;
  if (disponivel < precoInt) {
    return { ok: false, novoSaldo: disponivel };
  }
  const novo = disponivel - precoInt;
  try {
    await AsyncStorage.setItem(CHAVE_MOEDAS_TOTAL, String(novo));
  } catch {
    // Mantém o valor calculado mesmo se o storage falhar.
  }
  return { ok: true, novoSaldo: novo };
}

export async function carregarPocoesVida(): Promise<number> {
  try {
    const valor = await AsyncStorage.getItem(CHAVE_POCOES_VIDA);
    const n = valor ? Number(valor) : 0;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

/** Inventário de poções (carta de 7 dias / uso fora da run — depois). */
export async function adicionarPocaoVida(quantidade = 1): Promise<number> {
  const ganho = Math.max(0, Math.floor(quantidade));
  const atual = await carregarPocoesVida();
  const novo = atual + ganho;
  try {
    await AsyncStorage.setItem(CHAVE_POCOES_VIDA, String(novo));
  } catch {
    // Segue com o valor em memória.
  }
  return novo;
}

let carta7DiasAte = 0;

/** Boot: lê o fim da carta de 7 dias (3 corações). */
export async function carregarCarta7Dias(): Promise<void> {
  try {
    const valor = await AsyncStorage.getItem(CHAVE_CARTA_7DIAS_ATE);
    const n = valor ? Number(valor) : 0;
    carta7DiasAte = Number.isFinite(n) && n > Date.now() ? n : 0;
  } catch {
    carta7DiasAte = 0;
  }
}

export function carta7DiasAtiva(): boolean {
  return carta7DiasAte > Date.now();
}

/** Máximo de corações na run atual (2, ou 3 com a carta vigente). */
export function vidasMaximas(): number {
  return carta7DiasAtiva() ? VIDAS_COM_CARTA : VIDAS_MAX;
}

/** Corações ao começar a run. */
export function vidasInicio(): number {
  return vidasMaximas();
}

/** Ativa (ou renova) 7 dias de 3 corações a partir de agora. */
export async function concederCarta7Dias(): Promise<void> {
  carta7DiasAte = Date.now() + DURACAO_CARTA_7DIAS_MS;
  try {
    await AsyncStorage.setItem(CHAVE_CARTA_7DIAS_ATE, String(carta7DiasAte));
  } catch {
    // Cache já vale para a sessão.
  }
}
