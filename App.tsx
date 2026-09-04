/**
 * WHC Demo 1 — fluxo: Intro → Run → Aviso invasão → Boss → vitória → próxima fase.
 * Máquina de estados simples; progresso de invasão persiste no AsyncStorage.
 */

import React, { Component, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DEV_BOSS_CAPITAO_ALTITUDE, DEV_FORCA_FASE, DEV_RESET_FLAGS_CONHECIDAS, PX_POR_METRO } from './src/constants';
import { sortearUrlDoBoss, validarFlagDaUrl } from './src/data/tecnicas-boss';
import { IdiomaJogoProvider, useTextosJogo } from './src/i18n/IdiomaJogoContext';
import { IDIOMA_JOGO_PADRAO, type IdiomaJogo } from './src/i18n/textos-jogo';
import type { ResultadoRun } from './src/entities/mundo';
import { AvisoInvasaoScreen, type ModoAvisoInvasao } from './src/screens/AvisoInvasaoScreen';
import { AulaMagoScreen } from './src/screens/AulaMagoScreen';
import { BossArenaScreen } from './src/screens/BossArenaScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen } from './src/screens/GameScreen';
import { IntroScreen } from './src/screens/IntroScreen';
import { TiendaScreen } from './src/screens/TiendaScreen';
import {
  jaConheceUrl,
  limparInvasaoPendente,
  registrarFlagConhecida,
  salvarInvasaoPendente,
  zerarProgressoCompletoUmaVez,
  corrigirCartaFantasmaUmaVez,
  resetarEncantosParaPolimento,
  type InvasaoPendente,
  type ProgressoRunSalvo,
} from './src/systems/persistencia-invasao';
import {
  avancarFaseAposVitoria,
  montarAparicaoBoss,
  proximaAltitudeBoss,
  type FaseMapa,
} from './src/systems/progressao-fases';
import { carregarCarta7Dias, vidasInicio, vidasMaximas } from './src/systems/pontuacao';
import { carregarEstadoSkins } from './src/systems/skins';
import {
  encerrarAudioJogo,
  prepararAudioJogo,
  sincronizarMusicaComTela,
} from './src/systems/audio-jogo';
import { FONTE_PIXEL } from './src/tipografia';

type Tela = 'carregando' | 'intro' | 'run' | 'loja' | 'aviso' | 'aula' | 'boss' | 'fim';

class LimiteErroJogo extends Component<
  { children: ReactNode; aoErro: (erro: Error) => void; tituloErro: string },
  { erro: Error | null }
