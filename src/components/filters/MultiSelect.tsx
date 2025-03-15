'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface Option {
    id: string | number;
    label: string;
    color?: string;
}

interface MultiSelectProps {
    options: Option[];
    selectedValues: (string | number)[];
    onChange: (selectedValues: (string | number)[]) => void;
    placeholder?: string;
    coloredOptions?: boolean;
}

export default function MultiSelect({
    options,
    selectedValues,
    onChange,
    placeholder = 'Selecionar',
    coloredOptions = false
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (id: string | number) => {
        const isSelected = selectedValues.includes(id);
        if (isSelected) {
            onChange(selectedValues.filter(value => value !== id));
        } else {
            onChange([...selectedValues, id]);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const removeOption = (event: React.MouseEvent, id: string | number) => {
        event.stopPropagation();
        onChange(selectedValues.filter(value => value !== id));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="border border-gray-300 rounded-md p-2 min-h-10 flex flex-wrap gap-1 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedValues.length === 0 ? (
                    <span className="text-gray-400">{placeholder}</span>
                ) : (
                    <>
                        {selectedValues.map(value => {
                            const option = options.find(opt => opt.id === value);
                            if (!option) return null;

                            return (
                                <span
                                    key={option.id}
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-sm ${coloredOptions && option.color
                                            ? `text-black`
                                            : 'bg-blue-100 text-blue-800'
                                        }`}
                                    style={coloredOptions && option.color ? { backgroundColor: option.color } : {}}
                                >
                                    {option.label}
                                    <X
                                        className="ml-1 h-3 w-3 cursor-pointer"
                                        onClick={(e) => removeOption(e, option.id)}
                                    />
                                </span>
                            );
                        })}
                    </>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
                    <div className="p-2 border-b sticky top-0 bg-white">
                        <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded"
                            placeholder="Procurar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div>
                        {filteredOptions.length === 0 ? (
                            <div className="p-2 text-gray-500 text-center">Nenhum resultado encontrado</div>
                        ) : (
                            filteredOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center ${selectedValues.includes(option.id) ? 'bg-gray-50' : ''
                                        }`}
                                    onClick={() => toggleOption(option.id)}
                                >
                                    <div className="flex-1 flex items-center">
                                        {coloredOptions && option.color && (
                                            <span
                                                className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
                                                style={{ backgroundColor: option.color }}
                                            ></span>
                                        )}
                                        <span>{option.label}</span>
                                    </div>
                                    {selectedValues.includes(option.id) && (
                                        <Check className="h-4 w-4 text-blue-500" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}