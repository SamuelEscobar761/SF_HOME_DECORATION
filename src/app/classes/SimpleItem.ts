import { Provider } from "./Provider";
import { MultiItem } from "./MultiItem";
import { Item } from "./Item";

export class SimpleItem extends Item {
  private multiItem: MultiItem | null;

  constructor(
    multiItem: MultiItem | null,
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
    this.multiItem = multiItem;
  }

  public getMultiItem(): MultiItem | null {
    return this.multiItem;
  }

  public setMultiItem(multiItem: MultiItem): void {
    this.multiItem = multiItem;
  }

  public replenish(locations: InventoryLocation[]){

  }
}
