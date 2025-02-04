import { Item } from "./Item";

export class Replenishment {
  private id: number;
  private item: Item;
  private orderDate: Date;
  private arrivalDate: Date;
  private unitCost: number;
  private unitDiscount: number;
  private totalDiscount: number;
  private locations: Map<string, Map<string, number>>;

  constructor(
    id: number,
    item: Item,
    orderDate: Date,
    arrivalDate: Date,
    unitCost: number,
    unitDiscount: number,
    totalDiscount: number,
    locations: Map<string, Map<string, number>>
  ) {
    this.id = id;
    this.item = item;
    this.orderDate = orderDate;
    this.arrivalDate = arrivalDate;
    this.unitCost = unitCost;
    this.unitDiscount = unitDiscount;
    this.totalDiscount = totalDiscount;
    this.locations = locations;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getItem(): Item {
    return this.item;
  }

  public setItem(item: Item): void {
    this.item = item;
  }

  public getOrderDate(): Date {
    return this.orderDate;
  }

  public setOrderDate(orderDate: Date): void {
    this.orderDate = orderDate;
  }

  public getArriveDate(): Date {
    return this.arrivalDate;
  }

  public setArriveDate(arrivalDate: Date): void {
    this.arrivalDate = arrivalDate;
  }

  public getUnitCost(): number {
    return this.unitCost;
  }

  public setUnitCost(unitCost: number): void {
    this.unitCost = unitCost;
  }

  public getUnitDiscount(): number {
    return this.unitDiscount;
  }

  public setUnitDiscount(unitDiscount: number): void {
    this.unitDiscount = unitDiscount;
  }

  public getTotalDiscount(): number {
    return this.totalDiscount;
  }

  public setTotalDiscount(totalDiscount: number): void {
    this.totalDiscount = totalDiscount;
  }

  public getLocations(): Map<string, Map<string, number>> {
    return this.locations;
  }

  public setLocations(locations: Map<string, Map<string, number>>): void {
    this.locations = locations;
  }

  public getTotalValue(): number {
    return this.getTotalUnits() * this.unitCost;
  }

  public getTotalUnits(): number {
    let totalUnits = 0;
    this.getUnitsPerColor().forEach((unit) => {
      totalUnits += unit;
    });
    return totalUnits;
  }

  public getUnitsPerAllLocation(): Map<string, number> {
    let totalUnitsPerLocations = new Map<string, number>();
    this.locations.forEach((unitsPerColor, location) => {
      if (!(unitsPerColor instanceof Map)) {
        unitsPerColor = new Map(Object.entries(unitsPerColor));
      }
      unitsPerColor.forEach((units) => {
        totalUnitsPerLocations.set(
          location,
          (totalUnitsPerLocations.get(location) || 0) + units
        );
      });
    });
    return totalUnitsPerLocations;
  }

  public getUnitsPerColor(): Map<string, number> {
    let totalUnitsPerColor = new Map<string, number>();
    this.locations.forEach((unitsPerColor) => {
      if (!(unitsPerColor instanceof Map)) {
        unitsPerColor = new Map(Object.entries(unitsPerColor));
      }
      unitsPerColor.forEach((units, key) => {
        totalUnitsPerColor.set(key, (totalUnitsPerColor.get(key) || 0) + units);
      });
    });
    return totalUnitsPerColor;
  }

  // Método para clonar la instancia actual de Replenishment
  cloneWithNewItem(item: Item): Replenishment {
    return new Replenishment(
      this.id, // O generar un nuevo ID si es necesario
      item,
      new Date(this.orderDate),
      new Date(this.arrivalDate),
      this.unitCost,
      this.unitDiscount,
      this.totalDiscount,
      new Map(this.locations)
    );
  }
}
