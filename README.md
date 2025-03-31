# BLUmet - Sistema de Monitoramento de Chuvas de Blumenau

![BLUmet Logo](https://blumet.web.app/logo192.png)

BLUmet é um sistema de monitoramento e alerta de chuvas para o município de Blumenau-SC, fornecendo informações em tempo real sobre condições climáticas e níveis de alerta em todas as regiões da cidade.

## 🌧️ Visão Geral

O BLUmet foi desenvolvido como um Progressive Web App (PWA) para permitir acesso fácil via navegadores mobile e desktop, além de instalação como aplicativo nativo. O sistema consume dados oficiais da Defesa Civil de Blumenau e os apresenta de forma intuitiva e segmentada por regiões.

## 🚀 Acesso

O sistema está disponível em:
- **URL de Produção:** [https://blumet.web.app](https://blumet.web.app)
- **Plataformas:** Navegadores web em dispositivos móveis e desktop
- **Instalação:** O site pode ser instalado como um aplicativo PWA nos dispositivos compatíveis

## ✨ Funcionalidades

- **Painel de Monitoramento Geral:** Visão geral da situação em toda a cidade
- **Filtro por Bairros:** Personalize a visualização para focar em áreas específicas
- **Filtro por Níveis de Alerta:** Filtrar alertas por nível de severidade
- **Localização do Usuário:** Destaque automático para o bairro do usuário
- **Notificações:** Acompanhe mudanças de status em tempo real
- **Modo Offline:** Acesso aos últimos dados mesmo sem conexão à internet

## 🔧 Arquitetura Técnica

O projeto utiliza uma arquitetura moderna baseada em:

- **Frontend:** Next.js (React) com exportação estática, hospedado no Firebase Hosting
- **Backend:** Firebase Cloud Functions servindo como proxy para os dados oficiais
- **PWA:** Implementação completa com cache e funcionamento offline
- **CI/CD:** Integração e deploy automático via GitHub Actions

## 🧠 Como Usar

1. **Tela Inicial:**
   - Visualize o status geral de alertas em toda a cidade
   - Veja todos os alertas ativos e como estão distribuídos por região

2. **Filtros:**
   - Clique em "Filtrar por Bairros" para selecionar bairros específicos
   - Use "Filtrar por Níveis" para focar em alertas de determinada severidade

3. **Configurações do Usuário:**
   - Defina seu bairro para receber informações personalizadas
   - Ative notificações para ser alertado sobre mudanças importantes

4. **Detalhes de Alertas:**
   - Clique em qualquer alerta para ver detalhes completos
   - Veja quais áreas são afetadas e recomendações oficiais

## ⚙️ Desenvolvimento

Para desenvolvedores que desejam contribuir ou executar o projeto localmente:

```bash
# Clonar o repositório
git clone https://github.com/seunome/blumet-web.git

# Instalar dependências
cd blumet-web
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build:static

# Deploy (requer configuração do Firebase)
npm run deploy
```

## 👨‍💼 Créditos

**Criado por:** Bruno de Oliveira Vieira  
**Cargo:** Product Owner  
**Email:** [bvieira@mail.com](mailto:bvieira@mail.com)  
**LinkedIn:** [linkedin.com/in/bvieira](https://linkedin.com/in/bvieira)

**Desenvolvido com tecnologia:** Firebase, Next.js, Tailwind CSS

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados.  
© 2025 - Bruno Vieira
