/**
 * Tela de introdução — PADRÃO FINAL do fundo WHC (não regressar sem pedido):
 * 1) Mede o container real (onLayout) e preenche 100% da altura (sem faixa).
 * 2) Nos lados: corta no máx. ~1 cm; o que faltar estica na horizontal.
 * 3) Empurra ~2 mm à direita para o título da arte ficar centralizado.
 * 4) Recorde + botões + mago são ÂNCORAS na arte (0–1): acompanham o estique.
 * Importante: a Image SEMPRE leva width/height explícitos.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTAO_RPG, FUNDO_INTRO, MAGO_INTRO_FRAMES, MAGO_INTRO_TAMANHO } from '../assets';
import { ESCALA_BOTAO_RPG_INTRO, FPS_MAGO_INTRO } from '../constants';
import { BotaoMadeira } from '../components/BotaoMadeira';
import { FramesAnimator } from '../components/FramesAnimator';
import { SeletorIdiomaJogo } from '../components/SeletorIdiomaJogo';
import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import { carregarRecorde } from '../systems/pontuacao';
import { gorroEquipado } from '../systems/skins';
import { FONTE_PIXEL } from '../tipografia';

const ESCALA_MAGO_INTRO = 3;

/** ~1 cm em unidades de tela (density-independent). */
const CORTE_MAX_POR_LADO_PX = 38;
/** ~2 mm à direita para centralizar o título da arte. */
const DESLOCAMENTO_DIREITA_PX = 8;
/** Folga extra embaixo/cima para não sobrar 1 px de faixa por arredondamento. */
const FOLGA_VERTICAL_PX = 3;

/**
 * Âncoras FINAIS no espaço da ARTE (0–1) — travadas no aparelho do Kiron.
 * Não alterar com estique/crop do fundo: estes pontos acompanham a caixa da arte.
 * Ordem visual: recorde → botões (vão central) → mago no pilar.
 */
const ANCORA_RECORDE = { x: 0.5, y: 0.32 };
const ANCORA_TOPO_BOTOES = { x: 0.5, y: 0.43 };
const ANCORA_PES_MAGO = { x: 0.5, y: 0.745 };

interface Props {
  aoJogar: () => void;
  /** Se definido (ex.: dentro do ARGOS), volta ao app em vez de fechar o processo. */
  aoSair?: () => void;
}

