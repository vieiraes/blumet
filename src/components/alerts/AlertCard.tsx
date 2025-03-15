'use client';
import { useState } from 'react';
import { Dado } from '@/types/alertaBlu';
import { ChevronDown, ChevronUp, AlertTriangle, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlertCardProps {
    alert: Dado;
    expanded?: boolean;
}

export default function AlertCard({ alert, expanded = false }: AlertCardProps) {
    const [isExpanded, setIsExpanded] = useState(expanded);
    
    // Determine o tipo de ícone baseado no tipo de alerta
    const renderIcon = () => {
        switch (alert.tipo) {
            case 'cch':
                return <Droplets className="h-5 w-5 text-blue-500" />;
            case 'pes':
                return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            default:
                return <AlertTriangle className="h-5 w-5 text-gray-500" />;
        }
    };

    // Encontrar o nível mais alto (mais crítico) entre as regiões
    const highestLevel = Math.max(...alert.sitregioes.map(sr => sr.condicao.nivel));
    
    // Determinar cor de fundo baseado no nível mais crítico
    const getBgColor = () => {
        const criticalRegion = alert.sitregioes.find(sr => sr.condicao.nivel === highestLevel);
        return criticalRegion?.condicao.cor_fundo || '#ffffff';
    };
    
    // Determinar cor do texto baseado no nível mais crítico
    const getTextColor = () => {
        const criticalRegion = alert.sitregioes.find(sr => sr.condicao.nivel === highestLevel);
        return criticalRegion?.condicao.cor_fonte || '#000000';
    };

    // Formatar a data de criação
    const formattedDate = format(
        new Date(alert.create_data), 
        "dd 'de' MMMM', às' HH:mm", 
        { locale: ptBR }
    );

    // Determinar o nome da condição crítica
    const getCriticalCondition = () => {
        const criticalRegion = alert.sitregioes.find(sr => sr.condicao.nivel === highestLevel);
        return criticalRegion?.condicao.condicao || '';
    };

    return (
        <div 
            className="rounded-lg overflow-hidden shadow-md border border-gray-200 h-full flex flex-col bg-white"
        >
            <div 
                className="p-3 flex justify-between items-center cursor-pointer"
                style={{ 
                    borderLeft: `4px solid ${getBgColor()}`,
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    {renderIcon()}
                    <div className="ml-3">
                        <h3 className="font-semibold text-md">{alert.tipoNome}</h3>
                        <p className="text-xs text-gray-500">{formattedDate}</p>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <span 
                        className="px-2 py-1 rounded-full text-xs font-medium mr-2"
                        style={{ 
                            backgroundColor: getBgColor(), 
                            color: getTextColor() 
                        }}
                    >
                        {getCriticalCondition()}
                    </span>
                    {!expanded && (
                        isExpanded ? 
                            <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                </div>
            </div>

            {(isExpanded || expanded) && (
                <div className="p-3 border-t border-gray-100 bg-gray-50 flex-grow">
                    {alert.descricao && (
                        <p className="mb-3 text-sm text-gray-700 italic">{alert.descricao}</p>
                    )}
                    
                    <h4 className="font-medium mb-2 text-sm">Situação por região:</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {alert.sitregioes.map((sitregiao, index) => (
                            <div 
                                key={index}
                                className="border rounded overflow-hidden text-sm"
                            >
                                <div 
                                    className="p-2 font-medium"
                                    style={{ 
                                        backgroundColor: sitregiao.condicao.cor_fundo,
                                        color: sitregiao.condicao.cor_fonte
                                    }}
                                >
                                    {sitregiao.regiao.nome} - {sitregiao.condicao.condicao}
                                </div>
                                <div className="p-2">
                                    <span className="font-medium">Bairros:</span>{' '}
                                    <span className="text-gray-600">
                                        {sitregiao.regiao.bairros.join(', ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}