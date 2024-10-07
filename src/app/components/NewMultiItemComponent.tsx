import { useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import SaveIcon from "../../assets/Save-Icon.svg";
import { ColorImageComponent } from "./ColorImageComponent";
import { ImageNameComponent } from "./ImageNameComponent";
import { BasicItemListComponent } from "./BasicItemListComponent";
import { SimpleItem } from "../classes/SimpleItem";
import { Manager } from "../classes/Manager";
import { MultiItem } from "../classes/MultiItem";
import { NewSimpleItemComponent } from "./NewSimpleItemComponent";

export const NewMultiItemComponent = ({
  closeNewMultiItem,
}: {
  closeNewMultiItem: any;
}) => {
  const [colorImages, setColorImages] = useState<ImageColor[]>([]);
  const [allItems] = useState<SimpleItem[]>(
    Manager.getInstance().getSimpleItems()
  );
  const [selectedItems, setSelectedItems] = useState<SimpleItem[]>([]);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [units, setUnits] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [material, setMaterial] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [allItemsView, setAllItemsView] = useState<boolean>(false);
  const [newItemView, setNewItemView] = useState<boolean>(false);

  const addItem = (item: SimpleItem) => {
    setColorImages([...colorImages, ...item.getImages()]);
    setSelectedItems([...selectedItems, item]);
  };

  const saveSimpleItem = (item: SimpleItem) =>{
    setSelectedItems([...selectedItems, item]);
    setAllItemsView(false);
  }

  const save = async () => {
    const newMultiItem = new MultiItem(
      selectedItems,
      0,
      name,
      parseFloat(price),
      parseFloat(cost),
      new Map<string, number>([["almacen", parseFloat(units) || 0]]),
      colorImages,
      room,
      material,
      await Manager.getInstance().ensureProviderExists(provider)
    );
    Manager.getInstance().saveNewMultiItem(newMultiItem);
    closeNewMultiItem();
  };

  return (
    <div id="new-multi-item-component" className="bg-neutral-300 p-2 rounded">
      {newItemView ? (
        <div className="fixed inset-2 size-auto overflow-y-auto">
          <NewSimpleItemComponent
            closeNewItem={() => {
              setNewItemView(false);
            }}
            saveNewItem={saveSimpleItem}
            fullItem={false}
          />
        </div>
      ) : (
        <div
          id="close-full-item"
          className="fixed top-2 left-2 z-50 border border-neutral-600 rounded p-1"
          onClick={closeNewMultiItem}
        >
          <img src={CloseIcon} className="w-5 h-5" />
        </div>
      )}

      <ColorImageComponent
        colorImages={colorImages}
        setColorImages={setColorImages}
      />
      <div
        id="new-multi-item-selected-items"
        className="p-2 mt-2 bg-neutral-400 rounded space-y-2"
      >
        {selectedItems.length > 0 ? (
          selectedItems.map((item, index) => (
            <ImageNameComponent
              item={item}
              entireCost={parseFloat(cost) || 0}
              numberOfItems={selectedItems.length}
              key={index}
            />
          ))
        ) : (
          <button
            className="text-sm"
            onClick={() => {
              setAllItemsView(true);
            }}
          >
            Añade items
          </button>
        )}
        {allItemsView ? (
          <div id="new-multi-item-all-items" className="w-full">
            <BasicItemListComponent
              addItem={addItem}
              itemsList={allItems}
              closeBasicItemList={() => setAllItemsView(false)}
              createNewItem={() => {
                setNewItemView(true);
              }}
            />
          </div>
        ) : (
          <button
            id="new-multi-item-add-item-button"
            className="w-full text-3xl bg-success rounded text-neutral-900 p-1"
            onClick={() => {
              setAllItemsView(true);
            }}
          >
            +
          </button>
        )}
      </div>
      <div
        id="new-multi-item-content"
        className="p-2 mt-2 bg-neutral-400 rounded space-y-2"
      >
        <div id="new-multi-item-title">
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
        <div id="new-multi-item-provider">
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
        <div id="new-multi-item-room">
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
        <div id="new-multi-item-material">
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
        <div id="new-multi-item-price-units" className="mb-2 flex space-x-2">
          <div id="new-multi-item-price-container" className="flex space-x-1">
            <input
              id="new-multi-item-price"
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
            id="new-multi-item-units"
            type="number"
            placeholder="Unidades"
            className="w-full p-2 rounded"
            value={units}
            onChange={(e) => {
              setUnits(e.target.value);
            }}
          />
        </div>
        <div id="new-multi-item-cost-container" className="flex space-x-1">
          <input
            id="new-multi-item-cost"
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
          *El precio es el monto por el cual se vende el item y el costo es lo
          que costó comprar el item compuesto entero
        </p>
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
