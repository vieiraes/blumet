// Aviso de cookies: a chave guardada no aparelho e o evento que reabre o aviso (rodapé e Política de Cookies).
// O BLUmet só usa armazenamento essencial, então o aviso informa ("Entendi") e não pede consentimento.
// Se um dia entrar algo opcional (medição de audiência, vídeo, mapa embutido), ele só carrega depois de um "Aceitar" aqui.
import { gravar, ler } from './armazenamento.ts';

export const CHAVE_AVISO_COOKIES = 'blumet:aviso-cookies';
export const VERSAO_AVISO_COOKIES = '1';
export const EVENTO_ABRIR_AVISO_COOKIES = 'blumet:abrir-aviso-cookies';

export const avisoCookiesVisto = () => ler(CHAVE_AVISO_COOKIES) === VERSAO_AVISO_COOKIES;
export const marcarAvisoCookiesVisto = () => gravar(CHAVE_AVISO_COOKIES, VERSAO_AVISO_COOKIES);

export function abrirAvisoCookies() {
  window.dispatchEvent(new Event(EVENTO_ABRIR_AVISO_COOKIES));
}
