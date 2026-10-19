// Estados comuns das telas: carregando (esqueleto), erro sem nenhum dado salvo, e o conteúdo.
import type { ReactNode } from 'react';
import { useDados, type Dados } from '../lib/dados.ts';
import { Esqueleto, Vazio } from './ui.tsx';

export function ComDados({ children }: { children: (dados: Dados) => ReactNode }) {
  const { data, isPending, isError, error, refetch } = useDados();
  if (data) return <>{children(data)}</>;
  if (isPending)
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Carregando os dados">
        <Esqueleto altura="h-32" />
        <Esqueleto altura="h-40" />
        <Esqueleto altura="h-24" />
      </div>
    );
  if (isError)
    return (
      <Vazio titulo="Não foi possível carregar os dados">
        <p>{error.message}</p>
        <button type="button" onClick={() => refetch()} className="mt-3 min-h-11 rounded-xl bg-marca px-4 text-sm font-semibold text-white dark:text-slate-900">
          Tentar de novo
        </button>
        <p className="mt-3">Em emergência, ligue para a Defesa Civil: <a className="font-semibold text-marca underline" href="tel:199">199</a>.</p>
      </Vazio>
    );
  return null;
}
