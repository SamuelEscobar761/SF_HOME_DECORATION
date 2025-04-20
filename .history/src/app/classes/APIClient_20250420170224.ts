import { Folder } from "../interfaces/Folder";
import { mockedProviders, mockedUsers } from "../services/MockService";
import { Item } from "./Item";
import { Manager } from "./Manager";
import { MultiItem } from "./MultiItem";
import { Provider } from "./Provider";
import { Replenishment } from "./Replenishment";
import { SimpleItem } from "./SimpleItem";
import { User } from "./User";

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

  async fetchData(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
      if (!response.ok) {
        throw new Error(
          `API call failed: ${response.status} ${response.statusText}`
        );
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

  async postData(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): Promise<any> {
    const defaultOptions = {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers:
        data instanceof FormData ? {} : { "Content-Type": "application/json" },
      ...options,
    };
    return this.fetchData(endpoint, defaultOptions);
  }

  async deleteData(endpoint: string, options: RequestInit = {}): Promise<any> {
    const defaultOptions = {
      method: "DELETE",
      ...options,
    };
    return this.fetchData(endpoint, defaultOptions);
  }

  async getShoppingCartItemByIdColor(
    id: number,
    colorSearched: string
  ): Promise<{ id: number; name: string; price: number; image: any }> {
    const data = await this.fetchData(`items/${id}`);
    const item = {
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.images
        .map((img: any) => ({ color: img.color, url: img.url }))
        .find(
          (image: { color: string; url: string }) =>
            image.color === colorSearched
        )?.url,
    };
    return item;
  }

  async loadItems(startIndex: number): Promise<Item[]> {
    startIndex;
    const data = await this.fetchData("items/");

    const multiItemMap = new Map<number, MultiItem>();
    const items: Item[] = [];

    // Crear todos los items en un solo recorrido
    data.results.forEach((result: any) => {
      let item: Item;

      if (result.id !== result.fk_id_multi_item) {
        // Crear SimpleItem con el MultiItem correspondiente (si existe)
        item = new SimpleItem(
          multiItemMap.get(result.fk_id_multi_item) || null,
          result.id,
          result.name,
          result.price,
          result.images.map((img: any) => ({ color: img.color, url: img.url })),
          result.room,
          result.material,
          new Provider(0, "Proveedor universal")
        );
      } else {
        // Crear MultiItem y almacenarlo en el mapa
        item = new MultiItem(
          [],
          result.id,
          result.name,
          result.price,
          result.images.map((img: any) => ({ color: img.color, url: img.url })),
          result.room,
          result.material,
          new Provider(0, "Proveedor universal", [])
        );
        multiItemMap.set(result.id, item as MultiItem);
      }

      // Cargar reabastecimientos
      const replenishments: Replenishment[] = result.replenishments.map(
        (rep: any) => {
          const locationsMap = new Map<string, Map<string, number>>(
            Object.entries(rep.locations).map(([location, colors]) => [
              location,
              new Map<string, number>(
                Object.entries(colors as Record<string, number>)
              ),
            ])
          );

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
        }
      );

      item.setReplenishments(replenishments);
      items.push(item);
    });
    return items;
  }

  async moveItem(item: Item): Promise<boolean | null> {
    const replenishments = item.getReplenishments().map((replenishment) => ({
      id: replenishment.getId(), // Añade el ID aquí
      order_date: replenishment.getOrderDate().toISOString().split("T")[0], // Ajusta el formato de la fecha
      arrival_date: replenishment.getArriveDate().toISOString().split("T")[0], // Ajusta el formato de la fecha
      unit_cost: replenishment.getUnitCost(),
      unit_discount: replenishment.getUnitDiscount(),
      total_discount: replenishment.getTotalDiscount(),
      locations: this.convertMapToObject(replenishment.getLocations()),
    }));

    const body = JSON.stringify({
      replenishments: replenishments,
    });

    try {
      const response = await fetch(
        `${this.baseUrl}/items/${item.getId()}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      return null;
    }
  }

  async editIdMultiItem(id: number): Promise<boolean | null> {
    const formData = new FormData();
    formData.append("fk_id_multi_item", id.toString());
    try {
      // Realizar la solicitud POST con el FormData
      const response = await fetch(`${this.baseUrl}/items/${id}/update/`, {
        method: "PUT",
        body: formData, // Enviar el FormData
      });

      // Verificar el estado de la respuesta
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
      }

      // Procesar la respuesta
      return await response.json();
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      return null;
    }
  }

  async saveNewItem(item: Item): Promise<{ id: number; images: any[] } | null> {
    // Crear un FormData para combinar datos y archivos
    const formData = new FormData();

    if (item instanceof SimpleItem && item.getMultiItem()?.getId()) {
      formData.append(
        "fk_id_multi_item",
        item.getMultiItem()!.getId().toString()
      );
    }

    // Agregar los datos simples al FormData
    formData.append("name", item.getName());
    formData.append("fk_id_provider", "1");
    formData.append("room", item.getRoom());
    formData.append("material", item.getMaterial());
    formData.append(
      "unit_cost",
      item.getReplenishments()[0].getUnitCost().toString()
    );
    formData.append("price", item.getPrice().toString());
    formData.append("description", "");
    formData.append(
      "unit_discount",
      item.getReplenishments()[0].getUnitDiscount().toString()
    );
    formData.append(
      "total_discount",
      item.getReplenishments()[0].getTotalDiscount().toString()
    );

    // Convertir la ubicación a JSON y agregarla
    const convertedLocations = this.convertMapToObject(
      item.getReplenishments()[0].getLocations()
    );
    const locationJson = JSON.stringify(convertedLocations);
    formData.append("location", locationJson);

    // Agregar las imágenes y colores al FormData
    const images = await Promise.all(
      item
        .getImages()
        .map(async (coloImage) =>
          coloImage.image
            ? coloImage.image
            : await this.urlToFile(coloImage.url!, `${item.getId()}.jpg`)
        )
    );
    const colors = item.getImages().map((coloImage) => coloImage.color);
    images.forEach((image, index) => {
      formData.append("images", image);
      formData.append("colors", colors[index]);
    });

    try {
      // Realizar la solicitud POST con el FormData
      const response = await fetch(`${this.baseUrl}/items/create/`, {
        method: "POST",
        body: formData, // Enviar el FormData
      });

      // Verificar el estado de la respuesta
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
      }

      // Procesar la respuesta
      return await response.json();
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      return null;
    }
  }

  async updateItem(item: Item): Promise<any> {
    const formData = new FormData();

    // Si es un SimpleItem con multiItem, agregalo
    if (item instanceof SimpleItem && item.getMultiItem()?.getId()) {
      formData.append(
        "fk_id_multi_item",
        item.getMultiItem()!.getId().toString()
      );
    }

    formData.append("name", item.getName());
    formData.append("fk_id_provider", "1");
    formData.append("room", item.getRoom());
    formData.append("material", item.getMaterial());
    formData.append("price", item.getPrice().toString());
    formData.append("description", "");

    const firstRep = item.getReplenishments()[0];
    formData.append("unit_cost", firstRep.getUnitCost().toString());
    formData.append("unit_discount", firstRep.getUnitDiscount().toString());
    formData.append("total_discount", firstRep.getTotalDiscount().toString());

    // ✅ Procesar replenishments (incluyendo locations)
    const replenishmentsData = item.getReplenishments().map((rep) => ({
      id: rep.getId(), // puede ser undefined si es nuevo
      order_date: rep.getOrderDate().toISOString().split("T")[0],
      arrival_date: rep.getArriveDate().toISOString().split("T")[0],
      unit_cost: rep.getUnitCost(),
      unit_discount: rep.getUnitDiscount(),
      total_discount: rep.getTotalDiscount(),
      locations: this.convertMapToObject(rep.getLocations()),
    }));
    formData.append("replenishments", JSON.stringify(replenishmentsData));

    // ✅ Procesar imágenes y colores
    const images = await Promise.all(
      item
        .getImages()
        .map(async (ci) =>
          ci.image
            ? ci.image
            : await this.urlToFile(ci.url!, `${item.getId()}.jpg`)
        )
    );
    const colors = item.getImages().map((ci) => ci.color);

    images.forEach((image, index) => {
      formData.append("images", image);
      formData.append("colors", colors[index]);
    });

    try {
      const response = await fetch(
        `${this.baseUrl}/items/${item.getId()}/update/`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error al actualizar el item:", error);
      return null;
    }
  }

  async deleteItem(item: Item): Promise<any> {
    try {
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

  public async replenish(
    replenishment: Replenishment,
    item: Item
  ): Promise<number | null> {
    const formData = new FormData();
    const locationsObj = this.convertMapToJson(replenishment.getLocations());
    formData.append("locations", JSON.stringify(locationsObj));
    formData.append(
      "order_date",
      replenishment.getOrderDate().toISOString().split("T")[0]
    );
    formData.append(
      "arrival_date",
      replenishment.getArriveDate().toISOString().split("T")[0]
    );
    formData.append("unit_cost", replenishment.getUnitCost().toString());
    formData.append(
      "unit_discount",
      replenishment.getUnitDiscount().toString()
    );
    formData.append(
      "total_discount",
      replenishment.getTotalDiscount().toString()
    );
    try {
      // Realizar la solicitud POST con el FormData
      const response = await fetch(
        `${this.baseUrl}/items/${item.getId()}/replenish/`,
        {
          method: "POST",
          body: formData, // Enviar el FormData
        }
      );

      // Verificar el estado de la respuesta
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud: ${response.status} ${response.statusText}`
        );
      }

      // Procesar la respuesta
      const resp = await response.json();
      return resp;
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      return null;
    }
  }

  private convertMapToJson(map: Map<any, any>): any {
    const obj = Object.fromEntries(map);
    for (const key of Object.keys(obj)) {
      if (obj[key] instanceof Map) {
        obj[key] = this.convertMapToJson(obj[key]);
      }
    }
    return obj;
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

  convertMapToObject = (map: Map<any, any>): Record<string, any> => {
    const obj: Record<string, any> = {};
    map.forEach((value, key) => {
      // Si el valor también es un Map, conviértelo recursivamente
      obj[key] = value instanceof Map ? this.convertMapToObject(value) : value;
    });
    return obj;
  };

  async urlToFile(
    url: string,
    fileName: string,
    mimeType?: string
  ): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: mimeType || blob.type });
    return file;
  }

  async loadUsers(): Promise<User[]> {
    console.log("These users are being mocked");
    try {
      return await mockedUsers;
    } catch (e) {
      console.error("Error getting proviers", e);
      throw new Error("Error getting proviers");
    }
  }

  async loadProviders(): Promise<Provider[]> {
    console.log("These providers are being mocked");
    try {
      return await mockedProviders;
    } catch (e) {
      console.error("Error getting proviers", e);
      throw new Error("Error getting proviers");
    }
  }
}
