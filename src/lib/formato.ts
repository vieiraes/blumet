// Datas e números em pt-BR, no fuso de Blumenau (America/Sao_Paulo) independentemente do aparelho.
const FUSO = 'America/Sao_Paulo';

const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: FUSO });
const diaHora = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: FUSO });
const dia = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: FUSO });
const diaDaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', timeZone: FUSO });

export const formatarHora = (iso: string | null | undefined) => (iso ? hora.format(new Date(iso)) : '—');
export const formatarDiaHora = (iso: string | null | undefined) => (iso ? diaHora.format(new Date(iso)).replace(',', ' às') : '—');
export const formatarDia = (iso: string | null | undefined) => (iso ? dia.format(new Date(iso)).replace(/ de /g, ' ').replace('.', '') : '—');
export const formatarDiaDaSemana = (iso: string | null | undefined) => (iso ? diaDaSemana.format(new Date(iso)).replace('.', '') : '');

const metros = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const mm = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
export const formatarMetros = (n: number | null | undefined) => (n == null ? '—' : `${metros.format(n)} m`);
export const formatarMm = (n: number | null | undefined) => (n == null ? '—' : `${mm.format(n)} mm`);
export const formatarVariacao = (n: number | null | undefined) => (n == null ? '—' : `${n > 0 ? '+' : n < 0 ? '−' : ''}${metros.format(Math.abs(n))} m`);

/** "agora", "há 5 min", "há 2 h", "há 3 dias". */
export function haQuantoTempo(iso: string | null | undefined, agora = Date.now()): string {
  if (!iso) return '—';
  const min = Math.round((agora - Date.parse(iso)) / 60_000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 48) return `há ${h} h`;
  return `há ${Math.round(h / 24)} dias`;
}

/** Busca sem diferença de acento e caixa. */
export const semAcento = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
