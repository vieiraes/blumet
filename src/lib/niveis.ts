// Paleta única de níveis: sempre com texto além da cor, e com contraste bom nos temas claro e escuro.
// As cores que a Defesa Civil manda (cor_fundo/cor_fonte) não são usadas para texto.
import type { NivelRegiao } from '../../functions/src/tipos.ts';

/** 1–4 da situação por região; 5 só existe no rio (Alerta Máximo). */
export type Nivel = NivelRegiao | 5;

export interface EstiloNivel {
  nome: string;
  /** Fundo suave + texto escuro (claro) / fundo escuro + texto claro (escuro). */
  selo: string;
  /** Ponto ou barra sólida. */
  ponto: string;
  /** Borda para cartões. */
  borda: string;
  /** Cor sólida para SVG. */
  hex: string;
}

export const NIVEIS: Record<Nivel, EstiloNivel> = {
  1: { nome: 'Normalidade', selo: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200', ponto: 'bg-emerald-500', borda: 'border-emerald-300 dark:border-emerald-800', hex: '#10b981' },
  2: { nome: 'Observação', selo: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200', ponto: 'bg-yellow-400', borda: 'border-yellow-300 dark:border-yellow-700', hex: '#eab308' },
  3: { nome: 'Atenção', selo: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200', ponto: 'bg-orange-500', borda: 'border-orange-300 dark:border-orange-700', hex: '#f97316' },
  4: { nome: 'Alerta', selo: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200', ponto: 'bg-red-600', borda: 'border-red-400 dark:border-red-700', hex: '#dc2626' },
  5: { nome: 'Alerta Máximo', selo: 'bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950 dark:text-fuchsia-200', ponto: 'bg-fuchsia-700', borda: 'border-fuchsia-400 dark:border-fuchsia-700', hex: '#a21caf' },
};

const FAIXAS_RIO: Record<string, Nivel> = { normalidade: 1, 'observação': 2, 'atenção': 3, alerta: 4, 'alerta máximo': 5 };

/** Nível da paleta para uma faixa do rio pelo nome (Normalidade, Observação, Atenção, Alerta, Alerta Máximo). */
export const nivelDaFaixa = (nome: string | null | undefined): Nivel => FAIXAS_RIO[(nome ?? '').trim().toLowerCase()] ?? 1;

/** O pior nível entre vários (1 quando a lista é vazia). */
export const piorNivel = (niveis: number[]): NivelRegiao => (Math.max(1, ...niveis) as NivelRegiao);
