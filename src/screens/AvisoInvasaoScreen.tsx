/**
 * Tela intermediária pós-plataforma fake: glitch + marco + Gray Mage.
 * Aprender abre a aula local (AulaMagoScreen).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Keyboard, KeyboardAvoidingView, LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTAO_RPG, GLICH_HAKEO_FRAMES, GRAY_MAGO_AVISO, MARCO_TELA_INTERMEDIA } from '../assets';
import { BotaoMadeira } from '../components/BotaoMadeira';
import { ESCALA_BOTAO_RPG } from '../constants';
import { buscarTecnicaPorUrl } from '../data/tecnicas-boss';
import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import type { TextosJogo } from '../i18n/textos-jogo';
import type { FaseAvisoInvasao } from '../systems/persistencia-invasao';
import { FONTE_PIXEL } from '../tipografia';
import { pararSomTiping, tocarSomTiping } from '../systems/audio-jogo';

const FPS_GLITCH_AVISO = 8;
const PX_POR_MM = 160 / 25.4;
/** Folga lateral: 1 mm. O PNG inteiro entra, sem cortar. */
const MARGEM_LADO_PX = 1 * PX_POR_MM;
/** Estica 2 mm para cima e 2 mm para baixo além da proporção. */
const EXTRA_VERTICAL_PX = 2 * PX_POR_MM;
/** Borda dourada da arte 405×641 — conteúdo não cobre o recorte. */
const BORDA_MARCO_ARTE = { x: 36, y: 38 };
/** Folga do texto até a borda do balão (igual à loja). */
const MARGEM_TEXTO_BALAO_PX = 0.5 * PX_POR_MM;
/** Balão cresce 1 mm em cada lado e 5 mm para baixo. */
const EXTRA_BALAO_LATERAL_PX = 1 * PX_POR_MM;
const EXTRA_BALAO_BAIXO_PX = 5 * PX_POR_MM;
/** Encolhe o balão: folga no topo, −2 mm em cada lado; respiro com o mago. */
const MENOS_BALAO_TOPO_PX = 4 * PX_POR_MM;
const MENOS_BALAO_LATERAL_PX = 2 * PX_POR_MM;
const SOBE_BALAO_PX = 10 * PX_POR_MM;
/** Miolo amarelo do balão da loja. */
const COR_BALAO_LOJA = '#c3ae8b';
const COR_BORDA_BALAO = '#2a1608';
const COR_TEXTO_BALAO = '#140c08';
/** Tag do ataque (e-mail, botnet, Pix…) — só ela fica azul no balão. */
const COR_TAG_BOSS = '#1557c0';
/** Cadência da digitação: 30% mais rápida que o ritmo anterior. */
const MS_POR_LETRA = Math.round(128 * 0.7 * 0.85 * 0.9 * 0.95 / 1.3);
/** Espera 1 s com o texto completo visível antes da próxima parte. */
const PAUSA_ENTRE_PARTES_MS = 1000;
const PAUSA_APAGAR_MS = 220;
const MS_FADE_SAIDA = 300;
const MS_ESPERA_BOSS = 300;
/** Rabinho do balão: 3 mm à direita do centro. */
const DESLOCA_RABINHO_PX = 3 * PX_POR_MM;
/** +13 mm no oco e no sprite (+2 mm neste ajuste). */
const EXTRA_HUECO_MAGO_PX = 13 * PX_POR_MM;
/** Encolhe o vão mago↔balão (2 mm + 2 mm). */
const APROXIMA_BALAO_PX = 4 * PX_POR_MM;
/** Encolhe o vão mago↔botões. */
const APROXIMA_BOTOES_PX = 3 * PX_POR_MM;
/**
 * Sobe o mago 14 mm — máximo fixo; em telas menores escala proporcional
 * ao marcoH para que o balão não sobreponha a cabeça do mago.
 */
