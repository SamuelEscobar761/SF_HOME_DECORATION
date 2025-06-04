import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Definición de la API base - Ajusta según la configuración de tu backend
// Puedes usar /api/ si has añadido este prefijo en tu Django urls.py
const API_URL = "http://localhost:8000"; // Sin /api si no lo has añadido en el backend

// Si necesitas incluir el prefijo /api, usa esta línea en su lugar:
// const API_URL = "http://localhost:8000/api";

interface Authorization {
  id: number;
  authorization_type: number;
  authorization_name: string;
  is_active: boolean;
}

interface UserData {
  id: number;
  name: string;
  lastname: string;
  email: string;
  authorizations: Authorization[];
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkUserExists: (
    email: string
  ) => Promise<{ exists: boolean; hasPassword: boolean }>;
  setPassword: (email: string, password: string) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Asegurarse de que authorizations siempre sea un array
          userData.authorizations = userData.authorizations || [];

          setUser(userData);
          setIsAuthenticated(true);
          console.log("Usuario recuperado del almacenamiento local:", userData);
        } catch (error) {
          console.error(
            "Error al cargar datos de usuario del localStorage:",
            error
          );
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    checkStoredUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log(`Intentando login con email: ${email}`);

      // Llamada a la API de login
      const response = await axios.post(`${API_URL}/users/login/`, {
        email,
        password,
      });

      console.log("Respuesta de login:", response.data);

      if (response.data.success) {
        // Asegurarse de que el usuario tenga un array de authorizations, incluso si está vacío
        const userData = {
          ...response.data.user,
          authorizations: response.data.user.authorizations || [],
        };

        console.log("Datos de usuario a guardar:", userData);

        // Guardar datos del usuario en localStorage para persistencia entre recargas
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Verificar si es un error de Axios con respuesta del servidor
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detalles del error:", error.response.data);
      }
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    console.log("Sesión cerrada");
  };

  // Verificar si un usuario existe y tiene contraseña
  const checkUserExists = async (
    email: string
  ): Promise<{ exists: boolean; hasPassword: boolean }> => {
    try {
      console.log(`Verificando si existe el usuario con email: ${email}`);

      const response = await axios.post(`${API_URL}/users/check-user-exists/`, {
        email,
      });

      console.log("Respuesta de verificación de usuario:", response.data);

      // IMPORTANTE: Convertir has_password a hasPassword para mantener la coherencia con la interfaz
      return {
        exists: response.data.exists,
        hasPassword: response.data.has_password, // Transformamos el formato snake_case a camelCase
      };
    } catch (error) {
      console.error("Error al verificar usuario:", error);
      // Verificar si es un error de Axios con respuesta del servidor
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detalles del error:", error.response.data);
        console.error("Status:", error.response.status);
      }
      return { exists: false, hasPassword: false };
    }
  };

  // Establecer contraseña para un usuario
  const setPassword = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.log(`Estableciendo contraseña para usuario con email: ${email}`);

      const response = await axios.post(`${API_URL}/users/set-password/`, {
        email,
        password,
      });

      console.log("Respuesta al establecer contraseña:", response.data);
      return response.data.success;
    } catch (error) {
      console.error("Error al establecer contraseña:", error);
      // Verificar si es un error de Axios con respuesta del servidor
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detalles del error:", error.response.data);
      }
      return false;
    }
  };

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission: string): boolean => {
    // Si no hay usuario o no tiene autorizaciones, no tiene permiso
    if (!user || !user.authorizations || !Array.isArray(user.authorizations)) {
      console.log(
        `Sin permiso ${permission}: Usuario no autenticado o sin autorizaciones`
      );
      return false;
    }

    const hasAuth = user.authorizations.some(
      (auth) => auth.authorization_name === permission && auth.is_active
    );

    console.log(
      `Verificando permiso ${permission}: ${hasAuth ? "Concedido" : "Denegado"}`
    );
    return hasAuth;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkUserExists,
    setPassword,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
