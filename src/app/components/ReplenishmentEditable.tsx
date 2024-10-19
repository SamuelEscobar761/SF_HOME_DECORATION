import { useState } from "react";
import { Replenishment } from "../classes/Replenishment";

export const ReplenishmentEditable = ({
  replenishment,
}: {
  replenishment: Replenishment;
}) => {
  const [locations, setLocations] = useState<Map<string, number>>(
    new Map(replenishment.getLocations())
  );
  const [date, setDate] = useState<Date>(replenishment.getArriveDate());
  const [cost, setCost] = useState<number | "">(replenishment.getUnitCost());

  const handleLocationChange = (key: string, newValue: number) => {
    const updatedLocations = new Map(locations);
    updatedLocations.set(key, newValue);
    setLocations(updatedLocations);
    replenishment.setLocations(updatedLocations);
  };

  const handleDateChange = (date: string) => {
    const newDate = new Date(date);
    setDate(newDate);
    replenishment.setArriveDate(newDate);
  };

  const handleCostChange = (cost: string) => {
    setCost(parseFloat(cost) || "");
    replenishment.setUnitCost(parseFloat(cost) || 0);
  };

  return (
    <div className="flex flex-col space-y-2 p-2">
      <div className="flex justify-between">
        <input
          type="date"
          className="w-[75px] bg-neutral-100 "
          value={date.toISOString().substring(0, 10)}
          onChange={(e) => {
            handleDateChange(e.target.value);
          }}
        />
        <div className="flex flex-col divide-y">
          {Array.from(locations).map(([key, value]) => (
            <div className="flex justify-between space-x-2 p-2" key={key}>
              <p>{key}:</p>
              <input
                type="number"
                className="w-10 border text-left bg-neutral-100 pl-1"
                value={value || ""}
                onChange={(e) =>
                  handleLocationChange(key, parseFloat(e.target.value))
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <p>Costo unitario:</p>
        <input
          type="number"
          className="w-16 border text-left bg-neutral-100 pl-1"
          value={cost}
          onChange={(e) => handleCostChange(e.target.value)}
        />
        <p className="font-bold">Total</p>
        <p className="w-16 border text-left bg-neutral-100 px-1">
          {replenishment.getTotalValue() || 0}
        </p>
      </div>
    </div>
  );
};
