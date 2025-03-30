'use client';
import { useState, useMemo, useEffect } from 'react';
import { AlertaBluResponse, Dado } from '@/types/alertaBlu';
import { Filters } from '@/types/filters';
import AlertCard from './AlertCard';
import ViewToggle from './ViewToggle';
import EmptyState from './EmptyState';
import AlertStats from './AlertStats';
import { Maximize2, Minimize2, Search, ArrowDown, Filter } from 'lucide-react';

interface AlertListProps {
    data: AlertaBluResponse;
    filters: Filters;
    onFilterChange: (filters: Filters) => void;
    userNeighborhood?: string | null;
}

export default function AlertList({ data, filters, onFilterChange, userNeighborhood }: AlertListProps) {
    const [view, setView] = useState<'list' | 'grid'>('grid');
    const [showStats, setShowStats] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [autoFocus, setAutoFocus] = useState(false);

    // Lista de dados filtrados pelo termo de pesquisa e pelos filtros
    const filteredData = useMemo(() => {
        return data.dados.filter(dado => {
            // Filtrar por termo de pesquisa (busca em descrição e regiões)
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesDescription = dado.descricao?.toLowerCase().includes(searchLower);
                const matchesRegion = dado.sitregioes.some(sr => 
                    sr.regiao.nome.toLowerCase().includes(searchLower) ||
                    sr.regiao.bairros.some(b => b.toLowerCase().includes(searchLower))
                );
                
                if (!matchesDescription && !matchesRegion) {
                    return false;
                }
            }
            
            // Filtrar por tipo de alerta
            if (filters.alertTypes.length > 0 && !filters.alertTypes.includes(dado.tipo)) {
                return false;
            }

            // Verificar se alguma região/bairro/nível de condição corresponde
            const matchesRegionOrNeighborhoodOrLevel = dado.sitregioes.some(sitregiao => {
                // Filtrar por região
                const regionMatch = filters.regions.length === 0 || 
                                  filters.regions.includes(sitregiao.regiao.nome);
                
                // Filtrar por bairro
                const hasMatchingNeighborhood = filters.neighborhoods.length === 0 ||
                    sitregiao.regiao.bairros.some(bairro => 
                      filters.neighborhoods.includes(bairro)
                    );
                
                // Filtrar por nível de condição
                const conditionLevelMatch = filters.conditionLevels.length === 0 ||
                                          filters.conditionLevels.includes(sitregiao.condicao.nivel);
                
                return regionMatch && hasMatchingNeighborhood && conditionLevelMatch;
            });

            return matchesRegionOrNeighborhoodOrLevel;
        });
    }, [data, filters, searchTerm]);
    
    // Ordenar alertas: primeiro os que afetam o bairro do usuário, depois por nível de condição, depois por data
    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            // Se um dos alertas afeta o bairro do usuário, colocá-lo primeiro
            if (userNeighborhood) {
                const aAffectsUser = a.sitregioes.some(sr => 
                    sr.regiao.bairros.some(b => b.toLowerCase() === userNeighborhood.toLowerCase())
                );
                const bAffectsUser = b.sitregioes.some(sr => 
                    sr.regiao.bairros.some(b => b.toLowerCase() === userNeighborhood.toLowerCase())
                );
                
                if (aAffectsUser && !bAffectsUser) return -1;
                if (!aAffectsUser && bAffectsUser) return 1;
            }
            
            // Depois ordenar por nível máximo de condição (decrescente)
            const aMaxLevel = Math.max(...a.sitregioes.map(sr => sr.condicao.nivel));
            const bMaxLevel = Math.max(...b.sitregioes.map(sr => sr.condicao.nivel));
            
            if (aMaxLevel !== bMaxLevel) return bMaxLevel - aMaxLevel;
            
            // Por fim, ordenar por data (mais recente primeiro)
            return new Date(b.create_data).getTime() - new Date(a.create_data).getTime();
        });
    }, [filteredData, userNeighborhood]);

    // Manipuladores para os cliques nos stats
    const handleRegionClick = (region: string) => {
        const newFilters = { ...filters };
        
        if (!filters.regions.includes(region)) {
            newFilters.regions = [...filters.regions, region];
            onFilterChange(newFilters);
        }
    };
    
    const handleLevelClick = (level: number) => {
        const newFilters = { ...filters };
        
        if (!filters.conditionLevels.includes(level)) {
            newFilters.conditionLevels = [...filters.conditionLevels, level];
            onFilterChange(newFilters);
        }
    };

    // Foco automático no campo de busca em mobile
    useEffect(() => {
        if (autoFocus) {
            const timer = setTimeout(() => {
                setAutoFocus(false);
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [autoFocus]);

    if (data.dados.length === 0) {
        return <EmptyState message="Não há alertas disponíveis no momento." />;
    }

    return (
        <div>
            <div className="mb-6">
                {showStats && (
                    <AlertStats 
                        alerts={data.dados} 
                        onRegionClick={handleRegionClick}
                        onLevelClick={handleLevelClick}
                    />
                )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div className="flex items-center mb-3 sm:mb-0">
                        <Filter className="h-5 w-5 text-gray-500 mr-2" />
                        <h2 className="font-semibold text-lg text-gray-800">
                            {filteredData.length === data.dados.length 
                                ? `Todos os alertas (${filteredData.length})` 
                                : `Alertas filtrados (${filteredData.length} de ${data.dados.length})`}
                        </h2>
                    </div>
                    
                    <div className="flex items-center w-full sm:w-auto space-x-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar alertas..."
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                autoFocus={autoFocus}
                                onClick={() => setAutoFocus(true)}
                            />
                        </div>
                        
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                            aria-label={showStats ? "Ocultar estatísticas" : "Mostrar estatísticas"}
                        >
                            {showStats ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                        
                        <ViewToggle currentView={view} onChange={setView} />
                    </div>
                </div>
                
                {filteredData.length === 0 ? (
                    <EmptyState 
                        message="Nenhum alerta corresponde aos filtros selecionados." 
                        description="Tente remover alguns filtros ou utilizar outros termos de busca."
                    />
                ) : (
                    <div className={view === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                        : "space-y-4"
                    }>
                        {sortedData.map((dado) => (
                            <AlertCard 
                                key={dado.id} 
                                alert={dado}
                                expanded={view === 'list'} 
                                isHighlighted={filteredData.indexOf(dado) === 0}
                                userNeighborhood={userNeighborhood}
                            />
                        ))}
                    </div>
                )}
                
                {filteredData.length > 5 && (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50"
                        >
                            <ArrowDown className="h-4 w-4 mr-1 transform rotate-180" />
                            Voltar ao topo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}