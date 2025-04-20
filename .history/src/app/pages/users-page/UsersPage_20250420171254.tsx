import { useState } from "react"
import { UserCardComponent } from "../../components/UserCardComponent";

export const UsersPage = () => {
    const [users] = useState<any[]>([{name: "Sarah"}, {name: "Flavio"}, {name: "Helena"}, {name: "Sistemas"}, {name: "Pruebas 1"}]);

    return(
        <div id="users-page" className="min-h-screen space-y-2 p-2">
            {users.map((user, index) => (
                <UserCardComponent key={index} user={user}/>
            ))}
        </div>
    )
}