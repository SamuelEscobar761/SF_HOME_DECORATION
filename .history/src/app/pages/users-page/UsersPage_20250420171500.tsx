import { useEffect, useState } from "react"
import { UserCardComponent } from "../../components/UserCardComponent";
import { Manager } from "../../classes/Manager";

export const UsersPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

    useEffect(()=>{
        const loadUsers = async () => {
            const users = await Manager.getInstance().loadUsers();
            setUsers(users);
            setFilteredUsers(users)
        }
        loadUsers();
    }, []);
    return(
        <div id="users-page" className="min-h-screen space-y-2 p-2">
            {filteredUsers.map((user, index) => (
                <UserCardComponent key={index} user={user}/>
            ))}
        </div>
    )
}