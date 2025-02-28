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
  // private apiClient = APIClient.getInstance("https://sf-backend.samuelescobarbejarano.space");
  private apiClient = APIClient.getInstance("http://127.0.0.1:8000");

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

  public getItemFromIdColor(id: number, color: string) {
    return this.apiClient.getShoppingCartItemByIdColor(id, color);
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
    const response = await this.apiClient.saveNewItem(item);
    if (response !== null) {
      item.setId(response["id"]);
      item.setImages(response["images"]);
      this.items.push(item);
      return true;
    } else {
      console.error("Error al guardar el Item.");
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
    const response = await this.apiClient.saveNewItem(item);
    if (response !== null) {
      item.setId(response["id"]);
      item.setImages(response["images"]);
      const res = await this.apiClient.editIdMultiItem(item.getId());
      if (res !== null) {
        this.items.push(item);
        try {
          // Espera a que todas las promesas se resuelvan
          const results = await Promise.all(
            item.getSimpleItems().map(async (simpleItem) => {
              simpleItem.setMultiItem(item);
              return this.saveNewItem(simpleItem);
            })
          );
          // Verifica si alguna promesa falló
          if (results.includes(false)) {
            console.error("Error al guardar algún item de MultiItem");
            return false;
          }
          return true;
        } catch (error) {
          console.error("Error al guardar los items:", error);
          return false;
        }
      } else {
        console.error(
          "Error al editar el fk de multi id para el mismo multi id"
        );
        return false;
      }
    } else {
      console.error("Error al guardar el Item.");
      return false;
    }
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

  public async ensureItemSaved(itemToEnsure: SimpleItem) {
    for (const item of this.items) {
      if (item === itemToEnsure) {
        return true;
      }
    }
    this.saveNewItem(itemToEnsure);
  }

  public async moveItem(item: Item){
    this.apiClient.moveItem(item)
  }
}
