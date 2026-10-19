// Folha (bottom sheet) para escolher o bairro: busca sem acento, bairros agrupados por região.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Situacao } from '../../functions/src/tipos.ts';
import { semAcento } from '../lib/formato.ts';
import { IconeBusca, IconeFechar } from './Icones.tsx';

export function SeletorBairro({ aberto, situacao, atual, onEscolher, onFechar }: { aberto: boolean; situacao: Situacao | null | undefined; atual: string | null; onEscolher: (b: string | null) => void; onFechar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);

  const grupos = useMemo(() => {
    const t = semAcento(busca.trim());
    return (situacao?.regioes ?? []).map((r) => ({ regiao: r.regiao, bairros: r.bairros.filter((b) => !t || semAcento(b).includes(t)) })).filter((g) => g.bairros.length);
  }, [busca, situacao]);

  return (
    <dialog
      ref={ref}
      onClose={() => {
        setBusca('');
        onFechar();
      }}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-labelledby="titulo-seletor-bairro"
      className="m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-3xl bg-superficie p-0 text-texto backdrop:bg-black/50 sm:m-auto sm:max-w-md sm:rounded-3xl"
    >
      <div className="sticky top-0 z-10 border-b border-linha bg-superficie px-4 pb-3 pt-3">
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-linha sm:hidden" aria-hidden="true" />
        <div className="flex items-center justify-between">
          <h2 id="titulo-seletor-bairro" className="text-lg font-bold">
            Qual é o seu bairro?
          </h2>
          <button type="button" onClick={() => ref.current?.close()} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-superficie-2" aria-label="Fechar">
            <IconeFechar />
          </button>
        </div>
        <label className="mt-2 flex items-center gap-2 rounded-xl bg-superficie-2 px-3">
          <IconeBusca tamanho={18} className="text-texto-3" />
          <span className="sr-only">Buscar bairro</span>
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar bairro" className="h-11 w-full bg-transparent text-base outline-none placeholder:text-texto-3" autoComplete="off" enterKeyHint="search" />
        </label>
      </div>
      <div className="base-segura overflow-y-auto px-4 pb-4">
        {grupos.length === 0 && <p className="py-8 text-center text-texto-2">Nenhum bairro encontrado.</p>}
        {grupos.map((g) => (
          <section key={g.regiao} className="mt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-texto-3">Região {g.regiao}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.bairros.map((b) => (
                <li key={b}>
                  <button
                    type="button"
                    aria-pressed={b === atual}
                    onClick={() => {
                      onEscolher(b);
                      ref.current?.close();
                    }}
                    className={`min-h-11 rounded-full border px-4 text-sm font-medium ${b === atual ? 'border-marca bg-marca text-white dark:text-slate-900' : 'border-linha hover:bg-superficie-2'}`}
                  >
                    {b}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {atual && (
          <button
            type="button"
            onClick={() => {
              onEscolher(null);
              ref.current?.close();
            }}
            className="mt-6 min-h-11 w-full rounded-xl text-sm font-medium text-texto-2 hover:bg-superficie-2"
          >
            Não usar bairro
          </button>
        )}
      </div>
    </dialog>
  );
}
