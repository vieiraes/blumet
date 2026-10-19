import type { Aviso } from '../../functions/src/tipos.ts';
import { IconeAlerta } from './Icones.tsx';

/** Faixa do aviso oficial da Defesa Civil (só aparece quando há um em vigor). */
export function AvisoOficial({ aviso }: { aviso: Aviso | null | undefined }) {
  if (!aviso) return null;
  return (
    <section role="alert" className="flex gap-3 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-950 dark:border-red-800 dark:bg-red-950/60 dark:text-red-100" data-testid="aviso-oficial">
      <IconeAlerta className="mt-0.5 shrink-0 text-red-600 dark:text-red-300" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">Aviso da Defesa Civil</p>
        {aviso.titulo && <h2 className="mt-0.5 font-bold">{aviso.titulo}</h2>}
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{aviso.texto}</p>
      </div>
    </section>
  );
}
