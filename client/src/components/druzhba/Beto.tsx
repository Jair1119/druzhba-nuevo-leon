import { AnimatePresence, motion } from "framer-motion";

/**
 * Beto: regio con atuendo norteño (sombrero texano, cotona de gamuza con flecos,
 * paliacate, cinto pitiado y botas) que a veces cambia su sombrero por una ushanka.
 */
export type Hat = "sombrero" | "ushanka";

export function BetoFigure({ hat, pose }: { hat: Hat; pose: "walk" | "stand" | "tip" | "wave" }) {
  return (
    <svg className={`beto beto-${pose}`} viewBox="0 0 120 200" aria-hidden="true">
      {/* Sombra */}
      <ellipse cx="60" cy="194" rx="30" ry="5" fill="rgba(0,0,0,.22)" />

      {/* Pierna trasera */}
      <g className="b-leg b-leg-back">
        <rect x="50" y="118" width="13" height="56" rx="5" fill="#26467a" />
        <path d="M47 170 h19 a4 4 0 0 1 4 4 v6 h-26 v-6 a3 3 0 0 1 3 -4z" fill="#5a3418" />
        <rect x="44" y="179" width="27" height="5" rx="2" fill="#3a200d" />
      </g>

      {/* Brazo trasero */}
      <g className="b-arm b-arm-back">
        <path d="M74 72 q9 2 10 14 l2 26 q0 5 -5 5 h-4 q-4 0 -4 -5z" fill="#a8723f" />
        <circle cx="80" cy="119" r="5.5" fill="#c98d63" />
      </g>

      {/* Torso: camisa, cotona con flecos, paliacate y cinto */}
      <path d="M40 70 q20 -8 40 0 l4 50 h-48z" fill="#f4efe6" />
      <path d="M38 70 q8 -5 16 -6 l2 54 h-20z" fill="#c4874a" />
      <path d="M82 70 q-8 -5 -16 -6 l-2 54 h20z" fill="#c4874a" />
      <g stroke="#8e5a2b" strokeWidth="1.6" strokeLinecap="round">
        <path d="M37 118 v8 M41 118 v9 M45 118 v8 M49 118 v9 M53 118 v8" />
        <path d="M67 118 v8 M71 118 v9 M75 118 v8 M79 118 v9 M83 118 v8" />
      </g>
      <path d="M38 88 h16 M66 88 h16" stroke="#e3b47c" strokeWidth="2" strokeDasharray="2 3" />
      <path d="M50 64 l10 14 l10 -14z" fill="#d52b1e" />
      <circle cx="60" cy="77" r="2.4" fill="#a71d14" />
      <rect x="40" y="114" width="40" height="7" rx="2" fill="#4a2a12" />
      <rect x="55" y="113" width="10" height="9" rx="2" fill="#d9b25b" stroke="#8a6a23" strokeWidth="1" />

      {/* Pierna delantera */}
      <g className="b-leg b-leg-front">
        <rect x="42" y="118" width="13" height="56" rx="5" fill="#2f5591" />
        <path d="M39 170 h19 a4 4 0 0 1 4 4 v6 h-26 v-6 a3 3 0 0 1 3 -4z" fill="#6b3f1d" />
        <rect x="36" y="179" width="27" height="5" rx="2" fill="#3a200d" />
        <path d="M42 174 h12" stroke="#d9b25b" strokeWidth="1.2" />
      </g>

      {/* Cabeza */}
      <g className="b-head">
        <rect x="54" y="54" width="12" height="12" rx="4" fill="#c98d63" />
        <circle cx="60" cy="42" r="17" fill="#d69b70" />
        <circle cx="43.5" cy="44" r="4" fill="#c98d63" />
        <circle cx="76.5" cy="44" r="4" fill="#c98d63" />
        <path d="M44 34 q16 -12 32 0 q-2 -8 -16 -9 q-14 1 -16 9z" fill="#2b1a10" />
        <g className="b-eyes">
          <ellipse cx="53" cy="41" rx="2" ry="2.6" fill="#1d120b" />
          <ellipse cx="67" cy="41" rx="2" ry="2.6" fill="#1d120b" />
        </g>
        <path d="M50 36 q3 -2 6 0 M64 36 q3 -2 6 0" stroke="#2b1a10" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M60 43 q-2 4 1 5" stroke="#a96f48" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M49 52 q11 -7 22 0 q-5 3 -11 1 q-6 2 -11 -1z" fill="#2b1a10" />
        <path d="M54 55 q6 4 12 0" stroke="#7a3b2a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="49" cy="48" r="2.4" fill="#e98a7a" opacity=".45" />
        <circle cx="71" cy="48" r="2.4" fill="#e98a7a" opacity=".45" />
      </g>

      {/* Brazo delantero (es el que se quita el sombrero y saluda) */}
      <g className="b-arm b-arm-front">
        <path d="M44 72 q-9 2 -10 14 l-2 26 q0 5 5 5 h4 q4 0 4 -5z" fill="#c4874a" />
        <path d="M32 104 h12" stroke="#e3b47c" strokeWidth="2" strokeDasharray="2 2" />
        <circle cx="38" cy="119" r="5.5" fill="#d69b70" />
      </g>

      {/* Sombreros */}
      <AnimatePresence initial={false} mode="popLayout">
        {hat === "sombrero" ? (
          <motion.g
            key="sombrero"
            initial={{ y: -70, opacity: 0, rotate: 12 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -60, x: -30, opacity: 0, rotate: -35 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            style={{ originX: "60px", originY: "30px" }}
          >
            <path d="M22 31 q38 14 76 0 q4 -3 -2 -4 q-36 10 -72 0 q-6 1 -2 4z" fill="#b98d4f" />
            <path d="M40 28 q2 -18 10 -20 q10 4 20 0 q8 2 10 20 q-20 6 -40 0z" fill="#d7b07a" />
            <path d="M41 24 q19 5 38 0 l1 5 q-20 6 -40 0z" fill="#5a3418" />
            <path d="M50 10 q10 5 20 0" stroke="#b98d4f" strokeWidth="2" fill="none" />
          </motion.g>
        ) : (
          <motion.g
            key="ushanka"
            initial={{ y: -80, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, x: 30, opacity: 0, rotate: 30 }}
            transition={{ type: "spring", stiffness: 240, damping: 14 }}
            style={{ originX: "60px", originY: "30px" }}
          >
            <path d="M38 36 q-6 14 -2 24 q6 3 9 -2 l1 -20z" fill="#5c3d24" />
            <path d="M82 36 q6 14 2 24 q-6 3 -9 -2 l-1 -20z" fill="#5c3d24" />
            <path d="M40 34 q0 -24 20 -25 q20 1 20 25 q-20 4 -40 0z" fill="#4a3322" />
            <path d="M46 16 q6 -5 12 -3 M62 13 q6 0 11 5 M44 24 q5 -4 10 -2 M66 22 q5 -2 10 2" stroke="#6b4a30" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M38 36 q22 -14 44 0 q1 -8 -2 -10 q-20 -8 -40 0 q-3 2 -2 10z" fill="#8a6440" />
            <path d="M42 30 q4 -3 8 0 M56 28 q4 -3 8 0 M70 30 q4 -3 8 0" stroke="#b08a5f" strokeWidth="1.5" fill="none" />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}
