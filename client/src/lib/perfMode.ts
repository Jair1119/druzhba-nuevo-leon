import { useSyncExternalStore } from "react";

/**
 * Modo ligero: si el equipo no logra una animación fluida, la página apaga
 * los efectos más pesados (videos de portada, personaje caminando, marquesinas, cursor).
 * Se decide automáticamente, pero la persona puede activarlo o desactivarlo a mano.
 */

const KEY = "druzhba-lite";
let lite = false;
const listeners = new Set<() => void>();

const readOverride = (): boolean | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "1" ? true : v === "0" ? false : null;
  } catch {
    return null;
  }
};

const apply = (v: boolean) => {
  lite = v;
  document.documentElement.classList.toggle("lite", v);
  listeners.forEach(l => l());
};

/** Equipos modestos o con ahorro de datos empiezan directamente en modo ligero. */
function weakDevice() {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (n.connection?.saveData) return true;
  if (n.deviceMemory !== undefined && n.deviceMemory <= 4) return true;
  if (n.hardwareConcurrency !== undefined && n.hardwareConcurrency <= 4) return true;
  return false;
}

export function initPerfMode() {
  if (typeof window === "undefined") return;
  const override = readOverride();
  if (override !== null) return apply(override);
  if (weakDevice()) return apply(true);
  // Mide los cuadros por segundo reales unos segundos después de cargar.
  window.setTimeout(() => {
    if (document.hidden || readOverride() !== null) return;
    let frames = 0;
    const start = performance.now();
    const tick = (now: number) => {
      frames++;
      if (now - start < 2000) requestAnimationFrame(tick);
      else if ((frames * 1000) / (now - start) < 45 && !document.hidden) apply(true);
    };
    requestAnimationFrame(tick);
  }, 3500);
}

export function setLite(v: boolean) {
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* sin almacenamiento */
  }
  apply(v);
}

export function useLite() {
  return useSyncExternalStore(
    cb => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => lite,
    () => false,
  );
}
