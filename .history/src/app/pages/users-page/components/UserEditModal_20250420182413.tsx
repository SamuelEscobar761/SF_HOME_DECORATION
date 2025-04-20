// components/UserEditModal.tsx

interface UserEditModalProps {
  user: User;
  auths: UserAuthorization[];
  authStates: Record<number, boolean>;
  onClose: () => void;
  onToggleAuth: (id: number) => void;
  onFieldChange: (field: keyof User, value: string) => void;
  onSave: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  auths,
  authStates,
  onClose,
  onToggleAuth,
  onFieldChange,
  onSave,
}) => (
  <div className="fixed inset-0 bg-black/60 z-40">
    <div className="fixed inset-2 bg-background p-4 overflow-auto z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-xl font-bold"
      >
        ×
      </button>

      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">Editar usuario</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              ["getName", "Nombre"],
              ["getLastname", "Apellido"],
              ["getEmail", "Email"],
              ["getPhone", "Teléfono"],
            ] as [keyof User, string][]
          ).map(([getter, label]) => (
            <div key={getter}>
              <label className="block mb-1">{label}</label>
              <input
                type="text"
                value={(user[getter] as () => string)()}
                onChange={(e) => onFieldChange(getter, e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-medium mb-2">Permisos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {auths.map((auth) => (
              <label
                key={auth.getId()}
                className="inline-flex items-center"
              >
                <input
                  type="checkbox"
                  checked={authStates[auth.getId()]}
                  onChange={() => onToggleAuth(auth.getId())}
                  className="form-checkbox h-5 w-5"
                />
                <span className="ml-2">
                  {AUTH_NAME_MAP[auth.getName()] || auth.getName()}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
);
