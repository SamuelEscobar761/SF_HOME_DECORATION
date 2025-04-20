import { User } from "../classes/User"

export const UserCardComponent = ({user}: {user: User}) => {
    return(
        <div id="user-card-component" className="flex space-x-1 bg-neutral-300 p-2 rounded">
            <img src="" alt="" id="user-card-picture" className="size-28 bg-neutral-100 rounded"/>
            <div id="user-card-content" className="relative space-y-4 text-xl">
                <p>{user.getName()}</p>
                <p id="user-card-areas-available" className="text-lg">Áreas dipsonibles: </p>
            </div>
        </div>
    )
}