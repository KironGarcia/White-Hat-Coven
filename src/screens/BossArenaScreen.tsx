/**
 * Arena do boss — mesma tela para Phishing Man, Zombie-net e Capitão Pix.
 * O perfil muda sprites e o ataque especial (anzol / mini-bots / moedas).
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ANZOL_PISHING,
  CARRINHO_ANZOL,
  CORAZON,
  DISPARO_IMPACTO_FRAMES,
  DISPARO_IMPACTO_OURO_FRAMES,
  DISPARO_SALIDA,
  DISPARO_SALIDA_OURO,
  DISPARO_VIAGEM,
  DISPARO_VIAGEM_OURO,
  GRAY_MAGO_AVISO,
  HIT_BOX_BOSS_FRAMES,
  HIT_BOX_BOSS_TAMANHO,
  MAGO_AGACHADO,
  MAGO_AR,
  MAGO_INTRO_FRAMES,
  MAGO_INTRO_TAMANHO,
  MAGO_MORTO,
  MAGO_PARADO,
  MARCO_TELA_BOSS,
  ORB_STATICO_FRAMES,
  ORB_STATICO_OURO_FRAMES,
  ORB_STATICO_OURO_TAMANHO,
  ORB_STATICO_TAMANHO,
  PATCH_FRAMES,
  PATCH_TAMANHO,
  PISHING_MAN_FRAMES,
  PISHING_MAN_HAHAHA,
  PISHING_MAN_HIT_FRAMES,
  PISHING_MAN_HIT_TAMANHO,
  PISHING_MAN_TAMANHO,
  PISO_TELA_BOSS,
  VIRUS_BOSS_FRAMES,
  VIRUS_BOSS_TAMANHO,
  ZOMBIE_NET_FRAMES,
  ZOMBIE_NET_HIT_FRAMES,
  ZOMBIE_NET_HIT_TAMANHO,
  ZOMBIE_NET_TAMANHO,
  MINI_BOT_ZOMBIE_FRAMES,
  MINI_BOT_ZOMBIE_TAMANHO,
  CAPITAN_PIX_FRAMES,
  CAPITAN_PIX_TAMANHO,
  CAPITAN_PIX_HAHAHA,
  BAU_PIX_FECHADO,
  BAU_PIX_ABERTO,
  MOEDA_PIRATA_FRAMES,
  MOEDA_PLATAFORMA_FRAMES,
  MOEDA_PLATAFORMA_TAMANHO,
  type ImagemEstatica,
} from '../assets';
import { BalaoFala } from '../components/BalaoFala';
import { BotaoMadeira } from '../components/BotaoMadeira';
import { FramesAnimator } from '../components/FramesAnimator';
import { SpriteAnimator } from '../components/SpriteAnimator';
import { FundoGlitchAnimado } from './AvisoInvasaoScreen';
import {
  COR_LINHA_ANZOL,
  ESCALA_ANZOL,
  ESCALA_BOTAO_RPG,
  ESCALA_CARRINHO_ANZOL,
  ESCALA_MAGO,
  ESCALA_PATCH,
  ESCALA_ORB_SKIN,
  ESCALA_SPRITE,
  ESCALA_VIRUS_BOSS,
  FLASH_IMPACTO_DISPARO_S,
  FPS_MAGO_INTRO,
  FPS_ORB_STATICO,
  FPS_HIT_BOX_BOSS,
  FPS_PISHING_MAN,
  FPS_PISHING_MAN_HAHAHA,
  FRAME_INICIAL_HAHAHA_BOSS,
  PASSOS_HAHAHA_BOSS,
  FPS_PISHING_MAN_HIT,
  FPS_VIRUS_BOSS,
  LARGURA_LINHA_ANZOL,
  PX_POR_METRO,
  AUMENTO_BOSS_PX,
  REDUCAO_ZOMBIE_NET_PX,
  REDUCAO_CAPITAO_PIX_PX,
  DESCIDA_IDLE_BOSS_PX,
  DURACAO_TUTORIAL_ARENA_S,
  TAMANHO_FONTE_HP_BOSS,
  TAMANHO_FONTE_MOEDAS_ARENA,
  ESCALA_MOEDA_HUD_ARENA,
  SEGUNDOS_RETORNO,
  SENSIBILIDADE_TILT_STUN,
  VELOCIDADE_TILT_STUN_MAX,
  ESCALA_MINI_BOT_ZOMBIE,
  FPS_MINI_BOT_ZOMBIE,
  DURACAO_PISCA_MINI_BOT_S,
  DURACAO_PISCA_VOLTA_ORB_S,
  FPS_MOEDA,
  ESCALA_MOEDA,
} from '../constants';
import type { BauPixArena, DisparoBoss, EstadoArenaBoss, MiniBotZombie, MoedaArena, TipoTelaBoss } from '../entities/arena-boss';
import {
  ALTURA_JOGADOR,
  LARGURA_JOGADOR,
  type EstadoJogador,
  type PoseMago,
} from '../entities/jogador';
import {
  criarOrb,
  posicionarOrbAcimaDaCabeca,
  type EstadoOrb,
} from '../entities/orb';
import type { ResultadoRun } from '../entities/mundo';
import type { ProgressoRunSalvo } from '../systems/persistencia-invasao';
import { vidasMaximas } from '../systems/pontuacao';
import {
  atualizarAnzolArena,
  atualizarBarraBrecha,
  atualizarDisparoArena,
  atualizarDropsArena,
  atualizarHahahaBoss,
  atualizarHitBoss,
  atualizarInvencivelArena,
  atualizarJogadorNoPiso,
  atualizarSequestroOrb,
  atualizarStunPatch,
  atualizarTempoMortoArena,
  criarArenaInicial,
  iniciarVitoriaArena,
  pedirDisparoArena,
  posicionarJogadorNaArena,
  tentarColetarPatchQueda,
  verificarHitVirus,
  atualizarMiniBotsZombie,
  atualizarRajadaZombie,
  atualizarMoedasArenaCapitao,
  atualizarBauCapitao,
  atualizarRouboCapitao,
  orbEstaForaDaCabeca,
} from '../systems/arena-boss';
import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import { calcularLayoutBoss, type LayoutBossTela } from '../systems/layout-boss';
import {
  jaViuTutorialHitBox,
  jaViuTutorialPatch,
  jaViuTutorialTapBoss,
  marcarTutorialHitBoxVisto,
  marcarTutorialPatchVisto,
  marcarTutorialTapBossVisto,
  jaViuTutorialRouboCapitao,
  marcarTutorialRouboCapitaoVisto,
} from '../systems/persistencia-invasao';
import { tocarSomDisparo, tocarSomDisparoInfectado, tocarSomHahaha, tocarSomHihihi, tocarSomHitAcerto, tocarSomMorto, tocarSomPatch, tocarSomMoeda, tocarSomMoedaPirata } from '../systems/audio-jogo';
import { gorroEquipado, orbEquipada } from '../systems/skins';
import { usarTilt } from '../systems/tilt';
import { FONTE_PIXEL } from '../tipografia';

const DT_MAXIMO = 1 / 30;
const ESCALA_MAGO_VITORIA = 2.8;
/** Folga mínima no Android se o inset vier 0 (edge-to-edge + 3 botões). */
const INSET_ANDROID_MINIMO = 48;
/** Recua a URL 2 mm à esquerda para alinhar no recorte do marco. */
const DESLOCA_URL_ESQ_PX = 2 * (160 / 25.4);

