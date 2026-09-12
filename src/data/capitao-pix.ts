/**
 * Capitão Pix — golpe do dinheiro instantâneo, por país.
 * Tags: Pix (Brasil), Yape (Peru), Zelle (EUA).
 */

import type { TecnicaPhishingMan } from './phishing-man';

const LICACAO_PIX: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'É como um baú na rua com o cartaz “CLIQUE AQUI e ganhe ouro”. Você confirma, o ouro some da bolsa e o baú ri. No Pix o Capitão não quebra o banco: convence você a apertar confirmar.',
    casoReal:
      'Filho com número novo pedindo Pix urgente. “Pix errado” que você devolve para outra conta — e depois o banco cobra um empréstimo que você não fez. Falso gerente pedindo “transferência de teste” para proteger a conta.',
    porquePerigo:
      'Pix é instantâneo e quase sem volta. Pressa + tela conhecida = a mão confirma antes da cabeça. Pix que “caiu por engano” não se devolve por conta própria: manda a pessoa resolver no banco.',
    perguntas: [
      '1) Qual é a armadilha de devolver um “Pix errado” para outra conta?',
      '2) O que você faz quando a mensagem aperta por urgência?',
      '3) Um banco de verdade pede transferência de teste para “proteger” a conta?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'It’s a chest in the street with a sign: “CLICK HERE and get gold.” You confirm, the gold leaves your pouch, the chest laughs. With Pix the Captain does not break the bank: he talks you into tapping confirm.',
    casoReal:
      'A “son with a new number” asking for an urgent transfer. A “wrong Pix” you send back to another account — then the bank bills you for a loan you never took. A fake clerk asking for a “test transfer” to protect the account.',
    porquePerigo:
      'Pix is instant and almost irreversible. Hurry + a familiar screen = the hand confirms before the head. A Pix that “arrived by mistake” is not yours to return: tell them to sort it with the bank.',
    perguntas: [
      '1) What is the trap in returning a “wrong Pix” to another account?',
      '2) What do you do when the message pushes urgency?',
      '3) Does a real bank ask for a test transfer to “protect” the account?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      'Es un cofre en la calle con un cartel: “CLIC AQUÍ y gana oro”. Confirmas, el oro sale de tu bolsa, el cofre se ríe. En el Pix el Capitán no rompe el banco: te convence de apretar confirmar.',
    casoReal:
      'Hijo con número nuevo pidiendo Pix urgente. “Pix errado” que devuelves a otra cuenta — y después el banco cobra un préstamo que no pediste. Falso gerente pidiendo “transferencia de prueba” para proteger la cuenta.',
    porquePerigo:
      'Pix es instantáneo y casi sin vuelta. Prisa + pantalla conocida = la mano confirma antes que la cabeza. Un Pix que “cayó por error” no se devuelve por tu cuenta: manda a la persona a resolverlo en el banco.',
    perguntas: [
      '1) ¿Cuál es la trampa de devolver un “Pix errado” a otra cuenta?',
      '2) ¿Qué haces cuando el mensaje aprieta con urgencia?',
      '3) ¿Un banco de verdad pide una transferencia de prueba para “proteger” la cuenta?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const LICACAO_YAPE: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'No Peru o Yape é tão comum quanto dinheiro vivo. O golpe não quebra o app: finge a tela de “pago exitoso” ou cola um QR falso em cima do verdadeiro.',
    casoReal:
      'App clone mostra animação de pagamento — e nada cai na sua conta. QR adulterado no caixa desvia o valor. Link no WhatsApp instala um Yape falso e entrega o celular.',
    porquePerigo:
      'A gente confia no que vê na tela do outro, na hora do apuro. Tela alheia se fabrica. A única prova é o que aparece no SEU app. App só da loja oficial. QR torto ou colado por cima? Desconfie.',
    perguntas: [
      '1) A tela de “pago exitoso” no celular do cliente prova o pagamento?',
      '2) O que você olha num QR de loja antes de escanear?',
      '3) De onde você baixa o app de pagamento?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'In Peru, Yape is as normal as cash. The scam does not break the app: it fakes the “payment successful” screen or sticks a fake QR over the real one.',
    casoReal:
      'A clone app plays the success animation — and nothing lands in your account. A tampered QR at the till steers the money away. A WhatsApp link installs a fake Yape and hands over the phone.',
    porquePerigo:
      'People trust what they see on someone else’s screen in a hurry. That screen can be faked. The only proof is what appears in YOUR app. Apps only from the official store. Crooked or restuck QR? Be suspicious.',
    perguntas: [
      '1) Does the client’s “payment successful” screen prove the payment?',
      '2) What do you check on a shop QR before scanning?',
      '3) Where do you download the payment app from?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      'En Perú, Yape es tan natural como el efectivo. El golpe no rompe la app: finge la pantalla de “pago exitoso” o pega un QR falso encima del verdadero.',
    casoReal:
      'Una app clonada muestra la animación de pago — y no cae nada en tu cuenta. Un QR adulterado en caja desvía el dinero. Un link de WhatsApp instala un Yape falso y entrega el celular.',
    porquePerigo:
      'La gente confía en lo que ve en la pantalla del otro, en el apuro. Esa pantalla se fabrica. La única prueba es lo que aparece en TU app. App solo de la tienda oficial. ¿QR chueco o pegado encima? Desconfía.',
    perguntas: [
      '1) ¿La pantalla de “pago exitoso” del cliente prueba el pago?',
      '2) ¿Qué miras en un QR de tienda antes de escanear?',
      '3) ¿De dónde bajas la app de pago?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const LICACAO_ZELLE: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'No Zelle o golpe entra vestido de banco: o app mora dentro do banco, então a confiança já está pronta. O Capitão ataca essa confiança, não a tecnologia.',
    casoReal:
      'SMS que parece do banco pergunta se você autorizou uma compra. Você diz não. “O setor de fraude” liga e pede um Zelle “para reverter”. Marketplace: pagou, o produto nunca chegou. Conta “da companhia de luz” que era falsa.',
    porquePerigo:
      'Quem autorizou a transferência quase nunca recupera o dinheiro. Banco de verdade nunca pede que VOCÊ faça um envio para desfazer um golpe. Desligue e ligue no número do cartão. Zelle é para gente que você já conhece, não para desconhecido.',
    perguntas: [
      '1) O banco pede que você faça um Zelle para “reverter” um golpe?',
      '2) De qual número você liga quando chega um alerta de fraude?',
      '3) Por que um percentual baixíssimo de fraude ainda pode te prejudicar?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'With Zelle the scam wears a bank costume: the app lives inside your bank, so the trust is already there. The Captain attacks that trust, not the tech.',
    casoReal:
      'A text that looks like the bank asks if you authorized a charge. You say no. “Fraud” calls and asks for a Zelle “to reverse it.” Marketplace: you paid, the item never came. A “utility” account that was fake.',
    porquePerigo:
      'If you authorized the send, the money almost never comes back. A real bank never asks YOU to make a transfer to undo a scam. Hang up and call the number on the card. Zelle is for people you already know, not strangers.',
    perguntas: [
      '1) Does the bank ask you to send a Zelle to “reverse” a scam?',
      '2) Which number do you call when a fraud alert arrives?',
      '3) Why can a tiny fraud percentage still hurt you?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      'En Zelle el golpe entra vestido de banco: la app vive dentro del banco, así que la confianza ya está lista. El Capitán ataca esa confianza, no la tecnología.',
    casoReal:
      'Un SMS que parece del banco pregunta si autorizaste un cargo. Dices que no. “Fraude” llama y pide un Zelle “para revertirlo”. Marketplace: pagaste y el producto nunca llegó. Una cuenta “de la luz” que era falsa.',
    porquePerigo:
      'Quien autorizó el envío casi nunca recupera el dinero. Un banco de verdad nunca pide que TÚ hagas una transferencia para deshacer un golpe. Cuelga y llama al número de la tarjeta. Zelle es para gente que ya conoces, no para desconocidos.',
    perguntas: [
      '1) ¿El banco te pide hacer un Zelle para “revertir” un golpe?',
      '2) ¿A qué número llamas cuando llega una alerta de fraude?',
      '3) ¿Por qué un porcentaje bajísimo de fraude igual puede perjudicarte?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const CHAT_PIX: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'No Brasil, um golpe ficou famoso: começa com uma msg, como muitos ataques, usando familiares ou o seu banco.',
      'Essa msg te induz a fazer um Pix de teste para um número específico. É nesse momento que o atacante ganha o controle da sua conta.',
      'O tom sempre é urgência e ação imediata. Se alguém conhecido pedir um Pix por urgência, confirme ligando direto para a pessoa, ou fale com familiares que você já conhece para validar.',
    ],
    pergunta:
      'Cai um Pix de um número que você não conhece e, em seguida, pedem para devolver em outra conta. O que você faz?',
    opcoes: [
      'Devolvo na hora: o dinheiro não é meu.',
      'Não devolvo. Mando a pessoa resolver no banco.',
      'Devolvo um valor menor primeiro para ver se é golpe.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'In Brazil a scam became famous: it starts with a message, like many attacks, using family or your bank.',
      'That message pushes you to send a test Pix to a specific number. That’s the moment the attacker takes control of your account.',
      'The tone is always urgency and immediate action. If someone you know asks for a Pix because of an emergency, confirm by calling that person directly, or check with family you already know.',
    ],
    pergunta:
      'A Pix lands from a number you don’t know, and then they ask you to send it back to another account. What do you do?',
    opcoes: [
      'I send it back now: the money isn’t mine.',
      'I don’t send it back. I tell them to sort it with the bank.',
      'I send a smaller amount first to see if it’s a scam.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      'En Brasil un golpe se hizo famoso: empieza con un mensaje, como muchos ataques, usando familiares o tu banco.',
      'Ese mensaje te induce a hacer un Pix de prueba a un número específico. Es en ese momento cuando el atacante gana el control de tu cuenta.',
      'El tono siempre es urgencia y acción inmediata. Si alguien conocido pide un Pix por una urgencia, confirma llamando directo a esa persona, o habla con familiares que ya conoces para validar.',
    ],
    pergunta:
      'Cae un Pix de un número que no conoces y, enseguida, piden que lo devuelvas a otra cuenta. ¿Qué haces?',
    opcoes: [
      'Lo devuelvo ya: el dinero no es mío.',
      'No lo devuelvo. Mando a la persona a resolverlo en el banco.',
      'Devuelvo un valor más bajo primero para ver si es golpe.',
    ],
    indiceCorreta: 1,
  },
};

const CHAT_YAPE: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'No Peru todo mundo usa Yape para transferir dinheiro. Mas você já conhecia os ataques possíveis com ele?',
      'O golpista tem um sistema no celular que simula uma confirmação de pagamento falsa. Você acha que o dinheiro caiu na conta, mas no final ele foi embora sem pagar.',
      'A confirmação de verdade aparece no SEU Yape. Você vai notar uma notificação sempre que a transferência foi de verdade bem-sucedida. Fique atento: valide no seu celular que o valor caiu, antes que a pessoa saia do estabelecimento.',
    ],
    pergunta:
      'Na bodega do bairro, um cliente mostra o celular com a animação de pagamento e já vai saindo — “o táxi está esperando”. O lugar está barulhento e você não ouviu o som do Yape. O que você faz?',
    opcoes: [
      'Deixo ir: ele mostrou a tela, deve ter caído.',
      'Peço um segundo: olho no MEU Yape se a notificação e o valor chegaram, antes de ele sair.',
      'Gravo um vídeo da tela dele para ter prova, e deixo ir.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'In Peru everyone uses Yape to send money. But did you already know the attacks that are possible with it?',
      'The scammer has a system on their phone that fakes a payment confirmation. You think the money landed, but in the end they leave without paying.',
      'The real confirmation shows up in YOUR Yape. You will see a notification whenever the transfer really succeeded. Stay alert: check on your phone that the money landed, before the person leaves the shop.',
    ],
    pergunta:
      'At the neighborhood shop, a customer shows their phone with the payment animation and is already walking out — “the taxi is waiting.” The place is loud and you didn’t hear the Yape sound. What do you do?',
    opcoes: [
      'I let them go: they showed the screen, it must have landed.',
      'I ask for a second: I check MY Yape for the notification and the amount, before they leave.',
      'I record a video of their screen as proof, and I let them go.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      'En Perú todo el mundo usa Yape para transferir dinero. ¿Pero ya conocías los ataques posibles con él?',
      'El estafador tiene un sistema en su celular que simula una confirmación de pago falsa. Crees que el dinero cayó en la cuenta, pero al final se fue sin pagar.',
      'La confirmación de verdad aparece en TU Yape. Vas a notar una notificación siempre que la transferencia fue de verdad exitosa. Mantente atento: valida en tu celular que el valor cayó, antes de que la persona salga del local.',
    ],
    pergunta:
      'En la bodega del barrio, un cliente muestra el celular con la animación de pago y ya se está yendo — “el taxi está esperando”. El lugar está ruidoso y no oíste el sonido de Yape. ¿Qué haces?',
    opcoes: [
      'Lo dejo ir: mostró la pantalla, debe haber caído.',
      'Pido un segundo: miro en MI Yape si llegaron la notificación y el valor, antes de que salga.',
      'Grabo un video de su pantalla para tener prueba, y lo dejo ir.',
    ],
    indiceCorreta: 1,
  },
};

const CHAT_ZELLE: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'Nos Estados Unidos quase todo mundo manda dinheiro pelo Zelle, direto do app do banco. Mas você já conhecia os ataques possíveis com ele?',
      'O golpista manda um SMS que parece do banco: “você autorizou essa compra?”. Você diz não. Aí “o setor de fraude” pede um Zelle para proteger ou reverter. É nesse momento que o dinheiro sai da sua conta — quem autorizou quase nunca recupera.',
      'Banco de verdade nunca pede que VOCÊ faça um Zelle para desfazer um golpe. Desligue e ligue no número do verso do cartão. Confira no SEU app do banco, não no SMS.',
    ],
    pergunta:
      'Você achou um apartamento no anúncio. O “dono” pede o depósito do primeiro mês por Zelle hoje, senão a vaga vai embora, e já mandou um contrato em PDF. O que você faz?',
    opcoes: [
      'Mando: o Zelle está no meu banco, e tem contrato.',
      'Não mando para quem eu não conheço. Zelle é para gente conhecida; aluguel eu confirmo no prédio e no canal oficial.',
      'Mando um valor menor primeiro; se o contrato for verdadeiro, o resto eu mando depois.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'In the United States almost everyone sends money with Zelle, right from the bank app. But did you already know the attacks that are possible with it?',
      'The scammer sends a text that looks like the bank: “did you authorize this purchase?” You say no. Then “fraud” asks for a Zelle to protect or reverse it. That’s when the money leaves your account — if you authorized it, it almost never comes back.',
      'A real bank never asks YOU to send a Zelle to undo a scam. Hang up and call the number on the back of the card. Check YOUR bank app, not the text.',
    ],
    pergunta:
      'You found an apartment listing. The “owner” wants the first month’s deposit by Zelle today or the place is gone, and they already sent a PDF contract. What do you do?',
    opcoes: [
      'I send it: Zelle is in my bank, and there’s a contract.',
      'I don’t send it to someone I don’t know. Zelle is for people I already know; a rental I confirm at the building and through an official channel.',
      'I send a smaller amount first; if the contract is real, I’ll send the rest later.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      'En Estados Unidos casi todo el mundo manda dinero por Zelle, directo desde la app del banco. ¿Pero ya conocías los ataques posibles con él?',
      'El estafador manda un SMS que parece del banco: “¿autorizaste esta compra?”. Dices que no. Entonces “fraude” pide un Zelle para proteger o revertir. Es en ese momento cuando el dinero sale de tu cuenta — quien autorizó casi nunca lo recupera.',
      'Un banco de verdad nunca pide que TÚ hagas un Zelle para deshacer un golpe. Cuelga y llama al número detrás de la tarjeta. Revisa en TU app del banco, no en el SMS.',
    ],
    pergunta:
      'Encontraste un departamento en un anuncio. El “dueño” pide el depósito del primer mes por Zelle hoy o se va el lugar, y ya mandó un contrato en PDF. ¿Qué haces?',
    opcoes: [
      'Mando: Zelle está en mi banco, y hay contrato.',
      'No mando a quien no conozco. Zelle es para gente conocida; un alquiler lo confirmo en el edificio y por un canal oficial.',
      'Mando un valor más bajo primero; si el contrato es verdadero, el resto lo mando después.',
    ],
    indiceCorreta: 1,
  },
};

export const TECNICAS_CAPITAO_PIX: TecnicaPhishingMan[] = [
  {
    url: 'http://capitan-pix/pix',
    flag: 'bitcoin',
    nomeTecnica: 'Pix',
    nomeBoss: 'Capitão Pix',
    licao: LICACAO_PIX,
    chatAula: CHAT_PIX,
  },
  {
    url: 'http://capitan-pix/yape',
    flag: 'yapato',
    nomeTecnica: 'Yape',
    nomeBoss: 'Capitão Pix',
    licao: LICACAO_YAPE,
    chatAula: CHAT_YAPE,
  },
  {
    url: 'http://capitan-pix/zelle',
    flag: 'gringotts',
    nomeTecnica: 'Zelle',
    nomeBoss: 'Capitão Pix',
    licao: LICACAO_ZELLE,
    chatAula: CHAT_ZELLE,
  },
];

export const TECNICA_PADRAO_CAPITAO_PIX = TECNICAS_CAPITAO_PIX[0];
