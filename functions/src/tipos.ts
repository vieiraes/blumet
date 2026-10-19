// Formato do JSON que a function devolve em /api/dados. O app importa este arquivo só como tipo.

/** 1 Normalidade · 2 Observação · 3 Atenção · 4 Alerta (escala da situação por região da Defesa Civil). */
export type NivelRegiao = 1 | 2 | 3 | 4;

export type SituacaoFonte = { ok: true; atualizadoEm: string | null } | { ok: false; erro: string };

export interface RegiaoSituacao {
  regiao: string;
  bairros: string[];
  nivel: NivelRegiao;
  condicao: string;
}

/** Um tipo de alerta (ex.: cch Condições meteorológicas, pes Risco de deslizamento, ven Vendaval). */
export interface AlertaTipo {
  tipo: string;
  nome: string;
  descricao: string;
  publicadoEm: string | null;
  regioes: RegiaoSituacao[];
}

export interface Situacao {
  atualizadoEm: string | null;
  alertas: AlertaTipo[];
  /** Regiões da cidade com os bairros (as 5 da situação atual). */
  regioes: { regiao: string; bairros: string[] }[];
}

export interface FaixaRio {
  /** Cota em metros a partir da qual a faixa vale. */
  aPartirDe: number;
  nome: string;
}

export interface Rio {
  nome: string;
  /** Leituras da mais antiga para a mais nova. */
  leituras: { em: string; nivel: number }[];
  atual: { em: string; nivel: number } | null;
  /** Variação em metros na última hora e nas últimas 3 h (null sem leitura suficiente). */
  variacao1h: number | null;
  variacao3h: number | null;
  faixas: FaixaRio[];
  faixaAtual: FaixaRio | null;
  proximaFaixa: FaixaRio | null;
}

export interface PeriodoPrevisao {
  periodo: string;
  data: string | null;
  ceu: string;
  chuva: string;
  temperatura: string;
  vento: string;
  /** Ícone simplificado para o app desenhar. */
  icone: 'sol' | 'sol-nuvem' | 'nuvem' | 'chuva' | 'tempestade' | 'neblina';
}

export type Janela = 'h01' | 'h03' | 'h24' | 'h72' | 'h168';

export interface EstacaoChuva {
  nome: string;
  fonte: string;
  em: string;
  acumulado: Partial<Record<Janela, number>>;
}

export interface ChuvaRegiao {
  regiao: string;
  /** true para as estações rio acima (bacia do Itajaí-Açu), fora das 5 regiões da cidade. */
  bacia: boolean;
  estacoes: EstacaoChuva[];
  /** Maior acumulado entre as estações da região, por janela. */
  maximo: Partial<Record<Janela, number>>;
}

export interface Chuva {
  atualizadoEm: string | null;
  regioes: ChuvaRegiao[];
}

export interface Abrigo {
  id: number;
  nome: string;
  aberto: boolean;
  bairro: string;
  endereco: string;
  telefone: string | null;
  lat: number | null;
  lng: number | null;
}

export interface Aviso {
  titulo: string | null;
  texto: string;
}

export interface Noticia {
  id: number;
  titulo: string;
  resumo: string;
  imagem: string | null;
  url: string;
  publicadaEm: string | null;
}

export interface Temperatura {
  valor: number;
  em: string;
}

export interface Dados {
  geradoEm: string;
  fontes: Record<string, SituacaoFonte>;
  situacao: Situacao | null;
  rio: Rio | null;
  previsao: PeriodoPrevisao[];
  chuva: Chuva | null;
  abrigos: Abrigo[];
  aviso: Aviso | null;
  noticias: Noticia[];
  temperatura: Temperatura | null;
}
