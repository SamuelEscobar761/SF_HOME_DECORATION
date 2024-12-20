import { Folder } from "../interfaces/Folder";
import { Item } from "./Item";
import { Manager } from "./Manager";
import { Provider } from "./Provider";
import { Replenishment } from "./Replenishment";
import { SimpleItem } from "./SimpleItem";

export class APIClient {
  private static instance: APIClient;
  private baseUrl: string;

  // Hacer el constructor privado para prevenir instanciación directa
  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Método estático para obtener la instancia
  public static getInstance(baseUrl: string): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient(baseUrl);
    }
    return APIClient.instance;
  }

  //ejemplos de uso cuando haya backend
  async fetchData(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw to let the caller handle it
    }
  }

  async postData(endpoint: string, data: any, options: RequestInit = {}): Promise<any> {
    const defaultOptions = {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      ...options,
    };
    return this.fetchData(endpoint, defaultOptions);
  }

  // metodos a usar

  async loadItems(startIndex: number): Promise<Item[]> {
    startIndex;
    const data = await this.fetchData('products/');
    const items: Item[] = data.results.map((result: any) => {
      const item = new SimpleItem(
        result.fk_id_multi_item,
        result.id,
        result.name,
        result.price,
        result.images.map((img: any) => ({ color: img.color, url: img.url })),
        result.room,
        result.material,
        new Provider("Proveedor universal", []) // Assuming all have this provider
      );
  
      const replenishments: Replenishment[] = result.replenishments.map((rep: any) => {
        const locationsMap = new Map<string, number>(Object.entries(rep.locations));
        return new Replenishment(
          rep.id,
          item,
          new Date(rep.order_date),
          new Date(rep.arrival_date),
          rep.unit_cost,
          rep.unit_discount,
          rep.total_discount,
          locationsMap
        );
      });
  
      item.setReplenishments(replenishments);
      return item;
    });
  
    return items;
  }

  async saveNewItem(item: Item): Promise<{'id': number, 'images': any[]} | null> {
    const location = item.getLocations().keys().next().value;
    const images = item.getImages().map(item => item.image);
    const colors = item.getImages().map(item => item.color);
    
    let formData = new FormData();
    formData.append('name', item.getName());
    formData.append('fk_id_provider', '1');
    formData.append('price', item.getPrice().toString());
    formData.append('room', item.getRoom());
    formData.append('material', item.getMaterial());
    formData.append('unit_cost', item.getReplenishments()[0].getUnitCost().toString());
    formData.append('unit_discount', item.getReplenishments()[0].getUnitDiscount().toString());
    formData.append('total_discount', item.getReplenishments()[0].getTotalDiscount().toString());
    formData.append('location', location!);
    formData.append('location_stock', item.getLocations().get(location!)!.toString());
    formData.append('images', images[0]!); // Asegúrate de que esto es un objeto File
    formData.append('colors', colors[0]);

    try {
        const response = await this.postData('products/create/', formData);
        return response; // Asumiendo que tu API devuelve un identificador o algún dato relevante
    } catch (error) {
        console.error('Error al guardar el artículo:', error);
        return null;
    }
}

  async editItem(item: Item): Promise<boolean>{
    item;
    return true;
  }

  async deleteItem(item: Item): Promise<boolean>{
    item;
    return true;
  }

  async saveNewProvider(name: string): Promise<boolean> {
    name;
    //save new provider with empty data, only name on DB
    return true;
  }

  //Funcion momentanea para generar ids, los ids, se tienen que conseguir de la base de datos:
  private getRandomInt(): number {
    // Redondea hacia arriba el mínimo y hacia abajo el máximo
    const min = Math.ceil(1);
    const max = Math.floor(4000);
    // La función Math.random() genera un número aleatorio entre 0 (inclusive) y 1 (exclusivo),
    // aquí se escala al rango deseado y se redondea hacia abajo para asegurar un entero.
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public replenish(replenishment: Replenishment, item: Item): number | null {
    replenishment;
    return item.getReplenishments().length;
  }

  async loadFolders(): Promise<Folder[]> {
    return [
      { id: 1, name: "Primera Carpeta", items: [] },
      { id: 2, name: "Segunda Carpeta", items: [] },
      { id: 3, name: "Tercera Carpeta", items: [] },
    ];
  }

  async saveNewFolder(folder: Folder): Promise<Folder> {
    return {
      id: Manager.getInstance().getFolders().length,
      name: folder.name,
      items: folder.items,
    };
  }

  async deleteFolder(id: number) {
    id;
    //TODO
  }

  async addItemToFolder(item: Item, folder: Folder) {
    item;
    folder;
    //TODO
  }
}
