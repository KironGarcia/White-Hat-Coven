/**
 * Phishing Man — um boss, várias técnicas via URL.
 * Ex.: http://pishing-man/email ensina phishing por e-mail;
 *      http://pishing-man/wpp ensina phishing por WhatsApp falso;
 *      http://pishing-man/vishing ensina golpe por ligação.
 * A aula e as perguntas ficam aqui (sem gastar API). A IA só entra para
 * julgar se a pessoa acertou e, aí sim, liberar o encanto.
 */

export interface LicaoIdioma {
  analogia: string;
  casoReal: string;
  porquePerigo: string;
  perguntas: [string, string, string];
  conviteProva: string;
}

/** Chat local do Gray Mage (placeholder — o texto fino entra depois). */
export interface ChatAulaIdioma {
  baloes: string[];
  pergunta: string;
  opcoes: [string, string, string];
  /** Índice da opção certa (0, 1 ou 2). */
  indiceCorreta: 0 | 1 | 2;
}

export interface TecnicaPhishingMan {
  /** Identificador estável: boss + técnica. */
  url: string;
  /** Encanto/flag que desbloqueia o modo fácil desta técnica. */
  flag: string;
  /** Nome curto para UI. */
  nomeTecnica: string;
  /** Nome do boss que aparece no balão (muda conforme o spawn). */
  nomeBoss: string;
  /** Aula local (pt / en / es) — memória do Oráculo. */
  licao: { pt: LicaoIdioma; en: LicaoIdioma; es: LicaoIdioma };
  /** Diálogo da tela Aprender (receita do Checkpoint 24). */
  chatAula?: { pt: ChatAulaIdioma; en: ChatAulaIdioma; es: ChatAulaIdioma };
}

