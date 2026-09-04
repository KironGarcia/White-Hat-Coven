/**
 * Controle por inclinação. O acelerômetro mede o ângulo (o giroscópio
 * só entrega velocidade angular). Cada celular reporta o eixo X de um
 * jeito — calibra o centro e o ganho para o mago responder igual.
 */

import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Accelerometer } from 'expo-sensors';

import { INTERVALO_SENSOR_MS } from '../constants';

/** Inclinação confortável em g (~25°) — vira referência do ganho. */
const PICO_REFERENCIA_G = 0.38;
/** Abaixo disto o sensor é fraco demais; o ganho sobe. */
const PICO_MINIMO_G = 0.14;
const GANHO_MIN = 1;
const GANHO_MAX = 2.7;
/** Se a magnitude parecer m/s² (gravidade ~9.8), converte para g. */
const MAG_MS2 = 4;

/**
 * Hook com a leitura já calibrada do eixo X.
 * Ref (não state) para não re-renderizar a cada amostra.
 */
export function usarTilt(): MutableRefObject<number> {
  const tiltRef = useRef(0);
  const offsetRef = useRef(0);
  const picoRef = useRef(PICO_MINIMO_G);

  useEffect(() => {
    Accelerometer.setUpdateInterval(INTERVALO_SENSOR_MS);
    const assinatura = Accelerometer.addListener((medida) => {
      const mag = Math.hypot(medida.x, medida.y, medida.z);
      const gx = mag > MAG_MS2 ? medida.x / 9.81 : medida.x;

      // Vício do sensor: só recentra quando o celular está quase parado.
      if (Math.abs(gx) < 0.08) {
        offsetRef.current = offsetRef.current * 0.94 + gx * 0.06;
      }

      const centrado = gx - offsetRef.current;
      const abs = Math.abs(centrado);
      picoRef.current = Math.max(abs, picoRef.current * 0.996);
      const ganho = Math.min(
        GANHO_MAX,
        Math.max(
          GANHO_MIN,
          PICO_REFERENCIA_G / Math.max(PICO_MINIMO_G, picoRef.current),
        ),
      );
      tiltRef.current = centrado * ganho;
    });
    return () => assinatura.remove();
  }, []);

  return tiltRef;
}
