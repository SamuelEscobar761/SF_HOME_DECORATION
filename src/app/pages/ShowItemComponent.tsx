import { useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import WheelbarrowIcon from "../../assets/Wheelbarrow-Icon.svg";
export const ShowItemComponent = ({ item }: { item: EntireItem }) => {
  const [units, setUnits] = useState<number>(0);
  const [colorSelected, setColorSelected] = useState<number>(0);
  return (
    <div id="item-container" className="bg-neutral-100 p-2">
      <div id="close-full-item" className="">
        <img src={CloseIcon} />
      </div>
      <div
        id="images-container"
        className="h-[380px] bg-neutral-100 border border-neutral-900 flex overflow-x-scroll snap-x snap-mandatory"
      >
        {item.imagesBycolors[colorSelected][1].map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className="w-full flex-shrink-0 snap-center object-contain"
          />
        ))}
      </div>
      <div id="show-item-content" className="text-lg my-2">
        <div
          id="colors"
          className="flex space-x-4 justify-start overflow-x-auto"
        >
          {item.imagesBycolors.map((colors, index) => (
            <div
              key={index}
              style={{ backgroundColor: colors[0] }}
              className={`rounded-full border h-11 w-11 flex-shrink-0 cursor-pointer ${
                colorSelected === index
                  ? "border-neutral-900 border-2"
                  : "border-neutral-700"
              }`}
              onClick={() => setColorSelected(index)}
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
        <div id="discount" className="flex justify-between mt-2">
          <p id="discount-text" className="text-tertiary">
            Descuento:
          </p>
          <p id="discount-amount" className="text-tertiary">
            {item.discount}%
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
            placeholder={units.toString()} // Muestra el valor actual del estado
            className="w-10 h-6 border border-neutral-900 rounded text-right"
            onChange={(event) => setUnits(Number(event.target.value))} // Actualiza el estado con el valor numérico
          />
        </div>
        <div id="total" className="flex justify-between font-bold mt-2">
          <p id="total-price-text" className="text-neutral-900">
            Total:
          </p>
          <p id="total-price-amount" className="text--neutral-900">
            {item.price} Bs
          </p>
        </div>
      </div>
      <div
        id="add-chart-button"
        className="bg-success flex justify-center rounded p-2"
      >
        <img src={WheelbarrowIcon} className="w-7 h-7" />
        <p id="add-chart-text" className="ml-2 text-2xl">
          Agregar al Carrito
        </p>
      </div>
    </div>
  );
};
