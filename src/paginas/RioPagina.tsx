import { ComDados } from '../componentes/ComDados.tsx';
import { Tendencia } from '../componentes/CartaoRio.tsx';
import { GraficoRio } from '../componentes/GraficoRio.tsx';
import { Cartao, FonteForaDoAr, SeloNivel, TituloSecao } from '../componentes/ui.tsx';
import { formatarHora, formatarMetros, formatarVariacao } from '../lib/formato.ts';
import { nivelDaFaixa } from '../lib/niveis.ts';

const O_QUE_FAZER: Record<string, string> = {
  Normalidade: 'Rio no leito normal. Siga acompanhando em dias de chuva.',
  'Observação': 'O rio começou a subir. Acompanhe as atualizações da Defesa Civil.',
  'Atenção': 'Áreas mais baixas podem alagar. Se você mora em área de risco, prepare documentos e remédios.',
  Alerta: 'Risco de enchente. Siga as orientações da Defesa Civil e veja os abrigos abertos.',
  'Alerta Máximo': 'Enchente. Saia das áreas de risco e procure um abrigo aberto. Emergência: 199.',
};

export function RioPagina() {
  return (
    <ComDados>
      {(d) => {
        const rio = d.rio;
        if (!rio?.atual) return <FonteForaDoAr nome="Nível do rio" />;
        const leituras = [...rio.leituras].reverse();
        return (
          <div className="flex flex-col gap-4">
            <h1 className="px-1 text-2xl font-bold">Rio Itajaí-Açu</h1>
            <Cartao>
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <div>
                  <p className="text-xs font-medium text-texto-3">Nível oficial em Blumenau · {formatarHora(rio.atual.em)}</p>
                  <p className="whitespace-nowrap text-5xl font-bold tabular-nums tracking-tight">{formatarMetros(rio.atual.nivel)}</p>
                </div>
                <SeloNivel nivel={nivelDaFaixa(rio.faixaAtual?.nome)} texto={rio.faixaAtual?.nome} grande />
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <Tendencia variacao={rio.variacao1h} />
                {rio.variacao3h != null && <span className="text-sm text-texto-2">Em 3 h: {formatarVariacao(rio.variacao3h)}</span>}
              </div>
              {rio.faixaAtual && <p className="mt-3 rounded-xl bg-superficie-2 p-3 text-sm">{O_QUE_FAZER[rio.faixaAtual.nome] ?? ''}</p>}
              <div className="mt-4">
                <GraficoRio leituras={rio.leituras} faixas={rio.faixas} />
              </div>
            </Cartao>

            <section aria-labelledby="titulo-faixas">
              <TituloSecao id="titulo-faixas">Faixas de alerta do rio</TituloSecao>
              <Cartao semEspaco>
                <ul className="divide-y divide-linha">
                  {[...rio.faixas].reverse().map((f) => (
                    <li key={f.nome} className={`flex items-center justify-between gap-3 px-4 py-3 ${rio.faixaAtual?.nome === f.nome ? 'bg-marca-suave/60' : ''}`}>
                      <SeloNivel nivel={nivelDaFaixa(f.nome)} texto={f.nome} />
                      <span className="text-sm font-medium tabular-nums">{f.aPartirDe === 0 ? 'abaixo de 3 m' : `a partir de ${f.aPartirDe} m`}</span>
                    </li>
                  ))}
                </ul>
              </Cartao>
            </section>

            <section aria-labelledby="titulo-leituras">
              <TituloSecao id="titulo-leituras">Leituras das últimas 24 h</TituloSecao>
              <Cartao semEspaco>
                <table className="w-full text-sm">
                  <caption className="sr-only">Nível do rio por hora, da mais recente para a mais antiga</caption>
                  <thead>
                    <tr className="text-left text-xs text-texto-3">
                      <th scope="col" className="px-4 py-2 font-medium">Hora</th>
                      <th scope="col" className="px-4 py-2 text-right font-medium">Nível</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-linha">
                    {leituras.map((l) => (
                      <tr key={l.em}>
                        <td className="px-4 py-2 text-texto-2">{formatarHora(l.em)}</td>
                        <td className="px-4 py-2 text-right font-medium tabular-nums">{formatarMetros(l.nivel)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Cartao>
            </section>
          </div>
        );
      }}
    </ComDados>
  );
}
