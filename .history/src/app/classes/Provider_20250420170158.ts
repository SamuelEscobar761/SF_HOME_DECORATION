import { Item } from "./Item";

export class Provider {
  private id: number;
  private name: string;
  private contactName: string;
  private contactLastname: string;
  private contactPhone: string;
  private contactEmail: string;
  private address: string;
  private phone: string;
  private items: Item[];
  private image: string;

  constructor(
    name: string,
    items?: Item[],
    contactName?: string,
    contactLastname?: string,
    contactPhone?: string,
    contactEmail?: string,
    address?: string,
    phone?: string,
    image?: string
  ) {
    this.name = name;
    this.items = items || [];
    this.contactName = contactName || "";
    this.contactLastname = contactLastname || "";
    this.contactEmail = contactEmail || "";
    this.contactPhone = contactPhone || "";
    this.address = address || "";
    this.phone = phone || "";
    this.image = image || "";
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

  public getContactName(): string {
    return this.contactName;
  }

  public setContactName(contactName: string): void {
    this.contactName = contactName;
  }

  public getContactLastname(): string {
    return this.contactLastname;
  }

  public setContactLastname(contactLastname: string): void {
    this.contactLastname = contactLastname;
  }

  public getContactPhone(): string {
    return this.contactPhone;
  }

  public setContactPhone(contactPhone: string): void {
    this.contactPhone = contactPhone;
  }

  public getContactEmail(): string {
    return this.contactEmail;
  }

  public setContactEmail(contactEmail: string): void {
    this.contactEmail = contactEmail;
  }

  public getAddress(): string {
    return this.address;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public getPhone(): string {
    return this.phone;
  }

  public setPhone(phone: string): void {
    this.phone = phone;
  }

  public getImage(): string {
    return this.image;
  }

  public setImage(image: string): void {
    this.image = image;
  }
}
