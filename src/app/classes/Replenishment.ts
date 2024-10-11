import { Item } from "./Item";

export class Replenishment {
  private id: number;
  private item: Item;
  private orderDate: Date;
  private arriveDate: Date;
  private unitCost: number;
  private unitDiscount: number;
  private totalDiscount: number;
  private locations: Map<string, number>;

  constructor(
    id: number,
    item: Item,
    orderDate: Date,
    arriveDate: Date,
    unitCost: number,
    unitDiscount: number,
    totalDiscount: number,
    locations: Map<string, number>
  ) {
    this.id = id;
    this.item = item;
    this.orderDate = orderDate;
    this.arriveDate = arriveDate;
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
    return this.arriveDate;
  }

  public setArriveDate(arriveDate: Date): void {
    this.arriveDate = arriveDate;
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

  public getLocations(): Map<string, number> {
    return this.locations;
  }

  public setLocations(locations: Map<string, number>): void {
    this.locations = locations;
  }

  public getTotalValue(): number {
    
    return this.getTotalUnits() * this.unitCost;
  }

  public getTotalUnits(): number {
    let totalUnits = 0;
    this.locations.forEach((units)=>{
      totalUnits += units
    })
    return totalUnits;
  }
}
