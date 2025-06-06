import { useEffect, useState } from "react";
import { ProviderCardComponent } from "../../components/ProviderCardComponent";
import { OptionsButtonComponent } from "../../components/OptionsButtonComponent";
import { Manager } from "../../classes/Manager";
import { Provider } from "../../classes/Provider";

export const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase(); // Pasamos el valor a minúsculas
    setSearchTerm(value);

    // Filtramos solo si hay items disponibles
    // if (items.length > 0) {
    //   const filtered = items.filter(
    //     (item) =>
    //       item.title.toLowerCase().includes(value) ||
    //       item.provider.toLowerCase().includes(value)
    //   );
    //   setFilteredItems(filtered);
    // }
  };
  useEffect(()=>{
    const loadProviders = async () =>{
      setProviders(await Manager.getInstance().getProviders());
    }
    loadProviders();
  }, [])
  return (
    <div id="provider-page" className="min-h-screen p-2 space-y-4">
      <div id="provider-page-top-buttons" className="flex justify-between">
        <div id="search-bar">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearch}
            className="rounded-full py-1 px-2 text-base border border-neutral-900"
          />
        </div>
        <div id="options-button">
          <button
            onClick={() => setOptionsIsOpen(!optionsIsOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 bg-transparent rounded focus:outline-none"
          >
            <span className="block w-1 h-1 bg-black rounded-full mb-1"></span>
            <span className="block w-1 h-1 bg-black rounded-full mb-1"></span>
            <span className="block w-1 h-1 bg-black rounded-full"></span>
          </button>
        </div>
        {optionsIsOpen && (
          <div
            id="inventory-page-options-container"
            className="fixed w-screen h-screen z-40"
            onClick={() => {
              setOptionsIsOpen(false);
            }}
          >
            <OptionsButtonComponent settings={[]} />
          </div>
        )}
      </div>
      <div id="providers-cards-container" className="space-y-2">
        {providers.map((provider, index) => (
          <ProviderCardComponent key={index} />
        ))}
      </div>
    </div>
  );
};
