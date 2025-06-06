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

  public getLocations(): Map<string, Map<string, number>> {
    const allLocations = new Map<string, Map<string, number>>();
    // Iterar sobre cada reposición para acceder a sus ubicaciones.
    this.getReplenishments().forEach((replenishment) => {
      replenishment.getLocations().forEach((colorUnits, location) => {
        if (!(colorUnits instanceof Map)) {
          colorUnits = new Map(Object.entries(colorUnits!));
        }
        // Verificar si ya existe la ubicación en allLocations.
        if (!allLocations.has(location)) {
          allLocations.set(location, new Map(colorUnits));
        } else {
          colorUnits.forEach((quantity, color) => {
            // Verificar si ya existe el color en esa ubicación en allLocations
            if (!allLocations.get(location)!.has(color)) {
              allLocations.get(location)!.set(color, quantity);
            } else {
              allLocations
                .get(location)!
                .set(color, allLocations.get(location)!.get(color)! + quantity);
            }
          });
        }
      });
    });

    return allLocations;
  }

  public getUnitsPerLocations(): Map<string, number> {
    const allLocations = new Map<string, number>();
    this.getReplenishments().forEach((replenishment) => {
      replenishment.getUnitsPerAllLocation().forEach((value, key) => {
        allLocations.set(key, (allLocations.get(key) || 0) + value);
      });
    });
    return allLocations;
  }

  public move(
    fromLocation: string,
    toLocation: string,
    color: string,
    units: number
  ): void {
    console.log(
      "Moving from: " +
        fromLocation +
        " to " +
        toLocation +
        " number of units: " +
        units
    );
    let remainingUnitsToMove = units;

    this.getReplenishments().forEach((replenishment) => {
      console.log("Before:");
      console.log(replenishment.getLocations());
      const locations = replenishment.getLocations();
      let fromLocationMap = locations.get(fromLocation);

      // Comprobar y convertir si es necesario
      if (!(fromLocationMap instanceof Map)) {
        fromLocationMap = new Map(Object.entries(fromLocationMap!));
      }

      const availableUnits = fromLocationMap.get(color) || 0;

      if (availableUnits > 0) {
        const unitsToMove = Math.min(availableUnits, remainingUnitsToMove);
        fromLocationMap.set(color, availableUnits - unitsToMove);

        let toLocationMap = locations.get(toLocation);
        if (!(toLocationMap instanceof Map)) {
          toLocationMap = new Map(Object.entries(toLocationMap || {}));
        }
        const currentUnitsTarget = toLocationMap.get(color) || 0;
        toLocationMap.set(color, currentUnitsTarget + unitsToMove);

        // Actualizar los mapas en las ubicaciones originales
        locations.set(fromLocation, fromLocationMap);
        locations.set(toLocation, toLocationMap);

        remainingUnitsToMove -= unitsToMove;
        if (remainingUnitsToMove <= 0) {
          console.log("After:");
          console.log(replenishment.getLocations());
          return;
        }
      }
    });
  }

  public async replenish(replenishment: Replenishment): Promise<boolean> {
    const response = await Manager.getInstance().replenish(replenishment, this);
    if (response) {
      this.getReplenishments().push(replenishment);
      return true;
    }
    return false;
  }

  public getCost(storage: string): number {
    let cost = 0;
    this.getReplenishments().forEach((replenishment) => {
      const units = replenishment.getUnitsPerAllLocation().get(storage) || 0;
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
    });
    return units;
  }

  public getColorUnits(): Map<string, number> {
    const totalColorUnits = new Map<string, number>();

    this.getReplenishments().forEach((replenishment) => {
      replenishment.getUnitsPerColor().forEach((value, key) => {
        totalColorUnits.set(key, (totalColorUnits.get(key) || 0) + value);
      });
    });

    // Ordenar por valor de forma descendente
    const sortedColorUnits = new Map(
      [...totalColorUnits.entries()].sort((a, b) => b[1] - a[1])
    );

    return sortedColorUnits;
  }
}
