/**
 * Tela da loja: fundo preenche o container real; header e rodapé
 * ancorados na arte e na área segura (acima da barra do sistema).
 * O mago e o balão já vêm no header — só o texto entra no balão, com margem.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BOTAO_MADEIRA,
  BOTAO_RPG,
  TIENDA_FUNDO,
  TIENDA_HEADER,
  TIENDA_MARCO_ITEM,
  TIENDA_RODAPE,
} from '../assets';
import { BotaoMadeira } from '../components/BotaoMadeira';
import { FramesAnimator } from '../components/FramesAnimator';
import { MoedaAnimator } from '../components/MoedaAnimator';
import { SpriteAnimator } from '../components/SpriteAnimator';
import { AUMENTO_SAIR_LOJA_PX, ESCALA_BOTAO_RPG, FPS_ITEM_LOJA, FPS_MOEDA } from '../constants';
import { ITENS_LOJA, precoEmMoedas, type ItemLoja } from '../data/itens-loja';
import {
  ehIdSkinGorro,
  ehIdSkinOrb,
  SKINS_GORRO,
  SKINS_ORB,
} from '../data/skins';
import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import { sortearFraseGrayMago } from '../i18n/textos-jogo';
import { carregarMoedasTotais, concederCarta7Dias, gastarMoedas, vidasMaximas } from '../systems/pontuacao';
import {
  comprarSkin,
  desequiparSkin,
  equiparSkin,
  skinComprada,
  skinEquipada,
} from '../systems/skins';
import { tocarSomHitAcerto, tocarSomNovoCoracao } from '../systems/audio-jogo';
import { FONTE_PIXEL } from '../tipografia';

/** Baú, bolsa e pacote: sprite parado (poção e carta continuam a bobar). */
const ITEM_MOEDA_ESTATICO = new Set(['bau-moedas', 'bolsa-moedas', 'pacote-mini-moedas']);

/** Placa amarela do balão novo (sem a seta do mago) na arte 160×76. */
const BALAO_AMARELO_ARTE = { x: 61, y: 21, w: 75, h: 33 };
/** Folga mínima do texto até a borda do balão (0,5 mm). */
const MARGEM_TEXTO_BALAO_PX = 0.5 * (160 / 25.4);
/** Buraco interno da moldura (px da arte 49×51) — o item mora aqui. */
const MARCO_BURACO = { x: 4, y: 18, w: 41, h: 28 };
/** Faixa do header da moldura — nome + descrição pequena. */
const MARCO_HEADER = { x: 5, y: 5, w: 39, h: 12 };
const COLUNAS_LOJA = 3;
const FOLGA_ENTRE_COLUNAS = 8;
const PADDING_SCROLL_H = 10;
/** ~7 mm: desce o fundo para as bordas laterais encostarem no rodapé. */
const DESLOCAMENTO_FUNDO_BAIXO_PX = 27;
/** Estica só na vertical, +5 mm para baixo (largura igual à de antes). */
const EXTRA_ALTURA_FUNDO_PX = 5 * (160 / 25.4);
/** Folga mínima no Android se o inset vier 0 (edge-to-edge + 3 botões). */
const INSET_ANDROID_MINIMO = 48;

interface Props {
  aoFechar: () => void;
  /** Moedas coletadas nesta run (ainda não persistidas — somam na vitrine). */
  moedasSessao: number;
  /** Corações atuais da run (poção só vende se faltar um). */
  vidasAtuais: number;
  /** Compra gasta a sessão: zera o HUD da run para não creditar de novo na morte. */
  aoConsumirSessao: () => void;
  /** Poção restaurou um coração na run. */
  aoRestaurarCoracao: () => void;
}

function insetInferiorSeguro(bottom: number): number {
  if (bottom > 0) return bottom;
  return Platform.OS === 'android' ? INSET_ANDROID_MINIMO : 0;
}

/** Quantas linhas o texto ocupa com quebra por palavra (Press Start 2P). */
function linhasComQuebra(texto: string, charsPorLinha: number): number {
  const limite = Math.max(1, charsPorLinha);
  const palavras = texto.trim().split(/\s+/);
  let linhas = 1;
  let coluna = 0;
  for (const palavra of palavras) {
    const pedaco = coluna === 0 ? palavra.length : palavra.length + 1;
    if (coluna + pedaco <= limite) {
      coluna += pedaco;
      continue;
    }
    linhas += 1;
    coluna = palavra.length;
    while (coluna > limite) {
      linhas += 1;
      coluna -= limite;
    }
  }
  return linhas;
}

