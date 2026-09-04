/**
 * Animação por PNGs separados (um arquivo por frame).
 * Evita sheet em faixa: no Android o overflow+translate costuma
 * sangrar 1 px do frame vizinho (linhas fantasmas na intro/moeda).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, View } from 'react-native';

interface Props {
  frames: number[];
  fps: number;
  larguraFrame: number;
  alturaFrame: number;
  escala?: number;
  /** Tom vermelho só nos pixels do sprite (hit do boss). */
  comTomDano?: boolean;
}

export function FramesAnimator({
  frames,
  fps,
  larguraFrame,
  alturaFrame,
  escala = 1,
  comTomDano = false,
}: Props) {
  const [frame, setFrame] = useState(0);
  const total = frames.length;
  const opacidadeTom = useRef(new Animated.Value(0.28)).current;

  useEffect(() => {
    if (total <= 1) return;
    const intervalo = setInterval(() => {
      setFrame((atual) => (atual + 1) % total);
    }, 1000 / fps);
    return () => clearInterval(intervalo);
  }, [fps, total]);

  useEffect(() => {
    if (!comTomDano) return;
    opacidadeTom.setValue(0.28);
    const pulso = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidadeTom, {
          toValue: 0.08,
          duration: 170,
          useNativeDriver: true,
        }),
        Animated.timing(opacidadeTom, {
          toValue: 0.24,
          duration: 170,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 },
    );
    pulso.start();
    return () => pulso.stop();
  }, [comTomDano, opacidadeTom]);

  const largura = Math.round(larguraFrame * escala);
  const altura = Math.round(alturaFrame * escala);

  return (
    <View collapsable={false} style={{ width: largura, height: altura, overflow: 'hidden' }}>
      <Image
        source={frames[frame]}
        style={{ width: largura, height: altura }}
        resizeMode="stretch"
        // No Android, "scale" costuma preservar melhor o pixel art pré-escalado.
        resizeMethod="scale"
      />
      {comTomDano && (
        <Animated.Image
          source={frames[frame]}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: largura,
            height: altura,
            tintColor: '#c41414',
            opacity: opacidadeTom,
          }}
          resizeMode="stretch"
          resizeMethod="scale"
        />
      )}
    </View>
  );
}
