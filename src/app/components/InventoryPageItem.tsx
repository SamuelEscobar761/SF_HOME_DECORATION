import { useState } from "react";
import SeeIcon from "../../assets/See-Icon.svg";
import SellIcon from "../../assets/Sell-Icon.svg";
import RefreshIcon from "../../assets/Refresh-Icon.svg";
import React from "react";

export const InventoryPageItem = ({
  setItemToMove,
  setItemToShow,
  item,
}: {
  setItemToMove: any;
  setItemToShow: any;
  item: any;
}) => {
  const totalStockUnits = item.locations.reduce(
    (sum: number, location: any) => sum + location.units,
    0
  );
  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);
  return (
    <div
      id="item-component"
      className="relative bg-neutral-300 p-2 rounded text-neutral-900"
    >
      <div id="options-button" className="absolute right-1 top-2">
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
        <div className="absolute right-0 top-4 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-y-auto">
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
          </ul>
        </div>
      )}
      <div id="inventory-item-header" className="flex">
        <div
          id="inventory-item-image-container"
          className="w-[120px] h-[120px] shrink-0 bg-neutral-100 rounded"
        >
          <img src={item.image} />
        </div>
        <div id="title-provider-container" className="ml-2">
          <p className="text-xl mr-2 break-all">{item.name}</p>
          <p className="text-base text-neutral-600">{item.provider}</p>
        </div>
      </div>
      <div id="inventory-item-content" className="mt-2 text-base">
        <div id="stock" className="grid grid-cols-5 gap-4 mt-4">
          {item.locations.map((location: any, index: number) => (
            <React.Fragment key={index}>
              <p className="font-bold">{location.name}</p>
              <p className="text-right">{location.units}</p>
              <p className="col-span-3 ml-5">
                {(location.units * item.price).toFixed(2)} Bs
              </p>
            </React.Fragment>
          ))}
          <p className="font-bold">Total</p>
          <p className="text-right">{totalStockUnits}</p>
          <p className="col-span-3 ml-5">
            {(totalStockUnits * item.price).toFixed(2)} Bs
          </p>
        </div>

        <div id="inventory-item-footer" className="flex justify-between mt-1">
          <div>
            <div className="flex">
              <img src={RefreshIcon} className="w-5 h-5" />
              <p>15 días</p>
            </div>
            <div className="mt-1 flex">
              <img src={SellIcon} className="sell-green-icon w-5 h-5" />
              <p>{item.utilitiesAvg.toFixed(2)} Bs</p>
            </div>
          </div>
          <div className="flex items-end">
            <div
              id="inventory-page-item-see-button"
              className="bg-tertiary p-2 rounded mr-2"
              onClick={() => {
                setItemToShow({});
              }}
            >
              <img src={SeeIcon} className="w-5 h-5" />
            </div>
            <div
              className="bg-secondary p-1 rounded"
              onClick={() => {
                setItemToMove({});
              }}
            >
              <p className="text-neutral-100 text-xl">Re-ubicar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
