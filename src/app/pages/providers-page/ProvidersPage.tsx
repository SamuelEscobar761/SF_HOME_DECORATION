// pages/providers/ProvidersPage.tsx
import { useEffect, useState, useCallback } from "react";
import { ProviderCardComponent } from "../../components/ProviderCardComponent";
import { Manager } from "../../classes/Manager";
import { Provider } from "../../classes/Provider";
import { ProviderEditModal } from "./components/ProviderEditModal";

export const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filtered, setFiltered] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState<Provider | null>(null);

  useEffect(() => {
    (async () => {
      const list = await Manager.getInstance().loadProviders();
      setProviders(list);
      setFiltered(list);
    })();
  }, []);

  const doFilter = useCallback(
    (term: string) => {
      setFiltered(
        providers.filter((p) =>
          [p.getName(), p.getContactName(), p.getContactLastname()].some((f) =>
            f.toLowerCase().includes(term)
          )
        )
      );
    },
    [providers]
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value.toLowerCase();
    setSearchTerm(t);
    doFilter(t);
  };

  const openModal = (p: Provider) => {
    setCurrent(p);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // tras guardar, recarga lista
  const onSaved = async () => {
    const list = await Manager.getInstance().loadProviders();
    setProviders(list);
    doFilter(searchTerm);
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Buscar proveedores..."
          value={searchTerm}
          onChange={onSearch}
          className="border rounded-full px-3 py-2 w-full max-w-md focus:outline-none focus:ring"
        />
      </div>
      <div className="space-y-2">
        {filtered.map((p) => (
          <ProviderCardComponent
            key={p.getId()}
            provider={p}
            onClick={() => openModal(p)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500">Sin proveedores.</p>
        )}
      </div>

      {current && (
        <div className="top-0 left-0 inset-2 -">
          <ProviderEditModal
            provider={current}
            isOpen={modalOpen}
            onClose={closeModal}
            onSaved={onSaved}
          />
        </div>
      )}
    </div>
  );
};
