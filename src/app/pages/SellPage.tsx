import { SellItemComponent } from "../components/SellItemComponent";
import HamburguerButton from "../../assets/Hamburguer-Button-Icon.svg";
import { useEffect, useRef, useState } from "react";
import { LateralMenuComponent } from "../components/LateralMenuComponent";

interface SellItem {
  image: string;
  title: string;
  colors: string[];
  extraColors: number;
  discount: number;
  previousPrice: number;
  price: number;
  checked: boolean;
}

export const SellPage = () => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [rooms, setRooms] = useState<string[]>(["Comedor", "Living", "Baño"]);
  const [items, setItems] = useState<SellItem[]>([
    {
      image: "",
      title: "Title 1",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 4,
      discount: 0,
      previousPrice: 0,
      price: 0,
      checked: false,
    },
    {
      image: "",
      title: "Title 2",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 4,
      discount: 0,
      previousPrice: 0,
      price: 0,
      checked: false,
    },
    {
      image: "",
      title: "Title 3",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 4,
      discount: 0,
      previousPrice: 0,
      price: 0,
      checked: true,
    },
    {
      image: "",
      title: "Title 4",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 4,
      discount: 0,
      previousPrice: 0,
      price: 0,
      checked: false,
    },
    {
      image: "",
      title: "Title 5",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 4,
      discount: 0,
      previousPrice: 0,
      price: 0,
      checked: false,
    },
    {
      image: "",
      title: "Title 6",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 4,
      discount: 0,
      previousPrice: 0,
      price: 0,
      checked: false,
    },
  ]);
  const [materials, setMaterials] = useState<string[]>([
    "Tela Jagguar",
    "Tela Cuadrillé",
    "Tela Turca",
  ]);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
  };

  const handleClickOutsideMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpened(false);
      event.stopPropagation(); // Detiene la propagación para que no se active ninguna otra acción
    }
  };

  useEffect(() => {
    if (menuOpened) {
      document
        .getElementById("menu-container")!
        .addEventListener("mousedown", handleClickOutsideMenu);
    }
  }, [menuOpened]);

  const handleSellItemClick = (event: React.MouseEvent) => {
    if (menuOpened) {
      // Si el menú está abierto, cierra el menú sin realizar ninguna otra acción
      setMenuOpened(false);
      event.stopPropagation(); // Detiene la propagación del evento de clic
    } else {
      // Aquí puedes añadir la lógica para la navegación en el futuro
    }
  };

  return (
    <div>
      {menuOpened && (
        <div
          id="menu-container"
          className="fixed z-40 h-screen w-screen bg-white/[0.6]"
        >
          <LateralMenuComponent
            setMinPrice={undefined}
            setMaxPrice={undefined}
            listOfRooms={rooms}
            setListOfSelectedRooms={undefined}
            listOfMaterials={materials}
            setListOfSelectedMaterials={undefined}
            setDiscount={undefined}
            menuRef={menuRef}
          />
        </div>
      )}
      <div id="content" className="p-2">
        <div id="top-buttons" className="flex justify-between mt-2 mb-6">
          <div id="hamburguer-button" onClick={toggleMenu}>
            <img src={HamburguerButton} className="w-9 h-9" />
          </div>
          <div id="search-bar">
            <input
              placeholder="Buscar"
              className="rounded-full py-1 px-2 text-base border border-neutral-900"
            />
          </div>
        </div>
        <div id="items" className="grid grid-cols-2 gap-4">
          {items.map((item, index) => (
            <SellItemComponent
              key={index}
              onClick={handleSellItemClick}
              image={item.image}
              title={item.title}
              colors={item.colors.slice(0, 4)}
              extraColors={item.extraColors}
              discount={item.discount}
              previousPrice={item.previousPrice}
              price={item.price}
              checked={item.checked}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
