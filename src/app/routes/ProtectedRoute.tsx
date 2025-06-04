import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Mostrar indicador de carga mientras verificamos la autenticación
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir a la página de login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirigir a la página de inicio si no tiene el permiso requerido
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y tiene los permisos necesarios, mostrar el componente hijo
  return <>{children}</>;
};

export default ProtectedRoute;
