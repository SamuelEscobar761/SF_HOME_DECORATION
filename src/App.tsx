import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { AppRoutes } from './app/routes/AppRoutes';
import { DeviceProvider } from './app/context/DeviceContext'; // Asegúrate de que la ruta sea correcta
import ResponsiveNavbar from './app/layout/ResponsiveNavbar';

function App() {
  return (
    <DeviceProvider>
      <Router>
        <ResponsiveNavbar/>
        <AppRoutes />
      </Router>
    </DeviceProvider>
  );
}

export default App;
