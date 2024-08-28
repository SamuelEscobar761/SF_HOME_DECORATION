import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '../../../assets/Home-Icon.svg';
import SellIcon from '../../../assets/Sell-Icon.svg';
import InventoryIcon from '../../../assets/Inventory-Icon.svg';
import ReplenishmentIcon from '../../../assets/Replenishment-Icon.svg';
import ProfilesIcon from '../../../assets/Profiles-Icon.svg';
import classNames from 'classnames';

// Define la estructura de un elemento del navbar
interface NavItem {
  path: string;  // Ruta a la que se redirige el Link
  icon: string;  // Ícono que se muestra en el navbar
  label: 'home' | 'sell' | 'inventory' | 'replenishment' | 'users';  // Identificador único del ítem
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
const authorizations: Record<NavItem['label'], boolean> = {
  home: true,
  sell: true,
  inventory: true,
  replenishment: true,
  users: true,
};

// Función para verificar si un ítem está autorizado
const isAuthorized = (label: NavItem['label']): boolean => {
  return authorizations[label];
};

export const NavbarMobile: React.FC = () => {
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cálculo del índice medio para centrar la barra
  const middleIndex = Math.floor((navItems.length - 1) / 2);
  
  // Ancho de cada ítem basado en el ancho total del navbar
  const itemWidth = navbarWidth / navItems.length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div ref={navbarRef} className="relative flex justify-around text-gray-600">
        <div
          className="absolute w-6 h-1 bg-secondary-light transition-all duration-300 rounded"
          style={{
            transform: `translateX(calc(${(navItems.findIndex(item => item.label === active) - middleIndex) * itemWidth}px))`,
          }}
        ></div>
        
        {navItems.map((item, index) =>
          isAuthorized(item.label) && (
            <Link
              key={index}
              to={item.path}
              className="p-2"
              onClick={() => setActive(item.label)}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={classNames('h-6 w-6', {
                  'svg-icon': active === item.label,
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