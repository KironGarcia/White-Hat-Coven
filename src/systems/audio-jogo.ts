/**
 * Áudio do WHC. Na APK Android os arquivos vêm de res/raw
 * (android.resource://) — nunca require() / Asset.downloadAsync,
 * que derrubou a abertura com AppDirectories.
 * Qualquer falha de som é engolida: o jogo continua mudo, não crasha.
 *
 * ExoPlayer (padrão do expo-av) nasce na thread main e o release()
 * roda no pool nativo → "Player is accessed on the wrong thread".
 * MediaPlayer é a implementação oficial do Expo para isso: play, stop,
 * loop e unload seguem iguais. O URI é só o nome em res/raw — o native
 * resolve o ID. android.resource://.../raw/nome o MediaPlayer não carrega.
 */

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import {
  DURACAO_HAHAHA_BOSS_S,
  DURACAO_HIHIHI_MINIBOT_S,
  VOLUME_MUSICA_BATALHA,
  VOLUME_MUSICA_INTRO,
  VOLUME_MUSICA_RUN,
  VOLUME_SFX_DISPARO,
  VOLUME_SFX_MOEDA,
  VOLUME_SFX_PULO,
} from '../constants';

/** Trilhas de fundo ligadas à máquina de telas. */
export type TrilhaFundo = 'intro' | 'run' | 'loja' | 'batalha' | 'silencio';

const RAW = {
  intro: 'audio_intro_fondo',
  loja: 'tienda_audio',
  batalha: 'boss_music',
  pulo: 'pulo_mago',
  clique: 'clik_boton',
  disparo: 'disparo_audio',
  morto: 'audio_morto',
  moeda: 'coin',
  patch: 'patch_audio',
  hitAcerto: 'hit_acerto',
  hahaha: 'hahaha_boss',
  hihihi: 'hihihi_minibot',
  novoCoracao: 'nuevo_corazon',
  tiping: 'tiping_mago',
  tipingChat: 'tiping_mago_chat',
} as const;

type Efeito =
  | 'pulo'
  | 'clique'
  | 'disparo'
  | 'morto'
  | 'moeda'
  | 'moedaPirata'
  | 'patch'
  | 'hitAcerto'
  | 'hahaha'
  | 'hihihi'
  | 'novoCoracao'
  | 'tiping'
  | 'tipingChat';

/** Rajada infectada: o disparo a 10% some na música do boss. */
const VOLUME_DISPARO_INFECTADO = 0.45;

const VOLUME_EFEITO: Record<Efeito, number> = {
  pulo: VOLUME_SFX_PULO,
  clique: 1,
  disparo: VOLUME_SFX_DISPARO,
  morto: 1,
  moeda: VOLUME_SFX_MOEDA,
  moedaPirata: 1,
  patch: 1,
  hitAcerto: 1,
  hahaha: 1,
  hihihi: 1,
  novoCoracao: 1,
  tiping: 1,
  tipingChat: 1,
};

type PacoteAudio = { modulo: number; arquivo: string };

/**
 * Patch, hit-acerto e a trilha do boss podem não estar no res/raw do APK antigo.
 * O Metro empacota o arquivo; copiamos p/ cache (sem Asset.downloadAsync).
 */
