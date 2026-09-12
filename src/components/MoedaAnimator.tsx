/**
 * Animação da moeda de plataforma via FramesAnimator (PNGs separados).
 */

import React from 'react';

import { MOEDA_PLATAFORMA_FRAMES, MOEDA_PLATAFORMA_TAMANHO } from '../assets';
import { FramesAnimator } from './FramesAnimator';

interface Props {
  fps: number;
  escala?: number;
}

export function MoedaAnimator({ fps, escala = 1 }: Props) {
  return (
    <FramesAnimator
      frames={MOEDA_PLATAFORMA_FRAMES}
      fps={fps}
      larguraFrame={MOEDA_PLATAFORMA_TAMANHO.largura}
      alturaFrame={MOEDA_PLATAFORMA_TAMANHO.altura}
      escala={escala}
    />
  );
}
