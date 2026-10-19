// Acesso a /api/dados com TanStack Query: atualiza a cada 2 min com o app visível e ao voltar para ele.
// O último resultado fica salvo no aparelho (persister em main.tsx), então o app abre offline com o último dado.
import { useQuery } from '@tanstack/react-query';
import type { Dados } from '../../functions/src/tipos.ts';

export type { Dados };

export const CHAVE_DADOS = ['dados'] as const;
export const INTERVALO_MS = 2 * 60_000;

export async function buscarDados(): Promise<Dados> {
  const res = await fetch('/api/dados', { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(res.status >= 500 ? 'A Defesa Civil não respondeu agora.' : `Erro ${res.status} ao buscar os dados.`);
  return res.json();
}

export const useDados = () =>
  useQuery({
    queryKey: CHAVE_DADOS,
    queryFn: buscarDados,
    refetchInterval: INTERVALO_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
    gcTime: 7 * 24 * 3600_000,
    retry: 2,
  });
