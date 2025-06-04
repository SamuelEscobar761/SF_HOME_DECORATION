import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LocationState {
  from?: {
    pathname: string;
  };
}

// Estados posibles del flujo de login
type LoginStep = "EMAIL_CHECK" | "PASSWORD_INPUT" | "PASSWORD_CREATION";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Define el paso actual del proceso de login (comenzamos con la verificación de email)
  const [currentStep, setCurrentStep] = useState<LoginStep>("EMAIL_CHECK");

  const navigate = useNavigate();
  const location = useLocation();
  const { login, checkUserExists, setPassword: setUserPassword } = useAuth();

  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || "/";

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor, introduce tu email");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Verificar si el usuario existe y tiene contraseña
      const { exists, hasPassword } = await checkUserExists(email);

      if (!exists) {
        setError("El correo no está registrado en el sistema");
      } else if (!hasPassword) {
        // Usuario existe pero no tiene contraseña
        setCurrentStep("PASSWORD_CREATION");
      } else {
        // Usuario existe y tiene contraseña
        setCurrentStep("PASSWORD_INPUT");
      }
    } catch (err) {
      setError("Ocurrió un error. Inténtalo de nuevo.");
      console.error("Error al verificar usuario:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Por favor, introduce y confirma tu contraseña");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Establecer la contraseña del usuario
      const success = await setUserPassword(email, password);

      if (success) {
        // Iniciar sesión con la nueva contraseña
        const loginSuccess = await login(email, password);

        if (loginSuccess) {
          navigate(from, { replace: true });
        } else {
          setError("Error al iniciar sesión con la nueva contraseña");
        }
      } else {
        setError("Error al establecer la contraseña");
      }
    } catch (err) {
      setError("Ocurrió un error. Inténtalo de nuevo.");
      console.error("Error al crear contraseña:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Por favor, introduce tu contraseña");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await login(email, password);

      if (success) {
        // Redirigir a la página desde la que vino o a la página de inicio
        navigate(from, { replace: true });
      } else {
        setError("Contraseña incorrecta");
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión. Inténtalo de nuevo.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para volver al paso de verificación de email
  const handleBack = () => {
    setCurrentStep("EMAIL_CHECK");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  // Determinar el título según el paso actual
  const getStepTitle = () => {
    switch (currentStep) {
      case "EMAIL_CHECK":
        return "Iniciar sesión";
      case "PASSWORD_INPUT":
        return "Ingresa tu contraseña";
      case "PASSWORD_CREATION":
        return "Crear contraseña";
      default:
        return "Iniciar sesión";
    }
  };

  // Componente de Spinner para estado de carga
  const LoadingSpinner = () => (
    <span className="flex items-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {currentStep === "EMAIL_CHECK" && "Verificando..."}
      {currentStep === "PASSWORD_INPUT" && "Iniciando sesión..."}
      {currentStep === "PASSWORD_CREATION" && "Creando contraseña..."}
    </span>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-primary px-2">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
          {getStepTitle()}
        </h2>
        {currentStep === "PASSWORD_CREATION" && (
          <p className="mt-2 text-center text-sm text-neutral-600">
            Es la primera vez que ingresas. Por favor introduce una contraseña
            para la próxima vez que ingreses.
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-primary-light py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {currentStep === "EMAIL_CHECK" && (
            // Paso 1: Formulario de verificación de email
            <form className="space-y-6" onSubmit={handleEmailCheck}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading
                      ? "bg-tertiary cursor-not-allowed"
                      : "bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  }`}
                >
                  {isLoading ? <LoadingSpinner /> : "Continuar"}
                </button>
              </div>
            </form>
          )}

          {currentStep === "PASSWORD_INPUT" && (
            // Paso 2: Formulario para ingresar contraseña
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email-display"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email-display"
                    type="email"
                    value={email}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading
                      ? "bg-tertiary cursor-not-allowed"
                      : "bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  }`}
                >
                  {isLoading ? <LoadingSpinner /> : "Iniciar sesión"}
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-white border-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                  Volver
                </button>
              </div>
            </form>
          )}

          {currentStep === "PASSWORD_CREATION" && (
            // Paso 3: Formulario de creación de contraseña
            <form className="space-y-6" onSubmit={handlePasswordCreate}>
              <div>
                <label
                  htmlFor="email-display"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email-display"
                    type="email"
                    value={email}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Nueva contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Confirmar contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading
                      ? "bg-tertiary cursor-not-allowed"
                      : "bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  }`}
                >
                  {isLoading ? <LoadingSpinner /> : "Crear contraseña"}
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-secondary bg-white border-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                  Volver
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
