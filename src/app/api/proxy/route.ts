import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    console.log('Proxy: Fazendo requisição para API externa');
    const response = await axios.get(
      'https://alertablu.blumenau.sc.gov.br/static/data/situacao_atual.json',
      { 
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BlumetApp/1.0)',
        }
      }
    );
    
    console.log('Proxy: Resposta recebida com sucesso');
    
    // Adiciona headers para evitar cache
    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error('Proxy: Erro ao buscar dados da API externa:', error);
    
    return NextResponse.json(
      { error: 'Falha ao buscar dados da API externa' },
      { status: 500 }
    );
  }
}