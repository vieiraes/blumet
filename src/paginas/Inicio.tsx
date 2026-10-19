import { AvisoOficial } from '../componentes/AvisoOficial.tsx';
import { CartaoMeuBairro } from '../componentes/CartaoMeuBairro.tsx';
import { CartaoRio } from '../componentes/CartaoRio.tsx';
import { ComDados } from '../componentes/ComDados.tsx';
import { IconeAbrigo } from '../componentes/Icones.tsx';
import { ListaRegioes } from '../componentes/ListaRegioes.tsx';
import { Previsao } from '../componentes/Previsao.tsx';
import { FonteForaDoAr, TituloSecao } from '../componentes/ui.tsx';
import { Link } from 'react-router';
import { formatarDiaHora } from '../lib/formato.ts';
import { NIVEIS } from '../lib/niveis.ts';
import { useMeuBairro } from '../lib/preferencias.ts';
import { nivelDaCidade, regiaoDoBairro } from '../lib/regioes.ts';

export function Inicio() {
  const [bairro] = useMeuBairro();
  return (
    <ComDados>
      {(d) => {
        const nivel = nivelDaCidade(d.situacao);
        const abertos = d.abrigos.filter((a) => a.aberto).length;
        return (
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
            <h1 className="sr-only">BLUmet: situação de Blumenau agora</h1>
            <div className="flex flex-col gap-4 lg:col-span-2">
              <AvisoOficial aviso={d.aviso} />
              {abertos > 0 && (
                <Link to="/abrigos" className="flex items-center gap-3 rounded-2xl bg-red-600 p-4 font-semibold text-white" data-testid="faixa-abrigos">
                  <IconeAbrigo />
                  {abertos === 1 ? '1 abrigo aberto' : `${abertos} abrigos abertos`} · ver onde
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <CartaoMeuBairro dados={d} />
              {d.rio ? <CartaoRio rio={d.rio} /> : <FonteForaDoAr nome="Nível do rio" />}
              <Previsao periodos={d.previsao} temperatura={d.temperatura} />
            </div>
            <div>
              <TituloSecao acao={<span className={`text-xs font-semibold ${nivel > 1 ? 'text-red-700 dark:text-red-300' : 'text-texto-3'}`}>Cidade: {NIVEIS[nivel].nome}</span>}>Regiões de Blumenau</TituloSecao>
              {d.situacao ? <ListaRegioes situacao={d.situacao} regiaoDestacada={regiaoDoBairro(d.situacao, bairro)} /> : <FonteForaDoAr nome="Situação por região" />}
              {d.situacao?.atualizadoEm && <p className="mt-2 px-1 text-xs text-texto-3">Situação publicada pela Defesa Civil em {formatarDiaHora(d.situacao.atualizadoEm)}.</p>}
            </div>
          </div>
        );
      }}
    </ComDados>
  );
}
