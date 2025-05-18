import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Github, CloudRain } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para a página inicial
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <CloudRain className="h-8 w-8 text-blue-700 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Sobre o BLUmet</h1>
          </div>
          
          <div className="prose max-w-none text-gray-800">
            <p className="text-lg font-medium">
              O BLUmet é um site de utilidade pública que oferece monitoramento em tempo real das condições 
              de chuva e alertas meteorológicos em Blumenau, Santa Catarina.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900">Nossa Missão</h2>
            <p className="text-gray-800">
              Fornecer informações precisas e atualizadas sobre condições meteorológicas que 
              possam afetar a segurança da população, com foco especial em:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-800">
              <li className="mb-1">Monitoramento de chuvas e níveis de rios</li>
              <li className="mb-1">Alertas de áreas com risco de alagamento</li>
              <li className="mb-1">Informações por bairro para decisões localizadas</li>
              <li className="mb-1">Acesso rápido a dados para planejamento diário</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900">Dados e Fontes</h2>
            <p className="text-gray-800">
              Os dados exibidos no BLUmet são obtidos através da integração com sistemas oficiais 
              de monitoramento meteorológico e da Defesa Civil de Blumenau. Atualizamos constantemente 
              essas informações para garantir sua precisão.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900">Código Aberto</h2>
            <p className="text-gray-800">
              O BLUmet é um projeto de código aberto, disponível para visualização, contribuição e uso 
              pela comunidade. Acreditamos que a transparência e colaboração são fundamentais para 
              projetos de utilidade pública.
            </p>
            <p className="mt-4">
              <Link 
                href="https://github.com/vieiraes/blumet" 
                target="_blank"
                className="inline-flex items-center bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-md font-medium transition-colors"
              >
                <Github className="h-5 w-5 mr-2" />
                Acessar o repositório no GitHub
              </Link>
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900">Contato</h2>
            <p className="text-gray-800">
              Para dúvidas, sugestões ou reportar problemas, por favor utilize as issues do GitHub 
              ou entre em contato através das informações disponíveis no repositório do projeto.
            </p>
            
            <div className="mt-10 pt-6 border-t border-gray-300 text-center text-gray-700 text-sm">
              <p>© {new Date().getFullYear()} BLUmet - Monitoramento de Chuvas</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}