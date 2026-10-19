// Ícones em SVG (traço de 1,8, 24×24), sem biblioteca. Decorativos por padrão (aria-hidden); quem precisa de
// nome acessível põe o texto no botão ou no aria-label do elemento em volta.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { tamanho?: number };

const Base = ({ tamanho = 22, children, ...p }: P) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>
    {children}
  </svg>
);

export const IconeInicio = (p: P) => (
  <Base {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20h14V9.5" />
    <path d="M10 20v-5h4v5" />
  </Base>
);
export const IconeRio = (p: P) => (
  <Base {...p}>
    <path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    <path d="M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    <path d="M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
  </Base>
);
export const IconeGota = (p: P) => (
  <Base {...p}>
    <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" />
  </Base>
);
export const IconeAbrigo = (p: P) => (
  <Base {...p}>
    <path d="M3 11 12 4l9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M12 17.5s-3-1.8-3-4a1.7 1.7 0 0 1 3-1.1 1.7 1.7 0 0 1 3 1.1c0 2.2-3 4-3 4Z" />
  </Base>
);
export const IconeMais = (p: P) => (
  <Base {...p}>
    <circle cx="5" cy="12" r="1.3" fill="currentColor" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    <circle cx="19" cy="12" r="1.3" fill="currentColor" />
  </Base>
);
export const IconeAtualizar = (p: P) => (
  <Base {...p}>
    <path d="M20 11a8 8 0 1 0-2.3 5.7" />
    <path d="M20 4v7h-7" />
  </Base>
);
export const IconeTelefone = (p: P) => (
  <Base {...p}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Base>
);
export const IconeMapa = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11Z" />
    <circle cx="12" cy="10" r="2.2" />
  </Base>
);
export const IconeSetaCima = (p: P) => (
  <Base {...p}>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </Base>
);
export const IconeSetaBaixo = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </Base>
);
export const IconeEstavel = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Base>
);
export const IconeAlerta = (p: P) => (
  <Base {...p}>
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v4" />
    <path d="M12 17h.01" />
  </Base>
);
export const IconeFechar = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);
export const IconeBusca = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Base>
);
export const IconeLapis = (p: P) => (
  <Base {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
  </Base>
);
export const IconeSemRede = (p: P) => (
  <Base {...p}>
    <path d="M2 8.5a15 15 0 0 1 20 0" />
    <path d="M5.5 12a10 10 0 0 1 13 0" />
    <path d="M9 15.5a5 5 0 0 1 6 0" />
    <path d="M12 19h.01" />
    <path d="M3 3l18 18" />
  </Base>
);
export const IconeLink = (p: P) => (
  <Base {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Base>
);

// ---- tempo
export const IconeSol = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);
export const IconeSolNuvem = (p: P) => (
  <Base {...p}>
    <path d="M8 4v1.5M3.5 8.5H5M4.8 4.8l1 1M12.2 4.8l-1 1" />
    <path d="M11.4 9.3A4 4 0 0 0 5 9.5" />
    <path d="M8 19h9a4 4 0 0 0 .5-8 5 5 0 0 0-9.6 1.6A3.2 3.2 0 0 0 8 19Z" />
  </Base>
);
export const IconeNuvem = (p: P) => (
  <Base {...p}>
    <path d="M7 18h10a4 4 0 0 0 .6-8 6 6 0 0 0-11.4 1.8A3.2 3.2 0 0 0 7 18Z" />
  </Base>
);
export const IconeChuva = (p: P) => (
  <Base {...p}>
    <path d="M7 14h10a4 4 0 0 0 .6-8 6 6 0 0 0-11.4 1.8A3.2 3.2 0 0 0 7 14Z" />
    <path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" />
  </Base>
);
export const IconeTempestade = (p: P) => (
  <Base {...p}>
    <path d="M7 14h10a4 4 0 0 0 .6-8 6 6 0 0 0-11.4 1.8A3.2 3.2 0 0 0 7 14Z" />
    <path d="m12 14-2 4h4l-2 4" />
  </Base>
);
export const IconeNeblina = (p: P) => (
  <Base {...p}>
    <path d="M4 9h16M3 13h18M5 17h14" />
  </Base>
);
export const IconeLua = (p: P) => (
  <Base {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </Base>
);
