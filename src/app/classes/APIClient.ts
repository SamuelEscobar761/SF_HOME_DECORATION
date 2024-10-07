import { Item } from "./Item";
import { Provider } from "./Provider";
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

  async postData(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<any> {
    const defaultOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      ...options,
    };
    return this.fetchData(endpoint, defaultOptions);
  }

  // metodos a usar

  async loadItems(startIndex: number): Promise<Item[]> {
    const items = [];
    const item1 = {
      multiItem: null,
      id: 1,
      name: "Sofa",
      price: 50,
      cost: 30,
      locations: new Map<string, number>([
        ["almacen", 3],
        ["tienda", 2],
      ]),
      images: [
        { color: "#FFE324", image: "https://t.ly/7nTCp" },
        { color: "#11F34A", image: "https://t.ly/7nTCp" },
        { color: "#33FE22", image: "https://t.ly/7nTCp" },
      ],
      room: "Comedor",
      material: "Tela Turca",
      provider: new Provider("Proveedor universal", []),
    };

    const item2 = {
      multiItem: null,
      id: 2,
      name: "Sofa de 1 plaza",
      price: 65,
      cost: 25,
      locations: new Map<string, number>([
        ["almacen", 25],
        ["tienda", 5],
      ]),
      images: [
        { color: "#FFE324", image: "https://t.ly/vsT0F" },
        { color: "#11F34A", image: "https://t.ly/vsT0F" },
        { color: "#33FE22", image: "https://t.ly/vsT0F" },
      ],
      room: "Comedor",
      material: "Tela Turca",
      provider: new Provider("Proveedor universal", []),
    };

    const item3 = {
      multiItem: null,
      id: 3,
      name: "Silla de madera",
      price: 50,
      cost: 30,
      locations: new Map<string, number>([
        ["almacen", 20],
        ["tienda", 8],
      ]),
      images: [
        { color: "#FFE324", image: "https://t.ly/4Q6Tb" },
        { color: "#11F34A", image: "https://t.ly/4Q6Tb" },
        { color: "#33FE22", image: "https://t.ly/4Q6Tb" },
      ],
      room: "Comedor",
      material: "Madera",
      provider: new Provider("Proveedor universal", []),
    };

    items.push(
      new SimpleItem(
        item1.multiItem,
        item1.id,
        item1.name,
        item1.price,
        item1.cost,
        item1.locations,
        item1.images,
        item1.room,
        item1.material,
        item1.provider
      )
    );
    items.push(
      new SimpleItem(
        item2.multiItem,
        item2.id,
        item2.name,
        item2.price,
        item2.cost,
        item2.locations,
        item2.images,
        item2.room,
        item2.material,
        item2.provider
      )
    );
    items.push(
      new SimpleItem(
        item3.multiItem,
        item3.id,
        item3.name,
        item3.price,
        item3.cost,
        item3.locations,
        item3.images,
        item3.room,
        item3.material,
        item3.provider
      )
    );
    return items;
  }

  async saveNewItem(item: Item): Promise<number | null> {
    // save item on db
    return this.getRandomInt();
  }

  async saveNewProvider(name: string): Promise<boolean> {
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
}