const LICACAO_EMAIL: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'Pense num carteiro que chega com um envelope bonito, logo do seu banco, e pede para você “confirmar a senha” na casa do vizinho. A casa parece um banco, mas não é. Phishing por e-mail é isso: uma fantasia convincente para você entregar a chave da sua casa digital.',
    casoReal:
      'Um caso clássico: a pessoa recebe um e-mail “da Netflix” ou “do banco” dizendo que a conta será bloqueada. O link abre um site quase igual ao verdadeiro. Ela digita e-mail e senha — e alguém, em outro lugar, entra na conta de verdade. Não precisou invadir o computador: ela mesma abriu a porta.',
    porquePerigo:
      'Com a senha, o atacante pode ler seus e-mails, resetar outras contas, ver câmeras ligadas ao mesmo login ou fazer Pix. É perigoso porque parece urgente e oficial — o medo de “perder a conta” faz a gente clicar sem olhar o endereço.',
    perguntas: [
      '1) Por que um link em um e-mail inesperado pode ser perigoso mesmo se o visual parecer do banco ou da Netflix?',
      '2) O que você faz ANTES de clicar num link que pede senha ou dados?',
      '3) Se você já clicou e digitou a senha, qual é a primeira atitude segura?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'Imagine a courier with a fancy envelope, your bank’s logo on it, asking you to “confirm your password” at the neighbor’s house. It looks like a bank. It isn’t. Email phishing is that costume: a convincing disguise so you hand over the key to your digital home.',
    casoReal:
      'A classic case: someone gets an email “from Netflix” or “from the bank” saying the account will be locked. The link opens a site that looks almost real. They type email and password — and someone else logs into the real account. No malware needed: they opened the door themselves.',
    porquePerigo:
      'With the password, an attacker can read mail, reset other accounts, reach cameras on the same login, or move money. It works because it feels urgent and official — fear of “losing the account” makes people click without checking the address.',
    perguntas: [
      '1) Why can a link in an unexpected email be dangerous even if it looks like the bank or Netflix?',
      '2) What should you do BEFORE clicking a link that asks for a password or personal data?',
      '3) If you already clicked and typed the password, what is the first safe step?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      'Piensa en un cartero con un sobre lindo, logo de tu banco, pidiendo que “confirmes la contraseña” en la casa del vecino. Parece un banco. No lo es. El phishing por correo es ese disfraz: una mentira convincente para que entregues la llave de tu casa digital.',
    casoReal:
      'Un caso clásico: llega un correo “de Netflix” o “del banco” diciendo que la cuenta se bloqueará. El enlace abre un sitio casi igual al de verdad. La persona escribe correo y contraseña — y alguien entra en la cuenta real. No hizo falta hackear el computador: ella misma abrió la puerta.',
    porquePerigo:
      'Con la contraseña, el atacante puede leer correos, resetear otras cuentas, ver cámaras del mismo login o mover dinero. Es peligroso porque parece urgente y oficial: el miedo a “perder la cuenta” hace clic sin mirar la dirección.',
    perguntas: [
      '1) ¿Por qué un enlace en un correo inesperado puede ser peligroso aunque se vea como el banco o Netflix?',
      '2) ¿Qué haces ANTES de hacer clic en un enlace que pide contraseña o datos?',
      '3) Si ya hiciste clic y escribiste la contraseña, ¿cuál es el primer paso seguro?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const LICACAO_WPP: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'É como alguém vestido de primo batendo na porta às 23h: “tô sem carga no celular, me manda um Pix urgente”. A voz parece familiar, o nome no display também — mas é fantasia. No WhatsApp, o golpista veste o nome de alguém que você ama.',
    casoReal:
      'O golpe do “falso familiar” é comum no Brasil: clonam ou fingem o número da mãe, do filho, do chefe. Pedem código do WhatsApp, Pix ou “não conta pra ninguém”. Quem manda o código entrega a conta. Quem faz o Pix entrega o dinheiro. Tudo num chat que parecia íntimo.',
    porquePerigo:
      'A gente confia em quem ama. O atacante usa pressa e emoção para você não ligar e confirmar. Com a conta do WhatsApp, lê conversas, pede dinheiro para os seus contatos e espalha o golpe em cadeia.',
    perguntas: [
      '1) Por que um pedido urgente de Pix no WhatsApp, mesmo vindo “da sua mãe”, pode ser golpe?',
      '2) O que você NUNCA deve enviar a alguém que pede “o código que chegou no SMS/WhatsApp”?',
      '3) Qual é um jeito simples de confirmar se a pessoa do outro lado é quem diz ser?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'It’s like someone dressed as your cousin knocking at 11 p.m.: “my phone is dying, send money now.” The name on the screen looks right. It’s a costume. On WhatsApp, the scammer wears the name of someone you love.',
    casoReal:
      'The “fake relative” scam is common: they clone or spoof a mom’s, child’s, or boss’s number. They ask for a WhatsApp code, a transfer, or “don’t tell anyone.” Send the code and you hand over the account. Send the money and it’s gone. All in a chat that felt private.',
    porquePerigo:
      'We trust the people we love. The attacker uses urgency and emotion so you don’t call to check. With the WhatsApp account they read chats, ask your contacts for money, and spread the scam down the chain.',
    perguntas: [
      '1) Why can an urgent money request on WhatsApp be a scam even if it looks like “your mom”?',
      '2) What should you NEVER send to someone who asks for “the code that arrived by SMS/WhatsApp”?',
      '3) What is a simple way to confirm the person on the other side is who they claim to be?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      'Es como alguien vestido de primo tocando a las 23h: “se me acabó la batería, mándame un Pix urgente”. El nombre en la pantalla parece el de siempre. Es un disfraz. En WhatsApp, el estafador se pone el nombre de alguien que amas.',
    casoReal:
      'El golpe del “falso familiar” es común: clonan o fingen el número de la madre, el hijo, el jefe. Piden el código de WhatsApp, un Pix o “no le cuentes a nadie”. Quien manda el código entrega la cuenta. Quien hace el Pix entrega el dinero. Todo en un chat que parecía íntimo.',
    porquePerigo:
      'Confiamos en quien amamos. El atacante usa prisa y emoción para que no llames a confirmar. Con la cuenta de WhatsApp lee chats, pide dinero a tus contactos y reparte el golpe en cadena.',
    perguntas: [
      '1) ¿Por qué un pedido urgente de Pix en WhatsApp, aunque parezca “tu mamá”, puede ser un golpe?',
      '2) ¿Qué NUNCA debes enviar a alguien que pide “el código que llegó por SMS/WhatsApp”?',
      '3) ¿Cuál es una forma simple de confirmar si la persona del otro lado es quien dice ser?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const CHAT_EMAIL: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'Phishing por e-mail é um disfarce: a mensagem parece do banco ou da Netflix, mas o endereço é falso.',
      'Eles usam um motivo que gera medo — “sua conta vai fechar” — para a pessoa clicar e entregar a senha sem olhar. O fator comum sempre é uma msg com urgência.',
      'Antes de clicar, olhe o endereço. Nunca digite senha em link de e-mail inesperado. Se já digitou, troque a senha no site oficial.',
    ],
    pergunta:
      'Sua operadora de celular mandou um e-mail dizendo que o seu número foi hackeado e você tem que clicar no link para consertar. O que você faz?',
    opcoes: [
      'Clico no link: é a operadora e o número foi hackeado, não posso esperar.',
      'Não clico. Entro pelo app oficial da operadora, ou escrevo o site dela no navegador — sem usar o link do e-mail.',
      'Respondo o e-mail pedindo um protocolo; se vier número, aí eu clico.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'Email phishing is a costume: the message looks like your bank or Netflix, but the address is fake.',
      'They use a fear trigger — “your account will close” — so someone clicks and hands over the password without looking. The common factor is always an urgent message.',
      'Before clicking, check the address. Never type a password on an unexpected email link. If you already did, change it on the official site.',
    ],
    pergunta:
      'Your phone carrier emailed you saying your number was hacked and you have to click the link to fix it. What do you do?',
    opcoes: [
      'I click the link: it’s the carrier and my number was hacked, I can’t wait.',
      'I don’t click. I go in through the carrier’s official app, or I type their website in the browser myself — I don’t use the email link.',
      'I reply asking for a ticket number; if they send one, then I click.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      'El phishing por correo es un disfraz: el mensaje parece del banco o de Netflix, pero la dirección es falsa.',
      'Usan un motivo que da miedo — “tu cuenta se cierra” — para que alguien haga clic y entregue la contraseña sin mirar. El factor común siempre es un mensaje con urgencia.',
      'Antes de hacer clic, mira la dirección. Nunca escribas la contraseña en un enlace inesperado. Si ya lo hiciste, cámbiala en el sitio oficial.',
    ],
    pergunta:
      'Tu operadora de celular te mandó un correo diciendo que tu número fue hackeado y tienes que hacer clic en el enlace para arreglarlo. ¿Qué haces?',
    opcoes: [
      'Hago clic: es la operadora y el número fue hackeado, no puedo esperar.',
      'No hago clic. Entro por la app oficial de la operadora, o escribo su sitio en el navegador — sin usar el enlace del correo.',
      'Respondo el correo pidiendo un protocolo; si llega un número, entonces hago clic.',
    ],
    indiceCorreta: 1,
  },
};

const CHAT_WPP: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'No WhatsApp, o golpista veste o nome de alguém que você ama e pede uma transferência ou um código “urgente”.',
      'Pessoas comuns caem porque confiam na família. A pressa e a emoção impedem de ligar para confirmar.',
      'Aquele código do SMS é a chave da sua conta. Se você manda os números, a outra pessoa coloca no celular dela e toma controle do seu WPP. Não envie. Ligue no número que você já conhece.',
    ],
    pergunta:
      'Você recebe uma msg: “Oi filho, mudei de número, pode me mandar o código que chegou no seu celular? Tô na fila do banco e é urgente.” O que você faz?',
    opcoes: [
      'Ligo para este número novo e falo o código: por voz é mais seguro do que mandar por texto.',
      'Não mando. Ligo no número antigo que eu já tenho, ou confirmo pessoalmente.',
      'Clico no SMS primeiro para ver se é do WhatsApp; se for, aí eu mando.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'On WhatsApp, the scammer wears the name of someone you love and asks for a transfer or an “urgent” code.',
      'Ordinary people fall for it because they trust family. Hurry and emotion stop them from calling to check.',
      'That SMS code is the key to your account. If you send the numbers, the other person types them on their phone and takes control of your WhatsApp. Don’t send it. Call a number you already know.',
    ],
    pergunta:
      'You get a message: “Hi kid, I changed numbers, can you send me the code that just arrived on your phone? I’m in line at the bank and it’s urgent.” What do you do?',
    opcoes: [
      'I call this new number and say the code out loud: voice is safer than sending it in a text.',
      'I don’t send it. I call the old number I already have, or I confirm in person.',
      'I tap the SMS first to see if it’s from WhatsApp; if it is, then I send the code.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      'En WhatsApp, el estafador se pone el nombre de alguien que amas y pide una transferencia o un código “urgente”.',
      'La gente común cae porque confía en la familia. La prisa y la emoción impiden llamar para confirmar.',
      'Ese código del SMS es la llave de tu cuenta. Si mandas los números, la otra persona los pone en su celular y toma control de tu WPP. No lo envíes. Llama al número que ya conoces.',
    ],
    pergunta:
      'Recibes un mensaje: “Hola hijo, cambié de número, ¿me puedes mandar el código que llegó a tu celular? Estoy en la fila del banco y es urgente.” ¿Qué haces?',
    opcoes: [
      'Llamo a este número nuevo y digo el código: por voz es más seguro que mandarlo por texto.',
      'No lo mando. Llamo al número viejo que ya tengo, o confirmo en persona.',
      'Toco el SMS primero para ver si es de WhatsApp; si lo es, entonces mando el código.',
    ],
    indiceCorreta: 1,
  },
};

