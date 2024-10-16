import { useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import ReplenishmentIcon from "../../assets/Replenishment-Icon.svg";
import { Item } from "../classes/Item";
import { Replenishment } from "../classes/Replenishment";

export const ReplenishmentComponent = ({
  item,
  closeReplenishmentView,
}: {
  item: Item;
  closeReplenishmentView: () => void;
}) => {
  const [cost, setCost] = useState<string>("");
  const [units, setUnits] = useState<string>("");
  const [storage, setStorage] = useState<string>("");
  const [unitDiscountPercentage, setUnitDiscountPercentage] =
    useState<string>("");
  const [unitDiscount, setUnitDiscount] = useState<string>("");
  const [totalDiscounPercentage, setTotalDiscountPercentage] =
    useState<string>("");
  const [totalDiscount, setTotalDiscount] = useState<string>("");
  const [newLocation, setNewLocation] = useState<string>("");
  const [arriveDate, setArriveDate] = useState<Date>(new Date());

  const replenish = () => {
    const replenishment = new Replenishment(
      0,
      item,
      new Date(),
      arriveDate,
      parseFloat(cost),
      parseFloat(unitDiscount),
      parseFloat(totalDiscount),
      new Map<string, number>([[storage, parseFloat(units) || 0]])
    );
    item.replenish(replenishment);
    closeReplenishmentView();
  };

  const handleToLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStorage(e.target.value);
  };

  return (
    <div className="bg-neutral-300 rounded p-2 space-y-2">
      <div
        id="close-full-item"
        className="fixed top-2 left-2 z-50 border border-neutral-600 rounded p-1"
        onClick={closeReplenishmentView}
      >
        <img src={CloseIcon} className="w-5 h-5" />
      </div>
      <div className="p-2 bg-neutral-400 rounded">
        <p className="text-center text-xl">
          Re-abastecimiento de: <strong>{item.getName()}</strong>
        </p>
        <p className="text-center">
          <strong>{item.getProvider().getName()}</strong>
        </p>
        <p className="text-center">
          {item.getTotalUnits()} unidades almacenadas
        </p>
      </div>
      <div className="p-2 bg-neutral-400 rounded space-y-2">
        <div className="flex justify-between items-center">
          <input
            type="number"
            name=""
            id=""
            placeholder="Unidades"
            className="w-32 p-2 rounded"
            value={units}
            onChange={(e) => {
              setUnits(e.target.value);
            }}
          />
          <div id="new-item-cost-container" className="flex space-x-1 ">
            <input
              id="new-item-cost"
              type="number"
              placeholder="Costo Unitario"
              className="w-32 p-2 rounded"
              value={cost}
              onChange={(e) => {
                setCost(e.target.value);
              }}
            />
            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
        </div>
        <div>
          <p>Descuento por unidad:</p>
          <div className="flex space-x-3">
            <div className="flex space-x-1">
              <input
                type="number"
                name=""
                id=""
                placeholder="0"
                className="w-20 p-2 rounded"
                value={unitDiscountPercentage}
                onChange={(e) => {
                  setUnitDiscountPercentage(e.target.value);
                }}
              />
              <p className="p-2 bg-neutral-100 rounded">%</p>
            </div>
            <div className="flex flex space-x-1">
              <input
                type="number"
                name=""
                id=""
                placeholder="0"
                className="w-20 p-2 rounded"
                value={unitDiscount}
                onChange={(e) => {
                  setUnitDiscount(e.target.value);
                }}
              />
              <p className="p-2 bg-neutral-100 rounded">Bs</p>
            </div>
          </div>
        </div>
        <div>
          <p>Descuento sobre el total:</p>
          <div className="flex space-x-3">
            <div className="flex flex space-x-1">
              <input
                type="number"
                name=""
                id=""
                placeholder="0"
                className="w-20 p-2 rounded"
                value={totalDiscounPercentage}
                onChange={(e) => {
                  setTotalDiscountPercentage(e.target.value);
                }}
              />
              <p className="p-2 bg-neutral-100 rounded">%</p>
            </div>
            <div className="flex flex space-x-1">
              <input
                type="number"
                name=""
                id=""
                placeholder="0"
                className="w-20 p-2 rounded"
                value={totalDiscount}
                onChange={(e) => {
                  setTotalDiscount(e.target.value);
                }}
              />
              <p className="p-2 bg-neutral-100 rounded">Bs</p>
            </div>
          </div>
        </div>
        <div>
          <p>Destino:</p>
          <select
            id="new-location"
            className="bg-neutral-300 border border-neutral-600 w-full p-2"
            onChange={handleToLocationChange}
          >
            <option value="">Seleccionar</option>
            {Array.from(item.getLocations().keys()).map((location, index) => (
              <option value={location} key={index}>
                {location}
              </option>
            ))}
            <option value="Otro">Otro</option>
          </select>
        </div>
        {storage === "Otro" && (
          <>
            <input
              type="text"
              className="mt-2 w-full border border-neutral-600 p-1"
              placeholder="Nombre de la nueva localización"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
          </>
        )}
        <p className="w-fit p-2 bg-neutral-100 rounded">
          Total: {(parseFloat(units) * parseFloat(cost)) | 0} Bs.
        </p>
        <div className="flex justify-between">
          <div>
            <p>fecha de encargo:</p>
            <p className="py-2">{new Date().toDateString()}</p>
          </div>
          <div>
            <p>fecha de arribo:</p>
            <input
              type="date"
              name=""
              id=""
              className="p-2"
              value={arriveDate.toISOString().substring(0, 10)} // Correctly format the date here
              onChange={(e) => {
                setArriveDate(new Date(e.target.value + "T00:00")); // Ensures the date is set with time at 00:00
              }}
            />
          </div>
        </div>
        <div
          id="new-multi-item-save-button"
          className="w-full flex justify-center bg-success p-2 rounded"
          onClick={replenish}
        >
          <img src={ReplenishmentIcon} />
          <p className="ml-1 text-2xl">Guardar</p>
        </div>
      </div>
    </div>
  );
};
