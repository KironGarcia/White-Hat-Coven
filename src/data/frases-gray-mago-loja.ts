/**
 * Frases do Gray Mage na loja — cinza, nem White Hat nem Black Hat.
 * Uma frase aleatória a cada vez que o jogador entra na loja.
 */

export const FRASES_GRAY_MAGO_LOJA: string[] = [
  'A porta trancada e a porta pintada de trancada guardam coisas diferentes. Você só enxerga uma.',
  'Não existe magia branca nem negra, garoto. Só existe magia que você ainda não sabe ler.',
  'Quem grita \'eu sou bom\' mais alto é porque algo na sombra dele precisa que acreditem.',
  'Guardei meu coração em três chaves diferentes. Perdi uma de propósito. Adivinha qual.',
  'O fogo não escolhe quem se aquece e quem se queima. Isso quem decide é a mão.',
  'Todo cadeado sonha com a chave que o abre. Eu sonho com o cadeado que não deveria existir.',
  'Sabe qual é o feitiço mais perigoso? Aquele que parece inofensivo trezentas vezes seguidas.',
  'Os deuses de antigamente também eram demônios de algum outro povo. Pergunta pra história, não pra mim.',
  'Eu vendo silêncio. É caro. A maioria prefere pagar em mentiras, que sai de graça mas custa a alma.',
  'Não confie no mapa que nunca erra. Mapa honesto sempre tem uma mancha.',
  'Eu também já fui de um lado, uma vez. Agora sou do lado dos que sobreviveram a ter um lado.',
  'A luz mais forte projeta a sombra mais nítida. Cuidado com herói sem sombra: ele tá mentindo.',
  'Toda porta dos fundos começa como um favor entre amigos.',
  'O vazio não está vazio. Está cheio de tudo que você decidiu não olhar.',
  'Segredo bem guardado não se esconde — se disfarça de chato.',
  'Me pergunta o que eu sou e eu vou mentir com a verdade. Me pergunta o que eu não sou, aí sim a gente começa a falar sério.',
  'O tempo não cura nada. Só troca quem carrega a ferida.',
  'Cada máscara que eu uso pesa menos que o rosto de baixo. Por isso eu prefiro elas.',
  'Não existe final feliz, existe final que você parou de olhar antes que continuasse.',
  'Ri, ri à vontade. No dia que você entender o que eu disse, você não vai mais rir do mesmo jeito.',
];

export function sortearFraseGrayMagoLoja(): string {
  const i = Math.floor(Math.random() * FRASES_GRAY_MAGO_LOJA.length);
  return FRASES_GRAY_MAGO_LOJA[i];
}

/** Respostas curtas no balão — cabem na arte do header. */
export const FRASE_LOJA_SEM_MOEDAS =
  'Ops, parece que você não tem o suficiente para comprar este item.';
export const FRASE_LOJA_VIDA_CHEIA =
  'Pequeno mago, você já tem a vida cheia. Não precisa de mais corações.';
export const FRASE_LOJA_POCAO_OK = 'Pronto. Um coração de volta.';
export const FRASE_LOJA_COMPRA_OK = 'Feito. Agora é seu.';