const LICACAO_VISHING: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'É como um ator no telefone usando a voz do gerente do banco. Sabe o seu nome, fala dos últimos dígitos do cartão, e pede “o código que acabou de chegar” para “cancelar uma compra”. A voz é humana. O disfarce também.',
    casoReal:
      'O falso funcionário liga, já com dados de um vazamento, e pede o SMS “para anular um débito”. Quem lê o código entrega a conta. Outro golpe: “suporte técnico” pede acesso remoto. Outro: emergência familiar pedindo depósito na hora, sem tempo de conferir.',
    porquePerigo:
      'A voz gera confiança que o e-mail não gera. A pressa não deixa desligar e ligar no número oficial. Saber o seu nome não prova nada — esses dados já circulam. O código do SMS é a chave que um banco de verdade nunca pede por telefone.',
    perguntas: [
      '1) Por que alguém saber o seu nome e os dígitos do cartão não prova que é o banco?',
      '2) O que você NUNCA deve passar por telefone, mesmo “para anular uma compra”?',
      '3) Qual é o passo seguro quando a ligação aperta por urgência?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'It’s an actor on the phone wearing the bank manager’s voice. They know your name, recite the last digits of your card, and ask for “the code that just arrived” to “cancel a purchase.” The voice is human. So is the costume.',
    casoReal:
      'A fake clerk calls with leaked data and asks for the SMS “to reverse a charge.” Read the code and you hand over the account. Another scam: “tech support” wants remote access. Another: a family emergency that needs money now, with no time to check.',
    porquePerigo:
      'A live voice builds trust email never does. Hurry stops you from hanging up and calling the official number. Knowing your name proves nothing — that data already circulates. The SMS code is the key a real bank will never ask for on a call.',
    perguntas: [
      '1) Why does someone knowing your name and card digits not prove they are the bank?',
      '2) What should you NEVER read over the phone, even “to cancel a purchase”?',
      '3) What is the safe move when the call pushes urgency?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      'Es un actor en el teléfono con la voz del gerente del banco. Sabe tu nombre, recita los últimos dígitos de la tarjeta y pide “el código que acaba de llegar” para “anular una compra”. La voz es humana. El disfraz también.',
    casoReal:
      'El falso empleado llama con datos de una filtración y pide el SMS “para anular un cargo”. Quien lee el código entrega la cuenta. Otro golpe: “soporte técnico” pide acceso remoto. Otro: emergencia familiar pidiendo un depósito ya, sin tiempo de comprobar.',
    porquePerigo:
      'La voz genera una confianza que el correo no logra. La prisa impide colgar y llamar al número oficial. Saber tu nombre no prueba nada — esos datos ya circulan. El código del SMS es la llave que un banco de verdad nunca pide por teléfono.',
    perguntas: [
      '1) ¿Por qué que alguien sepa tu nombre y los dígitos de la tarjeta no prueba que es el banco?',
      '2) ¿Qué NUNCA debes dictar por teléfono, aunque sea “para anular una compra”?',
      '3) ¿Cuál es el paso seguro cuando la llamada aprieta con urgencia?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const CHAT_VISHING: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'Vishing é um disfarce na voz: clonam o chefe, o gerente da financeira, alguém que você já conhece do trabalho.',
      'Te ligam com uma “emergência” e pedem uma transferência urgente. A voz parece a do chefe, então você não duvida. E eles não deixam você desligar para conferir.',
      'Antes de mandar o que pedem: desligue. Ligue no número que você já tem dessa pessoa, ou vá falar com ela. A voz falsa não atende o telefone de verdade.',
    ],
    pergunta:
      'Seu colega de trabalho liga dizendo que sofreu um acidente e precisa de uma transferência urgente. O que você faz?',
    opcoes: [
      'Mando um valor menor agora: se for golpe, perco pouco; se for verdade, eu ajudei.',
      'Desligo e ligo no número que eu já tinha dele, ou falo com alguém da família ou do trabalho que eu já conheço.',
      'Peço foto do hospital no WhatsApp ainda nesta ligação; se mandar, aí eu transfiro.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'Vishing is a costume on the voice: they clone your boss, the company finance manager, someone you already know from work.',
      'They call with an “emergency” and ask for an urgent transfer. The voice sounds like your boss, so you don’t doubt it. And they never let you hang up to check.',
      'Before you send what they ask: hang up. Call a number you already have for that person, or go talk to them. The fake voice won’t pick up the real phone.',
    ],
    pergunta:
      'A coworker calls saying they had an accident and need an urgent transfer. What do you do?',
    opcoes: [
      'I send a smaller amount now: if it’s a scam I lose little; if it’s real, I helped.',
      'I hang up and call a number I already had for them, or I talk to family or someone at work I already know.',
      'I ask for a hospital photo on WhatsApp still on this call; if they send it, then I transfer.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      'El vishing es un disfraz en la voz: clonan al jefe, al gerente de finanzas, a alguien que ya conoces del trabajo.',
      'Te llaman con una “emergencia” y piden una transferencia urgente. La voz parece la del jefe, entonces tú no dudas. Y no te dejan colgar para comprobar.',
      'Antes de enviar lo que piden: cuelga. Llama al número que ya tienes de esa persona, o ve a hablar con ella. La voz falsa no atiende el teléfono de verdad.',
    ],
    pergunta:
      'Un compañero de trabajo llama diciendo que tuvo un accidente y necesita una transferencia urgente. ¿Qué haces?',
    opcoes: [
      'Mando un valor más bajo ahora: si es golpe, pierdo poco; si es verdad, ayudé.',
      'Cuelgo y llamo al número que ya tenía de él, o hablo con alguien de la familia o del trabajo que ya conozco.',
      'Pido foto del hospital por WhatsApp aún en esta llamada; si la manda, entonces transfiero.',
    ],
    indiceCorreta: 1,
  },
};

