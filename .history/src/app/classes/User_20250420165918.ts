import { UserAuthorization } from "./UserAuthorization";

export class User {
    private name: string;
    private lastname: string;
    private email: string;
    private phone: string;
    private authorizations: UserAuthorization[];
}