import { Item } from "./Item";
import { Provider } from "./Provider";
import { SimpleItem } from "./SimpleItem";

export class MultiItem extends Item {
  private simpleItems: SimpleItem[] = [];

  constructor(
    simpleItems: SimpleItem[],
    id: number,
    name: string,
    price: number,
    cost: number,
    locations: Map<string, number>,
    images: ImageColor[],
    room: string,
    material: string,
    provider: Provider
  ) {
    super(id, name, price, cost, locations, images, room, material, provider);
    this.simpleItems = simpleItems;
  }

  public getSimpleItems(): SimpleItem[] {
    return this.simpleItems;
  }

  public setSimpleItems(simpleItems: SimpleItem[]): void {
    this.simpleItems = simpleItems;
  }
}
