import { expect, test } from '@playwright/test';

const NORMAL = 'http://localhost:5374';

test('aviso de cookies: só informa, "Entendi" fecha e lembra, o rodapé reabre', async ({ page }) => {
  await page.goto(NORMAL);
  const aviso = page.getByTestId('aviso-cookies');
  await expect(aviso).toContainText('Só o essencial, sem rastreamento');
  await expect(aviso.getByRole('button', { name: /aceitar/i })).toHaveCount(0);
  await aviso.getByRole('button', { name: 'Entendi' }).click();
  await expect(aviso).toBeHidden();
  await page.reload();
  await expect(page.getByTestId('cartao-rio')).toBeVisible();
  await expect(aviso).toBeHidden();
  await page.getByTestId('rodape').getByRole('button', { name: 'Preferências de cookies' }).click();
  await expect(aviso).toBeVisible();
});

test('rodapé: colunas, linha legal e sem rolagem lateral no celular', async ({ page }) => {
  await page.goto(NORMAL);
  await page.getByTestId('aviso-cookies').getByRole('button', { name: 'Entendi' }).click();
  const rodape = page.getByTestId('rodape');
  await rodape.scrollIntoViewIfNeeded();
  await expect(rodape.getByRole('link', { name: 'contato@appleads.com.br' })).toHaveAttribute('href', 'mailto:contato@appleads.com.br');
  for (const coluna of ['Telas', 'Emergência', 'Privacidade']) await expect(rodape.getByRole('navigation', { name: coluna })).toBeVisible();
  await expect(rodape).toContainText(`© ${new Date().getFullYear()} BLUmet · CNPJ 60.055.458/0001-70 · São Paulo/SP`);
  await expect(rodape).toContainText('Desenvolvido por AppLeads Tecnologia');
  // o rodapé fica inteiro acima da barra de abas
  const fimRodape = (await rodape.boundingBox())!;
  const barra = (await page.getByRole('navigation', { name: 'Seções' }).last().boundingBox())!;
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const depois = (await rodape.boundingBox())!;
  expect(depois.y + depois.height).toBeLessThanOrEqual(barra.y + 1);
  expect(fimRodape.width).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('páginas legais abrem pelo rodapé, com controlador e contato', async ({ page }) => {
  await page.goto(NORMAL);
  await page.getByTestId('aviso-cookies').getByRole('button', { name: 'Entendi' }).click();
  const rodape = page.getByTestId('rodape');
  await rodape.getByRole('link', { name: 'Política de Privacidade' }).click();
  await expect(page).toHaveURL(/\/privacidade$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Política de Privacidade' })).toBeVisible();
  await expect(page.locator('article')).toContainText('60.055.458/0001-70');
  await expect(page.locator('article')).toContainText('ANPD');
  await rodape.getByRole('link', { name: 'Termos de Uso' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Termos de Uso' })).toBeVisible();
  await expect(page.locator('article')).toContainText('Não é um canal oficial');
  await page.getByRole('navigation', { name: 'Documentos legais' }).getByRole('link', { name: 'Política de Cookies' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Política de Cookies' })).toBeVisible();
  await expect(page.getByRole('table', { name: 'Itens guardados no aparelho' })).toContainText('blumet:bairro');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Ver o aviso de cookies' }).click();
  await expect(page.getByTestId('aviso-cookies')).toBeVisible();
});

test('acesso direto a /cookies abre a página (sem cair na tela inicial)', async ({ page }) => {
  await page.goto(`${NORMAL}/cookies`);
  await expect(page.getByRole('heading', { level: 1, name: 'Política de Cookies' })).toBeVisible();
});
