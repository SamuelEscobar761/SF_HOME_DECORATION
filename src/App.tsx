import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./app/routes/AppRoutes";
import { DeviceProvider } from "./app/context/DeviceContext";
import { AuthProvider } from "./app/context/AuthContext";
import ResponsiveNavbar from "./app/layout/ResponsiveNavbar";
import ScrollToTop from "./app/components/ScrollToTop";
import { useAuth } from "./app/context/AuthContext";

// Componente interno que comprueba si debe mostrar la navbar
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const navbarHeight = 62; // Altura de la navbar

  return (
    <div className="flex flex-col h-screen bg-primary">
      {isAuthenticated && window.innerWidth >= 768 && <ResponsiveNavbar />}
      <div className={isAuthenticated ? "pb-[62px]" : ""}>
        <div
          style={{
            minHeight: isAuthenticated
              ? `calc(100vh - ${navbarHeight}px)`
              : "100vh",
          }}
          className="bg-primary text-neutral-900"
        >
          <AppRoutes />
        </div>
      </div>
      {isAuthenticated && window.innerWidth < 768 && <ResponsiveNavbar />}
    </div>
  );
};

function App() {
  return (
    <DeviceProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </DeviceProvider>
  );
}

export default App;