const PACOTE_SFX: Partial<Record<Efeito, PacoteAudio>> = {
  patch: {
    modulo: require('../../assets/audios/Patch-audio.wav'),
    arquivo: 'whc_patch_audio.wav',
  },
  hitAcerto: {
    modulo: require('../../assets/audios/hit-acerto-.ogg'),
    arquivo: 'whc_hit_acerto_v5.ogg',
  },
  hahaha: {
    modulo: require('../../assets/audios/hahaha-boss.ogg'),
    arquivo: 'whc_hahaha_boss_v13.ogg',
  },
  hihihi: {
    modulo: require('../../assets/audios/hihihi-minibot.ogg'),
    arquivo: 'whc_hihihi_minibot_v1.ogg',
  },
  novoCoracao: {
    modulo: require('../../assets/audios/Nuevo-corazon.wav'),
    arquivo: 'whc_nuevo_corazon_v1.wav',
  },
  moedaPirata: {
    modulo: require('../../assets/audios/moeda-pirata.ogg'),
    arquivo: 'whc_moeda_pirata_v1.ogg',
  },
  tiping: {
    modulo: require('../../assets/audios/tiping-mago.wav'),
    arquivo: 'whc_tiping_mago_v1.wav',
  },
  tipingChat: {
    modulo: require('../../assets/audios/tiping-mago-chat.wav'),
    arquivo: 'whc_tiping_mago_chat_v1.wav',
  },
};

const PACOTE_BATALHA: PacoteAudio = {
  modulo: require('../../assets/audios/boss-music.ogg'),
  arquivo: 'whc_boss_music.ogg',
};

let filaAudio: Promise<void> = Promise.resolve();

function naFilaAudio<T>(trabalho: () => Promise<T>): Promise<T> {
  const executar = filaAudio.then(trabalho, trabalho);
  filaAudio = executar.then(
    () => undefined,
    () => undefined,
  );
  return executar;
}

function statusInicial(extra: {
  shouldPlay?: boolean;
  isLooping?: boolean;
  volume?: number;
}) {
  return {
    shouldPlay: extra.shouldPlay ?? false,
    isLooping: extra.isLooping ?? false,
    volume: extra.volume ?? 1,
    ...(Platform.OS === 'android' ? { androidImplementation: 'MediaPlayer' } : {}),
  };
}

let preparado = false;
let trilhaAtual: TrilhaFundo = 'silencio';
let somFundo: Audio.Sound | null = null;
const efeitos: Partial<Record<Efeito, Audio.Sound>> = {};
/** Vários MediaPlayer do disparo para taps seguidos não cortarem o som. */
const POOL_DISPARO = 4;
const poolDisparo: Audio.Sound[] = [];
let indicePoolDisparo = 0;

function fonteRaw(nome: string): { uri: string } {
  return { uri: nome };
}

async function uriDoArquivoPacote(pacote: PacoteAudio): Promise<string | null> {
  if (!FileSystem.cacheDirectory) return null;
  const destino = `${FileSystem.cacheDirectory}${pacote.arquivo}`;
  const info = await FileSystem.getInfoAsync(destino);
  if (info.exists) return destino;
  const asset = Asset.fromModule(pacote.modulo);
  try {
    await asset.downloadAsync();
  } catch {
    /* usa uri do Metro se o download nativo falhar */
  }
  const origem = asset.localUri ?? asset.uri;
  if (!origem) return null;
  await FileSystem.downloadAsync(origem, destino);
  return destino;
}

async function uriDoPacote(efeito: Efeito): Promise<string | null> {
  const pacote = PACOTE_SFX[efeito];
  if (!pacote) return null;
  return uriDoArquivoPacote(pacote);
}

async function carregarTrilha(
  trilha: Exclude<TrilhaFundo, 'silencio'>,
  inicial: { shouldPlay?: boolean; isLooping?: boolean; volume?: number },
): Promise<Audio.Sound | null> {
  if (trilha === 'batalha') {
    try {
      const uri = await uriDoArquivoPacote(PACOTE_BATALHA);
      if (uri) {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          statusInicial(inicial),
        );
        return sound;
      }
    } catch {
      /* cai no res/raw */
    }
  }
  try {
    const { sound } = await Audio.Sound.createAsync(
      fonteRaw(rawDaTrilha(trilha)),
      statusInicial(inicial),
    );
    return sound;
  } catch {
    return null;
  }
}
async function carregarSom(
  efeito: Efeito,
  inicial: { shouldPlay?: boolean; isLooping?: boolean; volume?: number },
): Promise<Audio.Sound | null> {
  const pacoteDev = PACOTE_SFX[efeito];
  // Dev Client: o require do Metro toca; WAV no cache o MediaPlayer às vezes ignora.
  if (__DEV__ && pacoteDev) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        pacoteDev.modulo,
        statusInicial(inicial),
      );
      return sound;
    } catch {
      /* cai no cache / res/raw */
    }
  }
  if (PACOTE_SFX[efeito]) {
    try {
      const uri = await uriDoPacote(efeito);
      if (uri) {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          statusInicial(inicial),
        );
        return sound;
      }
    } catch {
      /* cai no res/raw */
    }
  }
  try {
    const { sound } = await Audio.Sound.createAsync(
      fonteRaw(RAW[efeito]),
      statusInicial(inicial),
    );
    return sound;
  } catch {
    return null;
  }
}

