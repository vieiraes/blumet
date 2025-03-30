import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  description?: string;
}

export default function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {message}
      </h3>
      {description && (
        <p className="text-gray-500 max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}