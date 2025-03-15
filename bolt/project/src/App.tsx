import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, 
  AlertTriangle, 
  RefreshCw, 
  MapPin, 
  AlertCircle,
  ThermometerSun,
  Wind,
  Clock,
  Search,
  X,
  Filter
} from 'lucide-react';
import type { WeatherData } from './types';

const getAlertIcon = (tipo: string) => {
  switch (tipo) {
    case 'cch':
      return <CloudRain className="w-6 h-6" />;
    case 'pes':
      return <AlertCircle className="w-6 h-6" />;
    default:
      return <ThermometerSun className="w-6 h-6" />;
  }
};

const getAlertColor = (nivel: number) => {
  switch (nivel) {
    case 1:
      return 'bg-green-500';
    case 2:
      return 'bg-yellow-500';
    case 3:
      return 'bg-orange-500';
    case 4:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

interface BairroStatus {
  nome: string;
  condicao: string;
  nivel: number;
  cor_fundo: string;
  cor_fonte: string;
  alertas: {
    tipo: string;
    tipoNome: string;
    descricao: string;
    create_data: string;
  }[];
}

function App() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBairro, setSelectedBairro] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<WeatherData>('/api/static/data/situacao_atual.json');
      setData(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError('Erro ao carregar dados. Tente novamente mais tarde.');
      console.error('Error fetching data:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Processa os dados para criar um mapa de status por bairro
  const bairrosStatus = React.useMemo(() => {
    if (!data) return new Map<string, BairroStatus>();
    
    const statusMap = new Map<string, BairroStatus>();
    
    data.dados.forEach(alert => {
      alert.sitregioes.forEach(region => {
        region.regiao.bairros.forEach(bairro => {
          const currentStatus = statusMap.get(bairro);
          const alertInfo = {
            tipo: alert.tipo,
            tipoNome: alert.tipoNome,
            descricao: alert.descricao,
            create_data: alert.create_data
          };
          
          if (!currentStatus) {
            statusMap.set(bairro, {
              nome: bairro,
              condicao: region.condicao.condicao,
              nivel: region.condicao.nivel,
              cor_fundo: region.condicao.cor_fundo,
              cor_fonte: region.condicao.cor_fonte,
              alertas: [alertInfo]
            });
          } else {
            if (region.condicao.nivel > currentStatus.nivel) {
              currentStatus.condicao = region.condicao.condicao;
              currentStatus.nivel = region.condicao.nivel;
              currentStatus.cor_fundo = region.condicao.cor_fundo;
              currentStatus.cor_fonte = region.condicao.cor_fonte;
            }
            currentStatus.alertas.push(alertInfo);
          }
        });
      });
    });
    
    return statusMap;
  }, [data]);

  // Lista de bairros ordenada por nível de alerta
  const bairrosList = React.useMemo(() => {
    return Array.from(bairrosStatus.values())
      .sort((a, b) => b.nivel - a.nivel || a.nome.localeCompare(b.nome));
  }, [bairrosStatus]);

  // Filtra bairros baseado na busca
  const filteredBairros = React.useMemo(() => {
    return bairrosList.filter(bairro =>
      bairro.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bairrosList, searchTerm]);

  // Filtra bairros baseado na seleção
  const displayedBairros = React.useMemo(() => {
    if (!selectedBairro) return filteredBairros;
    return filteredBairros.filter(bairro => bairro.nome === selectedBairro);
  }, [filteredBairros, selectedBairro]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="bg-blue-500/10 rounded-full p-4"
        >
          <RefreshCw className="w-10 h-10 text-blue-400" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-red-400 text-center max-w-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-red-500/10 rounded-full p-4 w-fit mx-auto mb-4"
          >
            <AlertTriangle className="w-10 h-10" />
          </motion.div>
          <p className="text-lg mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 p-4 mb-6 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="bg-blue-500/10 p-2 rounded-full"
            >
              <CloudRain className="w-8 h-8 text-blue-400" />
            </motion.div>
            <h1 className="text-xl font-bold">AlertaBlu</h1>
          </div>
          {data && (
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                title="Buscar bairro"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={fetchData}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          )}
        </div>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl p-6 max-h-[80vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Selecionar Bairro</h2>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar bairro..."
                  className="w-full bg-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {selectedBairro && (
                  <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-blue-500/20 rounded-xl text-blue-400"
                    onClick={() => {
                      setSelectedBairro(null);
                      setIsSearchOpen(false);
                    }}
                  >
                    <span>Mostrar todos os bairros</span>
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
                {filteredBairros.map((bairro) => (
                  <motion.button
                    key={bairro.nome}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedBairro(bairro.nome);
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                    className={`p-4 rounded-xl text-left transition-colors ${
                      selectedBairro === bairro.nome
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{bairro.nome}</span>
                      <div className={`px-3 py-1 rounded-full text-sm ${getAlertColor(bairro.nivel)} bg-opacity-20`}>
                        {bairro.condicao}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-4 pb-8">
        {selectedBairro && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-500/10 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400">Filtrando por: {selectedBairro}</span>
            </div>
            <button
              onClick={() => setSelectedBairro(null)}
              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-blue-400" />
            </button>
          </motion.div>
        )}

        {data && (
          <div className="text-sm text-gray-400 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Atualizado em: {format(new Date(data.datahoraAtualizacao), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>{displayedBairros.length} bairros</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {displayedBairros.map((bairro, index) => (
              <motion.div
                key={bairro.nome}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl overflow-hidden"
                style={{ 
                  backgroundColor: bairro.cor_fundo,
                  color: bairro.cor_fonte
                }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold">{bairro.nome}</h2>
                    <span className="text-sm px-3 py-1 rounded-full" style={{
                      backgroundColor: `${bairro.cor_fonte}20`
                    }}>
                      {bairro.condicao}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {bairro.alertas.map((alerta, idx) => (
                      <div 
                        key={`${bairro.nome}-${idx}`}
                        className="p-3 rounded-xl text-sm"
                        style={{
                          backgroundColor: `${bairro.cor_fonte}10`
                        }}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {getAlertIcon(alerta.tipo)}
                          <div>
                            <h3 className="font-medium">{alerta.tipoNome}</h3>
                            <p className="text-sm opacity-80">{alerta.descricao}</p>
                          </div>
                        </div>
                        <div className="text-xs opacity-60 flex items-center gap-1">
                          <Wind className="w-3 h-3" />
                          {format(new Date(alerta.create_data), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {displayedBairros.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl p-8 text-center"
          >
            <div className="bg-gray-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum bairro encontrado</h3>
            <p className="text-gray-400">
              Não foram encontrados bairros com a busca atual.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;