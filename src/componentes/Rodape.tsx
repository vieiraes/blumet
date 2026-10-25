// Rodapé do app (fim de todas as telas): marca, seções, emergência, privacidade e a linha legal.
import { Link } from 'react-router';
import { EMPRESA } from '../lib/legal.ts';
import { IconeEmail } from './Icones.tsx';
import { Logo } from './Logo.tsx';

const ANO = new Date().getFullYear();

const SECOES = [
  { para: '/', rotulo: 'Início' },
  { para: '/rio', rotulo: 'Rio Itajaí-Açu' },
  { para: '/chuva', rotulo: 'Chuva' },
  { para: '/abrigos', rotulo: 'Abrigos' },
  { para: '/mais', rotulo: 'Telefones e notícias' },
];

const estiloLink = 'inline-flex min-h-9 items-center text-left text-texto-2 hover:text-marca hover:underline';

function Coluna({ titulo, children, className = '' }: { titulo: string; children: React.ReactNode; className?: string }) {
  return (
    <nav aria-label={titulo} className={className}>
      <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-texto-3">{titulo}</h2>
      <ul className="flex flex-col">{children}</ul>
    </nav>
  );
}

export function Rodape() {
  return (
    <footer data-testid="rodape" className="mt-10 border-t border-linha text-sm">
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 px-1 py-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" aria-label="BLUmet, início" className="inline-block">
            <Logo />
          </Link>
          <p className="mt-3 max-w-xs text-texto-2">Chuva, rio, alertas e abrigos de Blumenau no celular, com os dados oficiais da Defesa Civil.</p>
          <a href={`mailto:${EMPRESA.contato}`} className="mt-3 inline-flex min-h-9 items-center gap-2 font-medium text-marca hover:underline">
            <IconeEmail tamanho={18} />
            {EMPRESA.contato}
          </a>
        </div>
        <Coluna titulo="Telas">
          {SECOES.map((s) => (
            <li key={s.para}>
              <Link to={s.para} className={estiloLink}>
                {s.rotulo}
              </Link>
            </li>
          ))}
        </Coluna>
        <Coluna titulo="Emergência">
          <li>
            <a href="tel:199" className={estiloLink}>
              199 · Defesa Civil
            </a>
          </li>
          <li>
            <a href="tel:193" className={estiloLink}>
              193 · Bombeiros
            </a>
          </li>
          <li>
            <a href="https://defesacivil.blumenau.sc.gov.br/" target="_blank" rel="noopener noreferrer" className={estiloLink}>
              Site da Defesa Civil
            </a>
          </li>
        </Coluna>
        <Coluna titulo="Privacidade" className="col-span-2 lg:col-span-1">
          <li>
            <Link to="/privacidade" className={estiloLink}>
              Política de Privacidade
            </Link>
          </li>
          <li>
            <Link to="/termos" className={estiloLink}>
              Termos de Uso
            </Link>
          </li>
          <li>
            <Link to="/cookies" className={estiloLink}>
              Política de Cookies
            </Link>
          </li>
        </Coluna>
      </div>
      <div className="flex flex-col gap-1 border-t border-linha px-1 py-5 text-xs text-texto-3 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-6">
        <span>
          © {ANO} {EMPRESA.produto} · CNPJ {EMPRESA.cnpj} · {EMPRESA.cidade}
        </span>
        <span>Desenvolvido por {EMPRESA.desenvolvedora}</span>
      </div>
    </footer>
  );
}
