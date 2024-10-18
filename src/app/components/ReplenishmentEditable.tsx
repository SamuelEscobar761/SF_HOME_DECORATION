import { useState } from "react";
import { Replenishment } from "../classes/Replenishment";

export const ReplenishmentEditable = ({replenishment}: {replenishment: Replenishment}) => {
    const [locations, setLocations] = useState<Map<string, number>>(new Map(replenishment.getLocations()));
    const [date, setDate] = useState<Date>(replenishment.getArriveDate())

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
    }

    return (
        <div className="flex justify-around">
            <input
                type="date"
                className="p-2 w-[85px] bg-neutral-100 "
                value={date.toISOString().substring(0, 10)}
                onChange={(e) => {handleDateChange(e.target.value)}}
            />
            <div className="flex flex-col divide-y">
                {Array.from(locations).map(([key, value]) => (
                    <div className="flex justify-between space-x-2 p-2" key={key}>
                        <p>{key}:</p>
                        <input 
                            type="number" 
                            className="w-10 border text-right bg-neutral-100 pr-1" 
                            value={value || ""} 
                            onChange={(e) => handleLocationChange(key, parseFloat(e.target.value))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
