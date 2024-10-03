import { useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import SaveIcon from "../../assets/Save-Icon.svg";
import { ColorImageComponent } from "./ColorImageComponent";
import { ImageNameComponent } from "./ImageNameComponent";
import { BasicItemListComponent } from "./BasicItemListComponent";
import { getImageColors } from "../services/GetDBInformation";

export const NewMultiItemComponent = ({
  basicItems,
  closeNewMultiItem,
  saveComposedItem,
}: {
  basicItems: BasicItem[];
  closeNewMultiItem: any;
  saveComposedItem: (item: any) => void;
}) => {
  const [colorImages, setColorImages] = useState<ImageColor[]>([]);
  const [items, setItems] = useState<BasicItem[]>([]);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [units, setUnits] = useState<string>("")
  const [seeBasicItems, setSeeBasicItems] = useState<boolean>(false);

  const addItem = (item: BasicItem) => {
    setColorImages([...colorImages, ...getImageColors(item.id)]);
    setItems([...items, item]);
    setCost((prevCost) => parseFloat((prevCost + item.cost).toFixed(2)));
  };

  function getProvidersDisplay(basicItems: BasicItem[]): string {
    // Extraer todos los nombres de proveedores
    const providers = basicItems.map((item) => item.provider);

    // Crear un Set para obtener solo proveedores únicos
    const uniqueProviders = new Set(providers);

    // Convertir el Set de nuevo a un array y unirlo con " & " si hay más de un proveedor
    return Array.from(uniqueProviders).join(" & ");
  }

  const save = () => {
    closeNewMultiItem();
    saveComposedItem({
      id: 32,
      name: name,
      provider: getProvidersDisplay(items),
      price: parseFloat(price) || 0,
      cost: cost,
      image: colorImages[0].image,
      rotation: 0,
      utilitiesAvg: 0,
      locations: [
        {
          id: 1,
          name: "almacen",
          units: items.reduce(
            (minUnits, item) => (item.units < minUnits ? item.units : minUnits),
            basicItems[0].units
          ),
        },
      ],
    });
    console.log("Save composed item.");
  };

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
          <ImageNameComponent id={item.id} name={item.name} image={item.image} key={index} />
        ))}
        {seeBasicItems ? (
          <div id="basic-item-list-container" className="w-full">
            <BasicItemListComponent
              addItem={addItem}
              itemsList={basicItems}
              closeBasicItemList={() => setSeeBasicItems(false)}
            />
          </div>
        ) : (
          <button
            id="new-multi-item-add-item-button"
            className="w-full text-3xl bg-neutral-500 rounded text-neutral-100 p-1"
            onClick={() => {
              setSeeBasicItems(true);
            }}
          >
            +
          </button>
        )}
      </div>
      <div
        id="new-multi-item-information-container"
        className="p-2 mt-2 bg-neutral-400 rounded space-y-2"
      >
        <input
          id="new-multi-item-name"
          type="text"
          placeholder="Nombre"
          className="w-full p-2 rounded"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <p id="new-multi-item-price-cost-description" className="text-xs">
          *El precio es el monto por el cual se vende el item, el costo es lo
          que costó comprar el item
        </p>
        <div
          id="new-multi-item-price-cost-container"
          className="flex space-x-5 justify-between"
        >
          <div id="new-mutli-item-price-container" className="flex space-x-1">
            <input
              id="new-mutli-item-price"
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
          <div id="new-multi-item-cost-container" className="flex space-x-1">
            <input
              id="new-multi-item-cost"
              type="number"
              placeholder="Costo"
              className="w-full p-2 rounded bg-neutral-100"
            />

            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
        </div>
        <div className="w-full">
          <input
            type="number"
            name=""
            id=""
            placeholder="Unidades"
            className="w-24 p-2 rounded"
            value={units}
            onChange={(e) => {
              setUnits(e.target.value);
            }}
          />
        </div>
        <div
          id="new-multi-item-save-button"
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
