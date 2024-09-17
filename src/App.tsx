import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./app/routes/AppRoutes";
import { DeviceProvider } from "./app/context/DeviceContext";
import ResponsiveNavbar from "./app/layout/ResponsiveNavbar";
import ScrollToTop from "./app/components/ScrollToTop";

function App() {
  return (
    <DeviceProvider>
      <Router>
        <ScrollToTop /> {/* Este es el componente que maneja el scroll */}
        <div className="flex flex-col h-screen bg-primary">
          {window.innerWidth >= 768 && (
            <ResponsiveNavbar />
          )}
          <div className="overflow-y-auto bg-primary text-neutral-900">
            <AppRoutes />
          </div>
          {window.innerWidth < 768 && (
            <ResponsiveNavbar />
          )}
        </div>
      </Router>
    </DeviceProvider>
  );
}

export default App;
