'use client';
import { List, Grid } from 'lucide-react';

interface ViewToggleProps {
    currentView: 'list' | 'grid';
    onChange: (view: 'list' | 'grid') => void;
}

export default function ViewToggle({ currentView, onChange }: ViewToggleProps) {
    return (
        <div className="inline-flex rounded-md shadow-sm">
            <button
                type="button"
                onClick={() => onChange('list')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border flex items-center ${
                    currentView === 'list'
                        ? 'text-white bg-blue-600 border-blue-600'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
                aria-label="Visualizar como lista"
            >
                <List className="h-4 w-4 mr-1" />
                Lista
            </button>
            <button
                type="button"
                onClick={() => onChange('grid')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border flex items-center ${
                    currentView === 'grid'
                        ? 'text-white bg-blue-600 border-blue-600'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
                aria-label="Visualizar como grade"
            >
                <Grid className="h-4 w-4 mr-1" />
                Grade
            </button>
        </div>
    );
}