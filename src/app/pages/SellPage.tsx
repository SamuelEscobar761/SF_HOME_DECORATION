import { SellItemComponent } from "../components/SellItemComponent";
import HamburguerButton from "../../assets/Hamburguer-Button-Icon.svg";
import { useEffect, useRef, useState } from "react";
import { LateralMenuComponent } from "../components/LateralMenuComponent";
import { ShowItemComponent } from "./ShowItemComponent";

interface SellItem {
  image: string;
  title: string;
  provider: string;
  colors: string[];
  extraColors: number;
  discount: number;
  previousPrice: number;
  price: number;
  checked: boolean;
}

export const SellPage = () => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [fullItemView, setFullItemView] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<EntireItem>();
  const [rooms, setRooms] = useState<string[]>(["Comedor", "Living", "Baño"]);
  const [items, setItems] = useState<SellItem[]>([
    {
      image: "",
      title: "Title 1",
      provider: "provider",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 4,
      discount: 0,
      previousPrice: 0,
      price: 0.0,
      checked: false,
    },
    {
      image: "",
      title: "Title 2",
      provider: "provider",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 5,
      discount: 0,
      previousPrice: 0,
      price: 0.0,
      checked: false,
    },
    {
      image: "",
      title: "Title 3",
      provider: "Ertek Textile Company",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 8,
      discount: 0,
      previousPrice: 0,
      price: 0.0,
      checked: true,
    },
    {
      image: "",
      title: "Title 4",
      provider: "Instanbul Factory",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 9,
      discount: 0,
      previousPrice: 0,
      price: 0.0,
      checked: false,
    },
    {
      image: "",
      title: "Title 5",
      provider: "Karsaklar Sementa Tekstil A.S.",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 14,
      discount: 0,
      previousPrice: 0,
      price: 0.0,
      checked: false,
    },
    {
      image: "",
      title: "Title 6",
      provider: "Lagomtex Textile LTD",
      colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
      extraColors: 2,
      discount: 0,
      previousPrice: 0,
      price: 0.0,
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

  const handleSellItemClick = (item: SellItem, event: React.MouseEvent) => {
    if (menuOpened) {
      // Si el menú está abierto, cierra el menú sin realizar ninguna otra acción
      setMenuOpened(false);
      event.stopPropagation(); // Detiene la propagación del evento de clic
    } else {
      setSelectedItem({
        discount: item.discount,
        imagesBycolors: [
          ["#FFABFF", ["https://media.admagazine.com/photos/618a6321b94700461d6212a3/master/w_1600%2Cc_limit/80230.jpg", "https://media.admagazine.com/photos/618a6321b94700461d6212a3/master/w_1600%2Cc_limit/80230.jpg", "https://media.admagazine.com/photos/618a6321b94700461d6212a3/master/w_1600%2Cc_limit/80230.jpg", "https://media.admagazine.com/photos/618a6321b94700461d6212a3/master/w_1600%2Cc_limit/80230.jpgF"]],
          ["#FF13FF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FF15FF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#F16FFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#F55FFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FF15FF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
          ["#FFFFFF", ["img1.png", "img2.png", "img3.png", "img4.png"]],
        ],
        price: item.price,
        provider: item.provider,
        title: item.title,
      });
      setFullItemView(true);
    }
  };

  const closeItem = () => {
    setFullItemView(false);
  }

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
      {fullItemView && (
        <div className="fixed z-40 w-screen h-screen bg-white/[0.6] p-5 overflow-y-auto">
          <ShowItemComponent item={selectedItem!} closeItem={closeItem}/>
        </div>
      )}
      <div id="sell-page-content" className="p-2">
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
              onClick={(event) => {
                handleSellItemClick(item, event);
              }}
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