function insetInferiorSeguro(bottom: number): number {
  if (bottom > 0) return bottom;
  return Platform.OS === 'android' ? INSET_ANDROID_MINIMO : 0;
}

/** Separa o nome do host para destacar em negrito na faixa da URL. */
function partesUrlBoss(url: string): { prefixo: string; nome: string; resto: string } {
  const match = /^(https?:\/\/)([^/]+)(.*)$/.exec(url);
  if (!match) return { prefixo: '', nome: url, resto: '' };
  return { prefixo: match[1], nome: match[2], resto: match[3] };
}

function esperarMs(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

/** Fade sem setState no callback do Animated (isso derruba o useInteractionEffect). */
async function sumirAviso(
  opacidade: Animated.Value,
  setMostrar: (valor: boolean) => void,
  cancelado: () => boolean,
  duracaoS = DURACAO_TUTORIAL_ARENA_S,
): Promise<void> {
  await esperarMs(duracaoS * 1000);
  if (cancelado()) return;
  Animated.timing(opacidade, {
    toValue: 0,
    duration: 450,
    useNativeDriver: true,
  }).start();
  await esperarMs(450);
  if (!cancelado()) setMostrar(false);
}

function opacidadePiscaAviso(): number {
  return Math.floor(Date.now() / 280) % 2 === 0 ? 1 : 0.18;
}

/** Tap: raios curtos nas pontas, miolo bem aberto. */
const TAMANHO_ESTRELA_TAP = 52;
const LARGURA_RAIO_TAP = 5;
const LARGURA_AVISO_TAP_PX = 180;
const MARGEM_FAIXA_VIRUS_PX = 24;
const LARGURA_AVISO_PATCH_PX = 140;

function SimboloTapEstrela() {
  const tamanho = TAMANHO_ESTRELA_TAP;
  return (
    <View style={{ width: tamanho, height: tamanho }}>
      {[0, 45, 90, 135].map((graus) => (
        <View
          key={graus}
          style={{
            position: 'absolute',
            left: 0,
            top: tamanho / 2 - 1,
            width: tamanho,
            height: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            transform: [{ rotate: `${graus}deg` }],
          }}
        >
          <View style={estilos.raioTap} />
          <View style={estilos.raioTap} />
        </View>
      ))}
    </View>
  );
}

/** Centro da arena jogável — mais baixo que o retrato do boss. */
function posicaoAvisoTap(layout: LayoutBossTela): { left: number; top: number } {
  const a = layout.arena;
  return {
    left: a.x + a.w / 2,
    top: a.y + a.h * 0.42,
  };
}

const POSE_POR_ESTADO: Record<PoseMago, ImagemEstatica> = {
  agachado: MAGO_AGACHADO,
  parado: MAGO_PARADO,
  ar: MAGO_AR,
  muerto: MAGO_MORTO,
};

interface Props {
  bossUrl: string;
  encantoAtivo: boolean;
  progresso: ProgressoRunSalvo;
  /** Quem a arena mostra (sprites + ataque especial). */
  tipoTela?: TipoTelaBoss;
  /** Último boss da demo (fase 3 / 900 m): após a vitória, fala de encerramento + Sair. */
  ehFimDaDemo?: boolean;
  /** Primeiro boss da demo: tutorial de tap (uma vez). */
  ehPrimeiroBoss?: boolean;
  aoMorrer: (resultado: ResultadoRun) => void;
  aoVencer: (progresso: ProgressoRunSalvo) => void;
  aoSairAoInicio?: () => void;
}

export function BossArenaScreen({
  bossUrl,
  encantoAtivo,
  progresso,
  tipoTela = 'phishing_man',
  ehFimDaDemo = false,
  ehPrimeiroBoss = false,
  aoMorrer,
  aoVencer,
  aoSairAoInicio,
}: Props) {
  const { t } = useTextosJogo();
  const insets = useSafeAreaInsets();
  const insetBottom = insetInferiorSeguro(insets.bottom);
  const partesUrl = partesUrlBoss(bossUrl);
  const [caixa, setCaixa] = useState<{ largura: number; altura: number } | null>(null);
  const [mostrarVitoria, setMostrarVitoria] = useState(false);
  const [textoVitoria, setTextoVitoria] = useState(t.boss.vitoria);
  const [mostrarSaidaDemo, setMostrarSaidaDemo] = useState(false);
  const vitoriaRef = useRef(false);
  const jaChamouVencerRef = useRef(false);
  const [mostrarTutorialTap, setMostrarTutorialTap] = useState(false);
  const [mostrarTutorialHitBox, setMostrarTutorialHitBox] = useState(false);
  const [mostrarTutorialPatch, setMostrarTutorialPatch] = useState(false);
  const [mostrarTutorialRoubo, setMostrarTutorialRoubo] = useState(false);
  const [cenaPronta, setCenaPronta] = useState(false);
  const opacidadeCena = useRef(new Animated.Value(0)).current;
  const [posicaoTap, setPosicaoTap] = useState<{ left: number; top: number } | null>(
    null,
  );
  const mostrarTutorialTapRef = useRef(false);
  const posicaoTapRef = useRef<{ left: number; top: number } | null>(null);
  mostrarTutorialTapRef.current = mostrarTutorialTap;
  posicaoTapRef.current = posicaoTap;
  const opacidadeTutorial = useRef(new Animated.Value(0)).current;
  const opacidadeHitBox = useRef(new Animated.Value(0)).current;
  const opacidadePatch = useRef(new Animated.Value(0)).current;
  const opacidadeRoubo = useRef(new Animated.Value(0)).current;
  const jaMostrouHitBoxRef = useRef(false);
  const jaMostrouPatchRef = useRef(false);
  const jaMostrouRouboRef = useRef(false);

  const layout = useMemo(() => {
    if (!caixa) return calcularLayoutBoss(1, 1);
    return calcularLayoutBoss(caixa.largura, caixa.altura);
  }, [caixa]);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const tiltRef = usarTilt();
  const arenaRef = useRef<EstadoArenaBoss | null>(null);
  const jogadorRef = useRef<EstadoJogador | null>(null);
  const orbRef = useRef<EstadoOrb | null>(null);

  const tamStun = encantoAtivo ? ORB_STATICO_OURO_TAMANHO : ORB_STATICO_TAMANHO;
  const larguraOrbStun = tamStun.largura * ESCALA_SPRITE;
  const alturaOrbStun = tamStun.altura * ESCALA_SPRITE;

  function aoMedirPalco(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    setCaixa((atual) => {
      if (atual && atual.largura === width && atual.altura === height) return atual;
      return { largura: width, altura: height };
    });
  }

  if (caixa && cenaPronta && arenaRef.current === null) {
    arenaRef.current = criarArenaInicial(
      layout,
      encantoAtivo,
      progresso.vidas,
      tipoTela,
      progresso.moedasColetadas,
    );
    jogadorRef.current = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      direcao: 'direita',
      pose: 'parado',
      tempoPose: 0,
    };
    posicionarJogadorNaArena(jogadorRef.current, layout, arenaRef.current);
    orbRef.current = criarOrb(jogadorRef.current);
    posicionarOrbAcimaDaCabeca(
      orbRef.current,
      jogadorRef.current,
      larguraOrbStun,
      alturaOrbStun,
    );
  }

  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setCenaPronta(true);
      Animated.timing(opacidadeCena, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }, 300);
    return () => clearTimeout(id);
  }, [opacidadeCena]);

  useEffect(() => {
    if (!caixa || !cenaPronta) return;
    let ativo = true;
    let quadroId = 0;
    let tempoAnterior = 0;

    function passo(tempo: number) {
      if (!ativo) return;
      // Agenda o próximo quadro ANTES do setState — igual à run.
      // Se o redraw cancelar o effect, o loop antigo morre no `ativo`,
      // e o effect novo sobe outro. Sem isso a luta congela no 1º tick.
      quadroId = requestAnimationFrame(passo);

      if (tempoAnterior === 0) tempoAnterior = tempo;
      const dt = Math.min((tempo - tempoAnterior) / 1000, DT_MAXIMO);
      tempoAnterior = tempo;
      if (!(dt > 0)) return;

      const arena = arenaRef.current;
      const jogador = jogadorRef.current;
      const orb = orbRef.current;
      const lay = layoutRef.current;
      if (!arena || !jogador || !orb) return;

      if (arena.tempoMortoS > 0) {
        atualizarTempoMortoArena(arena, jogador, lay, dt);
      } else if (arena.fase === 'vitoria') {
        ativo = false;
        return;
      } else if (arena.fase === 'janela_patch') {
        atualizarJogadorNoPiso(
          jogador,
          tiltRef.current,
          dt,
          lay,
          VELOCIDADE_TILT_STUN_MAX,
          SENSIBILIDADE_TILT_STUN,
        );
        const tokenHahahaAntes = arena.tokenHahahaBoss;
        atualizarAnzolArena(arena, lay, orb, larguraOrbStun, alturaOrbStun, dt);
        if (atualizarMiniBotsZombie(arena, lay, orb, larguraOrbStun, alturaOrbStun, dt)) {
          tocarSomHihihi();
        }
        const rajada = atualizarRajadaZombie(
          arena,
          lay,
          jogador,
          orb,
          larguraOrbStun,
          alturaOrbStun,
          dt,
        );
        for (let i = 0; i < rajada.tirosNascidos; i++) tocarSomDisparoInfectado();
        if (rajada.hitMago) tocarSomMorto();
        atualizarSequestroOrb(
          arena,
          orb,
          jogador,
          larguraOrbStun,
          alturaOrbStun,
          dt,
        );
        atualizarStunPatch(arena, lay, jogador, dt);
        atualizarBarraBrecha(arena, lay, dt);
        const avisoTap = posicaoTapRef.current;
        const faixaVirus =
          mostrarTutorialTapRef.current && avisoTap
            ? {
                x: avisoTap.left - LARGURA_AVISO_TAP_PX / 2 - MARGEM_FAIXA_VIRUS_PX,
                largura: LARGURA_AVISO_TAP_PX + MARGEM_FAIXA_VIRUS_PX * 2,
              }
            : undefined;
        atualizarDropsArena(arena, lay, dt, faixaVirus);
        const moedasCap = atualizarMoedasArenaCapitao(arena, lay, jogador, dt);
        if (moedasCap.coletouBoa) tocarSomMoeda();
        if (moedasCap.coletouPirata) tocarSomMoedaPirata();
        atualizarBauCapitao(arena, lay, jogador, dt);
        atualizarRouboCapitao(arena, dt);
        if (tentarColetarPatchQueda(jogador, arena, lay, orb)) tocarSomPatch();
        atualizarInvencivelArena(arena, dt);
        if (verificarHitVirus(jogador, arena, lay)) tocarSomMorto();
        const tokenHitAntes = arena.tokenHitBoss;
        const tirosNascidos = atualizarDisparoArena(
          arena,
          lay,
          orb,
          larguraOrbStun,
          dt,
        );
        for (let i = 0; i < tirosNascidos; i++) tocarSomDisparo();
        for (let i = tokenHitAntes; i < arena.tokenHitBoss; i++) {
          tocarSomHitAcerto();
        }
        for (let i = tokenHahahaAntes; i < arena.tokenHahahaBoss; i++) {
          tocarSomHahaha();
        }
        atualizarHitBoss(arena, dt);
        atualizarHahahaBoss(arena, dt);
      }

      if (arena.bossHp <= 0 && !vitoriaRef.current) {
        vitoriaRef.current = true;
        iniciarVitoriaArena(arena);
        if (ehFimDaDemo) {
          setMostrarVitoria(true);
        } else if (!jaChamouVencerRef.current) {
          jaChamouVencerRef.current = true;
          aoVencer({
            ...progresso,
            vidas: arena.vidas,
            moedasColetadas: arena.moedasRun ?? progresso.moedasColetadas,
          });
        }
        ativo = false;
        setTick((t) => t + 1);
        return;
      }

      if (!arena.vivo) {
        ativo = false;
        aoMorrer({
          altitudeMetros: progresso.altitudePx / PX_POR_METRO,
          moedas: arena.moedasRun ?? progresso.moedasColetadas,
        });
        return;
      }

      setTick((t) => t + 1);
    }

    quadroId = requestAnimationFrame(passo);
    return () => {
      ativo = false;
      cancelAnimationFrame(quadroId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caixa, cenaPronta]);

  useEffect(() => {
    if (!ehPrimeiroBoss || !caixa) return;
    let cancelado = false;
    (async () => {
      const jaViu = await jaViuTutorialTapBoss();
      if (cancelado || jaViu) return;
      await marcarTutorialTapBossVisto();
      if (cancelado) return;
      setPosicaoTap(posicaoAvisoTap(layout));
      setMostrarTutorialTap(true);
      opacidadeTutorial.setValue(1);
      await sumirAviso(
        opacidadeTutorial,
        setMostrarTutorialTap,
        () => cancelado,
      );
    })();
    return () => {
      cancelado = true;
    };
  }, [caixa, ehPrimeiroBoss, layout, opacidadeTutorial]);

  const temBarra = !!arenaRef.current?.barra;
  const temPatch = !!arenaRef.current?.patch;
  const patchAtual = arenaRef.current?.patch;
  const temAvisoRoubo =
    tipoTela === 'capitao_pirata' &&
    !!arenaRef.current?.avisoRouboPendente &&
    !!patchAtual &&
    patchAtual.id !== (arenaRef.current?.idPatchAoIniciarRoubo ?? -1);

  useEffect(() => {
    if (!temBarra) {
      setMostrarTutorialHitBox(false);
      return;
    }
    if (jaMostrouHitBoxRef.current) return;
    let cancelado = false;
    (async () => {
      const jaViu = await jaViuTutorialHitBox();
      if (cancelado) return;
      if (jaViu) {
        jaMostrouHitBoxRef.current = true;
        return;
      }
      jaMostrouHitBoxRef.current = true;
      await marcarTutorialHitBoxVisto();
      if (cancelado) return;
      setMostrarTutorialHitBox(true);
      opacidadeHitBox.setValue(1);
      await sumirAviso(opacidadeHitBox, setMostrarTutorialHitBox, () => cancelado);
    })();
    return () => {
      cancelado = true;
    };
  }, [temBarra, opacidadeHitBox]);

  useEffect(() => {
    if (!temPatch) {
      setMostrarTutorialPatch(false);
      return;
    }
    if (tipoTela === 'capitao_pirata') {
      return;
    }
    if (jaMostrouPatchRef.current) return;
    let cancelado = false;
    (async () => {
      const jaViu = await jaViuTutorialPatch();
      if (cancelado) return;
      if (jaViu) {
        jaMostrouPatchRef.current = true;
        return;
      }
      jaMostrouPatchRef.current = true;
      await marcarTutorialPatchVisto();
      if (cancelado) return;
      setMostrarTutorialPatch(true);
      opacidadePatch.setValue(1);
      await sumirAviso(opacidadePatch, setMostrarTutorialPatch, () => cancelado);
    })();
    return () => {
      cancelado = true;
    };
  }, [temPatch, opacidadePatch, tipoTela]);

  useEffect(() => {
    if (!temAvisoRoubo) return;
    if (jaMostrouRouboRef.current) return;
    let cancelado = false;
    (async () => {
      const jaViu = await jaViuTutorialRouboCapitao();
      if (cancelado) return;
      if (jaViu) {
        jaMostrouRouboRef.current = true;
        if (arenaRef.current) arenaRef.current.avisoRouboPendente = false;
        return;
      }
      jaMostrouRouboRef.current = true;
      await marcarTutorialRouboCapitaoVisto();
      if (cancelado) return;
      setMostrarTutorialRoubo(true);
      opacidadeRoubo.setValue(1);
      await sumirAviso(opacidadeRoubo, setMostrarTutorialRoubo, () => cancelado);
      if (!cancelado && arenaRef.current) {
        arenaRef.current.avisoRouboPendente = false;
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [temAvisoRoubo, opacidadeRoubo]);

  useEffect(() => {
    if (!mostrarVitoria) return;
    const id = setTimeout(() => {
      if (jaChamouVencerRef.current) return;
      if (ehFimDaDemo) {
        setTextoVitoria(t.boss.fimDemo);
        setMostrarSaidaDemo(true);
        return;
      }
      jaChamouVencerRef.current = true;
      aoVencer({
        ...progresso,
        vidas: arenaRef.current?.vidas ?? progresso.vidas,
        moedasColetadas:
          arenaRef.current?.moedasRun ?? progresso.moedasColetadas,
      });
    }, SEGUNDOS_RETORNO * 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostrarVitoria]);

  useEffect(() => {
    if (mostrarSaidaDemo) {
      setTextoVitoria(t.boss.fimDemo);
    } else {
      setTextoVitoria(t.boss.vitoria);
    }
  }, [t, mostrarSaidaDemo]);

  const arena = arenaRef.current;
  const jogador = jogadorRef.current;
  const orb = orbRef.current;
  const retrato =
    tipoTela === 'zombie_net'
      ? {
          idle: ZOMBIE_NET_FRAMES,
          hit: ZOMBIE_NET_HIT_FRAMES,
          tamIdle: ZOMBIE_NET_TAMANHO,
          tamHit: ZOMBIE_NET_HIT_TAMANHO,
          temHahaha: false,
          hahaha: PISHING_MAN_HAHAHA,
        }
      : tipoTela === 'capitao_pirata'
        ? {
            idle: CAPITAN_PIX_FRAMES,
            hit: CAPITAN_PIX_FRAMES,
            tamIdle: CAPITAN_PIX_TAMANHO,
            tamHit: CAPITAN_PIX_TAMANHO,
            temHahaha: true,
            hahaha: CAPITAN_PIX_HAHAHA,
          }
        : {
            idle: PISHING_MAN_FRAMES,
            hit: PISHING_MAN_HIT_FRAMES,
            tamIdle: PISHING_MAN_TAMANHO,
            tamHit: PISHING_MAN_HIT_TAMANHO,
            temHahaha: true,
            hahaha: PISHING_MAN_HAHAHA,
          };
  const escalaBoss =
    Math.min(
      layout.bossBox.w / retrato.tamIdle.largura,
      layout.bossBox.h / retrato.tamIdle.altura,
    ) +
    AUMENTO_BOSS_PX / retrato.tamIdle.altura -
    (tipoTela === 'zombie_net'
      ? REDUCAO_ZOMBIE_NET_PX / retrato.tamIdle.altura
      : tipoTela === 'capitao_pirata'
        ? REDUCAO_CAPITAO_PIX_PX / retrato.tamIdle.altura
        : 0);
  const larguraPalco = caixa?.largura ?? 0;
  const alturaPalco = caixa?.altura ?? 0;
  const orbNoAnzol = !!arena && orbEstaForaDaCabeca(arena);
  const orbEscondidaComBot =
    !!arena && arena.faseInfeccao === 'bot_sumindo';
  const opacidadeOrb = orbEscondidaComBot
    ? 0
    : arena && arena.faseInfeccao === 'pisca_volta' && arena.tempoPiscaSoltaOrbS > 0
      ? Math.floor(
          (DURACAO_PISCA_VOLTA_ORB_S - arena.tempoPiscaSoltaOrbS) / 0.2,
        ) % 2 === 0
        ? 1
        : 0.12
    : arena && arena.tempoPiscaSoltaOrbS > 0
      ? arena.tempoPiscaSoltaOrbS < 0.15
        ? 0
        : Math.floor(Date.now() / 70) % 2 === 0
          ? 0.12
          : 1
      : 1;

  return (
    <View style={[estilos.raiz, { paddingBottom: insetBottom }]}>
      <Pressable
        style={estilos.palco}
        onLayout={aoMedirPalco}
        onPress={() => {
          if (!cenaPronta) return;
          if (arenaRef.current) pedirDisparoArena(arenaRef.current);
        }}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: opacidadeCena }]}
          pointerEvents={cenaPronta ? 'box-none' : 'none'}
        >
        {caixa && arena && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: larguraPalco,
              height: layout.pisoY,
              overflow: 'hidden',
            }}
            pointerEvents="none"
          >
            {arena.patch && (
              <Image
                source={PATCH_FRAMES[0]}
                style={{
                  position: 'absolute',
                  left: arena.patch.x,
                  top: arena.patch.y,
                  width: PATCH_TAMANHO.largura * ESCALA_PATCH,
                  height: PATCH_TAMANHO.altura * ESCALA_PATCH,
                }}
                resizeMode="stretch"
                resizeMethod="scale"
                pointerEvents="none"
              />
            )}

            {arena.virus.map((virus) => (
              <View
                key={virus.id}
                style={{
                  position: 'absolute',
                  left: virus.x,
                  top: virus.y,
                  opacity:
                    virus.hits > 0 && Math.floor(Date.now() / 80) % 2 === 0
                      ? 0.3
                      : 1,
                }}
                pointerEvents="none"
              >
                <FramesAnimator
                  frames={VIRUS_BOSS_FRAMES}
                  fps={FPS_VIRUS_BOSS}
                  larguraFrame={VIRUS_BOSS_TAMANHO.largura}
                  alturaFrame={VIRUS_BOSS_TAMANHO.altura}
                  escala={ESCALA_VIRUS_BOSS}
                />
              </View>
            ))}

            {(arena.disparosInfectados ?? []).map((disparo) => (
              <SpriteDisparoInfectado
                key={disparo.id}
                disparo={disparo}
                encanto={encantoAtivo}
              />
            ))}

            {(arena.moedasArena ?? []).map((moeda) => (
              <SpriteMoedaArena key={moeda.id} moeda={moeda} />
            ))}

            {arena.bauPix && (
              <SpriteBauPix
                bau={arena.bauPix}
                textoClique={t.boss.bauClique}
                textoAqui={t.boss.bauAqui}
              />
            )}
          </View>
        )}

        {caixa && arena && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: larguraPalco,
              height: alturaPalco,
            }}
            pointerEvents="none"
          >
            {(arena.miniBots ?? []).map((bot) => (
              <SpriteMiniBotZombie key={bot.id} bot={bot} />
            ))}
          </View>
        )}

        {caixa && (
          <Image
            source={PISO_TELA_BOSS.imagem}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: larguraPalco,
              height: alturaPalco,
            }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
        )}

        {caixa && arena && jogador && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: larguraPalco,
              height: alturaPalco,
            }}
            pointerEvents="none"
          >
            {orb && !orbNoAnzol && (
              <View
                style={{
                  position: 'absolute',
                  left: orb.x,
                  top: orb.y,
                  opacity: opacidadeOrb,
                }}
              >
                <SpriteOrbArena
                  encanto={encantoAtivo}
                  larguraCaixa={larguraOrbStun}
                  alturaCaixa={alturaOrbStun}
                />
              </View>
            )}

            <SpriteMagoBoss
              jogador={jogador}
              animarIntro
              piscar={
                !!arena && arena.tempoInvencivelS > 0 && jogador.pose !== 'muerto'
              }
            />
          </View>
        )}

        {caixa && (
          <View
            style={{
              position: 'absolute',
              left: layout.bossBox.x,
              top: layout.bossBox.y,
              width: layout.bossBox.w,
              height: layout.bossBox.h,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
            pointerEvents="none"
          >
            <FundoGlitchAnimado />
            {!mostrarVitoria && arena && arena.tempoHitBossS > 0 && (
              <FramesAnimator
                key={`hit-${arena.tokenHitBoss}`}
                frames={retrato.hit}
                fps={FPS_PISHING_MAN_HIT}
                larguraFrame={retrato.tamHit.largura}
                alturaFrame={retrato.tamHit.altura}
                escala={escalaBoss}
                comTomDano
              />
            )}
            {!mostrarVitoria &&
              retrato.temHahaha &&
              arena &&
              arena.tempoHitBossS <= 0 &&
              arena.tempoHahahaBossS > 0 && (
                <View
                  key={`hahaha-${arena.tokenHahahaBoss}`}
                  style={{ transform: [{ translateY: DESCIDA_IDLE_BOSS_PX }] }}
                >
                  <SpriteAnimator
                    sheet={retrato.hahaha}
                    fps={FPS_PISHING_MAN_HAHAHA}
                    escala={escalaBoss}
                    loop
                    frameInicial={FRAME_INICIAL_HAHAHA_BOSS}
                    maxAvancos={PASSOS_HAHAHA_BOSS - 1}
                  />
                </View>
              )}
            {!mostrarVitoria &&
              arena &&
              arena.tempoHitBossS <= 0 &&
              (arena.tempoHahahaBossS <= 0 || !retrato.temHahaha) && (
                <View style={{ transform: [{ translateY: DESCIDA_IDLE_BOSS_PX }] }}>
                  <FramesAnimator
                    frames={retrato.idle}
                    fps={FPS_PISHING_MAN}
                    larguraFrame={retrato.tamIdle.largura}
                    alturaFrame={retrato.tamIdle.altura}
                    escala={escalaBoss}
                  />
                </View>
              )}
            {arena && !mostrarVitoria && (
              <Text
                style={[
                  estilos.hpBoss,
                  arena.tempoHitBossS > 0 &&
                  Math.floor(arena.tempoHitBossS * 10) % 2 === 0
                    ? estilos.hpBossHit
                    : null,
                ]}
                pointerEvents="none"
              >
                {arena.bossHp}
              </Text>
            )}
          </View>
        )}

        {caixa && (
          <Image
            source={MARCO_TELA_BOSS.imagem}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: larguraPalco,
              height: alturaPalco,
            }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
        )}

        {caixa && arena?.barra && (
          <View
            style={{
              position: 'absolute',
              left: arena.barra.x,
              top: arena.barra.y,
            }}
            pointerEvents="none"
          >
            <FramesAnimator
              frames={HIT_BOX_BOSS_FRAMES}
              fps={FPS_HIT_BOX_BOSS}
              larguraFrame={HIT_BOX_BOSS_TAMANHO.largura}
              alturaFrame={HIT_BOX_BOSS_TAMANHO.altura}
            />
          </View>
        )}

        {caixa && arena?.anzol && (
          <AnzolComLinha anzol={arena.anzol} />
        )}

        {caixa && orb && orbNoAnzol && (
          <View
            style={{
              position: 'absolute',
              left: orb.x,
              top: orb.y,
              opacity: opacidadeOrb,
            }}
            pointerEvents="none"
          >
            <SpriteOrbArena
              encanto={encantoAtivo}
              larguraCaixa={larguraOrbStun}
              alturaCaixa={alturaOrbStun}
            />
          </View>
        )}

        {caixa &&
          arena?.disparos.map((disparo) => (
            <SpriteDisparoBoss
              key={disparo.id}
              disparo={disparo}
              encanto={encantoAtivo}
            />
          ))}

        {caixa && arena && (
          <CoracoesArena
            vidas={arena.vidas}
            vidasMaximas={vidasMaximas()}
            top={layout.tetoY + 4}
            right={layout.arena.x + layout.arena.w - 6}
          />
        )}

        {caixa && arena && tipoTela === 'capitao_pirata' && (
          <ContadorMoedasArena
            moedas={arena.moedasRun}
            hitMoedas={(arena.tempoHitMoedasS ?? 0) > 0}
            hitAtivo={
              (arena.tempoHitMoedasS ?? 0) > 0 &&
              Math.floor((arena.tempoHitMoedasS ?? 0) * 10) % 2 === 0
            }
            top={layout.tetoY + 4}
            left={layout.arena.x + 6}
          />
        )}

        {caixa && (
          <View
            style={{
              position: 'absolute',
              left: layout.url.x - DESLOCA_URL_ESQ_PX,
              top: layout.url.y,
              width: layout.url.w,
              height: layout.url.h,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 8,
            }}
            pointerEvents="none"
          >
            <Text
              style={estilos.url}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {partesUrl.prefixo}
              <Text style={estilos.urlNome}>{partesUrl.nome}</Text>
              {partesUrl.resto}
            </Text>
          </View>
        )}

        {mostrarTutorialHitBox && arena?.barra && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: arena.barra.x + arena.barra.largura / 2 - 90,
              top: arena.barra.y - 44,
              width: 180,
              alignItems: 'center',
              opacity: opacidadeHitBox,
              zIndex: 12,
            }}
          >
            <Text style={estilos.textoTutorial}>{t.boss.tutorialHitBox}</Text>
            <View style={estilos.setaParaBaixo} />
          </Animated.View>
        )}

        {mostrarTutorialRoubo && arena?.patch && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: Math.max(
                layout.arena.x,
                Math.min(
                  arena.patch.x + arena.patch.largura / 2 - LARGURA_AVISO_PATCH_PX / 2,
                  layout.arena.x + layout.arena.w - LARGURA_AVISO_PATCH_PX,
                ),
              ),
              top: arena.patch.y - 78,
              width: LARGURA_AVISO_PATCH_PX,
              alignItems: 'center',
              opacity: opacidadeRoubo,
              zIndex: 12,
            }}
          >
            <View style={{ opacity: opacidadePiscaAviso(), alignItems: 'center' }}>
              <Text style={estilos.textoTutorialDuasLinhas}>
                {t.boss.tutorialRoubo}
              </Text>
              <View style={estilos.setaParaBaixo} />
            </View>
          </Animated.View>
        )}

        {mostrarTutorialPatch && arena?.patch && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: Math.max(
                layout.arena.x,
                Math.min(
                  arena.patch.x + arena.patch.largura / 2 - LARGURA_AVISO_PATCH_PX / 2,
                  layout.arena.x + layout.arena.w - LARGURA_AVISO_PATCH_PX,
                ),
              ),
              top: arena.patch.y - 68,
              width: LARGURA_AVISO_PATCH_PX,
              alignItems: 'center',
              opacity: opacidadePatch,
              zIndex: 12,
            }}
          >
            <View style={{ opacity: opacidadePiscaAviso(), alignItems: 'center' }}>
              <Text style={estilos.textoTutorialDuasLinhas}>
                {t.boss.tutorialPatch}
              </Text>
              <View style={estilos.setaParaBaixo} />
            </View>
          </Animated.View>
        )}

        {mostrarTutorialTap && posicaoTap && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: posicaoTap.left,
              top: posicaoTap.top,
              width: LARGURA_AVISO_TAP_PX,
              marginLeft: -LARGURA_AVISO_TAP_PX / 2,
              alignItems: 'center',
              opacity: opacidadeTutorial,
              zIndex: 12,
            }}
          >
            <Text style={estilos.textoTutorial}>{t.boss.tutorialTap}</Text>
            <View style={{ marginTop: 8, opacity: opacidadePiscaAviso() }}>
              <SimboloTapEstrela />
            </View>
          </Animated.View>
        )}
        </Animated.View>
      </Pressable>

      {mostrarVitoria && (
        <View style={estilos.overlayVitoria}>
          <FundoGlitchAnimado />
          <View style={estilos.conteudoVitoria} pointerEvents="box-none">
            <Image
              source={GRAY_MAGO_AVISO.imagem}
              style={{
                width: GRAY_MAGO_AVISO.largura * ESCALA_MAGO_VITORIA,
                height: GRAY_MAGO_AVISO.altura * ESCALA_MAGO_VITORIA,
              }}
              resizeMode="stretch"
              resizeMethod="scale"
            />
            <View style={estilos.espacoBalaoVitoria} pointerEvents="none">
              <BalaoFala texto={textoVitoria} compacto={mostrarSaidaDemo} />
            </View>
            {mostrarSaidaDemo && aoSairAoInicio && (
              <View style={estilos.areaSairDemo}>
                <BotaoMadeira
                  rotulo={t.boss.sair}
                  aoPressionar={aoSairAoInicio}
                  modelo="rpg"
                  escala={ESCALA_BOTAO_RPG}
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function AnzolComLinha({
  anzol,
}: {
  anzol: NonNullable<EstadoArenaBoss['anzol']>;
}) {
  const wCarrinho = CARRINHO_ANZOL.largura * ESCALA_CARRINHO_ANZOL;
  const hCarrinho = CARRINHO_ANZOL.altura * ESCALA_CARRINHO_ANZOL;
  const wAnzol = ANZOL_PISHING.largura * ESCALA_ANZOL;
  const hAnzol = ANZOL_PISHING.altura * ESCALA_ANZOL;
  const xLinha = anzol.xCarrinho + wCarrinho / 2 - LARGURA_LINHA_ANZOL / 2;
  const yTopoLinha = anzol.yCarrinho + hCarrinho * 0.55;
  const yBaseLinha = anzol.yAnzol + 4;
  const alturaLinha = Math.max(2, yBaseLinha - yTopoLinha);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        style={{
          position: 'absolute',
          left: xLinha,
          top: yTopoLinha,
          width: LARGURA_LINHA_ANZOL,
          height: alturaLinha,
          backgroundColor: COR_LINHA_ANZOL,
          borderRadius: 1,
        }}
      />
      <Image
        source={CARRINHO_ANZOL.imagem}
        style={{
          position: 'absolute',
          left: anzol.xCarrinho,
          top: anzol.yCarrinho,
          width: wCarrinho,
          height: hCarrinho,
        }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
      <Image
        source={ANZOL_PISHING.imagem}
        style={{
          position: 'absolute',
          left: anzol.xAnzol,
          top: anzol.yAnzol,
          width: wAnzol,
          height: hAnzol,
        }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
    </View>
  );
}

function milimetrosEmPx(mm: number): number {
  return Math.round((mm / 25.4) * 160);
}

const TAMANHO_CORACAO_PX = milimetrosEmPx(5);
const FOLGA_ENTRE_CORACOES_PX = milimetrosEmPx(1);
const PNG_CORACAO = { largura: 64, altura: 65, l: 15, t: 18, r: 49, b: 49 };
const CONTEUDO_W = PNG_CORACAO.r - PNG_CORACAO.l;
const CONTEUDO_H = PNG_CORACAO.b - PNG_CORACAO.t;
const ESCALA_CORTE = TAMANHO_CORACAO_PX / CONTEUDO_W;

/** Corações no canto superior direito da arena, abaixo do box do boss. */
function CoracoesArena({
  vidas,
  vidasMaximas: maxSlots,
  top,
  right,
}: {
  vidas: number;
  vidasMaximas: number;
  top: number;
  right: number;
}) {
  const coracoes = Math.max(0, Math.floor(vidas));
  const slots = Math.max(coracoes, Math.floor(maxSlots), 1);
  const larguraFaixa =
    slots * TAMANHO_CORACAO_PX + Math.max(0, slots - 1) * FOLGA_ENTRE_CORACOES_PX;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top,
        left: right - larguraFaixa,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {Array.from({ length: slots }, (_, indice) => (
        <View
          key={`coracao-boss-${indice}`}
          style={{
            width: TAMANHO_CORACAO_PX,
            height: Math.round(CONTEUDO_H * ESCALA_CORTE),
            overflow: 'hidden',
            marginLeft: indice === 0 ? 0 : FOLGA_ENTRE_CORACOES_PX,
            opacity: indice < coracoes ? 1 : 0.28,
          }}
        >
          <Image
            source={CORAZON.imagem}
            style={{
              width: Math.round(PNG_CORACAO.largura * ESCALA_CORTE),
              height: Math.round(PNG_CORACAO.altura * ESCALA_CORTE),
              marginLeft: Math.round(-PNG_CORACAO.l * ESCALA_CORTE),
              marginTop: Math.round(-PNG_CORACAO.t * ESCALA_CORTE),
            }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
        </View>
      ))}
    </View>
  );
}

function ContadorMoedasArena({
  moedas,
  hitMoedas,
  hitAtivo,
  top,
  left,
}: {
  moedas: number;
  hitMoedas: boolean;
  hitAtivo: boolean;
  top: number;
  left: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top,
        left,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <FramesAnimator
        frames={MOEDA_PLATAFORMA_FRAMES}
        fps={FPS_MOEDA}
        larguraFrame={MOEDA_PLATAFORMA_TAMANHO.largura}
        alturaFrame={MOEDA_PLATAFORMA_TAMANHO.altura}
        escala={ESCALA_MOEDA_HUD_ARENA}
        comTomDano={hitMoedas}
      />
      <Text
        style={[
          {
            fontFamily: FONTE_PIXEL,
            color: '#ffd76a',
            fontSize: TAMANHO_FONTE_MOEDAS_ARENA,
            textShadowColor: '#000',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 0,
          },
          hitAtivo ? { color: '#ff2a2a' } : null,
        ]}
      >
        {Math.max(0, Math.floor(moedas))}
      </Text>
    </View>
  );
}

function SpriteMoedaArena({ moeda }: { moeda: MoedaArena }) {
  const frames = moeda.pirata ? MOEDA_PIRATA_FRAMES : MOEDA_PLATAFORMA_FRAMES;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: moeda.x,
        top: moeda.y,
        width: moeda.largura,
        height: moeda.altura,
      }}
    >
      <FramesAnimator
        frames={frames}
        fps={FPS_MOEDA}
        larguraFrame={MOEDA_PLATAFORMA_TAMANHO.largura}
        alturaFrame={MOEDA_PLATAFORMA_TAMANHO.altura}
        escala={ESCALA_MOEDA}
      />
    </View>
  );
}

function SpriteBauPix({
  bau,
  textoClique,
  textoAqui,
}: {
  bau: BauPixArena;
  textoClique: string;
  textoAqui: string;
}) {
  const arte = bau.tampaAberta ? BAU_PIX_ABERTO : BAU_PIX_FECHADO;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: bau.x,
        top: bau.y,
        width: bau.largura,
        height: bau.altura,
        alignItems: 'center',
      }}
    >
      <Image
        source={arte.imagem}
        style={{ width: bau.largura, height: bau.altura }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
      {bau.tampaAberta && (
        <View
          style={{
            position: 'absolute',
            top: bau.altura * 0.12,
            width: bau.largura,
            alignItems: 'center',
          }}
        >
          <Text style={estilos.textoBauPix}>{textoClique}</Text>
          <Text style={estilos.textoBauPix}>{textoAqui}</Text>
        </View>
      )}
    </View>
  );
}

