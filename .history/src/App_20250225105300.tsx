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
          <div className="pb-[62px]">
            <div
              style={{
                minHeight: `calc(100vh - ${navbarHeight}px)`
              }}
              className="bg-primary text-neutral-900"
            >
              <AppRoutes />
            </div>
          </div>
          {window.innerWidth < 768 && <ResponsiveNavbar />}
        </div>
      </Router>
    </DeviceProvider>
  );
}

export default App;
