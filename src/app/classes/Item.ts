import { Manager } from "./Manager";
import { Provider } from "./Provider";
import { Replenishment } from "./Replenishment";

export class Item {
  private id: number;
  private name: string;
  private price: number;
  private images: ImageColor[];
  private room: string;
  private material: string;
  private provider: Provider;
  private replenishments: Replenishment[];

  constructor(
    id: number,
    name: string,
    price: number,
    images: ImageColor[],
    room: string,
    material: string,
    provider: Provider,
    replenishments: Replenishment[] = []
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.images = images;
    this.room = room;
    this.material = material;
    this.provider = provider;
    this.replenishments = replenishments;
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

  public getPrice(): number {
    return this.price;
  }

  public setPrice(price: number): void {
    this.price = price;
  }

  public getImages(): ImageColor[] {
    return this.images;
  }

  public setImages(images: ImageColor[]): void {
    this.images = images;
  }

  public getRoom(): string {
    return this.room;
  }

  public setRoom(room: string): void {
    this.room = room;
  }

  public getMaterial(): string {
    return this.material;
  }

  public setMaterial(material: string): void {
    this.material = material;
  }

  public getProvider(): Provider {
    return this.provider;
  }

  public setProvider(provider: Provider): void {
    this.provider = provider;
  }

  public getReplenishments(): Replenishment[] {
    return this.replenishments;
  }

  public setReplenishments(replenishments: Replenishment[]): void {
    this.replenishments = replenishments;
  }

  public getRotationIndex(): number {
    //retorno momentaneo, cada item debe calcular su indice de rotacion
    return 15.2;
  }

  public getUtilitiesAvg(): number {
    //retorno momentaneo, cada item debe calcular su utilidad promedio
    return 14.5;
  }

  public getLocations(): Map<string, number> {
    const allLocations = new Map<string, number>();
    this.getReplenishments().forEach((replenishment) => {
      replenishment.getLocations().forEach((value, key) => {
        allLocations.set(key, (allLocations.get(key) || 0) + value);
      });
    });
    return allLocations;
  }

  public move(fromLocation: string, toLocation: string, units: number): void {
    let remainingUnitsToMove = units;

    this.getReplenishments().forEach((replenishment) => {
      const locations = replenishment.getLocations();
      const availableUnits = locations.get(fromLocation) || 0;

      if (availableUnits > 0) {
        const unitsToMove = Math.min(availableUnits, remainingUnitsToMove);
        locations.set(fromLocation, availableUnits - unitsToMove);

        const currentUnitsInTarget = locations.get(toLocation) || 0;
        locations.set(toLocation, currentUnitsInTarget + unitsToMove);

        remainingUnitsToMove -= unitsToMove;

        if (remainingUnitsToMove <= 0) {
          return;
        }
      }
    });
  }

  public replenish(replenishment: Replenishment): boolean {
    const response = Manager.getInstance().replenish(replenishment, this);
    if (response) {
      this.getReplenishments().push(replenishment);
      return true;
    }
    return false;
  }

  public getCost(storage: string): number {
    let cost = 0;
    this.getReplenishments().forEach((replenishment) => {
      const units = replenishment.getLocations().get(storage) || 0;
      const unitCost = replenishment.getUnitCost();
      cost += units * unitCost;
    });
    return cost;
  }

  public getTotalCost(): number {
    let cost = 0;
    this.getReplenishments().forEach((replenishment) => {
      cost += replenishment.getTotalValue();
    });
    return cost;
  }

  public getTotalUnits(): number {
    let units = 0;
    this.getReplenishments().forEach((replenishment) => {
      units += replenishment.getTotalUnits();
    })
    return units;
  }
}
