import { UserAuthorization } from "./UserAuthorization";

export class User {
  private id: number;
  private name: string;
  private lastname: string;
  private email: string;
  private phone: string;
  private authorizations: UserAuthorization[];
  private image?: string;

  constructor(
    id: number,
    name: string,
    lastname: string,
    email: string,
    phone: string,
    authorizations: UserAuthorization[],
    image?: string
  ) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
    this.authorizations = authorizations;
    this.image = image;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getLastname(): string {
    return this.lastname;
  }

  public setLastname(lastname: string): void {
    this.lastname = lastname;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPhone(): string {
    return this.phone;
  }

  public setPhone(phone: string): void {
    this.phone = phone;
  }

  public getAuthorizations(): UserAuthorization[] {
    return this.authorizations;
  }

  public setAuthorizations(authorizations: UserAuthorization[]): void {
    this.authorizations = authorizations;
  }
}
