'use client';
import { useState, useRef, useEffect } from 'react';
import { Filters } from '@/types/filters';
import { Search, LocateFixed, AlertCircle, X } from 'lucide-react';
import Chip from './Chip';

interface FilterPanelProps {
    onFilterChange: (filters: Filters) => void;
    allNeighborhoods: string[];
    userLocation?: string | null;
    onSetUserLocation?: (neighborhood: string | null) => void;
}

export default function FilterPanel({
    onFilterChange,
    allNeighborhoods,
    userLocation,
    onSetUserLocation
}: FilterPanelProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>({
        alertTypes: [],
        regions: [],
        neighborhoods: [],
        conditionLevels: [],
    });
    const [activeTab, setActiveTab] = useState<'neighborhoods' | 'levels'>('neighborhoods');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Opções para nível de condição
    const conditionOptions = [
        { id: 1, label: 'Normalidade', color: '#64EE64', textColor: '#0B5E0B' },
        { id: 2, label: 'Observação', color: '#FFFF00', textColor: '#806600' },
        { id: 3, label: 'Atenção', color: '#FF9900', textColor: '#000000' },
        { id: 4, label: 'Alerta', color: '#FF0000', textColor: '#000000' },
    ];
    
    // Filtrar bairros baseado na busca
    const filteredNeighborhoods = allNeighborhoods
        .filter(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort();

    const handleFilterChange = (filterType: keyof Filters, value: string | number) => {
        let newValues: Array<string | number>;
        
        if ((filters[filterType] as Array<string | number>).includes(value)) {
            newValues = (filters[filterType] as Array<string | number>).filter(v => v !== value);
        } else {
            newValues = [...(filters[filterType] as Array<string | number>), value];
        }

        const newFilters = { ...filters, [filterType]: newValues };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleNeighborhoodSelect = (neighborhood: string) => {
        // Se estiver selecionando o bairro do usuário, defina-o como localização do usuário
        if (onSetUserLocation && (userLocation !== neighborhood)) {
            onSetUserLocation(neighborhood);
        }
        
        // Adicionar ou remover do filtro
        handleFilterChange('neighborhoods', neighborhood);
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

    const clearUserLocation = () => {
        if (onSetUserLocation) {
            onSetUserLocation(null);
        }
        
        // Remover o bairro do usuário dos filtros, se estiver presente
        if (userLocation && filters.neighborhoods.includes(userLocation)) {
            const newNeighborhoods = filters.neighborhoods.filter(n => n !== userLocation);
            const newFilters = { ...filters, neighborhoods: newNeighborhoods };
            setFilters(newFilters);
            onFilterChange(newFilters);
        }
    };

    const hasActiveFilters =
        filters.neighborhoods.length > 0 ||
        filters.conditionLevels.length > 0;

    // Focar o campo de busca ao mudar para a aba de bairros
    useEffect(() => {
        if (activeTab === 'neighborhoods' && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [activeTab]);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
            {/* Cabeçalho com abas */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('neighborhoods')}
                    className={`flex-1 px-4 py-3 text-center text-base font-medium ${
                        activeTab === 'neighborhoods'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Filtrar por Bairros
                </button>
                <button
                    onClick={() => setActiveTab('levels')}
                    className={`flex-1 px-4 py-3 text-center text-base font-medium ${
                        activeTab === 'levels'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Filtrar por Níveis
                </button>
            </div>

            {/* Barra de informações do usuário */}
            {userLocation && (
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                    <div className="flex items-center">
                        <LocateFixed className="mr-2 h-5 w-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-blue-800">Seu bairro</p>
                            <p className="font-medium text-blue-900">{userLocation}</p>
                        </div>
                    </div>
                    <button
                        onClick={clearUserLocation}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Remover
                    </button>
                </div>
            )}

            {/* Conteúdo das abas - sempre visível */}
            <div className="p-4">
                {/* Header com contagem de filtros e botão limpar */}
                {hasActiveFilters && (
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">
                            {filters.neighborhoods.length + filters.conditionLevels.length} filtro(s) ativo(s)
                        </span>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-red-600 flex items-center"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Limpar Filtros
                        </button>
                    </div>
                )}

                {/* Conteúdo da tab de bairros */}
                {activeTab === 'neighborhoods' && (
                    <>
                        <div className="mb-4 relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar seu bairro..."
                                className="w-full pl-10 pr-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto py-2">
                            {filteredNeighborhoods.length > 0 ? (
                                filteredNeighborhoods.map(neighborhood => (
                                    <Chip
                                        key={neighborhood}
                                        label={neighborhood}
                                        selected={filters.neighborhoods.includes(neighborhood)}
                                        isUserLocation={userLocation === neighborhood}
                                        onClick={() => handleNeighborhoodSelect(neighborhood)}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 py-2">Nenhum bairro encontrado com &quot;{searchTerm}&quot;</p>
                            )}
                        </div>
                    </>
                )}

                {/* Conteúdo da tab de níveis */}
                {activeTab === 'levels' && (
                    <div>
                        <h3 className="text-base font-medium text-gray-700 mb-3">Selecione os níveis de alerta</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {conditionOptions.map(option => (
                                <div 
                                    key={option.id}
                                    onClick={() => handleFilterChange('conditionLevels', option.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                                        filters.conditionLevels.includes(option.id)
                                            ? 'border-2 shadow-sm transform -translate-y-0.5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{
                                        borderColor: filters.conditionLevels.includes(option.id) ? option.color : undefined,
                                        backgroundColor: `${option.color}20`
                                    }}
                                >
                                    <div className="flex items-center">
                                        <div 
                                            className="w-4 h-4 rounded-full mr-3"
                                            style={{ backgroundColor: option.color }}
                                        ></div>
                                        <span 
                                            className="font-medium"
                                            style={{ 
                                                color: option.textColor,
                                                textShadow: option.id <= 2 ? '0 0 1px rgba(255,255,255,0.5)' : 'none'
                                            }}
                                        >
                                            {option.label}
                                        </span>
                                    </div>
                                    {filters.conditionLevels.includes(option.id) && (
                                        <AlertCircle className="h-5 w-5" style={{ color: option.textColor }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}