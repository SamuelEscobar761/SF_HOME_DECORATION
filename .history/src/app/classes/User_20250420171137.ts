import { UserAuthorization } from "./UserAuthorization";

export class User {
  private id: number;
  private name: string;
  private lastname: string;
  private email: string;
  private phone: string;
  private authorizations: UserAuthorization[];
  constructor(
    id: number,
    name: string,
    lastname: string,
    email: string,
    phone: string,
    authorizations: UserAuthorization[]
  ) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
    this.authorizations = authorizations;
  }
}
