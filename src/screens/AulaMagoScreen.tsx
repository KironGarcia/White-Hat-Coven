/**
 * Aula local do Gray Mage: marco do chat, mago + itens no buraco interno.
 * Placeholder: só Phishing-Man (e-mail / WhatsApp).
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GRAY_MAGO_AVISO, MARCO_CHAT_MAGO } from '../assets';
import { BotaoMadeira } from '../components/BotaoMadeira';
import { ESCALA_BOTAO_RPG } from '../constants';
import { buscarTecnicaPorUrl } from '../data/tecnicas-boss';
import type { ChatAulaIdioma } from '../data/phishing-man';
import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import { pararSomTiping, tocarSomClique, tocarSomHitAcerto, tocarSomNovoCoracao, tocarSomTipingCurto } from '../systems/audio-jogo';
import { FONTE_PIXEL } from '../tipografia';

const PX_POR_MM = 160 / 25.4;
/** Folga mínima: o PNG inteiro entra, sem cortar as bordas. */
const MARGEM_LADO_PX = 1 * PX_POR_MM;
/** Borda da arte 501×830 — conteúdo não cobre o recorte de metal. */
const BORDA_MARCO_CHAT = { x: 32, y: 52 };
const MARGEM_TEXTO_BALAO_PX = 0.5 * PX_POR_MM;
/** Folga das opções até a borda interna do marco. */
const MARGEM_OPCOES_PX = 0.4 * PX_POR_MM;
const PADDING_SCROLL_ESQ = 8;
const PADDING_SCROLL_DIR = 10;
const TAMANHO_ICONE_PX = 12 * PX_POR_MM;
const SOBE_CABECA_PX = 2.5 * PX_POR_MM;
const PAUSA_ENTRE_BALOES_MS = 400;
/** Dois “to” do recorte do chat (~0,22 s) antes da pausa entre balões. */
const MS_TOTOTO_CURTO = 220;
/** Três parágrafos por balão; o que sobrar vai num último menor. */
const PARAGRAFOS_POR_BALAO = 3;
const COR_BALAO = '#c3ae8b';
const COR_TEXTO = '#140c08';
/** Chumbo das opções do quiz. */
const COR_PLUMO = '#585651';
/** Moldura do ícone e dos balões: 50% mais escuro que o chumbo das opções. */
const COR_PLUMO_MOLDURA = '#2c2b28';
/** Encanto (shazan): azul escuro com um toque sutil de roxo. */
const COR_ENCANTO = '#35306c';
/** Capuz + rosto no PNG lógico 64×71. */
const CROP_CABECA = { x: 16, y: 0, w: 38, h: 34 };

interface Props {
  bossUrl: string;
  aoConcluir: (ganhouEncanto: boolean) => void;
}

function aulaDoIdioma(
  aula: NonNullable<ReturnType<typeof buscarTecnicaPorUrl>>['chatAula'],
  idioma: 'pt' | 'en' | 'es',
): ChatAulaIdioma | null {
  if (!aula) return null;
  return aula[idioma] ?? aula.pt;
}

function embaralhar<T>(lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const atual = copia[i];
    copia[i] = copia[j];
    copia[j] = atual;
  }
  return copia;
}

function agruparEmBaloes(paragrafos: string[]): string[] {
  const grupos: string[] = [];
  for (let i = 0; i < paragrafos.length; i += PARAGRAFOS_POR_BALAO) {
    grupos.push(paragrafos.slice(i, i + PARAGRAFOS_POR_BALAO).join('\n\n'));
  }
  return grupos;
}

function IconeCabecaMago({ tamanho }: { tamanho: number }) {
  const escala = tamanho / CROP_CABECA.h;
  const w = GRAY_MAGO_AVISO.largura * escala;
  const h = GRAY_MAGO_AVISO.altura * escala;
  return (
    <View
      style={[
        estilos.iconeCirculo,
        { width: tamanho, height: tamanho, borderRadius: tamanho / 2 },
      ]}
    >
      <Image
        source={GRAY_MAGO_AVISO.imagem}
        style={{
          width: w,
          height: h,
          marginLeft: -CROP_CABECA.x * escala,
          marginTop: -CROP_CABECA.y * escala - SOBE_CABECA_PX,
        }}
        resizeMode="stretch"
        resizeMethod="scale"
      />
    </View>
  );
}

