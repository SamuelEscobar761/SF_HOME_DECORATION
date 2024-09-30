import { useEffect, useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import SaveIcon from "../../assets/Save-Icon.svg";
import { ColorImageComponent } from "./ColorImageComponent";
import { ImageNameComponent } from "./ImageNameComponent";

interface Item {
  name: string;
  image: string;
}

export const NewMultiItemComponent = ({
  closeNewMultiItem,
}: {
  closeNewMultiItem: any;
}) => {
  const [colorImages, setColorImages] = useState<
    { image: string; color: string }[]
  >([]);
  const [items, setItems] = useState<Item[]>([]);
  const [price, setPrice] = useState<string>("");
  const [cost, setCost] = useState<string>("200.00");

  const save = () => {
    console.log("Save composed item.");
  };

  useEffect(() => {
    setItems([]);
  }, []);

  return (
    <div id="new-multi-item-component" className="bg-neutral-300 p-2 rounded">
      <div
        id="close-full-item"
        className="fixed top-2 left-2 z-50 border border-neutral-600 rounded p-1"
        onClick={closeNewMultiItem}
      >
        <img src={CloseIcon} className="w-5 h-5" />
      </div>
      <ColorImageComponent
        colorImages={colorImages}
        setColorImages={setColorImages}
      />
      <div
        id="new-multi-item-items-container"
        className="p-2 mt-2 bg-neutral-400 rounded space-y-2"
      >
        {items.map((item, index) => (
          <ImageNameComponent name={item.name} image={item.image} key={index} />
        ))}
        <button
          id="new-multi-item-add-item-button"
          className="w-full text-3xl bg-neutral-500 rounded text-neutral-100 p-1"
        >
          +
        </button>
      </div>
      <div
        id="new-multi-item-information-container"
        className="p-2 mt-2 bg-neutral-400 rounded space-y-2"
      >
        <p id="price-cost-description" className="text-xs">
          *El precio es el monto por el cual se vende el item, el costo es lo
          que costó comprar el item
        </p>
        <div
          id="new-item-price-cost-container"
          className="flex space-x-5 justify-between"
        >
          <div id="new-item-price-container" className="flex space-x-1">
            <input
              id="new-item-price"
              type="number"
              placeholder="Precio"
              className="w-full p-2 rounded"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
          <div id="new-item-cost-container" className="flex space-x-1">
            <p id="new-item-cost" className="w-full p-2 rounded bg-neutral-100">
              {cost}
            </p>
            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
        </div>

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
