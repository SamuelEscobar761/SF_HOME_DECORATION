import { useEffect, useState } from "react";
import { UserCardComponent } from "../../components/UserCardComponent";
import { Manager } from "../../classes/Manager";

export const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const users = await Manager.getInstance().loadUsers();
      setUsers(users);
      setFilteredUsers(users);
    };
    loadUsers();
  }, []);

  // Whenever searchTerm or users change, re-filter
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((u) => {
          return (
            u.name.toLowerCase().includes(term) ||
            u.lastname.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
          );
        })
      );
    }
  }, [searchTerm, users]);

  return (
    <div id="users-page" className="min-h-screen space-y-4 p-4">
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by name, lastname or email…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring"
        />
      </div>

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user, idx) => (
          <UserCardComponent key={user.id ?? idx} user={user} />
        ))
      ) : (
        <p className="text-center text-gray-500">No users found.</p>
      )}
    </div>
  );
};
