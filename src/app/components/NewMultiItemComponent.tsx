import { useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import SaveIcon from "../../assets/Save-Icon.svg";
import { ColorImageComponent } from "./ColorImageComponent";
import { SelectedItemComponent } from "./SelectedItemComponent";
import { AllItemsComponent } from "./AllItemsComponent";
import { SimpleItem } from "../classes/SimpleItem";
import { Manager } from "../classes/Manager";
import { MultiItem } from "../classes/MultiItem";
import { NewSimpleItemComponent } from "./NewSimpleItemComponent";
import { Replenishment } from "../classes/Replenishment";
import { Item } from "../classes/Item";
import { ReplenishmentList } from "./ReplenishmentsList";
import { ColorUnitsComponent } from "./ColorUnitsComponent";

export const NewMultiItemComponent = ({
  closeNewMultiItem,
  item,
  saveNewItem,
}: {
  closeNewMultiItem: any;
  item?: MultiItem;
  saveNewItem: (item: MultiItem, isNew: boolean) => Promise<void> | void;
}) => {
  const [colorImages, setColorImages] = useState<ImageColor[]>([]);
  const [allItems] = useState<SimpleItem[]>(
    Manager.getInstance()
      .getSimpleItems()
      .filter((item) => {
        return !item.getMultiItem();
      })
  );
  const [selectedItems] = useState<SimpleItem[]>(item?.getSimpleItems() || []);
  const [name, setName] = useState<string>(item?.getName() || "");
  const [price, setPrice] = useState<string>(item?.getPrice().toString() || "");
  const [cost, setCost] = useState<string>("");
  const [colorUnits, setColorUnits] = useState<Map<string, number>>(item?.getColorUnits() || new Map());
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [room, setRoom] = useState<string>(item?.getRoom() || "");
  const [material, setMaterial] = useState<string>(item?.getMaterial() || "");
  const [provider, setProvider] = useState<string>(
    item?.getProvider().getName() || ""
  );
  const [allItemsView, setAllItemsView] = useState<boolean>(false);
  const [newItemView, setNewItemView] = useState<boolean>(false);
  const replenishments =
    item
      ?.getReplenishments()
      .map(
        (replenishment) =>
          new Replenishment(
            replenishment.getId(),
            replenishment.getItem(),
            replenishment.getOrderDate(),
            replenishment.getArriveDate(),
            replenishment.getUnitCost(),
            replenishment.getUnitDiscount(),
            replenishment.getTotalDiscount(),
            replenishment.getLocations()
          )
      ) || [];

  const addItem = (itemToAdd: Item) => {
    const newItem = new SimpleItem(
      item ? item : null,
      0,
      itemToAdd.getName(),
      itemToAdd.getPrice(),
      itemToAdd.getImages(),
      itemToAdd.getRoom(),
      itemToAdd.getMaterial(),
      itemToAdd.getProvider()
    );
    const replenishment = new Replenishment(
      0,
      newItem,
      new Date(),
      new Date(),
      0,
      0,
      0,
      new Map<string, Map<string, number>>()
    );
    newItem.setReplenishments([replenishment]);
    setColorImages([...colorImages, ...newItem.getImages()]);
    selectedItems.push(newItem);
    setAllItemsView(false);
  };

  const handleColorUnitChange = (color: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newColorUnits = new Map(colorUnits);
    newColorUnits.set(color, parseInt(event.target.value) || 0);
    setColorUnits(newColorUnits);
    setTotalUnits(Array.from(newColorUnits.values()).reduce((acc, value) => acc + value, 0));
  };

  const handleTotalUnitsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uniqueColors = new Set(colorImages.map(colorImage => colorImage.color));
    uniqueColors.forEach(color => {
      const units = Math.floor(parseInt(event.target.value) / uniqueColors.size);
      colorUnits.set(color, units);
    });
    setTotalUnits(parseFloat(event.target.value));
  };

  const handleCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCost(event.target.value);
    selectedItems.forEach((selectedItem)=>{
      const percentage = selectedItem.getTempPercentage() || 0;
      selectedItem.getReplenishments()[0].setUnitCost(parseFloat(event.target.value)*percentage/100);
    })
  }

  const save = async () => {
    if (item) {
      //Modificar el multi item con la información actualizada
      item.setName(name);
      item.setProvider(
        await Manager.getInstance().ensureProviderExists(provider)
      );
      item.setRoom(room);
      item.setMaterial(material);
      item.setPrice(parseFloat(price));
      item.setReplenishments(replenishments);
      //Modificar cada item con la información padre del multi item
      for (const selectedItem of selectedItems) {
        Manager.getInstance().ensureItemSaved(selectedItem);
        selectedItem.setPercentage(selectedItem.getTempPercentage()!);
        selectedItem.setProvider(item.getProvider());
        selectedItem.setRoom(item.getRoom());
        selectedItem.setMaterial(item.getMaterial());
        selectedItem.setReplenishments(
          item.getReplenishments().map((replenishment) => {
            // Clonar el replenishment con el nuevo item
            const clonedReplenishment =
              replenishment.cloneWithNewItem(selectedItem);
            // Obtener el nuevo costo unitario basado en el porcentaje correspondiente
            const newUnitCost =
              (selectedItem.getPercentage()! / 100) *
              replenishment.getUnitCost();
            // Establecer el nuevo costo unitario al replenishment clonado
            clonedReplenishment.setUnitCost(newUnitCost);
            return clonedReplenishment;
          })
        );
      }
      saveNewItem(item, false);
    } else {
      for (const selectedItem of selectedItems) {
        selectedItem.setPercentage(selectedItem.getTempPercentage()!);
        selectedItem.getReplenishments()[0].setLocations(
          new Map([["Almacén", colorUnits]])
        );
      }
      const newMultiItem = new MultiItem(
        selectedItems,
        0,
        name,
        parseFloat(price),
        colorImages,
        room,
        material,
        await Manager.getInstance().ensureProviderExists(provider)
      );
      const replenishment = new Replenishment(
        0,
        newMultiItem,
        new Date(),
        new Date(),
        parseFloat(cost),
        0,
        0,
        new Map([["Almacén", colorUnits]])
      );
      newMultiItem.setReplenishments([replenishment]);
      const result = await Manager.getInstance().saveNewMultiItem(newMultiItem);
      if (result) {
        saveNewItem(newMultiItem, true);
      }
    }
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
            saveNewItem={addItem}
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
          selectedItems.map((selectedItem, index) => (
            <SelectedItemComponent
              item={selectedItem}
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
          <div
            id="new-multi-item-all-items"
            className="w-full h-96 overflow-y-auto rounded"
          >
            <AllItemsComponent
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
          {!item && (
          <div id="new-multi-item-cost-container" className="flex space-x-1">
            <input
              id="new-multi-item-cost"
              type="number"
              placeholder="Costo"
              className="w-20 p-2 rounded"
              value={cost}
              onChange={handleCostChange}
            />
            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
          )}
        </div>
        {!item && colorImages.length > 0 && (
          <div className="space-y-2 bg-neutral-100 rounded p-2">
            <p className="underline text-lg">Unidades por color:</p>
            <div className="flex space-x-2 items-center">
              <label htmlFor="new-item-units">Total:</label>
              <input
                id="new-item-total-units"
                type="number"
                placeholder="Unds."
                className="w-20 p-2 rounded border border-neutral-900"
                value={totalUnits || ""}
                onChange={handleTotalUnitsChange}
              />
            </div>
            <ColorUnitsComponent colorImages={colorImages} colorUnits={colorUnits} handleColorUnitChange={handleColorUnitChange}/>
            {/* <div className="grid grid-cols-2 gap-2">
              {Array.from(new Set(colorImages.map(item => item.color))).map((color, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <div className="size-8 border border-neutral-900" style={{ background: color }}></div>
                  <input
                    id="new-item-units"
                    type="number"
                    placeholder="Unds."
                    className="w-20 p-2 rounded border border-neutral-900"
                    value={colorUnits.get(color) || ""}
                    onChange={(e) => handleColorUnitChange(color, e)}
                  />
                </div>
              ))}
            </div> */}
          </div>
        )}
        <p id="new-multi-item-price-cost-description" className="text-xs">
          *El precio es el monto por el cual se vende el item y el costo es lo
          que costó comprar el item compuesto entero
        </p>
        {item && (
          <div>
            <ReplenishmentList replenishments={replenishments} />
          </div>
        )}
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
