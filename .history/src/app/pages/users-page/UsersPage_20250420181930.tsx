// pages/users/UsersPage.tsx
import { useEffect, useState } from "react";
import {
  AUTH_NAME_MAP,
  UserCardComponent,
} from "../../components/UserCardComponent";
import { Manager } from "../../classes/Manager";
import { UserAuthorization } from "../../classes/UserAuthorization";
import { User } from "../../classes/User";

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [allAuths, setAllAuths] = useState<UserAuthorization[]>([]);
  const [authStates, setAuthStates] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      const users = await Manager.getInstance().loadUsers();
      setUsers(users);
      setFilteredUsers(users);
      // cargar lista completa de autorizaciones
      const auths = await Manager.getInstance().getAllAuthorizations();
      setAllAuths(auths);
    })();
  }, []);

  // Refiltrar al cambiar búsqueda o usuarios
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    setFilteredUsers(
      !term
        ? users
        : users.filter((u) =>
            [u.getName(), u.getLastname(), u.getEmail()].some((field) =>
              field.toLowerCase().includes(term)
            )
          )
    );
  }, [searchTerm, users]);

  // Abrir modal y poblar estados
  const openModal = (user: User) => {
    setSelectedUser(user);
    // inicializar checkboxes según permisos actuales
    const initStates: Record<number, boolean> = {};
    allAuths.forEach((auth) => {
      initStates[auth.getId()] = user
        .getAuthorizations()
        .some((ua) => ua.getId() === auth.getId() && ua.isAccess());
    });
    setAuthStates(initStates);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  // Toggle permiso
  const toggleAuth = (authId: number) => {
    setAuthStates((prev) => ({
      ...prev,
      [authId]: !prev[authId],
    }));
  };

  // Guardar cambios (aquí puedes llamar al método real de Manager)
  const handleSave = async () => {
    if (!selectedUser) return;
    // Reconstruir lista de UserAuthorization
    const updatedAuths = allAuths.map(
      (auth) =>
        new UserAuthorization(
          auth.getId(),
          auth.getName(),
          authStates[auth.getId()]
        )
    );
    selectedUser.setAuthorizations(updatedAuths);
    await Manager.getInstance().updateUser(selectedUser); // implementa este método según tu lógica
    // también podrías refrescar la lista de users si lo deseas
    closeModal();
  };

  return (
    <div id="users-page" className="min-h-screen space-y-4 p-4">
      {/* Buscador */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-full px-3 py-2 w-full max-w-md focus:outline-none focus:ring"
        />
      </div>

      {/* Listado de tarjetas */}
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <UserCardComponent
            key={user.getId()}
            user={user}
            onClick={() => openModal(user)}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">Usuarios no encontrados.</p>
      )}

      {/* Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]">
          <div className="inset-2 size-auto fixed bg-white p-4 overflow-auto z-50">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-xl font-bold"
            >
              ×
            </button>

            {/* Info del usuario */}
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-semibold">Editar usuario</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Nombre</label>
                  <input
                    type="text"
                    value={selectedUser.getName()}
                    onChange={(e) => selectedUser.setName(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Apellido</label>
                  <input
                    type="text"
                    value={selectedUser.getLastname()}
                    onChange={(e) => selectedUser.setLastname(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={selectedUser.getEmail()}
                    onChange={(e) => selectedUser.setEmail(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={selectedUser.getPhone()}
                    onChange={(e) => selectedUser.setPhone(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
              </div>

              {/* Lista de permisos */}
              <div>
                <h3 className="text-xl font-medium mb-2">Permisos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allAuths.map((auth) => (
                    <label
                      key={auth.getId()}
                      className="inline-flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={authStates[auth.getId()]}
                        onChange={() => toggleAuth(auth.getId())}
                        className="form-checkbox h-5 w-5"
                      />
                      <span className="ml-2">
                        {AUTH_NAME_MAP[auth.getName()] || auth.getName()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
