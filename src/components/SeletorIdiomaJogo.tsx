/**
 * Gaveta de idioma (PT / EN / ES) — mesma lógica do ARGOS, visual do WHC.
 */

import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTextosJogo } from '../i18n/IdiomaJogoContext';
import type { IdiomaJogo } from '../i18n/textos-jogo';
import { FONTE_PIXEL } from '../tipografia';
import { tocarSomClique } from '../systems/audio-jogo';

const OPCOES: IdiomaJogo[] = ['pt', 'en', 'es'];

export function SeletorIdiomaJogo() {
  const { idioma, definirIdioma, t } = useTextosJogo();
  const [aberto, setAberto] = useState(false);

  function escolher(novo: IdiomaJogo) {
    tocarSomClique();
    definirIdioma(novo);
    setAberto(false);
  }

  return (
    <>
      <TouchableOpacity
        style={estilos.barra}
        onPress={() => {
          tocarSomClique();
          setAberto(true);
        }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t.idiomas.rotulo}
      >
        <Text style={estilos.codigo}>{idioma.toUpperCase()}</Text>
        <Text style={estilos.seta}>v</Text>
      </TouchableOpacity>

      <Modal
        visible={aberto}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        presentationStyle="overFullScreen"
        onRequestClose={() => setAberto(false)}
      >
        <StatusBar hidden />
        <Pressable style={estilos.fundo} onPress={() => setAberto(false)}>
          <View style={estilos.menu}>
            <Text style={estilos.tituloMenu}>{t.idiomas.rotulo}</Text>
            {OPCOES.map((opcao) => {
              const ativo = opcao === idioma;
              return (
                <TouchableOpacity
                  key={opcao}
                  style={[estilos.opcao, ativo && estilos.opcaoAtiva]}
                  onPress={() => escolher(opcao)}
                  activeOpacity={0.7}
                >
                  <Text style={[estilos.textoOpcao, ativo && estilos.textoOpcaoAtiva]}>
                    {t.idiomas[opcao]}
                  </Text>
                  {ativo ? <Text style={estilos.marca}>*</Text> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#c9a227',
    backgroundColor: 'rgba(12, 8, 22, 0.82)',
  },
  codigo: {
    fontFamily: FONTE_PIXEL,
    color: '#f2e3c0',
    fontSize: 10,
    letterSpacing: 1,
  },
  seta: {
    fontFamily: FONTE_PIXEL,
    color: '#c9a227',
    fontSize: 8,
  },
  fundo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  menu: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c9a227',
    backgroundColor: '#140e22',
    padding: 14,
    gap: 8,
  },
  tituloMenu: {
    fontFamily: FONTE_PIXEL,
    fontSize: 8,
    color: '#c9a227',
    letterSpacing: 1,
    marginBottom: 4,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  opcaoAtiva: {
    borderColor: '#c9a227',
    backgroundColor: 'rgba(201, 162, 39, 0.16)',
  },
  textoOpcao: {
    fontFamily: FONTE_PIXEL,
    fontSize: 9,
    color: '#c4b89a',
  },
  textoOpcaoAtiva: {
    color: '#f2e3c0',
  },
  marca: {
    fontFamily: FONTE_PIXEL,
    fontSize: 10,
    color: '#c9a227',
  },
});
