import { useState } from "react";
import { Replenishment } from "../classes/Replenishment";

export const ReplenishmentEditable = ({
  replenishment,
}: {
  replenishment: Replenishment;
}) => {
  const [locations, setLocations] = useState<Map<string, Map<string, number>>>(
    new Map(replenishment.getLocations())
  );
  const [date, setDate] = useState<Date>(replenishment.getArriveDate());
  const [cost, setCost] = useState<number | "">(replenishment.getUnitCost());
  const [unitDiscount, setUnitDiscount] = useState<number | "">(
    replenishment.getUnitDiscount()
  );
  const [totalDiscount, setTotalDiscount] = useState<number | "">(
    replenishment.getTotalDiscount()
  );

  const handleUnitChange = (units: string, color: string, location: string) => {
    replenishment.getLocations().get(location)!.set(color, parseFloat(units));
    const newLocations = new Map(locations);
    newLocations.get(location)?.set(color, parseFloat(units));
    setLocations(newLocations);
  };

  const handleDateChange = (date: string) => {
    const newDate = new Date(date);
    setDate(newDate);
    replenishment.setArriveDate(newDate);
  };

  const handleCostChange = (cost: string) => {
    setCost(parseFloat(cost) || "");
    replenishment.setUnitCost(parseFloat(cost) || 0);
    console.log("updated cost: " + parseFloat(cost));
  };

  const handleUnitDiscountChange = (unitDiscount: string) => {
    setUnitDiscount(parseFloat(unitDiscount) || "");
    replenishment.setUnitDiscount(parseFloat(unitDiscount) || 0);
  };

  const handleTotalDiscountChange = (totalDiscount: string) => {
    setTotalDiscount(parseFloat(totalDiscount) || "");
    replenishment.setTotalDiscount(parseFloat(totalDiscount) || 0);
  };

  return (
    <div className="flex flex-col space-y-2 p-2">
      <div className="flex justify-between">
        <p>Fecha de arribo:</p>
        <input
          type="date"
          className="w-[120px] bg-neutral-100 "
          value={date.toISOString().substring(0, 10)}
          onChange={(e) => {
            handleDateChange(e.target.value);
          }}
        />
      </div>
      <script
            dangerouslySetInnerHTML={{
              __html: `console.log(${JSON.stringify({ locations })});`,
            }}
          />
      {Array.from(locations.keys()).map((key, index) => (
        <div key={index}>
          <p>{key}:</p>
          <div className="grid grid-cols-2">
            {Object.entries(locations.get(key) || {}).map(
              ([color, units], index) => (
                <div
                  key={`${key}-${color}-${index}`}
                  className="flex space-x-2 items-center"
                >
                  <div
                    className="size-8 border border-neutral-900"
                    style={{ background: color }}
                  ></div>
                  <input
                    type="number"
                    value={units}
                    onChange={(event) => {
                      handleUnitChange(event.target.value, color, key);
                    }}
                    placeholder="Unds."
                    className="w-12 px-1 rounded border border-neutral-900"
                  />
                </div>
              )
            )}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-2">
        <p>Costo unitario:</p>
        <input
          type="number"
          className="w-16 border text-left bg-neutral-100 pl-1"
          value={cost}
          onChange={(e) => handleCostChange(e.target.value)}
        />
        <p>Descuento unitario:</p>
        <input
          type="number"
          className="w-16 border text-left bg-neutral-100 pl-1"
          value={unitDiscount}
          onChange={(e) => handleUnitDiscountChange(e.target.value)}
        />
        <p>Descuento sobre el total:</p>
        <input
          type="number"
          className="w-16 border text-left bg-neutral-100 pl-1"
          value={totalDiscount}
          onChange={(e) => handleTotalDiscountChange(e.target.value)}
        />
        <p className="font-bold">Total</p>
        <p className="w-16 border text-left bg-neutral-100 px-1">
          {replenishment.getTotalValue() || 0}
        </p>
      </div>
    </div>
  );
};