export const TECNICAS_PHISHING_MAN: TecnicaPhishingMan[] = [
  {
    url: 'http://pishing-man/email',
    flag: 'shazan',
    nomeTecnica: 'e-mail',
    nomeBoss: 'Phishing-Man',
    licao: LICACAO_EMAIL,
    chatAula: CHAT_EMAIL,
  },
  {
    url: 'http://pishing-man/wpp',
    flag: 'deepfake',
    nomeTecnica: 'WhatsApp',
    nomeBoss: 'Phishing-Man',
    licao: LICACAO_WPP,
    chatAula: CHAT_WPP,
  },
  {
    url: 'http://pishing-man/vishing',
    flag: 'metamorfo',
    nomeTecnica: 'vishing',
    nomeBoss: 'Phishing-Man',
    licao: LICACAO_VISHING,
    chatAula: CHAT_VISHING,
  },
];

/** Técnica padrão da Demo 1 enquanto o pool ainda é simples. */
export const TECNICA_PADRAO_PHISHING = TECNICAS_PHISHING_MAN[0];

/** Frases que voltam o questionário (sem gastar API). */
export const FRASES_PRONTO_PROVA = [
  'já tenho as respostas',
  'ja tenho as respostas',
  'ya tengo las respuestas',
  'i have the answers',
  'i already have the answers',
];

