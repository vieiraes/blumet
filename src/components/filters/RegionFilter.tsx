'use client';
import { useState } from 'react';

interface RegionFilterProps {
    regions: string[];
    onChange: (selectedRegions: string[]) => void;
}

export default function RegionFilter({ regions, onChange }: RegionFilterProps) {
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

    const handleToggleRegion = (region: string) => {
        let newSelectedRegions;

        if (selectedRegions.includes(region)) {
            newSelectedRegions = selectedRegions.filter(r => r !== region);
        } else {
            newSelectedRegions = [...selectedRegions, region];
        }

        setSelectedRegions(newSelectedRegions);
        onChange(newSelectedRegions);
    };

    return (
        <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Região</h3>
            <div className="space-y-2">
                {regions.map(region => (
                    <div key={region} className="flex items-center">
                        <input
                            id={`region-${region}`}
                            type="checkbox"
                            checked={selectedRegions.includes(region)}
                            onChange={() => handleToggleRegion(region)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`region-${region}`} className="ml-2 block text-sm text-gray-700">
                            {region}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}