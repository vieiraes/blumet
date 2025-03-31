import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Github, CloudRain } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para a página inicial
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <CloudRain className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Sobre o BLUmet</h1>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg">
              O BLUmet é um site de utilidade pública que oferece monitoramento em tempo real das condições 
              de chuva e alertas meteorológicos em Blumenau, Santa Catarina.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Nossa Missão</h2>
            <p>
              Fornecer informações precisas e atualizadas sobre condições meteorológicas que 
              possam afetar a segurança da população, com foco especial em:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Monitoramento de chuvas e níveis de rios</li>
              <li>Alertas de áreas com risco de alagamento</li>
              <li>Informações por bairro para decisões localizadas</li>
              <li>Acesso rápido a dados para planejamento diário</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Dados e Fontes</h2>
            <p>
              Os dados exibidos no BLUmet são obtidos através da integração com sistemas oficiais 
              de monitoramento meteorológico e da Defesa Civil de Blumenau. Atualizamos constantemente 
              essas informações para garantir sua precisão.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Código Aberto</h2>
            <p>
              O BLUmet é um projeto de código aberto, disponível para visualização, contribuição e uso 
              pela comunidade. Acreditamos que a transparência e colaboração são fundamentais para 
              projetos de utilidade pública.
            </p>
            <p className="mt-3">
              <Link 
                href="https://github.com/vieiraes/blumet" 
                target="_blank"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <Github className="h-5 w-5 mr-1" />
                Acessar o repositório no GitHub
              </Link>
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contato</h2>
            <p>
              Para dúvidas, sugestões ou reportar problemas, por favor utilize as issues do GitHub 
              ou entre em contato através das informações disponíveis no repositório do projeto.
            </p>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} BLUmet - Monitoramento de Chuvas</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}