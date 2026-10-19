// Converte os JSONs brutos da Defesa Civil no formato do app (tipos.ts). Funções puras: recebem o dado bruto
// (unknown, nunca confiável) e o "agora"; não fazem rede nem leem relógio.
import type { Abrigo, AlertaTipo, Aviso, Chuva, ChuvaRegiao, EstacaoChuva, FaixaRio, Janela, NivelRegiao, Noticia, PeriodoPrevisao, Rio, Situacao, Temperatura } from './tipos.ts';

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj | null => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : null);
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const iso = (v: unknown): string | null => {
  const s = str(v);
  return s && !Number.isNaN(Date.parse(s)) ? new Date(s).toISOString() : null;
};
const arred = (n: number, casas = 2) => Math.round(n * 10 ** casas) / 10 ** casas;

/** Blumenau usa o horário de Brasília (UTC−3, sem horário de verão desde 2019). */
const UTC_MENOS_3 = 3 * 3600_000;

/** "18/10/2026 - 22:55" (hora de Brasília) → ISO em UTC. */
export function dataBrasilia(texto: unknown): string | null {
  const m = str(texto).match(/^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})$/);
  if (!m) return null;
  const [, d, mo, a, h, mi] = m.map(Number) as [number, number, number, number, number, number];
  return new Date(Date.UTC(a, mo - 1, d, h, mi) + UTC_MENOS_3).toISOString();
}

/** "2025-09-29 14:02" (hora de Brasília) → ISO em UTC. */
export function dataHoraBrasilia(texto: unknown): string | null {
  const m = str(texto).match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
  if (!m) return null;
  const [, a, mo, d, h, mi] = m.map(Number) as [number, number, number, number, number, number];
  return new Date(Date.UTC(a, mo - 1, d, h, mi) + UTC_MENOS_3).toISOString();
}

// ---------------------------------------------------------------- situação por região
const nivelRegiao = (n: unknown): NivelRegiao => {
  const v = num(n) ?? 1;
  return (v <= 1 ? 1 : v >= 4 ? 4 : Math.round(v)) as NivelRegiao;
};

export function normalizarSituacao(bruto: unknown): Situacao | null {
  const raiz = obj(bruto);
  if (!raiz) return null;
  const alertas: AlertaTipo[] = arr(raiz.dados).flatMap((d) => {
    const a = obj(d);
    if (!a) return [];
    const regioes = arr(a.sitregioes).flatMap((s) => {
      const r = obj(obj(s)?.regiao);
      const c = obj(obj(s)?.condicao);
      if (!r || !str(r.nome)) return [];
      return [{ regiao: str(r.nome), bairros: arr(r.bairros).map(str).filter(Boolean), nivel: nivelRegiao(c?.nivel), condicao: str(c?.condicao) || 'Normalidade' }];
    });
    return [{ tipo: str(a.tipo), nome: str(a.tipoNome) || str(a.tipo), descricao: str(a.descricao), publicadoEm: iso(a.create_data), regioes }];
  });
  // Regiões e bairros: a união de todos os tipos (normalmente as mesmas 5)
  const porRegiao = new Map<string, Set<string>>();
  for (const a of alertas) for (const r of a.regioes) {
    const set = porRegiao.get(r.regiao) ?? new Set<string>();
    r.bairros.forEach((b) => set.add(b));
    porRegiao.set(r.regiao, set);
  }
  return {
    atualizadoEm: iso(raiz.datahoraAtualizacao),
    alertas,
    regioes: [...porRegiao].map(([regiao, b]) => ({ regiao, bairros: [...b].sort((x, y) => x.localeCompare(y, 'pt-BR')) })).sort((x, y) => x.regiao.localeCompare(y.regiao, 'pt-BR')),
  };
}

// ---------------------------------------------------------------- rio
export function normalizarRio(bruto: unknown): Rio | null {
  const raiz = obj(bruto);
  if (!raiz) return null;
  const leituras = arr(raiz.niveis)
    .flatMap((l) => {
      const o = obj(l);
      const em = iso(o?.horaLeitura);
      const nivel = num(o?.nivel);
      return em && nivel !== null ? [{ em, nivel: arred(nivel) }] : [];
    })
    .sort((a, b) => a.em.localeCompare(b.em));
  const faixas: FaixaRio[] = arr(raiz.condicoes)
    .flatMap((c) => {
      const o = obj(c);
      const aPartirDe = num(o?.nivel);
      return aPartirDe !== null && str(o?.condicao) ? [{ aPartirDe, nome: str(o?.condicao) }] : [];
    })
    .sort((a, b) => a.aPartirDe - b.aPartirDe);
  const atual = leituras.at(-1) ?? null;
  const antes = (horas: number) => {
    if (!atual) return null;
    const alvo = Date.parse(atual.em) - horas * 3600_000;
    const l = leituras.find((x) => Math.abs(Date.parse(x.em) - alvo) < 20 * 60_000);
    return l ? arred(atual.nivel - l.nivel) : null;
  };
  const faixaAtual = atual ? ([...faixas].reverse().find((f) => atual.nivel >= f.aPartirDe) ?? null) : null;
  return {
    nome: 'Rio Itajaí-Açu',
    leituras,
    atual,
    variacao1h: antes(1),
    variacao3h: antes(3),
    faixas,
    faixaAtual,
    proximaFaixa: atual ? (faixas.find((f) => f.aPartirDe > atual.nivel) ?? null) : null,
  };
}