function SpriteDisparoInfectado({
  disparo,
  encanto,
}: {
  disparo: DisparoBoss;
  encanto: boolean;
}) {
  // Mesma cor da orb do momento: azul normal, dourado no super/encanto.
  const impacto = encanto ? DISPARO_IMPACTO_OURO_FRAMES : DISPARO_IMPACTO_FRAMES;
  let fonte = encanto ? DISPARO_VIAGEM_OURO.imagem : DISPARO_VIAGEM.imagem;
  if (disparo.fase === 'impacto') {
    const frame = Math.floor(disparo.tempoFaseS / FLASH_IMPACTO_DISPARO_S) % 2;
    fonte = impacto[frame];
  }

  return (
    <Image
      source={fonte}
      style={{
        position: 'absolute',
        left: disparo.x,
        top: disparo.y,
        width: disparo.largura,
        height: disparo.altura,
        transform: disparo.fase === 'viagem' ? [{ rotate: '180deg' }] : [],
      }}
      resizeMode="stretch"
      resizeMethod="scale"
    />
  );
}

function SpriteMiniBotZombie({ bot }: { bot: MiniBotZombie }) {
  const largura = MINI_BOT_ZOMBIE_TAMANHO.largura * ESCALA_MINI_BOT_ZOMBIE;
  const altura = MINI_BOT_ZOMBIE_TAMANHO.altura * ESCALA_MINI_BOT_ZOMBIE;
  const piscandoSequestro = bot.tempoPiscaSumirS > 0;
  const piscandoHit = (bot.hits ?? 0) > 0 && Math.floor(Date.now() / 80) % 2 === 0;
  const opacidade = piscandoSequestro
    ? Math.floor((DURACAO_PISCA_MINI_BOT_S - bot.tempoPiscaSumirS) / 0.18) % 2 === 0
      ? 0.15
      : 1
    : piscandoHit
      ? 0.3
      : 1;

  return (
    <View
      style={{
        position: 'absolute',
        left: bot.x,
        top: bot.y,
        width: largura,
        height: altura,
        opacity: opacidade,
        transform: [{ scaleX: bot.direcao }],
      }}
      pointerEvents="none"
    >
      <FramesAnimator
        frames={MINI_BOT_ZOMBIE_FRAMES}
        fps={FPS_MINI_BOT_ZOMBIE}
        key={`danca-${bot.id}-${FPS_MINI_BOT_ZOMBIE}`}
        larguraFrame={MINI_BOT_ZOMBIE_TAMANHO.largura}
        alturaFrame={MINI_BOT_ZOMBIE_TAMANHO.altura}
        escala={ESCALA_MINI_BOT_ZOMBIE}
      />
    </View>
  );
}

