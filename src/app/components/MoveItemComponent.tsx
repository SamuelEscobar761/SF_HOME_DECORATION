import React, { useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import { Item } from "../classes/Item";
import { ColorUnitsComponent } from "./ColorUnitsComponent";
import { Manager } from "../classes/Manager";

export const MoveItemComponent = ({
  closeMoveItem,
  item,
}: {
  closeMoveItem: any;
  item: Item;
}) => {
  const [selectedFromLocation, setSelectedFromLocation] = useState("");
  const [maxUnits, setMaxUnits] = useState(0);
  const [unitsToMove, setUnitsToMove] = useState<number | "">(0); // Aseguramos que siempre tenga un valor
  const [selectedToLocation, setSelectedToLocation] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [colorUnits, setColorUnits] = useState<Map<string, number>>(
    item.getColorUnits()
  );
  const [maxColorUnits, setMaxColorUnits] = useState<Map<string, number>>(
    new Map()
  );

  //TODO Add totalUnits to frontends
  const [totalUnits, setTotalUnits] = useState<number>(0);

  // Maneja la selección de la localización origen
  const handleFromLocationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const location = item.getLocations().get(e.target.value);
    if (location) {
      setSelectedFromLocation(e.target.value);
      setMaxColorUnits(location);
      setUnitsToMove(""); // Reinicia el input cuando se selecciona una nueva localización
    } else {
      setSelectedFromLocation("");
      setMaxUnits(0);
    }
  };

  // Maneja la selección de la localización destino
  const handleToLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToLocation(e.target.value);
  };

  const checkColorsMoreThanZero = () => {
    return true;
  }

  // Maneja la confirmación de mover a nueva localización
  const handleConfirmNewLocation = () => {
    if (
      selectedFromLocation !== "" &&
      newLocation !== "" &&
      checkColorsMoreThanZero()
    ) {
      colorUnits.forEach((value, key) => {
        item.move(selectedFromLocation, newLocation, key, value || 0);
      });
      Manager.getInstance().moveItem(item);
    }
    closeMoveItem();
  };

  // Actualiza las unidades en las localizaciones existentes
  const handleMoveItems = () => {
    if (selectedToLocation === "Otro") {
      setShowConfirmation(true);
    } else {
      console.log("moving not new location")
      if (
        selectedFromLocation !== "" &&
        selectedToLocation !== "" &&
        checkColorsMoreThanZero()
      ) {
        colorUnits.forEach((value, key) => {
          item.move(selectedFromLocation, selectedToLocation, key, value || 0);
        });
        Manager.getInstance().moveItem(item);
      }
      closeMoveItem();
    }
  };

  const handleColorUnitChange = (
    color: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    const newColorUnits = new Map(colorUnits);
    const safeMaxColorUnits =
      maxColorUnits instanceof Map
        ? maxColorUnits
        : new Map(Object.entries(maxColorUnits));
    const maxQuantity = Number(safeMaxColorUnits.get(color) || 0);
    if (value <= maxQuantity && value >= 0) {
      newColorUnits.set(color, value);
    } else {
      newColorUnits.set(color, maxQuantity);
    }
    setColorUnits(newColorUnits);
    setTotalUnits(
      Array.from(newColorUnits.values()).reduce((acc, value) => acc + value, 0)
    );
  };

  return (
    <div className="bg-neutral-300 p-2 rounded">
      <div
        id="close-full-item"
        className="fixed top-2 left-2 z-50 border border-neutral-600 rounded p-1"
        onClick={closeMoveItem}
      >
        <img src={CloseIcon} className="w-5 h-5" />
      </div>
      <div
        id="move-item-component-image-container"
        className="bg-neutral-100 h-[360px] w-full"
      >
        <img src={item.getImages()[0].url} alt="" />
      </div>
      <div id="move-item-component-content" className="bg-neutral-100 p-2 mt-2">
        <p className="text-2xl">{item.getName()}</p>
        <ColorUnitsComponent
          colorImages={item.getImages()}
          colorUnits={colorUnits}
          handleColorUnitChange={handleColorUnitChange}
        />
        {/* <div className="my-2 flex justify-between">
          <p>Unidades a mover</p>
          <div className="flex items-end space-x-1">
            <p className="text-xs">Max: {maxUnits}</p>
            <input
              type="number"
              placeholder="0"
              className="w-10 text-right border border-neutral-600"
              value={unitsToMove || ""}
              onChange={handleUnitsChange}
              disabled={maxUnits === 0} // Deshabilita si el máximo es 0
            />
          </div>
        </div> */}
        <label htmlFor="previous-location">Previa localización</label>
        <br />
        <select
          id="previous-location"
          className="bg-neutral-300 border border-neutral-600 w-full mb-2 p-2"
          onChange={handleFromLocationChange}
        >
          <option value="">Seleccionar:</option>
          {Array.from(item.getUnitsPerLocations()).map(([key], index) => (
            <option value={key} key={index}>
              {key}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="new-location">Nueva localización:</label>
        <br />
        <select
          id="new-location"
          className="bg-neutral-300 border border-neutral-600 w-full p-2"
          onChange={handleToLocationChange}
        >
          <option value="">Seleccionar</option>
          {Array.from(item.getUnitsPerLocations()).map(([key], index) => (
            <option value={key} key={index}>
              {key}
            </option>
          ))}
          <option value="Otro">Otro</option>
        </select>

        {selectedToLocation === "Otro" && (
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

        <div
          className="bg-secondary text-center p-2 mt-4"
          onClick={handleMoveItems}
        >
          <p className="text-neutral-100">Mover</p>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-neutral-100 p-4 rounded shadow-lg text-center">
            <p>
              ¿Estás seguro que quieres mover {unitsToMove} items a la nueva
              localización: "{newLocation}"?
            </p>
            <button
              className="bg-success text-neutral-100 px-4 py-2 mt-2 rounded"
              onClick={handleConfirmNewLocation}
            >
              Sí
            </button>
            <button
              className="bg-tertiary text-neutral-100 px-4 py-2 mt-2 ml-2 rounded"
              onClick={() => setShowConfirmation(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
