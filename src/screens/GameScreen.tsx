/**
 * Tela da run: game loop (requestAnimationFrame) orquestrando os sistemas —
 * tilt → física → pouso/salto → câmera → reciclagem de plataformas →
 * moedas → orb → morte. O estado do mundo vive em ref (mutável);
 * um contador de tick força a re-renderização a cada frame.
 *
 * Mago da run: poses estáticas (agachado / parado / ar), não sheet em loop.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  PixelRatio,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  FUNDO_FASE_1,
  FUNDO_FASE_2,
  FUNDO_FASE_3,
  FUNDO_FASE_4,
  MAGO_AGACHADO,
  MAGO_AR,
  MAGO_MORTO,
  MAGO_PARADO,
  MINI_BOT_ZOMBIE_FRAMES,
  MINI_BOT_ZOMBIE_TAMANHO,
  MOEDA_PIRATA_FRAMES,
  MOEDA_PIRATA,
  ORB_BAJADA,
  ORB_NORMAL,
  ORB_SUBIDA,
  PLATAFORMA_FAKE,
  PLATAFORMA_TIENDA,
  PLATAFORMAS,
  type ImagemEstatica,
} from '../assets';
import {
  DURACAO_AGACHADO_S,
  DURACAO_HIT_BOSS_S,
  DURACAO_MORTO_S,
  DURACAO_TUTORIAL_ARENA_S,
  ESCALA_MAGO,
  ESCALA_MINIBOT_ZOMBIE_RUN,
  ESCALA_MOEDA,
  ESCALA_ORB_SKIN,
  ESCALA_SPRITE,
  FPS_MINIBOT_ZOMBIE,
  FPS_MOEDA,
  ORB_SKIN_EXTRA_DISTANCIA_PX,
  PX_POR_METRO,
  SEGUNDOS_RETORNO,
} from '../constants';
import { FramesAnimator } from '../components/FramesAnimator';
import { HUD } from '../components/HUD';
import { MoedaAnimator } from '../components/MoedaAnimator';
import {
  ALTURA_JOGADOR,
  LARGURA_JOGADOR,
  hitboxDoJogador,
  type EstadoJogador,
  type PoseMago,
} from '../entities/jogador';
import type { EstadoMundo, ResultadoRun } from '../entities/mundo';
import { aplicarProgressoSalvo, criarMundo, snapshotProgresso } from '../entities/mundo';
import {
  ALTURA_ORB,
  LARGURA_ORB,
  offsetVisualOrbSkin,
  poseOrbDoJogador,
  seguirJogador,
  type EstadoOrb,
  type PoseOrb,
} from '../entities/orb';
import {
  atualizarJogador,
  processarQuedaDaTela,
  resolverPouso,
  reviverNaPlataforma,
  rolarCamera,
} from '../systems/fisica';
import { atualizarMoedas, talvezCriarMoeda } from '../systems/moedas';
import {
  atualizarPlataformasEspeciais,
  reciclarPlataformas,
  substituirTiendaPorPlataformaNormal,
} from '../systems/plataformas';
import { gravidadeDaFase, impulsoDaFase, type FaseMapa } from '../systems/progressao-fases';
import { tocarSomHihihi, tocarSomMoeda, tocarSomMoedaPirata, tocarSomMorto, tocarSomPulo } from '../systems/audio-jogo';
import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import type { Plataforma } from '../entities/plataforma';
import {
  jaViuTutorialArmadilhaRun,
  jaViuTutorialLojaRun,
  marcarTutorialArmadilhaRunVisto,
  marcarTutorialLojaRunVisto,
  type ProgressoRunSalvo,
} from '../systems/persistencia-invasao';
import { vidasMaximas } from '../systems/pontuacao';
import { gorroEquipado, orbEquipada } from '../systems/skins';
import { usarTilt } from '../systems/tilt';
import { FONTE_PIXEL } from '../tipografia';

/** Limite do passo de física para não teletransportar o mago em travadas. */
const DT_MAXIMO = 1 / 30;
const PX_POR_MM_AVISO = 160 / 25.4;
/** Fonte da loja: 9 + 1 mm. */
const TAMANHO_FONTE_AVISO_LOJA = 9 + 1 * PX_POR_MM_AVISO;
/** Fonte da armadilha: 3 mm menor (não desce de 9). */
const TAMANHO_FONTE_AVISO_ARMADILHA = Math.max(
  9,
  TAMANHO_FONTE_AVISO_LOJA - 3 * PX_POR_MM_AVISO,
);
const LARGURA_AVISO_RUN_PX = 180;
/** Sobe o aviso da loja 2 mm em relação à fake. */
const SOBE_AVISO_LOJA_PX = 2 * PX_POR_MM_AVISO;
/** Sobe o aviso da armadilha 2 mm da plataforma. */
const SOBE_AVISO_ARMADILHA_PX = 2 * PX_POR_MM_AVISO;
const ESPESSURA_CONTORNO_PX = 2;
const OFFSETS_CONTORNO: Array<[number, number]> = [
  [-ESPESSURA_CONTORNO_PX, 0],
  [ESPESSURA_CONTORNO_PX, 0],
  [0, -ESPESSURA_CONTORNO_PX],
  [0, ESPESSURA_CONTORNO_PX],
  [-ESPESSURA_CONTORNO_PX, -ESPESSURA_CONTORNO_PX],
  [ESPESSURA_CONTORNO_PX, -ESPESSURA_CONTORNO_PX],
  [-ESPESSURA_CONTORNO_PX, ESPESSURA_CONTORNO_PX],
  [ESPESSURA_CONTORNO_PX, ESPESSURA_CONTORNO_PX],
];

