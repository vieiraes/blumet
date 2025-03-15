'use client';
import { useState } from 'react';
import { Filters, AlertType } from '@/types/filters';
import { Filter, X } from 'lucide-react';
import Chip from './Chip';

interface FilterPanelProps {
    onFilterChange: (filters: Filters) => void;
    allRegions: string[];
    allNeighborhoods: string[];
    alertTypes: AlertType[];
}

export default function FilterPanel({
    onFilterChange,
    allRegions,
    allNeighborhoods,
    alertTypes
}: FilterPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        alertTypes: [],
        regions: [],
        neighborhoods: [],
        conditionLevels: [],
    });

    // Opções para nível de condição
    const conditionOptions = [
        { id: 1, label: 'Normalidade', color: '#64EE64' },
        { id: 2, label: 'Observação', color: '#FAFA00' },
        { id: 3, label: 'Atenção', color: '#FF9622' },
        { id: 4, label: 'Alerta', color: '#FF0000' },
    ];

    const handleFilterChange = (filterType: keyof Filters, value: string | number) => {
        let newValues;
        if (filters[filterType].includes(value)) {
            newValues = filters[filterType].filter(v => v !== value);
        } else {
            newValues = [...filters[filterType], value];
        }

        const newFilters = { ...filters, [filterType]: newValues };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            alertTypes: [],
            regions: [],
            neighborhoods: [],
            conditionLevels: [],
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const hasActiveFilters =
        filters.alertTypes.length > 0 ||
        filters.regions.length > 0 ||
        filters.neighborhoods.length > 0 ||
        filters.conditionLevels.length > 0;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    <Filter className="mr-2 h-5 w-5 text-blue-500" />
                    <h2 className="font-semibold">Filtros</h2>
                    {hasActiveFilters && (
                        <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {filters.alertTypes.length + filters.regions.length +
                                filters.neighborhoods.length + filters.conditionLevels.length}
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    {hasActiveFilters && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFilters();
                            }}
                            className="text-sm text-gray-500 hover:text-red-500 mr-4 flex items-center"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Limpar filtros
                        </button>
                    )}
                    <span className="transform transition-transform duration-200">
                        {isExpanded ? '↑' : '↓'}
                    </span>
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? 'max-h-[1000px]' : 'max-h-0'
            }`}>
                <div className="p-4 border-t border-gray-100">
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo de alerta</h3>
                        <div className="flex flex-wrap gap-2">
                            {alertTypes.map(type => (
                                <Chip
                                    key={type.id}
                                    label={type.name}
                                    selected={filters.alertTypes.includes(type.id)}
                                    onClick={() => handleFilterChange('alertTypes', type.id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Nível de alerta</h3>
                        <div className="flex flex-wrap gap-2">
                            {conditionOptions.map(option => (
                                <Chip
                                    key={option.id}
                                    label={option.label}
                                    color={option.color}
                                    textColor="#000000"
                                    selected={filters.conditionLevels.includes(option.id)}
                                    onClick={() => handleFilterChange('conditionLevels', option.id)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Região</h3>
                        <div className="flex flex-wrap gap-2">
                            {allRegions.map(region => (
                                <Chip
                                    key={region}
                                    label={region}
                                    selected={filters.regions.includes(region)}
                                    onClick={() => handleFilterChange('regions', region)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Bairros</h3>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                            {allNeighborhoods.map(neighborhood => (
                                <Chip
                                    key={neighborhood}
                                    label={neighborhood}
                                    selected={filters.neighborhoods.includes(neighborhood)}
                                    onClick={() => handleFilterChange('neighborhoods', neighborhood)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}