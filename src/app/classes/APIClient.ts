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
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }
  
      // Solo intentar convertir a JSON si la respuesta no es 204 No Content
      if (response.status !== 204) {
        return await response.json();
      } else {
        return response; // Devuelve el objeto de respuesta directamente
      }
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

  async deleteData(endpoint: string, options: RequestInit = {}): Promise<any> {
    const defaultOptions = {
      method: "DELETE",
      ...options,
    };
    return this.fetchData(endpoint, defaultOptions)
  }

  async getShoppingCartItemByIdColor(id: number, colorSearched: string): Promise<{id: number, name: string, price: number, image: any}> {
    const data = await this.fetchData(`items/${id}`);
    const item = {
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.images.map((img: any) => ({ color: img.color, url: img.url })).find((image: {color: string; url: string}) => image.color === colorSearched)?.url
    }
    return item;
  }

  async loadItems(startIndex: number): Promise<Item[]> {
    startIndex;
    const data = await this.fetchData('items/');
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
    images.map((image, index) => {
      formData.append('images', image!);
      formData.append('colors', colors[index]);
    })

    try {
        const response = await this.postData('items/create/', formData);
        return response;
    } catch (error) {
        console.error('Error al guardar el artículo:', error);
        return null;
    }
}

  async editItem(item: Item): Promise<boolean>{
    const itemStored = await this.fetchData(`items/${item.getId()}`);
    
    console.log(itemStored)
    return true;
  }

  async deleteItem(item: Item): Promise<any>{
    try{
      const answer = await this.deleteData(`items/${item.getId()}/delete/`);
      return answer;
    } catch (error) {
      return null;
    }
  }

  async saveNewProvider(name: string): Promise<boolean> {
    name;
    //save new provider with empty data, only name on DB
    return true;
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