const SOBE_MAGO_PX_MAX = 14 * PX_POR_MM;
/** Sobe o balão 10 mm — máximo fixo; escala igual ao mago. */
const SOBE_BALAO_PX_MAX = 10 * PX_POR_MM;
const SOBE_CONTINUAR_PX = 4 * PX_POR_MM;

export type ModoAvisoInvasao = FaseAvisoInvasao | 'ja_conhece' | 'vitoria' | 'pronto_encanto';

interface Props {
  bossUrl: string;
  modo: ModoAvisoInvasao;
  /** Caminho para o chat local do mago cinza (tela ainda não existe). */
  aoConsultarOraculo?: () => void;
  aoLutarSemEncanto: () => void;
  aoContinuarComEncanto: () => void;
  /** Vitória: sem botão; toque ou pausa fecha o aviso. */
  aoSairDaVitoria?: () => void;
  /** Mantido por compatibilidade; a caixa de palavra-chave saiu desta tela. */
  aoValidarFlag?: (flagDigitada: string) => boolean;
}

type PartesBalao = {
  parte1: string;
  parte2: string;
  parte3: string;
  parte4: string;
  parte5: string;
  parte6: string;
  /** Tag específica do ataque neste boss — pintada de azul no balão. */
  tagDestaque?: string;
};

type TrechoBalao = { texto: string; destaque: boolean };

/** Parte o texto visível para pintar só a tag (também no meio da digitação). */
function trechosComTag(texto: string, tag: string | undefined): TrechoBalao[] {
  if (!tag) {
    return [{ texto, destaque: false }];
  }
  const indice = texto.indexOf(tag);
  if (indice >= 0) {
    return [
      { texto: texto.slice(0, indice), destaque: false },
      { texto: tag, destaque: true },
      { texto: texto.slice(indice + tag.length), destaque: false },
    ].filter((trecho) => trecho.texto.length > 0);
  }
  for (let n = Math.min(tag.length - 1, texto.length); n >= 1; n--) {
    if (texto.endsWith(tag.slice(0, n))) {
      return [
        { texto: texto.slice(0, texto.length - n), destaque: false },
        { texto: tag.slice(0, n), destaque: true },
      ].filter((trecho) => trecho.texto.length > 0);
    }
  }
  return [{ texto, destaque: false }];
}

function partesDoBalao(modo: ModoAvisoInvasao, bossUrl: string, t: TextosJogo): PartesBalao {
  const tecnica = buscarTecnicaPorUrl(bossUrl);
  const nomeBoss = tecnica?.nomeBoss ?? 'Phishing-Man';
  if (modo === 'vitoria') {
    return t.aviso.balaoVitoria(nomeBoss);
  }
  if (modo === 'pronto_encanto') {
    return t.aviso.balaoProntoEncanto;
  }
  if (modo === 'ja_conhece') {
    return t.aviso.balaoJaConhece(nomeBoss);
  }
  if (modo === 'retorno_oraculo') {
    return t.aviso.balaoRetorno;
  }
  const nomeTecnica = tecnica?.nomeTecnica ?? 'e-mail';
  return { ...t.aviso.balaoPrimeiroContato(nomeBoss, nomeTecnica), tagDestaque: nomeTecnica };
}

function textoMaisLongo(partes: PartesBalao): string {
  return [
    partes.parte1,
    partes.parte2,
    partes.parte3,
    partes.parte4,
    partes.parte5,
    partes.parte6,
  ].reduce(
    (maior, atual) => (atual.length > maior.length ? atual : maior),
  );
}

function linhasComQuebra(texto: string, charsPorLinha: number): number {
  const limite = Math.max(1, charsPorLinha);
  const paragrafos = texto.split('\n');
  let linhas = 0;
  for (const paragrafo of paragrafos) {
    const palavras = paragrafo.trim().split(/\s+/).filter(Boolean);
    if (palavras.length === 0) {
      linhas += 1;
      continue;
    }
    let coluna = 0;
    let linhasDeste = 1;
    for (const palavra of palavras) {
      const pedaco = coluna === 0 ? palavra.length : palavra.length + 1;
      if (coluna + pedaco <= limite) {
        coluna += pedaco;
        continue;
      }
      linhasDeste += 1;
      coluna = palavra.length;
      while (coluna > limite) {
        linhasDeste += 1;
        coluna -= limite;
      }
    }
    linhas += linhasDeste;
  }
  return Math.max(1, linhas);
}

