const { onRequest } = require('firebase-functions/v2/https');
const cors = require('cors')({ origin: true });
const fetch = require('node-fetch');
const https = require('https');

// Criar um agente HTTPS que ignora erros de certificado
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Função de API situação atual - sintaxe atualizada para v6
exports.situacaoAtual = onRequest({ 
  region: 'southamerica-east1',
  maxInstances: 10
}, async (req, res) => {
  console.log("Função situacaoAtual chamada", {
    path: req.path,
    method: req.method,
    headers: req.headers,
    ip: req.ip
  });

  return cors(req, res, async () => {
    try {
      // URL da API AlertaBlu
      const apiUrl = "https://alertablu.blumenau.sc.gov.br/static/data/situacao_atual.json";
      
      console.log("Acessando API externa:", apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        agent: httpsAgent  // Usar o agente que ignora erros de certificado
      });
      
      console.log("Resposta da API externa:", {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        throw new Error(`API respondeu com status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Dados obtidos com sucesso");
      
      // Responder com os dados obtidos
      res.set('Cache-Control', 'public, max-age=300'); // Cache por 5 minutos
      res.set('Access-Control-Allow-Origin', '*'); // Garantir CORS
      res.status(200).json(data);
    } catch (error) {
      console.error("Erro ao acessar a API:", error);
      res.status(500).json({ 
        erro: true, 
        mensagem: "Falha ao obter dados da API AlertaBlu",
        dataHora: new Date().toISOString(),
        codigoErro: "API_FETCH_ERROR",
        erro_detalhes: error.message
      });
    }
  });
});

// Função de API proxy - sintaxe atualizada para v6
exports.apiProxy = onRequest({
  region: 'southamerica-east1',
  maxInstances: 10
}, async (req, res) => {
  return cors(req, res, async () => {
    try {
      // Extrair o caminho da requisição após /api/
      const path = req.path.replace(/^\/?/, "");
      
      // URL base da API AlertaBlu
      const apiBaseUrl = "https://alertablu.blumenau.sc.gov.br/static";
      
      // URL da API completa
      const apiUrl = `${apiBaseUrl}/${path}`;
      
      console.log(`Fazendo proxy para: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: req.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        agent: httpsAgent  // Usar o agente que ignora erros de certificado
      });
      
      if (!response.ok) {
        throw new Error(`API respondeu com status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Responder com os dados obtidos
      res.set('Cache-Control', 'public, max-age=300'); // Cache por 5 minutos
      res.set('Access-Control-Allow-Origin', '*'); // Garantir CORS
      res.status(200).json(data);
    } catch (error) {
      console.error("Erro ao acessar a API:", error);
      res.status(500).json({ 
        erro: true, 
        mensagem: "Falha ao obter dados da API AlertaBlu",
        dataHora: new Date().toISOString(),
        codigoErro: "API_PROXY_ERROR"
      });
    }
  });
});
