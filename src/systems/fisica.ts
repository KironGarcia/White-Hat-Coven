/**
 * Física da run: movimento do mago, salto ao pousar, câmera vertical e morte.
 * Regra única de salto: TODO pouso em plataforma dispara um salto automático
 * (estilo endless vertical). Não existe botão de pulo.
 *
 * Pose visual: agachado (pouso) → parado/esticado → ar.
 */

import {
  DURACAO_AGACHADO_S,
  DURACAO_MORTO_S,
  DURACAO_PARADO_S,
  FRACAO_PISO_PLATAFORMA_TIENDA,
  GRAVIDADE,
  IMPULSO_SALTO,
  LINHA_CAMERA,
  MARGEM_HORIZONTAL,
  SENSIBILIDADE_TILT,
  VELOCIDADE_TILT_MAX,
} from '../constants';
import type { EstadoJogador } from '../entities/jogador';
import { ALTURA_JOGADOR, LARGURA_JOGADOR, hitboxDoJogador } from '../entities/jogador';
import type { EstadoMundo } from '../entities/mundo';
import type { Plataforma } from '../entities/plataforma';
import { iniciarQuebraPlataforma } from './plataformas';

/**
 * Integra gravidade e tilt. Bordas laterais: limite invisível que acompanha
 * a largura real do celular (sem wrap-around nem parede visível).
 */
export function atualizarJogador(
  jogador: EstadoJogador,
  tiltX: number,
  dt: number,
  larguraTela: number,
  gravidade = GRAVIDADE,
): void {
  // Sinal invertido: inclinar o aparelho para a direita gera x negativo no
  // sensor. Calibrar no aparelho real se necessário.
  const vxAlvo = Math.max(
    -VELOCIDADE_TILT_MAX,
    Math.min(VELOCIDADE_TILT_MAX, -tiltX * SENSIBILIDADE_TILT),
  );
  jogador.vx = vxAlvo;
  jogador.vy += gravidade * dt;

  jogador.x += jogador.vx * dt;
  jogador.y += jogador.vy * dt;

  if (jogador.vx < -20) jogador.direcao = 'esquerda';
  else if (jogador.vx > 20) jogador.direcao = 'direita';

  // Parede invisível: usa a largura da tela deste aparelho.
  const xMin = MARGEM_HORIZONTAL;
  const xMax = larguraTela - LARGURA_JOGADOR - MARGEM_HORIZONTAL;
  if (jogador.x < xMin) {
    jogador.x = xMin;
    if (jogador.vx < 0) jogador.vx = 0;
  } else if (jogador.x > xMax) {
    jogador.x = xMax;
    if (jogador.vx > 0) jogador.vx = 0;
  }

  atualizarPoseMago(jogador, dt);
}

/**
 * Sequência visual: agachado → parado → ar.
 * No ar permanece até o próximo pouso.
 */
function atualizarPoseMago(jogador: EstadoJogador, dt: number): void {
  if (jogador.pose === 'ar' || jogador.pose === 'muerto') return;

  jogador.tempoPose -= dt;
  if (jogador.tempoPose > 0) return;

  if (jogador.pose === 'agachado') {
    jogador.pose = 'parado';
    jogador.tempoPose = DURACAO_PARADO_S;
    return;
  }

  // parado esgotou → vai ao ar
  jogador.pose = 'ar';
  jogador.tempoPose = 0;
}

/**
 * Pouso: somente em queda (vy > 0), quando os pés cruzam a superfície
 * da plataforma com sobreposição horizontal. Pousar = saltar de novo.
 * Loja: a superfície é a metade da arte (não o topo), para “entrar” nela.
 * Devolve a plataforma tocada, ou null se não houve pouso.
 */
