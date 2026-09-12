/**
 * Entidades da arena do Phishing Man (hit-box, patch, barra de brecha, disparo).
 */

export type EtiquetaHitbox = 'Plataforma.1' | 'Plataforma.2' | 'Plataforma.3' | 'Plataforma.mwr1';

export interface HitboxBoss {
  id: number;
  x: number;
  y: number;
  largura: number;
  altura: number;
  etiqueta: EtiquetaHitbox;
}

export interface PatchBoss {
  id: number;
  x: number;
  y: number;
  largura: number;
  altura: number;
}

/** Coração do boss — caixa estática na arena enquanto o patch está ativo. */
export interface BarraBrecha {
  x: number;
  y: number;
  largura: number;
  altura: number;
}

export type FaseAnzol = 'patrulha' | 'descendo' | 'parado' | 'subindo';

export interface EstadoAnzol {
  xCarrinho: number;
  yCarrinho: number;
  xAnzol: number;
  yAnzol: number;
  fase: FaseAnzol;
  tempoFaseS: number;
  direcao: 1 | -1;
  /** Y do anzol recolhido (junto do carrinho). */
  yRecolhido: number;
  /** Y alvo da descida (altura da orb no momento do stop). */
  yAlvo: number;
}

export interface VirusBoss {
  id: number;
  x: number;
  y: number;
  largura: number;
  altura: number;
  /** 0 = intacto; 1 = tomou um tiro e pisca. */
  hits: number;
}

export type FaseDisparoBoss = 'salida' | 'viagem' | 'impacto';

export interface DisparoBoss {
  id: number;
  x: number;
  y: number;
  largura: number;
  altura: number;
  fase: FaseDisparoBoss;
  tempoFaseS: number;
}

export type FaseArenaBoss = 'plataformas' | 'janela_patch' | 'vitoria';

/** Quem a tela está mostrando (sprites + ataque especial). */
export type TipoTelaBoss = 'phishing_man' | 'zombie_net' | 'capitao_pirata';

/** Mini-bot da botnet: cai como o vírus, dancinha parado no ar. */
export interface MiniBotZombie {
  id: number;
  x: number;
  y: number;
  largura: number;
  altura: number;
  /** Coluna de queda (a dancinha só oscila em volta). */
  xQueda: number;
  /** 1 = direita, -1 = esquerda. */
  direcao: 1 | -1;
  /** 0, 1, 2 — três giros da dancinha. */
  passoDanca: number;
  tempoDancaS: number;
  /** 0 = intacto; 1 = tomou um tiro e pisca. */
  hits: number;
  /** > 0: pisca uma vez e some (levou a orb). */
  tempoPiscaSumirS: number;
}

export type FaseInfeccaoOrb =
  | 'inativa'
  | 'bot_sumindo'
  | 'espera_rajada'
  | 'rajada'
  | 'pisca_volta';

/** Moeda que cai na arena do Capitão (boa ou pirata). */
export interface MoedaArena {
  id: number;
  x: number;
  y: number;
  largura: number;
  altura: number;
  pirata: boolean;
}

/** Baú Pix: tampa abre/fecha; aberto mostra o texto CLIQUE AQUI. */
export interface BauPixArena {
  id: number;
  x: number;
  y: number;
  largura: number;
  altura: number;
  tampaAberta: boolean;
  tempoFrameS: number;
}

export interface EstadoArenaBoss {
  hitboxes: HitboxBoss[];
  patch: PatchBoss | null;
  barra: BarraBrecha | null;
  disparos: DisparoBoss[];
  tempoRecargaDisparoS: number;
  /** Taps na fila (um tiro por toque, vários na tela). */
  pedidosDisparo: number;
  virus: VirusBoss[];
  anzol: EstadoAnzol | null;
  /** Orb fisgada: sobe com o anzol; o relógio de 7 s só arma no topo. */
  orbAmarrada: boolean;
  tempoSequestroOrbS: number;
  tempoInvencivelS: number;
  tempoAteDropS: number;
  /** Segundos desde o início da luta (primeiro patch espera 4 s). */
  tempoNaLutaS: number;
  fase: FaseArenaBoss;
  /** Uma vida nesta versão — morrer = sair da tela. */
  vivo: boolean;
  /** Corações do mago na arena (começa em 2). */
  vidas: number;
  /** Pose de morto após cair; depois revive ou encerrar. */
  tempoMortoS: number;
  /** Encanto do Oráculo: patch cai mais e disparo de 10. */
  encantoAtivo: boolean;
  bossHp: number;
  bossHpMax: number;
  /** Segundos restantes do ponto frágil. 0 = barra apagada. */
  tempoStunS: number;
  /** Tempo restante da animação de hit. 0 = idle. */
  tempoHitBossS: number;
  /** Incrementa a cada acerto — reinicia a animação de hit se já estava tocando. */
  tokenHitBoss: number;
  /** Tempo restante do HAHAHA (uma vez por pesca). 0 = idle. */
  tempoHahahaBossS: number;
  /** Incrementa a cada pesca — reinicia o HAHAHA do frame 0. */
  tokenHahahaBoss: number;
  /** Pisca da orb no anzol antes de voltar à cabeça. 0 = sumiu / já voltou. */
  tempoPiscaSoltaOrbS: number;
  /** Perfil da tela (sprites + ataque especial). */
  tipoTela: TipoTelaBoss;
  miniBots: MiniBotZombie[];
  tempoAteMiniBotS: number;
  faseInfeccao: FaseInfeccaoOrb;
  disparosInfectados: DisparoBoss[];
  /** Lado de onde a orb infectada começa a varrer o topo. */
  ladoInfeccao: 'esquerda' | 'direita';
  colunasRajada: number[];
  indiceTiroRajada: number;
  tempoProximoTiroRajadaS: number;
  /** Moedas da run nesta luta (Capitão pode somar e roubar). */
  moedasRun: number;
  /** Tempo restante do flash vermelho ao perder moedas. 0 = ouro. */
  tempoHitMoedasS: number;
  moedasArena: MoedaArena[];
  bauPix: BauPixArena | null;
  tempoAteBauS: number;
  /** Roubo infinito: −5 / 1 s até o patch ou zero. */
  roboAtivo: boolean;
  tempoRouboS: number;
  /** Primeiro pendrive depois do roubo merece o aviso (uma vez). */
  avisoRouboPendente: boolean;
  /** Patch que já estava na tela quando o roubo começou (−1 = nenhum). */
  idPatchAoIniciarRoubo: number;
}
