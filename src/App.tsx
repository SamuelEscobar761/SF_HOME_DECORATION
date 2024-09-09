import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./app/routes/AppRoutes";
import { DeviceProvider } from "./app/context/DeviceContext"; // Asegúrate de que la ruta sea correcta
import ResponsiveNavbar from "./app/layout/ResponsiveNavbar";

function App() {
  return (
    <DeviceProvider>
      <Router>
        <div className="flex flex-col h-screen bg-primary">
          {window.innerWidth >= 768 &&(
            <ResponsiveNavbar/>
          )}
          <div className="overflow-y-auto bg-primary text-neutral-900 ">
            <AppRoutes />
          </div>
          {window.innerWidth < 768 &&(
            <ResponsiveNavbar />
          )}
        </div>
      </Router>
    </DeviceProvider>
  );
}

export default App;
