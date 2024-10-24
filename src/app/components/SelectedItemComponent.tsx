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
    item.getPercentage() || 0
  );
  const [cost, setCost] = useState<number>(0);
  const [price, setPrice] = useState<number>(item.getPrice());

  const handlePriceChange = (newPrice: string) => {
    const parsedPrice = parseFloat(newPrice);
    setPrice(parsedPrice);
    item.setPrice(parsedPrice);
  };

  useEffect(() => {
    if (!item.getMultiItem()) {
      setPercentage(100 / numberOfItems);
    }
  }, [numberOfItems]);

  useEffect(() => {
    if (!item.getMultiItem()) {
      const newCost = (entireCost * percentage) / 100;
      setCost(newCost);
    }
    item.setTempPercentage(percentage);
  }, [percentage, entireCost]);

  useEffect(() => {
    if (!item.getMultiItem()) {
      const newPercentage =
        entireCost != 0
          ? Math.round((cost * 100) / entireCost)
          : 100 / numberOfItems;
      setPercentage(newPercentage);
      item.getReplenishments()[0]?.setUnitCost(cost);
    }
  }, [cost]);

  return (
    <div
      id="image-name-component"
      className="flex flex-col divide-y space-y-2 p-2 bg-primary rounded"
    >
      <div className="w-full  flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <img
            id="image-name-component-image"
            src={item.getImages()[0].image}
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
                value={percentage == 0 ? "" : percentage}
                onChange={(e) => {
                  setPercentage(Math.round(parseFloat(e.target.value) || 0));
                }}
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
                  onChange={(e) => {
                    setCost(
                      parseFloat(parseFloat(e.target.value).toFixed(2)) || 0
                    );
                  }}
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
            value={price}
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
