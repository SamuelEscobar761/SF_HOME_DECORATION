// components/UserCardComponent.tsx
import { User } from "../classes/User";
import { UserAuthorization } from "../classes/UserAuthorization";

export const AUTH_NAME_MAP: Record<string, string> = {
  DASHBOARD_ACCESS: "Acceso al panel de inicio",
  REPORTS_VIEW: "Ver reportes",
  SETTINGS_EDIT: "Editar configuración",
};

export const UserCardComponent = ({
  user,
  onClick,
}: {
  user: User;
  onClick: () => void;
}) => {
  const activeAuths = user
    .getAuthorizations()
    .filter((auth: UserAuthorization) => auth.isAccess());

  return (
    <div
      onClick={onClick}
      className="flex space-x-4 bg-neutral-300 p-4 rounded-lg cursor-pointer hover:bg-neutral-400 transition-none"
    >
      <img
        src={user.getImage() ?? "/images/avatar.png"}
        alt="avatar"
        className="w-14 h-14 rounded-full object-cover"
      />

      <div className="flex-1 space-y-2">
        <p className="text-xl font-semibold">
          {user.getName()} {user.getLastname()}
        </p>
        <p className="text-lg font-medium">Áreas disponibles:</p>
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