/** Fonte grande e grossa; encolhe só se a frase não couber no balão. */
function fonteDoBalao(
  texto: string,
  larguraCaixa: number,
  alturaCaixa: number,
): { fontSize: number; lineHeight: number } {
  const innerW = Math.max(8, larguraCaixa);
  const innerH = Math.max(8, alturaCaixa);
  // Começa um pouco maior para ocupar o miolo; encolhe se não couber nas bordas.
  const inicio = Math.min(24, Math.max(14, Math.floor(innerH / 1.05)));
  for (let fs = inicio; fs >= 6; fs -= 0.5) {
    const lineHeight = Math.max(fs + 1, Math.round(fs * 1.15));
    const charsPorLinha = Math.max(1, Math.floor(innerW / (fs * 1.05)));
    const linhas = linhasComQuebra(texto, charsPorLinha);
    if (linhas * lineHeight <= innerH) {
      return { fontSize: fs, lineHeight };
    }
  }
  return { fontSize: 6, lineHeight: 9 };
}

/** Três quadrados empilhados: preenchem o container real (bordas do celular). */
export function FundoGlitchAnimado() {
  const [frame, setFrame] = useState(0);
  const total = GLICH_HAKEO_FRAMES.length;

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFrame((atual) => (atual + 1) % total);
    }, 1000 / FPS_GLITCH_AVISO);
    return () => clearInterval(intervalo);
  }, [total]);

  const fonte = GLICH_HAKEO_FRAMES[frame];

  return (
    <View pointerEvents="none" style={estilos.fundoGlitch}>
      {[0, 1, 2].map((indice) => (
        <View key={indice} style={estilos.faixaGlitch}>
          <Image
            source={fonte}
            style={StyleSheet.absoluteFill}
            resizeMode="stretch"
            resizeMethod="scale"
          />
        </View>
      ))}
    </View>
  );
}

