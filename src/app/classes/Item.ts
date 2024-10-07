import { Provider } from "./Provider";

export class Item {
  private id: number;
  private name: string;
  private price: number;
  private cost: number;
  private locations: Map<string, number>;
  private images: ImageColor[];
  private room: string;
  private material: string;
  private provider: Provider;

  constructor(
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
    this.id = id;
    this.name = name;
    this.price = price;
    this.cost = cost;
    this.locations = locations;
    this.images = images;
    this.room = room;
    this.material = material;
    this.provider = provider;
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

  public getCost(): number {
    return this.cost;
  }

  public setCost(cost: number): void {
    this.cost = cost;
  }

  public getLocations(): Map<string, number> {
    return this.locations;
  }

  public setLocations(locations: Map<string, number>): void {
    this.locations = locations;
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

  public getRotationIndex(): number{
    //retorno momentaneo, cada item debe calcular su indice de rotacion
    return 15.2;
  }

  public getUtilitiesAvg(): number{
    //retorno momentaneo, cada item debe calcular su utilidad promedio
    return 14.5;
  }
}
