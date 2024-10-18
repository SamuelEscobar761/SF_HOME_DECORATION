import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; // Importa useLocation
import HomeIcon from "../../../assets/Home-Icon.svg";
import SellIcon from "../../../assets/Sell-Icon.svg";
import InventoryIcon from "../../../assets/Inventory-Icon.svg";
import ReplenishmentIcon from "../../../assets/Replenishment-Icon.svg";
import ProfilesIcon from "../../../assets/Profiles-Icon.svg";
import classNames from "classnames";

// Define la estructura de un elemento del navbar
interface NavItem {
  path: string; // Ruta a la que se redirige el Link
  icon: string; // Ícono que se muestra en el navbar
  label: "home" | "sell" | "inventory" | "replenishment" | "users"; // Identificador único del ítem
}

// Lista de ítems del navbar con sus propiedades
const navItems: NavItem[] = [
  { path: "/", icon: HomeIcon, label: "home" },
  { path: "/sell", icon: SellIcon, label: "sell" },
  { path: "/inventory", icon: InventoryIcon, label: "inventory" },
  { path: "/replenishment", icon: ReplenishmentIcon, label: "replenishment" },
  { path: "/users", icon: ProfilesIcon, label: "users" },
];

// Mapa de autorizaciones para controlar qué ítems están disponibles
const authorizations: Record<NavItem["label"], boolean> = {
  home: true,
  sell: true,
  inventory: true,
  replenishment: true,
  users: true,
};

// Función para verificar si un ítem está autorizado
const isAuthorized = (label: NavItem["label"]): boolean => {
  return authorizations[label];
};

export const NavbarMobile: React.FC = () => {
  const location = useLocation(); // Obtén la ubicación actual
  const [active, setActive] = useState<string | null>("home");
  const [navbarWidth, setNavbarWidth] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarWidth(navbarRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarWidth(navbarRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Actualiza el estado 'active' en función de la ruta actual
  useEffect(() => {
    const currentPath = location.pathname;
    const foundItem = navItems.find((item) => item.path === currentPath);
    if (foundItem) {
      setActive(foundItem.label); // Establece el ítem activo en base a la ruta
    }
  }, [location]); // Este useEffect se ejecuta cuando la ruta cambia

  // Cálculo del índice medio para centrar la barra
  const middleIndex = Math.floor((navItems.length - 1) / 2);

  // Ancho de cada ítem basado en el ancho total del navbar
  const itemWidth = navbarWidth / navItems.length;


  return (
    <nav className="fixed bottom-0 w-full bottom-0 bg-primary border-t border-tertiary-dark z-50">
      <div ref={navbarRef} className="relative flex justify-around">
        <div
          className="absolute w-6 h-1 bg-secondary-light transition-all duration-300 rounded"
          style={{
            transform: `translateX(calc(${
              (navItems.findIndex((item) => item.label === active) - middleIndex) * itemWidth
            }px))`,
          }}
        ></div>
        {navItems.map(
          (item, index) =>
            isAuthorized(item.label) && (
              <Link
                key={index}
                to={item.path}
                className="p-4"
                onClick={() => {
                  setActive(item.label);
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={classNames("h-7 w-7", {
                    "svg-icon": active === item.label,
                  })}
                />
              </Link>
            )
        )}
      </div>
    </nav>
  );
};

export default NavbarMobile;
