/**
 * Zombie-net — aparelhos da casa viram zumbis na rede.
 * Tags: Smart-TV, Camera, botnet.
 */

import type { TecnicaPhishingMan } from './phishing-man';

const LICACAO_SMART_TV: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'A TV da sala virou um computador ligado o dia todo. Enquanto você assiste a série, ela pode estar obedecendo um desconhecido — sem a tela piscar errado.',
    casoReal:
      'Apps de streaming pirata já entregaram milhares de TVs a redes criminosas. A imagem continuava nítida. O aparelho, nos bastidores, virava ponte para atacar outras pessoas. Algumas caixas baratas já nascem com a porta dos fundos aberta.',
    porquePerigo:
      'O ataque gosta de ficar quieto: TV que trava chama atenção e você desliga. App fora da loja oficial é a porta mais comum. Rede de convidados e atualização diminuem o estrago.',
    perguntas: [
      '1) Por que uma TV “funcionando perfeito” ainda pode estar infectada?',
      '2) O que você evita instalar na smart TV?',
      '3) Onde a TV fica mais segura na sua Wi-Fi?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'The living-room TV became a computer that stays online all day. While you watch a show, it may be taking orders from a stranger — without the picture glitching.',
    casoReal:
      'Pirate streaming apps have already handed thousands of TVs to crime networks. The picture stayed sharp. In the background the device became a bridge to attack other people. Some cheap boxes are born with the back door open.',
    porquePerigo:
      'The attack likes to stay quiet: a TV that stutters gets unplugged. Apps outside the official store are the most common door. A guest Wi-Fi and updates shrink the damage.',
    perguntas: [
      '1) Why can a TV that “works perfectly” still be infected?',
      '2) What should you avoid installing on a smart TV?',
      '3) Where is the TV safer on your Wi-Fi?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      'La tele del salón pasó a ser un computador conectado todo el día. Mientras ves la serie, puede estar obedeciendo a un desconocido — sin que la imagen parpadee.',
    casoReal:
      'Apps de streaming pirata ya entregaron miles de TVs a redes criminales. La imagen seguía nítida. En segundo plano el aparato viraba puente para atacar a otras personas. Algunas cajas baratas nacen con la puerta de atrás abierta.',
    porquePerigo:
      'El ataque prefiere el silencio: una TV que traba llama la atención y la desconectas. App fuera de la tienda oficial es la puerta más común. Red de invitados y actualización reducen el daño.',
    perguntas: [
      '1) ¿Por qué una TV que “funciona perfecto” igual puede estar infectada?',
      '2) ¿Qué evitas instalar en la smart TV?',
      '3) ¿Dónde queda más segura la TV en tu Wi-Fi?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const LICACAO_CAMERA: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'Você comprou uma câmera para vigiar a casa. Sem trocar a senha de fábrica, ela vira o olho de outra pessoa — e um soldado num exército zumbi.',
    casoReal:
      'Câmeras com senha admin/admin já foram recrutadas às centenas de milhares. Cada uma é fraca. Juntas, derrubaram pedaços grandes da internet. O dono quase nunca notava: a luz continuava acesa na porta.',
    porquePerigo:
      'O perigo não é a câmera ser potente. É a quantidade. Senha de fábrica + internet = convite. Troque a senha ANTES de conectar. Se o fabricante parou de atualizar, troque o aparelho.',
    perguntas: [
      '1) Por que uma câmera barata da sala importa numa botnet?',
      '2) O que você faz ANTES de ligar a câmera na internet?',
      '3) Quando vale a pena substituir a câmera?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'You bought a camera to watch the house. Leave the factory password and it becomes someone else’s eye — and a soldier in a zombie army.',
    casoReal:
      'Cameras with admin/admin have been drafted by the hundreds of thousands. Each one is weak. Together they knocked down big pieces of the internet. Owners barely noticed: the porch light still worked.',
    porquePerigo:
      'The danger is not a powerful camera. It is the count. Factory password plus internet is an invitation. Change the password BEFORE you connect. If the maker stopped updates, replace the device.',
    perguntas: [
      '1) Why does a cheap hallway camera matter in a botnet?',
      '2) What do you do BEFORE putting the camera on the internet?',
      '3) When is it time to replace the camera?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      'Compraste una cámara para vigilar la casa. Si dejas la contraseña de fábrica, se vuelve el ojo de otra persona — y un soldado en un ejército zombi.',
    casoReal:
      'Cámaras con admin/admin ya fueron reclutadas a cientos de miles. Cada una es débil. Juntas tumbaron trozos grandes de internet. El dueño casi no lo notaba: la luz de la puerta seguía encendida.',
    porquePerigo:
      'El peligro no es que la cámara sea potente. Es la cantidad. Contraseña de fábrica + internet = invitación. Cámbiala ANTES de conectar. Si el fabricante dejó de actualizar, cambia el aparato.',
    perguntas: [
      '1) ¿Por qué una cámara barata del pasillo importa en una botnet?',
      '2) ¿Qué haces ANTES de conectar la cámara a internet?',
      '3) ¿Cuándo conviene reemplazar la cámara?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const LICACAO_BOTNET: TecnicaPhishingMan['licao'] = {
  pt: {
    analogia:
      'Sabia que até um termostato pode ser hackeado? A botnet entra pelo aparelho barato — a lâmpada que liga por voz, a torradeira “inteligente” — e usa essa porta para olhar o resto da casa.',
    casoReal:
      'O atacante quase nunca começa pelo computador. Começa pelo gadget que ninguém atualiza, no mesmo Wi-Fi do celular. Um aparelho sem marca, comprado na lojinha, já foi o suficiente para abrir a rede inteira.',
    porquePerigo:
      'Celular, computador e lâmpada na mesma rede formam um só caminho. Se um cai, os outros podem cair. Rede de convidados, marca conhecida e uma busca rápida por casos de ataque diminuem o risco.',
    perguntas: [
      '1) Por que uma lâmpada inteligente no Wi-Fi da casa importa para o celular?',
      '2) O que você faz antes de conectar um aparelho sem marca no Wi-Fi?',
      '3) Onde esse gadget fica mais seguro na rede?',
    ],
    conviteProva:
      'Agora, para provar seu conhecimento, responda estas perguntas. Se as respostas estiverem corretas, eu te entrego o encantamento secreto.',
  },
  en: {
    analogia:
      'Did you know even a thermostat can be hacked? A botnet comes in through the cheap device — the voice-activated bulb, the “smart” toaster — and uses that door to look at the rest of the house.',
    casoReal:
      'Attackers almost never start with the computer. They start with the gadget nobody updates, on the same Wi-Fi as the phone. A no-name device from the corner shop has been enough to open the whole network.',
    porquePerigo:
      'Phone, computer and bulb on the same network are one path. If one falls, the others can fall. A guest network, a known brand, and a quick search for past attacks shrink the risk.',
    perguntas: [
      '1) Why does a smart bulb on the home Wi-Fi matter for the phone?',
      '2) What do you do before putting a no-name device on Wi-Fi?',
      '3) Where is that gadget safer on the network?',
    ],
    conviteProva:
      'Now, to prove your knowledge, answer these questions. If your answers are right, I will give you the secret enchantment.',
  },
  es: {
    analogia:
      '¿Sabías que hasta un termostato puede ser hackeado? La botnet entra por el aparato barato — la lámpara que enciendes con la voz, la tostadora “inteligente” — y usa esa puerta para mirar el resto de la casa.',
    casoReal:
      'El atacante casi nunca empieza por el computador. Empieza por el gadget que nadie actualiza, en el mismo Wi-Fi del celular. Un aparato sin marca, comprado en la tiendita, ya fue suficiente para abrir toda la red.',
    porquePerigo:
      'Celular, computador y lámpara en la misma red son un solo camino. Si uno cae, los otros pueden caer. Red de invitados, marca conocida y una búsqueda rápida de casos de ataque bajan el riesgo.',
    perguntas: [
      '1) ¿Por qué una lámpara inteligente en el Wi-Fi de casa importa para el celular?',
      '2) ¿Qué haces antes de conectar un aparato sin marca al Wi-Fi?',
      '3) ¿Dónde queda más seguro ese gadget en la red?',
    ],
    conviteProva:
      'Ahora, para probar tu conocimiento, responde estas preguntas. Si las respuestas son correctas, te entrego el encantamiento secreto.',
  },
};

const CHAT_SMART_TV: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'Num ataque de botnet, um caso muito comum é a smart TV: ela é inteligente, está no seu Wi-Fi e vira porta de entrada para o atacante.',
      'Ele não se faz notar. Fica quietinho enquanto você assiste aos seus programas, sem sintoma de problema. Nos bastidores, o atacante usa a sua internet para atacar outras pessoas e esconder o rastro — e, se o celular está na mesma rede, pode tentar chegar nele também.',
      'Não instale app pirata na smart TV. Mantenha-a atualizada. Se puder, deixe a TV numa rede só dela, longe do celular.',
    ],
    pergunta:
      'A TV está perfeita, sem travar. Um amigo diz que mesmo assim pode estar infectada. O que você pensa?',
    opcoes: [
      'Se estivesse infectada, ia travar ou ficar lenta.',
      'Pode estar — o ataque se esconde para você não desligar.',
      'Só infecta se alguém enfiou um pendrive na TV.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'In a botnet attack, a very common case is the smart TV: it’s smart, it’s on your Wi-Fi, and it becomes a door for the attacker.',
      'It doesn’t make a fuss. It stays quiet while you watch your shows, with no sign of trouble. In the background, the attacker uses your internet to hit other people and hide their tracks — and if your phone is on the same network, they can try to reach it too.',
      'Don’t install pirate apps on the smart TV. Keep it updated. If you can, put the TV on a network of its own, away from the phone.',
    ],
    pergunta:
      'The TV looks perfect, no stutter. A friend says it could still be infected. What do you think?',
    opcoes: [
      'If it were infected, it would freeze or get slow.',
      'It could be — the attack hides so you don’t unplug it.',
      'It only gets infected if someone plugged in a USB stick.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      'En un ataque de botnet, un caso muy común es la smart TV: es inteligente, está en tu Wi-Fi y se vuelve puerta de entrada para el atacante.',
      'No se hace notar. Se queda callada mientras ves tus programas, sin síntoma de problema. En segundo plano, el atacante usa tu internet para atacar a otras personas y esconder el rastro — y si el celular está en la misma red, puede intentar llegar a él también.',
      'No instales app pirata en la smart TV. Mantenla actualizada. Si puedes, deja la TV en una red solo para ella, lejos del celular.',
    ],
    pergunta:
      'La TV está perfecta, no traba. Un amigo dice que igual podría estar infectada. ¿Qué piensas?',
    opcoes: [
      'Si estuviera infectada, trabaría o iría más lenta.',
      'Puede estar — el ataque se esconde para que no la desconectes.',
      'Solo se infecta si alguien metió un pendrive en la TV.',
    ],
    indiceCorreta: 1,
  },
};

const CHAT_CAMERA: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'A câmera que vigia a sua casa pode virar o olho de outra pessoa. Assim funciona este ataque de botnet.',
      'Quase ninguém troca a senha de fábrica. Com ela, o desconhecido entra, vê a sua casa e ainda usa a câmera num exército para atacar outras pessoas — você nem nota.',
      'Troque a senha de fábrica ANTES de ligar no Wi-Fi. Se o fabricante parou de atualizar, o recomendado é trocar o aparelho por segurança.',
    ],
    pergunta:
      'Você comprou uma câmera pela internet para a sua casa. É a primeira vez configurando uma câmera de vigilância. O que é o primeiro que você faz antes de conectar a câmera no Wi-Fi da sua casa?',
    opcoes: [
      'Conecto no Wi-Fi primeiro para ver se a imagem chega no celular; a senha eu troco depois.',
      'Troco a senha de fábrica ainda fora da internet, e só então conecto no Wi-Fi da casa.',
      'Deixo a senha da caixa: é a primeira vez, preciso que funcione logo.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'The camera that watches your house can become someone else’s eye. That’s how this botnet attack works.',
      'Almost nobody changes the factory password. With it, a stranger gets in, sees your home, and still uses the camera in an army to attack other people — and you never notice.',
      'Change the factory password BEFORE you put it on Wi-Fi. If the maker stopped updates, the recommendation is to replace the device for safety.',
    ],
    pergunta:
      'You bought a camera online for your house. It’s your first time setting up a security camera. What’s the first thing you do before connecting it to your home Wi-Fi?',
    opcoes: [
      'I connect to Wi-Fi first to see if the picture reaches my phone; I’ll change the password later.',
      'I change the factory password while it’s still offline, and only then I connect to the home Wi-Fi.',
      'I leave the password in the box: it’s the first setup, I need it working now.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      'La cámara que vigila tu casa puede volverse el ojo de otra persona. Así funciona este ataque de botnet.',
      'Casi nadie cambia la contraseña de fábrica. Con ella, el desconocido entra, ve tu casa y todavía usa la cámara en un ejército para atacar a otras personas — y ni te enteras.',
      'Cambia la contraseña de fábrica ANTES de conectarla al Wi-Fi. Si el fabricante dejó de actualizar, lo recomendado es cambiar el aparato por seguridad.',
    ],
    pergunta:
      'Compraste una cámara por internet para tu casa. Es la primera vez configurando una cámara de vigilancia. ¿Qué es lo primero que haces antes de conectar la cámara al Wi-Fi de tu casa?',
    opcoes: [
      'La conecto al Wi-Fi primero para ver si la imagen llega al celular; la contraseña la cambio después.',
      'Cambio la contraseña de fábrica todavía fuera de internet, y solo entonces la conecto al Wi-Fi de casa.',
      'Dejo la contraseña de la caja: es la primera vez, necesito que funcione ya.',
    ],
    indiceCorreta: 1,
  },
};

