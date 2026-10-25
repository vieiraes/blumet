// Marca do BLUmet (cabeçalho, navegação lateral e rodapé).
export const Logo = () => (
  <span className="flex items-center gap-2">
    <img src="/favicon.svg" alt="" width={28} height={28} className="h-7 w-7" />
    <span className="text-lg font-bold tracking-tight">
      BLU<span className="text-marca">met</span>
    </span>
  </span>
);