export function IntroScreen({ aoJogar, aoSair }: Props) {
  const { t } = useTextosJogo();
  const insets = useSafeAreaInsets();
  const janela = useWindowDimensions();
  const [tamanho, setTamanho] = useState({
    largura: janela.width,
    altura: janela.height,
  });
  const [recordeMetros, setRecordeMetros] = useState<number | null>(null);

  useEffect(() => {
    let ativo = true;
    carregarRecorde().then((valor) => {
      if (ativo) setRecordeMetros(valor);
    });
    return () => {
      ativo = false;
    };
  }, []);

  function aoMedir(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    if (width === tamanho.largura && height === tamanho.altura) return;
    setTamanho({ largura: width, altura: height });
  }

  const fundo = useMemo(() => {
    const meta = Image.resolveAssetSource(FUNDO_INTRO);
    const imgW = meta.width || 1023;
    const imgH = meta.height || 1537;
    const { largura: larguraTela, altura: alturaTela } = tamanho;

    const alturaDesenho = alturaTela + FOLGA_VERTICAL_PX * 2;
    const escalaY = alturaDesenho / imgH;
    const larguraNaAltura = imgW * escalaY;

    let cropPorLado = 0;
    let escalaX: number;

    if (larguraNaAltura >= larguraTela) {
      const excesso = larguraNaAltura - larguraTela;
      cropPorLado = Math.min(excesso / 2, CORTE_MAX_POR_LADO_PX);
      const larguraVisivel = larguraNaAltura - 2 * cropPorLado;
      escalaX = larguraTela / larguraVisivel;
    } else {
      escalaX = larguraTela / larguraNaAltura;
    }

    return {
      largura: larguraNaAltura * escalaX,
      altura: alturaDesenho,
      left: -cropPorLado * escalaX + DESLOCAMENTO_DIREITA_PX,
      top: -FOLGA_VERTICAL_PX,
    };
  }, [tamanho]);

  // Gorro equipado: mesma animação de intro, com a skin (pés na mesma âncora).
  const skinGorro = gorroEquipado();
  const framesIntro = skinGorro ? skinGorro.framesIntro : MAGO_INTRO_FRAMES;
  const tamanhoIntro = skinGorro ? skinGorro.tamanhoIntro : MAGO_INTRO_TAMANHO;
  const larguraMago = tamanhoIntro.largura * ESCALA_MAGO_INTRO;
  const alturaMago = tamanhoIntro.altura * ESCALA_MAGO_INTRO;
  const larguraBotao = BOTAO_RPG.larguraFrame * ESCALA_BOTAO_RPG_INTRO;

  const leftMago = ANCORA_PES_MAGO.x * fundo.largura - larguraMago / 2;
  const topMago = ANCORA_PES_MAGO.y * fundo.altura - alturaMago;
  const leftBotoes = ANCORA_TOPO_BOTOES.x * fundo.largura - larguraBotao / 2;
  const topBotoes = ANCORA_TOPO_BOTOES.y * fundo.altura;
  const leftRecorde = ANCORA_RECORDE.x * fundo.largura;
  const topRecorde = ANCORA_RECORDE.y * fundo.altura;

  function sair() {
    if (aoSair) {
      aoSair();
      return;
    }
    BackHandler.exitApp();
  }

  const textoRecorde =
    recordeMetros === null
      ? '...'
      : recordeMetros <= 0
        ? '0 m'
        : `${Math.floor(recordeMetros)} m`;

  const caixaArte = {
    position: 'absolute' as const,
    left: fundo.left,
    top: fundo.top,
    width: fundo.largura,
    height: fundo.altura,
  };

  return (
    <View style={estilos.raiz} onLayout={aoMedir}>
      <View style={estilos.janelaFundo}>
        <Image source={FUNDO_INTRO} style={caixaArte} resizeMode="stretch" />

        <View style={caixaArte} pointerEvents="box-none">
          <View style={[estilos.areaRecorde, { left: leftRecorde - 180, top: topRecorde }]}>
            <Text
              style={estilos.rotuloRecorde}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {t.intro.recordeAtual}
            </Text>
            <Text style={estilos.valorRecorde}>{textoRecorde}</Text>
          </View>

          <View style={[estilos.areaBotoes, { left: leftBotoes, top: topBotoes }]}>
            <BotaoMadeira
              rotulo={t.intro.jogar}
              aoPressionar={aoJogar}
              modelo="rpg"
              escala={ESCALA_BOTAO_RPG_INTRO}
            />
            <BotaoMadeira
              rotulo={t.intro.sair}
              aoPressionar={sair}
              modelo="rpg"
              escala={ESCALA_BOTAO_RPG_INTRO}
            />
          </View>

          <View style={[estilos.areaMago, { left: leftMago, top: topMago }]}>
            <FramesAnimator
              frames={framesIntro}
              fps={FPS_MAGO_INTRO}
              larguraFrame={tamanhoIntro.largura}
              alturaFrame={tamanhoIntro.altura}
              escala={ESCALA_MAGO_INTRO}
            />
          </View>
        </View>
      </View>

      <View
        pointerEvents="box-none"
        style={[
          estilos.areaIdioma,
          {
            paddingTop: Math.max(insets.top, 8) + 4,
            paddingRight: Math.max(insets.right, 10),
          },
        ]}
      >
        <SeletorIdiomaJogo />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#0b0716',
  },
  janelaFundo: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  areaRecorde: {
    position: 'absolute',
    alignItems: 'center',
    width: 360,
  },
  rotuloRecorde: {
    fontFamily: FONTE_PIXEL,
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: 0,
    textAlign: 'center',
    width: '100%',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  valorRecorde: {
    fontFamily: FONTE_PIXEL,
    color: '#ffffff',
    fontSize: 20,
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  areaMago: {
    position: 'absolute',
  },
  areaBotoes: {
    position: 'absolute',
    gap: 12,
    alignItems: 'center',
  },
  areaIdioma: {
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'flex-end',
  },
});
