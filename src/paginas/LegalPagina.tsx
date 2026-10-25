// Política de Privacidade, Termos de Uso e Política de Cookies (/privacidade, /termos, /cookies).
// O texto descreve o que o app faz hoje: entrou um fornecedor, um formulário, um dado guardado no aparelho ou algo
// opcional (analytics, vídeo, mapa embutido)? Atualize aqui e troque VERSAO_LEGAL em lib/legal.ts.
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { abrirAvisoCookies, CHAVE_AVISO_COOKIES } from '../lib/cookies.ts';
import { EMPRESA, VERSAO_LEGAL_EXTENSO } from '../lib/legal.ts';

export type TipoLegal = 'privacidade' | 'termos' | 'cookies';

const DOCUMENTOS: { tipo: TipoLegal; rota: string; titulo: string }[] = [
  { tipo: 'privacidade', rota: '/privacidade', titulo: 'Política de Privacidade' },
  { tipo: 'termos', rota: '/termos', titulo: 'Termos de Uso' },
  { tipo: 'cookies', rota: '/cookies', titulo: 'Política de Cookies' },
];

const Contato = () => <a href={`mailto:${EMPRESA.contato}`}>{EMPRESA.contato}</a>;
const Externo = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

function Identificacao() {
  const linhas: [string, ReactNode][] = [
    ['Serviço', `${EMPRESA.produto} (${EMPRESA.site})`],
    ['Controlador (CNPJ)', EMPRESA.cnpj],
    ['Sede', EMPRESA.cidade],
    ['Desenvolvimento e operação', EMPRESA.desenvolvedora],
    ['Contato e encarregado de dados (LGPD)', <Contato key="c" />],
  ];
  return (
    <dl className="legal-identificacao">
      {linhas.map(([rotulo, valor]) => (
        <div key={rotulo}>
          <dt>{rotulo}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function Privacidade() {
  return (
    <>
      <p>
        Esta política explica quais dados pessoais o {EMPRESA.produto} trata, para quê, com quem compartilha e como você exerce os seus direitos, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
      </p>
      <Identificacao />

      <h2>1. Em resumo</h2>
      <p>
        O {EMPRESA.produto} mostra dados públicos da Defesa Civil de Blumenau. Não tem cadastro, login, formulário nem pagamento, não pede seu nome, e-mail, telefone ou localização e não usa publicidade, análise de audiência ou rastreamento. O bairro que você escolhe fica só no seu aparelho.
      </p>

      <h2>2. Dados que tratamos</h2>
      <h3>Guardados só no seu aparelho</h3>
      <ul>
        <li>O bairro que você escolhe em "Meu bairro" e o tema (claro, escuro ou automático).</li>
        <li>O último conjunto de dados públicos recebido e os arquivos do app, para ele abrir rápido e funcionar sem internet.</li>
        <li>A informação de que você já viu o aviso de cookies.</li>
      </ul>
      <p>
        Esses itens não são enviados para nós nem para ninguém: o app pede os dados da Defesa Civil sempre do mesmo jeito, sem dizer qual bairro você escolheu. Detalhes na <Link to="/cookies">Política de Cookies</Link>.
      </p>
      <h3>Registros técnicos de acesso</h3>
      <p>
        Ao abrir o app, seu navegador busca as telas e os dados nos servidores do Google Firebase. Como em qualquer site, essa infraestrutura registra o endereço IP, a data e a hora, o endereço pedido e o tipo de navegador. Não juntamos esses registros a outros dados nem os usamos para identificar quem usa o app.
      </p>
      <h3>Imagens das notícias</h3>
      <p>
        Na tela Mais, as imagens das notícias da Defesa Civil são carregadas direto do site da Prefeitura de Blumenau (www.blumenau.sc.gov.br). Para entregá-las, o servidor da Prefeitura recebe o seu endereço IP e o tipo de navegador, sob as regras da própria Prefeitura.
      </p>
      <h3>Se você nos escrever</h3>
      <p>Se você mandar um e-mail para <Contato />, tratamos o seu endereço de e-mail e o que você escrever, só para responder.</p>

      <h2>3. Para que usamos e com qual base legal</h2>
      <ul>
        <li>
          <b>Entregar o app e os dados públicos, manter o serviço no ar e protegê-lo contra abuso</b> (legítimo interesse, art. 7º, IX): registros técnicos de acesso.
        </li>
        <li>
          <b>Responder a quem nos escreve e atender aos pedidos de titulares</b> (legítimo interesse, art. 7º, IX, e exercício de direitos, art. 18): e-mails recebidos.
        </li>
        <li>
          <b>Cumprir obrigações legais e ordens de autoridades</b> (art. 7º, II).
        </li>
      </ul>
      <p>Não vendemos dados, não usamos dados para publicidade e não montamos perfis.</p>

      <h2>4. Com quem compartilhamos</h2>
      <ul>
        <li>
          <b>Google (Firebase Hosting e Cloud Functions)</b>: entrega das telas do app e a função que busca e organiza os dados da Defesa Civil. A função roda em São Paulo; a rede de entrega do Firebase Hosting tem servidores em vários países.
        </li>
        <li>
          <b>Prefeitura de Blumenau</b>: recebe o endereço IP e o navegador de quem vê as imagens das notícias, como explicado acima. Os dados da Defesa Civil são buscados pelo nosso servidor, sem nenhum dado seu.
        </li>
        <li>
          <b>Autoridades públicas</b>, quando houver obrigação legal ou ordem judicial.
        </li>
      </ul>
      <p>
        Os botões "Ligar", "Como chegar" (Google Maps), os links para o site da Defesa Civil, para as notícias e para o código no GitHub levam você para fora do {EMPRESA.produto}. Nesses serviços valem as políticas de cada um.
      </p>

      <h2>5. Transferência internacional</h2>
      <p>
        A rede de entrega do Firebase Hosting pode processar os registros técnicos de acesso fora do Brasil. Essa transferência segue as garantias contratuais de proteção de dados do Google Cloud (art. 33, II, da LGPD), com conexão cifrada e controle de acesso.
      </p>

      <h2>6. Por quanto tempo guardamos</h2>
      <ul>
        <li>No seu aparelho: até você trocar a escolha, apagar os dados do site no navegador ou desinstalar o app.</li>
        <li>Registros técnicos de acesso: até 30 dias, o prazo padrão dos registros do Google Cloud.</li>
        <li>E-mails: pelo tempo necessário para responder e resolver o seu pedido.</li>
      </ul>

      <h2>7. Seus direitos</h2>
      <p>
        Pela LGPD (art. 18), você pode pedir: confirmação de que tratamos seus dados; acesso a eles; correção; anonimização, bloqueio ou eliminação do que for desnecessário; portabilidade; informação sobre com quem compartilhamos; e oposição a um tratamento feito com base no legítimo interesse.
      </p>
      <ul>
        <li>
          <b>O que fica no aparelho</b> você mesmo controla: troque o bairro e o tema na tela Mais, ou apague os dados do site {EMPRESA.site} nas configurações do navegador.
        </li>
        <li>
          <b>Os demais pedidos</b> são feitos por e-mail para <Contato />. Como o app não tem cadastro, podemos pedir informações (como a data e o horário do acesso) para localizar os registros.
        </li>
      </ul>
      <p>
        Respondemos em até 15 dias. Se não ficar satisfeito, você pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD), em <Externo href="https://www.gov.br/anpd">gov.br/anpd</Externo>.
      </p>

      <h2>8. Segurança</h2>
      <p>
        Toda conexão com o {EMPRESA.produto} é cifrada (HTTPS) e o servidor só aceita os dados da Defesa Civil com o certificado verificado. Como não há cadastro, não guardamos senhas nem dados de identificação. Nenhum sistema é totalmente imune; se houver um incidente que possa causar risco relevante, avisamos a ANPD e as pessoas afetadas.
      </p>

      <h2>9. Cookies</h2>
      <p>
        O app usa apenas armazenamento essencial no aparelho. Detalhes na <Link to="/cookies">Política de Cookies</Link>.
      </p>

      <h2>10. Crianças e adolescentes</h2>
      <p>O {EMPRESA.produto} é um serviço de utilidade pública aberto a todos. Ele não coleta dados de identificação de ninguém, inclusive de crianças e adolescentes.</p>

      <h2>11. Mudanças nesta política</h2>
      <p>Quando houver mudança relevante, atualizamos a data no topo desta página.</p>
    </>
  );
}

function Termos() {
  return (
    <>
      <p>
        Estes termos regem o uso do {EMPRESA.produto}. Ao usar o app, você concorda com eles e com a <Link to="/privacidade">Política de Privacidade</Link>.
      </p>
      <Identificacao />

      <h2>1. O serviço</h2>
      <p>
        O {EMPRESA.produto} reúne, num app pensado para o celular, os dados públicos da Defesa Civil de Blumenau: situação por região, nível do rio Itajaí-Açu, chuva por estação, previsão, abrigos, avisos e notícias. É gratuito e não exige cadastro.
      </p>

      <h2>2. Não é um canal oficial</h2>
      <ul>
        <li>
          O {EMPRESA.produto} não é da Defesa Civil nem da Prefeitura de Blumenau. Em emergência, ligue <a href="tel:199">199</a> (Defesa Civil) ou <a href="tel:193">193</a> (Bombeiros).
        </li>
        <li>Os dados vêm das fontes oficiais e podem chegar com atraso, ficar incompletos ou indisponíveis quando a fonte falha. O app mostra a hora de cada atualização e avisa quando uma fonte está fora do ar.</li>
        <li>Em caso de dúvida, siga sempre as orientações da Defesa Civil e das autoridades.</li>
      </ul>

      <h2>3. Uso permitido</h2>
      <p>Não é permitido usar o app para fins ilícitos, tentar sobrecarregar ou atacar os servidores, nem apresentar o {EMPRESA.produto} como canal oficial.</p>

      <h2>4. Disponibilidade</h2>
      <p>Trabalhamos para manter o app no ar, mas não garantimos funcionamento ininterrupto: pode haver manutenções e falhas das fontes ou dos fornecedores.</p>

      <h2>5. Responsabilidade</h2>
      <p>
        Respondemos pelos danos que causarmos nos termos da lei. Não respondemos por decisões tomadas apenas com base no app, por erros ou atrasos das fontes oficiais nem por indisponibilidade causada por terceiros. Nada nestes termos limita direitos garantidos pelo Código de Defesa do Consumidor.
      </p>

      <h2>6. Links de terceiros</h2>
      <p>Ligações, "Como chegar" (Google Maps), notícias e o site da Defesa Civil abrem serviços de terceiros, com termos e políticas próprios.</p>

      <h2>7. Mudanças nestes termos</h2>
      <p>Quando houver mudança relevante, atualizamos a data no topo desta página.</p>

      <h2>8. Lei e foro</h2>
      <p>Valem as leis brasileiras. Fica eleito o foro da comarca de São Paulo/SP, ressalvado o seu direito, como consumidor, de propor ação no foro do seu domicílio.</p>
    </>
  );
}

function Cookies() {
  const itens: [string, string, string][] = [
    ['Meu bairro (blumet:bairro)', 'Mostrar a situação do seu bairro na tela inicial', 'Até você trocar ou apagar'],
    ['Tema (blumet:tema)', 'Lembrar se você prefere claro, escuro ou automático', 'Até você trocar ou apagar'],
    ['Último dado (blumet:cache)', 'Abrir o app na hora e sem internet com os últimos dados públicos', 'Até 7 dias sem atualizar'],
    [`Aviso de cookies (${CHAVE_AVISO_COOKIES})`, 'Não mostrar este aviso de novo', 'Até você apagar os dados do site'],
    ['Arquivos do app (cache do service worker)', 'Funcionar offline: telas do app, último dado e imagens das notícias', 'Até a próxima versão do app ou 30 dias, no caso das imagens'],
  ];
  return (
    <>
      <p>
        Cookies e armazenamento local são pequenos dados que um site guarda no seu navegador. O {EMPRESA.produto} não usa cookies propriamente ditos: guarda no aparelho, pelo armazenamento local do navegador, apenas o essencial para funcionar.
      </p>

      <h2>O que guardamos no seu aparelho</h2>
      <div className="legal-tabela" role="table" aria-label="Itens guardados no aparelho">
        <div role="row" className="legal-tabela-cabeca">
          <span role="columnheader">Item</span>
          <span role="columnheader">Para quê</span>
          <span role="columnheader">Por quanto tempo</span>
        </div>
        {itens.map(([item, para, tempo]) => (
          <div role="row" key={item}>
            <span role="cell">{item}</span>
            <span role="cell">{para}</span>
            <span role="cell">{tempo}</span>
          </div>
        ))}
      </div>
      <p>
        Todos são essenciais ou guardam uma escolha que você mesmo fez, e nenhum sai do seu aparelho. Por isso não dependem de consentimento, mas você deve saber que existem.
      </p>

      <h2>O que não usamos</h2>
      <ul>
        <li>Cookies de publicidade ou de remarketing.</li>
        <li>Ferramentas de análise de audiência (como Google Analytics) ou mapas de calor.</li>
        <li>Botões ou rastreadores de redes sociais, vídeos ou mapas embutidos.</li>
        <li>Fontes ou scripts de terceiros: o app usa as fontes do próprio aparelho.</li>
      </ul>
      <p>Se algum dia passarmos a usar algo opcional, ele só será ativado depois do seu consentimento, e esta página será atualizada.</p>

      <h2>Conteúdo de terceiros</h2>
      <p>
        As imagens das notícias vêm do site da Prefeitura de Blumenau, que recebe o seu endereço IP para entregá-las (ver a <Link to="/privacidade">Política de Privacidade</Link>). Ao tocar em "Como chegar", nas notícias ou nos links externos, você vai para sites com as próprias políticas de cookies.
      </p>

      <h2>Como apagar</h2>
      <p>
        Nas configurações do navegador, apague os dados do site {EMPRESA.site}, ou desinstale o app. O bairro e o tema voltam ao padrão e o aviso de cookies aparece de novo.
      </p>
      <p>
        <button type="button" className="legal-botao" onClick={abrirAvisoCookies}>
          Ver o aviso de cookies
        </button>
      </p>
    </>
  );
}

const CONTEUDO: Record<TipoLegal, () => ReactNode> = { privacidade: Privacidade, termos: Termos, cookies: Cookies };

export function LegalPagina({ tipo }: { tipo: TipoLegal }) {
  const Conteudo = CONTEUDO[tipo];
  const titulo = DOCUMENTOS.find((d) => d.tipo === tipo)!.titulo;
  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Documentos legais" className="mb-5 flex flex-wrap gap-2">
        {DOCUMENTOS.map((d) => (
          <Link
            key={d.tipo}
            to={d.rota}
            aria-current={d.tipo === tipo ? 'page' : undefined}
            className={`inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm font-semibold ${d.tipo === tipo ? 'border-marca bg-marca text-white dark:text-slate-900' : 'border-linha text-texto-2 hover:bg-superficie-2'}`}
          >
            {d.titulo}
          </Link>
        ))}
      </nav>
      <article className="texto-legal">
        <h1>{titulo}</h1>
        <p className="legal-versao">Versão de {VERSAO_LEGAL_EXTENSO}</p>
        <Conteudo />
        <p className="legal-duvidas">
          Dúvidas sobre este documento? Escreva para <Contato />.
        </p>
      </article>
    </div>
  );
}
