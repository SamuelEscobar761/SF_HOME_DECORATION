import { Provider } from "./Provider";
import { APIClient } from "./APIClient";
import { Item } from "./Item";
import { SimpleItem } from "./SimpleItem";
import { MultiItem } from "./MultiItem";
import { Replenishment } from "./Replenishment";
import { Folder } from "../interfaces/Folder";

export class Manager {
  private static instance: Manager;
  private items: Item[] = [];
  private folders: Folder[] = [];
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

  public getFolders(): Folder[] {
    return this.folders;
  }

  public setFolders(folders: Folder[]): void {
    this.folders = folders;
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

  public async editItem(item: Item): Promise<boolean> {
    try {
      const answer = await this.apiClient.editItem(item);
      return answer;
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  public async deleteItem(item: Item): Promise<boolean> {
    try {
      const answer = await this.apiClient.deleteItem(item);
      if (answer) {
        this.items = this.items.filter(
          (itemInList) => itemInList.getId() !== item.getId()
        );
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  }

  public async saveNewMultiItem(item: MultiItem): Promise<boolean> {
    item.getSimpleItems().map((simpleItem) => {
      simpleItem.setName(
        simpleItem.getName() + " (parte de: " + item.getName() + ")"
      );
      simpleItem.setMultiItem(item);
      this.saveNewItem(simpleItem);
    });
    return this.saveNewItem(item);
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

  public replenish(replenishment: Replenishment, item: Item): boolean {
    const id = this.apiClient.replenish(replenishment, item);
    if (id == null) {
      return false;
    } else {
      replenishment.setId(id);
      return true;
    }
  }

  public async loadFolders() {
    try {
      this.setFolders(await this.apiClient.loadFolders());
    } catch (error) {
      console.log(error);
    }
  }

  public async saveNewFolder(
    folder: Folder,
    setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
  ) {
    try {
      this.folders.push(await this.apiClient.saveNewFolder(folder));
      setFolders(this.folders);
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteFolder(id: number) {
    try {
      this.folders.filter((folder) => {
        folder.id != id;
      });
      await this.apiClient.deleteFolder(id);
    } catch (error) {
      console.log(error);
    }
  }

  public async addItemToFolder(item: Item, folder: Folder) {
    folder.items.push(item);
    this.apiClient.addItemToFolder(item, folder);
  }
}