> {
  state = { erro: null as Error | null };

  static getDerivedStateFromError(erro: Error) {
    return { erro };
  }

  componentDidCatch(erro: Error, _info: ErrorInfo) {
    this.props.aoErro(erro);
  }

  render() {
    if (this.state.erro) {
      return (
        <View style={[estilos.raiz, estilos.carregando, { padding: 24 }]}>
          <Text style={estilos.textoErroTitulo}>{this.props.tituloErro}</Text>
          <Text style={estilos.textoErro}>{this.state.erro.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export interface WhcDemo1Props {
  /** Dentro do ARGOS: botão Sair volta para a Home. */
  aoSairParaArgos?: () => void;
  /** Sai do jogo para o Oráculo (chatbot), sem perder a invasão salva. */
  aoConsultarOraculo?: (bossUrl: string) => void;
  /** Idioma vindo do ARGOS (pt padrão quando standalone). */
  idioma?: IdiomaJogo;
}

export default function App({
  aoSairParaArgos,
  aoConsultarOraculo,
  idioma = IDIOMA_JOGO_PADRAO,
}: WhcDemo1Props = {}) {
  return (
    <SafeAreaProvider>
      <IdiomaJogoProvider idioma={idioma}>
        <JogoWhc aoSairParaArgos={aoSairParaArgos} aoConsultarOraculo={aoConsultarOraculo} />
      </IdiomaJogoProvider>
    </SafeAreaProvider>
  );
}

function JogoWhc({ aoSairParaArgos, aoConsultarOraculo }: Omit<WhcDemo1Props, 'idioma'>) {
  const { t } = useTextosJogo();
  const [tela, setTela] = useState<Tela>('carregando');
  const [resultado, setResultado] = useState<ResultadoRun | null>(null);
  const [numeroDaRun, setNumeroDaRun] = useState(0);
  const [invasao, setInvasao] = useState<InvasaoPendente | null>(null);
  const [modoAviso, setModoAviso] = useState<ModoAvisoInvasao>('primeiro_contato');
  const [moedasSessao, setMoedasSessao] = useState(0);
  const [vidasNaLoja, setVidasNaLoja] = useState(vidasInicio);
  const [tokenZerarSessao, setTokenZerarSessao] = useState(0);
  const [tokenRestaurarCoracao, setTokenRestaurarCoracao] = useState(0);
  const [faseMapa, setFaseMapa] = useState<FaseMapa>(DEV_FORCA_FASE ?? 1);
  const [progressoRetorno, setProgressoRetorno] = useState<ProgressoRunSalvo | null>(null);

  useEffect(() => {
    return () => {
      void encerrarAudioJogo();
    };
  }, []);

  useEffect(() => {
    let ativo = true;
    (async () => {
      await prepararAudioJogo();
      if (ativo) await sincronizarMusicaComTela(tela);
    })();
    return () => {
      ativo = false;
    };
  }, [tela]);

  useEffect(() => {
    let ativo = true;
    (async () => {
      // Wipe único: deixa o save como primeira vez (gravação). Não repete.
      await zerarProgressoCompletoUmaVez();
      await corrigirCartaFantasmaUmaVez();
      // Dev: limpa URLs conhecidas → phishing man aparece como 1º contato.
      if (DEV_RESET_FLAGS_CONHECIDAS) await resetarEncantosParaPolimento();
      // Skins compradas/equipadas prontas antes da primeira tela.
      await carregarEstadoSkins();
      await carregarCarta7Dias();
      // Fechar o app no aviso não retoma essa tela — volta à intro.
      await limparInvasaoPendente();
      if (!ativo) return;
      setTela('intro');
    })();
    return () => {
      ativo = false;
    };
  }, []);

  function iniciarRun() {
    setInvasao(null);
    void limparInvasaoPendente();
    setMoedasSessao(0);
    setTokenZerarSessao(0);
    setTokenRestaurarCoracao(0);
    setFaseMapa(DEV_FORCA_FASE ?? 1);
    setProgressoRetorno(null);
    setNumeroDaRun((numero) => numero + 1);
    setTela('run');
  }

  function terminarRun(resultadoDaRun: ResultadoRun) {
    setResultado(resultadoDaRun);
    setTela('fim');
  }

  async function aoPisarPlataformaFake(progresso: ProgressoRunSalvo) {
    const fase = progresso.faseMapa ?? faseMapa;
    // Dev: força Capitão Pirata quando DEV_BOSS_CAPITAO_ALTITUDE está ativo.
    const aparicao =
      DEV_BOSS_CAPITAO_ALTITUDE !== null
        ? {
            tipoLogico: 'capitao_pirata' as const,
            tipoTela: 'capitao_pirata' as const,
            url: sortearUrlDoBoss('capitao_pirata'),
          }
        : montarAparicaoBoss(fase, progresso.tiposVencidosNaFase ?? []);
    const conhece = await jaConheceUrl(aparicao.url);
    const pendente: InvasaoPendente = {
      versao: 1,
      bossUrl: aparicao.url,
      fase: 'primeiro_contato',
      encantoAtivo: conhece,
      progresso,
      idBossLogico: aparicao.tipoLogico,
      idBossTela: aparicao.tipoTela,
    };
    setInvasao(pendente);
    await salvarInvasaoPendente(pendente);
    setModoAviso(conhece ? 'ja_conhece' : 'primeiro_contato');
    setTela('aviso');
  }

  function abrirAula() {
    if (!invasao) return;
    setTela('aula');
  }

  async function concluirAula(ganhouEncanto: boolean) {
    if (!invasao) return;
    if (ganhouEncanto) {
      setModoAviso('pronto_encanto');
      setTela('aviso');
      return;
    }
    irAoBoss(false);
  }

  function aoVencerBoss(progresso: ProgressoRunSalvo) {
    const idLogico = invasao?.idBossLogico;
    void limparInvasaoPendente();
    const faseAtual = (progresso.faseMapa ?? faseMapa) as FaseMapa;
    const avanco = avancarFaseAposVitoria(faseAtual, progresso.bossesVencidosNaFase ?? 0);
    const tipos = [...(progresso.tiposVencidosNaFase ?? [])];
    if (idLogico) tipos.push(idLogico);
    const tiposNaFaseNova = avanco.trocouMapa ? [] : tipos;
    const altitudeMetros = progresso.altitudePx / PX_POR_METRO;
    const atualizado: ProgressoRunSalvo = {
      ...progresso,
      faseMapa: avanco.fase,
      bossesVencidosNaFase: avanco.bossesVencidosNaFase,
      bossesVencidosTotal: (progresso.bossesVencidosTotal ?? 0) + 1,
      tiposVencidosNaFase: tiposNaFaseNova,
      altitudeProximoBoss: proximaAltitudeBoss(altitudeMetros),
      jaSpawnouFakeDestaFaixa: false,
    };
    setFaseMapa(avanco.fase);
    setProgressoRetorno(atualizado);
    setModoAviso('vitoria');
    setTela('aviso');
  }

  function sairDaVitoria() {
    setInvasao(null);
    setTela('run');
  }

  function voltarAIntroAposDemo() {
    setInvasao(null);
    void limparInvasaoPendente();
    setProgressoRetorno(null);
    setFaseMapa(DEV_FORCA_FASE ?? 1);
    setMoedasSessao(0);
    setTela('intro');
  }

  function irAoBoss(encantoAtivo: boolean) {
    if (!invasao) return;
    const atualizado = { ...invasao, encantoAtivo };
    setInvasao(atualizado);
    void limparInvasaoPendente();
    setTela('boss');
  }

  function validarFlag(flagDigitada: string): boolean {
    if (!invasao) return false;
    return validarFlagDaUrl(invasao.bossUrl, flagDigitada);
  }

  async function continuarComEncantoValidado() {
    if (!invasao) return;
    await registrarFlagConhecida(invasao.bossUrl);
    irAoBoss(true);
  }

  if (tela === 'carregando') {
    return (
      <View style={[estilos.raiz, estilos.carregando]}>
        <ActivityIndicator color="#f2e3c0" />
        <Text style={estilos.textoCarregando}>{t.app.abrindo}</Text>
      </View>
    );
  }

  return (
    <LimiteErroJogo
      tituloErro={t.app.travouAoAbrir}
      aoErro={() => {
        void limparInvasaoPendente();
      }}
    >
    <View style={estilos.raiz}>
      <StatusBar hidden />
      {tela === 'intro' && (
        <IntroScreen aoJogar={iniciarRun} aoSair={aoSairParaArgos} />
      )}
      {(tela === 'run' || tela === 'loja') && (
        <View
          style={tela === 'loja' ? estilos.runPausada : estilos.runAtiva}
          pointerEvents={tela === 'run' ? 'auto' : 'none'}
        >
          <GameScreen
            key={`${numeroDaRun}-f${faseMapa}`}
            pausado={tela === 'loja'}
            faseMapa={faseMapa}
            progressoInicial={progressoRetorno}
            aoTerminar={terminarRun}
            aoInvadir={aoPisarPlataformaFake}
            aoAbrirLoja={(moedasDaRun, vidas) => {
              setMoedasSessao(moedasDaRun);
              setVidasNaLoja(vidas);
              setTela('loja');
            }}
            tokenZerarSessao={tokenZerarSessao}
            tokenRestaurarCoracao={tokenRestaurarCoracao}
            iniciarContagemAoMontar={progressoRetorno != null}
          />
        </View>
      )}
      {tela === 'loja' && (
        <TiendaScreen
          moedasSessao={moedasSessao}
          vidasAtuais={vidasNaLoja}
          aoFechar={() => setTela('run')}
          aoConsumirSessao={() => {
            setMoedasSessao(0);
            setTokenZerarSessao((n) => n + 1);
          }}
          aoRestaurarCoracao={() => {
            setVidasNaLoja((vidas) => Math.min(vidasMaximas(), vidas + 1));
            setTokenRestaurarCoracao((n) => n + 1);
          }}
        />
      )}
      {tela === 'aviso' && invasao && (
        <AvisoInvasaoScreen
          bossUrl={invasao.bossUrl}
          modo={modoAviso}
          aoConsultarOraculo={abrirAula}
          aoLutarSemEncanto={() => irAoBoss(false)}
          aoContinuarComEncanto={continuarComEncantoValidado}
          aoSairDaVitoria={sairDaVitoria}
          aoValidarFlag={validarFlag}
        />
      )}
      {tela === 'aula' && invasao && (
        <AulaMagoScreen
          bossUrl={invasao.bossUrl}
          aoConcluir={(ganhouEncanto) => {
            void concluirAula(ganhouEncanto);
          }}
        />
      )}
      {tela === 'boss' && invasao && (
        <BossArenaScreen
          bossUrl={invasao.bossUrl}
          tipoTela={invasao.idBossTela ?? 'phishing_man'}
          encantoAtivo={invasao.encantoAtivo}
          progresso={invasao.progresso}
          aoMorrer={(resultadoDaRun) => {
            setInvasao(null);
            setResultado(resultadoDaRun);
            setTela('fim');
          }}
          aoVencer={aoVencerBoss}
          ehFimDaDemo={false}
          ehPrimeiroBoss={(invasao.progresso.bossesVencidosTotal ?? 0) === 0}
          aoSairAoInicio={voltarAIntroAposDemo}
        />
      )}
      {tela === 'fim' && resultado && (
        <GameOverScreen
          resultado={resultado}
          aoJogarDeNovo={iniciarRun}
          aoVoltarParaIntro={() => setTela('intro')}
        />
      )}
      {tela === 'aviso' && !invasao && (
        <IntroScreen aoJogar={iniciarRun} aoSair={aoSairParaArgos} />
      )}
    </View>
    </LimiteErroJogo>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#0b0716',
  },
  carregando: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCarregando: {
    marginTop: 12,
    color: '#f2e3c0',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: FONTE_PIXEL,
  },
  textoErroTitulo: {
    color: '#f2e3c0',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: FONTE_PIXEL,
  },
  textoErro: {
    color: '#ff8a8a',
    fontSize: 10,
    textAlign: 'center',
    fontFamily: FONTE_PIXEL,
  },
  runAtiva: {
    flex: 1,
  },
  runPausada: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
});
