import { useEffect, useState } from "react";
import { SimpleItem } from "../classes/SimpleItem";

export const SelectedItemComponent = ({
  item,
  entireCost,
  numberOfItems,
}: {
  item: SimpleItem;
  entireCost: number;
  numberOfItems: number;
}) => {
  const [percentage, setPercentage] = useState<number>(
    item.getPercentage() || Math.round(100 / numberOfItems)
  );
  const [cost, setCost] = useState<number>(0);
  const [price, setPrice] = useState<number>(item.getPrice());

  const handlePriceChange = (newPrice: string) => {
    const parsedPrice = parseFloat(newPrice) || 0;
    setPrice(parsedPrice);
    item.setPrice(parsedPrice);
  };

  const handleCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCost = parseFloat(Number(event.target.value).toFixed(2));
    setCost(newCost)
    if (!item.getMultiItem()){
      const newPercentage =
        entireCost !== 0 && !Number.isNaN(newCost)
          ? Math.round((newCost / entireCost) * 100)
          : 100 / numberOfItems;
      setPercentage(newPercentage);
      item.getReplenishments()[0]?.setUnitCost(newCost);
    }
  }

  const handlePercentageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = event.target.value === "" ? 0 : Math.round(parseFloat(event.target.value))
    setPercentage(newPercentage)
    item.setTempPercentage(newPercentage)
    if(!item.getMultiItem()){
      const newCost = parseFloat((entireCost * newPercentage / 100).toFixed(2))
      setCost(newCost)
      item.getReplenishments()[0].setUnitCost(newCost);
    }
  }

  useEffect(() => {
    if (!item.getMultiItem()) {
      const newPercentage = Math.round(100 / numberOfItems);
      const newCost = parseFloat((entireCost * newPercentage / 100).toFixed(2));
      setPercentage(newPercentage);
      setCost(newCost);
      item.getReplenishments()[0].setUnitCost(newCost);

    }
  }, [numberOfItems]);

  useEffect(() => {
    if (!item.getMultiItem()) {
      const newCost = (entireCost * percentage) / 100;
      setCost(newCost);
    }
    item.setTempPercentage(percentage);
  }, [entireCost]);

  return (
    <div
      id="image-name-component"
      className="flex flex-col divide-y space-y-2 p-2 bg-primary rounded"
    >
      <div className="w-full  flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <img
            id="image-name-component-image"
            src={item.getImages()[0].image ? URL.createObjectURL(item.getImages()[0].image!) : item.getImages()[0].url}
            alt=""
            className="size-14 border border-neutral-900"
          />
          <p id="image-name-component-name" className="text-base">
            {item.getName()}
          </p>
        </div>
        <div className="flex space-x-2">
          <div>
            <p className="text-xs">costo %</p>
            <div className="flex space-x-1 items-center">
              <input
                type="number"
                className="w-10 h-fit border border-neutral-900 p-1 rounded text-right"
                value={percentage === 0 ? "" : percentage}
                onChange={handlePercentageChange}
              />
              <p>%</p>
            </div>
          </div>
          {!item.getMultiItem() && (
            <div>
              <p className="text-xs">costo Bs.</p>
              <div className="flex space-x-1 items-center">
                <input
                  type="number"
                  className="w-14 h-fit border border-neutral-900 p-1 rounded text-right"
                  value={cost == 0 ? "" : cost}
                  onChange={handleCostChange}
                />
                <p>Bs</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <p>Precio por unidad suelta:</p>
        <div className="flex space-x-1 items-center">
          <input
            type="number"
            name="price"
            className="w-14 h-fit border border-neutral-900 p-1 rounded text-right"
            value={price == 0 ? "" : price}
            onChange={(e) => {
              handlePriceChange(e.target.value);
            }}
          />
          <p>Bs</p>
        </div>
      </div>
    </div>
  );
};
