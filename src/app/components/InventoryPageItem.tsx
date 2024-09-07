import { useState } from "react";
import SeeIcon from "../../assets/See-Icon.svg";
import SellIcon from "../../assets/Sell-Icon.svg";
import RefreshIcon from "../../assets/Refresh-Icon.svg"

export const InventoryPageItem = () => {
  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);
  return (
    <div
      id="item-component"
      className="relative bg-neutral-300 p-2 m-2 rounded text-neutral-900"
    >
      <div id="options-button" className="absolute right-1 top-1">
        <button
          onClick={() => setOptionsIsOpen(!optionsIsOpen)}
          className="flex flex-col justify-center items-center w-6 h-6 bg-transparent rounded focus:outline-none"
        >
          <span className="block w-1 h-1 bg-black rounded-full mb-1"></span>
          <span className="block w-1 h-1 bg-black rounded-full mb-1"></span>
          <span className="block w-1 h-1 bg-black rounded-full"></span>
        </button>
      </div>
      {optionsIsOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Editar
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Eliminar
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                En tienda: 5
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                En almacen: 10
              </button>
            </li>
          </ul>
        </div>
      )}
      <div id="inventory-item-header" className="flex">
        <div
          id="inventory-item-image-container"
          className="w-[120px] h-[120px] shrink-0 bg-neutral-100 rounded"
        >
          <img />
        </div>
        <div id="title-provider-container" className="ml-2">
          <p className="text-xl mr-2 break-all">Title</p>
          <p className="text-base text-neutral-600">Provider</p>
        </div>
      </div>
      <div id="inventory-item-content" className="mt-2 text-base">
        <div id="stock-units" className="flex justify-between">
          <p>Unidades en stock:</p>
          <p>15</p>
        </div>
        <div id="stock-units-value" className="flex justify-between mt-1">
          <p>Valor total en stock:</p>
          <p>2476.00 Bs</p>
        </div>
        <div id="locations" className="flex justify-between mt-1">
          <p>Ubicaciones:</p>
          <p>2</p>
        </div>
        <div id="inventory-item-footer" className="flex justify-between mt-1">
          <div>
            <div className="flex">
              <img src={RefreshIcon} className="w-5 h-5"/>
              <p>15 días</p>
            </div>
            <div className="mt-1 flex">
              <img src={SellIcon} className="sell-green-icon w-5 h-5"/>
              <p>210.00 Bs</p>
            </div>
          </div>
          <div className="flex items-end">
            <div className="bg-tertiary p-2 rounded mr-2">
              <img src={SeeIcon} className="w-5 h-5"/>
            </div>
            <div className="bg-secondary p-1 rounded">
              <p className="text-neutral-100 text-xl">Re-ubicar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