function BalaoChat({ texto, destaque }: { texto: string; destaque?: string }) {
  return (
    <View style={estilos.blocoChat}>
      <IconeCabecaMago tamanho={TAMANHO_ICONE_PX} />
      <View style={estilos.rabinhoCima} />
      <View style={estilos.balao}>
        <Text style={estilos.textoBalao} allowFontScaling={false}>
          {texto}
        </Text>
        {destaque ? (
          <Text style={estilos.textoEncanto} allowFontScaling={false}>
            {destaque}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function OpcaoTexto({
  texto,
  aoPressionar,
}: {
  texto: string;
  aoPressionar: () => void;
}) {
  const [afundada, setAfundada] = useState(false);
  return (
    <Pressable
      onPressIn={() => {
        setAfundada(true);
        tocarSomClique();
      }}
      onPressOut={() => setAfundada(false)}
      onPress={aoPressionar}
      style={[estilos.opcao, afundada && estilos.opcaoAfundada]}
    >
      <Text style={estilos.textoOpcao} allowFontScaling={false}>
        {texto}
      </Text>
    </Pressable>
  );
}

export function AulaMagoScreen({ bossUrl, aoConcluir }: Props) {
  const { t, idioma } = useTextosJogo();
  const insets = useSafeAreaInsets();
  const tecnica = buscarTecnicaPorUrl(bossUrl);
  const aula = aulaDoIdioma(tecnica?.chatAula, idioma);
  const flag = tecnica?.flag ?? '';
  const textosBaloes = aula ? agruparEmBaloes(aula.baloes) : [];
  const [qtdBaloes, setQtdBaloes] = useState(0);
  const [perguntaVisivel, setPerguntaVisivel] = useState(false);
  const [opcoesVisiveis, setOpcoesVisiveis] = useState(false);
  const [feedback, setFeedback] = useState<'erro' | 'acerto' | null>(null);
  const [opcoesQuiz, setOpcoesQuiz] = useState<Array<{ texto: string; correta: boolean }>>(
    [],
  );
  const [caixaRaiz, setCaixaRaiz] = useState({ largura: 0, altura: 0 });
  const scrollRef = useRef<ScrollView>(null);

  function aoMedirRaiz(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    if (
      width > 0 &&
      height > 0 &&
      (Math.abs(width - caixaRaiz.largura) > 1 || Math.abs(height - caixaRaiz.altura) > 1)
    ) {
      setCaixaRaiz({ largura: width, altura: height });
    }
  }

  useEffect(() => {
    let cancelado = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    setQtdBaloes(0);
    setPerguntaVisivel(false);
    setOpcoesVisiveis(false);
    setFeedback(null);
    if (aula) {
      setOpcoesQuiz(
        embaralhar(
          aula.opcoes.map((texto, indice) => ({
            texto,
            correta: indice === aula.indiceCorreta,
          })),
        ),
      );
    } else {
      setOpcoesQuiz([]);
    }

    function esperar(ms: number): Promise<void> {
      return new Promise((resolve) => {
        timer = setTimeout(resolve, ms);
      });
    }

    async function revelar() {
      if (!aula) {
        setQtdBaloes(1);
        tocarSomTipingCurto();
        return;
      }
      for (let i = 0; i < textosBaloes.length; i++) {
        if (cancelado) return;
        setQtdBaloes(i + 1);
        tocarSomTipingCurto();
        await esperar(MS_TOTOTO_CURTO + PAUSA_ENTRE_BALOES_MS);
      }
      if (cancelado) return;
      setPerguntaVisivel(true);
      tocarSomTipingCurto();
      await esperar(MS_TOTOTO_CURTO + PAUSA_ENTRE_BALOES_MS);
      if (!cancelado) setOpcoesVisiveis(true);
    }

    void revelar();
    return () => {
      cancelado = true;
      if (timer) clearTimeout(timer);
      pararSomTiping();
    };
  }, [aula, textosBaloes.length]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => cancelAnimationFrame(id);
  }, [qtdBaloes, perguntaVisivel, opcoesVisiveis, feedback]);

  function responder(indice: number) {
    if (!aula || feedback === 'acerto') return;
    if (opcoesQuiz[indice]?.correta) {
      tocarSomNovoCoracao();
      setFeedback('acerto');
      return;
    }
    tocarSomHitAcerto();
    setFeedback('erro');
  }

  const folgaEsq = Math.max(insets.left, MARGEM_LADO_PX);
  const folgaDir = Math.max(insets.right, MARGEM_LADO_PX);
  const folgaTop = Math.max(insets.top, MARGEM_LADO_PX);
  const folgaBaixo = Math.max(insets.bottom, MARGEM_LADO_PX);
  const marcoW = Math.max(0, caixaRaiz.largura - folgaEsq - folgaDir);
  const marcoH = Math.max(0, caixaRaiz.altura - folgaTop - folgaBaixo);
  const padX = marcoW > 0 ? (BORDA_MARCO_CHAT.x / MARCO_CHAT_MAGO.largura) * marcoW : 0;
  const padY = marcoH > 0 ? (BORDA_MARCO_CHAT.y / MARCO_CHAT_MAGO.altura) * marcoH : 0;

  return (
    <View style={estilos.raiz} onLayout={aoMedirRaiz}>
      {marcoW > 0 && marcoH > 0 && (
        <View
          style={[
            estilos.palcoMarco,
            {
              width: marcoW,
              height: marcoH,
              left: folgaEsq,
              top: folgaTop,
            },
          ]}
        >
          <Image
            pointerEvents="none"
            source={MARCO_CHAT_MAGO.imagem}
            style={{ width: marcoW, height: marcoH }}
            resizeMode="stretch"
            resizeMethod="scale"
          />
          <View
            style={[
              estilos.miolo,
              {
                paddingHorizontal: padX,
                paddingTop: padY,
                paddingBottom: padY,
              },
            ]}
          >
            <ScrollView
              ref={scrollRef}
              style={estilos.scroll}
              contentContainerStyle={estilos.scrollConteudo}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {!aula && qtdBaloes > 0 && <BalaoChat texto={t.aula.semAula} />}
              {aula &&
                textosBaloes.slice(0, qtdBaloes).map((texto, indice) => (
                  <BalaoChat key={`balao-${indice}`} texto={texto} />
                ))}
              {perguntaVisivel && aula && (
                <BalaoChat texto={`${t.aula.convitePergunta}\n\n${aula.pergunta}`} />
              )}
              {opcoesVisiveis && aula && feedback !== 'acerto' && (
                <View style={estilos.blocoOpcoes}>
                  {opcoesQuiz.map((opcao, indice) => (
                    <OpcaoTexto
                      key={`${indice}-${opcao.texto}`}
                      texto={opcao.texto}
                      aoPressionar={() => responder(indice)}
                    />
                  ))}
                </View>
              )}
              {feedback === 'erro' && <BalaoChat texto={t.aula.respostaErrada} />}
              {feedback === 'acerto' && (
                <BalaoChat texto={t.aula.parabens} destaque={flag} />
              )}
              {feedback === 'acerto' && (
                <View style={estilos.blocoContinuar}>
                  <BotaoMadeira
                    rotulo={t.aula.continuar}
                    aoPressionar={() => aoConcluir(true)}
                    modelo="rpg"
                    escala={ESCALA_BOTAO_RPG}
                  />
                </View>
              )}
              {!aula && (
                <View style={estilos.blocoContinuar}>
                  <BotaoMadeira
                    rotulo={t.aviso.continuar}
                    aoPressionar={() => aoConcluir(false)}
                    modelo="rpg"
                    escala={ESCALA_BOTAO_RPG}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#000000',
  },
  palcoMarco: {
    position: 'absolute',
  },
  miolo: {
    ...StyleSheet.absoluteFillObject,
  },
  scroll: {
    flex: 1,
  },
  scrollConteudo: {
    paddingTop: 10,
    paddingBottom: 14,
    paddingLeft: PADDING_SCROLL_ESQ,
    paddingRight: PADDING_SCROLL_DIR,
  },
  blocoChat: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  iconeCirculo: {
    overflow: 'hidden',
    backgroundColor: '#1a1210',
    borderWidth: 2,
    borderColor: COR_PLUMO_MOLDURA,
    flexShrink: 0,
  },
  rabinhoCima: {
    width: 0,
    height: 0,
    marginLeft: TAMANHO_ICONE_PX / 2 - 8,
    marginTop: 2,
    marginBottom: -1,
    zIndex: 2,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COR_BALAO,
  },
  balao: {
    alignSelf: 'stretch',
    width: '100%',
    backgroundColor: COR_BALAO,
    borderRadius: 10,
    borderColor: COR_PLUMO_MOLDURA,
    padding: MARGEM_TEXTO_BALAO_PX + 8,
    justifyContent: 'center',
  },
  textoBalao: {
    fontFamily: FONTE_PIXEL,
    color: COR_TEXTO,
    fontSize: 12,
    lineHeight: 16,
  },
  textoEncanto: {
    fontFamily: FONTE_PIXEL,
    color: COR_ENCANTO,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
  },
  blocoOpcoes: {
    alignSelf: 'stretch',
    marginLeft: -PADDING_SCROLL_ESQ + MARGEM_OPCOES_PX,
    marginRight: -PADDING_SCROLL_DIR + MARGEM_OPCOES_PX,
    marginBottom: 8,
    gap: 8,
  },
  opcao: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: COR_PLUMO,
    borderRadius: 8,
    backgroundColor: '#1a1210',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  opcaoAfundada: {
    transform: [{ translateY: 3 }],
    backgroundColor: '#0e0a08',
    borderColor: '#3e3c3a',
  },
  textoOpcao: {
    fontFamily: FONTE_PIXEL,
    color: COR_PLUMO,
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
  },
  blocoContinuar: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
});
