// "Meu bairro": nível de cada tipo de alerta na região do bairro e a chuva na região.
import { useState } from 'react';
import type { Dados } from '../lib/dados.ts';
import { formatarMm } from '../lib/formato.ts';
import { NIVEIS, piorNivel } from '../lib/niveis.ts';
import { useMeuBairro } from '../lib/preferencias.ts';
import { alertasDaRegiao, chuvaDaRegiao, regiaoDoBairro } from '../lib/regioes.ts';
import { IconeLapis, IconeMapa } from './Icones.tsx';
import { SeletorBairro } from './SeletorBairro.tsx';
import { Cartao, SeloNivel } from './ui.tsx';

export function CartaoMeuBairro({ dados }: { dados: Dados }) {
  const [bairro, setBairro] = useMeuBairro();
  const [escolhendo, setEscolhendo] = useState(false);
  const regiao = regiaoDoBairro(dados.situacao, bairro);
  const alertas = regiao ? alertasDaRegiao(dados.situacao, regiao) : [];
  const nivel = piorNivel(alertas.map((a) => a.nivel));
  const chuva = chuvaDaRegiao(dados.chuva?.regioes, regiao);

  const seletor = <SeletorBairro aberto={escolhendo} situacao={dados.situacao} atual={bairro} onEscolher={setBairro} onFechar={() => setEscolhendo(false)} />;

  if (!bairro || !regiao) {
    return (
      <Cartao className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-marca-suave text-marca">
          <IconeMapa />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{bairro ? `Não achei "${bairro}" nas regiões` : 'Veja o seu bairro primeiro'}</h2>
          <p className="text-sm text-texto-2">Escolha o bairro para ver o nível da sua região logo ao abrir.</p>
        </div>
        <button type="button" onClick={() => setEscolhendo(true)} className="min-h-11 shrink-0 rounded-xl bg-marca px-4 text-sm font-semibold text-white dark:text-slate-900">
          Escolher
        </button>
        {seletor}
      </Cartao>
    );
  }

  return (
    <Cartao className={`border-l-4 ${NIVEIS[nivel].borda}`} aria-labelledby="titulo-meu-bairro" data-testid="cartao-meu-bairro">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-texto-3">Meu bairro · região {regiao}</p>
          <h2 id="titulo-meu-bairro" className="truncate text-xl font-bold">
            {bairro}
          </h2>
        </div>
        <button type="button" onClick={() => setEscolhendo(true)} className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-marca hover:bg-marca-suave" aria-label={`Trocar o bairro (agora: ${bairro})`}>
          <IconeLapis tamanho={16} />
          Trocar
        </button>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {alertas.map((a) => (
          <li key={a.tipo} className="flex items-center justify-between gap-3">
            <span className="text-sm text-texto-2">{a.nome}</span>
            <SeloNivel nivel={a.nivel} texto={a.condicao} />
          </li>
        ))}
      </ul>
      {chuva && (
        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-linha pt-3 text-center">
          <div>
            <dt className="text-xs text-texto-3">Chuva na última hora</dt>
            <dd className="text-lg font-semibold">{formatarMm(chuva.maximo.h01)}</dd>
          </div>
          <div>
            <dt className="text-xs text-texto-3">Chuva em 24 h</dt>
            <dd className="text-lg font-semibold">{formatarMm(chuva.maximo.h24)}</dd>
          </div>
        </dl>
      )}
      {seletor}
    </Cartao>
  );
}
