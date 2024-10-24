import { Provider } from "./Provider";
import { MultiItem } from "./MultiItem";
import { Item } from "./Item";

export class SimpleItem extends Item {
  private multiItem: MultiItem | null;
  private percentage: number | null = null;
  private tempPercentage: number | null = null;

  constructor(
    multiItem: MultiItem | null,
    id: number,
    name: string,
    price: number,
    images: ImageColor[],
    room: string,
    material: string,
    provider: Provider
  ) {
    super(id, name, price, images, room, material, provider);
    this.multiItem = multiItem;
  }

  public getMultiItem(): MultiItem | null {
    return this.multiItem;
  }

  public setMultiItem(multiItem: MultiItem): void {
    this.multiItem = multiItem;
  }

  public getPercentage(): number | null {
    return this.percentage;
  }

  public setPercentage(percentage: number): void {
    this.percentage = percentage;
  }

  public getTempPercentage(): number | null {
    return this.tempPercentage;
  }

  public setTempPercentage(percentage: number): void {
    this.tempPercentage = percentage;
  }
}
