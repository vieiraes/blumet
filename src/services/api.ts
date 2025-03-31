import { AlertaBluResponse } from '@/types/alertaBlu';
import axios from 'axios';

// Interface para resposta de erro
interface AlertaBluError {
  erro: boolean;
  mensagem: string;
  codigoErro: string;
  dataHora: string;
  contatoDefesaCivil?: string;
}

// Dados estáticos embutidos diretamente no código
const staticData: AlertaBluResponse = {
  "dados": [
    {
      "create_data": "2025-03-14T09:29:09.830Z",
      "tipo": "cch",
      "tipoNome": "Condições de Chuva",
      "sitregioes": [
        {
          "regiao": {
            "bairros": [
              "Bom Retiro",
              "Victor Konder",
              "Jardim Blumenau",
              "Boa Vista",
              "Vorstadt",
              "Centro",
              "Ponta Aguda",
              "Ribeirão Fresco"
            ],
            "id": 4,
            "nome": "Central"
          },
          "condicao": {
            "cor_fundo": "#64EE64",
            "nivel": 1,
            "cor_fonte": "#000000",
            "id": 61,
            "condicao": "Normalidade"
          }
        },
        {
          "regiao": {
            "bairros": [
              "Fortaleza Alta",
              "Fidélis",
              "Fortaleza",
              "Itoupava Norte",
              "Tribess",
              "Nova Esperança"
            ],
            "id": 83,
            "nome": "Leste"
          },
          "condicao": {
            "cor_fundo": "#64EE64",
            "nivel": 1,
            "cor_fonte": "#000000",
            "id": 61,
            "condicao": "Normalidade"
          }
        }
        // Adicione mais regiões conforme necessário
      ],
      "id": 38351,
      "descricao": "retorno normalidade"
    }
  ],
  "datahoraAtualizacao": "2025-03-14T21:11:41.274Z"
};

// Variável para armazenar os dados mais recentes
let latestData: AlertaBluResponse = { ...staticData };
let lastUpdate: Date = new Date();

// Cliente de API para front-end - não muda entre dev e prod
export async function getSituacaoAtual() {
  try {
    console.log('Chamando API situacao-atual...');
    const apiUrl = '/api/situacao-atual';
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Erro HTTP: ${response.status}`, await response.text());
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados recebidos:', data);
    return data;
  } catch (error) {
    console.error('Falha ao obter dados:', error);
    throw error;
  }
}

export async function atualizarDados(): Promise<{ 
  success: boolean; 
  message: string; 
  isError?: boolean;
  errorData?: AlertaBluError;
}> {
  try {
    console.log('Tentando atualizar dados via proxy interno');
    const response = await fetch('/api/proxy', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Erro HTTP: ${response.status}`, await response.text());
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados atualizados:', data);
    return {
      success: true,
      message: 'Dados atualizados com sucesso'
    };
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    return {
      success: false,
      message: 'Falha ao atualizar dados',
      isError: true
    };
  }
}

// Exportar função para verificar quando foi a última atualização
export function getLastUpdateInfo(): { date: Date; isStatic: boolean } {
  return { 
    date: lastUpdate, 
    isStatic: latestData === staticData 
  };
}
