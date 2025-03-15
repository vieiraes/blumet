export default function NoResults() {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
                className="mx-auto h-12 w-12 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum resultado encontrado</h3>
            <p className="mt-1 text-gray-500">
                Tente ajustar seus filtros ou busque por outro bairro.
            </p>
        </div>
    );
}