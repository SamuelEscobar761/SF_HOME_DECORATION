import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./app/routes/AppRoutes";
import { DeviceProvider } from "./app/context/DeviceContext";
import ResponsiveNavbar from "./app/layout/ResponsiveNavbar";
import ScrollToTop from "./app/components/ScrollToTop";

function App() {
  const navbarHeight = 62; // Altura de la navbar

  return (
    <DeviceProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col h-screen bg-primary">
          {window.innerWidth >= 768 && <ResponsiveNavbar />}
          <div
            style={{
              minHeight: `calc(100vh - ${navbarHeight}px)`,
              paddingBottom: `${navbarHeight}px`,
            }}
            className="overflow-y-auto bg-primary text-neutral-900"
          >
            <AppRoutes />
          </div>
          {window.innerWidth < 768 && <ResponsiveNavbar />}
        </div>
      </Router>
    </DeviceProvider>
  );
}

export default App;
