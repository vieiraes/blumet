'use client';
import { useState, useEffect } from 'react';
import { getSituacaoAtual } from '@/services/api';
import { AlertaBluResponse } from '@/types/alertaBlu';
import { AlertType, Filters } from '@/types/filters';
import Header from '@/components/Header';
import UpdateButton from '@/components/UpdateButton';
import FilterPanel from '@/components/filters/FilterPanel';
import AlertList from '@/components/alerts/AlertList';
import ApiErrorMessage from '@/components/ApiErrorMessage';
import { AlertCircle } from 'lucide-react';

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
  const [filters, setFilters] = useState<Filters>({
    alertTypes: [],
    regions: [],
    neighborhoods: [],
    conditionLevels: [],
  });
  const [apiError, setApiError] = useState<AlertaBluError | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/api/proxy');
        
        // Se a API retornou erro
        if (response.status >= 400) {
          const errorData = await response.json();
          setApiError(errorData);
          setError(errorData.mensagem || 'Falha ao carregar os dados');
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

    loadData();
  }, []);

  // Extrair tipos de alerta, regiões e bairros dos dados
  const alertTypes: AlertType[] = data?.dados.map(dado => ({
    id: dado.tipo,
    name: dado.tipoNome
  })) || [];
  
  const allRegions: string[] = data?.dados
    .flatMap(dado => dado.sitregioes.map(sr => sr.regiao.nome))
    .filter((value, index, self) => self.indexOf(value) === index) || [];
  
  const allNeighborhoods: string[] = data?.dados
    .flatMap(dado => dado.sitregioes.flatMap(sr => sr.regiao.bairros))
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort() || [];

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Header />
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Header />
        <div className="container mx-auto p-4">
          {apiError ? (
            <ApiErrorMessage errorData={apiError} />
          ) : (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
          <div className="flex justify-center my-4">
            <UpdateButton />
          </div>
        </div>
      </main>
    );
  }

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const lastUpdateDate = new Date(data.datahoraAtualizacao || '');
  const formattedUpdate = lastUpdateDate.toLocaleString('pt-BR');

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto p-4">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Monitoramento em Blumenau</h1>
            <p className="text-sm text-gray-600">
              Última atualização: {formattedUpdate}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <UpdateButton />
          </div>
        </div>
        
        <FilterPanel 
          onFilterChange={handleFilterChange} 
          allRegions={allRegions} 
          allNeighborhoods={allNeighborhoods} 
          alertTypes={alertTypes} 
        />
        
        <AlertList data={data} filters={filters} />
      </div>
    </main>
  );
}
