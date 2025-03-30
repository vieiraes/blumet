'use client';

import React, { ReactNode } from 'react';
import { Check, MapPin } from 'lucide-react';

interface ChipProps {
    label: string;
    selected: boolean;
    onClick: () => void;
    color?: string;
    textColor?: string;
    icon?: ReactNode;
    isUserLocation?: boolean;
}

export default function Chip({
    label,
    selected,
    onClick,
    color,
    textColor,
    icon,
    isUserLocation = false
}: ChipProps) {
    // Se for a localização do usuário, sobrescrever o estilo
    if (isUserLocation) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center 
                    ${selected 
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
            >
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {label}
                {selected && <Check className="h-3.5 w-3.5 ml-1.5" />}
            </button>
        );
    }
    
    // Chip padrão
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                selected
                    ? color
                        ? ''
                        : 'bg-blue-100 text-blue-800 border-blue-200 border'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={color && selected ? { backgroundColor: color, color: textColor || 'white' } : {}}
        >
            {icon && <span className="mr-1.5">{icon}</span>}
            {label}
            {selected && <Check className="h-3.5 w-3.5 ml-1.5" />}
        </button>
    );
}