/** Modo de áudio + pré-carga dos SFX. Seguro chamar mais de uma vez. */
export async function prepararAudioJogo(): Promise<void> {
  if (preparado) return;
  await naFilaAudio(async () => {
    if (preparado) return;
    try {
      await Audio.setIsEnabledAsync(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      });
      if (Platform.OS === 'android') {
        const nomes: Efeito[] = [
          'pulo',
          'clique',
          'disparo',
          'morto',
          'moeda',
          'moedaPirata',
          'patch',
          'hitAcerto',
          'hahaha',
          'hihihi',
          'novoCoracao',
          'tiping',
          'tipingChat',
        ];
        for (const nome of nomes) {
          const som = await carregarSom(nome, {
            shouldPlay: false,
            volume: VOLUME_EFEITO[nome],
          });
          if (som) efeitos[nome] = som;
        }
        for (let i = 0; i < POOL_DISPARO; i++) {
          const som = await carregarSom('disparo', {
            shouldPlay: false,
            volume: VOLUME_EFEITO.disparo,
          });
          if (som) poolDisparo.push(som);
        }
      }
    } catch {
      /* jogo segue mudo */
    } finally {
      preparado = true;
    }
  });
}

async function pararFundo(): Promise<void> {
  if (!somFundo) {
    trilhaAtual = 'silencio';
    return;
  }
  const atual = somFundo;
  somFundo = null;
  trilhaAtual = 'silencio';
  try {
    await atual.stopAsync();
    await atual.unloadAsync();
  } catch {
    /* ignore */
  }
}

function rawDaTrilha(trilha: Exclude<TrilhaFundo, 'silencio'>): string {
  if (trilha === 'loja') return RAW.loja;
  if (trilha === 'batalha') return RAW.batalha;
  return RAW.intro;
}

function volumeDaTrilha(trilha: Exclude<TrilhaFundo, 'silencio'>): number {
  if (trilha === 'run') return VOLUME_MUSICA_RUN;
  if (trilha === 'batalha') return VOLUME_MUSICA_BATALHA;
  return VOLUME_MUSICA_INTRO;
}

/**
 * Intro e run usam o mesmo MP3 (só muda o volume).
 * Aviso e arena usam Boss-music (não reinicia na troca aviso→boss).
 */
export async function tocarTrilhaFundo(trilha: TrilhaFundo): Promise<void> {
  await naFilaAudio(async () => {
    try {
      if (trilha === 'silencio') {
        await pararFundo();
        return;
      }

      const introOuRun = trilha === 'intro' || trilha === 'run';
      const jaIntroOuRun = trilhaAtual === 'intro' || trilhaAtual === 'run';
      if (introOuRun && jaIntroOuRun && somFundo) {
        await somFundo.setVolumeAsync(volumeDaTrilha(trilha));
        const status = await somFundo.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) await somFundo.playAsync();
        trilhaAtual = trilha;
        return;
      }

      if (trilha === 'batalha' && trilhaAtual === 'batalha' && somFundo) {
        await somFundo.setVolumeAsync(volumeDaTrilha(trilha));
        return;
      }

      if (trilha === trilhaAtual && somFundo) {
        const status = await somFundo.getStatusAsync();
        if (status.isLoaded && !status.isPlaying) await somFundo.playAsync();
        return;
      }

      await pararFundo();
      const som = await carregarTrilha(trilha, {
        shouldPlay: true,
        isLooping: true,
        volume: volumeDaTrilha(trilha),
      });
      if (!som) return;
      somFundo = som;
      trilhaAtual = trilha;
    } catch {
      /* jogo segue mudo */
    }
  });
}

