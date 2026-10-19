// As 5 regiões com o pior nível de cada uma; toque abre os tipos de alerta e os bairros.
import { useState } from 'react';
import type { Situacao } from '../../functions/src/tipos.ts';
import { NIVEIS } from '../lib/niveis.ts';
import { niveisPorRegiao } from '../lib/regioes.ts';
import { Cartao, SeloNivel } from './ui.tsx';

export function ListaRegioes({ situacao, regiaoDestacada }: { situacao: Situacao; regiaoDestacada?: string | null }) {
  const regioes = niveisPorRegiao(situacao).sort((a, b) => b.nivel - a.nivel || a.regiao.localeCompare(b.regiao, 'pt-BR'));
  const [aberta, setAberta] = useState<string | null>(null);
  return (
    <Cartao semEspaco>
      <ul className="divide-y divide-linha">
        {regioes.map((r) => {
          const expandida = aberta === r.regiao;
          return (
            <li key={r.regiao}>
              <button type="button" onClick={() => setAberta(expandida ? null : r.regiao)} aria-expanded={expandida} aria-controls={`regiao-${r.regiao}`} className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left">
                <span className={`h-9 w-1.5 shrink-0 rounded-full ${NIVEIS[r.nivel].ponto}`} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">
                    {r.regiao}
                    {regiaoDestacada === r.regiao && <span className="ml-2 rounded-full bg-marca-suave px-2 py-0.5 text-[11px] font-semibold text-marca-forte">seu bairro</span>}
                  </span>
                  <span className="block truncate text-xs text-texto-3">{r.bairros.join(', ')}</span>
                </span>
                <SeloNivel nivel={r.nivel} />
              </button>
              {expandida && (
                <div id={`regiao-${r.regiao}`} className="px-4 pb-4 pl-[2.1rem]">
                  <ul className="flex flex-col gap-2">
                    {r.alertas.map((a) => (
                      <li key={a.tipo} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-texto-2">{a.nome}</span>
                        <SeloNivel nivel={a.nivel} texto={a.condicao} />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-texto-3">Bairros: {r.bairros.join(', ')}.</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Cartao>
  );
}