function SpriteDisparoBoss({
  disparo,
  encanto,
}: {
  disparo: DisparoBoss;
  encanto: boolean;
}) {
  const viagem = encanto ? DISPARO_VIAGEM_OURO : DISPARO_VIAGEM;
  const salida = encanto ? DISPARO_SALIDA_OURO : DISPARO_SALIDA;
  const impacto = encanto ? DISPARO_IMPACTO_OURO_FRAMES : DISPARO_IMPACTO_FRAMES;
  let fonte = viagem.imagem;
  if (disparo.fase === 'salida') fonte = salida.imagem;
  if (disparo.fase === 'impacto') {
    const frame = Math.floor(disparo.tempoFaseS / FLASH_IMPACTO_DISPARO_S) % 2;
    fonte = impacto[frame];
  }

  return (
    <Image
      source={fonte}
      style={{
        position: 'absolute',
        left: disparo.x,
        top: disparo.y,
        width: disparo.largura,
        height: disparo.altura,
      }}
      resizeMode="stretch"
      resizeMethod="scale"
    />
  );
}

/**
 * Orb na arena: skin equipada mantém a própria animação (giro/pisca),
 * normal ou SUPER conforme o encanto; sem skin, os frames de stun originais.
 * A caixa recebida é a do stun — a skin fica centrada nela, então a
 * geometria do anzol/sequestro não muda.
 */
