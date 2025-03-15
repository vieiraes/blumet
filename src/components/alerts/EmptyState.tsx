import { Search } from 'lucide-react';

export default function EmptyState() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center my-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum alerta encontrado</h3>
            <p className="text-gray-500 mb-4">
                Não encontramos nenhum alerta correspondente aos filtros selecionados.
            </p>
            <p className="text-sm text-gray-500">
                Tente ajustar seus filtros ou remover algumas seleções.
            </p>
        </div>
    );
}