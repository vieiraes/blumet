// Gráfico do nível do rio em SVG próprio. Completo: escala de 0 m até acima da última faixa, com as faixas de
// alerta (mostra o quanto falta para o perigo). Mini: só a tendência das últimas 24 h, ajustada aos dados.
import type { FaixaRio } from '../../functions/src/tipos.ts';
import { formatarHora, formatarMetros } from '../lib/formato.ts';
import { NIVEIS, nivelDaFaixa } from '../lib/niveis.ts';

type Leitura = { em: string; nivel: number };

const L = 320;
const A_COMPLETO = 220;
const A_MINI = 56;

function caminho(pts: { x: number; y: number }[]) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

export function GraficoRioMini({ leituras, cor }: { leituras: Leitura[]; cor: string }) {
  if (leituras.length < 2) return null;
  const min = Math.min(...leituras.map((l) => l.nivel));
  const max = Math.max(...leituras.map((l) => l.nivel));
  const folga = Math.max(0.15, (max - min) * 0.25);
  const y0 = min - folga;
  const y1 = max + folga;
  const pts = leituras.map((l, i) => ({ x: (i / (leituras.length - 1)) * L, y: A_MINI - ((l.nivel - y0) / (y1 - y0)) * A_MINI }));
  const ultimo = pts.at(-1)!;
  return (
    <svg viewBox={`0 0 ${L} ${A_MINI}`} className="h-14 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${caminho(pts)} L${L} ${A_MINI} L0 ${A_MINI} Z`} fill={cor} opacity={0.12} />
      <path d={caminho(pts)} fill="none" stroke={cor} strokeWidth={2.2} vectorEffect="non-scaling-stroke" />
      <circle cx={ultimo.x} cy={ultimo.y} r={3.5} fill={cor} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function GraficoRio({ leituras, faixas }: { leituras: Leitura[]; faixas: FaixaRio[] }) {
  if (leituras.length < 2) return null;
  const margem = { esq: 34, dir: 8, topo: 10, base: 22 };
  const w = L - margem.esq - margem.dir;
  const h = A_COMPLETO - margem.topo - margem.base;
  const maxFaixa = Math.max(...faixas.map((f) => f.aPartirDe), 0);
  const yMax = Math.ceil(Math.max(maxFaixa + 1, ...leituras.map((l) => l.nivel + 0.5)));
  const y = (m: number) => margem.topo + h - (m / yMax) * h;
  const x = (i: number) => margem.esq + (i / (leituras.length - 1)) * w;
  const pts = leituras.map((l, i) => ({ x: x(i), y: y(l.nivel) }));
  const ultimo = pts.at(-1)!;
  const faixasVisiveis = faixas.filter((f) => f.aPartirDe > 0);
  const marcas = [0, Math.round(leituras.length / 2), leituras.length - 1];
  const atual = leituras.at(-1)!;
  const resumo = `Nível do rio nas últimas ${leituras.length} leituras: de ${formatarMetros(leituras[0]!.nivel)} às ${formatarHora(leituras[0]!.em)} para ${formatarMetros(atual.nivel)} às ${formatarHora(atual.em)}.`;

  return (
    <figure>
      <svg viewBox={`0 0 ${L} ${A_COMPLETO}`} className="w-full" role="img" aria-label={resumo}>
        {/* faixas de alerta: área a partir da cota, com rótulo */}
        {faixasVisiveis.map((f, i) => {
          const proxima = faixasVisiveis[i + 1]?.aPartirDe ?? yMax;
          const e = NIVEIS[nivelDaFaixa(f.nome)];
          return (
            <g key={f.nome}>
              <rect x={margem.esq} width={w} y={y(proxima)} height={y(f.aPartirDe) - y(proxima)} fill={e.hex} opacity={0.08} />
              <line x1={margem.esq} x2={margem.esq + w} y1={y(f.aPartirDe)} y2={y(f.aPartirDe)} stroke={e.hex} strokeDasharray="4 4" strokeWidth={1} opacity={0.8} />
              <text x={margem.esq + 4} y={y(f.aPartirDe) - 3} textAnchor="start" className="fill-texto-2 text-[9px] font-medium">
                {f.nome} · {f.aPartirDe} m
              </text>
            </g>
          );
        })}
        {/* eixo y em metros */}
        {Array.from({ length: yMax + 1 }, (_, m) => m)
          .filter((m) => m % 2 === 0)
          .map((m) => (
            <text key={m} x={margem.esq - 6} y={y(m) + 3} textAnchor="end" className="fill-texto-3 text-[9px]">
              {m} m
            </text>
          ))}
        <line x1={margem.esq} x2={margem.esq + w} y1={y(0)} y2={y(0)} className="stroke-linha" />
        {/* leituras */}
        <path d={`${caminho(pts)} L${ultimo.x} ${y(0)} L${margem.esq} ${y(0)} Z`} className="fill-marca" opacity={0.12} />
        <path d={caminho(pts)} fill="none" className="stroke-marca" strokeWidth={2.4} strokeLinejoin="round" />
        <circle cx={ultimo.x} cy={ultimo.y} r={4.5} className="fill-marca stroke-superficie" strokeWidth={2} />
        {/* eixo x: horas */}
        {marcas.map((i) => (
          <text key={i} x={x(i)} y={A_COMPLETO - 6} textAnchor={i === 0 ? 'start' : i === leituras.length - 1 ? 'end' : 'middle'} className="fill-texto-3 text-[9px]">
            {formatarHora(leituras[i]!.em)}
          </text>
        ))}
      </svg>
      <figcaption className="sr-only">{resumo}</figcaption>
    </figure>
  );
}
