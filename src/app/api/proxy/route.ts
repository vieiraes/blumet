import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

export async function GET(request: NextRequest) {
  try {
    console.log('Proxy: Fazendo requisição para API externa');
    
    // Criar uma instância do Axios com configuração personalizada para SSL
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false // Ignora problemas de certificado
      }),
      timeout: 15000 // Timeout adequado para uma API crítica
    });
    
    try {
      // Primeira tentativa: URL principal
      const response = await instance.get(
        'https://alertablu.blumenau.sc.gov.br/static/data/situacao_atual.json',
        { 
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Proxy: Resposta recebida com sucesso');
      return NextResponse.json(response.data, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      });
    } catch (primaryError) {
      console.log('Proxy: Erro na URL principal, tentando URL alternativa');
      console.error(primaryError);
      
      // Se falhar, retornar um erro estruturado
      return NextResponse.json(
        { 
          erro: true, 
          mensagem: 'Não foi possível obter dados atualizados do sistema AlertaBlu.',
          codigoErro: 'API_INDISPONIVEL',
          dataHora: new Date().toISOString()
        }, 
        { 
          status: 503, // Service Unavailable
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          }
        }
      );
    }
  } catch (error) {
    console.error('Proxy: Erro ao buscar dados da API externa:', error);
    
    // Tentar fornecer informações mais úteis sobre o erro
    let mensagemErro = 'Falha ao buscar dados da API externa';
    let codigoErro = 'ERRO_DESCONHECIDO';
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        mensagemErro = 'Tempo limite excedido ao tentar obter dados atualizados.';
        codigoErro = 'TIMEOUT';
      } else if (error.response) {
        mensagemErro = `Erro ${error.response.status} ao obter dados do AlertaBlu.`;
        codigoErro = `HTTP_${error.response.status}`;
      } else if (error.request) {
        mensagemErro = 'Não foi possível conectar ao servidor do AlertaBlu.';
        codigoErro = 'CONEXAO_FALHOU';
      }
    }
    
    return NextResponse.json(
      { 
        erro: true, 
        mensagem: mensagemErro,
        codigoErro: codigoErro,
        dataHora: new Date().toISOString(),
        contatoDefesaCivil: '199'
      }, 
      { 
        status: 503, // Service Unavailable
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }
}