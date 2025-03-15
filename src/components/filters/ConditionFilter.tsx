'use client';
import { useState } from 'react';

interface ConditionFilterProps {
    onChange: (selectedLevels: number[]) => void;
}

export default function ConditionFilter({ onChange }: ConditionFilterProps) {
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]);

    const conditions = [
        { level: 1, name: "Normalidade", color: "#64EE64" },
        { level: 2, name: "Observação", color: "#FAFA00" },
        { level: 3, name: "Atenção", color: "#FF9622" },
        { level: 4, name: "Alerta", color: "#FF2222" }
    ];

    const handleToggleLevel = (level: number) => {
        let newSelectedLevels;

        if (selectedLevels.includes(level)) {
            newSelectedLevels = selectedLevels.filter(l => l !== level);
        } else {
            newSelectedLevels = [...selectedLevels, level];
        }

        setSelectedLevels(newSelectedLevels);
        onChange(newSelectedLevels);
    };

    return (
        <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Nível de Condição</h3>
            <div className="space-y-2">
                {conditions.map(condition => (
                    <div key={condition.level} className="flex items-center">
                        <input
                            id={`condition-${condition.level}`}
                            type="checkbox"
                            checked={selectedLevels.includes(condition.level)}
                            onChange={() => handleToggleLevel(condition.level)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`condition-${condition.level}`} className="ml-2 flex items-center text-sm text-gray-700">
                            <span
                                className="inline-block w-3 h-3 mr-1 rounded-full"
                                style={{ backgroundColor: condition.color }}
                            ></span>
                            {condition.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}