import { useEffect, useState } from "react";
import SaveIcon from "../../assets/Save-Icon.svg";
import CloseIcon from "../../assets/Close-Icon.svg";
import { ColorImageComponent } from "./ColorImageComponent";
import { Manager } from "../classes/Manager";
import { SimpleItem } from "../classes/SimpleItem";
import { Replenishment } from "../classes/Replenishment";
import { ReplenishmentList } from "./ReplenishmentsList";

export const NewSimpleItemComponent = ({
  closeNewItem,
  saveNewItem,
  fullItem,
  item,
}: {
  closeNewItem: () => void;
  saveNewItem: (item: SimpleItem, isNew: boolean) => Promise<void> | void;
  fullItem?: boolean;
  item?: SimpleItem;
}) => {
  const [colorImages, setColorImages] = useState<ImageColor[]>(
    item?.getImages() || []
  );
  const [name, setName] = useState<string>(item?.getName() || "");
  const [provider, setProvider] = useState<string>(
    item?.getProvider().getName() || ""
  );
  const [room, setRoom] = useState<string>(item?.getRoom() || "");
  const [material, setMaterial] = useState<string>(item?.getMaterial() || "");
  const [price, setPrice] = useState<string>(item?.getPrice().toString() || "");
  const [cost, setCost] = useState<string>("");
  const [units, setUnits] = useState<string>(
    item?.getTotalUnits().toString() || ""
  );
  const [canSave, setCanSave] = useState(false);
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

        new Map<string, number>([
          ["almacen", parseFloat(units) || 0],
          ["Tienda", 0],
        ])
      );
      newItem.replenish(replenishment);
      saveNewItem(newItem, true);
    } else {
      item.setImages(colorImages);
      item.setMaterial(material);
      item.setName(name);
      item.setPrice(parseFloat(price));
      item.setProvider(
        await Manager.getInstance().ensureProviderExists(provider)
      );
      item.setReplenishments(replenishments);
      item.setRoom(room);
      saveNewItem(item, false);
    }

    closeNewItem();
  };

  useEffect(() => {
    const validateForm = () => {
      const validPrice = !fullItem || parseFloat(price) > 0;
      const validCost = !fullItem || parseFloat(cost) > 0;
      const validUnits = !fullItem || parseInt(units) > 0;
      setCanSave(
        name !== "" && provider !== "" && validPrice && validCost && validUnits
      );
    };

    validateForm();
  }, [name, provider, price, cost, units]);

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
        {!item?.getMultiItem() && (
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
        )}
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
          {fullItem != false && !item && (
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
          )}
        </div>
        {item && !item.getMultiItem() ? (
          <div>
            <ReplenishmentList replenishments={replenishments} />
          </div>
        ) : (
          fullItem != false && !item?.getMultiItem() && (
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
          )
        )}
        <p id="new-item-price-cost-description" className="text-xs">
          *El precio es el monto por el cual se vende el item, el costo es lo
          que costó comprar el item
        </p>
        <div
          id="new-item-save-button"
          className={`w-full flex justify-center bg-success p-2 rounded ${
            !canSave ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={canSave ? save : undefined}
        >
          <img src={SaveIcon} />
          <p className="ml-1 text-2xl">Guardar</p>
        </div>
      </div>
    </div>
  );
};
