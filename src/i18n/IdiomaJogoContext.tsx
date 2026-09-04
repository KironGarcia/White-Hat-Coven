/**
 * Contexto de idioma do WHC (pt / en / es).
 * Standalone: persiste no AsyncStorage. Se o ARGOS passar idioma, usa como partida.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CHAVE_IDIOMA_JOGO } from '../constants';
import {
  IDIOMA_JOGO_PADRAO,
  TEXTOS_JOGO,
  type IdiomaJogo,
  type TextosJogo,
} from './textos-jogo';

/** Mesma chave do ARGOS — se o celular já tinha escolha, o jogo herda. */
const CHAVE_IDIOMA_ARGOS = '@argos/idioma';

interface ValorIdiomaJogo {
  idioma: IdiomaJogo;
  definirIdioma: (novo: IdiomaJogo) => void;
  t: TextosJogo;
}

const IdiomaJogoContext = createContext<ValorIdiomaJogo>({
  idioma: IDIOMA_JOGO_PADRAO,
  definirIdioma: () => {},
  t: TEXTOS_JOGO[IDIOMA_JOGO_PADRAO],
});

function ehIdiomaValido(valor: unknown): valor is IdiomaJogo {
  return valor === 'pt' || valor === 'en' || valor === 'es';
}

export function IdiomaJogoProvider({
  idioma: idiomaExterno,
  children,
}: {
  idioma?: IdiomaJogo;
  children: React.ReactNode;
}) {
  const [idioma, setIdioma] = useState<IdiomaJogo>(
    idiomaExterno ?? IDIOMA_JOGO_PADRAO,
  );

  useEffect(() => {
    if (idiomaExterno) {
      setIdioma(idiomaExterno);
      return;
    }
    let ativo = true;
    (async () => {
      try {
        const doJogo = await AsyncStorage.getItem(CHAVE_IDIOMA_JOGO);
        if (ativo && ehIdiomaValido(doJogo)) {
          setIdioma(doJogo);
          return;
        }
        const doArgos = await AsyncStorage.getItem(CHAVE_IDIOMA_ARGOS);
        if (ativo && ehIdiomaValido(doArgos)) setIdioma(doArgos);
      } catch {
        /* sem storage: fica o padrão */
      }
    })();
    return () => {
      ativo = false;
    };
  }, [idiomaExterno]);

  const definirIdioma = useCallback((novo: IdiomaJogo) => {
    setIdioma(novo);
    AsyncStorage.setItem(CHAVE_IDIOMA_JOGO, novo).catch(() => {});
  }, []);

  const valor = useMemo<ValorIdiomaJogo>(
    () => ({ idioma, definirIdioma, t: TEXTOS_JOGO[idioma] }),
    [idioma, definirIdioma],
  );

  return <IdiomaJogoContext.Provider value={valor}>{children}</IdiomaJogoContext.Provider>;
}

export function useTextosJogo(): ValorIdiomaJogo {
  return useContext(IdiomaJogoContext);
}
