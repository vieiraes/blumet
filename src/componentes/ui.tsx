// Peças básicas de interface: cartão, título de seção, selo de nível e estados vazio/erro.
import type { ReactNode } from 'react';
import { NIVEIS, type Nivel } from '../lib/niveis.ts';

/** Cartão com borda; `semEspaco` tira o espaçamento interno (listas que vão até a borda). */
export const Cartao = ({ children, className = '', semEspaco = false, ...p }: { children: ReactNode; className?: string; semEspaco?: boolean } & React.HTMLAttributes<HTMLElement>) => (
  <section className={`rounded-2xl border border-linha bg-superficie shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${semEspaco ? '' : 'p-4'} ${className}`} {...p}>
    {children}
  </section>
);

export const TituloSecao = ({ children, acao, id }: { children: ReactNode; acao?: ReactNode; id?: string }) => (
  <div className="mb-2 flex items-center justify-between gap-2 px-1">
    <h2 id={id} className="text-[13px] font-semibold uppercase tracking-wide text-texto-3">
      {children}
    </h2>
    {acao}
  </div>
);

export const SeloNivel = ({ nivel, texto, grande = false }: { nivel: Nivel; texto?: string; grande?: boolean }) => {
  const e = NIVEIS[nivel];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${e.selo} ${grande ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'}`}>
      <span className={`h-2 w-2 shrink-0 rounded-full ${e.ponto}`} aria-hidden="true" />
      {texto ?? e.nome}
    </span>
  );
};

export const Vazio = ({ titulo, children }: { titulo: string; children?: ReactNode }) => (
  <div className="rounded-2xl border border-dashed border-linha p-6 text-center">
    <p className="font-semibold">{titulo}</p>
    {children && <div className="mt-1 text-sm text-texto-2">{children}</div>}
  </div>
);

export const FonteForaDoAr = ({ nome }: { nome: string }) => (
  <Vazio titulo={`${nome}: sem dados agora`}>A Defesa Civil não respondeu esta parte. O app tenta de novo a cada 2 minutos.</Vazio>
);

/** Esqueleto de carregamento (sem texto piscando). */
export const Esqueleto = ({ altura = 'h-24' }: { altura?: string }) => <div className={`${altura} animate-pulse rounded-2xl bg-superficie-2`} aria-hidden="true" />;
