import { Provider } from "./Provider";
import { APIClient } from "./APIClient";
import { Item } from "./Item";
import { SimpleItem } from "./SimpleItem";
import { MultiItem } from "./MultiItem";

export class Manager {
  private static instance: Manager;
  private items: Item[] = [];
  private providers: Provider[] = [];
  private apiClient = APIClient.getInstance("https://api.misitio.com");

  // Constructor privado para prevenir instanciación externa
  private constructor() {
    this.loadMoreItems();
  }

  // Método estático para acceder a la instancia
  public static getInstance(): Manager {
    if (!Manager.instance) {
      Manager.instance = new Manager();
    }
    return Manager.instance;
  }

  public getItems(): Item[] {
    return this.items;
  }

  public setItems(items: Item[]): void {
    this.items = items;
  }

  public async loadMoreItems() {
    this.items = await this.apiClient.loadItems(this.items.length);
  }

  public async saveNewItem(item: Item): Promise<boolean> {
    const answer = await this.apiClient.saveNewItem(item);
    if (answer != null) {
      item.setId(answer);
      this.items.push(item);
      return true;
    } else {
      return false;
    }
  }

  public async saveNewMultiItem(item: MultiItem): Promise<boolean> {
    item.getSimpleItems().map((simpleItem) => {
      simpleItem.setName(simpleItem.getName() + " parte de: " + item.getName());
      this.saveNewItem(simpleItem);
    })
    return this.saveNewItem(item)
  }

  public async ensureProviderExists(name: string): Promise<Provider> {
    this.providers.map((provider) => {
      if (provider.getName() == name) {
        return provider;
      }
    });
    const provider = new Provider(name, []);
    this.providers.push(provider);
    this.apiClient.saveNewProvider(name);
    return provider;
  }

  public getSimpleItems(): SimpleItem[] {
    return this.items.filter(
      (item) => item instanceof SimpleItem
    ) as SimpleItem[];
  }
}
