import { User } from "../classes/User";
import { UserAuthorization } from "../classes/UserAuthorization";

// Mapeo de códigos de autorización a nombres en español
const AUTH_NAME_MAP: Record<string, string> = {
  DASHBOARD_ACCESS: "Acceso al panel de gráficos",
  REPORTS_VIEW: "Ver reportes",
  SETTINGS_EDIT: "Editar configuración",
};

export const UserCardComponent = ({ user }: { user: User }) => {
  // Filtrar solo autorizaciones con acceso habilitado
  const activeAuths = user
    .getAuthorizations()
    .filter((auth: UserAuthorization) => auth.isAccess());

  return (
    <div
      id="user-card-component"
      className="flex space-x-4 bg-neutral-300 rounded-lg"
    >
      <img
        src="/images/avatar.png"
        id="user-card-picture"
        className="w-14 h-14 bg-neutral-100 rounded-full object-contain"
      />

      <div id="user-card-content" className="flex-1 space-y-2">
        <p className="text-xl font-semibold">
          {user.getName()} {user.getLastname()}
        </p>

        <p id="user-card-areas-available" className="text-lg font-medium">
          Áreas disponibles:
        </p>

        <div className="flex flex-wrap gap-2">
          {activeAuths.length > 0 ? (
            activeAuths.map((auth) => (
              <span
                key={auth.getId()}
                className="bg-violet-500 text-white px-3 py-1 rounded-full text-sm"
              >
                {AUTH_NAME_MAP[auth.getName()] || auth.getName()}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-600">Sin autorizaciones</span>
          )}
        </div>
      </div>
    </div>
  );
};
