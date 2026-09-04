/**
 * Roleta de recorde: o marco mostra TODOS os prêmios em sequência (vitrine).
 * O drop (porcentagens, sem skins já possuídas) só entra na hora de parar.
 * Girar! usa o BOTON-RPG.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import {
  ITEM_BONUS_MOEDAS,
  ITEM_CARTA_7DIAS,
  TIENDA_MARCO_ITEM,
} from '../assets';
import {
  ESCALA_BOTAO_RPG,
  FPS_ITEM_LOJA,
  MOEDAS_BONUS_ROLETA,
} from '../constants';
import { PREMIOS_ROLETA, type PremioRoleta } from '../data/roleta-recorde';
import { ehIdSkin, ehIdSkinGorro, ehIdSkinOrb, SKINS_GORRO, SKINS_ORB } from '../data/skins';
import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import {
  adicionarMoedasTotais,
  concederCarta7Dias,
} from '../systems/pontuacao';
import {
  premiosRoletaDisponiveis,
  sortearPremioRoleta,
} from '../systems/roleta-recorde';
import { adicionarSkinAoInventario } from '../systems/skins';
import { tocarSomMoeda, tocarSomNovoCoracao } from '../systems/audio-jogo';
import { FONTE_PIXEL } from '../tipografia';
import { BotaoMadeira } from './BotaoMadeira';
import { FramesAnimator } from './FramesAnimator';
import { SpriteAnimator } from './SpriteAnimator';

/** Buraco interno da moldura (px da arte 49×51) — igual à loja. */
const MARCO_BURACO = { x: 4, y: 18, w: 41, h: 28 };
const ESCALA_MARCO = 2.35;
/** Giro visual: 4 s mostrando a vitrine completa, depois o drop decide onde parar. */
const DURACAO_GIRO_MS = 4000;
const INTERVALO_VITRINE_MS = 90;
const INTERVALO_PARADA_INICIO_MS = 140;
const INTERVALO_PARADA_FIM_MS = 320;

function fraseDoPremio(
  premio: PremioRoleta,
  t: ReturnType<typeof useTextosJogo>['t'],
): string {
  if (premio.tipo === 'moedas') return t.gameOver.premioMoedas(MOEDAS_BONUS_ROLETA);
  if (premio.tipo === 'carta') return t.gameOver.premioCarta;
  return t.gameOver.premioSkin;
}

