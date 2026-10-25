import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './componentes/Layout.tsx';
import { Esqueleto } from './componentes/ui.tsx';
import { Inicio } from './paginas/Inicio.tsx';

// A tela inicial vem no pacote principal; as outras carregam sob demanda
const RioPagina = lazy(() => import('./paginas/RioPagina.tsx').then((m) => ({ default: m.RioPagina })));
const ChuvaPagina = lazy(() => import('./paginas/ChuvaPagina.tsx').then((m) => ({ default: m.ChuvaPagina })));
const AbrigosPagina = lazy(() => import('./paginas/AbrigosPagina.tsx').then((m) => ({ default: m.AbrigosPagina })));
const MaisPagina = lazy(() => import('./paginas/MaisPagina.tsx').then((m) => ({ default: m.MaisPagina })));
const LegalPagina = lazy(() => import('./paginas/LegalPagina.tsx').then((m) => ({ default: m.LegalPagina })));

export function App() {
  return (
    <Layout>
      <Suspense fallback={<Esqueleto altura="h-64" />}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/rio" element={<RioPagina />} />
          <Route path="/chuva" element={<ChuvaPagina />} />
          <Route path="/abrigos" element={<AbrigosPagina />} />
          <Route path="/mais" element={<MaisPagina />} />
          <Route path="/privacidade" element={<LegalPagina tipo="privacidade" />} />
          <Route path="/termos" element={<LegalPagina tipo="termos" />} />
          <Route path="/cookies" element={<LegalPagina tipo="cookies" />} />
          <Route path="/sobre" element={<Navigate to="/mais" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
