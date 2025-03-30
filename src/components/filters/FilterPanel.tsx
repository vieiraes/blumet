'use client';
import { useState, useRef, useEffect } from 'react';
import { Filters, AlertType } from '@/types/filters';
import { Filter, X, MapPin, Search, ArrowDown, LocateFixed } from 'lucide-react';
import Chip from './Chip';

interface FilterPanelProps {
    onFilterChange: (filters: Filters) => void;
    allRegions: string[];
    allNeighborhoods: string[];
    alertTypes: AlertType[];
    userLocation?: string | null;
    onSetUserLocation?: (neighborhood: string | null) => void;
}

export default function FilterPanel({
    onFilterChange,
    allRegions,
    allNeighborhoods,
    alertTypes,
    userLocation,
    onSetUserLocation
}: FilterPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Filters>({
        alertTypes: [],
        regions: [],
        neighborhoods: [],
        conditionLevels: [],
    });
    const [activeTab, setActiveTab] = useState<'neighborhoods' | 'regions' | 'types'>('neighborhoods');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Opções para nível de condição
    const conditionOptions = [
        { id: 1, label: 'Normalidade', color: '#64EE64', textColor: '#000000' },
        { id: 2, label: 'Observação', color: '#FFFF00', textColor: '#000000' },
        { id: 3, label: 'Atenção', color: '#FF9900', textColor: '#000000' },
        { id: 4, label: 'Alerta', color: '#FF0000', textColor: '#FFFFFF' },
    ];

    // Filtrar bairros baseado na busca
    const filteredNeighborhoods = allNeighborhoods
        .filter(n => n.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort();

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
        filters.alertTypes.length > 0 ||
        filters.regions.length > 0 ||
        filters.neighborhoods.length > 0 ||
        filters.conditionLevels.length > 0;

    // Quando o painel expande, focar no campo de busca
    useEffect(() => {
        if (isExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isExpanded]);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
            <div
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    <Filter className="mr-2 h-5 w-5 text-blue-600" />
                    <h2 className="font-semibold text-lg md:text-xl">Filtrar alertas</h2>
                    {hasActiveFilters && (
                        <span className="ml-2 bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
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
                            className="text-sm text-gray-500 hover:text-red-600 mr-4 flex items-center"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Limpar
                        </button>
                    )}
                    <ArrowDown className={`transform transition-transform duration-200 h-5 w-5 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {userLocation && (
                <div className="px-4 py-3 bg-blue-50 border-t border-b border-blue-100 flex justify-between items-center">
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

            <div className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? 'max-h-[80vh]' : 'max-h-0'
            }`}>
                <div className="p-4 border-t border-gray-100">
                    {/* Tabs para navegação */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            onClick={() => setActiveTab('neighborhoods')}
                            className={`px-4 py-2 text-sm font-medium -mb-px ${
                                activeTab === 'neighborhoods'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Bairros
                        </button>
                        <button
                            onClick={() => setActiveTab('regions')}
                            className={`px-4 py-2 text-sm font-medium -mb-px ${
                                activeTab === 'regions'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Regiões
                        </button>
                        <button
                            onClick={() => setActiveTab('types')}
                            className={`px-4 py-2 text-sm font-medium -mb-px ${
                                activeTab === 'types'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Tipos & Níveis
                        </button>
                    </div>

                    {/* Conteúdo da tab selecionada */}
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
                                    <p className="text-gray-500 py-2">Nenhum bairro encontrado com "{searchTerm}"</p>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'regions' && (
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {allRegions.map(region => (
                                    <Chip
                                        key={region}
                                        label={region}
                                        selected={filters.regions.includes(region)}
                                        onClick={() => handleFilterChange('regions', region)}
                                        icon={<MapPin className="h-3.5 w-3.5" />}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'types' && (
                        <>
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
                                            textColor={option.textColor}
                                            selected={filters.conditionLevels.includes(option.id)}
                                            onClick={() => handleFilterChange('conditionLevels', option.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}