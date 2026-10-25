// Aviso de cookies. O BLUmet só guarda no aparelho o essencial (preferências, último dado e esta escolha) e não tem
// publicidade, análise de audiência nem rastreamento: o aviso informa e não pede um "aceito" que não ligaria nada.
// Algo opcional, se um dia entrar, só pode carregar depois de um consentimento real aqui (ver lib/cookies.ts).
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { avisoCookiesVisto, EVENTO_ABRIR_AVISO_COOKIES, marcarAvisoCookiesVisto } from '../lib/cookies.ts';
import { IconeFechar } from './Icones.tsx';

export function AvisoCookies() {
  const [aberto, setAberto] = useState(() => !avisoCookiesVisto());

  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener(EVENTO_ABRIR_AVISO_COOKIES, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_AVISO_COOKIES, abrir);
  }, []);

  if (!aberto) return null;

  const fechar = () => {
    marcarAvisoCookiesVisto();
    setAberto(false);
  };

  return (
    <aside
      role="dialog"
      aria-labelledby="aviso-cookies-titulo"
      aria-live="polite"
      data-testid="aviso-cookies"
      className="acima-das-abas fixed inset-x-3 z-40 mx-auto max-w-lg rounded-2xl border border-linha bg-superficie p-4 pr-12 shadow-lg lg:inset-x-auto lg:bottom-6 lg:right-6 lg:max-w-md"
    >
      <p id="aviso-cookies-titulo" className="font-semibold">
        Só o essencial, sem rastreamento
      </p>
      <p className="mt-1 text-sm text-texto-2">
        O BLUmet guarda no seu aparelho apenas o necessário para funcionar: seu bairro, o tema, o último dado (para abrir sem internet) e esta escolha. Não usamos cookies de publicidade, de análise nem de redes sociais.{' '}
        <Link to="/cookies" className="font-medium text-marca underline" onClick={fechar}>
          Política de Cookies
        </Link>
      </p>
      <button type="button" onClick={fechar} className="mt-3 min-h-11 w-full rounded-xl bg-marca px-4 font-semibold text-white sm:w-auto dark:text-slate-900">
        Entendi
      </button>
      <button type="button" onClick={fechar} aria-label="Fechar aviso" className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full text-texto-3 hover:bg-superficie-2">
        <IconeFechar tamanho={18} />
      </button>
    </aside>
  );
}
