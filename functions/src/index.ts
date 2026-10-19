// Firebase Function `dados` (GET /api/dados pelo rewrite do Hosting): as fontes da Defesa Civil num JSON só.
import { onRequest } from 'firebase-functions/v2/https';
import { obterDados } from './agregador.ts';

export const dados = onRequest({ region: 'southamerica-east1', maxInstances: 5, memory: '256MiB', timeoutSeconds: 30 }, async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.set('Allow', 'GET, HEAD').status(405).json({ erro: 'Use GET.' });
    return;
  }
  try {
    const dados = await obterDados();
    // O CDN do Hosting guarda por 2 min; o navegador por 1 min; depois disso serve o velho enquanto busca o novo
    res.set('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=600').status(200).json(dados);
  } catch (e) {
    console.error('falha ao montar os dados', (e as Error).message);
    res.set('Cache-Control', 'no-store').status(502).json({ erro: 'Não foi possível ler os dados da Defesa Civil agora.' });
  }
});
