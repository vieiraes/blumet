// Junta as fontes num JSON só (tipos.ts). A função pura `montarDados` é a que os testes cobrem;
// `obterDados` busca na rede e guarda o resultado por 60 s na memória da instância.
import { buscarTodos, type Arquivo, type Brutos } from './fontes.ts';
import { normalizarAbrigos, normalizarAviso, normalizarChuva, normalizarNoticias, normalizarPrevisao, normalizarRio, normalizarSituacao, normalizarTemperatura } from './normalizar.ts';
import type { Dados, SituacaoFonte } from './tipos.ts';

export function montarDados(brutos: Brutos, agora: Date): Dados {
  const dado = (a: Arquivo) => (brutos[a].ok ? brutos[a].dados : undefined);
  const situacao = normalizarSituacao(dado('situacao_atual'));
  const rio = normalizarRio(dado('nivel_oficial'));
  const chuva = normalizarChuva(dado('chuva'), agora);
  const temperatura = normalizarTemperatura(dado('temperaturas'));
  const atualizadoEm: Partial<Record<Arquivo, string | null>> = {
    situacao_atual: situacao?.atualizadoEm ?? null,
    nivel_oficial: rio?.atual?.em ?? null,
    chuva: chuva?.atualizadoEm ?? null,
    temperaturas: temperatura?.em ?? null,
  };
  const fontes: Record<string, SituacaoFonte> = Object.fromEntries(
    (Object.keys(brutos) as Arquivo[]).map((a) => {
      const b = brutos[a];
      return [a, b.ok ? { ok: true, atualizadoEm: atualizadoEm[a] ?? null } : { ok: false, erro: b.erro }];
    }),
  );
  return {
    geradoEm: agora.toISOString(),
    fontes,
    situacao,
    rio,
    previsao: normalizarPrevisao(dado('previsao')),
    chuva,
    abrigos: normalizarAbrigos(dado('abrigos')),
    aviso: normalizarAviso(dado('aviso')),
    noticias: normalizarNoticias(dado('noticias')),
    temperatura,
  };
}

const VALIDADE_MS = 60_000;
let guardado: { em: number; dados: Promise<Dados> } | null = null;

/** Dados de no máximo 60 s atrás. Pedidos simultâneos compartilham a mesma busca. */
export function obterDados(buscar?: Parameters<typeof buscarTodos>[0]): Promise<Dados> {
  const agora = Date.now();
  if (guardado && agora - guardado.em < VALIDADE_MS) return guardado.dados;
  const dados = buscarTodos(buscar).then((b) => montarDados(b, new Date()));
  guardado = { em: agora, dados };
  dados.catch(() => (guardado = null));
  return dados;
}
