import { useState } from "react";

export const MoveItemComponent = ({ closeFunc }: { closeFunc: any }) => {
  const [locations] = useState<any[]>([
    "Casa",
    "Almacen",
    "Tienda",
  ]);

  return (
    <div className="bg-neutral-300 p-2 w-11/12 h-fit rounded">
      <div
        id="move-item-component-image-container"
        className="bg-neutral-100 h-[360px] w-full"
      >
        <img src="" alt="" />
      </div>
      <div id="move-item-component-content" className="bg-neutral-100 p-2 mt-2">
        <p className="text-2xl">Title</p>
        <div className="my-2 flex justify-between">
          <p>Unidades a mover</p>
          <input type="number" placeholder="0" className="w-10 text-right border border-neutral-600"/>
        </div>
        <label htmlFor="previous-location">Previa localización</label>
        <br />
        <select
          name=""
          id="previous-location"
          className="bg-neutral-300 border border-neutral-600 w-full mb-2"
        >
          <option value="">Seleccionar:</option>
          {locations.map((location, index) => (
            <option value={location} key={index} title={location}>
              {location}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="new-location">Nueva localización:</label>
        <br />
        <select
          name=""
          id="new-location"
          className="bg-neutral-300 border border-neutral-600 w-full"
        >
          <option value="">Seleccionar</option>
          {locations.map((location, index) => (
            <option value={location} key={index} title={location}>
              {location}
            </option>
          ))}
        </select>
        <div className="bg-secondary text-center p-2 mt-4" onClick={closeFunc}>
          <p className="text-neutral-100">Mover</p>
        </div>
      </div>
    </div>
  );
};
