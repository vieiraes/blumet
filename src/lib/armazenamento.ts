// localStorage com try/catch: em aba anônima ou com o armazenamento bloqueado, o app segue sem lembrar.
export function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravar(chave: string, valor: string | null) {
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {
    /* sem armazenamento: só não lembra */
  }
}
