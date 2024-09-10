export const OptionsButtonComponent = ({
  page,
  settings,
  newItem,
}: {
  page: string;
  settings: any;
  newItem: any;
}) => {
  return (
    <div id="options-button-component">
      {page === "InventoryPage" && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-y-auto">
          <ul className="py-1">
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Buscar
              </button>
            </li>
            {settings.foldersView! && (
              <li>
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Nueva Carpeta
                </button>
              </li>
            )}
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={newItem}>
                Nuevo artículo
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                En tienda
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                En almacen
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
