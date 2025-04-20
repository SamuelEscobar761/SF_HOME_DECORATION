import { Item } from "./Item";

export class Provider {
  private name: string;
  private contactName: string;
  private contactLastname: string;
  private contactPhone: string;
  private contactEmail: string;
  private address: string;
  private phone: string;
  private items: Item[];

  constructor(name: string, items: Item[], contactName: string, contactLastname: string, contactPhone: string, contactEmail: string, address: string) {
    this.name = name;
    this.items = items;
    this.contactName = contactName;
    this.contactLastname = contactLastname;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
    this.address = address;

  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getItems(): Item[] {
    return this.items;
  }

  public setItems(items: Item[]): void {
    this.items = items;
  }
}
