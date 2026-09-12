/**
 * HUD da run: corações à esquerda, altitude no centro,
 * moedas à direita. Coração some ao perder vida.
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CORAZON } from '../assets';
import { FPS_MOEDA } from '../constants';
import { FONTE_PIXEL } from '../tipografia';
import { MoedaAnimator } from './MoedaAnimator';

function milimetrosEmPx(mm: number): number {
  return Math.round((mm / 25.4) * 160);
}

const TAMANHO_CORACAO_PX = milimetrosEmPx(5);
const FOLGA_ENTRE_CORACOES_PX = milimetrosEmPx(1);

/**
 * O PNG 64×65 tem folga transparente (bbox 15,18–49,49).
 * Sem recorte, dois corações “colados” ainda parecem longe.
 */
const PNG_CORACAO = { largura: 64, altura: 65, l: 15, t: 18, r: 49, b: 49 };
const CONTEUDO_W = PNG_CORACAO.r - PNG_CORACAO.l;
const CONTEUDO_H = PNG_CORACAO.b - PNG_CORACAO.t;
const ESCALA_CORTE = TAMANHO_CORACAO_PX / CONTEUDO_W;

interface Props {
  altitudeMetros: number;
  moedas: number;
  vidas: number;
  /** Máximo de corações (2, ou 3 com a carta) — vazio aparece apagado. */
  vidasMaximas?: number;
  /** Quando true, o contador de moedas pisca vermelho (moeda pirata coletada). */
  flashPirata?: boolean;
}

export function HUD({
  altitudeMetros,
  moedas,
  vidas,
  vidasMaximas,
  flashPirata = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const coracoes = Math.max(0, Math.floor(vidas));
  const slots = Math.max(coracoes, Math.floor(vidasMaximas ?? coracoes), 1);
  const topo = Math.max(insets.top, 8) + 8;

  return (
    <View style={[estilos.faixa, { top: topo }]} pointerEvents="none">
      <View style={estilos.coracoes}>
        {Array.from({ length: slots }, (_, indice) => (
          <View
            key={`coracao-${indice}`}
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
      <Text style={estilos.altitude}>{Math.floor(altitudeMetros)} m</Text>
      <View style={estilos.contadorMoedas}>
        <MoedaAnimator fps={FPS_MOEDA} escala={0.8} />
        <Text style={[estilos.textoMoedas, flashPirata && estilos.textoMoedasFlashPirata]}>
          {moedas}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  faixa: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 8,
    elevation: 8,
  },
  altitude: {
    position: 'absolute',
    left: 72,
    right: 72,
    fontFamily: FONTE_PIXEL,
    color: '#f2e3c0',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0,
  },
  coracoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 2,
    elevation: 2,
  },
  contadorMoedas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textoMoedas: {
    fontFamily: FONTE_PIXEL,
    color: '#ffd76a',
    fontSize: 14,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 0,
  },
  /** Pisca vermelho ao coletar moeda pirata — sobrepõe a cor amarela. */
  textoMoedasFlashPirata: {
    color: '#ff2a2a',
  },
});
