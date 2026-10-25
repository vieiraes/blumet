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
- **LGPD**: dados do controlador (CNPJ 60.055.458/0001-70, São Paulo/SP, contato e encarregado `contato@appleads.com.br`, desenvolvido pela AppLeads Tecnologia) num lugar só, `src/lib/legal.ts`. Páginas `/privacidade`, `/termos` e `/cookies` em `src/paginas/LegalPagina.tsx`; rodapé `Rodape` no fim de todas as telas. O app não tem cadastro nem formulário: os textos citam o que existe de verdade (preferências e último dado só no aparelho, registros de acesso do Firebase/Google, imagens das notícias vindas de www.blumenau.sc.gov.br). Entrou fornecedor, dado guardado no aparelho ou link/embed de terceiro? Atualize as páginas e troque `VERSAO_LEGAL`. Cookies: só armazenamento essencial, por isso `AvisoCookies` informa ("Entendi") e não pede consentimento; algo opcional (analytics, pixel, vídeo, mapa embutido) só pode carregar depois de um "Aceitar" real, com opção de recusar e a Política de Cookies atualizada. Fontes do sistema, sem Google Fonts.
- Nada vai ao GitHub nem ao Firebase sem o Bruno pedir.

## Antes de commitar
`npm run lint && npm run typecheck && npm test && npm --prefix functions test && npm run build && npm run test:e2e`
