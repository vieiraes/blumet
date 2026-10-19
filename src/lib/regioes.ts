// Cruza a situação por região com o bairro escolhido e com a chuva.
import type { ChuvaRegiao, Situacao } from '../../functions/src/tipos.ts';
import type { NivelRegiao } from '../../functions/src/tipos.ts';
import { piorNivel } from './niveis.ts';
import { semAcento } from './formato.ts';

/** Região do bairro (comparação sem acento e sem caixa). */
export function regiaoDoBairro(situacao: Situacao | null | undefined, bairro: string | null | undefined): string | null {
  if (!situacao || !bairro) return null;
  const alvo = semAcento(bairro);
  return situacao.regioes.find((r) => r.bairros.some((b) => semAcento(b) === alvo))?.regiao ?? null;
}

export interface AlertaDaRegiao {
  tipo: string;
  nome: string;
  nivel: NivelRegiao;
  condicao: string;
}

/** Nível de cada tipo de alerta numa região (o pior primeiro). */
export function alertasDaRegiao(situacao: Situacao | null | undefined, regiao: string): AlertaDaRegiao[] {
  return (situacao?.alertas ?? [])
    .flatMap((a) => {
      const r = a.regioes.find((x) => x.regiao === regiao);
      return r ? [{ tipo: a.tipo, nome: a.nome, nivel: r.nivel, condicao: r.condicao }] : [];
    })
    .sort((a, b) => b.nivel - a.nivel);
}

/** Pior nível de cada região entre todos os tipos de alerta. */
export function niveisPorRegiao(situacao: Situacao | null | undefined): { regiao: string; nivel: NivelRegiao; bairros: string[]; alertas: AlertaDaRegiao[] }[] {
  return (situacao?.regioes ?? []).map((r) => {
    const alertas = alertasDaRegiao(situacao, r.regiao);
    return { regiao: r.regiao, bairros: r.bairros, nivel: piorNivel(alertas.map((a) => a.nivel)), alertas };
  });
}

/** Pior nível da cidade. */
export const nivelDaCidade = (situacao: Situacao | null | undefined): NivelRegiao => piorNivel(niveisPorRegiao(situacao).map((r) => r.nivel));

/** Chuva da região da cidade com o mesmo nome. */
export const chuvaDaRegiao = (regioes: ChuvaRegiao[] | undefined, regiao: string | null) => (regiao ? (regioes ?? []).find((r) => !r.bacia && r.regiao === regiao) ?? null : null);
