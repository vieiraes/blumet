// Aviso de versão nova do app (service worker): a pessoa escolhe quando recarregar.
import { useRegisterSW } from 'virtual:pwa-register/react';

export function AtualizacaoApp() {
  const {
    needRefresh: [temVersaoNova, setTemVersaoNova],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registro) {
      // Procura versão nova a cada hora com o app aberto
      if (registro) setInterval(() => registro.update().catch(() => {}), 3600_000);
    },
  });
  if (!temVersaoNova) return null;
  return (
    <div role="status" className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-xl bg-marca px-4 py-3 text-sm text-white lg:mx-0 dark:text-slate-900">
      <span className="font-medium">Nova versão do BLUmet disponível.</span>
      <span className="flex gap-2">
        <button type="button" className="rounded-lg px-2 py-1 opacity-80 hover:opacity-100" onClick={() => setTemVersaoNova(false)}>
          Depois
        </button>
        <button type="button" className="rounded-lg bg-white/20 px-3 py-1 font-semibold hover:bg-white/30" onClick={() => updateServiceWorker(true)}>
          Atualizar
        </button>
      </span>
    </div>
  );
}
