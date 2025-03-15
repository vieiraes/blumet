'use client';
import { useState, useMemo } from 'react';
import { AlertaBluResponse, Dado } from '@/types/alertaBlu';
import { Filters } from '@/types/filters';
import AlertCard from './AlertCard';
import ViewToggle from './ViewToggle';
import EmptyState from './EmptyState';

interface AlertListProps {
    data: AlertaBluResponse;
    filters: Filters;
}

export default function AlertList({ data, filters }: AlertListProps) {
    const [view, setView] = useState<'list' | 'grid'>('grid');

    const filteredData = useMemo(() => {
        return data.dados.filter(dado => {
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
    }, [data, filters]);

    if (filteredData.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <ViewToggle currentView={view} onChange={setView} />
            </div>
            <div className={view === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-4"
            }>
                {filteredData.map((dado) => (
                    <AlertCard 
                        key={dado.id} 
                        alert={dado}
                        expanded={view === 'list'} 
                    />
                ))}
            </div>
        </div>
    );
}