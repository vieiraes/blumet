import { useMemo, useState } from 'react';
import type { Abrigo } from '../../functions/src/tipos.ts';
import { ComDados } from '../componentes/ComDados.tsx';
import { IconeBusca, IconeMapa, IconeTelefone } from '../componentes/Icones.tsx';
import { Cartao, FonteForaDoAr, Vazio } from '../componentes/ui.tsx';
import { semAcento } from '../lib/formato.ts';
import { useMeuBairro } from '../lib/preferencias.ts';

const linkMapa = (a: Abrigo) =>
  a.lat != null && a.lng != null ? `https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.nome}, ${a.endereco}, ${a.bairro}, Blumenau SC`)}`;

function CartaoAbrigo({ a }: { a: Abrigo }) {
  return (
    <Cartao className={a.aberto ? 'border-emerald-400 dark:border-emerald-700' : ''}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{a.nome}</h3>
          <p className="text-sm text-texto-2">
            {a.endereco} · {a.bairro}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.aberto ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-superficie-2 text-texto-2'}`}>{a.aberto ? 'Aberto' : 'Fechado'}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {a.telefone ? (
          <a href={`tel:${a.telefone.replace(/\D/g, '')}`} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-superficie-2 text-sm font-semibold" aria-label={`Ligar para ${a.nome}: ${a.telefone}`}>
            <IconeTelefone tamanho={18} />
            Ligar
          </a>
        ) : (
          <span className="flex min-h-11 items-center justify-center rounded-xl text-sm text-texto-3">Sem telefone</span>
        )}
        <a href={linkMapa(a)} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-superficie-2 text-sm font-semibold" aria-label={`Como chegar em ${a.nome} (abre o mapa)`}>
          <IconeMapa tamanho={18} />
          Como chegar
        </a>
      </div>
    </Cartao>
  );
}

export function AbrigosPagina() {
  const [busca, setBusca] = useState('');
  const [bairro] = useMeuBairro();
  return (
    <ComDados>
      {(d) => <ListaAbrigos abrigos={d.abrigos} ok={d.fontes.abrigos?.ok !== false} busca={busca} setBusca={setBusca} bairro={bairro} />}
    </ComDados>
  );
}

function ListaAbrigos({ abrigos, ok, busca, setBusca, bairro }: { abrigos: Abrigo[]; ok: boolean; busca: string; setBusca: (s: string) => void; bairro: string | null }) {
  const filtrados = useMemo(() => {
    const t = semAcento(busca.trim());
    const lista = abrigos.filter((a) => !t || semAcento(`${a.bairro} ${a.nome} ${a.endereco}`).includes(t));
    // abertos primeiro; depois os do meu bairro
    const meu = bairro ? semAcento(bairro) : null;
    return [...lista].sort((a, b) => Number(b.aberto) - Number(a.aberto) || Number(meu !== null && semAcento(b.bairro) === meu) - Number(meu !== null && semAcento(a.bairro) === meu));
  }, [abrigos, busca, bairro]);
  if (!ok) return <FonteForaDoAr nome="Abrigos" />;
  const abertos = abrigos.filter((a) => a.aberto).length;
  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <h1 className="text-2xl font-bold">Abrigos</h1>
        <p className="text-sm text-texto-2" aria-live="polite">
          {abertos ? <strong className="text-emerald-700 dark:text-emerald-300">{abertos === 1 ? '1 abrigo aberto agora' : `${abertos} abrigos abertos agora`}</strong> : 'Nenhum abrigo aberto agora. Eles abrem em situação de enchente ou deslizamento.'} · {abrigos.length} no total
        </p>
      </div>
      <label className="flex items-center gap-2 rounded-xl border border-linha bg-superficie px-3">
        <IconeBusca tamanho={18} className="text-texto-3" />
        <span className="sr-only">Buscar por bairro ou nome</span>
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por bairro ou nome" className="h-12 w-full bg-transparent text-base outline-none placeholder:text-texto-3" autoComplete="off" enterKeyHint="search" />
      </label>
      {filtrados.length === 0 ? (
        <Vazio titulo="Nenhum abrigo encontrado">Tente outro bairro.</Vazio>
      ) : (
        <ul className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
          {filtrados.map((a) => (
            <li key={a.id}>
              <CartaoAbrigo a={a} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
