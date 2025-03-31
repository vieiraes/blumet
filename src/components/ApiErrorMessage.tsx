'use client';

import { AlertCircle, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import UpdateButton from './UpdateButton';

interface ApiErrorMessageProps {
  errorData?: {
    mensagem: string;
    dataHora: string;
    contatoDefesaCivil?: string;
  }
}

export default function ApiErrorMessage({ errorData }: ApiErrorMessageProps) {
  // Verificar a formatação da data
  const formattedDate = errorData?.dataHora ? 
    format(new Date(errorData.dataHora), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR }) :
    format(new Date(), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-md shadow-sm mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">
            Sistema de monitoramento indisponível
          </h3>
          <div className="mt-2 text-red-700">
            <p>{errorData?.mensagem || 'Não foi possível obter dados atualizados do sistema AlertaBlu.'}</p>
            <p className="mt-2">Por favor, tente novamente em alguns minutos ou consulte os canais oficiais.</p>
            
            {errorData?.contatoDefesaCivil && (
              <p className="mt-4 flex items-center font-medium">
                <Phone className="h-5 w-5 mr-2" />
                Defesa Civil: {errorData.contatoDefesaCivil}
              </p>
            )}
            
            <div className="mt-4">
              <p className="text-sm text-red-600">Última tentativa: {formattedDate}</p>
              <div className="mt-3">
                <UpdateButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}