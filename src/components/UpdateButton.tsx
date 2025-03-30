'use client';

import { useState } from 'react';
import { atualizarDados } from '@/services/api';
import { RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function UpdateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    setMessage(null);
    setSuccess(null);
    setShowMessage(false);
    
    try {
      const result = await atualizarDados();
      setSuccess(result.success);
      setMessage(result.message);
      setShowMessage(true);
      
      // Se a atualização foi bem-sucedida, recarregar a página após um breve delay
      if (result.success) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setSuccess(false);
      setMessage('Erro ao atualizar. Tente novamente mais tarde.');
      setShowMessage(true);
    } finally {
      setIsLoading(false);
      
      // Esconder a mensagem automaticamente após 5 segundos
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleUpdate}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors flex items-center space-x-2 ${
          isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-label="Atualizar dados"
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <span>Atualizando...</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-5 w-5 mr-2" />
            <span>Atualizar dados</span>
          </>
        )}
      </button>
      
      {showMessage && message && (
        <div className={`mt-2 text-sm flex items-center space-x-1 ${
          success === true 
            ? 'text-green-600' 
            : 'text-amber-600'
        }`}>
          {success === true ? (
            <CheckCircle2 className="h-4 w-4 mr-1" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-1" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}