export class UserAuthorization {
  private id: number;
  private name: string;
  private access: boolean;
  constructor(id: number, name: string, access: boolean) {
    this.id = id;
    this.name = name;
    this.access = access;
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

  public isAccess(): boolean {
    return this.access;
  }

  public setAccess(access: boolean): void {
    this.access = access;
  }
}
