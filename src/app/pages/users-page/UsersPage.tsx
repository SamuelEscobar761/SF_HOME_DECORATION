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
  const [isCreate, setIsCreate] = useState(false);

  // Load users and authorizations
  useEffect(() => {
    (async () => {
      const loaded = await Manager.getInstance().loadUsers();
      setUsers(loaded);
      setFilteredUsers(loaded);
      const auths = await Manager.getInstance().getAllAuthorizations();
      setAllAuths(auths);
    })();
  }, []);

  // Filter on search term
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

  // Open modal to edit existing user
  const openModal = (user: User) => {
    setIsCreate(false);
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

  // Open modal to create a new user
  const openCreateModal = () => {
    setIsCreate(true);
    // initialize a blank User; adjust constructor arguments as needed
    const blank = new User(0, "", "", "", "", []);
    setSelectedUser(blank);
    setAuthStates({});
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
      case "getName":
        selectedUser.setName(value);
        break;
      case "getLastname":
        selectedUser.setLastname(value);
        break;
      case "getEmail":
        selectedUser.setEmail(value);
        break;
      case "getPhone":
        selectedUser.setPhone(value);
        break;
    }
    // Trigger re-render
    setSelectedUser(
      Object.assign(
        Object.create(Object.getPrototypeOf(selectedUser)),
        selectedUser
      )
    );
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    if (isCreate) {
      // Create new user
      await Manager.getInstance().createUser(selectedUser);
    } else {
      // Update authorizations then user
      const updatedAuths = allAuths.map(
        (auth) =>
          new UserAuthorization(
            auth.getId(),
            auth.getName(),
            authStates[auth.getId()]
          )
      );
      selectedUser.setAuthorizations(updatedAuths);
      await Manager.getInstance().updateUser(selectedUser);
    }
    // Refresh list
    const reloaded = await Manager.getInstance().loadUsers();
    setUsers(reloaded);
    setFilteredUsers(reloaded);
    closeModal();
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    await Manager.getInstance().deleteUser(selectedUser.getId());
    const reloaded = await Manager.getInstance().loadUsers();
    setUsers(reloaded);
    setFilteredUsers(reloaded);
    closeModal();
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    await Manager.getInstance().resetPassword(selectedUser.getId());
    // You may want to show a toast or alert here
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="flex justify-center space-x-2">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-full px-3 py-2 w-full max-w-md focus:outline-none focus:ring"
        />
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Nuevo usuario
        </button>
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
          isCreate={isCreate}
          onClose={closeModal}
          onToggleAuth={handleToggleAuth}
          onFieldChange={handleFieldChange}
          onSave={handleSave}
          onDelete={handleDelete}
          onResetPassword={handleResetPassword}
        />
      )}
    </div>
  );
};
