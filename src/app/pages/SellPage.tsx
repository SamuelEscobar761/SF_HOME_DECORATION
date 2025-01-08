import { SellItemComponent } from "../components/SellItemComponent";
import HamburguerButton from "../../assets/Hamburguer-Button-Icon.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LateralMenuComponent } from "../components/LateralMenuComponent";
import { ShowItemComponent } from "../components/ShowItemComponent";
import { Manager } from "../classes/Manager";
import Cookies from 'js-cookie';

export const SellPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [fullItemView, setFullItemView] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<EntireItem>();
  const [selectedSellItem, setSelectedSellItem] = useState<SellItem>();
  const [cart, setCart] = useState<Map<string, SellItem>>(new Map());
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
    const existingCart = Cookies.get('cartItems');
    let cartItems: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
    
    const cartItemIds = new Set(cartItems.map(item => item.id));
  
    setFilteredItems(items.map(item => ({
      ...item,
      checked: cartItemIds.has(item.id) // Asegúrate de convertir los IDs a cadena si es necesario
  })));
  }, [items]); // Dependencia a 'items' para recalcular cuando los ítems cargados cambien
  
  

  useEffect(() => {
    if (menuOpened) {
      document
        .getElementById("menu-container")!
        .addEventListener("mousedown", handleClickOutsideMenu);
    }
  }, [menuOpened]);

  useEffect(() => {
    const fetchItems = async () => {
      await Manager.getInstance().loadMoreItems();
      const items = Manager.getInstance().getItems();
    
      const sellItems = items.map(item => {
        // Asumiendo que cada imagen tiene una propiedad 'url' y 'color'
        const images = item.getImages();
        const colors = [...new Set(images.map(img => img.color))];
        const units = item.getReplenishments().reduce((sum, replenishment) => {
          return sum + Array.from(replenishment.getLocations().values()).reduce((acc, val) => acc + val, 0);
        }, 0);
    
        return {
          id: item.getId(),
          image: images[0]?.url || '', // Usa un valor predeterminado en caso de que no haya imágenes
          title: item.getName(),
          provider: item.getProvider().getName(),
          colors: colors,
          extraColors: colors.length > 6 ? colors.length - 6 : 0,
          discount: 0, // Establecido estáticamente como 0 según el ejemplo
          previousPrice: 0, // Establecido estáticamente como 0 según el ejemplo
          price: item.getPrice(), // Asegúrate de convertir el precio a número si es necesario
          checked: false,
          units: units,
          color: images[0]?.color || '', // Usa un valor predeterminado en caso de que no haya imágenes
          rebajaUnidad: 0,
          rebajaTotal: 0
        };
      });
      setItems(sellItems);
      setFilteredItems(sellItems);
    };

    fetchItems();
  }, []);

  const handleSellItemClick = (item: SellItem, event: React.MouseEvent) => {
    if (menuOpened) {
      // Si el menú está abierto, cierra el menú sin realizar ninguna otra acción
      setMenuOpened(false);
      event.stopPropagation(); // Detiene la propagación del evento de clic
    } else {
      setSelectedSellItem(item);
      const savedItem = Manager.getInstance().getItems().filter((savedItem) => savedItem.getId() === item.id)[0];
      console.log(savedItem.getImages())
      // Crear un objeto para agrupar las imágenes por color
      const groupedByColor: { [key: string]: string[] } = {};

      // Agrupar las URLs de las imágenes por color
      for (const item of savedItem.getImages()) {
        if (!groupedByColor[item.color]) {
            groupedByColor[item.color] = [];
        }
        groupedByColor[item.color].push(item.url!);
      }

      // Convertir el objeto a un arreglo de tuplas ImagesByColor
      const imagesByColor: ImagesByColor[] = Object.keys(groupedByColor).map(color => [color, groupedByColor[color]]);
      const entireItem: EntireItem = {
        id: savedItem.getId(),
        title: savedItem.getName(),
        provider: savedItem.getProvider().getName(),
        discount: 0,
        price: savedItem.getPrice(),
        imagesByColors: imagesByColor
      } 
      setSelectedItem(entireItem);
      setFullItemView(true);
    }
  };

  const closeItem = () => {
    setFullItemView(false);
  };

  const addToCart = (item: SellItem, units: number) => {
    const newItem = {id: item.id, color: item.color, units: units, rebajaUnidad: item.rebajaUnidad, rebajaTotal: item.rebajaTotal}
    const existingCart = Cookies.get('cartItems'); // Obtener la cookie actual
    let cartItems: CartItem[] = existingCart ? JSON.parse(existingCart) : []; // Parsear el JSON si existe, o usar un array vacío
    cartItems.push(newItem); // Agregar el nuevo ítem al array
    const updatedCartJson = JSON.stringify(cartItems); // Convertir el array actualizado a JSON
    Cookies.set('cartItems', updatedCartJson, { expires: 7 }); // Guardar de nuevo en la cookie con expiración de 7 días
    setFullItemView(false);
    setFilteredItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.id === item.id ? { ...prevItem, checked: true } : prevItem
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

  const loadMoreItems = async () => {
    setLoading(true); // Mostrar la barra de carga
    await Manager.getInstance().loadMoreItems();
    const newItems = Manager.getInstance().getItems();
    console.log(newItems);
    setLoading(false); // Ocultar la barra de carga
  };

  const goToCart = () => {
    //TODO see cart
    console.log("goto cart clicked")
    // Cookies.remove('cartItems');
    navigate('/shopping_cart');
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      loadMoreItems(); // Llamar a la función cuando se llega al final de la página
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]); // Asegúrate de incluir todas las dependencias necesarias aquí
  

  return (
    <div id="sell-page" className="text-neutral-900 min-h-screen">
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
            goToCart={goToCart}
          />
        </div>
      )}
      {fullItemView && (
        <div className="fixed z-40 w-screen h-screen bg-white/[0.6] p-5 overflow-y-auto">
          <ShowItemComponent
            sellItem={selectedSellItem!}
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
        {loading && <div className="loader"></div>}
      </div>
    </div>
  );
};
