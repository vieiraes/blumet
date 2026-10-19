// Grava as respostas reais das fontes em ../tests/fixtures/normal/, para os testes e o `npm run dev:mock`.
// Uso: npm --prefix functions run gravar-fixtures
import { mkdirSync, writeFileSync } from 'node:fs';
import { buscarTodos } from '../src/fontes.ts';

const destino = new URL('../../tests/fixtures/normal/', import.meta.url);
mkdirSync(destino, { recursive: true });
const brutos = await buscarTodos();
// Momento da gravação: o mock usa como "agora", senão as estações de chuva pareceriam paradas
writeFileSync(new URL('_agora.json', destino), JSON.stringify({ agora: new Date().toISOString() }) + '\n');
for (const [arquivo, r] of Object.entries(brutos)) {
  if (!r.ok) {
    console.error(`${arquivo}: ${r.erro}`);
    continue;
  }
  writeFileSync(new URL(`${arquivo}.json`, destino), JSON.stringify(r.dados, null, 2) + '\n');
  console.log(`${arquivo}: gravado`);
}