export async function sincronizarMusicaComTela(
  tela: 'carregando' | 'intro' | 'run' | 'loja' | 'aviso' | 'boss' | 'fim',
): Promise<void> {
  if (tela === 'carregando') {
    await tocarTrilhaFundo('silencio');
    return;
  }
  if (tela === 'intro' || tela === 'fim') {
    await tocarTrilhaFundo('intro');
    return;
  }
  if (tela === 'run') {
    await tocarTrilhaFundo('run');
    return;
  }
  if (tela === 'loja') {
    await tocarTrilhaFundo('loja');
    return;
  }
  await tocarTrilhaFundo('batalha');
}

async function tocarEfeito(nome: Efeito): Promise<void> {
  await naFilaAudio(async () => {
    try {
      const volume = VOLUME_EFEITO[nome];
      const som = efeitos[nome];
      if (!som) {
        const novo = await carregarSom(nome, {
          shouldPlay: true,
          isLooping: false,
          volume,
        });
        if (novo) efeitos[nome] = novo;
        return;
      }
      await som.setVolumeAsync(volume);
      await som.setPositionAsync(0);
      await som.playAsync();
    } catch {
      /* ignore */
    }
  });
}

/** Piso da plataforma (pulo automático). */
export function tocarSomPulo(): void {
  void tocarEfeito('pulo');
}

/** Clique nos botões de madeira e no seletor de idioma. */
let ultimoCliqueMs = 0;
export function tocarSomClique(): void {
  const agora = Date.now();
  // Android às vezes dispara o toque duas vezes (onPressIn + eco).
  if (agora - ultimoCliqueMs < 140) return;
  ultimoCliqueMs = agora;
  void tocarEfeito('clique');
}

/** Início da animação de disparo da orb (fase salida). */
export function tocarSomDisparo(): void {
  void tocarDisparoPool(VOLUME_EFEITO.disparo);
}

/** Cada tiro da rajada infectada — fora da fila para não atrasar a cadeia. */
export function tocarSomDisparoInfectado(): void {
  void tocarDisparoPool(VOLUME_DISPARO_INFECTADO);
}

async function tocarDisparoPool(volume: number): Promise<void> {
  try {
    if (poolDisparo.length > 0) {
      const som = poolDisparo[indicePoolDisparo % poolDisparo.length];
      indicePoolDisparo += 1;
      await som.setVolumeAsync(volume);
      await som.setPositionAsync(0);
      await som.playAsync();
      return;
    }
    void tocarEfeito('disparo');
  } catch {
    /* ignore */
  }
}

/** Queda da tela (vida 1 e vida 2). */
export function tocarSomMorto(): void {
  void tocarEfeito('morto');
}

/** Coleta do patch na arena do boss. */
export function tocarSomPatch(): void {
  void tocarEfeito('patch');
}

/** Disparo acertou o ponto frágil do boss. */
export function tocarSomHitAcerto(): void {
  void tocarEfeito('hitAcerto');
}

/** Poção de vida comprada na loja. */
export function tocarSomNovoCoracao(): void {
  void tocarEfeito('novoCoracao');
}

