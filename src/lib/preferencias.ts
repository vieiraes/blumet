// Preferências do aparelho: o bairro da pessoa e o tema. Escolhidas de propósito (nunca como efeito de um filtro),
// guardadas no localStorage e compartilhadas entre os componentes por useSyncExternalStore.
import { useSyncExternalStore } from 'react';
import { gravar, ler } from './armazenamento.ts';

type Ouvinte = () => void;

function criarPreferencia<T extends string>(chave: string, padrao: T | null, aplicar?: (v: T | null) => void) {
  const ouvintes = new Set<Ouvinte>();
  let valor = (ler(chave) as T | null) ?? padrao;
  aplicar?.(valor);
  const definir = (novo: T | null) => {
    valor = novo;
    gravar(chave, novo);
    aplicar?.(novo);
    ouvintes.forEach((o) => o());
  };
  const inscrever = (o: Ouvinte) => {
    ouvintes.add(o);
    return () => ouvintes.delete(o);
  };
  const useValor = () => [useSyncExternalStore(inscrever, () => valor, () => padrao), definir] as const;
  return { useValor, definir, atual: () => valor };
}

export const meuBairro = criarPreferencia<string>('blumet:bairro', null);

export type Tema = 'sistema' | 'claro' | 'escuro';
const escuroNoSistema = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
const aplicarTema = (t: Tema | null) => {
  if (typeof document === 'undefined') return;
  const escuro = t === 'escuro' || ((t ?? 'sistema') === 'sistema' && escuroNoSistema());
  document.documentElement.classList.toggle('dark', escuro);
};
export const tema = criarPreferencia<Tema>('blumet:tema', 'sistema', aplicarTema);

// Quem segue o sistema troca junto quando o sistema troca
if (typeof matchMedia !== 'undefined') {
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => aplicarTema(tema.atual()));
}

export const useMeuBairro = meuBairro.useValor;
export const useTema = tema.useValor;
