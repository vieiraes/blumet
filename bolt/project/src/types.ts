export interface WeatherData {
  dados: Alert[];
  datahoraAtualizacao: string;
}

export interface Alert {
  create_data: string;
  tipo: string;
  tipoNome: string;
  sitregioes: RegionStatus[];
  id: number;
  descricao: string;
}

export interface RegionStatus {
  regiao: Region;
  condicao: Condition;
}

export interface Region {
  bairros: string[];
  id: number;
  nome: string;
}

export interface Condition {
  cor_fundo: string;
  nivel: number;
  cor_fonte: string;
  id: number;
  condicao: string;
}