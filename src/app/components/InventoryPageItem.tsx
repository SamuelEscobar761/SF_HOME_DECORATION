import { useState } from "react";

export const InventoryPageItem = () => {
  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);
  return (
    <div id="item-component">
      <div id="options-button">
        <button
          onClick={() => setOptionsIsOpen(!optionsIsOpen)}
          className="flex flex-col justify-center items-center w-6 h-6 bg-transparent rounded focus:outline-none"
        >
          <span className="block w-1 h-1 bg-black rounded-full mb-1"></span>
          <span className="block w-1 h-1 bg-black rounded-full mb-1"></span>
          <span className="block w-1 h-1 bg-black rounded-full"></span>
        </button>
      </div>
      <div id="inventory-item-header">
        <div id="inventory-item-image-container">
          <img />
        </div>
        <div id="title-provider-container">
          <p className="text-2xl">Title</p>
          <p className="text-base">Provider</p>
        </div>
      </div>
      <div id="inventory-item-content">
        <div id="stock-units">
            <p>Unidades en stock:</p>
            <p>15</p>
        </div>
        <div id="stock-units-value">
            <p>Valor total en stock:</p>
            <p>2400.00 Bs</p>
        </div>
        <div id="locations">
            <p>Ubicaciones:</p>
            <p>2</p>
        </div>
        <div id="inventory-item-footer">
            <div>
                <div>
                <img/>
                <p>15 días</p>
                </div>
                <div>
                    <img/>
                    <p>210.00 Bs</p>
                </div>
            </div>
            <div>
                <img/>
            </div>
            <div>
                <p>Re-ubicar</p>
            </div>
        </div>
      </div>
    </div>
  );
};
