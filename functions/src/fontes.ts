// Busca dos arquivos JSON públicos da Defesa Civil de Blumenau, com a verificação de TLS ligada.
import { request } from 'node:https';
import { CAS_CONFIAVEIS } from './certificados.ts';

export const BASE_FONTES = 'https://defesacivil.blumenau.sc.gov.br/static/data';

/** Arquivos lidos a cada atualização (nome do arquivo, sem .json). */
export const ARQUIVOS = ['situacao_atual', 'nivel_oficial', 'previsao', 'chuva', 'abrigos', 'aviso', 'noticias', 'temperaturas'] as const;
export type Arquivo = (typeof ARQUIVOS)[number];

const TEMPO_LIMITE_MS = 8000;

/** GET de um JSON, seguindo até 3 redirecionamentos. Rejeita com mensagem curta em português. */
export function buscarJson(url: string, redirecionamentos = 3): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = request(url, { ca: CAS_CONFIAVEIS, headers: { Accept: 'application/json', 'User-Agent': 'BLUmet (blumet.web.app)' }, timeout: TEMPO_LIMITE_MS }, (res) => {
      const status = res.statusCode ?? 0;
      if (status >= 300 && status < 400 && res.headers.location && redirecionamentos > 0) {
        res.resume();
        resolve(buscarJson(new URL(res.headers.location, url).href, redirecionamentos - 1));
        return;
      }
      if (status !== 200) {
        res.resume();
        reject(new Error(`a fonte respondeu ${status}`));
        return;
      }
      const partes: Buffer[] = [];
      res.on('data', (p: Buffer) => partes.push(p));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(partes).toString('utf8')));
        } catch {
          reject(new Error('a fonte devolveu um JSON inválido'));
        }
      });
      res.on('error', () => reject(new Error('a conexão caiu no meio da resposta')));
    });
    req.on('timeout', () => req.destroy(new Error(`a fonte não respondeu em ${TEMPO_LIMITE_MS / 1000} s`)));
    req.on('error', (e) => reject(new Error(e.message || 'falha de conexão')));
    req.end();
  });
}

export type Brutos = { [A in Arquivo]: { ok: true; dados: unknown } | { ok: false; erro: string } };

/** Busca todos os arquivos em paralelo; a falha de um não derruba os outros. */
export async function buscarTodos(buscar: (url: string) => Promise<unknown> = buscarJson): Promise<Brutos> {
  const resultados = await Promise.allSettled(ARQUIVOS.map((a) => buscar(`${BASE_FONTES}/${a}.json`)));
  return Object.fromEntries(
    ARQUIVOS.map((a, i) => {
      const r = resultados[i];
      if (r?.status === 'fulfilled') return [a, { ok: true, dados: r.value }];
      return [a, { ok: false, erro: (r?.reason as Error | undefined)?.message ?? 'erro desconhecido' }];
    }),
  ) as Brutos;
}
