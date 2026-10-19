// Resumo do rio: nível atual, faixa, tendência e mini-gráfico. Leva para a aba Rio.
import { Link } from 'react-router';
import type { Rio } from '../../functions/src/tipos.ts';
import { formatarHora, formatarMetros, formatarVariacao } from '../lib/formato.ts';
import { NIVEIS, nivelDaFaixa } from '../lib/niveis.ts';
import { GraficoRioMini } from './GraficoRio.tsx';
import { IconeEstavel, IconeSetaBaixo, IconeSetaCima } from './Icones.tsx';
import { Cartao, SeloNivel } from './ui.tsx';

export function Tendencia({ variacao }: { variacao: number | null }) {
  if (variacao == null) return null;
  const sobe = variacao > 0.02;
  const desce = variacao < -0.02;
  const I = sobe ? IconeSetaCima : desce ? IconeSetaBaixo : IconeEstavel;
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${sobe ? 'text-red-700 dark:text-red-300' : desce ? 'text-emerald-700 dark:text-emerald-300' : 'text-texto-2'}`}>
      <I tamanho={16} />
      {sobe ? 'subindo' : desce ? 'descendo' : 'estável'} ({formatarVariacao(variacao)} em 1 h)
    </span>
  );
}

export function CartaoRio({ rio }: { rio: Rio }) {
  if (!rio.atual) return null;
  const nivel = nivelDaFaixa(rio.faixaAtual?.nome);
  return (
    <Link to="/rio" className="block rounded-2xl focus-visible:outline-offset-4">
      <Cartao className="transition-colors hover:border-marca/40" data-testid="cartao-rio">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <div>
            <p className="text-xs font-medium text-texto-3">Rio Itajaí-Açu · {formatarHora(rio.atual.em)}</p>
            <p className="whitespace-nowrap text-4xl font-bold tabular-nums tracking-tight">{formatarMetros(rio.atual.nivel)}</p>
          </div>
          <SeloNivel nivel={nivel} texto={rio.faixaAtual?.nome} grande />
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <Tendencia variacao={rio.variacao1h} />
          {rio.proximaFaixa && (
            <span className="text-xs text-texto-3">
              {rio.proximaFaixa.nome} a partir de {rio.proximaFaixa.aPartirDe} m
            </span>
          )}
        </div>
        <div className="mt-2">
          <GraficoRioMini leituras={rio.leituras} cor={NIVEIS[nivel].hex} />
        </div>
      </Cartao>
    </Link>
  );
}