export function buscarTecnicaPorUrl(url: string): TecnicaPhishingMan | undefined {
  return TECNICAS_PHISHING_MAN.find((tecnica) => tecnica.url === url);
}

export function buscarEncantoPorPergunta(texto: string): TecnicaPhishingMan | undefined {
  const t = texto.trim().toLowerCase();
  if (!t) return undefined;
  for (const tecnica of TECNICAS_PHISHING_MAN) {
    if (t.includes(tecnica.url.toLowerCase())) return tecnica;
  }
  if (
    t.includes('pishing-man') ||
    t.includes('phishing-man') ||
    t.includes('phishing')
  ) {
    return TECNICA_PADRAO_PHISHING;
  }
  return undefined;
}

export function ehFraseProntoParaProva(texto: string): boolean {
  const t = texto.trim().toLowerCase();
  return FRASES_PRONTO_PROVA.some((frase) => t === frase || t.includes(frase));
}

export function textoAulaEProva(
  tecnica: TecnicaPhishingMan,
  idioma: 'pt' | 'en' | 'es' = 'pt',
): string {
  const licao = tecnica.licao[idioma] ?? tecnica.licao.pt;
  const titulo =
    idioma === 'en'
      ? `This attack is ${tecnica.nomeBoss} (${tecnica.nomeTecnica}).`
      : idioma === 'es'
        ? `Este ataque es el ${tecnica.nomeBoss} (${tecnica.nomeTecnica}).`
        : `Este ataque é o ${tecnica.nomeBoss} (${tecnica.nomeTecnica}).`;
  return (
    `${titulo}\n\n` +
    `${licao.analogia}\n\n` +
    `${licao.casoReal}\n\n` +
    `${licao.porquePerigo}\n\n` +
    `${licao.conviteProva}\n\n` +
    licao.perguntas.join('\n')
  );
}