export function AvisoInvasaoScreen({
  bossUrl,
  modo,
  aoConsultarOraculo,
  aoLutarSemEncanto,
  aoContinuarComEncanto,
  aoSairDaVitoria,
  aoValidarFlag,
}: Props) {
  const { t } = useTextosJogo();
  const insets = useSafeAreaInsets();
  const [partes, setPartes] = useState<PartesBalao>(() => partesDoBalao(modo, bossUrl, t));
  const [textoVisivel, setTextoVisivel] = useState('');
  const [caixaBalao, setCaixaBalao] = useState({ largura: 0, altura: 0 });
  const [caixaMago, setCaixaMago] = useState({ largura: 0, altura: 0 });
  const [caixaRaiz, setCaixaRaiz] = useState({ largura: 0, altura: 0 });
  const [frasesProntas, setFrasesProntas] = useState(false);
  const [textoEncanto, setTextoEncanto] = useState('');
  const opacidadeSaida = useRef(new Animated.Value(1)).current;
  const saindoRef = useRef(false);
  const frasesProntasRef = useRef(false);
  const pulosPendentesRef = useRef(0);
  const [alturaAcoes, setAlturaAcoes] = useState(96);
  const campoEncantoRef = useRef<TextInput>(null);

  useEffect(() => {
    setPartes(partesDoBalao(modo, bossUrl, t));
  }, [modo, bossUrl, t]);

  useEffect(() => {
    let cancelado = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;
    pulosPendentesRef.current = 0;
    frasesProntasRef.current = false;
    setTextoVisivel('');
    setFrasesProntas(false);

    function esperar(ms: number): Promise<void> {
      return new Promise((resolve) => {
        const inicio = Date.now();
        const tick = () => {
          if (cancelado) {
            resolve();
            return;
          }
          if (pulosPendentesRef.current > 0) {
            pulosPendentesRef.current -= 1;
            resolve();
            return;
          }
          const resto = ms - (Date.now() - inicio);
          if (resto <= 0) {
            resolve();
            return;
          }
          timer = setTimeout(tick, Math.min(32, resto));
        };
        tick();
      });
    }

    function digitar(frase: string): Promise<void> {
      return new Promise((resolve) => {
        if (!frase) {
          resolve();
          return;
        }
        tocarSomTiping();
        const inicioMs = Date.now();
        const passo = () => {
          if (cancelado) {
            resolve();
            return;
          }
          if (pulosPendentesRef.current > 0) {
            pulosPendentesRef.current -= 1;
            setTextoVisivel(frase);
            pararSomTiping();
            resolve();
            return;
          }
          const n = Math.min(
            frase.length,
            Math.floor((Date.now() - inicioMs) / MS_POR_LETRA) + 1,
          );
          setTextoVisivel(frase.slice(0, n));
          if (n >= frase.length) {
            pararSomTiping();
            resolve();
            return;
          }
          raf = requestAnimationFrame(passo);
        };
        raf = requestAnimationFrame(passo);
      });
    }

    async function mostrarParte(frase: string, apagarDepois: boolean) {
      if (!frase) return;
      await digitar(frase);
      if (cancelado) return;
      pararSomTiping();
      if (!apagarDepois) return;
      await esperar(PAUSA_ENTRE_PARTES_MS);
      if (cancelado) return;
      setTextoVisivel('');
      await esperar(PAUSA_APAGAR_MS);
    }

    async function rodar() {
      const frases = [
        partes.parte1,
        partes.parte2,
        partes.parte3,
        partes.parte4,
        partes.parte5,
        partes.parte6,
      ].filter(
        (frase) => frase.length > 0,
      );
      for (let i = 0; i < frases.length; i++) {
        if (cancelado) return;
        await mostrarParte(frases[i], i < frases.length - 1);
        if (cancelado) return;
      }
      pararSomTiping();
      frasesProntasRef.current = true;
      setFrasesProntas(true);
    }

    void rodar();
    return () => {
      cancelado = true;
      if (timer) clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      pararSomTiping();
    };
  }, [partes.parte1, partes.parte2, partes.parte3, partes.parte4, partes.parte5, partes.parte6]);

  useEffect(() => {
    if (modo !== 'vitoria' || !frasesProntas) return;
    const timer = setTimeout(() => aoSairDaVitoria?.(), 1800);
    return () => clearTimeout(timer);
  }, [modo, frasesProntas, aoSairDaVitoria]);

  function aoMedirRaiz(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    if (width === caixaRaiz.largura && height === caixaRaiz.altura) return;
    setCaixaRaiz({ largura: width, altura: height });
  }

  function aoMedirBalao(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    if (width === caixaBalao.largura && height === caixaBalao.altura) return;
    setCaixaBalao({ largura: width, altura: height });
  }

  function aoMedirMago(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    if (width === caixaMago.largura && height === caixaMago.altura) return;
    setCaixaMago({ largura: width, altura: height });
  }

  const textoParaMedir = textoMaisLongo(partes);
  const tipoBalao = fonteDoBalao(
    textoParaMedir,
    Math.max(8, caixaBalao.largura),
    Math.max(8, caixaBalao.altura),
  );

  const escalaMago =
    caixaMago.largura > 0 && caixaMago.altura > 0
      ? Math.min(
          caixaMago.largura / GRAY_MAGO_AVISO.largura,
          caixaMago.altura / GRAY_MAGO_AVISO.altura,
          2.8,
        )
      : 2.2;
  // +13 mm no desenho e no oco.
  const alturaMago = GRAY_MAGO_AVISO.altura * escalaMago + EXTRA_HUECO_MAGO_PX;
  const larguraMago =
    (GRAY_MAGO_AVISO.largura / GRAY_MAGO_AVISO.altura) * alturaMago;
  // Centro deixava metade da folga embaixo; metade disso = 1/4 da folga.
  const folgaMagoBotoes =
    caixaMago.altura > 0
      ? Math.max(0, (caixaMago.altura - alturaMago) / 4)
      : 0;

  const disponivelW = Math.max(0, caixaRaiz.largura - 2 * MARGEM_LADO_PX);
  const disponivelH = Math.max(0, caixaRaiz.altura - insets.top - insets.bottom);
  let marcoW = 0;
  let marcoH = 0;
  if (disponivelW > 0 && disponivelH > 0) {
    const escalaLargura = disponivelW / MARCO_TELA_INTERMEDIA.largura;
    const alturaComEstique =
      MARCO_TELA_INTERMEDIA.altura * escalaLargura + 2 * EXTRA_VERTICAL_PX;
    if (alturaComEstique <= disponivelH) {
      marcoW = MARCO_TELA_INTERMEDIA.largura * escalaLargura;
      marcoH = alturaComEstique;
    } else {
      const escala = Math.min(
        escalaLargura,
        (disponivelH - 2 * EXTRA_VERTICAL_PX) / MARCO_TELA_INTERMEDIA.altura,
      );
      marcoW = MARCO_TELA_INTERMEDIA.largura * Math.max(0, escala);
      marcoH = MARCO_TELA_INTERMEDIA.altura * Math.max(0, escala) + 2 * EXTRA_VERTICAL_PX;
    }
  }
  const escalaMarco = marcoW > 0 ? marcoW / MARCO_TELA_INTERMEDIA.largura : 0;
  const padX = (BORDA_MARCO_ARTE.x / MARCO_TELA_INTERMEDIA.largura) * marcoW;
  const padY = (BORDA_MARCO_ARTE.y / MARCO_TELA_INTERMEDIA.altura) * marcoH;
  const larguraMiolo = Math.max(0, marcoW - padX * 2);
  const larguraBalao = Math.max(
    8,
    Math.min(
      larguraMiolo,
      larguraMiolo * 0.92 + EXTRA_BALAO_LATERAL_PX * 2,
    ) - MENOS_BALAO_LATERAL_PX * 2,
  );
  // Espaçamento mago↔balão proporcional ao frame — evita sobreposição em telas pequenas.
  const sobeMago = marcoH > 0 ? Math.min(SOBE_MAGO_PX_MAX, marcoH * 0.135) : SOBE_MAGO_PX_MAX;
  const sobeBalao = marcoH > 0 ? Math.min(SOBE_BALAO_PX_MAX, marcoH * 0.095) : SOBE_BALAO_PX_MAX;
  const escalaBotoes = Math.min(
    ESCALA_BOTAO_RPG,
    larguraMiolo > 0 ? larguraMiolo / BOTAO_RPG.larguraFrame : ESCALA_BOTAO_RPG,
  );

  function aoToquePularDialogo() {
    if (frasesProntasRef.current || saindoRef.current) return;
    pulosPendentesRef.current += 1;
  }

  function aoMedirAcoes(evento: LayoutChangeEvent) {
    const altura = evento.nativeEvent.layout.height;
    if (altura > 0 && Math.abs(altura - alturaAcoes) > 1) {
      setAlturaAcoes(altura);
    }
  }

  function aoLutar() {
    if (modo === 'ja_conhece') {
      aoContinuarComEncanto();
      return;
    }
    aoLutarSemEncanto();
  }

  function confirmarEncanto() {
    Keyboard.dismiss();
    campoEncantoRef.current?.blur();
    if (saindoRef.current) return;
    if (!(aoValidarFlag && aoValidarFlag(textoEncanto))) {
      setPartes(t.aviso.encantoErrado);
      setTextoEncanto('');
      return;
    }
    saindoRef.current = true;
    Animated.timing(opacidadeSaida, {
      toValue: 0,
      duration: MS_FADE_SAIDA,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => aoContinuarComEncanto(), MS_ESPERA_BOSS);
    });
  }

  function fecharTecladoEncanto() {
    campoEncantoRef.current?.blur();
    Keyboard.dismiss();
  }

  return (
    <KeyboardAvoidingView
      style={estilos.raiz}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
    <Animated.View style={[estilos.raiz, { opacity: opacidadeSaida }]}>
    <View style={estilos.raiz} onLayout={aoMedirRaiz}>
      <FundoGlitchAnimado />
      {!frasesProntas && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPressIn={aoToquePularDialogo}
          accessibilityRole="button"
          accessibilityLabel={t.aviso.continuar}
        />
      )}

      {escalaMarco > 0 && (
        <View
          style={[
            estilos.palcoMarco,
            {
              width: marcoW,
              height: marcoH,
              left: (caixaRaiz.largura - marcoW) / 2,
              top: insets.top + (disponivelH - marcoH) / 2,
            },
          ]}
        >
          <Image
            pointerEvents="none"
            source={MARCO_TELA_INTERMEDIA.imagem}
            style={{ width: marcoW, height: marcoH }}
            resizeMode="stretch"
            resizeMethod="scale"
          />

          <View
            pointerEvents="box-none"
            style={[
              estilos.miolo,
              {
                paddingHorizontal: padX,
                paddingTop: padY,
                paddingBottom: padY,
              },
            ]}
          >
            <View
              pointerEvents="none"
              style={estilos.grupoComBotoes}
            >
                <View style={[estilos.faixaBalao, { paddingBottom: Math.max(0, sobeBalao - APROXIMA_BALAO_PX) }]}>
                <View style={[estilos.balao, { width: larguraBalao }]}>
                  <View style={estilos.caixaTextoBalao} onLayout={aoMedirBalao}>
                    <Text
                      style={[
                        estilos.textoBalao,
                        { fontSize: tipoBalao.fontSize, lineHeight: tipoBalao.lineHeight },
                      ]}
                      allowFontScaling={false}
                    >
                      {trechosComTag(textoVisivel, partes.tagDestaque).map((trecho, i) => (
                        <Text
                          key={`trecho-balao-${i}`}
                          style={trecho.destaque ? { color: COR_TAG_BOSS } : undefined}
                        >
                          {trecho.texto}
                        </Text>
                      ))}
                    </Text>
                  </View>
                </View>
                <View style={estilos.rabinho} />
              </View>

              <View
                style={[
                  estilos.faixaMago,
                  {
                    marginTop: -sobeMago,
                    paddingBottom: folgaMagoBotoes,
                  },
                ]}
                onLayout={aoMedirMago}
              >
                <Image
                  source={GRAY_MAGO_AVISO.imagem}
                  style={{ width: larguraMago, height: alturaMago }}
                  resizeMode="stretch"
                  resizeMethod="scale"
                />
              </View>
            </View>

            {modo !== 'vitoria' ? (
            <View
              pointerEvents="auto"
              onLayout={aoMedirAcoes}
              style={[
                estilos.faixaAcoes,
                modo === 'ja_conhece' && { paddingBottom: 4 + SOBE_CONTINUAR_PX },
                modo === 'pronto_encanto' && { paddingBottom: 4 + SOBE_CONTINUAR_PX },
              ]}
            >
              {modo === 'pronto_encanto' ? (
                <>
                  <TextInput
                    ref={campoEncantoRef}
                    value={textoEncanto}
                    onChangeText={setTextoEncanto}
                    placeholder={t.aviso.placeholderEncanto}
                    placeholderTextColor="#5a4430"
                    autoCapitalize="none"
                    autoCorrect={false}
                    blurOnSubmit
                    style={[estilos.campoEncanto, { width: Math.min(larguraBalao, larguraMiolo - 8) }]}
                    onSubmitEditing={fecharTecladoEncanto}
                    returnKeyType="done"
                  />
                  <View style={estilos.gapBotao} />
                  <BotaoMadeira
                    rotulo={t.aviso.confirmar}
                    aoPressionar={confirmarEncanto}
                    modelo="rpg"
                    escala={escalaBotoes}
                  />
                </>
              ) : modo === 'ja_conhece' ? (
                <BotaoMadeira
                  rotulo={t.aviso.continuar}
                  aoPressionar={aoContinuarComEncanto}
                  modelo="rpg"
                  escala={escalaBotoes}
                  ajusteFontePx={2 * PX_POR_MM}
                />
              ) : (
                <>
                  <BotaoMadeira
                    rotulo={t.aviso.falarComMago}
                    aoPressionar={() => aoConsultarOraculo?.()}
                    modelo="rpg"
                    escala={escalaBotoes}
                  />
                  <View style={estilos.gapBotao} />
                  <BotaoMadeira
                    rotulo={t.aviso.lutarAgora}
                    aoPressionar={aoLutar}
                    modelo="rpg"
                    escala={escalaBotoes}
                  />
                </>
              )}
            </View>
            ) : (
            <View
              pointerEvents="none"
              style={[
                estilos.faixaAcoes,
                {
                  paddingBottom: 4 + SOBE_CONTINUAR_PX,
                  minHeight: BOTAO_RPG.alturaFrame * escalaBotoes * 2 + 10,
                },
              ]}
            />
            )}
          </View>
          {!frasesProntas && (
            <Pressable
              style={[
                estilos.areaPularDialogo,
                { bottom: modo === 'vitoria' ? 0 : alturaAcoes + padY },
              ]}
              onPressIn={aoToquePularDialogo}
              accessibilityRole="button"
              accessibilityLabel={t.aviso.continuar}
            />
          )}
        </View>
      )}

      {modo === 'vitoria' && frasesProntas && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => aoSairDaVitoria?.()}
          accessibilityRole="button"
          accessibilityLabel={t.aviso.continuar}
        />
      )}
    </View>
    </Animated.View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  fundoGlitch: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  faixaGlitch: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  palcoMarco: {
    position: 'absolute',
  },
  areaPularDialogo: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 4,
    elevation: 4,
  },
  miolo: {
    ...StyleSheet.absoluteFillObject,
  },
  grupoComBotoes: {
    flex: 1,
    width: '100%',
  },
  faixaBalao: {
    flexGrow: 1.2,
    flexShrink: 1,
    flexBasis: EXTRA_BALAO_BAIXO_PX,
    minHeight: 72 + EXTRA_BALAO_BAIXO_PX,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: MENOS_BALAO_TOPO_PX,
    // paddingBottom definido via inline style (sobeBalao — responsivo ao marcoH)
  },
  balao: {
    flex: 1,
    backgroundColor: COR_BALAO_LOJA,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: COR_BORDA_BALAO,
    padding: MARGEM_TEXTO_BALAO_PX,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  caixaTextoBalao: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  rabinho: {
    width: 0,
    height: 0,
    marginTop: -4,
    marginLeft: DESLOCA_RABINHO_PX,
    zIndex: 2,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COR_BALAO_LOJA,
  },
  textoBalao: {
    fontFamily: FONTE_PIXEL,
    color: COR_TEXTO_BALAO,
    textAlign: 'center',
    includeFontPadding: false,
  },
  faixaMago: {
    flexGrow: 1.35,
    flexShrink: 1,
    flexBasis: EXTRA_HUECO_MAGO_PX,
    minHeight: 72 + EXTRA_HUECO_MAGO_PX,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  faixaAcoes: {
    flexGrow: 0,
    flexShrink: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -APROXIMA_BOTOES_PX,
    paddingBottom: 4 + SOBE_CONTINUAR_PX,
    zIndex: 6,
    elevation: 8,
  },
  gapBotao: {
    height: 10,
  },
  campoEncanto: {
    backgroundColor: COR_BALAO_LOJA,
    borderWidth: 3,
    borderColor: COR_BORDA_BALAO,
    borderRadius: 8,
    color: COR_TEXTO_BALAO,
    fontFamily: FONTE_PIXEL,
    fontSize: 9,
    includeFontPadding: false,
    paddingVertical: 8,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
});
