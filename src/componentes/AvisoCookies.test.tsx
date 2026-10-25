import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { abrirAvisoCookies, CHAVE_AVISO_COOKIES, VERSAO_AVISO_COOKIES } from '../lib/cookies.ts';
import { AvisoCookies } from './AvisoCookies.tsx';

const montar = () =>
  render(
    <MemoryRouter>
      <AvisoCookies />
    </MemoryRouter>,
  );

describe('aviso de cookies', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('aparece na primeira visita, só informa (sem "Aceitar") e aponta para a Política de Cookies', () => {
    montar();
    const aviso = screen.getByRole('dialog', { name: 'Só o essencial, sem rastreamento' });
    expect(aviso).toHaveTextContent('Não usamos cookies de publicidade');
    expect(screen.getByRole('link', { name: 'Política de Cookies' })).toHaveAttribute('href', '/cookies');
    expect(screen.queryByRole('button', { name: /aceitar/i })).toBeNull();
  });

  it('"Entendi" fecha e lembra; o rodapé reabre', () => {
    montar();
    fireEvent.click(screen.getByRole('button', { name: 'Entendi' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(localStorage.getItem(CHAVE_AVISO_COOKIES)).toBe(VERSAO_AVISO_COOKIES);
    act(() => abrirAvisoCookies());
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('não aparece para quem já viu esta versão', () => {
    localStorage.setItem(CHAVE_AVISO_COOKIES, VERSAO_AVISO_COOKIES);
    montar();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
