import { Item } from "../classes/Item";

export interface Folder {
    id: number,
    name: string,
    items: Item[],
}