export function resolverPouso(
  jogador: EstadoJogador,
  baseAnterior: number,
  plataformas: Plataforma[],
  impulsoSalto = IMPULSO_SALTO,
): Plataforma | null {
  if (jogador.vy <= 0) return null;

  const caixa = hitboxDoJogador(jogador);
  for (const plataforma of plataformas) {
    if (plataforma.estadoQuebra === 'sumiu') continue;
    const superficieY = plataforma.ehTienda
      ? plataforma.y + plataforma.altura * FRACAO_PISO_PLATAFORMA_TIENDA
      : plataforma.y;
    const cruzouTopo = baseAnterior <= superficieY && caixa.base >= superficieY;
    const sobrepoeX =
      caixa.direita > plataforma.x && caixa.esquerda < plataforma.x + plataforma.largura;

    if (cruzouTopo && sobrepoeX) {
      jogador.y = superficieY - ALTURA_JOGADOR;
      // Fake / loja: trava o salto — a run pausa e abre outra tela.
      if (plataforma.ehFake || plataforma.ehTienda) {
        jogador.vy = 0;
        jogador.pose = 'parado';
        jogador.tempoPose = 0;
        return plataforma;
      }
      jogador.vy = impulsoSalto;
      jogador.pose = 'agachado';
      jogador.tempoPose = DURACAO_AGACHADO_S;
      iniciarQuebraPlataforma(plataforma);
      return plataforma;
    }
  }
  return null;
}

/**
 * Câmera vertical: se o mago passa da linha de câmera, o mundo desce
 * (plataformas e moedas) e a altitude acumula.
 * Devolve quantos pixels o mundo rolou neste passo.
 */
export function rolarCamera(mundo: EstadoMundo, alturaTela: number): number {
  const linha = alturaTela * LINHA_CAMERA;
  if (mundo.jogador.y >= linha) return 0;

  const deslocamento = linha - mundo.jogador.y;
  mundo.jogador.y = linha;
  mundo.orb.y += deslocamento;
  for (const plataforma of mundo.plataformas) plataforma.y += deslocamento;
  for (const moeda of mundo.moedas) moeda.y += deslocamento;
  mundo.altitudePx += deslocamento;
  return deslocamento;
}

/**
 * Caiu abaixo da tela: perde um coração, trava na pose de morto
 * (visível na base) e espera o timer para reviver ou encerrar.
 */
export function processarQuedaDaTela(mundo: EstadoMundo, alturaTela: number): boolean {
  if (mundo.tempoMorto > 0) return false;
  if (mundo.jogador.y <= alturaTela) return false;

  mundo.vidas -= 1;
  mundo.tempoMorto = DURACAO_MORTO_S;
  mundo.jogador.pose = 'muerto';
  mundo.jogador.vx = 0;
  mundo.jogador.vy = 0;
  mundo.jogador.y = alturaTela - ALTURA_JOGADOR;
  return true;
}

/** Depois da pose de morto, se ainda tem vida: pousa numa plataforma da tela. */
export function reviverNaPlataforma(
  mundo: EstadoMundo,
  larguraTela: number,
  alturaTela: number,
  impulsoSalto = IMPULSO_SALTO,
): void {
  const candidatas = mundo.plataformas.filter(
    (plataforma) =>
      !plataforma.ehFake &&
      !plataforma.ehTienda &&
      plataforma.estadoQuebra !== 'sumiu' &&
      plataforma.y > 90 &&
      plataforma.y < alturaTela - 50,
  );
  const lista = candidatas.length > 0 ? candidatas : mundo.plataformas.filter(
    (plataforma) =>
      !plataforma.ehFake &&
      !plataforma.ehTienda &&
      plataforma.estadoQuebra !== 'sumiu',
  );
  lista.sort((a, b) => b.y - a.y);
  const alvo = lista[0];
  if (!alvo) {
    mundo.jogador.x = (larguraTela - LARGURA_JOGADOR) / 2;
    mundo.jogador.y = alturaTela * 0.55;
  } else {
    mundo.jogador.x = alvo.x + (alvo.largura - LARGURA_JOGADOR) / 2;
    mundo.jogador.y = alvo.y - ALTURA_JOGADOR;
  }
  mundo.jogador.vx = 0;
  mundo.jogador.vy = impulsoSalto * 0.7;
  mundo.jogador.pose = 'agachado';
  mundo.jogador.tempoPose = DURACAO_AGACHADO_S;
  mundo.tempoMorto = 0;
}
