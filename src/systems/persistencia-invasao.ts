/**
 * Persistência da invasão: flags já aprendidas + progresso da run
 * quando o jogador sai para o Oráculo (não pode perder a jornada).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CHAVE_CARTA_7DIAS_ATE,
  CHAVE_FLAGS_CONHECIDAS,
  CHAVE_INVASAO_PENDENTE,
  CHAVE_MOEDAS_TOTAL,
  CHAVE_POCOES_VIDA,
  CHAVE_RECORDE_ALTITUDE,
  CHAVE_RESET_GRAVACAO,
  CHAVE_RESET_CARTA_FANTASMA,
  CHAVE_SKIN_GORRO_EQUIPADA,
  CHAVE_SKIN_ORB_EQUIPADA,
  CHAVE_SKINS_COMPRADAS,
  CHAVE_TUTORIAL_ARMADILHA_RUN,
  CHAVE_TUTORIAL_HIT_BOX,
  CHAVE_TUTORIAL_LOJA_RUN,
  CHAVE_TUTORIAL_PATCH,
  CHAVE_TUTORIAL_ROUBO_CAPITAO,
  CHAVE_TUTORIAL_TAP_BOSS,
} from '../constants';

export interface ProgressoRunSalvo {
  altitudePx: number;
  moedasColetadas: number;
  /** Corações restantes na run (e na arena). Saves antigos sem este campo = 2. */
  vidas?: number;
  /** Mapa visual 1–4. Saves antigos = 1. */
  faseMapa?: 1 | 2 | 3 | 4;
  /** Vitórias nesta fase (zera ao trocar o fundo). */
  bossesVencidosNaFase?: number;
  /** Vitórias da run inteira (tutorial = 0). */
  bossesVencidosTotal?: number;
  /** Tipos lógicos já vencidos nesta fase (complementar phishing/zombie/capitão). */
  tiposVencidosNaFase?: Array<'phishing_man' | 'zombie_net' | 'capitao_pirata'>;
  /** Altitude (m) em que a próxima fake garantida pode nascer. */
  altitudeProximoBoss?: number;
  /** A fake garantida desta faixa já nasceu (aleatórias seguem até pisar). */
  jaSpawnouFakeDestaFaixa?: boolean;
}

export type FaseAvisoInvasao = 'primeiro_contato' | 'retorno_oraculo';

export interface InvasaoPendente {
  versao: 1;
  bossUrl: string;
  fase: FaseAvisoInvasao;
  /** Se true, o encanto desta URL já foi validado nesta invasão. */
  encantoAtivo: boolean;
  progresso: ProgressoRunSalvo;
  /** Quem a régua sorteou (pode ser zombie/capitão mesmo com tela de phishing). */
  idBossLogico?: 'phishing_man' | 'zombie_net' | 'capitao_pirata';
  /** Quem a arena realmente mostra. */
  idBossTela?: 'phishing_man' | 'zombie_net' | 'capitao_pirata';
}

export async function carregarFlagsConhecidas(): Promise<string[]> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_FLAGS_CONHECIDAS);
    if (!bruto) return [];
    const lista = JSON.parse(bruto) as unknown;
    if (!Array.isArray(lista)) return [];
    return lista.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

export async function jaConheceUrl(url: string): Promise<boolean> {
  const flags = await carregarFlagsConhecidas();
  return flags.includes(url);
}

/** Registra a URL como aprendida (encanto permanente — não precisa redigitar). */
export async function registrarFlagConhecida(url: string): Promise<void> {
  const flags = await carregarFlagsConhecidas();
  if (flags.includes(url)) return;
  flags.push(url);
  await AsyncStorage.setItem(CHAVE_FLAGS_CONHECIDAS, JSON.stringify(flags));
}

export async function salvarInvasaoPendente(invasao: InvasaoPendente): Promise<void> {
  await AsyncStorage.setItem(CHAVE_INVASAO_PENDENTE, JSON.stringify(invasao));
}

export async function carregarInvasaoPendente(): Promise<InvasaoPendente | null> {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_INVASAO_PENDENTE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as InvasaoPendente;
    if (!dados || dados.versao !== 1 || typeof dados.bossUrl !== 'string') return null;
    return dados;
  } catch {
    return null;
  }
}

export async function limparInvasaoPendente(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE_INVASAO_PENDENTE);
}

/** Dev: zera encantos e invasão pendente (run fresca, sem poder). */
export async function resetarEncantosParaPolimento(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE_FLAGS_CONHECIDAS);
  await AsyncStorage.removeItem(CHAVE_INVASAO_PENDENTE);
}

export async function jaViuTutorialTapBoss(): Promise<boolean> {
  try {
    const valor = await AsyncStorage.getItem(CHAVE_TUTORIAL_TAP_BOSS);
    return valor === '1';
  } catch {
    return false;
  }
}

export async function marcarTutorialTapBossVisto(): Promise<void> {
  await AsyncStorage.setItem(CHAVE_TUTORIAL_TAP_BOSS, '1');
}

