'use client';
import { GridIcon, ListIcon } from 'lucide-react';

interface ViewToggleProps {
  currentView: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ currentView, onChange }: ViewToggleProps) {
  return (
    <div className="flex border border-gray-300 rounded-md overflow-hidden">
      <button
        onClick={() => onChange('grid')}
        aria-label="Visualização em grade"
        className={`p-1.5 flex items-center justify-center transition-colors ${
          currentView === 'grid'
            ? 'bg-blue-50 text-blue-600'
            : 'bg-white text-gray-500 hover:bg-gray-50'
        }`}
      >
        <GridIcon className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => onChange('list')}
        aria-label="Visualização em lista"
        className={`p-1.5 flex items-center justify-center transition-colors ${
          currentView === 'list'
            ? 'bg-blue-50 text-blue-600'
            : 'bg-white text-gray-500 hover:bg-gray-50'
        }`}
      >
        <ListIcon className="h-4 w-4" />
      </button>
    </div>
  );
}