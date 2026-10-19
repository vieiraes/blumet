import { describe, expect, it } from 'vitest';
import type { Situacao } from '../../functions/src/tipos.ts';
import { alertasDaRegiao, nivelDaCidade, niveisPorRegiao, regiaoDoBairro } from './regioes.ts';
import { nivelDaFaixa, piorNivel } from './niveis.ts';
import { formatarVariacao, haQuantoTempo } from './formato.ts';

const situacao: Situacao = {
  atualizadoEm: null,
  regioes: [
    { regiao: 'Central', bairros: ['Centro', 'Ponta Aguda'] },
    { regiao: 'Sul', bairros: ['Garcia', 'Glória'] },
  ],
  alertas: [
    { tipo: 'cch', nome: 'Condições Meteorológicas', descricao: '', publicadoEm: null, regioes: [{ regiao: 'Central', bairros: [], nivel: 1, condicao: 'Normalidade' }, { regiao: 'Sul', bairros: [], nivel: 4, condicao: 'Alerta' }] },
    { tipo: 'pes', nome: 'Risco de Deslizamento', descricao: '', publicadoEm: null, regioes: [{ regiao: 'Central', bairros: [], nivel: 2, condicao: 'Observação' }, { regiao: 'Sul', bairros: [], nivel: 3, condicao: 'Atenção' }] },
  ],
};

describe('regiões', () => {
  it('acha a região do bairro sem acento nem caixa', () => {
    expect(regiaoDoBairro(situacao, 'gloria')).toBe('Sul');
    expect(regiaoDoBairro(situacao, 'PONTA AGUDA')).toBe('Central');
    expect(regiaoDoBairro(situacao, 'Inexistente')).toBeNull();
    expect(regiaoDoBairro(null, 'Centro')).toBeNull();
  });
  it('alertas da região do pior para o melhor', () => {
    expect(alertasDaRegiao(situacao, 'Central').map((a) => a.nivel)).toEqual([2, 1]);
  });
  it('pior nível por região e da cidade', () => {
    expect(niveisPorRegiao(situacao).map((r) => [r.regiao, r.nivel])).toEqual([['Central', 2], ['Sul', 4]]);
    expect(nivelDaCidade(situacao)).toBe(4);
    expect(nivelDaCidade(null)).toBe(1);
  });
});

describe('níveis e formato', () => {
  it('faixa do rio para a paleta', () => {
    expect(nivelDaFaixa('Alerta Máximo')).toBe(5);
    expect(nivelDaFaixa('Atenção')).toBe(3);
    expect(nivelDaFaixa(undefined)).toBe(1);
    expect(piorNivel([])).toBe(1);
  });
  it('variação e tempo decorrido', () => {
    expect(formatarVariacao(0.12)).toBe('+0,12 m');
    expect(formatarVariacao(-0.05)).toBe('−0,05 m');
    const agora = Date.parse('2026-10-19T12:00:00Z');
    expect(haQuantoTempo('2026-10-19T11:55:00Z', agora)).toBe('há 5 min');
    expect(haQuantoTempo('2026-10-19T09:00:00Z', agora)).toBe('há 3 h');
  });
});
