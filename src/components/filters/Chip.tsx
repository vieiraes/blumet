'use client';

interface ChipProps {
    label: string;
    selected: boolean;
    onClick: () => void;
    color?: string;
    textColor?: string;
}

export default function Chip({ label, selected, onClick, color, textColor }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selected
                    ? color
                        ? ''
                        : 'bg-blue-100 text-blue-800 border-blue-200 border'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            style={color && selected ? { backgroundColor: color, color: textColor || 'white' } : {}}
        >
            {label}
        </button>
    );
}