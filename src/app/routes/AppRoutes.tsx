import { Route, Routes, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { SellPage } from "../pages/SellPage";
import { InventoryPage } from "../pages/InventoryPage";
import { ProvidersPage } from "../pages/providers-page/ProvidersPage";
import { UsersPage } from "../pages/users-page/UsersPage";
import { ShoppingCartPage } from "../pages/ShoppingCartPage";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = () => {
  const { isAuthenticated, hasPermission } = useAuth();

  // Función para determinar a qué ruta redirigir basado en los permisos del usuario
  const getDefaultRoute = () => {
    // Orden de prioridad para la redirección
    const permissionsToCheck = [
      { permission: "HOME", path: "/" },
      { permission: "SALES", path: "/sell" },
      { permission: "INVENTORY", path: "/inventory" },
      { permission: "PROVIDERS", path: "/replenishment" },
      { permission: "USERS", path: "/users" },
    ];

    // Encuentra el primer permiso que tenga el usuario
    for (const { permission, path } of permissionsToCheck) {
      if (hasPermission(permission)) {
        return path;
      }
    }

    // Si no tiene ningún permiso o no está autenticado, redirigir al login
    return "/login";
  };

  // Si el usuario está autenticado pero no tiene permiso para HOME,
  // determinar inmediatamente a dónde redirigir
  const homeRedirect = () => {
    if (isAuthenticated && !hasPermission("HOME")) {
      return <Navigate to={getDefaultRoute()} replace />;
    }

    return (
      <ProtectedRoute requiredPermission="HOME">
        <HomePage />
      </ProtectedRoute>
    );
  };

  return (
    <Routes>
      {/* Ruta pública para login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Ruta raíz con redirección mejorada */}
      <Route path="/" element={homeRedirect()} />

      <Route
        path="/sell"
        element={
          <ProtectedRoute requiredPermission="SALES">
            <SellPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute requiredPermission="INVENTORY">
            <InventoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/replenishment"
        element={
          <ProtectedRoute requiredPermission="PROVIDERS">
            <ProvidersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute requiredPermission="USERS">
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/shopping_cart"
        element={
          <ProtectedRoute requiredPermission="SALES">
            <ShoppingCartPage />
          </ProtectedRoute>
        }
      />

      {/* Ruta para redirigir cualquier ruta no existente a la ruta por defecto */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

export default AppRoutes;