function VisualPremio({ premio }: { premio: PremioRoleta }) {
  const buracoW = Math.round(MARCO_BURACO.w * ESCALA_MARCO);
  const buracoH = Math.round(MARCO_BURACO.h * ESCALA_MARCO);

  if (premio.id === 'bonus-moedas') {
    const escala = Math.min(
      (buracoW * 0.92) / ITEM_BONUS_MOEDAS.larguraFrame,
      (buracoH * 0.92) / ITEM_BONUS_MOEDAS.alturaFrame,
    );
    return <SpriteAnimator sheet={ITEM_BONUS_MOEDAS} fps={FPS_ITEM_LOJA} escala={escala} />;
  }
  if (premio.id === 'carta-7dias') {
    const escala = Math.min(
      (buracoW * 0.92) / ITEM_CARTA_7DIAS.larguraFrame,
      (buracoH * 0.92) / ITEM_CARTA_7DIAS.alturaFrame,
    );
    return <SpriteAnimator sheet={ITEM_CARTA_7DIAS} fps={FPS_ITEM_LOJA} escala={escala} />;
  }
  if (ehIdSkinGorro(premio.id)) {
    const icone = SKINS_GORRO[premio.id].icone;
    const escala = Math.min(
      (buracoW * 0.92) / icone.largura,
      (buracoH * 0.92) / icone.altura,
    );
    return (
      <Image
        source={icone.imagem}
        style={{
          width: Math.round(icone.largura * escala),
          height: Math.round(icone.altura * escala),
        }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
    );
  }
  if (ehIdSkinOrb(premio.id)) {
    const orb = SKINS_ORB[premio.id];
    const escala = Math.min(
      (buracoW * 0.92) / orb.tamanhoNormal.largura,
      (buracoH * 0.92) / orb.tamanhoNormal.altura,
    );
    return (
      <FramesAnimator
        frames={orb.framesNormal}
        fps={orb.fps}
        larguraFrame={orb.tamanhoNormal.largura}
        alturaFrame={orb.tamanhoNormal.altura}
        escala={escala}
      />
    );
  }
  return null;
}

async function entregarPremio(premio: PremioRoleta): Promise<void> {
  if (premio.tipo === 'moedas') {
    await adicionarMoedasTotais(MOEDAS_BONUS_ROLETA);
    tocarSomMoeda();
    return;
  }
  if (premio.tipo === 'carta') {
    await concederCarta7Dias();
    tocarSomNovoCoracao();
    return;
  }
  if (premio.tipo === 'skin' && ehIdSkin(premio.id)) {
    adicionarSkinAoInventario(premio.id);
    tocarSomNovoCoracao();
  }
}

export function RoletaRecorde() {
  const { t } = useTextosJogo();
  const vitrine = PREMIOS_ROLETA;
  const [indice, setIndice] = useState(0);
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState<PremioRoleta | null>(null);
  const [frase, setFrase] = useState('');
  const cancelar = useRef(false);
  const jaEntregou = useRef(false);

  useEffect(() => {
    return () => {
      cancelar.current = true;
    };
  }, []);

  const premioNaTela = resultado ?? vitrine[indice] ?? vitrine[0];
  const larguraMarco = Math.round(TIENDA_MARCO_ITEM.largura * ESCALA_MARCO);
  const alturaMarco = Math.round(TIENDA_MARCO_ITEM.altura * ESCALA_MARCO);
  const buracoLeft = Math.round(MARCO_BURACO.x * ESCALA_MARCO);
  const buracoTop = Math.round(MARCO_BURACO.y * ESCALA_MARCO);
  const buracoW = Math.round(MARCO_BURACO.w * ESCALA_MARCO);
  const buracoH = Math.round(MARCO_BURACO.h * ESCALA_MARCO);

  function girar() {
    if (girando || resultado || vitrine.length === 0) return;
    setGirando(true);
    const inicio = Date.now();
    let mostrado = indice;

    function avancarVitrine() {
      if (cancelar.current) return;
      mostrado = (mostrado + 1) % vitrine.length;
      setIndice(mostrado);
      if (Date.now() - inicio < DURACAO_GIRO_MS) {
        setTimeout(avancarVitrine, INTERVALO_VITRINE_MS);
        return;
      }
      // 4 s: agora o drop. A vitrine já mostrou tudo; paramos no prêmio.
      const vencedor = sortearPremioRoleta(premiosRoletaDisponiveis());
      pararNoPremio(mostrado, vencedor);
    }

    avancarVitrine();
  }

  function pararNoPremio(atual: number, vencedor: PremioRoleta) {
    const alvo = Math.max(
      0,
      vitrine.findIndex((premio) => premio.id === vencedor.id),
    );
    const dist = (alvo - atual + vitrine.length) % vitrine.length;
    // Uma volta extra + a distância, para não travar na hora se já estava no item.
    const passos = vitrine.length + (dist === 0 ? vitrine.length : dist);
    let dados = 0;
    let idx = atual;

    function lento() {
      if (cancelar.current) return;
      dados += 1;
      idx = (idx + 1) % vitrine.length;
      setIndice(idx);
      if (dados >= passos) {
        setIndice(alvo);
        setResultado(vencedor);
        setGirando(false);
        setFrase(fraseDoPremio(vencedor, t));
        if (!jaEntregou.current) {
          jaEntregou.current = true;
          void entregarPremio(vencedor);
        }
        return;
      }
      const tLinear = dados / passos;
      const espera =
        INTERVALO_PARADA_INICIO_MS +
        (INTERVALO_PARADA_FIM_MS - INTERVALO_PARADA_INICIO_MS) * tLinear;
      setTimeout(lento, espera);
    }

    lento();
  }

  return (
    <View style={estilos.caixa}>
      <Text style={estilos.titulo}>{t.gameOver.roletaTitulo}</Text>
      <View style={{ width: larguraMarco, height: alturaMarco }}>
        <Image
          source={TIENDA_MARCO_ITEM.imagem}
          style={{ width: larguraMarco, height: alturaMarco }}
          resizeMode="stretch"
          resizeMethod="scale"
        />
        <View
          style={{
            position: 'absolute',
            left: buracoLeft,
            top: buracoTop,
            width: buracoW,
            height: buracoH,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {premioNaTela ? <VisualPremio premio={premioNaTela} /> : null}
        </View>
      </View>
      {resultado ? (
        <Text style={estilos.frase}>{frase}</Text>
      ) : girando ? null : (
        <BotaoMadeira
          rotulo={t.gameOver.girar}
          aoPressionar={girar}
          modelo="rpg"
          escala={ESCALA_BOTAO_RPG}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  titulo: {
    fontFamily: FONTE_PIXEL,
    color: '#ffd76a',
    fontSize: 9,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  frase: {
    fontFamily: FONTE_PIXEL,
    color: '#f2e3c0',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 16,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});
