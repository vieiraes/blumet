import { SitRegiao } from '@/types/alertaBlu';

interface RegionCardProps {
  sitregiao: SitRegiao;
}

export default function RegionCard({ sitregiao }: RegionCardProps) {
  const { regiao, condicao } = sitregiao;
  
  return (
    <div 
      className="rounded-lg p-4 shadow-md"
      style={{ 
        backgroundColor: condicao.cor_fundo,
        color: condicao.cor_fonte 
      }}
    >
      <h2 className="text-xl font-bold mb-2">{regiao.nome}</h2>
      <div className="text-sm">
        <h3 className="font-semibold mb-1">Bairros:</h3>
        <ul className="list-disc list-inside">
          {regiao.bairros.map((bairro) => (
            <li key={bairro}>{bairro}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
