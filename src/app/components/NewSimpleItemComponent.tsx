import { useEffect, useState } from "react";
import SaveIcon from "../../assets/Save-Icon.svg";
import CloseIcon from "../../assets/Close-Icon.svg";
import { ColorImageComponent } from "./ColorImageComponent";
import { Manager } from "../classes/Manager";
import { SimpleItem } from "../classes/SimpleItem";
import { Replenishment } from "../classes/Replenishment";
import { ReplenishmentList } from "./ReplenishmentsList";
import { ColorUnitsComponent } from "./ColorUnitsComponent";

interface NewSimpleItemComponentProps {
  closeNewItem: () => void;
  saveNewItem: (item: SimpleItem, isNew: boolean) => Promise<void> | void;
  fullItem?: boolean;
  item?: SimpleItem;
}

export const NewSimpleItemComponent = ({
  closeNewItem,
  saveNewItem,
  fullItem,
  item,
}: NewSimpleItemComponentProps) => {
  const [colorImages, setColorImages] = useState<ImageColor[]>(item?.getImages() || []);
  const [name, setName] = useState<string>(item?.getName() || "");
  const [provider, setProvider] = useState<string>(item?.getProvider().getName() || "");
  const [room, setRoom] = useState<string>(item?.getRoom() || "");
  const [material, setMaterial] = useState<string>(item?.getMaterial() || "");
  const [price, setPrice] = useState<string>(item?.getPrice().toString() || "");
  const [cost, setCost] = useState<string>("");
  const [canSave, setCanSave] = useState(false);
  const [colorUnits, setColorUnits] = useState<Map<string, number>>(item?.getColorUnits() || new Map());
  const [totalUnits, setTotalUnits] = useState<number>(0);

  const replenishments = item?.getReplenishments().map(replenishment => new Replenishment(
    replenishment.getId(),
    replenishment.getItem(),
    replenishment.getOrderDate(),
    replenishment.getArriveDate(),
    replenishment.getUnitCost(),
    replenishment.getUnitDiscount(),
    replenishment.getTotalDiscount(),
    replenishment.getLocations()
  )) || [];

  const save = async () => {
    if (!item) {
      const newItem = new SimpleItem(
        null,
        0,
        name,
        parseFloat(price) || 0,
        colorImages,
        room,
        material,
        await Manager.getInstance().ensureProviderExists(provider)
      );
      const replenishment = new Replenishment(
        0,
        newItem,
        new Date(),
        new Date(),
        parseFloat(cost),
        0,
        0,
        new Map([["Almacén", colorUnits]])
      );
      newItem.setReplenishments([replenishment])
      saveNewItem(newItem, true);
    } else {
      item.setImages(colorImages);
      item.setMaterial(material);
      item.setName(name);
      item.setPrice(parseFloat(price));
      item.setProvider(await Manager.getInstance().ensureProviderExists(provider));
      item.setReplenishments(replenishments);
      item.setRoom(room);
      saveNewItem(item, false);
    }

    closeNewItem();
  };

  const handleTotalUnitsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uniqueColors = new Set(colorImages.map(colorImage => colorImage.color));
    uniqueColors.forEach(color => {
      const units = Math.floor(parseInt(event.target.value) / uniqueColors.size);
      colorUnits.set(color, units);
    });
    setTotalUnits(parseFloat(event.target.value));
  };

  const handleColorUnitChange = (color: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newColorUnits = new Map(colorUnits);
    newColorUnits.set(color, parseInt(event.target.value) || 0);
    setColorUnits(newColorUnits);
    setTotalUnits(Array.from(newColorUnits.values()).reduce((acc, value) => acc + value, 0));
  };

  useEffect(() => {
    const validateForm = () => {
      const validPrice = !fullItem || parseFloat(price) > 0;
      const validCost = !fullItem || parseFloat(cost) > 0;
      setCanSave(name !== "" && provider !== "" && validPrice && validCost);
    };

    validateForm();
  }, [name, provider, price, cost]);

  return (
    <div id="show-new-item-component" className="bg-neutral-300 p-2 rounded">
      <div id="close-full-item" className="fixed top-2 left-2 z-50 border border-neutral-600 rounded p-1" onClick={closeNewItem}>
        <img src={CloseIcon} className="w-5 h-5" />
      </div>
      <ColorImageComponent colorImages={colorImages} setColorImages={setColorImages} />
      <div id="new-item-component-content" className="bg-neutral-400 p-2 rounded text-lg space-y-2 mt-2">
        <div id="new-item-title">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {!item?.getMultiItem() && (
          <div id="new-item-provider">
            <input
              type="text"
              placeholder="Proveedor"
              className="w-full p-2 rounded"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            />
          </div>
        )}
        <div id="new-item-room">
          <input
            type="text"
            placeholder="Habitación"
            className="w-full p-2 rounded"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <div id="new-item-material">
          <input
            type="text"
            placeholder="Material"
            className="w-full p-2 rounded"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
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
              onChange={(e) => setPrice(e.target.value)}
            />
            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
        </div>
        {item && !item.getMultiItem() ? (
          <ReplenishmentList replenishments={replenishments} />
        ) : (fullItem !== false && !item?.getMultiItem() && (
          <div id="new-item-cost-container" className="flex space-x-1">
            <input
              id="new-item-cost"
              type="number"
              placeholder="Costo"
              className="w-20 p-2 rounded"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
        ))}
        {fullItem !== false && !item && colorImages.length > 0 && (
          <div className="space-y-2 bg-neutral-100 rounded p-2">
            <p className="underline text-xl">Unidades por color:</p>
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
            <ColorUnitsComponent colorImages={colorImages} colorUnits={colorUnits} handleColorUnitChange={handleColorUnitChange} />
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
        <p id="new-item-price-cost-description" className="text-xs">
          *El precio es el monto por el cual se vende el item, el costo es lo que costó comprar el item
        </p>
        <div
          id="new-item-save-button"
          className={`w-full flex justify-center bg-success p-2 rounded ${!canSave ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={canSave ? save : undefined}
        >
          <img src={SaveIcon} />
          <p className="ml-1 text-2xl">Guardar</p>
        </div>
      </div>
    </div>
  );
};
