import React, { useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";

export const MoveItemComponent = ({
  closeMoveItem,
  item,
}: {
  closeMoveItem: any;
  item: any;
}) => {
  const [selectedFromLocation, setSelectedFromLocation] = useState("");
  const [maxUnits, setMaxUnits] = useState(0);
  const [unitsToMove, setUnitsToMove] = useState<number | "">(0); // Aseguramos que siempre tenga un valor
  const [selectedToLocation, setSelectedToLocation] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Maneja la selección de la localización origen
  const handleFromLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const location = item.locations.find(
      (loc: any) => loc.name === e.target.value
    );
    if (location) {
      setSelectedFromLocation(location.name);
      setMaxUnits(location.units);
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

  // Maneja el cambio de unidades
  const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= maxUnits && value > 0) {
      setUnitsToMove(value);
    } else {
      setUnitsToMove(""); // Asegura que el valor sea un número válido
    }
  };

  // Maneja la confirmación de mover a nueva localización
  const handleConfirmNewLocation = () => {
    // Restar unidades de la localización previa
    const fromLocation = item.locations.find(
      (loc: any) => loc.name === selectedFromLocation
    );
    if (fromLocation) {
      fromLocation.units -= Number(unitsToMove);
    }

    // Agregar la nueva localización
    item.locations.push({
      id: item.locations.length + 1,
      name: newLocation,
      units: unitsToMove,
    });

    closeMoveItem();
  };

  // Actualiza las unidades en las localizaciones existentes
  const handleMoveItems = () => {
    if (selectedToLocation === "Otro") {
      setShowConfirmation(true);
    } else {
      // Actualizar las unidades en las localizaciones existentes
      const fromLocation = item.locations.find(
        (loc: any) => loc.name === selectedFromLocation
      );
      const toLocation = item.locations.find(
        (loc: any) => loc.name === selectedToLocation
      );

      if (fromLocation && toLocation) {
        fromLocation.units -= Number(unitsToMove);
        toLocation.units += unitsToMove;
      }
      closeMoveItem();
    }
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
        <img src={item.image} alt="" />
      </div>
      <div id="move-item-component-content" className="bg-neutral-100 p-2 mt-2">
        <p className="text-2xl">{item.name}</p>
        <div className="my-2 flex justify-between">
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
        </div>
        <label htmlFor="previous-location">Previa localización</label>
        <br />
        <select
          id="previous-location"
          className="bg-neutral-300 border border-neutral-600 w-full mb-2 p-2"
          onChange={handleFromLocationChange}
        >
          <option value="">Seleccionar:</option>
          {item.locations.map((location: any, index: number) => (
            <option value={location.name} key={index}>
              {location.name}
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
          {item.locations.map((location: any, index: number) => (
            <option value={location.name} key={index}>
              {location.name}
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
