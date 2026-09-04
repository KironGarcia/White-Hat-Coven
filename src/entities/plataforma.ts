/**
 * Entidade de plataforma (a arte não anima).
 * O tipo indexa a lista PLATAFORMAS em assets.ts.
 * Fake dispara invasão. Móvel / quebra entram a partir da fase 2 / 3.
 */

export interface Plataforma {
  id: number;
  x: number;
  y: number;
  /** Índice em PLATAFORMAS (assets.ts): 0, 1 ou 2. Ignorado se ehFake. */
  tipo: number;
  largura: number;
  altura: number;
  /** Armadilha de phishing — pousar abre a tela intermediária do boss. */
  ehFake?: boolean;
  /** Entrada da loja — pouso na metade da arte (não no topo). */
  ehTienda?: boolean;
  /** Fase 2+: oscila 1 cm pra cada lado. */
  ehMovel?: boolean;
  /** Centro de descanso da oscilação. */
  xBase?: number;
  /** Tempo acumulado da senoide (s). */
  faseOscilacao?: number;
  /** Fase 3+: pisca 1 vez, espera e some. */
  ehQuebra?: boolean;
  estadoQuebra?: 'inteira' | 'piscando' | 'aviso' | 'sumiu';
  /** Timer do pisca ou da espera antes de sumir (s). */
  tempoPisca?: number;
  /** Quantos apagões já aconteceram (some depois de 1 + espera). */
  piscasFeitos?: number;
  /** Durante o pisca: false = frame apagado. */
  visivelPisca?: boolean;
  /**
   * Fase 4: mini-zombie caminhando sobre esta plataforma.
   * Presente apenas em plataformas fixas (não móvel, não quebra).
   */
  zombie?: {
    /** Posição X atual na tela (px). */
    x: number;
    /** Direção de caminhada: 1 = direita, -1 = esquerda. */
    dir: 1 | -1;
    /** Acumulador de tempo para animação. */
    frameTimer: number;
    /** Frame atual do sprite (0 ou 1). */
    frameAtual: 0 | 1;
  };
}