async function tocarTipingInterno(emLoop: boolean): Promise<void> {
  const volume = VOLUME_EFEITO.tiping;
  let som = efeitos.tiping;
  if (!som) {
    som = await carregarSom('tiping', {
      shouldPlay: true,
      isLooping: emLoop,
      volume,
    });
    if (som) {
      efeitos.tiping = som;
      try {
        await som.setRateAsync(1, true);
      } catch {
        /* ritmo original */
      }
    }
    return;
  }
  await som.setIsLoopingAsync(emLoop);
  await som.setVolumeAsync(volume);
  try {
    await som.setRateAsync(1, true);
  } catch {
    /* volta ao ritmo original se o rate 1.15 ficou na memória */
  }
  await som.setPositionAsync(0);
  await som.playAsync();
}

/** Loop do tototo enquanto o mago digita no balão da tela intermediária. */
export function tocarSomTiping(): void {
  void naFilaAudio(async () => {
    try {
      await tocarTipingInterno(true);
    } catch {
      /* ignore */
    }
  });
}

/** Recorte curto (só dois “to”) quando um balão novo entra no chat. */
export function tocarSomTipingCurto(): void {
  void tocarEfeito('tipingChat');
}

/** Para o tototo quando a digitação acaba (ou o aviso desmonta). */
export function pararSomTiping(): void {
  void naFilaAudio(async () => {
    try {
      const som = efeitos.tiping;
      if (!som) return;
      await som.stopAsync();
    } catch {
      /* ignore */
    }
  });
}

function restaurarMusicaBatalha(): () => void {
  return () => {
    void naFilaAudio(async () => {
      try {
        if (somFundo && trilhaAtual === 'batalha') {
          await somFundo.setVolumeAsync(volumeDaTrilha('batalha'));
        }
      } catch {
        /* ignore */
      }
    });
  };
}

async function tocarZombaria(
  nome: 'hahaha' | 'hihihi',
  duracaoS: number,
): Promise<void> {
  const restaurarMusica = restaurarMusicaBatalha();
  try {
    if (somFundo && trilhaAtual === 'batalha') {
      await somFundo.setVolumeAsync(0.04);
    }
    const volume = VOLUME_EFEITO[nome];
    const som = efeitos[nome];
    if (!som) {
      const novo = await carregarSom(nome, {
        shouldPlay: true,
        isLooping: false,
        volume,
      });
      if (novo) efeitos[nome] = novo;
    } else {
      await som.setVolumeAsync(volume);
      await som.setPositionAsync(0);
      await som.playAsync();
    }
    setTimeout(restaurarMusica, duracaoS * 1000);
  } catch {
    restaurarMusica();
  }
}

/** Phishing Man zomba ao pescar a orb. */
export function tocarSomHahaha(): void {
  void naFilaAudio(() => tocarZombaria('hahaha', DURACAO_HAHAHA_BOSS_S));
}

/** Mini-bot zomba ao roubar a orb. */
export function tocarSomHihihi(): void {
  void naFilaAudio(() => tocarZombaria('hihihi', DURACAO_HIHIHI_MINIBOT_S));
}

/** Coleta de moeda na run. */
export function tocarSomMoeda(): void {
  void tocarEfeito('moeda');
}

/** Coleta de moeda pirata (penaliza) — som distinto do da moeda normal. */
export function tocarSomMoedaPirata(): void {
  void tocarEfeito('moedaPirata');
}

export async function encerrarAudioJogo(): Promise<void> {
  await naFilaAudio(async () => {
    await pararFundo();
    for (const chave of Object.keys(efeitos) as Efeito[]) {
      const som = efeitos[chave];
      if (!som) continue;
      try {
        await som.stopAsync();
        await som.unloadAsync();
      } catch {
        /* ignore */
      }
      delete efeitos[chave];
    }
    for (const som of poolDisparo) {
      try {
        await som.stopAsync();
        await som.unloadAsync();
      } catch {
        /* ignore */
      }
    }
    poolDisparo.length = 0;
    indicePoolDisparo = 0;
    preparado = false;
  });
}
