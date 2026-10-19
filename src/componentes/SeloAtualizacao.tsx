// Estado dos dados no cabeçalho: "atualizado há 2 min" / "sem conexão · dados de 14:05" / erro. Botão para buscar agora.
import { useEffect, useState } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { CHAVE_DADOS, useDados } from '../lib/dados.ts';
import { formatarHora, haQuantoTempo } from '../lib/formato.ts';
import { IconeAtualizar, IconeSemRede } from './Icones.tsx';

function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    addEventListener('online', on);
    addEventListener('offline', off);
    return () => {
      removeEventListener('online', on);
      removeEventListener('offline', off);
    };
  }, []);
  return online;
}

/** Re-renderiza a cada 30 s para o "há X min" andar sozinho. */
function useRelogio() {
  const [, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);
}

export function SeloAtualizacao() {
  useRelogio();
  const online = useOnline();
  const { data, isError, dataUpdatedAt } = useDados();
  const buscando = useIsFetching({ queryKey: CHAVE_DADOS }) > 0;
  const qc = useQueryClient();
  const quando = dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : (data?.geradoEm ?? null);

  let texto: string;
  let classe = 'text-texto-2';
  if (!online) {
    texto = data ? `Sem conexão · dados de ${formatarHora(quando)}` : 'Sem conexão';
    classe = 'text-orange-700 dark:text-orange-300';
  } else if (isError && data) {
    texto = `Falha ao atualizar · dados de ${formatarHora(quando)}`;
    classe = 'text-orange-700 dark:text-orange-300';
  } else if (buscando && !data) texto = 'Carregando…';
  else texto = `Atualizado ${haQuantoTempo(quando)}`;

  return (
    <div className="flex items-center gap-1.5">
      <p className={`flex items-center gap-1.5 text-xs font-medium ${classe}`} aria-live="polite" data-testid="selo-atualizacao">
        {!online && <IconeSemRede tamanho={16} />}
        {texto}
      </p>
      <button type="button" onClick={() => qc.invalidateQueries({ queryKey: CHAVE_DADOS })} disabled={buscando || !online} className="flex h-10 w-10 items-center justify-center rounded-full text-texto-2 hover:bg-superficie-2 disabled:opacity-40" aria-label="Atualizar os dados agora">
        <IconeAtualizar tamanho={19} className={buscando ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}
