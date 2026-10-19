import { describe, expect, it } from 'vitest';
import { montarDados } from './agregador.ts';
import { carregarCenario } from '../scripts/cenario.ts';
import { ARQUIVOS, buscarTodos } from './fontes.ts';
import { dataBrasilia, formatarTelefone, iconePrevisao, normalizarAviso, normalizarChuva, normalizarRio, textoDeHtml } from './normalizar.ts';

const cenario = carregarCenario;

describe('dados reais (fixture normal)', () => {
  const { brutos, agora } = cenario('normal');
  const d = montarDados(brutos, agora);

  it('todas as fontes ok', () => {
    expect(Object.values(d.fontes).every((f) => f.ok)).toBe(true);
  });
  it('situação: tipos com as 5 regiões e bairros', () => {
    expect(d.situacao?.alertas.length).toBeGreaterThan(0);
    expect(d.situacao?.regioes.map((r) => r.regiao)).toEqual(['Central', 'Leste', 'Norte', 'Oeste', 'Sul']);
    expect(d.situacao?.regioes.every((r) => r.bairros.length > 0)).toBe(true);
  });
  it('rio: leituras em ordem e faixas de 0 a 8 m', () => {
    const em = d.rio!.leituras.map((l) => l.em);
    expect([...em].sort()).toEqual(em);
    expect(d.rio!.faixas.map((f) => f.aPartirDe)).toEqual([0, 3, 4, 6, 8]);
    expect(d.rio!.atual).toEqual(d.rio!.leituras.at(-1));
  });
  it('previsão em ordem do dia', () => {
    expect(d.previsao.map((p) => p.periodo)).toEqual(['Manhã', 'Tarde', 'Noite', 'Madrugada']);
  });
  it('chuva: só estações ativas, regiões da cidade antes da bacia', () => {
    const regioes = d.chuva!.regioes;
    expect(regioes.at(-1)?.bacia).toBe(true);
    for (const r of regioes) for (const e of r.estacoes) expect(agora.getTime() - Date.parse(e.em)).toBeLessThanOrEqual(3 * 3600_000);
  });
  it('abrigos: telefone formatado e coordenadas só dentro de Blumenau', () => {
    expect(d.abrigos.length).toBeGreaterThan(30);
    for (const a of d.abrigos) {
      if (a.lat !== null) expect(a.lat).toBeLessThan(-26.6);
      if (a.telefone) expect(a.telefone).toMatch(/^\(\d{2}\) \d{4,5}-\d{4}$/);
    }
  });
  it('notícias com link https e no máximo 6', () => {
    expect(d.noticias.length).toBeLessThanOrEqual(6);
    for (const n of d.noticias) expect(n.url.startsWith('https://')).toBe(true);
  });
});

describe('cenário de alerta', () => {
  const { brutos, agora } = cenario('alerta');
  const d = montarDados(brutos, agora);
  it('rio a 6,5 m na faixa Alerta, subindo, próxima faixa Alerta Máximo', () => {
    expect(d.rio?.atual?.nivel).toBe(6.5);
    expect(d.rio?.faixaAtual?.nome).toBe('Alerta');
    expect(d.rio?.proximaFaixa?.nome).toBe('Alerta Máximo');
    expect(d.rio?.variacao1h).toBeGreaterThan(0);
  });
  it('Sul em Alerta, abrigos abertos primeiro e aviso', () => {
    const cch = d.situacao?.alertas.find((a) => a.tipo === 'cch');
    expect(cch?.regioes.find((r) => r.regiao === 'Sul')?.nivel).toBe(4);
    expect(d.abrigos.slice(0, 3).every((a) => a.aberto)).toBe(true);
    expect(d.aviso?.titulo).toMatch(/cheia/);
  });
});

describe('fontes com falha', () => {
  it('uma fonte fora não derruba as outras', async () => {
    const { brutos } = cenario('normal');
    const buscar = async (url: string) => {
      if (url.includes('nivel_oficial')) throw new Error('a fonte respondeu 503');
      const a = ARQUIVOS.find((x) => url.endsWith(`/${x}.json`))!;
      const b = brutos[a];
      return b.ok ? b.dados : null;
    };
    const d = montarDados(await buscarTodos(buscar), new Date());
    expect(d.fontes.nivel_oficial).toEqual({ ok: false, erro: 'a fonte respondeu 503' });
    expect(d.rio).toBeNull();
    expect(d.situacao).not.toBeNull();
  });
});

describe('normalizadores', () => {
  it('data da chuva em hora de Brasília', () => {
    expect(dataBrasilia('18/10/2026 - 22:55')).toBe('2026-10-19T01:55:00.000Z');
    expect(dataBrasilia('lixo')).toBeNull();
  });
  it('estação parada há mais de 3 h sai', () => {
    const agora = new Date('2026-10-19T02:00:00Z');
    const bruto = [
      { regiao: 'Sul', estacao: 'Ativa', tipo: 'alertablu', horaLeitura: '18/10/2026 - 22:50', dados: { Variance: { h01: 1, h24: 5 } } },
      { regiao: 'Sul', estacao: 'Parada', tipo: 'cemaden2', horaLeitura: '16/04/2025 - 02:10', dados: { Variance: { h01: 9, h24: 90 } } },
      { regiao: 'Sul', estacao: 'DCSC Ativa', tipo: 'estado_sc', horaLeitura: '18/10/2026 - 22:55', dados: { Variance: { h01: 1, h24: 5 } } },
    ];
    const c = normalizarChuva(bruto, agora)!;
    expect(c.regioes[0]?.estacoes.map((e) => e.nome)).toEqual(['Ativa']);
    expect(c.regioes[0]?.maximo.h24).toBe(5);
  });
  it('rio sem leituras não quebra', () => {
    expect(normalizarRio({ niveis: [], condicoes: [] })).toMatchObject({ atual: null, variacao1h: null, faixaAtual: null });
    expect(normalizarRio(null)).toBeNull();
  });
  it('aviso: null, texto ou objeto', () => {
    expect(normalizarAviso(null)).toBeNull();
    expect(normalizarAviso('<p>Rio subindo</p>')).toEqual({ titulo: null, texto: 'Rio subindo' });
    expect(normalizarAviso({ mensagem: 'Procure abrigo' })).toEqual({ titulo: null, texto: 'Procure abrigo' });
  });
  it('telefone, ícone e html', () => {
    expect(formatarTelefone('4733788284')).toBe('(47) 3378-8284');
    expect(formatarTelefone('')).toBeNull();
    expect(iconePrevisao('Nublado', 'Chuva Fraca')).toBe('chuva');
    expect(iconePrevisao('Claro', 'Sem Chuva')).toBe('sol');
    expect(iconePrevisao('Encoberto', 'Sem Chuva')).toBe('nuvem');
    expect(textoDeHtml('<b>a&nbsp;b</b><br>c')).toBe('a b\nc');
  });
});
