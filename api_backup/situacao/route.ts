import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    console.log('Proxy: Iniciando requisição para API externa');
    const response = await axios.get(
      'https://alertablu.blumenau.sc.gov.br/static/data/situacao_atual.json'
    );
    console.log('Proxy: Dados recebidos com sucesso:', response.status);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Proxy: Erro ao buscar dados da API externa:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados' },
      { status: 500 }
    );
  }
}