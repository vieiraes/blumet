import type { PeriodoPrevisao, Temperatura } from '../../functions/src/tipos.ts';
import { IconeTempo } from './IconeTempo.tsx';
import { Cartao } from './ui.tsx';

/** Previsão oficial por período, rolando na horizontal no celular. */
export function Previsao({ periodos, temperatura }: { periodos: PeriodoPrevisao[]; temperatura: Temperatura | null }) {
  if (!periodos.length && !temperatura) return null;
  return (
    <Cartao semEspaco aria-labelledby="titulo-previsao">
      <div className="flex items-baseline justify-between px-4 pt-4">
        <h2 id="titulo-previsao" className="font-semibold">
          Previsão do tempo
        </h2>
        {temperatura && <p className="text-sm text-texto-2">Agora: <span className="font-semibold text-texto">{Math.round(temperatura.valor)}°C</span></p>}
      </div>
      <ul className="flex snap-x gap-3 overflow-x-auto px-4 pb-4 pt-3 [scrollbar-width:none]">
        {periodos.map((p) => (
          <li key={p.periodo} className="flex w-36 shrink-0 snap-start flex-col gap-1 rounded-xl bg-superficie-2 p-3">
            <span className="text-xs font-semibold text-texto-2">{p.periodo}</span>
            <IconeTempo icone={p.icone} />
            <span className="text-sm font-medium leading-tight">{p.ceu}</span>
            <span className="text-xs text-texto-2">{p.chuva}</span>
            {p.temperatura && <span className="text-xs text-texto-3">Temperatura em {p.temperatura.toLowerCase()}</span>}
            {p.vento && <span className="text-xs text-texto-3">Vento {p.vento.toLowerCase()}</span>}
          </li>
        ))}
      </ul>
    </Cartao>
  );
}
