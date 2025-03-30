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

export async function getSituacaoAtual(): Promise<AlertaBluResponse> {
  const response = await axios.get<AlertaBluResponse>('/api/proxy');
  return response.data;
}

export async function atualizarDados(): Promise<{ 
  success: boolean; 
  message: string; 
  isError?: boolean;
  errorData?: AlertaBluError;
}> {
  try {
    console.log('Tentando atualizar dados via proxy interno');
    
    // Usamos o proxy interno em vez de chamar diretamente a API externa
    const response = await axios.get('/api/proxy', { timeout: 20000 });
    
    if (response.data.erro) {
      // Se o servidor retornou uma resposta de erro estruturada
      return { 
        success: false, 
        message: response.data.mensagem || 'Erro ao obter dados atualizados',
        isError: true,
        errorData: response.data
      };
    }
    
    if (response.data && response.data.dados && response.data.dados.length > 0) {
      return { 
        success: true, 
        message: `Dados atualizados com sucesso!`,
      };
    } else {
      return { 
        success: false, 
        message: 'A API retornou dados incompletos ou em formato inesperado.'
      };
    }
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    let message = 'Não foi possível conectar à API. Tente novamente mais tarde.';
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        message = 'A conexão com o servidor demorou muito para responder. Tente novamente mais tarde.';
      } else if (error.response?.status === 503) {
        // Tentar extrair mensagem de erro estruturada da API 
        if (error.response.data?.mensagem) {
          message = error.response.data.mensagem;
        } else {
          message = 'Serviço AlertaBlu temporariamente indisponível.';
        }
      }
    }
    
    return { 
      success: false, 
      message,
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
