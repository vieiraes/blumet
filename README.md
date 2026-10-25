# BLUmet

Chuva, rio e alertas de Blumenau no celular, com os dados oficiais da Defesa Civil.

**No ar:** https://blumet.web.app (instalável como app: no celular, "Adicionar à tela inicial").

## O que mostra

| Aba | Conteúdo |
|---|---|
| **Início** | Aviso oficial em vigor; abrigos abertos; **meu bairro** (nível de cada tipo de alerta na região e chuva de 1 h / 24 h); rio agora com tendência; previsão; as 5 regiões com o pior nível de cada uma |
| **Rio** | Nível oficial do Itajaí-Açu em Blumenau, variação em 1 h e 3 h, gráfico de 24 h com as faixas (Observação 3 m, Atenção 4 m, Alerta 6 m, Alerta Máximo 8 m), o que fazer em cada faixa e as leituras por hora |
| **Chuva** | Maior acumulado por região (1 h, 24 h, 72 h, 7 dias) e cada estação; separado, a chuva rio acima, na bacia do Itajaí-Açu |
| **Abrigos** | Os 59 abrigos, abertos primeiro, com busca por bairro, **Ligar** e **Como chegar** |
| **Mais** | Telefones de emergência, preferências (meu bairro, tema claro/escuro), situação de cada fonte, notícias da Defesa Civil |

Os dados se atualizam a cada 2 minutos com o app aberto. O último resultado fica no aparelho: sem internet, o app abre com ele e avisa de quando é.

O BLUmet não é um canal oficial. Em emergência, ligue **199** (Defesa Civil).

No rodapé de todas as telas: Política de Privacidade (`/privacidade`), Termos de Uso (`/termos`), Política de Cookies (`/cookies`) e o aviso de cookies (só armazenamento essencial, sem rastreamento).

## Fontes

Arquivos públicos do portal da Defesa Civil de Blumenau (`https://defesacivil.blumenau.sc.gov.br/static/data/`):

| Arquivo | Uso |
|---|---|
| `situacao_atual.json` | Situação por região e tipo de alerta (condições meteorológicas, risco de deslizamento…) |
| `nivel_oficial.json` | Nível do rio, 24 leituras horárias, e as faixas de alerta |
| `previsao.json` | Previsão por período |
| `chuva.json` | Acumulados das estações (AlertaBlu, Cemaden, Defesa Civil de SC e outras) |
| `abrigos.json` | Abrigos, situação, endereço, telefone e localização |
| `aviso.json` | Aviso oficial em vigor (`null` quando não há) |
| `noticias.json` | Notícias da Defesa Civil |
| `temperaturas.json` | Temperatura por hora |

O servidor da prefeitura não envia o certificado intermediário da cadeia TLS. A function confia nesse intermediário público (Sectigo DV R36, em `functions/src/certificados.ts`) em vez de desligar a verificação.

## Arquitetura

- **App** (raiz): Vite, React 19, TypeScript, Tailwind 4, TanStack Query (com o último dado salvo no aparelho), react-router e PWA (`vite-plugin-pwa`). Mobile first: barra de abas embaixo no celular, lateral em tela larga.
- **Function** (`functions/`): Firebase Function `dados` (Node 22, `southamerica-east1`) em `GET /api/dados`. Busca as 8 fontes em paralelo, normaliza tudo num JSON só (`functions/src/tipos.ts`) e guarda por 60 s. Uma fonte fora do ar não derruba as outras (`fontes.<nome>.ok = false`). O CDN do Hosting segura a resposta por 2 min.
- **Hosting**: Firebase, projeto `blumet`. `/api/dados` vai para a function; o resto é o app (SPA).

```
functions/src/fontes.ts       busca com TLS verificado
functions/src/normalizar.ts   funções puras: bruto → formato do app
functions/src/agregador.ts    junta tudo (montarDados) e guarda 60 s (obterDados)
functions/src/index.ts        a Firebase Function
src/lib/                      dados (Query), níveis e cores, regiões, formato, preferências
src/componentes/, src/paginas/
tests/fixtures/normal|alerta  respostas reais gravadas e o cenário de alerta
```

## Desenvolvimento

Requer Node 22.18 ou mais novo.

```bash
npm install && npm install --prefix functions
npm run dev          # localhost:5373, com os dados reais (o Vite roda o mesmo código da function)
npm run dev:mock     # com as respostas gravadas (tests/fixtures/normal)
npm run dev:alerta   # cenário de alerta: rio a 6,5 m, região Sul em Alerta, abrigos abertos, aviso
```

Atualizar as respostas gravadas: `npm --prefix functions run gravar-fixtures` e, depois, `npm --prefix functions run cenario-alerta`.

## Testes

```bash
npm run lint && npm run typecheck
npm test                       # app (Vitest)
npm --prefix functions test    # normalização com as fontes reais e o cenário de alerta
npm run build && npm run test:e2e   # Playwright em iPhone 13 e Pixel 7, inclusive offline
```

O CI (`.github/workflows/ci.yml`) roda tudo isso a cada push e pull request.

## Publicar

```bash
npm run deploy    # build do app e da function, depois firebase deploy --only functions:dados,hosting
```

Ícones do app: `npm run icones` (gera a partir de `public/logo.svg`).

---

Criado por Bruno da Silva Vieira.
