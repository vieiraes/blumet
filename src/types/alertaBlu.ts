export interface AlertaBluResponse {
  dados: Dado[];
  datahoraAtualizacao: string;
}

export interface Dado {
  create_data: string;
  tipo: string;
  tipoNome: string;
  sitregioes: Sitregiao[];
  id: number;
  descricao: string;
}

export interface Sitregiao {
  regiao: Regiao;
  condicao: Condicao;
}

export interface Regiao {
  bairros: string[];
  id: number;
  nome: string;
}

export interface Condicao {
  cor_fundo: string;
  nivel: number;
  cor_fonte: string;
  id: number;
  condicao: string;
}
