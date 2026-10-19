import { useState } from 'react';
import { ComDados } from '../componentes/ComDados.tsx';
import { IconeLink, IconeLua, IconeSol, IconeTelefone } from '../componentes/Icones.tsx';
import { SeletorBairro } from '../componentes/SeletorBairro.tsx';
import { Cartao, TituloSecao } from '../componentes/ui.tsx';
import { useDados } from '../lib/dados.ts';
import { formatarDia, formatarDiaHora } from '../lib/formato.ts';
import { useMeuBairro, useTema, type Tema } from '../lib/preferencias.ts';

const TELEFONES = [
  { nome: 'Defesa Civil', numero: '199' },
  { nome: 'Bombeiros', numero: '193' },
  { nome: 'SAMU', numero: '192' },
  { nome: 'Polícia Militar', numero: '190' },
];

const NOMES_FONTES: Record<string, string> = {
  situacao_atual: 'Situação por região',
  nivel_oficial: 'Nível do rio',
  previsao: 'Previsão do tempo',
  chuva: 'Chuva por estação',
  abrigos: 'Abrigos',
  aviso: 'Aviso oficial',
  noticias: 'Notícias',
  temperaturas: 'Temperatura',
};

function Preferencias() {
  const [bairro, setBairro] = useMeuBairro();
  const [tema, setTema] = useTema();
  const [escolhendo, setEscolhendo] = useState(false);
  const { data } = useDados();
  const temas: { id: Tema; rotulo: string; Icone?: typeof IconeSol }[] = [
    { id: 'sistema', rotulo: 'Automático' },
    { id: 'claro', rotulo: 'Claro', Icone: IconeSol },
    { id: 'escuro', rotulo: 'Escuro', Icone: IconeLua },
  ];
  return (
    <section aria-labelledby="titulo-preferencias">
      <TituloSecao id="titulo-preferencias">Preferências</TituloSecao>
      <Cartao className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-texto-3">Meu bairro</p>
            <p className="font-semibold">{bairro ?? 'Não escolhido'}</p>
          </div>
          <button type="button" onClick={() => setEscolhendo(true)} className="min-h-11 rounded-xl bg-superficie-2 px-4 text-sm font-semibold" disabled={!data?.situacao}>
            {bairro ? 'Trocar' : 'Escolher'}
          </button>
          <SeletorBairro aberto={escolhendo} situacao={data?.situacao} atual={bairro} onEscolher={setBairro} onFechar={() => setEscolhendo(false)} />
        </div>
        <div>
          <p id="rotulo-tema" className="mb-2 text-sm text-texto-3">Tema</p>
          <div role="radiogroup" aria-labelledby="rotulo-tema" className="grid grid-cols-3 gap-1 rounded-xl bg-superficie-2 p-1">
            {temas.map(({ id, rotulo, Icone }) => (
              <button key={id} type="button" role="radio" aria-checked={tema === id} onClick={() => setTema(id)} className={`flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold ${tema === id ? 'bg-superficie shadow-sm' : 'text-texto-2'}`}>
                {Icone && <Icone tamanho={16} />}
                {rotulo}
              </button>
            ))}
          </div>
        </div>
      </Cartao>
    </section>
  );
}

export function MaisPagina() {
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start">
      <h1 className="sr-only">Mais</h1>
      <div className="flex flex-col gap-6">
        <section aria-labelledby="titulo-telefones">
          <TituloSecao id="titulo-telefones">Telefones de emergência</TituloSecao>
          <ul className="grid grid-cols-2 gap-2">
            {TELEFONES.map((t) => (
              <li key={t.numero}>
                <a href={`tel:${t.numero}`} className="flex min-h-16 items-center gap-3 rounded-2xl border border-linha bg-superficie px-4">
                  <IconeTelefone className="text-marca" />
                  <span>
                    <span className="block text-lg font-bold leading-none">{t.numero}</span>
                    <span className="text-xs text-texto-2">{t.nome}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <Preferencias />
        <ComDados>
          {(d) => (
            <section aria-labelledby="titulo-fontes">
              <TituloSecao id="titulo-fontes">Fontes dos dados</TituloSecao>
              <Cartao semEspaco>
                <ul className="divide-y divide-linha text-sm">
                  {Object.entries(d.fontes).map(([id, f]) => (
                    <li key={id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <span>{NOMES_FONTES[id] ?? id}</span>
                      {f.ok ? <span className="text-xs text-texto-3">{f.atualizadoEm ? formatarDiaHora(f.atualizadoEm) : id === 'aviso' && !d.aviso ? 'nenhum em vigor' : 'ok'}</span> : <span className="text-xs font-semibold text-red-700 dark:text-red-300">fora do ar</span>}
                    </li>
                  ))}
                </ul>
              </Cartao>
              <p className="mt-2 px-1 text-xs text-texto-3">
                Dados oficiais da{' '}
                <a className="underline" href="https://defesacivil.blumenau.sc.gov.br/" target="_blank" rel="noopener noreferrer">
                  Defesa Civil de Blumenau
                </a>
                , atualizados a cada 2 minutos enquanto o app está aberto. O BLUmet não é um canal oficial: em caso de dúvida, siga a Defesa Civil.
              </p>
            </section>
          )}
        </ComDados>
      </div>
      <div className="flex flex-col gap-6">
        <ComDados>
          {(d) =>
            d.noticias.length > 0 && (
              <section aria-labelledby="titulo-noticias">
                <TituloSecao id="titulo-noticias">Notícias da Defesa Civil</TituloSecao>
                <ul className="flex flex-col gap-3">
                  {d.noticias.map((n) => (
                    <li key={n.id}>
                      <a href={n.url} target="_blank" rel="noopener noreferrer" className="flex gap-3 rounded-2xl border border-linha bg-superficie p-3">
                        {n.imagem && <img src={n.imagem} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover" />}
                        <span className="min-w-0">
                          <span className="line-clamp-2 font-semibold leading-snug">{n.titulo}</span>
                          <span className="mt-1 line-clamp-2 text-sm text-texto-2">{n.resumo}</span>
                          <span className="mt-1 flex items-center gap-1 text-xs text-texto-3">
                            {formatarDia(n.publicadaEm)} <IconeLink tamanho={12} />
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )
          }
        </ComDados>
        <section aria-labelledby="titulo-sobre">
          <TituloSecao id="titulo-sobre">Sobre</TituloSecao>
          <Cartao className="text-sm text-texto-2">
            <p>O BLUmet reúne num lugar só, pensado para o celular, os dados públicos da Defesa Civil de Blumenau: situação por região, nível do rio Itajaí-Açu, chuva por estação, previsão, abrigos e avisos.</p>
            <p className="mt-2">
              Criado por Bruno de Oliveira Vieira.{' '}
              <a className="font-medium text-marca underline" href="https://github.com/vieiraes/blumet" target="_blank" rel="noopener noreferrer">
                Código no GitHub
              </a>
              .
            </p>
            <p className="mt-2 text-xs text-texto-3">Versão {__VERSAO__}</p>
          </Cartao>
        </section>
      </div>
    </div>
  );
}
