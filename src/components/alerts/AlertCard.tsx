'use client';
import { useState } from 'react';
import { Dado } from '@/types/alertaBlu';
import { ChevronDown, ChevronUp, CloudRain, AlertTriangle, MapPin, DropletIcon, Wind } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlertCardProps {
    alert: Dado;
    expanded?: boolean;
    isHighlighted?: boolean;
    userNeighborhood?: string | null;
}

export default function AlertCard({ alert, expanded = false, isHighlighted = false, userNeighborhood = null }: AlertCardProps) {
    const [isExpanded, setIsExpanded] = useState(expanded);
    
    // Determine o tipo de ícone baseado no tipo de alerta
    const renderIcon = () => {
        switch (alert.tipo) {
            case 'cch':
                return <DropletIcon className="h-6 w-6 md:h-8 md:w-8" />;
            case 'pes':
                return <AlertTriangle className="h-6 w-6 md:h-8 md:w-8" />;
            default:
                return <Wind className="h-6 w-6 md:h-8 md:w-8" />;
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
    
    // Determinar o nome da condição crítica
    const getCriticalCondition = () => {
        const criticalRegion = alert.sitregioes.find(sr => sr.condicao.nivel === highestLevel);
        return criticalRegion?.condicao.condicao || '';
    };

    // Verificar a formatação da data
    const formattedDate = format(
        new Date(alert.create_data), 
        "dd 'de' MMMM 'às' HH:mm", 
        { locale: ptBR }
    );

    // Verificar se o bairro do usuário está entre os bairros afetados
    const userNeighborhoodRegion = userNeighborhood ? 
        alert.sitregioes.find(sr => 
            sr.regiao.bairros.some((bairro: string) => 
                bairro.toLowerCase() === userNeighborhood.toLowerCase()
            )
        ) : null;
    
    // Determinar se este alerta deve ser destacado por causa do bairro do usuário
    const isUserNeighborhoodAffected = !!userNeighborhoodRegion;

    return (
        <div 
            className={`rounded-lg overflow-hidden shadow-md border transition-all duration-300 ${
                isHighlighted || isUserNeighborhoodAffected
                    ? 'shadow-lg border-2 border-blue-600 transform scale-[1.02]' 
                    : 'border-gray-200'
            } ${isUserNeighborhoodAffected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        >
            <div 
                className={`
                    px-4 py-3 rounded-lg border overflow-hidden transition-all
                    ${isHighlighted ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'} 
                    ${alert.tipo === 'pes' ? 'border-l-4 border-l-amber-500' : ''}
                `}
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ 
                    borderLeft: `8px solid ${getBgColor()}`,
                    background: highestLevel >= 3 
                        ? `linear-gradient(to right, ${getBgColor()}40, ${getBgColor()}10)`
                        : `${getBgColor()}20`,
                }}
            >
                {alert.tipo === 'pes' && (
                    <div className="mb-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded inline-flex items-center">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        Alerta de Escorregamento
                    </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex items-center">
                        <div 
                            className="p-3 rounded-full mr-3 flex-shrink-0"
                            style={{ 
                                backgroundColor: `${getBgColor()}40`,
                                color: getTextColor() 
                            }}
                        >
                            {renderIcon()}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 md:text-2xl">
                                {alert.tipoNome}
                            </h3>
                            <div className="flex items-center text-gray-600 mt-1">
                                <span className="text-sm md:text-base">{formattedDate}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <span 
                            className={`px-4 py-2 rounded-full text-base font-bold inline-flex items-center ${
                                highestLevel >= 3 ? 'animate-pulse shadow-md' : ''
                            }`}
                            style={{ 
                                backgroundColor: getBgColor(), 
                                color: getTextColor() 
                            }}
                        >
                            {getCriticalCondition()}
                        </span>
                        
                        <div className="ml-2">
                            {isExpanded ? 
                                <ChevronUp className="h-6 w-6 text-gray-500" /> : 
                                <ChevronDown className="h-6 w-6 text-gray-500" />
                            }
                        </div>
                    </div>
                </div>

                {isUserNeighborhoodAffected && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                        <p className="text-blue-700">
                            <span className="font-medium">Seu bairro está nesta região!</span> {" "}
                            {userNeighborhoodRegion && (
                                <span className="text-blue-600">
                                    Situação em {userNeighborhood}: {userNeighborhoodRegion.condicao.condicao}
                                </span>
                            )}
                        </p>
                    </div>
                )}
            </div>

            {isExpanded && (
                <div className="p-4 border-t border-gray-100 bg-white">
                    {alert.descricao && (
                        <p className="mb-4 text-gray-700 text-base md:text-lg">{alert.descricao}</p>
                    )}
                    
                    <h4 className="font-semibold mb-3 text-base md:text-lg">Situação por região:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {alert.sitregioes.map((sitregiao, index) => (
                            <div 
                                key={index}
                                className={`border rounded-lg overflow-hidden text-base ${
                                    userNeighborhood && 
                                    sitregiao.regiao.bairros.some(b => 
                                        b.toLowerCase() === userNeighborhood.toLowerCase()
                                    ) ? 'border-blue-300 shadow-md' : ''
                                }`}
                            >
                                <div 
                                    className="p-3 font-medium flex justify-between items-center"
                                    style={{ 
                                        backgroundColor: sitregiao.condicao.cor_fundo,
                                        color: sitregiao.condicao.cor_fonte
                                    }}
                                >
                                    <span>{sitregiao.regiao.nome}</span>
                                    <span className="font-bold">{sitregiao.condicao.condicao}</span>
                                </div>
                                <div className="p-3">
                                    <h5 className="font-medium mb-1 flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" /> Bairros:
                                    </h5>
                                    <div className="flex flex-wrap gap-1">
                                        {sitregiao.regiao.bairros.map((bairro, i) => (
                                            <span 
                                                key={i} 
                                                className={`px-2 py-1 rounded-full text-sm ${
                                                    userNeighborhood && 
                                                    userNeighborhood.toLowerCase() === bairro.toLowerCase()
                                                    ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200' 
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {bairro}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}