# BLUmet: regras do repositório

App mobile first (PWA) com os dados públicos da Defesa Civil de Blumenau. Visão geral, fontes e comandos no `README.md`.

## Regras
- **Comunicação, interface, código e commits em português (pt-BR).** Nomes de funções e variáveis também em português, como no resto do código.
- **Mobile first.** Desenhe para 360–430 px; tela larga é adaptação. Alvos de toque de 44 px ou mais. Teste em 390 px (claro e escuro) antes de dar por pronto.
- **Nunca desligar a verificação de TLS** (`rejectUnauthorized: false`). Se a cadeia da prefeitura mudar, atualize o intermediário em `functions/src/certificados.ts`.
- **O app só conhece `functions/src/tipos.ts`**, e só como tipo (`import type`). Toda conversão de dado bruto fica em `functions/src/normalizar.ts`, com teste.
- **Cor nunca sozinha:** nível sempre com texto. A paleta única é `src/lib/niveis.ts`; as cores da Defesa Civil não são usadas para texto.
- **Fonte fora do ar não quebra a tela:** cada parte trata o seu `null`/lista vazia e mostra `FonteForaDoAr`.
- **Preferências só por escolha da pessoa** (meu bairro, tema), em `src/lib/preferencias.ts`. Nada vira preferência como efeito colateral.
- Nada vai ao GitHub nem ao Firebase sem o Bruno pedir.

## Antes de commitar
`npm run lint && npm run typecheck && npm test && npm --prefix functions test && npm run build && npm run test:e2e`
