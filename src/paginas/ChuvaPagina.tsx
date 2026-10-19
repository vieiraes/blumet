import { useState } from 'react';
import type { Janela } from '../../functions/src/tipos.ts';
import { ComDados } from '../componentes/ComDados.tsx';
import { Cartao, FonteForaDoAr, TituloSecao } from '../componentes/ui.tsx';
import { formatarHora, formatarMm } from '../lib/formato.ts';
import { useMeuBairro } from '../lib/preferencias.ts';
import { regiaoDoBairro } from '../lib/regioes.ts';

const JANELAS: { id: Janela; rotulo: string }[] = [
  { id: 'h01', rotulo: '1 h' },
  { id: 'h24', rotulo: '24 h' },
  { id: 'h72', rotulo: '72 h' },
  { id: 'h168', rotulo: '7 dias' },
];

/** Intensidade só para a barra (não é classificação oficial). */
const largura = (mm: number, maximo: number) => `${Math.max(2, Math.min(100, (mm / Math.max(maximo, 1)) * 100))}%`;

export function ChuvaPagina() {
  const [janela, setJanela] = useState<Janela>('h24');
  const [bairro] = useMeuBairro();
  const [aberta, setAberta] = useState<string | null>(null);
  return (
    <ComDados>
      {(d) => {
        if (!d.chuva?.regioes.length) return <FonteForaDoAr nome="Chuva por estação" />;
        const minhaRegiao = regiaoDoBairro(d.situacao, bairro);
        const cidade = d.chuva.regioes.filter((r) => !r.bacia).sort((a, b) => (b.maximo[janela] ?? 0) - (a.maximo[janela] ?? 0));
        const bacia = d.chuva.regioes.find((r) => r.bacia);
        const maior = Math.max(...d.chuva.regioes.map((r) => r.maximo[janela] ?? 0));
        const grupos = bacia ? [...cidade, bacia] : cidade;
        return (
          <div className="flex flex-col gap-4">
            <div className="px-1">
              <h1 className="text-2xl font-bold">Chuva</h1>
              <p className="text-sm text-texto-2">Maior acumulado entre as estações de cada região. Leituras até {formatarHora(d.chuva.atualizadoEm)}.</p>
            </div>
            <div role="radiogroup" aria-label="Período do acumulado" className="grid grid-cols-4 gap-1 rounded-xl bg-superficie-2 p-1">
              {JANELAS.map((j) => (
                <button key={j.id} type="button" role="radio" aria-checked={janela === j.id} onClick={() => setJanela(j.id)} className={`min-h-10 rounded-lg text-sm font-semibold ${janela === j.id ? 'bg-superficie text-texto shadow-sm' : 'text-texto-2'}`}>
                  {j.rotulo}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {grupos.map((r, i) => {
                const valor = r.maximo[janela];
                const expandida = aberta === r.regiao;
                return (
                  <div key={r.regiao}>
                    {r.bacia && i > 0 && (
                      <TituloSecao>Rio acima</TituloSecao>
                    )}
                    <Cartao semEspaco>
                      <button type="button" onClick={() => setAberta(expandida ? null : r.regiao)} aria-expanded={expandida} className="w-full p-4 text-left">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-semibold">
                            {r.regiao}
                            {minhaRegiao === r.regiao && <span className="ml-2 rounded-full bg-marca-suave px-2 py-0.5 text-[11px] font-semibold text-marca-forte">seu bairro</span>}
                          </span>
                          <span className="text-lg font-bold tabular-nums">{formatarMm(valor)}</span>
                        </span>
                        <span className="mt-2 block h-2 overflow-hidden rounded-full bg-superficie-2" aria-hidden="true">
                          <span className="block h-full rounded-full bg-sky-500" style={{ width: largura(valor ?? 0, maior) }} />
                        </span>
                        <span className="mt-1 block text-xs text-texto-3">
                          {r.estacoes.length} {r.estacoes.length === 1 ? 'estação' : 'estações'}
                          {r.bacia ? ' na bacia, rio acima: chuva aqui faz o rio subir em Blumenau horas depois' : ''}
                        </span>
                      </button>
                      {expandida && (
                        <ul className="divide-y divide-linha border-t border-linha">
                          {r.estacoes.map((e) => (
                            <li key={`${e.nome}-${e.fonte}`} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                              <span className="min-w-0">
                                <span className="block truncate">{e.nome}</span>
                                <span className="block text-xs text-texto-3">Leitura às {formatarHora(e.em)}</span>
                              </span>
                              <span className="font-medium tabular-nums">{formatarMm(e.acumulado[janela])}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Cartao>
                  </div>
                );
              })}
            </div>
            <p className="px-1 text-xs text-texto-3">Estações sem leitura há mais de 3 horas ficam de fora. Fontes: AlertaBlu, Cemaden, Defesa Civil de SC e outras, pelo portal da Defesa Civil de Blumenau.</p>
          </div>
        );
      }}
    </ComDados>
  );
}
