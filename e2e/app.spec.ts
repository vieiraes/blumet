import { expect, test } from '@playwright/test';

const NORMAL = 'http://localhost:5374';
const ALERTA = 'http://localhost:5376';

test('escolher o bairro mostra o cartão da região e fica salvo', async ({ page }) => {
  await page.goto(NORMAL);
  await expect(page.getByTestId('cartao-rio')).toBeVisible();
  await page.getByRole('button', { name: 'Escolher' }).click();
  const folha = page.getByRole('dialog', { name: 'Qual é o seu bairro?' });
  await folha.getByRole('textbox', { name: 'Buscar bairro' }).fill('garc');
  await folha.getByRole('button', { name: 'Garcia' }).click();
  const cartao = page.getByTestId('cartao-meu-bairro');
  await expect(cartao).toContainText('Garcia');
  await expect(cartao).toContainText('região Sul');
  await page.reload();
  await expect(page.getByTestId('cartao-meu-bairro')).toContainText('Garcia');
});

test('as cinco abas abrem pela barra de baixo', async ({ page }) => {
  await page.goto(NORMAL);
  const barra = page.getByRole('navigation', { name: 'Seções' }).last();
  await barra.getByRole('link', { name: 'Rio' }).click();
  await expect(page.getByRole('heading', { name: 'Rio Itajaí-Açu' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Nível do rio nas últimas/ })).toBeVisible();
  await barra.getByRole('link', { name: 'Chuva' }).click();
  await expect(page.getByRole('heading', { name: 'Chuva' })).toBeVisible();
  await page.getByRole('radio', { name: '72 h' }).click();
  await expect(page.getByRole('radio', { name: '72 h' })).toHaveAttribute('aria-checked', 'true');
  await barra.getByRole('link', { name: 'Abrigos' }).click();
  await expect(page.getByRole('heading', { name: 'Abrigos' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Buscar por bairro ou nome' }).fill('velha');
  await expect(page.getByRole('link', { name: /Como chegar/ }).first()).toBeVisible();
  await barra.getByRole('link', { name: 'Mais' }).click();
  await expect(page.getByRole('main').getByRole('link', { name: /199/ })).toHaveAttribute('href', 'tel:199');
  await expect(page.getByText('Fontes dos dados')).toBeVisible();
});

test('cenário de alerta: aviso, abrigos abertos e rio em Alerta', async ({ page }) => {
  await page.goto(ALERTA);
  await expect(page.getByTestId('aviso-oficial')).toContainText('Alerta de cheia');
  await expect(page.getByTestId('faixa-abrigos')).toContainText('3 abrigos abertos');
  await expect(page.getByTestId('cartao-rio')).toContainText('6,50 m');
  await expect(page.getByTestId('cartao-rio')).toContainText('Alerta');
  await page.getByTestId('faixa-abrigos').click();
  await expect(page.getByText('3 abrigos abertos agora')).toBeVisible();
});

test('sem conexão: abre com o último dado e avisa', async ({ page, context }) => {
  await page.goto(NORMAL);
  await expect(page.getByTestId('cartao-rio')).toBeVisible();
  // espera o service worker assumir a página (precache do app)
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect(page.getByTestId('cartao-rio')).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByTestId('cartao-rio')).toBeVisible();
  await expect(page.getByTestId('selo-atualizacao')).toContainText('Sem conexão');
  await context.setOffline(false);
});

test('tema escuro escolhido fica salvo', async ({ page }) => {
  await page.goto(`${NORMAL}/mais`);
  await page.getByRole('radio', { name: 'Escuro' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
});