// ---------------------------------------------------------------- previsão
const ORDEM_PERIODOS = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];

export function iconePrevisao(ceu: string, chuva: string): PeriodoPrevisao['icone'] {
  const t = `${ceu} ${chuva}`.toLowerCase();
  if (/trovoada|tempestade|temporal/.test(t)) return 'tempestade';
  if (/chuva|pancada|garoa|chuvisco/.test(t) && !/sem chuva/.test(t)) return 'chuva';
  if (/nevoeiro|neblina|nebuloso/.test(t)) return 'neblina';
  const c = ceu.toLowerCase();
  if (/^claro$/.test(c)) return 'sol';
  if (/claro|parcial|poucas/.test(c)) return 'sol-nuvem';
  if (/nublado|encoberto/.test(c)) return 'nuvem';
  return 'sol-nuvem';
}

export function normalizarPrevisao(bruto: unknown): PeriodoPrevisao[] {
  return arr(bruto)
    .flatMap((p) => {
      const o = obj(p);
      if (!o || !str(o.periodo)) return [];
      const ceu = str(obj(o.ceu)?.ceu);
      const chuva = str(obj(o.precipitacao)?.precipitacao);
      const vel = str(obj(o.velocidade_vento)?.velocidade);
      const dir = str(obj(o.direcao_vento)?.direcao);
      return [{ periodo: str(o.periodo), data: iso(o.data_Previsao), ceu, chuva, temperatura: str(obj(o.temperatura)?.temperatura), vento: [vel, dir].filter(Boolean).join(' · '), icone: iconePrevisao(ceu, chuva) }];
    })
    .sort((a, b) => ORDEM_PERIODOS.indexOf(a.periodo) - ORDEM_PERIODOS.indexOf(b.periodo));
}

// ---------------------------------------------------------------- chuva
export const REGIOES_CIDADE = ['Central', 'Leste', 'Norte', 'Oeste', 'Sul'];
const REGIAO_BACIA = 'Itajaí-Açú';
const JANELAS: Janela[] = ['h01', 'h03', 'h24', 'h72', 'h168'];
/** Estação sem leitura há mais que isso é considerada parada e sai da lista. */
export const ESTACAO_PARADA_MS = 3 * 3600_000;

const nomeEstacao = (s: string) => s.replace(/^DCSC\s+/i, '').replace(/^BLUMENAU:/i, '').trim();

export function normalizarChuva(bruto: unknown, agora: Date): Chuva | null {
  if (!Array.isArray(bruto)) return null;
  const vistas = new Set<string>();
  const porRegiao = new Map<string, EstacaoChuva[]>();
  let maisRecente: string | null = null;
  for (const item of bruto) {
    const o = obj(item);
    const regiao = str(o?.regiao);
    if (!o || !(REGIOES_CIDADE.includes(regiao) || regiao === REGIAO_BACIA)) continue;
    const acc = obj(obj(o.dados)?.Variance);
    const em = dataBrasilia(o.horaLeitura);
    if (!acc || !em || agora.getTime() - Date.parse(em) > ESTACAO_PARADA_MS) continue;
    const acumulado: Partial<Record<Janela, number>> = {};
    for (const j of JANELAS) {
      const v = num(acc[j]);
      if (v !== null && v >= 0) acumulado[j] = arred(v, 1);
    }
    if (acumulado.h24 === undefined && acumulado.h01 === undefined) continue;
    const nome = nomeEstacao(str(o.estacao));
    // A mesma estação aparece duas vezes (ex.: "Agrolândia" e "DCSC Agrolândia"): fica a primeira
    const chave = `${regiao}|${nome.toLowerCase()}`;
    if (vistas.has(chave)) continue;
    vistas.add(chave);
    const lista = porRegiao.get(regiao) ?? [];
    lista.push({ nome, fonte: str(o.tipo), em, acumulado });
    porRegiao.set(regiao, lista);
    if (!maisRecente || em > maisRecente) maisRecente = em;
  }
  const regioes: ChuvaRegiao[] = [...REGIOES_CIDADE, REGIAO_BACIA].flatMap((regiao) => {
    const estacoes = (porRegiao.get(regiao) ?? []).sort((a, b) => (b.acumulado.h24 ?? 0) - (a.acumulado.h24 ?? 0) || a.nome.localeCompare(b.nome, 'pt-BR'));
    if (!estacoes.length) return [];
    const maximo: Partial<Record<Janela, number>> = {};
    for (const j of JANELAS) {
      const vals = estacoes.map((e) => e.acumulado[j]).filter((v): v is number => v !== undefined);
      if (vals.length) maximo[j] = Math.max(...vals);
    }
    return [{ regiao: regiao === REGIAO_BACIA ? 'Bacia do Itajaí-Açu' : regiao, bacia: regiao === REGIAO_BACIA, estacoes, maximo }];
  });
  return { atualizadoEm: maisRecente, regioes };
}

