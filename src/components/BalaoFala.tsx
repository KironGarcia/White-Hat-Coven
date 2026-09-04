/**
 * Balão de fala branco com rabinho triangular apontando para o mago (acima).
 * Sem asset — forma pura em View (demo 1).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FONTE_PIXEL } from '../tipografia';

/** 5 mm a mais no balão da tela do Gray Mage (densidade ~160 dpi). */
const EXTRA_BALAO_PX = (160 / 25.4) * 5;

interface Props {
  texto: string;
  /** Texto longo (pré-alfa): fonte um pouco menor para caber no balão. */
  compacto?: boolean;
}

export function BalaoFala({ texto, compacto = false }: Props) {
  return (
    <View style={estilos.envoltorio}>
      {/* Rabinho no topo, apontando para o mago. */}
      <View style={estilos.rabinho} />
      <View style={estilos.balao}>
        <Text
          style={[
            estilos.texto,
            compacto && estilos.textoCompacto,
          ]}
        >
          {texto}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  envoltorio: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Math.max(8, 18 - EXTRA_BALAO_PX / 4),
  },
  rabinho: {
    width: 0,
    height: 0,
    marginBottom: -2,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff8e8',
    zIndex: 1,
  },
  balao: {
    backgroundColor: '#fff8e8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2a1608',
    paddingHorizontal: 14 + EXTRA_BALAO_PX / 4,
    paddingVertical: 12 + EXTRA_BALAO_PX / 4,
    width: '100%',
    maxWidth: 340 + EXTRA_BALAO_PX,
  },
  texto: {
    fontFamily: FONTE_PIXEL,
    color: '#2a1608',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
  },
  textoCompacto: {
    fontSize: 10,
    lineHeight: 16,
  },
});
