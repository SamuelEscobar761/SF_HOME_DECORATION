import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "../../../assets/Home-Icon.svg";
import SellIcon from "../../../assets/Sell-Icon.svg";
import InventoryIcon from "../../../assets/Inventory-Icon.svg";
import ReplenishmentIcon from "../../../assets/Replenishment-Icon.svg";
import ProfilesIcon from "../../../assets/Profiles-Icon.svg";
import LogoutIcon from "../../../assets/Logout-Icon.png"; // Asegúrate de tener este icono
import classNames from "classnames";
import { useAuth } from "../../context/AuthContext";

// Define la estructura de un elemento del navbar
interface NavItem {
  path: string; // Ruta a la que se redirige el Link
  icon: string; // Ícono que se muestra en el navbar
  label: "home" | "sell" | "inventory" | "replenishment" | "users" | "logout"; // Identificador único del ítem
  permission: string; // Permiso requerido para mostrar esta opción
}

// Lista de ítems del navbar con sus propiedades y permisos requeridos
const navItems: NavItem[] = [
  { path: "/", icon: HomeIcon, label: "home", permission: "HOME" },
  { path: "/sell", icon: SellIcon, label: "sell", permission: "SALES" },
  {
    path: "/inventory",
    icon: InventoryIcon,
    label: "inventory",
    permission: "INVENTORY",
  },
  {
    path: "/replenishment",
    icon: ReplenishmentIcon,
    label: "replenishment",
    permission: "PROVIDERS",
  },
  { path: "/users", icon: ProfilesIcon, label: "users", permission: "USERS" },
  { path: "/logout", icon: LogoutIcon, label: "logout", permission: "" }, // No requiere permiso específico
];

export const NavbarMobile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission, logout } = useAuth();
  const [active, setActive] = useState<string | null>(null);
  const [navbarWidth, setNavbarWidth] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(true);

  // Filtrar los ítems de navegación según los permisos del usuario
  const authorizedItems = navItems.filter(
    (item) => item.permission === "" || hasPermission(item.permission)
  );

  // Efecto para configurar el ancho de la barra de navegación
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

  // Inicialización: Establecer la primera página autorizada como activa y redirigir si es necesario
  useEffect(() => {
    // Solo se ejecuta en el montaje inicial
    if (initialLoadRef.current && authorizedItems.length > 0) {
      initialLoadRef.current = false;

      // Obtener el primer ítem autorizado que no sea logout
      const firstAuthorizedItem = authorizedItems.find(
        (item) => item.label !== "logout"
      );

      if (firstAuthorizedItem) {
        // Si estamos en la ruta raíz "/" y hay otra ruta autorizada, redirigir a esa
        if (location.pathname === "/" && firstAuthorizedItem.path !== "/") {
          navigate(firstAuthorizedItem.path);
        }

        // Establecer el ítem activo basado en la ruta actual o el primer ítem autorizado
        const currentPathItem = authorizedItems.find(
          (item) => item.path === location.pathname
        );
        setActive(currentPathItem?.label || firstAuthorizedItem.label);
      }
    }
  }, [authorizedItems, location.pathname, navigate]);

  // Actualiza el estado 'active' cuando cambia la ruta
  useEffect(() => {
    const currentPath = location.pathname;
    const foundItem = navItems.find((item) => item.path === currentPath);
    if (foundItem) {
      setActive(foundItem.label);
    }
  }, [location]);

  // Maneja el logout
  const handleLogout = (e: React.MouseEvent, item: NavItem) => {
    if (item.label === "logout") {
      e.preventDefault();
      logout();
      navigate("/login");
    }
  };

  // Función para obtener las clases de tamaño según el tipo de ícono
  const getIconSizeClass = (label: string) => {
    // Aplicar size-5 solo al home (logo) y al logout
    if (label === "logout") {
      return "size-5 mt-1";
    }
    // Mantener el tamaño original para los demás íconos
    return "h-7 w-7";
  };

  return (
    <nav className="fixed bottom-0 w-full bottom-0 bg-primary border-t border-tertiary-dark z-20">
      <div ref={navbarRef} className="relative flex justify-around">
        {authorizedItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="p-4"
            onClick={(e) => {
              setActive(item.label);
              handleLogout(e, item);
            }}
          >
            <img
              src={item.icon}
              alt={item.label}
              className={classNames(getIconSizeClass(item.label), {
                "svg-icon": active === item.label,
              })}
            />
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavbarMobile;
