import { Dispatch, LegacyRef, SetStateAction } from "react";

export const LateralMenuComponent = ({
  // setMinPrice,
  // setMaxPrice,
  listOfRooms,
  // setListOfSelectedRooms,
  listOfMaterials,
  // setListOfSelectedMaterials,
  // setDiscount,
  menuRef,
  cart,
  // setCart,
}: {
  setMinPrice: any;
  setMaxPrice: any;
  listOfRooms: string[];
  setListOfSelectedRooms: any;
  listOfMaterials: string[];
  setListOfSelectedMaterials: any;
  setDiscount: any;
  menuRef: LegacyRef<HTMLDivElement>;
  cart: Map<string, SellItem>;
  setCart: Dispatch<SetStateAction<Map<string, SellItem>>>;
}) => {
  return (
    <div
      id="menu-content"
      className="bg-primary h-screen w-fit p-2"
      ref={menuRef}
    >
      <button onClick={() => {console.log(cart)}}>Carrito</button>
      <div>
        <p>Rango de precio</p>
        <div>
          <input placeholder="Min" />
          <p>-</p>
          <input placeholder="Max" />
        </div>
        <div>
          <p>Habitación</p>
          <div>
            <label>
              <input type="checkbox" />
              Todas
            </label>
          </div>
          {listOfRooms.map((room, index) => {
            return (
              <div key={index}>
                <label>
                  <input type="checkbox" />
                  {room}
                </label>
              </div>
            );
          })}
        </div>
        <div>
          <p>Material</p>
          <div>
            <label>
              <input type="checkbox" />
              Todas
            </label>
          </div>
          {listOfMaterials.map((material, index) => {
            return (
              <div key={index}>
                <label>
                  <input type="checkbox" />
                  {material}
                </label>
              </div>
            );
          })}
        </div>
        <div>
          <label>
            <input type="checkbox" />
            En Descuento
          </label>
        </div>
      </div>
    </div>
  );
};
