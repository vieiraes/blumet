// Moldura do app: cabeçalho com o estado dos dados, conteúdo, rodapé e a barra de abas (embaixo no
// celular, lateral em tela larga).
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { IconeAbrigo, IconeGota, IconeInicio, IconeMais, IconeRio } from './Icones.tsx';
import { SeloAtualizacao } from './SeloAtualizacao.tsx';
import { AtualizacaoApp } from './AtualizacaoApp.tsx';
import { Logo } from './Logo.tsx';
import { Rodape } from './Rodape.tsx';

const ABAS: { para: string; rotulo: string; nome?: string; Icone: typeof IconeInicio }[] = [
  { para: '/', rotulo: 'Início', Icone: IconeInicio },
  { para: '/rio', rotulo: 'Rio', Icone: IconeRio },
  { para: '/chuva', rotulo: 'Chuva', Icone: IconeGota },
  { para: '/abrigos', rotulo: 'Abrigos', Icone: IconeAbrigo },
  { para: '/mais', rotulo: 'Mais', nome: 'Mais: telefones, notícias e preferências', Icone: IconeMais },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-6xl lg:grid lg:grid-cols-[220px_1fr] lg:gap-8 lg:px-6">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-superficie focus:px-3 focus:py-2">
        Pular para o conteúdo
      </a>

      {/* Navegação lateral (tela larga) */}
      <aside className="hidden lg:block">
        <div className="sticky top-0 flex flex-col gap-6 py-6">
          <Logo />
          <nav aria-label="Seções">
            <ul className="flex flex-col gap-1">
              {ABAS.map(({ para, rotulo, nome, Icone }) => (
                <li key={para}>
                  <NavLink to={para} end={para === '/'} aria-label={nome} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors ${isActive ? 'bg-marca-suave text-marca-forte' : 'text-texto-2 hover:bg-superficie-2'}`}>
                    <Icone />
                    {rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="pt-seguro sticky top-0 z-20 border-b border-linha/70 bg-fundo/85 backdrop-blur-md lg:border-0">
          <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-0">
            <span className="lg:hidden">
              <Logo />
            </span>
            <SeloAtualizacao />
          </div>
        </header>
        <AtualizacaoApp />
        <main id="conteudo" className="px-4 pt-3 lg:px-0">
          {children}
        </main>
        <div className="pb-seguro px-4 lg:px-0 lg:pb-4">
          <Rodape />
        </div>
      </div>

      {/* Barra de abas (celular) */}
      <nav aria-label="Seções" className="base-segura fixed inset-x-0 bottom-0 z-30 border-t border-linha bg-superficie/95 backdrop-blur-md lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {ABAS.map(({ para, rotulo, nome, Icone }) => (
            <li key={para}>
              <NavLink to={para} end={para === '/'} aria-label={nome} className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${isActive ? 'text-marca' : 'text-texto-3'}`}>
                {({ isActive }) => (
                  <>
                    <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-marca-suave' : ''}`}>
                      <Icone tamanho={21} />
                    </span>
                    {rotulo}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