function esperarMs(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

/** Fade igual ao aviso da arena (3 s visível + 450 ms sumindo). */
async function sumirAvisoRun(
  opacidade: Animated.Value,
  setMostrar: (valor: boolean) => void,
  cancelado: () => boolean,
): Promise<void> {
  await esperarMs(DURACAO_TUTORIAL_ARENA_S * 1000);
  if (cancelado()) return;
  Animated.timing(opacidade, {
    toValue: 0,
    duration: 450,
    useNativeDriver: true,
  }).start();
  await esperarMs(450);
  if (!cancelado()) setMostrar(false);
}

function plataformaVisivelNaTela(
  plataforma: Plataforma,
  alturaTela: number,
): boolean {
  return plataforma.y + plataforma.altura > 0 && plataforma.y < alturaTela;
}

/** ~2 cm físicos, em dp — dígito da contagem de retorno. */
function tamanhoFonteDoisCm(): number {
  const dpi = PixelRatio.get() * 160;
  return Math.round((2 / 2.54) * dpi / PixelRatio.get());
}

const POSE_POR_ESTADO: Record<PoseMago, ImagemEstatica> = {
  agachado: MAGO_AGACHADO,
  parado: MAGO_PARADO,
  ar: MAGO_AR,
  muerto: MAGO_MORTO,
};

const ORB_POR_POSE: Record<PoseOrb, ImagemEstatica> = {
  normal: ORB_NORMAL,
  subida: ORB_SUBIDA,
  bajada: ORB_BAJADA,
};

interface Props {
  aoTerminar: (resultado: ResultadoRun) => void;
  /** Pousou na plataforma fake — pausa a run e abre a tela de invasão. */
  aoInvadir: (progresso: ProgressoRunSalvo) => void;
  /** Pousou na plataforma-loja — pausa a run e abre a tienda. */
  aoAbrirLoja: (moedasSessao: number, vidas: number) => void;
  /** true = loop congelado (loja aberta por cima). */
  pausado?: boolean;
  /** Incrementa quando a loja gasta a sessão (zera moedas da run). */
  tokenZerarSessao?: number;
  /** Incrementa quando a poção restaura um coração na run. */
  tokenRestaurarCoracao?: number;
  /** 1 = fundo inicial; 2–4 = depois dos bosses da régua. */
  faseMapa?: FaseMapa;
  /** Continuar altitude/moedas depois de vencer o boss. */
  progressoInicial?: ProgressoRunSalvo | null;
  /** Volta do boss: mesma contagem cinza da loja, no cenário novo. */
  iniciarContagemAoMontar?: boolean;
}

export function GameScreen({
  aoTerminar,
  aoInvadir,
  aoAbrirLoja,
  pausado = false,
  tokenZerarSessao = 0,
  tokenRestaurarCoracao = 0,
  faseMapa = 1,
  progressoInicial = null,
  iniciarContagemAoMontar = false,
}: Props) {
  const { t } = useTextosJogo();
  const { width: larguraTela, height: alturaTela } = useWindowDimensions();
  const tiltRef = usarTilt();
  const mundoRef = useRef<EstadoMundo | null>(null);
  if (mundoRef.current === null) {
    mundoRef.current = criarMundo(larguraTela, alturaTela, faseMapa);
    if (progressoInicial) aplicarProgressoSalvo(mundoRef.current, progressoInicial);
  }
  const [, setTick] = useState(0);

  const pausadoRef = useRef(pausado);
  const estavaPausadoRef = useRef(pausado);
  const [segundosRetorno, setSegundosRetorno] = useState<number | null>(null);
  const segundosRetornoRef = useRef<number | null>(null);
  const pediuContagemInicialRef = useRef(false);
  const [mostrarTutorialLoja, setMostrarTutorialLoja] = useState(false);
  const [mostrarTutorialArmadilha, setMostrarTutorialArmadilha] = useState(false);
  const jaMostrouLojaRef = useRef(false);
  const jaMostrouArmadilhaRef = useRef(false);
  /** Timer de flash vermelho no contador de moedas ao coletar moeda pirata (fase 4). */
  const tempoFlashPirataRef = useRef(0);
  const opacidadeLoja = useRef(new Animated.Value(1)).current;
  const opacidadeArmadilha = useRef(new Animated.Value(1)).current;

  if (iniciarContagemAoMontar && !pediuContagemInicialRef.current) {
    pediuContagemInicialRef.current = true;
    segundosRetornoRef.current = SEGUNDOS_RETORNO;
    setSegundosRetorno(SEGUNDOS_RETORNO);
  }

  if (estavaPausadoRef.current && !pausado && segundosRetornoRef.current == null) {
    segundosRetornoRef.current = SEGUNDOS_RETORNO;
    setSegundosRetorno(SEGUNDOS_RETORNO);
  }
  estavaPausadoRef.current = pausado;
  pausadoRef.current = pausado || segundosRetornoRef.current != null;

  useEffect(() => {
    if (segundosRetorno == null) return;
    const id = setTimeout(() => {
      const proximo = segundosRetorno - 1;
      if (proximo <= 0) {
        segundosRetornoRef.current = null;
        setSegundosRetorno(null);
        return;
      }
      segundosRetornoRef.current = proximo;
      setSegundosRetorno(proximo);
    }, 1000);
    return () => clearTimeout(id);
  }, [segundosRetorno]);

  const ultimoTokenZerarSessaoRef = useRef(tokenZerarSessao);
  const ultimoTokenCoracaoRef = useRef(tokenRestaurarCoracao);

  useEffect(() => {
    if (tokenZerarSessao <= ultimoTokenZerarSessaoRef.current) return;
    ultimoTokenZerarSessaoRef.current = tokenZerarSessao;
    if (mundoRef.current) mundoRef.current.moedasColetadas = 0;
  }, [tokenZerarSessao]);

  useEffect(() => {
    // Só aplica o +1 se o token subiu NESTA montagem.
    // Remontar a run depois do boss reaplicava a poção e devolvia um coração.
    if (tokenRestaurarCoracao <= ultimoTokenCoracaoRef.current) return;
    ultimoTokenCoracaoRef.current = tokenRestaurarCoracao;
    if (!mundoRef.current) return;
    mundoRef.current.vidas = Math.min(vidasMaximas(), mundoRef.current.vidas + 1);
  }, [tokenRestaurarCoracao]);

  useEffect(() => {
    let ativo = true;
    let quadroId = 0;
    let tempoAnterior = 0;

    function passo(tempo: number) {
      if (!ativo) return;
      quadroId = requestAnimationFrame(passo);

      if (pausadoRef.current) {
        tempoAnterior = 0;
        return;
      }

      if (tempoAnterior === 0) tempoAnterior = tempo;
      const dt = Math.min((tempo - tempoAnterior) / 1000, DT_MAXIMO);
      tempoAnterior = tempo;

      const mundo = mundoRef.current!;

      if (mundo.tempoMorto > 0) {
        mundo.tempoMorto -= dt;
        mundo.jogador.pose = 'muerto';
        mundo.jogador.vx = 0;
        mundo.jogador.vy = 0;
        if (mundo.jogador.y > alturaTela - ALTURA_JOGADOR) {
          mundo.jogador.y = alturaTela - ALTURA_JOGADOR;
        }
        if (mundo.tempoMorto <= 0) {
          if (mundo.vidas <= 0) {
            mundo.morto = true;
            ativo = false;
            aoTerminar({
              altitudeMetros: mundo.altitudePx / PX_POR_METRO,
              moedas: mundo.moedasColetadas,
            });
            return;
          }
          reviverNaPlataforma(mundo, larguraTela, alturaTela, impulsoDaFase(faseMapa));
        }
        setTick((tick) => tick + 1);
        return;
      }

      const baseAnterior = mundo.jogador.y + ALTURA_JOGADOR;

      atualizarJogador(mundo.jogador, tiltRef.current, dt, larguraTela, gravidadeDaFase(faseMapa));
      const vyAntesDoPouso = mundo.jogador.vy;

      // Mini-zombie: testa com a vy da queda. Se o pouso inverter o pulo
      // antes, o primeiro pisão não descontava o coração.
      if (faseMapa >= 4 && mundo.tempoMorto === 0 && !mundo.morto) {
        const jogCaixa = hitboxDoJogador(mundo.jogador);
        for (const plataforma of mundo.plataformas) {
          if (!plataforma.zombie) continue;
          const zW = MINI_BOT_ZOMBIE_TAMANHO.largura * ESCALA_MINIBOT_ZOMBIE_RUN;
          const zH = MINI_BOT_ZOMBIE_TAMANHO.altura * ESCALA_MINIBOT_ZOMBIE_RUN;
          const zX = plataforma.zombie.x;
          const zY = plataforma.y - zH;
          const pisouNoZombie =
            vyAntesDoPouso >= 0 &&
            jogCaixa.direita > zX &&
            jogCaixa.esquerda < zX + zW &&
            jogCaixa.base > zY &&
            jogCaixa.base < zY + zH * 0.55;
          if (pisouNoZombie) {
            mundo.vidas -= 1;
            mundo.tempoMorto = DURACAO_MORTO_S;
            tocarSomHihihi();
            break;
          }
        }
      }

      if (mundo.tempoMorto > 0) {
        setTick((tick) => tick + 1);
        return;
      }

      const plataformaPouso = resolverPouso(
        mundo.jogador,
        baseAnterior,
        mundo.plataformas,
        impulsoDaFase(faseMapa),
      );
      if (plataformaPouso && !plataformaPouso.ehFake && !plataformaPouso.ehTienda) {
        tocarSomPulo();
      }
      if (plataformaPouso?.ehFake) {
        aoInvadir(snapshotProgresso(mundo, faseMapa));
        return;
      }
      if (plataformaPouso?.ehTienda) {
        // Troca a loja por uma plataforma normal no mesmo chão (sem buraco).
        const substituta = substituirTiendaPorPlataformaNormal(
          plataformaPouso,
          larguraTela,
        );
        mundo.plataformas = mundo.plataformas.map((plataforma) =>
          plataforma.id === plataformaPouso.id ? substituta : plataforma,
        );
        mundo.jogador.y = substituta.y - ALTURA_JOGADOR;
        mundo.jogador.vy = impulsoDaFase(faseMapa);
        mundo.jogador.pose = 'agachado';
        mundo.jogador.tempoPose = DURACAO_AGACHADO_S;
        aoAbrirLoja(mundo.moedasColetadas, mundo.vidas);
        return;
      }
      atualizarPlataformasEspeciais(mundo.plataformas, mundo.moedas, dt);
      rolarCamera(mundo, alturaTela);

      const reciclagem = reciclarPlataformas(
        mundo.plataformas,
        larguraTela,
        alturaTela,
        mundo.altitudePx / PX_POR_METRO,
        mundo.ultimaFaixaTienda,
        faseMapa,
        mundo.jaSpawnouFakeDestaFaixa,
        mundo.altitudeProximoBoss,
      );
      mundo.ultimaFaixaTienda = reciclagem.ultimaFaixaTienda;
      mundo.jaSpawnouFakeDestaFaixa = reciclagem.jaSpawnouFakeDestaFaixa;
      for (const plataforma of reciclagem.novas) {
        if (plataforma.ehFake || plataforma.ehTienda) continue;
        const moeda = talvezCriarMoeda(plataforma, faseMapa);
        if (moeda) mundo.moedas.push(moeda);
      }

      const moedasAntes = mundo.moedasColetadas;
      const { coletouPirata } = atualizarMoedas(mundo, alturaTela);
      if (mundo.moedasColetadas > moedasAntes) tocarSomMoeda();
      if (coletouPirata) {
        tocarSomMoedaPirata();
        tempoFlashPirataRef.current = DURACAO_HIT_BOSS_S;
      }
      // Tick down do flash de moeda pirata (independente de coletar nova).
      if (tempoFlashPirataRef.current > 0) {
        tempoFlashPirataRef.current = Math.max(0, tempoFlashPirataRef.current - dt);
      }
      const skinOrb = orbEquipada();
      let extraX = 0;
      let larguraVis: number;
      let alturaVis: number;
      let offsetVisX: number;
      let offsetVisY: number;
      if (skinOrb) {
        larguraVis = skinOrb.tamanhoNormal.largura * ESCALA_ORB_SKIN;
        alturaVis = skinOrb.tamanhoNormal.altura * ESCALA_ORB_SKIN;
        const off = offsetVisualOrbSkin(larguraVis, alturaVis);
        extraX = -ORB_SKIN_EXTRA_DISTANCIA_PX;
        offsetVisX = off.x;
        offsetVisY = off.y;
      } else {
        const arte = ORB_POR_POSE[poseOrbDoJogador(mundo.jogador)];
        larguraVis = arte.largura * ESCALA_SPRITE;
        alturaVis = arte.altura * ESCALA_SPRITE;
        offsetVisX = (LARGURA_ORB - larguraVis) / 2;
        offsetVisY = ALTURA_ORB - alturaVis;
      }
      seguirJogador(mundo.orb, mundo.jogador, dt, extraX, {
        larguraVisual: larguraVis,
        alturaVisual: alturaVis,
        offsetVisualX: offsetVisX,
        offsetVisualY: offsetVisY,
        folgaPx: ORB_SKIN_EXTRA_DISTANCIA_PX,
      });
      const caiu = processarQuedaDaTela(mundo, alturaTela);
      if (caiu) tocarSomMorto();

      if (mundo.morto) {
        ativo = false;
        aoTerminar({
          altitudeMetros: mundo.altitudePx / PX_POR_METRO,
          moedas: mundo.moedasColetadas,
        });
        return;
      }

      setTick((tick) => tick + 1);
    }

    quadroId = requestAnimationFrame(passo);
    return () => {
      ativo = false;
      cancelAnimationFrame(quadroId);
    };
    // O mundo é criado uma única vez por montagem da tela.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mundo = mundoRef.current;
  const lojaNaTela =
    mundo?.plataformas.find(
      (plataforma) =>
        plataforma.ehTienda === true &&
        plataformaVisivelNaTela(plataforma, alturaTela),
    ) ?? null;
  const fakeNaTela =
    mundo?.plataformas.find(
      (plataforma) =>
        plataforma.ehFake === true &&
        plataformaVisivelNaTela(plataforma, alturaTela),
    ) ?? null;
  const idLojaVisivel = lojaNaTela?.id ?? null;
  const idFakeVisivel = fakeNaTela?.id ?? null;

  useEffect(() => {
    if (idLojaVisivel == null || jaMostrouLojaRef.current) return;
    let cancelado = false;
    (async () => {
      const jaViu = await jaViuTutorialLojaRun();
      if (cancelado) return;
      if (jaViu) {
        jaMostrouLojaRef.current = true;
        return;
      }
      jaMostrouLojaRef.current = true;
      await marcarTutorialLojaRunVisto();
      if (cancelado) return;
      setMostrarTutorialLoja(true);
      opacidadeLoja.setValue(1);
      await sumirAvisoRun(opacidadeLoja, setMostrarTutorialLoja, () => cancelado);
    })();
    return () => {
      cancelado = true;
    };
  }, [idLojaVisivel, opacidadeLoja]);

  useEffect(() => {
    if (idFakeVisivel == null || jaMostrouArmadilhaRef.current) return;
    let cancelado = false;
    (async () => {
      const jaViu = await jaViuTutorialArmadilhaRun();
      if (cancelado) return;
      if (jaViu) {
        jaMostrouArmadilhaRef.current = true;
        return;
      }
      jaMostrouArmadilhaRef.current = true;
      await marcarTutorialArmadilhaRunVisto();
      if (cancelado) return;
      setMostrarTutorialArmadilha(true);
      opacidadeArmadilha.setValue(1);
      await sumirAvisoRun(
        opacidadeArmadilha,
        setMostrarTutorialArmadilha,
        () => cancelado,
      );
    })();
    return () => {
      cancelado = true;
    };
  }, [idFakeVisivel, opacidadeArmadilha]);

  return (
    <ImageBackground
      source={
        faseMapa >= 4
          ? FUNDO_FASE_4
          : faseMapa === 3
            ? FUNDO_FASE_3
            : faseMapa === 2
              ? FUNDO_FASE_2
              : FUNDO_FASE_1
      }
      style={estilos.fundo}
      resizeMode="cover"
    >
      {mundo.plataformas.map((plataforma) => {
        if (plataforma.estadoQuebra === 'sumiu') return null;
        const arte = plataforma.ehFake
          ? PLATAFORMA_FAKE
          : plataforma.ehTienda
            ? PLATAFORMA_TIENDA
            : PLATAFORMAS[plataforma.tipo];
        const opaca = plataforma.ehQuebra && plataforma.visivelPisca === false;
        return (
          <Image
            key={plataforma.id}
            source={arte.imagem}
            style={{
              position: 'absolute',
              left: plataforma.x,
              top: plataforma.y,
              width: plataforma.largura,
              height: plataforma.altura,
              opacity: opaca ? 0.22 : 1,
            }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
        );
      })}

      {/* Mini-zombies caminham sobre as plataformas fixas na fase 4 */}
      {faseMapa >= 4 && mundo.plataformas.map((plataforma) => {
        if (!plataforma.zombie) return null;
        const escala = ESCALA_MINIBOT_ZOMBIE_RUN;
        const zW = MINI_BOT_ZOMBIE_TAMANHO.largura * escala;
        const zH = MINI_BOT_ZOMBIE_TAMANHO.altura * escala;
        const frame = MINI_BOT_ZOMBIE_FRAMES[plataforma.zombie.frameAtual];
        return (
          <Image
            key={`zombie-${plataforma.id}`}
            source={frame}
            style={{
              position: 'absolute',
              left: plataforma.zombie.x,
              top: plataforma.y - zH,
              width: zW,
              height: zH,
              transform: [{ scaleX: plataforma.zombie.dir === -1 ? -1 : 1 }],
            }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
        );
      })}

      {mundo.moedas.map((moeda) => (
        <NoMundo key={moeda.id} x={moeda.x} y={moeda.y}>
          {moeda.pirata ? (
            <FramesAnimator
              frames={MOEDA_PIRATA_FRAMES}
              fps={FPS_MOEDA}
              larguraFrame={MOEDA_PIRATA.larguraFrame}
              alturaFrame={MOEDA_PIRATA.alturaFrame}
              escala={ESCALA_MOEDA}
            />
          ) : (
            <MoedaAnimator fps={FPS_MOEDA} escala={ESCALA_MOEDA} />
          )}
        </NoMundo>
      ))}

      {mundo.jogador.pose !== 'muerto' && (
        <SpriteOrbRun orb={mundo.orb} jogador={mundo.jogador} />
      )}

      <SpriteMagoRun jogador={mundo.jogador} />

      {mostrarTutorialLoja && lojaNaTela && (
        <AvisoSetaRun
          plataforma={lojaNaTela}
          texto={t.run.tutorialLoja}
          opacidade={opacidadeLoja}
          larguraTela={larguraTela}
          sobePx={SOBE_AVISO_LOJA_PX}
          fontSize={TAMANHO_FONTE_AVISO_LOJA}
        />
      )}
      {mostrarTutorialArmadilha && fakeNaTela && (
        <AvisoSetaRun
          plataforma={fakeNaTela}
          texto={t.run.tutorialArmadilha}
          opacidade={opacidadeArmadilha}
          larguraTela={larguraTela}
          fontSize={TAMANHO_FONTE_AVISO_ARMADILHA}
          sobePx={SOBE_AVISO_ARMADILHA_PX}
        />
      )}

      <HUD
        altitudeMetros={mundo.altitudePx / PX_POR_METRO}
        moedas={mundo.moedasColetadas}
        vidas={mundo.vidas}
        vidasMaximas={vidasMaximas()}
        flashPirata={
          tempoFlashPirataRef.current > 0 &&
          Math.floor(tempoFlashPirataRef.current * 10) % 2 === 0
        }
      />

      {segundosRetorno != null && (
        <View style={estilos.peliculaRetorno} pointerEvents="none">
          <Text
            style={[
              estilos.numeroRetorno,
              { fontSize: tamanhoFonteDoisCm(), lineHeight: tamanhoFonteDoisCm() + 8 },
            ]}
          >
            {segundosRetorno}
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}

/** Desenha a pose atual com os pés alinhados na base da caixa lógica. */
function SpriteMagoRun({ jogador }: { jogador: EstadoJogador }) {
  // Gorro equipado troca só a arte — hitbox e física continuam as originais.
  const skin = gorroEquipado();
  const arte = skin ? skin.poses[jogador.pose] : POSE_POR_ESTADO[jogador.pose];
  const largura = arte.largura * ESCALA_MAGO;
  const altura = arte.altura * ESCALA_MAGO;
  // Canvas do gorro tem folga transparente sob os pés: desce essa folga
  // para o pé tocar o chão (sem skin a folga é 0).
  const folgaBaixo = skin ? skin.poses[jogador.pose].folgaBaixo * ESCALA_MAGO : 0;
  // Pés colados na base da hitbox (poses mais baixas sobem o desenho).
  const offsetX = (LARGURA_JOGADOR - largura) / 2;
  const offsetY = ALTURA_JOGADOR - altura + folgaBaixo;

  return (
    <View
      style={{
        position: 'absolute',
        left: jogador.x + offsetX,
        top: jogador.y + offsetY,
        width: largura,
        height: altura,
        transform: [{ scaleX: jogador.direcao === 'esquerda' ? -1 : 1 }],
      }}
    >
      <Image
        source={arte.imagem}
        style={{ width: largura, height: altura }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
    </View>
  );
}

/**
 * Orb estático alinhado ao mago: normal no chão/impulso,
 * subida enquanto sobe, bajada quando começa a cair (vy >= 0).
 * Skin equipada: animação única (giro/pisca) — sem poses, só acompanha o mago.
 */
function SpriteOrbRun({ orb, jogador }: { orb: EstadoOrb; jogador: EstadoJogador }) {
  const skin = orbEquipada();
  if (skin) {
    const largura = skin.tamanhoNormal.largura * ESCALA_ORB_SKIN;
    const altura = skin.tamanhoNormal.altura * ESCALA_ORB_SKIN;
    // Extra de tamanho cresce para a esquerda (lado da orb), não contra o mago.
    const off = offsetVisualOrbSkin(largura, altura);
    const offsetX = off.x;
    const offsetY = off.y;
    return (
      <View
        style={{
          position: 'absolute',
          left: orb.x + offsetX,
          top: orb.y + offsetY,
          width: largura,
          height: altura,
        }}
      >
        <FramesAnimator
          frames={skin.framesNormal}
          fps={skin.fps}
          larguraFrame={skin.tamanhoNormal.largura}
          alturaFrame={skin.tamanhoNormal.altura}
          escala={ESCALA_ORB_SKIN}
        />
      </View>
    );
  }

  const pose = poseOrbDoJogador(jogador);
  const arte = ORB_POR_POSE[pose];
  const largura = arte.largura * ESCALA_SPRITE;
  const altura = arte.altura * ESCALA_SPRITE;
  const offsetX = (LARGURA_ORB - largura) / 2;
  const offsetY = ALTURA_ORB - altura;

  return (
    <View
      style={{
        position: 'absolute',
        left: orb.x + offsetX,
        top: orb.y + offsetY,
        width: largura,
        height: altura,
      }}
    >
      <Image
        source={arte.imagem}
        style={{ width: largura, height: altura }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
    </View>
  );
}

/** Envelope absoluto para posicionar entidades do mundo na tela. */
function NoMundo({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  return <View style={{ position: 'absolute', left: x, top: y }}>{children}</View>;
}

/** Texto + seta para baixo, igual ao aviso do pendrive na arena. */
function AvisoSetaRun({
  plataforma,
  texto,
  opacidade,
  larguraTela,
  sobePx = 0,
  fontSize,
}: {
  plataforma: Plataforma;
  texto: string;
  opacidade: Animated.Value;
  larguraTela: number;
  sobePx?: number;
  fontSize: number;
}) {
  const lineHeight = fontSize + 4;
  const left = Math.max(
    8,
    Math.min(
      plataforma.x + plataforma.largura / 2 - LARGURA_AVISO_RUN_PX / 2,
      larguraTela - LARGURA_AVISO_RUN_PX - 8,
    ),
  );
  const top = Math.max(8, plataforma.y - (lineHeight + 22 + sobePx));
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        top,
        width: LARGURA_AVISO_RUN_PX,
        alignItems: 'center',
        opacity: opacidade,
        zIndex: 12,
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <TextoAvisoContorno texto={texto} fontSize={fontSize} lineHeight={lineHeight} />
        <View style={estilos.setaParaBaixo} />
      </View>
    </Animated.View>
  );
}

/** Branco com contorno preto — lê em fundo claro ou escuro. */
function TextoAvisoContorno({
  texto,
  fontSize,
  lineHeight,
}: {
  texto: string;
  fontSize: number;
  lineHeight: number;
}) {
  const tipo = [estilos.textoTutorialRun, { fontSize, lineHeight }];
  return (
    <View>
      {OFFSETS_CONTORNO.map(([dx, dy], indice) => (
        <Text
          key={indice}
          style={[
            tipo,
            estilos.textoTutorialRunContorno,
            { left: dx, top: dy },
          ]}
        >
          {texto}
        </Text>
      ))}
      <Text style={tipo}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
  },
  peliculaRetorno: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(36, 36, 40, 0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroRetorno: {
    fontFamily: FONTE_PIXEL,
    color: '#f2e3c0',
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 0,
  },
  textoTutorialRun: {
    fontFamily: FONTE_PIXEL,
    color: '#ffffff',
    textAlign: 'center',
    includeFontPadding: false,
  },
  textoTutorialRunContorno: {
    position: 'absolute',
    color: '#000000',
  },
  setaParaBaixo: {
    width: 0,
    height: 0,
    marginTop: 4,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 13,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
  },
});
