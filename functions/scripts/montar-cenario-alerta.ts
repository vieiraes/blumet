// Monta tests/fixtures/alerta/ a partir de tests/fixtures/normal/: rio a 6,5 m e subindo, Sul em Alerta (4),
// Central em Atenção (3), chuva forte no Sul, 3 abrigos abertos e um aviso oficial. Serve para ver e testar os
// estados críticos sem esperar uma enchente. Uso: npm --prefix functions run cenario-alerta
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const origem = new URL('../../tests/fixtures/normal/', import.meta.url);
const destino = new URL('../../tests/fixtures/alerta/', import.meta.url);
mkdirSync(destino, { recursive: true });
const ler = (f: string) => JSON.parse(readFileSync(new URL(f, origem), 'utf8'));
const gravar = (f: string, d: unknown) => writeFileSync(new URL(f, destino), JSON.stringify(d, null, 2) + '\n');
for (const f of readdirSync(origem)) gravar(f, ler(f));

const NIVEIS: Record<string, [number, string, string, string]> = {
  Sul: [4, 'Alerta', '#FF2222', '#FFFFFF'],
  Central: [3, 'Atenção', '#FF9622', '#000000'],
  Oeste: [2, 'Observação', '#FAFA00', '#000000'],
};
const situacao = ler('situacao_atual.json');
for (const d of situacao.dados) {
  d.descricao = 'Chuva forte e persistente';
  for (const s of d.sitregioes) {
    const n = NIVEIS[s.regiao.nome];
    if (n && d.tipo === 'cch') Object.assign(s.condicao, { nivel: n[0], condicao: n[1], cor_fundo: n[2], cor_fonte: n[3] });
    if (d.tipo === 'pes' && s.regiao.nome === 'Sul') Object.assign(s.condicao, { nivel: 3, condicao: 'Atenção', cor_fundo: '#FF9622', cor_fonte: '#000000' });
  }
}
gravar('situacao_atual.json', situacao);

// Rio subindo nas 24 h até 6,5 m (faixa Alerta). No arquivo bruto a leitura mais nova é a última
const rio = ler('nivel_oficial.json');
const n = rio.niveis.length;
rio.niveis = rio.niveis.map((l: { horaLeitura: string }, i: number) => ({ ...l, nivel: Math.round((6.5 - ((n - 1 - i) / (n - 1)) ** 1.4 * 4.2) * 100) / 100 }));
gravar('nivel_oficial.json', rio);

const chuva = ler('chuva.json');
for (const e of chuva) if (e.regiao === 'Sul' && e.dados?.Variance) Object.assign(e.dados.Variance, { h01: 18.4, h03: 41.2, h24: 96.8, h72: 152.6, h168: 171 });
gravar('chuva.json', chuva);

const abrigos = ler('abrigos.json');
abrigos.slice(0, 3).forEach((a: { estado: string }) => (a.estado = 'Aberto'));
gravar('abrigos.json', abrigos);

gravar('aviso.json', { titulo: 'Alerta de cheia do rio Itajaí-Açu', texto: 'O rio deve passar de 7 m nas próximas horas. Moradores de áreas de risco: procurem um abrigo aberto. Em emergência, ligue 199.' });
console.log('cenário de alerta montado em tests/fixtures/alerta/');
