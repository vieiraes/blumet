'use client';
import { 
  AlertTriangle, 
  DropletIcon, 
  Wind,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Dado } from '@/types/alertaBlu';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlertStatsProps {
  alerts: Dado[];
  onRegionClick?: (region: string) => void;
  onLevelClick?: (level: number) => void;
}

export default function AlertStats({ alerts, onRegionClick, onLevelClick }: AlertStatsProps) {
  const [showAllStats, setShowAllStats] = useState(false);

  // Contar tipos de alertas
  const alertTypeCount = alerts.reduce((acc, alert) => {
    acc[alert.tipo] = (acc[alert.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Extrair todas as regiões e níveis de condição
  const allRegionsAndLevels = alerts.flatMap(alert => 
    alert.sitregioes.map(sr => ({
      region: sr.regiao.nome,
      level: sr.condicao.nivel,
      condition: sr.condicao.condicao,
      color: sr.condicao.cor_fundo,
      textColor: sr.condicao.cor_fonte,
    }))
  );
  
  // Agrupar por região
  const regionStats = allRegionsAndLevels.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = { 
        maxLevel: 0, 
        condition: '', 
        color: '',
        textColor: ''
      };
    }
    
    if (item.level > acc[item.region].maxLevel) {
      acc[item.region].maxLevel = item.level;
      acc[item.region].condition = item.condition;
      acc[item.region].color = item.color;
      acc[item.region].textColor = item.textColor;
    }
    
    return acc;
  }, {} as Record<string, { maxLevel: number, condition: string, color: string, textColor: string }>);
  
  // Ordenar regiões pelo nível (crítico primeiro)
  const sortedRegions = Object.entries(regionStats)
    .sort(([, a], [, b]) => b.maxLevel - a.maxLevel)
    .slice(0, showAllStats ? undefined : 5);
  
  // Contar níveis de alerta
  const levelCounts = allRegionsAndLevels.reduce((acc, item) => {
    acc[item.level] = (acc[item.level] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Encontrar alerta mais recente
  const latestAlert = alerts.length > 0 
    ? alerts.reduce((latest, current) => 
        new Date(current.create_data) > new Date(latest.create_data) ? current : latest
      ) 
    : null;
  
  const latestTime = latestAlert 
    ? format(new Date(latestAlert.create_data), "dd/MM 'às' HH:mm", { locale: ptBR })
    : '';

  // Determinar nível crítico geral
  const criticalLevel = Math.max(...Object.keys(levelCounts).map(Number));
  const criticalColor = criticalLevel >= 3 ? 'text-amber-600' : 'text-blue-600';
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-gray-800">Resumo da Situação</h2>
        {latestTime && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Atualizado {latestTime}</span>
          </div>
        )}
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card de contagem de alertas */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-700 mb-3">Alertas Ativos</h3>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              {alertTypeCount['cch'] && (
                <div className="flex items-center">
                  <DropletIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-2xl font-bold text-blue-800">{alertTypeCount['cch']}</span>
                </div>
              )}
              
              {alertTypeCount['pes'] && (
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-2xl font-bold text-amber-800">{alertTypeCount['pes']}</span>
                </div>
              )}
              
              {alertTypeCount['ven'] && (
                <div className="flex items-center">
                  <Wind className="h-5 w-5 text-emerald-600 mr-2" />
                  <span className="text-2xl font-bold text-emerald-800">{alertTypeCount['ven']}</span>
                </div>
              )}
            </div>
            
            <div className="text-3xl font-bold text-gray-800">
              {alerts.length}
            </div>
          </div>
        </div>
        
        {/* Card de níveis */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-700 mb-3">Níveis de Condição</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].filter(level => levelCounts[level]).map(level => {
              let color, bgColor, label;
              
              switch(level) {
                case 4:
                  color = 'text-red-600';
                  bgColor = 'bg-red-100';
                  label = 'Alerta';
                  break;
                case 3:
                  color = 'text-amber-600';
                  bgColor = 'bg-amber-100';
                  label = 'Atenção';
                  break;
                case 2:
                  color = 'text-yellow-600';
                  bgColor = 'bg-yellow-100';
                  label = 'Observação';
                  break;
                default:
                  color = 'text-green-600';
                  bgColor = 'bg-green-100';
                  label = 'Normalidade';
              }
              
              return (
                <div 
                  key={level} 
                  className={`flex justify-between items-center p-2 rounded-md ${bgColor} cursor-pointer hover:opacity-90`}
                  onClick={() => onLevelClick && onLevelClick(level)}
                >
                  <span className={`font-medium ${color}`}>{label}</span>
                  <span className={`font-bold ${color}`}>{levelCounts[level]}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Card de regiões */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-blue-700">Regiões Afetadas</h3>
            <button 
              onClick={() => setShowAllStats(!showAllStats)} 
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showAllStats ? 'Mostrar menos' : 'Ver todas'}
            </button>
          </div>
          
          <div className="space-y-2">
            {sortedRegions.map(([region, stats]) => (
              <div 
                key={region} 
                className="flex justify-between items-center p-2 rounded-md border border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={() => onRegionClick && onRegionClick(region)}
                style={{ 
                  borderLeftWidth: '4px',
                  borderLeftColor: stats.color || '#e5e7eb'
                }}
              >
                <span className="font-medium text-gray-800">{region}</span>
                <span 
                  className="text-sm px-2 py-1 rounded-full font-medium"
                  style={{ 
                    backgroundColor: stats.color || '#e5e7eb',
                    color: stats.textColor || '#000000'
                  }}
                >
                  {stats.condition}
                </span>
              </div>
            ))}
            
            {!showAllStats && Object.keys(regionStats).length > 5 && (
              <button 
                onClick={() => setShowAllStats(true)}
                className="w-full py-2 text-sm text-center text-blue-600 hover:text-blue-800 flex items-center justify-center"
              >
                <span>Ver mais {Object.keys(regionStats).length - 5} regiões</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}