/**
 * Copia os áudios do WHC para android/app/src/main/res/raw/
 * com nomes válidos no Android (só a-z, 0-9 e _).
 * A APK toca por android.resource:// — sem ExpoAsset.downloadAsync.
 */
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const ARQUIVOS = [
  { de: 'audio-intro-fondo.mp3', para: 'audio_intro_fondo.mp3' },
  { de: 'Tienda-audio.mp3', para: 'tienda_audio.mp3' },
  { de: 'boss-music.ogg', para: 'boss_music.ogg' },
  { de: 'Pulo-mago.ogg', para: 'pulo_mago.ogg' },
  { de: 'clik-boton.ogg', para: 'clik_boton.ogg' },
  { de: 'disparo-audio.wav', para: 'disparo_audio.wav' },
  { de: 'audio-morto.wav', para: 'audio_morto.wav' },
  { de: 'Coin.wav', para: 'coin.wav' },
  { de: 'Patch-audio.wav', para: 'patch_audio.wav' },
  { de: 'hit-acerto-.ogg', para: 'hit_acerto.ogg' },
  { de: 'hahaha-boss.ogg', para: 'hahaha_boss.ogg' },
  { de: 'hihihi-minibot.ogg', para: 'hihihi_minibot.ogg' },
  { de: 'Nuevo-corazon.wav', para: 'nuevo_corazon.wav' },
  { de: 'tiping-mago.wav', para: 'tiping_mago.wav' },
  { de: 'tiping-mago-chat.wav', para: 'tiping_mago_chat.wav' },
  { de: 'moeda-pirata.ogg', para: 'whc_moeda_pirata_v1.ogg' },
];

function withAudiosAndroid(config) {
  return withDangerousMod(config, [
    'android',
    async (configMod) => {
      const pastaRaw = path.join(
        configMod.modRequest.platformProjectRoot,
        'app/src/main/res/raw',
      );
      await fs.promises.mkdir(pastaRaw, { recursive: true });
      const origem = path.join(configMod.modRequest.projectRoot, 'assets/audios');
      for (const item of ARQUIVOS) {
        const de = path.join(origem, item.de);
        if (!fs.existsSync(de)) continue;
        await fs.promises.copyFile(de, path.join(pastaRaw, item.para));
      }
      return configMod;
    },
  ]);
}

module.exports = withAudiosAndroid;