async function jaViuChave(chave: string): Promise<boolean> {
  try {
    const valor = await AsyncStorage.getItem(chave);
    return valor === '1';
  } catch {
    return false;
  }
}

export async function jaViuTutorialHitBox(): Promise<boolean> {
  return jaViuChave(CHAVE_TUTORIAL_HIT_BOX);
}

export async function marcarTutorialHitBoxVisto(): Promise<void> {
  await AsyncStorage.setItem(CHAVE_TUTORIAL_HIT_BOX, '1');
}

export async function jaViuTutorialPatch(): Promise<boolean> {
  return jaViuChave(CHAVE_TUTORIAL_PATCH);
}

export async function marcarTutorialPatchVisto(): Promise<void> {
  await AsyncStorage.setItem(CHAVE_TUTORIAL_PATCH, '1');
}

export async function jaViuTutorialRouboCapitao(): Promise<boolean> {
  return jaViuChave(CHAVE_TUTORIAL_ROUBO_CAPITAO);
}

export async function marcarTutorialRouboCapitaoVisto(): Promise<void> {
  await AsyncStorage.setItem(CHAVE_TUTORIAL_ROUBO_CAPITAO, '1');
}

export async function jaViuTutorialLojaRun(): Promise<boolean> {
  return jaViuChave(CHAVE_TUTORIAL_LOJA_RUN);
}

export async function marcarTutorialLojaRunVisto(): Promise<void> {
  await AsyncStorage.setItem(CHAVE_TUTORIAL_LOJA_RUN, '1');
}

export async function jaViuTutorialArmadilhaRun(): Promise<boolean> {
  return jaViuChave(CHAVE_TUTORIAL_ARMADILHA_RUN);
}

export async function marcarTutorialArmadilhaRunVisto(): Promise<void> {
  await AsyncStorage.setItem(CHAVE_TUTORIAL_ARMADILHA_RUN, '1');
}

/** Dev: zera avisos da run e da arena no Jogar, para validar de novo. */
export async function limparTutoriaisRun(): Promise<void> {
  await AsyncStorage.multiRemove([
    CHAVE_TUTORIAL_LOJA_RUN,
    CHAVE_TUTORIAL_ARMADILHA_RUN,
    CHAVE_TUTORIAL_TAP_BOSS,
    CHAVE_TUTORIAL_HIT_BOX,
    CHAVE_TUTORIAL_PATCH,
    CHAVE_TUTORIAL_ROUBO_CAPITAO,
  ]);
}

const CHAVES_PROGRESSO_JOGO = [
  CHAVE_RECORDE_ALTITUDE,
  CHAVE_MOEDAS_TOTAL,
  CHAVE_POCOES_VIDA,
  CHAVE_CARTA_7DIAS_ATE,
  CHAVE_SKINS_COMPRADAS,
  CHAVE_SKIN_GORRO_EQUIPADA,
  CHAVE_SKIN_ORB_EQUIPADA,
  CHAVE_FLAGS_CONHECIDAS,
  CHAVE_INVASAO_PENDENTE,
  CHAVE_TUTORIAL_TAP_BOSS,
  CHAVE_TUTORIAL_HIT_BOX,
  CHAVE_TUTORIAL_PATCH,
  CHAVE_TUTORIAL_ROUBO_CAPITAO,
  CHAVE_TUTORIAL_LOJA_RUN,
  CHAVE_TUTORIAL_ARMADILHA_RUN,
];

/**
 * Wipe único para gravar o jogo como primeira vez.
 * Não roda no Jogar. Depois da primeira abertura, o save volta a persistir.
 * Idioma fica. Para outro wipe, mude CHAVE_RESET_GRAVACAO.
 */
export async function zerarProgressoCompletoUmaVez(): Promise<void> {
  try {
    const jaResetou = await AsyncStorage.getItem(CHAVE_RESET_GRAVACAO);
    if (jaResetou === '1') return;
    await AsyncStorage.multiRemove(CHAVES_PROGRESSO_JOGO);
    await AsyncStorage.setItem(CHAVE_MOEDAS_TOTAL, '0');
    await AsyncStorage.setItem(CHAVE_RESET_GRAVACAO, '1');
  } catch {
    // Sem storage: segue; a próxima leitura já trata como vazio.
  }
}

/**
 * A roleta podia creditar a carta de 7 dias com a vitrine parada nas moedas.
 * Limpa essa carta uma vez — o jogador volta a 2 corações.
 */
export async function corrigirCartaFantasmaUmaVez(): Promise<void> {
  try {
    const jaCorrigiu = await AsyncStorage.getItem(CHAVE_RESET_CARTA_FANTASMA);
    if (jaCorrigiu === '1') return;
    await AsyncStorage.removeItem(CHAVE_CARTA_7DIAS_ATE);
    await AsyncStorage.setItem(CHAVE_RESET_CARTA_FANTASMA, '1');
  } catch {
    // Sem storage: a carta some no próximo boot se a chave ainda existir.
  }
}
