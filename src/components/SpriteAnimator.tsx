/**
 * Animador de spritesheet horizontal (export padrão do Piskel).
 * Renderiza um frame por vez: uma janela com overflow escondido
 * desliza a imagem inteira para a esquerda, frame a frame, no FPS pedido.
 *
 * Tamanhos arredondados + translateX evitam “sangrar” 1 px do frame vizinho
 * (comum com escala fracionária tipo 1.5 no Android).
 */

import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { SpriteSheet } from '../assets';

interface Props {
  sheet: SpriteSheet;
  fps: number;
  escala?: number;
  /** false = toca uma vez e congela no último frame. */
  loop?: boolean;
  /** Se definido, mostra só esse frame (sem animar). */
  frameFixo?: number;
  /** Primeiro frame ao montar (pula poses que parecem idle). */
  frameInicial?: number;
  /** Depois de N avanços, congela (o HAHAHA dá mais um ciclo e para). */
  maxAvancos?: number;
  /** Espelha horizontalmente (personagem olhando para a esquerda). */
  espelhado?: boolean;
  /** Largura do frame na tela (estica na horizontal; a altura segue a escala). */
  larguraDestinoPx?: number;
}

export function SpriteAnimator({
  sheet,
  fps,
  escala = 1,
  loop = true,
  frameFixo,
  frameInicial = 0,
  maxAvancos,
  espelhado = false,
  larguraDestinoPx,
}: Props) {
  const [frame, setFrame] = useState(frameInicial);

  useEffect(() => {
    if (frameFixo !== undefined) return;
    setFrame(frameInicial);
    let avancos = 0;

    const intervalo = setInterval(() => {
      setFrame((atual) => {
        if (maxAvancos !== undefined && avancos >= maxAvancos) {
          return atual;
        }
        const proximo = atual + 1;
        const seguinte =
          proximo >= sheet.totalFrames ? (loop ? 0 : atual) : proximo;
        if (seguinte === atual) return atual;
        avancos += 1;
        return seguinte;
      });
    }, 1000 / fps);

    return () => clearInterval(intervalo);
  }, [fps, loop, frameFixo, frameInicial, maxAvancos, sheet.totalFrames]);

  const frameAtual = frameFixo !== undefined ? frameFixo : frame;
  // Inteiros: evita subpixel abrindo 1 coluna do próximo frame.
  const largura = Math.round(larguraDestinoPx ?? sheet.larguraFrame * escala);
  const altura = Math.round(sheet.alturaFrame * escala);
  const larguraFaixa = largura * sheet.totalFrames;

  return (
    <View
      collapsable={false}
      style={[
        estilos.janela,
        { width: largura, height: altura },
        espelhado && estilos.espelho,
      ]}
    >
      <Image
        source={sheet.imagem}
        style={{
          width: larguraFaixa,
          height: altura,
          transform: [{ translateX: -frameAtual * largura }],
        }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  janela: {
    overflow: 'hidden',
  },
  espelho: {
    transform: [{ scaleX: -1 }],
  },
});
