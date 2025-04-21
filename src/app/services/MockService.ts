import { Provider } from "../classes/Provider";
import { User } from "../classes/User";
import { UserAuthorization } from "../classes/UserAuthorization";

// Proveedores mock
export const mockedProviders: Provider[] = [
  new Provider(
    1,
    "Tapizados del Pacífico",
    [],
    "María",
    "González",
    "912345678",
    "maria.gonzalez@tapizpacifico.cl",
    "Av. Providencia 1234, Santiago",
    "76543210",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYk0y5ErS0OpznJCynbaV7ogUB9svJmPFcJg&s",
  ),
  new Provider(
    2,
    "DecorHome Chile",
    [],
    "Javier",
    "Pérez",
    "913456789",
    "javier.perez@decorhome.cl",
    "Calle Condell 56, Valparaíso",
    "76543211",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBobeUUbiwP9HY4Bp-pWC53g2_XOz_tjBTsg&s",
  ),
  new Provider(
    3,
    "TodoHogar",
    [],
    "Camila",
    "Rojas",
    "914567890",
    "camila.rojas@fundasymas.cl",
    "Av. O'Higgins 789, Rancagua",
    "76543212",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQejUvf2B6StIMs5Wl_R5dGqIfd36NwtP-hfw&s",
  ),
  new Provider(
    4,
    "Estilo Hogar",
    [],
    "Andrés",
    "Martínez",
    "915678901",
    "andres.martinez@estilohogar.cl",
    "Calle Colón 321, Concepción",
    "76543213",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvVowsPEOQ7kCjTvUZEN7-URzifhrT15r5QQ&s",
  ),
  new Provider(
    5,
    "El Container",
    [],
    "Lorena",
    "Vargas",
    "916789012",
    "lorena.vargas@ambientesunicos.cl",
    "Av. Libertad 210, La Serena",
    "76543214",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSConsCTCsQjsjbGA2rvVerpfDwSdqRsuJZ2A&s",
  ),
];

// Usuarios mock
export const mockedUsers: User[] = [
  new User(1, "Sara", "García", "sara.garcia@example.com", "+591 71234567", [
    new UserAuthorization(1, "DASHBOARD_ACCESS", true),
    new UserAuthorization(2, "REPORTS_VIEW", true),
    new UserAuthorization(3, "SETTINGS_EDIT", false),
  ]),
  new User(
    2,
    "Flavio",
    "Torres",
    "flavio.torres@example.com",
    "+591 79876543",
    [
      new UserAuthorization(1, "DASHBOARD_ACCESS", true),
      new UserAuthorization(2, "REPORTS_VIEW", false),
      new UserAuthorization(3, "SETTINGS_EDIT", false),
    ]
  ),
  new User(
    3,
    "Elena",
    "Martínez",
    "elena.martinez@example.com",
    "+591 70123456",
    [
      new UserAuthorization(1, "DASHBOARD_ACCESS", true),
      new UserAuthorization(2, "REPORTS_VIEW", true),
      new UserAuthorization(3, "SETTINGS_EDIT", true),
    ]
  ),
  new User(
    4,
    "Mariel",
    "Rodríguez",
    "mariel.rodriguez@example.com",
    "+591 71239876",
    [
      new UserAuthorization(1, "DASHBOARD_ACCESS", false),
      new UserAuthorization(2, "REPORTS_VIEW", true),
      new UserAuthorization(3, "SETTINGS_EDIT", false),
    ]
  ),
  new User(
    5,
    "Samuel",
    "Fernández",
    "samuel.fernandez@example.com",
    "+591 79871234",
    [
      new UserAuthorization(1, "DASHBOARD_ACCESS", true),
      new UserAuthorization(2, "REPORTS_VIEW", true),
      new UserAuthorization(3, "SETTINGS_EDIT", true),
    ]
  ),
];

// Autorizaciones mock

export const mockedAllUserAuthorizations: UserAuthorization[] = [
  new UserAuthorization(1, "DASHBOARD_ACCESS", true),
  new UserAuthorization(2, "REPORTS_VIEW", true),
  new UserAuthorization(3, "SETTINGS_EDIT", true),
  new UserAuthorization(4, "USERS_MANAGE", true),
  new UserAuthorization(5, "ROLES_MANAGE", true),
  new UserAuthorization(6, "PERMISSIONS_EDIT", true),
  new UserAuthorization(7, "PROFILE_EDIT", true),
  new UserAuthorization(8, "NOTIFICATIONS_MANAGE", true),
  new UserAuthorization(9, "AUDIT_LOG_VIEW", true),
  new UserAuthorization(10, "API_KEYS_MANAGE", true),
  // Si quieres más:
  new UserAuthorization(11, "DATA_EXPORT", true),
  new UserAuthorization(12, "INVOICE_GENERATE", true),
];