function SpriteOrbArena({
  encanto,
  larguraCaixa,
  alturaCaixa,
}: {
  encanto: boolean;
  larguraCaixa: number;
  alturaCaixa: number;
}) {
  const skin = orbEquipada();
  if (!skin) {
    const tamStun = encanto ? ORB_STATICO_OURO_TAMANHO : ORB_STATICO_TAMANHO;
    return (
      <FramesAnimator
        frames={encanto ? ORB_STATICO_OURO_FRAMES : ORB_STATICO_FRAMES}
        fps={FPS_ORB_STATICO}
        larguraFrame={tamStun.largura}
        alturaFrame={tamStun.altura}
        escala={ESCALA_SPRITE}
      />
    );
  }
  const tam = encanto ? skin.tamanhoSuper : skin.tamanhoNormal;
  return (
    <View
      style={{
        width: larguraCaixa,
        height: alturaCaixa,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FramesAnimator
        frames={encanto ? skin.framesSuper : skin.framesNormal}
        fps={skin.fps}
        larguraFrame={tam.largura}
        alturaFrame={tam.altura}
        escala={ESCALA_ORB_SKIN}
      />
    </View>
  );
}

function SpriteMagoBoss({
  jogador,
  animarIntro,
  piscar = false,
}: {
  jogador: EstadoJogador;
  animarIntro: boolean;
  piscar?: boolean;
}) {
  const opacidade = piscar ? 0.45 : 1;
  // Gorro equipado: mesma animação de intro montada com a skin.
  const skinGorro = gorroEquipado();
  if (animarIntro && jogador.pose !== 'muerto') {
    const framesIntro = skinGorro ? skinGorro.framesIntro : MAGO_INTRO_FRAMES;
    const tamanhoIntro = skinGorro ? skinGorro.tamanhoIntro : MAGO_INTRO_TAMANHO;
    const largura = tamanhoIntro.largura * ESCALA_MAGO;
    const altura = tamanhoIntro.altura * ESCALA_MAGO;
    const offsetX = (LARGURA_JOGADOR - largura) / 2;
    const offsetY = ALTURA_JOGADOR - altura;
    return (
      <View
        style={{
          position: 'absolute',
          left: jogador.x + offsetX,
          top: jogador.y + offsetY,
          width: largura,
          height: altura,
          opacity: opacidade,
          transform: [{ scaleX: jogador.direcao === 'esquerda' ? -1 : 1 }],
        }}
      >
        <FramesAnimator
          frames={framesIntro}
          fps={FPS_MAGO_INTRO}
          larguraFrame={tamanhoIntro.largura}
          alturaFrame={tamanhoIntro.altura}
          escala={ESCALA_MAGO}
        />
      </View>
    );
  }

  const arte = skinGorro ? skinGorro.poses[jogador.pose] : POSE_POR_ESTADO[jogador.pose];
  const largura = arte.largura * ESCALA_MAGO;
  const altura = arte.altura * ESCALA_MAGO;
  // Folga transparente sob os pés no canvas da skin (0 sem skin).
  const folgaBaixo = skinGorro
    ? skinGorro.poses[jogador.pose].folgaBaixo * ESCALA_MAGO
    : 0;
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
        opacity: opacidade,
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

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  palco: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#161616',
  },
  url: {
    fontFamily: FONTE_PIXEL,
    color: '#2a1608',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    width: '100%',
  },
  urlNome: {
    fontFamily: FONTE_PIXEL,
    fontWeight: '700',
    color: '#2a1608',
    textShadowColor: '#2a1608',
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 0,
  },
  hpBoss: {
    position: 'absolute',
    top: 4,
    right: 8,
    fontFamily: FONTE_PIXEL,
    color: '#fff8e8',
    fontSize: TAMANHO_FONTE_HP_BOSS,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  hpBossHit: {
    color: '#ff2a2a',
  },
  overlayVitoria: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    backgroundColor: '#0a0a0a',
  },
  conteudoVitoria: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  espacoBalaoVitoria: {
    marginTop: 8,
    width: '100%',
  },
  areaSairDemo: {
    marginTop: 18,
    alignItems: 'center',
  },
  setaParaBaixo: {
    width: 0,
    height: 0,
    marginTop: 4,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff8e8',
  },
  raioTap: {
    width: LARGURA_RAIO_TAP,
    height: 2,
    backgroundColor: '#fff8e8',
  },
  textoTutorial: {
    fontFamily: FONTE_PIXEL,
    color: '#fff8e8',
    fontSize: 9,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  textoTutorialDuasLinhas: {
    fontFamily: FONTE_PIXEL,
    color: '#fff8e8',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  textoBauPix: {
    fontFamily: FONTE_PIXEL,
    color: '#ffe56a',
    fontSize: 9,
    lineHeight: 12,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
