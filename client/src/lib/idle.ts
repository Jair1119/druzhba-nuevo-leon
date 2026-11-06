import { useSyncExternalStore } from "react";

/**
 * Pausa por inactividad: si nadie interactúa durante un rato, o la ventana pierde
 * el foco, la página congela videos y animaciones decorativas para no gastar CPU
 * (ni acelerar ventiladores). Al primer movimiento, todo continúa donde se quedó.
 */

const IDLE_MS = 20000;
let idle = false;
let timer = 0;
let lastReset = -Infinity;
const listeners = new Set<() => void>();

const set = (v: boolean) => {
  if (v === idle) return;
  idle = v;
  document.documentElement.classList.toggle("idle", v);
  listeners.forEach(l => l());
};

const wake = () => {
  const now = performance.now();
  if (idle) set(false);
  // Reiniciar el temporizador como mucho cada medio segundo (pointermove es muy frecuente).
  if (now - lastReset < 500) return;
  lastReset = now;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => set(true), IDLE_MS);
};

export function initIdle() {
  if (typeof window === "undefined") return;
  for (const e of ["pointerdown", "keydown", "wheel", "scroll", "touchstart"]) {
    window.addEventListener(e, wake, { passive: true });
  }
  // El navegador genera movimientos «falsos» cuando algo se mueve bajo un cursor quieto:
  // solo cuenta si el puntero cambió de posición de verdad.
  let px = -1;
  let py = -1;
  window.addEventListener(
    "pointermove",
    e => {
      if (Math.abs(e.clientX - px) + Math.abs(e.clientY - py) < 2) return;
      px = e.clientX;
      py = e.clientY;
      wake();
    },
    { passive: true },
  );
  window.addEventListener("blur", () => {
    window.clearTimeout(timer);
    set(true);
  });
  window.addEventListener("focus", wake);
  wake();
}

export function useIdle() {
  return useSyncExternalStore(
    cb => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => idle,
    () => false,
  );
}
