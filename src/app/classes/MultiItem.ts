import { Item } from "./Item";
import { Provider } from "./Provider";
import { Replenishment } from "./Replenishment";
import { SimpleItem } from "./SimpleItem";

export class MultiItem extends Item {
  private simpleItems: SimpleItem[] = [];

  constructor(
    simpleItems: SimpleItem[],
    id: number,
    name: string,
    price: number,
    images: ImageColor[],
    room: string,
    material: string,
    provider: Provider
  ) {
    super(id, name, price, images, room, material, provider);
    this.simpleItems = simpleItems;
  }

  public getSimpleItems(): SimpleItem[] {
    return this.simpleItems;
  }

  public setSimpleItems(simpleItems: SimpleItem[]): void {
    this.simpleItems = simpleItems;
  }

  public move(fromLocation: string, toLocation: string, color:string, units: number): void {
    super.move(fromLocation, toLocation, color, units);
    for(const simpleItem of this.simpleItems){
      simpleItem.move(fromLocation, toLocation, color, units);
    }
  }

  public replenish(replenishment: Replenishment): boolean {
    let response = super.replenish(replenishment);
    for(const simpleItem of this.getSimpleItems()){
      response = simpleItem.replenish(replenishment.cloneWithNewItem(simpleItem));
    }
    return response;
  }
}
