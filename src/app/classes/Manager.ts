import { Provider } from "./Provider";
import { APIClient } from "./APIClient";
import { Item } from "./Item";
import { SimpleItem } from "./SimpleItem";
import { MultiItem } from "./MultiItem";
import { Replenishment } from "./Replenishment";
import { Folder } from "../interfaces/Folder";
import { User } from "./User";

export class Manager {
  private static instance: Manager;
  private items: Item[] = [];
  private folders: Folder[] = [];
  private providers: Provider[] = [];
  // private apiClient = APIClient.getInstance("https://sf-backend.samuelescobarbejarano.space");
  private apiClient = APIClient.getInstance("http://127.0.0.1:8000");
  private users: User[] = [];

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
      const answer = await this.apiClient.updateItem(item);
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
    const provider = await this.apiClient.saveNewProvider(name);
    this.providers.push(provider);
    return provider;
  }

  public getSimpleItems(): SimpleItem[] {
    return this.items.filter(
      (item) => item instanceof SimpleItem
    ) as SimpleItem[];
  }

  public async replenish(
    replenishment: Replenishment,
    item: Item
  ): Promise<boolean> {
    const id = await this.apiClient.replenish(replenishment, item);
    if (id == null) {
      return false;
    } else {
      replenishment.setId(id | 0);
      return true;
    }
  }

  public async loadFolders() {
    try {
      this.setFolders(await this.apiClient.loadFolders());
    } catch (error) {
      console.error("Error al cargar carpetas:", error);
      this.setFolders([]);
    }
  }

  public async saveNewFolder(
    folder: Folder,
    setFolders: React.Dispatch<React.SetStateAction<Folder[]>>
  ) {
    try {
      const newFolder = await this.apiClient.saveNewFolder(folder);
      this.folders.push(newFolder);
      setFolders([...this.folders]);
    } catch (error) {
      console.error("Error al guardar nueva carpeta:", error);
    }
  }

  public async deleteFolder(id: number) {
    try {
      await this.apiClient.deleteFolder(id);
      this.folders = this.folders.filter((folder) => folder.id !== id);
    } catch (error) {
      console.error("Error al eliminar carpeta:", error);
    }
  }

  public async addItemToFolder(item: Item, folder: Folder) {
    try {
      await this.apiClient.addItemToFolder(item, folder);
      // Actualizar la carpeta local con el nuevo ítem
      const updatedFolder = this.folders.find((f) => f.id === folder.id);
      if (updatedFolder) {
        if (!updatedFolder.items.some((i) => i.getId() === item.getId())) {
          updatedFolder.items.push(item);
        }
      }
    } catch (error) {
      console.error("Error al añadir ítem a carpeta:", error);
    }
  }

  public async removeItemFromFolder(item: Item, folder: Folder) {
    try {
      await this.apiClient.removeItemFromFolder(item, folder);
      // Actualizar la carpeta local eliminando el ítem
      const updatedFolder = this.folders.find((f) => f.id === folder.id);
      if (updatedFolder) {
        updatedFolder.items = updatedFolder.items.filter(
          (i) => i.getId() !== item.getId()
        );
      }
    } catch (error) {
      console.error("Error al eliminar ítem de carpeta:", error);
    }
  }

  public async ensureItemSaved(itemToEnsure: SimpleItem) {
    for (const item of this.items) {
      if (item === itemToEnsure) {
        return true;
      }
    }
    this.saveNewItem(itemToEnsure);
  }

  public async moveItem(item: Item) {
    this.apiClient.moveItem(item);
  }

  public getProviders() {
    return this.providers;
  }

  public async loadProviders() {
    this.providers = await this.apiClient.loadProviders();
    return this.getProviders();
  }

  // ================= MÉTODOS PARA USUARIOS =================

  public getUsers() {
    return this.users;
  }

  public async loadUsers() {
    try {
      this.users = await this.apiClient.loadUsers();
      return this.users;
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      return [];
    }
  }

  public async getAllAuthorizations() {
    try {
      return await this.apiClient.getAllAuthorizations();
    } catch (error) {
      console.error("Error al obtener autorizaciones:", error);
      return [];
    }
  }

  public async createUser(user: User): Promise<boolean> {
    try {
      const response = await this.apiClient.createUser(user);
      if (response) {
        // Recargar la lista de usuarios para incluir el nuevo usuario
        await this.loadUsers();
      }
      return response;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return false;
    }
  }

  public async updateUser(user: User) {
    try {
      const response = await this.apiClient.updateUser(user);
      if (response) {
        // Actualizar el usuario en la lista local
        this.users = this.users.map((u) =>
          u.getId() === user.getId() ? user : u
        );
      }
      return response;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return false;
    }
  }

  public async deleteUser(userId: number) {
    try {
      const response = await this.apiClient.deleteUser(userId);
      if (response) {
        // Eliminar el usuario de la lista local
        this.users = this.users.filter((u) => u.getId() !== userId);
      }
      return response;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return false;
    }
  }

  public async resetPassword(userId: number) {
    try {
      const newPassword = await this.apiClient.resetPassword(userId);
      if (newPassword) {
        // Aquí podrías mostrar un mensaje al usuario con la nueva contraseña
        // O enviar un correo electrónico con la nueva contraseña
        return newPassword;
      }
      return null;
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      return null;
    }
  }

  public getUserById(userId: number): User | undefined {
    return this.users.find((u) => u.getId() === userId);
  }

  // Este método es útil para comprobar si un usuario tiene un permiso específico
  public hasPermission(userId: number, permissionName: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;

    return user
      .getAuthorizations()
      .some((auth) => auth.getName() === permissionName && auth.isAccess());
  }

  public async updateProvider(
    provider: Provider,
    imageFile: File | null
  ): Promise<boolean> {
    try {
      if (imageFile) {
        provider.setImage(URL.createObjectURL(imageFile));
      }

      // 1) Delegamos al APIClient
      const success = await this.apiClient.updateProvider(provider, imageFile);

      // 2) Si fue exitoso, reemplazamos en nuestro array interno
      if (success) {
        this.providers = this.providers.map((p) =>
          p.getId() === provider.getId() ? provider : p
        );
      }

      return success;
    } catch (error) {
      console.error("Error en Manager.updateProvider:", error);
      return false;
    }
  }
}
