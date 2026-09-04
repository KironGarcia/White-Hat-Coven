/**
 * Fim de run: mago da intro (ciclo parado/agachado), altitude, recorde,
 * moedas e botões. Recorde novo: roleta centralizada embaixo dos botões.
 */

import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FUNDO_FASE_1, MAGO_INTRO_FRAMES, MAGO_INTRO_TAMANHO } from '../assets';
import { ESCALA_BOTAO_MADEIRA, ESCALA_MAGO, FPS_MAGO_INTRO } from '../constants';
import { BotaoMadeira } from '../components/BotaoMadeira';
import { FramesAnimator } from '../components/FramesAnimator';
import { RoletaRecorde } from '../components/RoletaRecorde';
import type { ResultadoRun } from '../entities/mundo';
import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import { registrarAltitude, adicionarMoedasTotais } from '../systems/pontuacao';
import { gorroEquipado } from '../systems/skins';
import { FONTE_PIXEL } from '../tipografia';

const PX_POR_MM = 160 / 25.4;
/** Game over: +5 mm no botão RPG; a fonte acompanha e quase preenche. */
const ESCALA_BOTAO_FIM =
  (102 * ESCALA_BOTAO_MADEIRA + 5 * PX_POR_MM) / 288;

interface Props {
  resultado: ResultadoRun;
  aoJogarDeNovo: () => void;
  aoVoltarParaIntro: () => void;
}

export function GameOverScreen({ resultado, aoJogarDeNovo, aoVoltarParaIntro }: Props) {
  const { t } = useTextosJogo();
  const [recorde, setRecorde] = useState<number | null>(null);
  const [novoRecorde, setNovoRecorde] = useState(false);
  const jaCreditouMoedas = React.useRef(false);

  useEffect(() => {
    let montado = true;
    registrarAltitude(resultado.altitudeMetros).then((registro) => {
      if (!montado) return;
      setRecorde(registro.recorde);
      setNovoRecorde(registro.novoRecorde);
    });
    // Moedas da run entram na carteira total uma vez por tela de fim.
    if (!jaCreditouMoedas.current) {
      jaCreditouMoedas.current = true;
      void adicionarMoedasTotais(resultado.moedas);
    }
    return () => {
      montado = false;
    };
  }, [resultado.altitudeMetros, resultado.moedas]);

  // Mesmo ciclo da intro (parado → agachado), no lugar do mago morto.
  const skinGorro = gorroEquipado();
  const framesIntro = skinGorro ? skinGorro.framesIntro : MAGO_INTRO_FRAMES;
  const tamanhoIntro = skinGorro ? skinGorro.tamanhoIntro : MAGO_INTRO_TAMANHO;

  return (
    <ImageBackground source={FUNDO_FASE_1} style={estilos.fundo} resizeMode="cover">
      <View style={estilos.escurecedor}>
        <ScrollView
          contentContainerStyle={estilos.conteudo}
          scrollEnabled={novoRecorde}
          showsVerticalScrollIndicator={false}
        >
        <Text style={estilos.titulo}>{t.gameOver.titulo}</Text>

        <FramesAnimator
          frames={framesIntro}
          fps={FPS_MAGO_INTRO}
          larguraFrame={tamanhoIntro.largura}
          alturaFrame={tamanhoIntro.altura}
          escala={ESCALA_MAGO}
        />

        <View style={estilos.painel}>
          <Text style={estilos.linha}>
            {t.gameOver.altitude(Math.floor(resultado.altitudeMetros))}
          </Text>
          <Text style={estilos.linha}>
            {t.gameOver.recorde(recorde === null ? '...' : `${Math.floor(recorde)} m`)}
            {novoRecorde ? t.gameOver.novoRecorde : ''}
          </Text>
          <Text style={estilos.linha}>{t.gameOver.moedasDaRun(resultado.moedas)}</Text>
        </View>

        <View style={estilos.botoes}>
          <BotaoMadeira
            rotulo={t.gameOver.jogarDeNovo}
            aoPressionar={aoJogarDeNovo}
            modelo="rpg"
            escala={ESCALA_BOTAO_FIM}
            ajusteFontePx={5 + 10 * PX_POR_MM}
            folgaTexto={0.04}
          />
          <BotaoMadeira
            rotulo={t.gameOver.telaInicial}
            aoPressionar={aoVoltarParaIntro}
            modelo="rpg"
            escala={ESCALA_BOTAO_FIM}
            ajusteFontePx={5}
          />
        </View>

        {novoRecorde && <RoletaRecorde />}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
  },
  escurecedor: {
    flex: 1,
    backgroundColor: 'rgba(6, 3, 14, 0.72)',
  },
  conteudo: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  titulo: {
    fontFamily: FONTE_PIXEL,
    color: '#f2e3c0',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  painel: {
    alignItems: 'center',
    gap: 10,
  },
  linha: {
    fontFamily: FONTE_PIXEL,
    color: '#e8dcc0',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
  },
  botoes: {
    gap: 12,
    alignItems: 'center',
  },
});
