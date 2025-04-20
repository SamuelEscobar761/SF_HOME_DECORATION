import { Provider } from "../classes/Provider";
import { User } from "../classes/User";

// Proveedores mock (home decoration items)
export const mockedProviders: Provider[] = [
  new Provider(
    "Tapizados del Pacífico",
    [],
    "María",
    "González",
    "912345678",
    "maria.gonzalez@tapizpacifico.cl",
    "Av. Providencia 1234, Santiago",
    "76543210"
  ),
  new Provider(
    "DecorHome Chile",
    [],
    "Javier",
    "Pérez",
    "913456789",
    "javier.perez@decorhome.cl",
    "Calle Condell 56, Valparaíso",
    "76543211"
  ),
  new Provider(
    "Fundas y Más",
    [],
    "Camila",
    "Rojas",
    "914567890",
    "camila.rojas@fundasymas.cl",
    "Av. O'Higgins 789, Rancagua",
    "76543212"
  ),
  new Provider(
    "Estilo Hogar",
    [],
    "Andrés",
    "Martínez",
    "915678901",
    "andres.martinez@estilohogar.cl",
    "Calle Colón 321, Concepción",
    "76543213"
  ),
  new Provider(
    "Ambientes Únicos",
    [],
    "Lorena",
    "Vargas",
    "916789012",
    "lorena.vargas@ambientesunicos.cl",
    "Av. Libertad 210, La Serena",
    "76543214"
  ),
];


// Usuarios mock
export const mockedUsers: User[] = [];