/** Press Start 2P: começa grande no balão novo e encolhe só se o texto não couber. */
function fonteDoBalao(
  texto: string,
  larguraCaixa: number,
  alturaCaixa: number,
  /** Frases curtas (compra/equipar): teto = metade do tamanho máximo atual. */
  tetoMetade = false,
): { fontSize: number; lineHeight: number } {
  const innerW = Math.max(8, larguraCaixa);
  const innerH = Math.max(8, alturaCaixa);
  let inicio = Math.min(26, Math.max(10, Math.floor(innerH / 1.18)));
  if (tetoMetade) inicio = Math.max(5, inicio / 2);
  for (let fs = inicio; fs >= 5; fs -= 0.5) {
    const lineHeight = Math.max(fs + 1, Math.round(fs * 1.1));
    const charsPorLinha = Math.max(1, Math.floor(innerW / (fs * 1.02)));
    const linhas = linhasComQuebra(texto, charsPorLinha);
    if (linhas * lineHeight <= innerH) {
      return { fontSize: fs, lineHeight };
    }
  }
  return { fontSize: 5, lineHeight: 6 };
}

export function TiendaScreen({
  aoFechar,
  moedasSessao,
  vidasAtuais,
  aoConsumirSessao,
  aoRestaurarCoracao,
}: Props) {
  const { idioma, t } = useTextosJogo();
  const janela = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [tamanho, setTamanho] = useState({
    largura: janela.width,
    altura: janela.height,
  });
  const [frase, setFrase] = useState(() => sortearFraseGrayMago(idioma));
  // Compra / equipar / desequipar: fonte no máximo pela metade (frases curtas).
  const [tetoFonteMetade, setTetoFonteMetade] = useState(false);
  const [moedasTotais, setMoedasTotais] = useState<number | null>(null);
  const [comprando, setComprando] = useState(false);
  const [vidas, setVidas] = useState(vidasAtuais);
  // Re-renderiza os cartões quando o inventário de skins muda.
  const [, setVersaoSkins] = useState(0);

  useEffect(() => {
    let ativo = true;
    carregarMoedasTotais().then((valor) => {
      if (ativo) setMoedasTotais(valor);
    });
    return () => {
      ativo = false;
    };
  }, []);

  async function comprarItem(item: ItemLoja) {
    const preco = precoEmMoedas(item.id);
    if (preco == null || comprando) return;
    if (item.skin && skinComprada(item.skin)) return;
    if (item.id === 'pocion-vida' && vidas >= vidasMaximas()) {
      tocarSomHitAcerto();
      setTetoFonteMetade(false);
      setFrase(t.loja.vidaCheia);
      return;
    }
    setComprando(true);
    const resultado = await gastarMoedas(preco, moedasSessao);
    if (!resultado.ok) {
      setComprando(false);
      tocarSomHitAcerto();
      setTetoFonteMetade(false);
      setFrase(t.loja.semMoedas);
      return;
    }
    if (item.id === 'pocion-vida') {
      setVidas((atual) => Math.min(vidasMaximas(), atual + 1));
      aoRestaurarCoracao();
      tocarSomNovoCoracao();
    }
    if (item.id === 'carta-7dias') {
      await concederCarta7Dias();
      // 2 corações cheios → o terceiro entra na hora. Ferido continua ferido.
      if (vidas >= 2 && vidas < vidasMaximas()) {
        setVidas(vidasMaximas());
        aoRestaurarCoracao();
      }
      tocarSomNovoCoracao();
    }
    if (item.skin) {
      comprarSkin(item.skin);
      tocarSomNovoCoracao();
      setVersaoSkins((v) => v + 1);
    }
    setMoedasTotais(resultado.novoSaldo);
    aoConsumirSessao();
    setComprando(false);
    setTetoFonteMetade(true);
    setFrase(
      item.skin
        ? t.loja.skinComprada
        : item.id === 'pocion-vida'
          ? t.loja.pocaoOk
          : item.id === 'carta-7dias'
            ? t.loja.cartaOk
            : t.loja.compraOk,
    );
  }

  /**
   * Skin já comprada: Equipar / Tirar. A primeira compra passa por comprarItem.
   */
  function tocarSkin(item: ItemLoja) {
    const id = item.skin;
    if (!id || !skinComprada(id)) return;
    if (skinEquipada(id)) {
      desequiparSkin(id);
      tocarSomHitAcerto();
      setTetoFonteMetade(true);
      setFrase(t.loja.skinRemovida);
    } else {
      equiparSkin(id);
      tocarSomNovoCoracao();
      setTetoFonteMetade(true);
      setFrase(t.loja.skinEquipada);
    }
    setVersaoSkins((v) => v + 1);
  }

  function aoMedir(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    if (width === tamanho.largura && height === tamanho.altura) return;
    setTamanho({ largura: width, altura: height });
  }

  const larguraTela = tamanho.largura;
  const insetBottom = insetInferiorSeguro(insets.bottom);
  /** Largura = tela; altura pela proporção da arte + 5 mm só para baixo. */
  const alturaFundo = Math.round(
    (TIENDA_FUNDO.altura / TIENDA_FUNDO.largura) * larguraTela + EXTRA_ALTURA_FUNDO_PX,
  );

  const escalaUi = larguraTela / TIENDA_HEADER.largura;
  const alturaHeader = Math.round(TIENDA_HEADER.altura * escalaUi);
  const alturaRodape = Math.round(TIENDA_RODAPE.altura * escalaUi);
  // Sair: sprite RPG, +4 mm sobre o tamanho atual, sem estourar o rodapé.
  const escalaSairAntiga = Math.min(
    0.95,
    (alturaRodape * 0.72) / BOTAO_MADEIRA.alturaFrame,
  );
  const larguraSairAlvo =
    BOTAO_MADEIRA.larguraFrame * escalaSairAntiga + AUMENTO_SAIR_LOJA_PX;
  const alturaSairAlvo =
    BOTAO_MADEIRA.alturaFrame * escalaSairAntiga + AUMENTO_SAIR_LOJA_PX;
  const escalaSair = Math.min(
    larguraSairAlvo / BOTAO_RPG.larguraFrame,
    alturaSairAlvo / BOTAO_RPG.alturaFrame,
    (alturaRodape * 0.98) / BOTAO_RPG.alturaFrame,
  );

  const margem = MARGEM_TEXTO_BALAO_PX;
  const leftBalao =
    Math.round((BALAO_AMARELO_ARTE.x / TIENDA_HEADER.largura) * larguraTela) + margem;
  const topBalao =
    Math.round((BALAO_AMARELO_ARTE.y / TIENDA_HEADER.altura) * alturaHeader) + margem;
  const larguraBalao = Math.max(
    8,
    Math.round((BALAO_AMARELO_ARTE.w / TIENDA_HEADER.largura) * larguraTela) - margem * 2,
  );
  const alturaBalao = Math.max(
    8,
    Math.round((BALAO_AMARELO_ARTE.h / TIENDA_HEADER.altura) * alturaHeader) - margem * 2,
  );
  const tipoBalao = fonteDoBalao(frase, larguraBalao, alturaBalao, tetoFonteMetade);

  const larguraColuna =
    (larguraTela - PADDING_SCROLL_H * 2 - FOLGA_ENTRE_COLUNAS * (COLUNAS_LOJA - 1)) /
    COLUNAS_LOJA;
  const escalaMarco = larguraColuna / TIENDA_MARCO_ITEM.largura;
  const larguraMarco = Math.round(TIENDA_MARCO_ITEM.largura * escalaMarco);
  const alturaMarco = Math.round(TIENDA_MARCO_ITEM.altura * escalaMarco);
  const escalaBotaoItem = Math.min(
    ESCALA_BOTAO_RPG,
    (larguraMarco * 0.94) / BOTAO_RPG.larguraFrame,
  );

  const linhas = useMemo(() => {
    const grupos: ItemLoja[][] = [];
    for (let i = 0; i < ITENS_LOJA.length; i += COLUNAS_LOJA) {
      grupos.push(ITENS_LOJA.slice(i, i + COLUNAS_LOJA));
    }
    return grupos;
  }, []);

  return (
    <View style={estilos.raiz} onLayout={aoMedir}>
      {/* Cortina opaca na barra do sistema: o scroll não atravessa os 3 botões. */}
      <View
        pointerEvents="none"
        style={[estilos.cortinaSistema, { height: insetBottom }]}
      />

      <View style={[estilos.palco, { bottom: insetBottom }]}>
        <View style={estilos.janelaFundo}>
          <Image
            source={TIENDA_FUNDO.imagem}
            style={{
              position: 'absolute',
              left: 0,
              top: DESLOCAMENTO_FUNDO_BAIXO_PX,
              width: '100%',
              height: alturaFundo,
            }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
        </View>

      <ScrollView
        style={estilos.scroll}
        contentContainerStyle={{
          paddingTop: alturaHeader + 10,
          paddingBottom: alturaRodape + 16,
          paddingHorizontal: PADDING_SCROLL_H,
        }}
        showsVerticalScrollIndicator={false}
      >
        {linhas.map((linha, indiceLinha) => (
          <View key={`linha-${indiceLinha}`} style={estilos.linhaItens}>
            {linha.map((item) => (
              <CartaoItem
                key={item.id}
                item={item}
                larguraMarco={larguraMarco}
                alturaMarco={alturaMarco}
                escalaMarco={escalaMarco}
                escalaBotao={escalaBotaoItem}
                vidaCheia={item.id === 'pocion-vida' && vidas >= vidasMaximas()}
                aoComprar={() => void comprarItem(item)}
                aoTocarSkin={() => tocarSkin(item)}
                aoVidaCheia={() => {
                  tocarSomHitAcerto();
                  setTetoFonteMetade(false);
                  setFrase(t.loja.vidaCheia);
                }}
              />
            ))}
            {linha.length < COLUNAS_LOJA &&
              Array.from({ length: COLUNAS_LOJA - linha.length }).map((_, i) => (
                <View key={`vazio-${i}`} style={{ width: larguraMarco }} />
              ))}
          </View>
        ))}
      </ScrollView>

      <View style={[estilos.header, { height: alturaHeader }]} pointerEvents="box-none">
        <Image
          source={TIENDA_HEADER.imagem}
          style={{ width: larguraTela, height: alturaHeader }}
          resizeMode="stretch"
          resizeMethod="scale"
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: leftBalao,
            top: topBalao,
            width: larguraBalao,
            height: alturaBalao,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Text
            style={[
              estilos.textoBalao,
              { fontSize: tipoBalao.fontSize, lineHeight: tipoBalao.lineHeight },
            ]}
            allowFontScaling={false}
          >
            {frase}
          </Text>
        </View>
        <View style={estilos.saldoTotal} pointerEvents="none">
          <MoedaAnimator fps={FPS_MOEDA} escala={0.55} />
          <Text style={estilos.textoSaldo}>
            {moedasTotais === null ? '…' : moedasTotais + moedasSessao}
          </Text>
        </View>
      </View>

      <View
        style={[estilos.rodape, { height: alturaRodape }]}
        pointerEvents="box-none"
      >
        <Image
          source={TIENDA_RODAPE.imagem}
          style={{ width: '100%', height: alturaRodape }}
          resizeMode="stretch"
          resizeMethod="scale"
        />
        <View style={estilos.botaoSairSobreRodape}>
          <BotaoMadeira
            rotulo={t.loja.sair}
            aoPressionar={aoFechar}
            modelo="rpg"
            escala={escalaSair}
          />
        </View>
      </View>
      </View>
    </View>
  );
}

function CartaoItem({
  item,
  larguraMarco,
  alturaMarco,
  escalaMarco,
  escalaBotao,
  vidaCheia,
  aoComprar,
  aoTocarSkin,
  aoVidaCheia,
}: {
  item: ItemLoja;
  larguraMarco: number;
  alturaMarco: number;
  escalaMarco: number;
  escalaBotao: number;
  vidaCheia: boolean;
  aoComprar: () => void;
  aoTocarSkin: () => void;
  aoVidaCheia: () => void;
}) {
  const { t } = useTextosJogo();
  const textosItem = t.itens[item.id] ?? { nome: item.nome, descricao: item.descricao };
  const buracoLeft = Math.round(MARCO_BURACO.x * escalaMarco);
  const buracoTop = Math.round(MARCO_BURACO.y * escalaMarco);
  const buracoW = Math.round(MARCO_BURACO.w * escalaMarco);
  const buracoH = Math.round(MARCO_BURACO.h * escalaMarco);
  const headerLeft = Math.round(MARCO_HEADER.x * escalaMarco);
  const headerTop = Math.round(MARCO_HEADER.y * escalaMarco);
  const headerW = Math.round(MARCO_HEADER.w * escalaMarco);
  const headerH = Math.round(MARCO_HEADER.h * escalaMarco);

  // Skins: gorro fica estático na vitrine; orb roda a animação completa.
  const skinGorro = item.skin && ehIdSkinGorro(item.skin) ? SKINS_GORRO[item.skin] : null;
  const skinOrb = item.skin && ehIdSkinOrb(item.skin) ? SKINS_ORB[item.skin] : null;
  const tamanhoItem = skinGorro
    ? { largura: skinGorro.icone.largura, altura: skinGorro.icone.altura }
    : skinOrb
      ? skinOrb.tamanhoNormal
      : { largura: item.arte!.larguraFrame, altura: item.arte!.alturaFrame };
  const escalaItem = Math.min(
    (buracoW * 0.92) / tamanhoItem.largura,
    (buracoH * 0.92) / tamanhoItem.altura,
  );

  const precoSkin = item.skin ? precoEmMoedas(item.id) : null;
  const rotuloSkin = item.skin
    ? !skinComprada(item.skin)
      ? precoSkin != null
        ? t.loja.comprar(precoSkin)
        : t.loja.comingSoon
      : skinEquipada(item.skin)
        ? t.loja.desequipar
        : t.loja.equipar
    : null;

  return (
    <View style={[estilos.cartao, { width: larguraMarco }]}>
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
            left: headerLeft,
            top: headerTop,
            width: headerW,
            height: headerH,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            paddingHorizontal: 2,
          }}
        >
          <Text
            style={[
              estilos.nomeNoHeader,
              item.tipo === 'skin' && estilos.nomeSkinNoHeader,
              textosItem.nome.includes('\n') && estilos.nomeSkinDuasLinhas,
            ]}
            numberOfLines={item.tipo === 'skin' ? 2 : 1}
            adjustsFontSizeToFit={!textosItem.nome.includes('\n')}
            minimumFontScale={item.tipo === 'skin' ? 0.75 : 0.7}
          >
            {textosItem.nome}
          </Text>
          {item.tipo !== 'skin' ? (
            <Text style={estilos.descNoHeader} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
              {textosItem.descricao}
            </Text>
          ) : null}
        </View>
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
          {skinGorro ? (
            <Image
              source={skinGorro.icone.imagem}
              style={{
                width: Math.round(skinGorro.icone.largura * escalaItem),
                height: Math.round(skinGorro.icone.altura * escalaItem),
              }}
              resizeMode="stretch"
              resizeMethod="scale"
            />
          ) : skinOrb ? (
            <FramesAnimator
              frames={skinOrb.framesNormal}
              fps={skinOrb.fps}
              larguraFrame={skinOrb.tamanhoNormal.largura}
              alturaFrame={skinOrb.tamanhoNormal.altura}
              escala={escalaItem}
            />
          ) : (
            <SpriteAnimator
              sheet={item.arte!}
              fps={FPS_ITEM_LOJA}
              escala={escalaItem}
              frameFixo={ITEM_MOEDA_ESTATICO.has(item.id) ? 0 : undefined}
            />
          )}
        </View>
      </View>
      <View style={estilos.faixaBotao}>
        <BotaoMadeira
          rotulo={
            rotuloSkin ??
            (precoEmMoedas(item.id) != null
              ? t.loja.comprar(precoEmMoedas(item.id)!)
              : t.loja.comingSoon)
          }
          aoPressionar={
            item.skin
              ? skinComprada(item.skin)
                ? aoTocarSkin
                : precoEmMoedas(item.id) != null
                  ? aoComprar
                  : () => {}
              : vidaCheia
                ? aoVidaCheia
                : precoEmMoedas(item.id) != null
                  ? aoComprar
                  : () => {}
          }
          escala={escalaBotao}
          modelo="rpg"
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    overflow: 'hidden',
    backgroundColor: '#22130e',
  },
  cortinaSistema: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#120c0a',
    zIndex: 4,
  },
  palco: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  janelaFundo: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: '#22130e',
  },
  scroll: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  textoBalao: {
    fontFamily: FONTE_PIXEL,
    color: '#140c08',
    textAlign: 'center',
    includeFontPadding: false,
  },
  saldoTotal: {
    position: 'absolute',
    top: 6,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(20, 12, 8, 0.72)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5a4030',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  textoSaldo: {
    fontFamily: FONTE_PIXEL,
    color: '#ffd76a',
    fontSize: 9,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  rodape: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  botaoSairSobreRodape: {
    ...StyleSheet.absoluteFillObject,
    top: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linhaItens: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  cartao: {
    alignItems: 'center',
  },
  nomeNoHeader: {
    fontFamily: FONTE_PIXEL,
    color: '#f2e3c0',
    fontSize: 5,
    textAlign: 'center',
    lineHeight: 7,
    includeFontPadding: false,
  },
  nomeSkinNoHeader: {
    fontSize: 8,
    lineHeight: 10,
  },
  nomeSkinDuasLinhas: {
    fontSize: 7,
    lineHeight: 9,
  },
  descNoHeader: {
    marginTop: 1,
    fontFamily: FONTE_PIXEL,
    color: '#c4b08a',
    fontSize: 4,
    textAlign: 'center',
    lineHeight: 6,
    includeFontPadding: false,
  },
  faixaBotao: {
    marginTop: 6,
  },
});
