// pages/users/UsersPage.tsx
import { useEffect, useState } from "react";
import { UserCardComponent } from "../../components/UserCardComponent";
import { Manager } from "../../classes/Manager";
import { UserAuthorization } from "../../classes/UserAuthorization";
import { User } from "../../classes/User";
import { UserEditModal } from "./components/UserEditModal";

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
      const loaded = await Manager.getInstance().loadUsers();
      setUsers(loaded);
      setFilteredUsers(loaded);
      const auths = await Manager.getInstance().getAllAuthorizations();
      setAllAuths(auths);
    })();
  }, []);

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

  const openModal = (user: User) => {
    setSelectedUser(user);
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

  const handleToggleAuth = (id: number) => {
    setAuthStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFieldChange = (field: keyof User, value: string) => {
    if (!selectedUser) return;
    switch (field) {
      case "getName":    selectedUser.setName(value); break;
      case "getLastname":selectedUser.setLastname(value); break;
      case "getEmail":   selectedUser.setEmail(value); break;
      case "getPhone":   selectedUser.setPhone(value); break;
    }
    // trigger re-render
    setSelectedUser(Object.assign(Object.create(Object.getPrototypeOf(selectedUser)), selectedUser));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    const updatedAuths = allAuths.map(
      (auth) => new UserAuthorization(
        auth.getId(),
        auth.getName(),
        authStates[auth.getId()]
      )
    );
    selectedUser.setAuthorizations(updatedAuths);
    await Manager.getInstance().updateUser(selectedUser);
    closeModal();
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-full px-3 py-2 w-full max-w-md focus:outline-none focus:ring"
        />
      </div>

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

      {modalOpen && selectedUser && (
        <UserEditModal
          user={selectedUser}
          auths={allAuths}
          authStates={authStates}
          onClose={closeModal}
          onToggleAuth={handleToggleAuth}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