const CHAT_BOTNET: NonNullable<TecnicaPhishingMan['chatAula']> = {
  pt: {
    baloes: [
      'Sabia que até um termostato pode ser hackeado? Ataques de botnet são assim: às vezes até a lâmpada inteligente — aquela que você liga por voz — vira porta de entrada.',
      'Hoje até a torradeira é inteligente, e a gente nunca pergunta se isso é vulnerável. No mesmo Wi-Fi do celular e do computador, se o atacante entra no aparelho mais barato, pode tentar chegar no resto da casa.',
      'Não coloque aparelho sem marca na mesma rede do celular. Se puder, use a rede de convidados. Antes de comprar, procure na internet se aquele modelo já teve caso de ataque.',
    ],
    pergunta:
      'Comprei um ar-condicionado novo na lojinha do seu Jorge. Ele é inteligente: pede música, sobe e desce a temperatura por voz, e entra no Wi-Fi da casa. O que você pensa primeiro?',
    opcoes: [
      'Não tem mal nenhum. O seu Jorge não venderia coisa insegura, mesmo sem marca.',
      'Cuidado com a rede em que vou conectar, e busco na internet se esse produto já teve caso de ataque.',
      'Conecto no Wi-Fi da casa primeiro para testar a voz; a rede separada eu penso depois.',
    ],
    indiceCorreta: 1,
  },
  en: {
    baloes: [
      'Did you know even a thermostat can be hacked? Botnet attacks are like that: sometimes even the smart bulb — the one you turn on with your voice — becomes a door.',
      'These days even the toaster is smart, and we never ask if that’s a weakness. On the same Wi-Fi as the phone and the computer, if the attacker gets into the cheapest device, they can try to reach the rest of the house.',
      'Don’t put a no-name gadget on the same network as the phone. If you can, use the guest Wi-Fi. Before you buy, search whether that model has already been attacked.',
    ],
    pergunta:
      'I bought a new air conditioner at Jorge’s little shop. It’s smart: it plays music, turns the temperature up and down by voice, and joins the home Wi-Fi. What do you think first?',
    opcoes: [
      'No harm in it. Jorge wouldn’t sell something unsafe, even without a brand.',
      'I’m careful which network I connect it to, and I search whether this product has already been attacked.',
      'I join the home Wi-Fi first to test the voice; I’ll think about a separate network later.',
    ],
    indiceCorreta: 1,
  },
  es: {
    baloes: [
      '¿Sabías que hasta un termostato puede ser hackeado? Los ataques de botnet son así: a veces hasta la lámpara inteligente — esa que enciendes con la voz — se vuelve puerta de entrada.',
      'Hoy hasta la tostadora es inteligente, y nunca preguntamos si eso es vulnerable. En el mismo Wi-Fi del celular y del computador, si el atacante entra en el aparato más barato, puede intentar llegar al resto de la casa.',
      'No pongas un aparato sin marca en la misma red del celular. Si puedes, usa la red de invitados. Antes de comprar, busca en internet si ese modelo ya tuvo casos de ataque.',
    ],
    pergunta:
      'Compré un aire acondicionado nuevo en la tiendita de Jorge. Es inteligente: pide música, sube y baja la temperatura por voz, y entra al Wi-Fi de casa. ¿Qué piensas primero?',
    opcoes: [
      'No tiene ningún mal. Jorge no vendería algo inseguro, aunque no tenga marca.',
      'Cuidado con la red en la que lo voy a conectar, y busco en internet si ese producto ya tuvo casos de ataque.',
      'Lo conecto al Wi-Fi de casa primero para probar la voz; la red separada la pienso después.',
    ],
    indiceCorreta: 1,
  },
};

export const TECNICAS_ZOMBIE_NET: TecnicaPhishingMan[] = [
  {
    url: 'http://zombie-net/smart-tv',
    flag: 'hide',
    nomeTecnica: 'Smart-TV',
    nomeBoss: 'Zombie-net',
    licao: LICACAO_SMART_TV,
    chatAula: CHAT_SMART_TV,
  },
  {
    url: 'http://zombie-net/camera',
    flag: 'bigbrother',
    nomeTecnica: 'Camera',
    nomeBoss: 'Zombie-net',
    licao: LICACAO_CAMERA,
    chatAula: CHAT_CAMERA,
  },
  {
    url: 'http://zombie-net/botnet',
    flag: 'brain',
    nomeTecnica: 'botnet',
    nomeBoss: 'Zombie-net',
    licao: LICACAO_BOTNET,
    chatAula: CHAT_BOTNET,
  },
];

export const TECNICA_PADRAO_ZOMBIE_NET = TECNICAS_ZOMBIE_NET[0];
