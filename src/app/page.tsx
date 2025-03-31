'use client';
import { useEffect, useState } from 'react';
import { AlertaBluResponse } from '@/types/alertaBlu';
import { getSituacaoAtual } from '@/services/api';
import { Filters, AlertType } from '@/types/filters';
import Header from '@/components/Header';
import FilterPanel from '@/components/filters/FilterPanel';
import AlertList from '@/components/alerts/AlertList';
import ApiErrorMessage from '@/components/ApiErrorMessage';
import { AlertCircle } from 'lucide-react';
import AlertStats from '@/components/alerts/AlertStats';

// Tipos de alerta disponíveis
const alertTypes: AlertType[] = [
  { id: 'cch', name: 'Condições de Chuva' },
  { id: 'pes', name: 'Pontos de Escorregamento' },
  { id: 'ven', name: 'Vendaval' }
];

interface AlertaBluError {
  erro: boolean;
  mensagem: string;
  dataHora: string;
  codigoErro: string;
  contatoDefesaCivil?: string;
}

export default function Home() {
  const [data, setData] = useState<AlertaBluResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<AlertaBluError | null>(null);
  const [filters, setFilters] = useState<Filters>({
    alertTypes: [],
    regions: [],
    neighborhoods: [],
    conditionLevels: [],
  });
  const [userNeighborhood, setUserNeighborhood] = useState<string | null>(null);

  // Efeito para carregar os dados iniciais
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/api/proxy');
        
        // Se a API retornou erro
        if (response.status >= 400) {
          const errorData = await response.json();
          setApiError(errorData);
          setError(errorData.mensagem || 'Falha ao carregar dados');
          setData(null);
        } else {
          const alertData = await response.json();
          
          if (alertData.erro) {
            // Se veio um objeto de erro estruturado
            setApiError(alertData);
            setError(alertData.mensagem);
            setData(null);
          } else {
            // Dados carregados com sucesso
            setData(alertData);
            setError(null);
            setApiError(null);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Falha ao carregar os dados. Tente novamente mais tarde.');
        setApiError(null);
      } finally {
        setLoading(false);
      }
    }

    // Carregar dados quando o componente montar
    loadData();
    
    // Verificar se há uma localização salva do usuário
    const savedNeighborhood = localStorage.getItem('userNeighborhood');
    if (savedNeighborhood) {
      setUserNeighborhood(savedNeighborhood);
    }
  }, []);

  // Extrair todas as regiões e bairros disponíveis nos dados
  const { allRegions, allNeighborhoods } = data?.dados.reduce(
    (acc, dado) => {
      dado.sitregioes.forEach(sr => {
        // Adicionar região, se ainda não existir
        if (!acc.allRegions.includes(sr.regiao.nome)) {
          acc.allRegions.push(sr.regiao.nome);
        }
        
        // Adicionar bairros, se ainda não existirem
        sr.regiao.bairros.forEach(bairro => {
          if (!acc.allNeighborhoods.includes(bairro)) {
            acc.allNeighborhoods.push(bairro);
          }
        });
      });
      
      return acc;
    },
    { allRegions: [] as string[], allNeighborhoods: [] as string[] }
  ) || { allRegions: [], allNeighborhoods: [] };
  
  // Manipulador para salvar a localização do usuário
  const handleSetUserLocation = (neighborhood: string | null) => {
    setUserNeighborhood(neighborhood);
    
    if (neighborhood) {
      localStorage.setItem('userNeighborhood', neighborhood);
    } else {
      localStorage.removeItem('userNeighborhood');
    }
  };

  // Adicione o manipulador para filtrar por tipo
  const handleTypeClick = (alertType: string) => {
    const newFilters = { ...filters };
    
    // Se o tipo já estiver nos filtros, não adicione novamente
    if (!newFilters.alertTypes.includes(alertType)) {
      newFilters.alertTypes = [alertType]; // Usando apenas este tipo como filtro
      setFilters(newFilters);
      
      // Rolar para a seção de alertas filtrados
      const alertsSection = document.getElementById('filtered-alerts');
      if (alertsSection) {
        alertsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 pt-6 pb-12">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando informações...</p>
          </div>
        </div>
      </main>
    );
  }

  // Tela de erro
  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 pt-6 pb-12">
          {apiError ? (
            <ApiErrorMessage errorData={apiError} />
          ) : (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error || 'Ocorreu um erro ao carregar os dados.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Tela principal
  return (
    <main className="min-h-screen bg-gray-50">
      <Header lastUpdate={data.datahoraAtualizacao} />
      
      <div className="container mx-auto px-4 pt-6 pb-12">
        {/* Panorama Geral vem primeiro */}
        <AlertStats
          alerts={data.dados}
          onRegionClick={(region) => {
            const newFilters = { ...filters, regions: [...filters.regions, region] };
            setFilters(newFilters);
          }}
          onLevelClick={(level) => {
            const newFilters = { ...filters, conditionLevels: [...filters.conditionLevels, level] };
            setFilters(newFilters);
          }}
          onTypeClick={handleTypeClick}
        />
        
        {/* Depois vem o filtro */}
        <FilterPanel
          onFilterChange={setFilters}
          allNeighborhoods={allNeighborhoods.sort()}
          userLocation={userNeighborhood}
          onSetUserLocation={handleSetUserLocation}
        />
        
        {/* Por fim a lista de alertas */}
        <AlertList
          data={data}
          filters={filters} 
          onFilterChange={setFilters}
          userNeighborhood={userNeighborhood}
        />
      </div>
    </main>
  );
}
