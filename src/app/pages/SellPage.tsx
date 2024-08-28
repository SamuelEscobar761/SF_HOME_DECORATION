import { SellItem } from "../components/SellItem";
import HamburguerButton from "../../assets/Hamburguer-Button-Icon.svg";
import { useEffect, useRef, useState } from "react";

export const SellPage = () => {
    const [menuOpened, setMenuOpened] = useState<boolean>(false);
    const [rooms, setRooms] = useState<string[]>(["Comedor", "Living", "Baño"]);
    const [materials, setMaterials] = useState<string[]>(["Tela Jagguar", "Tela Cuadrillé", "Tela Turca"]);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setMenuOpened(!menuOpened);
    }

    const handleClickOutsideMenu = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setMenuOpened(false);
            event.stopPropagation(); // Detiene la propagación para que no se active ninguna otra acción
        }
    };

    useEffect(() => {
        if(menuOpened){
            document.getElementById("menu-container")!.addEventListener('mousedown', handleClickOutsideMenu);
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

    return(
        <div>
            {menuOpened && (
                <div id='menu-container' className="fixed z-40 h-screen w-screen bg-white/[0.6]">
                <div id='mnu-content' className="bg-primary h-screen w-fit p-2" ref={menuRef}>
                    <button>Carrito</button>
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
                            {rooms.map((room, index) => {
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
                            {materials.map((material, index) => {
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
                </div>
            )}
            <div id="content" className="p-2">
            <div id="top-buttons" className="flex justify-between mt-2 mb-6">
                <div id="hamburguer-button" onClick={toggleMenu}>
                    <img src={HamburguerButton} className="w-9 h-9" />
                </div>
                <div id="search-bar">
                    <input placeholder="Buscar" className="rounded-full py-1 px-2 text-base border border-neutral-900" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <SellItem onClick={handleSellItemClick} image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={4} discount={0} previousPrice={0} price={0} checked={false} />
                <SellItem onClick={handleSellItemClick} image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={15} discount={0} previousPrice={0} price={0} checked={true} />
                <SellItem onClick={handleSellItemClick} image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={4} discount={0} previousPrice={0} price={0} checked={false} />
                <SellItem onClick={handleSellItemClick} image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={15} discount={0} previousPrice={0} price={0} checked={false} />
                <SellItem onClick={handleSellItemClick} image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={4} discount={0} previousPrice={0} price={0} checked={true} />
                <SellItem onClick={handleSellItemClick} image="" title="Title" colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]} extraColors={15} discount={0} previousPrice={0} price={0} checked={false} />
            </div>
            </div>
        </div>
    );
}