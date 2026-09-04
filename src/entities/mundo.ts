/**
 * Estado agregado da run e resultado entregue às telas.
 */

import { criarPlataformasIniciais, faixaTiendaAtual } from '../systems/plataformas';
import { PX_POR_METRO, ALTITUDE_GRADE_BOSS, DEV_BOSS_CAPITAO_ALTITUDE } from '../constants';
import type { ProgressoRunSalvo } from '../systems/persistencia-invasao';
import { vidasInicio, vidasMaximas } from '../systems/pontuacao';
import {
  altitudePrimeiroBoss,
  type FaseMapa,
  type IdBoss,
} from '../systems/progressao-fases';
import type { EstadoJogador } from './jogador';
import { criarJogador } from './jogador';
import type { Moeda } from './moeda';
import type { EstadoOrb } from './orb';
import { criarOrb } from './orb';
import type { Plataforma } from './plataforma';

export interface EstadoMundo {
  jogador: EstadoJogador;
  orb: EstadoOrb;
  plataformas: Plataforma[];
  moedas: Moeda[];
  /** Total de pixels que a câmera já subiu (vira altitude em metros no HUD). */
  altitudePx: number;
  moedasColetadas: number;
  morto: boolean;
  /** Corações restantes (some da HUD; 0 após a última queda). */
  vidas: number;
  /** Tempo restante da pose de morto (0 = jogando). */
  tempoMorto: number;
  /** Faixa de altitude em que a loja já nasceu nesta run (200, 500, 800…). */
  ultimaFaixaTienda: number | null;
  /** A fake garantida desta faixa já nasceu (aleatórias seguem até pisar). */
  jaSpawnouFakeDestaFaixa: boolean;
  /** Próxima altitude (m) da fake garantida. */
  altitudeProximoBoss: number;
  bossesVencidosNaFase: number;
  bossesVencidosTotal: number;
  tiposVencidosNaFase: IdBoss[];
}

export interface ResultadoRun {
  altitudeMetros: number;
  moedas: number;
}

export function criarMundo(
  larguraTela: number,
  alturaTela: number,
  faseMapa: FaseMapa = 1,
): EstadoMundo {
  const jogador = criarJogador(larguraTela, alturaTela);
  return {
    jogador,
    orb: criarOrb(jogador),
    plataformas: criarPlataformasIniciais(larguraTela, alturaTela, faseMapa),
    moedas: [],
    altitudePx: 0,
    moedasColetadas: 0,
    morto: false,
    vidas: vidasInicio(),
    tempoMorto: 0,
    ultimaFaixaTienda: null,
    jaSpawnouFakeDestaFaixa: false,
    altitudeProximoBoss: DEV_BOSS_CAPITAO_ALTITUDE ?? altitudePrimeiroBoss(),
    bossesVencidosNaFase: 0,
    bossesVencidosTotal: 0,
    tiposVencidosNaFase: [],
  };
}

/** Continua a run depois do boss: altitude, moedas, corações e faixa da loja. */
export function aplicarProgressoSalvo(
  mundo: EstadoMundo,
  progresso: ProgressoRunSalvo,
): void {
  mundo.altitudePx = progresso.altitudePx;
  mundo.moedasColetadas = progresso.moedasColetadas;
  mundo.vidas = Math.max(
    0,
    Math.min(vidasMaximas(), progresso.vidas ?? vidasInicio()),
  );
  mundo.ultimaFaixaTienda = faixaTiendaAtual(progresso.altitudePx / PX_POR_METRO);
  mundo.jaSpawnouFakeDestaFaixa = progresso.jaSpawnouFakeDestaFaixa ?? false;
  const proximo = progresso.altitudeProximoBoss ?? altitudePrimeiroBoss();
  mundo.altitudeProximoBoss =
    proximo < ALTITUDE_GRADE_BOSS - 0.5 ? altitudePrimeiroBoss() : proximo;
  mundo.bossesVencidosNaFase = progresso.bossesVencidosNaFase ?? 0;
  mundo.bossesVencidosTotal = progresso.bossesVencidosTotal ?? 0;
  mundo.tiposVencidosNaFase = [...(progresso.tiposVencidosNaFase ?? [])];
}

export function snapshotProgresso(
  mundo: EstadoMundo,
  faseMapa: FaseMapa,
): ProgressoRunSalvo {
  return {
    altitudePx: mundo.altitudePx,
    moedasColetadas: mundo.moedasColetadas,
    vidas: mundo.vidas,
    faseMapa,
    bossesVencidosNaFase: mundo.bossesVencidosNaFase,
    bossesVencidosTotal: mundo.bossesVencidosTotal,
    tiposVencidosNaFase: [...mundo.tiposVencidosNaFase],
    altitudeProximoBoss: mundo.altitudeProximoBoss,
    jaSpawnouFakeDestaFaixa: mundo.jaSpawnouFakeDestaFaixa,
  };
}
