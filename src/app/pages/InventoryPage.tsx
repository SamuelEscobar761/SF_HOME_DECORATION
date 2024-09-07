import { useState } from "react";
import { InventoryPageItem } from "../components/InventoryPageItem";
import { MoveItemComponent } from "../components/MoveItemComponent";

export const InventoryPage = () => {
  const [foldersView, setFoldersView] = useState<boolean>(false);
  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);
//   const [items, setItems] = useState<any[]>([1]);
  const [filteredItems] = useState<any[]>([1, 1, 1, 1, 1]);
  const [moveItemView, setMoveItemView] = useState<boolean>(false);

  const setMoveItem = (item: any) => {
    item[0];
    setMoveItemView(true);
  };

  return (
    <div>
      {moveItemView && (
        <div className="flex fixed z-40 w-screen h-screen justify-center bg-white/[0.40] py-6">
          <MoveItemComponent closeFunc={() => {setMoveItemView(false)}} />
        </div>
      )}
      <div className="flex">
        <div
          id="folders-button"
          className="p-2 bg-tertiary-light rounded m-2 border border-neutral-900 w-48"
          onClick={() => {
            setFoldersView(!foldersView);
          }}
        >
          <p>{foldersView ? "Todos los artículos" : "Carpetas"}</p>
        </div>
        <div id="options-button" className="absolute right-0">
          <button
            onClick={() => setOptionsIsOpen(!optionsIsOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 bg-transparent rounded focus:outline-none"
          >
            <span className="block w-1 h-1 bg-black rounded-full mb-1"></span>
            <span className="block w-1 h-1 bg-black rounded-full mb-1"></span>
            <span className="block w-1 h-1 bg-black rounded-full"></span>
          </button>
          {optionsIsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Buscar
                  </button>
                </li>
                {foldersView && (
                  <li>
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Nueva Carpeta
                    </button>
                  </li>
                )}
                <li>
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
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
      </div>

      <div id="inventory-page-content" className="mt-2">
        {!foldersView ? (
          filteredItems.map((item, index) => (
            <InventoryPageItem key={index} setItem={setMoveItem} item={item}/>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
