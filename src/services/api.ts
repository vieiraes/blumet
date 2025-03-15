import { AlertaBluResponse } from '@/types/alertaBlu';
import axios from 'axios';

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

export async function getSituacaoAtual(): Promise<AlertaBluResponse> {
  return latestData;
}

export async function atualizarDados(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Tentando atualizar dados via proxy interno');
    
    // Usamos o proxy interno em vez de chamar diretamente a API externa
    const response = await axios.get<AlertaBluResponse>(
      '/api/proxy',
      { timeout: 8000 }
    );
    
    if (response.data && response.data.dados && response.data.dados.length > 0) {
      latestData = response.data;
      lastUpdate = new Date();
      return { 
        success: true, 
        message: `Dados atualizados com sucesso às ${lastUpdate.toLocaleTimeString()}` 
      };
    } else {
      return { 
        success: false, 
        message: 'Recebeu resposta da API, mas os dados estão incompletos' 
      };
    }
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    return { 
      success: false, 
      message: 'Não foi possível conectar à API. Usando dados armazenados localmente.' 
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
