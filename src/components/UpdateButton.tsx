'use client';

import { useState } from 'react';
import { atualizarDados } from '@/services/api';

export default function UpdateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(false);
    
    try {
      const result = await atualizarDados();
      setMessage(result.message);
      setError(!result.success);
      
      // Se a atualização foi bem-sucedida, recarregar a página após um breve delay
      if (result.success) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setMessage('Erro ao atualizar. Tente novamente mais tarde.');
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleUpdate}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors flex items-center gap-2`}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isLoading ? 'Atualizando...' : 'Atualizar Dados'}
      </button>
      
      {message && (
        <p className={`mt-2 text-sm ${
          error ? 'text-red-600' : 'text-green-600'
        } text-center`}>
          {message}
        </p>
      )}
    </div>
  );
}