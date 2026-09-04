/**
 * Botão de UI: madeira (itens da loja) ou RPG (menus).
 * Frame 0 = solto, frame 1 = pressionado.
 * O frame pressionado fica visível por pelo menos um "tick" de 2 fps
 * (500 ms), respeitando a cadência da tabela de animação.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BOTAO_MADEIRA, BOTAO_RPG } from '../assets';
import {
  ESCALA_BOTAO_MADEIRA,
  ESCALA_BOTAO_RPG,
  FPS_BOTAO_MADEIRA,
} from '../constants';
import { FONTE_PIXEL } from '../tipografia';
import { tocarSomClique } from '../systems/audio-jogo';
import { SpriteAnimator } from './SpriteAnimator';

const DURACAO_FRAME_MS = 1000 / FPS_BOTAO_MADEIRA;

export type ModeloBotao = 'madeira' | 'rpg';

interface Props {
  rotulo: string;
  aoPressionar: () => void;
  /** Escala do sprite (padrão = tamanho do modelo). */
  escala?: number;
  /** madeira = itens da loja; rpg = menus / intro / aviso / Sair da loja. */
  modelo?: ModeloBotao;
  /** Soma na fonte, em pixels (ex.: +2 mm no Continuar). */
  ajusteFontePx?: number;
  /** Largura alvo na tela (estica o sprite na horizontal, altura pela escala). */
  larguraAlvoPx?: number;
  /** Linhas do rótulo (opções longas da aula). */
  linhas?: number;
  /** Fração da largura nas laterais do texto (padrão 0,12). */
  folgaTexto?: number;
}

export function BotaoMadeira({
  rotulo,
  aoPressionar,
  escala,
  modelo = 'madeira',
  ajusteFontePx = 0,
  larguraAlvoPx,
  linhas = 1,
  folgaTexto = 0.12,
}: Props) {
  const [pressionado, setPressionado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheet = modelo === 'rpg' ? BOTAO_RPG : BOTAO_MADEIRA;
  const escalaPadrao = modelo === 'rpg' ? ESCALA_BOTAO_RPG : ESCALA_BOTAO_MADEIRA;
  const escalaUso = escala ?? escalaPadrao;
  const largura = Math.round(larguraAlvoPx ?? sheet.larguraFrame * escalaUso);

  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  function iniciarPressao() {
    if (temporizador.current) clearTimeout(temporizador.current);
    setPressionado(true);
    tocarSomClique();
    // A ação dispara na hora; só o visual segura o frame pressionado.
    temporizador.current = setTimeout(() => setPressionado(false), DURACAO_FRAME_MS);
  }

  // Fonte acompanha a escala do sprite. Rótulo longo (tradução) usa tamanho menor.
  const fatorFonte = escalaUso / escalaPadrao;
  const fontePequena = rotulo.length > 8;
  const fonteMiniMadeira = modelo === 'madeira' && escalaUso < 1.2;
  const fonteBase = fonteMiniMadeira ? 8 : fontePequena ? 9 : 14;
  const fonteFinal = fonteBase * fatorFonte + ajusteFontePx;

  return (
    <Pressable onPressIn={iniciarPressao} onPress={aoPressionar} style={estilos.area}>
      <SpriteAnimator
        sheet={sheet}
        fps={FPS_BOTAO_MADEIRA}
        escala={escalaUso}
        larguraDestinoPx={larguraAlvoPx}
        frameFixo={pressionado ? 1 : 0}
      />
      <View
        style={[
          estilos.camadaTexto,
          { paddingHorizontal: Math.max(6, Math.round(largura * folgaTexto)) },
        ]}
        pointerEvents="none"
      >
        <Text
          style={[
            estilos.texto,
            { fontSize: fonteFinal },
            pressionado && (modelo === 'rpg' ? estilos.textoPressionadoRpg : estilos.textoPressionado),
          ]}
          numberOfLines={linhas}
          adjustsFontSizeToFit
          minimumFontScale={ajusteFontePx > 0 ? 0.85 : 0.7}
        >
          {rotulo}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  area: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  camadaTexto: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontFamily: FONTE_PIXEL,
    color: '#f2e3c0',
    letterSpacing: 0.5,
    textShadowColor: '#2a1608',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  textoPressionado: {
    transform: [{ translateY: 1 }],
  },
  textoPressionadoRpg: {
    transform: [{ translateY: 2 }],
  },
});
