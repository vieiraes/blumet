'use client';
import { useState, useEffect } from 'react';

interface NeighborhoodSearchProps {
    allNeighborhoods: string[];
    onSearch: (neighborhoods: string[]) => void;
}

export default function NeighborhoodSearch({
    allNeighborhoods,
    onSearch
}: NeighborhoodSearchProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (searchTerm.length > 1) {
            const filtered = allNeighborhoods.filter(
                neighborhood => neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, allNeighborhoods]);

    const handleSelectNeighborhood = (neighborhood: string) => {
        if (!selectedNeighborhoods.includes(neighborhood)) {
            const newSelected = [...selectedNeighborhoods, neighborhood];
            setSelectedNeighborhoods(newSelected);
            onSearch(newSelected);
        }
        setSearchTerm('');
        setSuggestions([]);
    };

    const handleRemoveNeighborhood = (neighborhood: string) => {
        const newSelected = selectedNeighborhoods.filter(n => n !== neighborhood);
        setSelectedNeighborhoods(newSelected);
        onSearch(newSelected);
    };

    return (
        <div className="relative">
            <div className="flex items-center mb-2">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar bairro..."
                        className="w-full p-2 border border-gray-300 rounded-md pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Sugestões de busca */}
            {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {suggestions.map(neighborhood => (
                        <div
                            key={neighborhood}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectNeighborhood(neighborhood)}
                        >
                            {neighborhood}
                        </div>
                    ))}
                </div>
            )}

            {/* Bairros selecionados */}
            {selectedNeighborhoods.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedNeighborhoods.map(neighborhood => (
                        <span
                            key={neighborhood}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                            {neighborhood}
                            <button
                                type="button"
                                onClick={() => handleRemoveNeighborhood(neighborhood)}
                                className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                            >
                                <span className="sr-only">Remover {neighborhood}</span>
                                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}