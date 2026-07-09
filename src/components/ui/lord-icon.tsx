"use client";

import Script from "next/script";
import type React from "react";

/**
 * Icônes animées Lordicon (https://lordicon.com) — licence gratuite avec
 * attribution (voir le footer). Chaque URL CDN de ce registre a été vérifiée.
 */
export const lordIcons = {
  aide: "https://cdn.lordicon.com/ojnjgkun.json",
  article: "https://cdn.lordicon.com/vufjamqa.json",
  assistant: "https://cdn.lordicon.com/zpxybbhl.json",
  avatar: "https://cdn.lordicon.com/dxjqoygy.json",
  cadeau: "https://cdn.lordicon.com/nkmsrxys.json",
  calques: "https://cdn.lordicon.com/jvucoldz.json",
  cible: "https://cdn.lordicon.com/iltqorsz.json",
  coche: "https://cdn.lordicon.com/hjeefwhm.json",
  coeur: "https://cdn.lordicon.com/rjzlnunf.json",
  confettis: "https://cdn.lordicon.com/lupuorrc.json",
  confidentialite: "https://cdn.lordicon.com/sjoccsdj.json",
  document: "https://cdn.lordicon.com/nocovwne.json",
  ecran: "https://cdn.lordicon.com/uukerzzv.json",
  edition: "https://cdn.lordicon.com/puvaffet.json",
  email: "https://cdn.lordicon.com/diihvcfp.json",
  etincelles: "https://cdn.lordicon.com/mdgrhyca.json",
  graphique: "https://cdn.lordicon.com/gqdnbnwt.json",
  horloge: "https://cdn.lordicon.com/kbtmbyzy.json",
  livre: "https://cdn.lordicon.com/wxnxiano.json",
  localisation: "https://cdn.lordicon.com/surcxhka.json",
  outils: "https://cdn.lordicon.com/sbiheqdr.json",
  panier: "https://cdn.lordicon.com/slkvcfos.json",
  pieces: "https://cdn.lordicon.com/qhviklyi.json",
  recherche: "https://cdn.lordicon.com/msoeawqm.json",
  reglages: "https://cdn.lordicon.com/lecprnjb.json",
  securite: "https://cdn.lordicon.com/fgxwhgfp.json",
  telephone: "https://cdn.lordicon.com/ssvybplt.json",
  tendance: "https://cdn.lordicon.com/yxyampao.json",
  video: "https://cdn.lordicon.com/soseozvi.json",
} as const;

export type LordIconName = keyof typeof lordIcons;

type LordIconTrigger =
  | "hover"
  | "click"
  | "loop"
  | "loop-on-hover"
  | "morph"
  | "boomerang"
  | "in";

export interface LordIconProps {
  icon: LordIconName;
  /** Taille en pixels (largeur = hauteur). */
  size?: number;
  trigger?: LordIconTrigger;
  /** Sélecteur CSS d'un ancêtre qui déclenche l'animation (ex: ".group"). */
  target?: string;
  /** Palette Lordicon, ex: "primary:#2f6bff,secondary:#0f1b33". */
  colors?: string;
  /** Délai (ms) avant de rejouer l'animation en mode loop. */
  delay?: number;
  className?: string;
}

declare module "react" {
  // Typage JSX du custom element <lord-icon> : impose la syntaxe namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        trigger?: string;
        colors?: string;
        target?: string;
        delay?: number | string;
        state?: string;
      };
    }
  }
}

const BRAND_COLORS = "primary:#2f6bff,secondary:#4b86ff";

export function LordIcon({
  icon,
  size = 24,
  trigger = "hover",
  target,
  colors = BRAND_COLORS,
  delay,
  className,
}: LordIconProps) {
  return (
    <>
      <Script src="https://cdn.lordicon.com/lordicon.js" strategy="lazyOnload" />
      <lord-icon
        src={lordIcons[icon]}
        trigger={trigger}
        target={target}
        colors={colors}
        delay={delay}
        className={className}
        style={{ width: size, height: size, display: "inline-block" }}
      />
    </>
  );
}
