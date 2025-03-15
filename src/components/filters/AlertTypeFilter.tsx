'use client';
import { useState } from 'react';
import { AlertType } from '@/types/filters';

interface AlertTypeFilterProps {
    alertTypes: AlertType[];
    onChange: (selectedTypes: string[]) => void;
}

export default function AlertTypeFilter({ alertTypes, onChange }: AlertTypeFilterProps) {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const handleToggleType = (typeId: string) => {
        let newSelectedTypes;

        if (selectedTypes.includes(typeId)) {
            newSelectedTypes = selectedTypes.filter(id => id !== typeId);
        } else {
            newSelectedTypes = [...selectedTypes, typeId];
        }

        setSelectedTypes(newSelectedTypes);
        onChange(newSelectedTypes);
    };

    return (
        <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo de Alerta</h3>
            <div className="space-y-2">
                {alertTypes.map(type => (
                    <div key={type.id} className="flex items-center">
                        <input
                            id={`alert-type-${type.id}`}
                            type="checkbox"
                            checked={selectedTypes.includes(type.id)}
                            onChange={() => handleToggleType(type.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`alert-type-${type.id}`} className="ml-2 block text-sm text-gray-700">
                            {type.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}