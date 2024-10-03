import { useState } from "react";
import SaveIcon from "../../assets/Save-Icon.svg";
import CloseIcon from "../../assets/Close-Icon.svg";
import { ColorImageComponent } from "./ColorImageComponent";
import { saveImageColors } from "../services/GetDBInformation";

export const ShowNewItemComponent = ({
  closeNewItem,
  saveNewItem,
}: {
  closeNewItem: () => void;
  saveNewItem: (item: any) => void;
}) => {
  const [colorImages, setColorImages] = useState<ImageColor[]>([]);
  const [name, setName] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [material, setMaterial] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [units, setUnits] = useState<string>("");

  const save = () => {
    saveNewItem({
      id: 22,
      name: name,
      provider: provider,
      price: parseFloat(price) || 0,
      cost: parseFloat(cost) || 0,
      image: colorImages[0].image,
      rotation: 0,
      utilitiesAvg: 0,
      locations: [{ id: 1, name: "almacen", units: units }],
    });
    saveImageColors(22, colorImages);
    closeNewItem();
  };

  return (
    <div id="show-new-item-component" className="bg-neutral-300 p-2 rounded">
      <div
        id="close-full-item"
        className="fixed top-2 left-2 z-50 border border-neutral-600 rounded p-1"
        onClick={closeNewItem}
      >
        <img src={CloseIcon} className="w-5 h-5" />
      </div>
      <ColorImageComponent
        colorImages={colorImages}
        setColorImages={setColorImages}
      />
      <div
        id="new-item-component-content"
        className="bg-neutral-400 p-2 rounded text-lg space-y-2 mt-2"
      >
        <div id="new-item-title">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 rounded"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div id="new-item-provider">
          <input
            type="text"
            placeholder="Proveedor"
            className="w-full p-2 rounded"
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
            }}
          />
        </div>
        <div id="new-item-room">
          <input
            type="text"
            placeholder="Habitación"
            className="w-full p-2 rounded"
            value={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
        </div>
        <div id="new-item-material">
          <input
            type="text"
            placeholder="Material"
            className="w-full p-2 rounded"
            value={material}
            onChange={(e) => {
              setMaterial(e.target.value);
            }}
          />
        </div>
        <div id="new-item-price-units" className="mb-2 flex space-x-2">
          <div id="new-item-price-container" className="flex space-x-1">
            <input
              id="new-item-price"
              type="number"
              placeholder="Precio"
              className="w-20 p-2 rounded"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
          <input
            id="new-item-units"
            type="number"
            placeholder="Unidades"
            className="w-full p-2 rounded"
            value={units}
            onChange={(e) => {
              setUnits(e.target.value);
            }}
          />
        </div>
        <div id="new-item-cost-container" className="flex space-x-1">
          <input
            id="new-item-cost"
            type="number"
            placeholder="Costo"
            className="w-20 p-2 rounded"
            value={cost}
            onChange={(e) => {
              setCost(e.target.value);
            }}
          />
          <p className="p-2 bg-neutral-100 rounded">Bs</p>
        </div>
        <p id="new-multi-item-price-cost-description" className="text-xs">
          *El precio es el monto por el cual se vende el item, el costo es lo
          que costó comprar el item
        </p>
        <div
          id="new-item-save-button"
          className="w-full flex justify-center bg-success p-2 rounded"
          onClick={save}
        >
          <img src={SaveIcon} />
          <p className="ml-1 text-2xl">Guardar</p>
        </div>
      </div>
    </div>
  );
};