export function textoSoPerguntas(
  tecnica: TecnicaPhishingMan,
  idioma: 'pt' | 'en' | 'es' = 'pt',
): string {
  const licao = tecnica.licao[idioma] ?? tecnica.licao.pt;
  const intro =
    idioma === 'en'
      ? 'Let’s try again. Answer the three questions:'
      : idioma === 'es'
        ? 'Vamos otra vez. Responde las tres preguntas:'
        : 'Vamos de novo. Responda as três perguntas:';
  return `${intro}\n\n${licao.perguntas.join('\n')}`;
}

export function textoEntregaEncanto(
  tecnica: TecnicaPhishingMan,
  idioma: 'pt' | 'en' | 'es' = 'pt',
): string {
  if (idioma === 'en') {
    return `You got it. The secret enchantment is:\n\n${tecnica.flag}\n\nGo back to the game and type that word to the Gray Mage.`;
  }
  if (idioma === 'es') {
    return `Lo lograste. El encantamiento secreto es:\n\n${tecnica.flag}\n\nVuelve al juego y escribe esa palabra al Gray Mage.`;
  }
  return `Você acertou. O encantamento secreto é:\n\n${tecnica.flag}\n\nVolte ao jogo e digite essa palavra para o Gray Mage.`;
}

/** @deprecated Use textoEntregaEncanto — a flag não sai mais na primeira fala. */
export function textoRespostaEncanto(
  tecnica: TecnicaPhishingMan,
  idioma: 'pt' | 'en' | 'es' = 'pt',
): string {
  return textoEntregaEncanto(tecnica, idioma);
}

export function validarFlagDaUrl(url: string, flagDigitada: string): boolean {
  const tecnica = buscarTecnicaPorUrl(url);
  if (!tecnica) return false;
  return tecnica.flag.trim().toLowerCase() === flagDigitada.trim().toLowerCase();
}
