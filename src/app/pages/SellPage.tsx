import { SellItemComponent } from "../components/SellItemComponent";
import HamburguerButton from "../../assets/Hamburguer-Button-Icon.svg";
import { useEffect, useRef, useState } from "react";
import { LateralMenuComponent } from "../components/LateralMenuComponent";
import { ShowItemComponent } from "./ShowItemComponent";

export const SellPage = () => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [fullItemView, setFullItemView] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<EntireItem>();
  const [cart, setCart] = useState<Map<string, Item>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<string[]>(["Comedor", "Living", "Baño"]);
  const [items, setItems] = useState<SellItem[]>([]);
  const [materials, setMaterials] = useState<string[]>([
    "Tela Jagguar",
    "Tela Cuadrillé",
    "Tela Turca",
  ]);
  const [filteredItems, setFilteredItems] = useState(items);
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

  useEffect(() => {
    const fetchItems = async () => {
      // Aquí iría la llamada a tu API para recuperar los datos
      // const response = await fetch("/api/items"); // Ejemplo: fetch a la API
      // const data = await response.json();
      const data = [
        {
          id: 1,
          image: "./delete/cuadrille-n.jpg",
          title: "Funda de silla",
          provider: "Shein",
          colors: ["#000000", "#FFFFFF", "#FF0000"],
          extraColors: 3,
          discount: 30,
          previousPrice: 50,
          price: 35.0,
          checked: false,
        },
        {
          id: 2,
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
          id: 3,
          image: "",
          title: "Title 3",
          provider: "Ertek Textile Company",
          colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
          extraColors: 8,
          discount: 0,
          previousPrice: 0,
          price: 0.0,
          checked: false,
        },
        {
          id: 4,
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
          id: 5,
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
          id: 6,
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
      ];
      // Actualizamos el estado con los items recuperados del backend
      setItems(data);
      setFilteredItems(data); // Inicialmente mostrar todos los items
    };

    fetchItems();
  }, []);

  const handleSellItemClick = (item: SellItem, event: React.MouseEvent) => {
    if (menuOpened) {
      // Si el menú está abierto, cierra el menú sin realizar ninguna otra acción
      setMenuOpened(false);
      event.stopPropagation(); // Detiene la propagación del evento de clic
    } else {
      setSelectedItem({
        id: item.id,
        discount: item.discount,
        imagesByColors: [
          [
            "#000000",
            [
              "./delete-cuadrille-n.jpg",
              "./delete/cuadrille-n1.jpg",
              "./delete/cuadrille.jpg",
            ],
          ],
          ["#FFFFFF", ["./delete/cuadrille-b.jpg"]],
          ["#FF0000", ["./delete/cuadrille-r.jpg", "cuadrille-r1.jpg"]],
          [
            "#0000FF",
            ["./delete/cuadrille-a.jpg", "./delete/cuadrille-a1.jpg"],
          ],
          ["#5D4952", ["./delete/cuadrille-c.jpg"]],
          ["#757A8D", ["./delete/cuadrille-g.jpg"]],
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
  };

  const generateKey = (id: number, color: string) => `${id}-${color}`;

  const addToCart = (id: number, color: string, units: number) => {
    setCart((prevCart) => {
      const key = generateKey(id, color);
      const newCart = new Map(prevCart);

      // Si el ítem ya existe, suma las unidades, si no, crea un nuevo ítem
      if (newCart.has(key)) {
        const existingItem = newCart.get(key)!;
        newCart.set(key, {
          ...existingItem,
          units: existingItem.units + units,
        });
      } else {
        newCart.set(key, { id, color, units });
      }

      return newCart;
    });
    setFullItemView(false);
    setFilteredItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: true } : item
      )
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase(); // Pasamos el valor a minúsculas
    setSearchTerm(value);

    // Filtramos solo si hay items disponibles
    if (items.length > 0) {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(value) ||
          item.provider.toLowerCase().includes(value)
      );
      setFilteredItems(filtered);
    }
  };

  return (
    <div className="text-neutral-900">
      {menuOpened && (
        <div
          id="menu-container"
          className="fixed z-40 h-screen w-screen bg-white/[0.6]"
        >
          <LateralMenuComponent
            setMinPrice={undefined}
            setMaxPrice={undefined}
            listOfRooms={rooms}
            setListOfSelectedRooms={setRooms}
            listOfMaterials={materials}
            setListOfSelectedMaterials={setMaterials}
            setDiscount={undefined}
            menuRef={menuRef}
            cart={cart}
            setCart={setCart}
          />
        </div>
      )}
      {fullItemView && (
        <div className="fixed z-40 w-screen h-screen bg-white/[0.6] p-5 overflow-y-auto">
          <ShowItemComponent
            item={selectedItem!}
            closeItem={closeItem}
            addToCart={addToCart}
          />
        </div>
      )}
      <div id="sell-page-content" className="p-2">
        <div id="top-buttons" className="flex justify-between mt-2 mb-6">
          <div id="hamburguer-button" onClick={toggleMenu}>
            <img src={HamburguerButton} className="w-9 h-9" />
          </div>
          <div id="search-bar">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={handleSearch}
              className="rounded-full py-1 px-2 text-base border border-neutral-900"
            />
          </div>
        </div>
        {filteredItems.length == 0 ? (
          <div id="no-items-container" className="p-2">
            <p className="text-2xl">Oops!</p>
            <p className="mt-2 text-base">
              Error: No encontramos artículos con esas especificaciones.
            </p>
            <p className="mt-2 text-sm">
              Si el error persiste: verifica tu conexión a internet o los
              filtros seleccionados.
            </p>
          </div>
        ) : (
          <div id="items" className="grid grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
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
        )}
      </div>
    </div>
  );
};
