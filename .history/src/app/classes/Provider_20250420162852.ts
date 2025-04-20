import { Item } from "./Item";

export class Provider {
  private name: string;
  private items: Item[];

  constructor(name: string, items: Item[]) {
    this.name = name;
    this.items = items;
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
