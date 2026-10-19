// Lê um cenário gravado em tests/fixtures/<nome>/ no formato de buscarTodos(), com o "agora" da gravação.
// Usado pelo `npm run dev:mock` / `dev:alerta` (vite.config.ts) e pelos testes.
import { existsSync, readFileSync } from 'node:fs';
import { ARQUIVOS, type Brutos } from '../src/fontes.ts';

export function carregarCenario(nome: string): { brutos: Brutos; agora: Date } {
  const dir = new URL(`../../tests/fixtures/${nome}/`, import.meta.url);
  if (!existsSync(dir)) throw new Error(`cenário desconhecido: ${nome} (use normal ou alerta)`);
  const brutos = Object.fromEntries(
    ARQUIVOS.map((a) => {
      const f = new URL(`${a}.json`, dir);
      return [a, existsSync(f) ? { ok: true, dados: JSON.parse(readFileSync(f, 'utf8')) } : { ok: false, erro: 'sem fixture' }];
    }),
  ) as Brutos;
  const agora = new Date(JSON.parse(readFileSync(new URL('_agora.json', dir), 'utf8')).agora);
  return { brutos, agora };
}
