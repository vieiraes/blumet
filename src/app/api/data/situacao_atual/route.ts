import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(
      'https://alertablu.blumenau.sc.gov.br/static/data/situacao_atual.json'
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados da API externa:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar dados' },
      { status: 500 }
    );
  }
}