import { useEffect, useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import WheelbarrowIcon from "../../assets/Wheelbarrow-Icon.svg";
export const ShowItemComponent = ({
  sellItem,
  item,
  closeItem,
  addToCart,
}: {
  sellItem: SellItem;
  item: EntireItem;
  closeItem: () => void;
  addToCart: (item: SellItem, units: number) => void;
}) => {
  const [rebajaUnitaria, setRebajaUnitaria] = useState<number>(0);
  const [rebajaUnitariaProblem, setRebajaUnitariaProblem] = useState<string>("");
  const [rebajaTotalProblem, setRebajaTotalProblem] = useState<string>("");
  const [rebajaTotal, setRebajaTotal] = useState<number>(0);
  const [units, setUnits] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [colorSelected, setColorSelected] = useState<number>(0);

  const handleSelectColor = (index: number) => {
    sellItem.color = item.imagesByColors[index][0];
    setColorSelected(index);
  }

  const handleRebajaUnitariaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rebaja = Number(event.target.value)
    sellItem.rebajaUnidad = rebaja;
    setRebajaUnitaria(rebaja);
  }

  const handleRebajaTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rebaja = Number(event.target.value)
    sellItem.rebajaTotal = rebaja;
    setRebajaTotal(rebaja);
  }

  useEffect(() => {
    const maxRebaja = item.price*units - rebajaUnitaria*units
    if(rebajaUnitaria > 50){
      setRebajaUnitariaProblem("El descuento por unidad no puede superar los 50 Bs.");
    }else{
      setRebajaUnitariaProblem("");
    }

    if(rebajaTotal > maxRebaja){
      setRebajaTotalProblem(`El descuento total no puede superar los ${maxRebaja} Bs.`);
    }else{
      setRebajaTotalProblem("");
    }
    setTotalPrice(item.price * units - rebajaUnitaria * units - rebajaTotal);
  }, [units, rebajaUnitaria, rebajaTotal]);

  return (
    <div id="item-container" className="bg-neutral-100 p-2">
      <div id="close-item-images-container" className="relative">
        <div
          id="close-full-item"
          className="absolute top-2 left-2 z-50"
          onClick={closeItem}
        >
          <img src={CloseIcon} />
        </div>
        <div
          id="images-container"
          className="h-[380px] bg-neutral-100 border border-neutral-900 flex overflow-x-scroll snap-x snap-mandatory"
        >
          {item.imagesByColors[colorSelected][1].map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full flex-shrink-0 snap-center object-cover"
            />
          ))}
        </div>
      </div>
      <div id="show-item-content" className="text-lg my-2">
        <div
          id="colors"
          className="flex space-x-4 justify-start overflow-x-auto"
        >
          {item.imagesByColors.map((imagesByColor, index) => (
            <div
              key={index}
              style={{ backgroundColor: imagesByColor[0] }}
              className={`rounded-full border h-11 w-11 flex-shrink-0 cursor-pointer ${
                colorSelected === index
                  ? "border-neutral-900 border-2"
                  : "border-neutral-700"
              }`}
              onClick={() => handleSelectColor(index)}
            ></div>
          ))}
        </div>
        <div id="title-provider" className="mt-2">
          <p id="title" className="text-2xl">
            {item.title}
          </p>
          <p id="provider" className="text-xs">
            {item.provider}
          </p>
        </div>
        <div id="unit-price" className="flex justify-between mt-2">
          <p id="unit-price-text" className="text-neutral-900">
            Precio unitario:
          </p>
          <p id="unit-price-amount" className="text--neutral-900">
            {item.price} Bs
          </p>
        </div>
        <div id="units" className="flex justify-between mt-2">
          <p id="units-text" className="text-neutral-900">
            Nº de unidades:
          </p>
          <input
            id="units-input"
            type="number"
            placeholder={units.toString()}
            className="w-10 h-6 border border-neutral-900 rounded text-right pr-1"
            onChange={(event) => setUnits(Number(event.target.value))}
          />
        </div>
        <div id="discount" className="flex justify-between mt-2">
          <p id="discount-text" className="text-tertiary">
            Descuento:
          </p>
          <p id="discount-amount" className="text-tertiary">
            {item.discount}%
          </p>
        </div>
        <div id="rebaja-unitaria" className="flex justify-between items-end mt-2">
          <p id="rebaja-unitaria-text" className="text-tertiary m-0">
            Rebaja en cada unidad:
          </p>
          <div id="input-field" className="flex items-end space-x-1">
            <input
            id="rebaja-unitaria-input"
            type="number"
            placeholder={rebajaUnitaria.toString()}
            className="w-16 rounded border border-neutral-900 text-right pr-1"
            onChange={handleRebajaUnitariaChange}/>
            <p id="bs" className="rounded px-1 border border-black m-0 flex items-center">Bs</p>
          </div>
        </div>
        <div id="rebaja-unidad-problem">
          <p className="text-xs text-tertiary-dark">{rebajaUnitariaProblem}</p>
        </div>
        <div id="rebaja-total" className="flex justify-between items-end mt-2">
          <p id="rebaja-total-text" className="text-tertiary m-0">
            Rebaja en el total:
          </p>
          <div id="input-field" className="flex items-end space-x-1">
            <input
            id="rebaja-unitaria-input"
            type="number"
            placeholder={rebajaTotal.toString()}
            className="w-16 rounded border border-neutral-900 text-right pr-1"
            onChange={handleRebajaTotalChange}/>
            <p id="bs" className="rounded px-1 border border-black m-0 flex items-center">Bs</p>
          </div>
        </div>
        <div id="rebaja-unidad-problem">
          <p className="text-xs text-tertiary-dark">{rebajaTotalProblem}</p>
        </div>
        <div id="total" className="flex justify-between font-bold mt-2">
          <p id="total-price-text" className="text-neutral-900">
            Total:
          </p>
          <p id="total-price-amount" className="text--neutral-900">
            {totalPrice} Bs
          </p>
        </div>
      </div>
      <div
        id="add-cartaddToCart-button"
        className="bg-success flex justify-center rounded p-2"
        onClick={() => {
          rebajaTotalProblem === "" && rebajaUnitariaProblem === "" && addToCart(sellItem, units);
        }}
      >
        <img src={WheelbarrowIcon} className="w-7 h-7" />
        <p id="add-cartaddToCart-text" className="ml-2 text-2xl">
          Agregar al Carrito
        </p>
      </div>
    </div>
  );
};