// ---------------------------------------------------------------- abrigos
export function formatarTelefone(t: unknown): string | null {
  const d = str(t).replace(/\D/g, '');
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return d ? d : null;
}

/** Coordenada válida dentro de uma caixa larga em volta de Blumenau (descarta lixo como [178.99, -89.99]). */
const dentroDeBlumenau = (lat: number, lng: number) => lat > -27.2 && lat < -26.6 && lng > -49.4 && lng < -48.8;

export function normalizarAbrigos(bruto: unknown): Abrigo[] {
  return arr(bruto)
    .flatMap((a) => {
      const o = obj(a);
      const id = num(o?.id);
      if (!o || id === null || !str(o.designacao)) return [];
      const [lng, lat] = arr(o.localizacao).map(num);
      const temCoord = lat != null && lng != null && dentroDeBlumenau(lat, lng);
      return [{ id, nome: str(o.designacao).replace(/\s+/g, ' '), aberto: /^aberto/i.test(str(o.estado)), bairro: str(o.bairro), endereco: str(o.logradouro).replace(/\s+/g, ' '), telefone: formatarTelefone(o.telefone), lat: temCoord ? lat : null, lng: temCoord ? lng : null }];
    })
    .sort((a, b) => Number(b.aberto) - Number(a.aberto) || a.bairro.localeCompare(b.bairro, 'pt-BR') || a.nome.localeCompare(b.nome, 'pt-BR'));
}

// ---------------------------------------------------------------- aviso, notícias, temperatura
/** Tira tags e entidades simples de um trecho HTML. */
export function textoDeHtml(html: unknown): string {
  return str(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim();
}

/** O arquivo vem `null` quando não há aviso. Quando há, o formato não é documentado: aceita texto ou objeto. */
export function normalizarAviso(bruto: unknown): Aviso | null {
  if (typeof bruto === 'string') return textoDeHtml(bruto) ? { titulo: null, texto: textoDeHtml(bruto) } : null;
  const o = obj(Array.isArray(bruto) ? bruto[0] : bruto);
  if (!o) return null;
  const titulo = textoDeHtml(o.titulo ?? o.title ?? o.assunto) || null;
  const texto = textoDeHtml(o.texto ?? o.mensagem ?? o.conteudo ?? o.descricao ?? o.aviso ?? o.text);
  if (!texto && !titulo) return null;
  return { titulo, texto: texto || titulo || '' };
}

const https = (u: string) => u.replace(/^http:\/\//i, 'https://');

export function normalizarNoticias(bruto: unknown, limite = 6): Noticia[] {
  return arr(bruto)
    .flatMap((n) => {
      const o = obj(n);
      const id = num(o?.id);
      if (!o || id === null || !str(o.titulo) || !str(o.url)) return [];
      const resumo = str(o.subtitulo) || textoDeHtml(o.conteudo).slice(0, 220);
      return [{ id, titulo: str(o.titulo), resumo, imagem: str(o.imagem) ? https(str(o.imagem)) : null, url: https(str(o.url)), publicadaEm: dataHoraBrasilia(o.data_post) }];
    })
    .sort((a, b) => (b.publicadaEm ?? '').localeCompare(a.publicadaEm ?? ''))
    .slice(0, limite);
}

export function normalizarTemperatura(bruto: unknown): Temperatura | null {
  const leituras = arr(bruto).flatMap((t) => {
    const o = obj(t);
    const em = iso(o?.horaLeitura);
    const valor = num(o?.valor);
    return em && valor !== null ? [{ em, valor: arred(valor, 1) }] : [];
  });
  return leituras.sort((a, b) => b.em.localeCompare(a.em))[0] ?? null;
}
