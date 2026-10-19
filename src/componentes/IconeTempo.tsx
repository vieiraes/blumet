import type { PeriodoPrevisao } from '../../functions/src/tipos.ts';
import { IconeChuva, IconeNeblina, IconeNuvem, IconeSol, IconeSolNuvem, IconeTempestade } from './Icones.tsx';

const MAPA = { sol: IconeSol, 'sol-nuvem': IconeSolNuvem, nuvem: IconeNuvem, chuva: IconeChuva, tempestade: IconeTempestade, neblina: IconeNeblina };
const COR = { sol: 'text-amber-500', 'sol-nuvem': 'text-amber-500', nuvem: 'text-slate-400', chuva: 'text-sky-500', tempestade: 'text-violet-500', neblina: 'text-slate-400' };

export const IconeTempo = ({ icone, tamanho = 28 }: { icone: PeriodoPrevisao['icone']; tamanho?: number }) => {
  const I = MAPA[icone];
  return <I tamanho={tamanho} className={COR[icone]} />;
};
