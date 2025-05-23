import { useEffect, useState } from "react";
import CloseIcon from "../../assets/Close-Icon.svg";
import { InventoryPageItem } from "../components/InventoryPageItem";
import { MoveItemComponent } from "../components/MoveItemComponent";
import { ShowItemGraphics } from "../components/ShowItemGraphics";
import { OptionsButtonComponent } from "../components/OptionsButtonComponent";
import { NewSimpleItemComponent } from "../components/NewSimpleItemComponent";
import { NewFolderComponent } from "../components/NewFolderComponent";
import { FolderComponent } from "../components/FolderComponent";
import { NewMultiItemComponent } from "../components/NewMultiItemComponent";
import { Manager } from "../classes/Manager";
import { Item } from "../classes/Item";
import { NewReplenishmentComponent } from "../components/NewReplenishmentComponent";
import { Folder } from "../interfaces/Folder";
import { AllItemsComponent } from "../components/AllItemsComponent";
import { SimpleItem } from "../classes/SimpleItem";
import { MultiItem } from "../classes/MultiItem";

export const InventoryPage = () => {
  const [foldersView, setFoldersView] = useState<boolean>(false);
  const [itemsOfFolderView, setItemsOfFolderView] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);
  const [moveItemView, setMoveItemView] = useState<boolean>(false);
  const [itemGraphicsView, setItemGraphicsView] = useState<boolean>(false);
  const [newItemView, setNewItemView] = useState<boolean>(false);
  const [newFolderView, setNewFolderView] = useState<boolean>(false);
  const [moveItem, setMoveItem] = useState<any>({});
  const [multiItemView, setMultiItemView] = useState<boolean>(false);
  const [replenishmentView, setReplenishmentView] = useState<boolean>(false);
  const [replenishmentItem, setReplenishmentItem] = useState<Item>();
  const [searchView, setSearchView] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<Folder>();
  const [selectItemsView, setSelectItemsView] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Item>();
  const allItemsSettings = [
    { text: "Buscar", action: () => searchButton() },
    { text: "Nuevo artículo", action: () => createNewItem() },
    { text: "Nuevo artículo compuesto", action: () => newMultiItem() },
  ];
  const foldersSettings = [
    { text: "Buscar", action: () => searchButton() },
    {
      text: "Nueva Carpeta",
      action: () => {
        setNewFolderView(true);
      },
    },
  ];
  const folderItemsSettings = [
    { text: "Buscar", action: () => searchButton() },
    {
      text: "Agregar Item",
      action: () => {
        setSelectItemsView(true);
      },
    },
  ];
  const [settings, setSettings] =
    useState<{ text: string; action: () => void }[]>(allItemsSettings);

  const handleMoveItem = (item: Item) => {
    setMoveItem(item);
    setMoveItemView(true);
  };

  const setItemToShow = (item: Item) => {
    item;
    setItemGraphicsView(true);
  };

  const createNewItem = () => {
    setNewItemView(true);
  };

  const searchButton = () => {
    setSearchView(true);
  };

  const saveNewFolder = (name: string) => {
    const newfolder = { id: 0, name: name, items: [] };
    Manager.getInstance().saveNewFolder(newfolder, setFolders);
    setNewFolderView(false);
  };

  const cancelNewFolder = () => {
    setNewFolderView(false);
  };

  const deleteFolder = (id: number) => {
    Manager.getInstance().deleteFolder(id);
  };

  const selectFolder = (folder: Folder) => {
    setSelectedFolder(folder);
    setSettings(folderItemsSettings);
    setFilteredItems(folder.items);
    setItemsOfFolderView(true);
  };

  const saveNewItem = async (item: Item, isNew: boolean) => {
    setEditingItem(undefined);
    if (isNew) {
      const response = await Manager.getInstance().saveNewItem(item);
      if (!response) {
        alert("No se pudo guardar el item, revisa tu conexión a internet");
      }else{
        setItems([...Manager.getInstance().getItems()])
      }
    } else {
      const response = await Manager.getInstance().editItem(item);
      if (!response) {
        alert("No se pudo editar el item, revisa tu conexión a internet");
      }
    }
  };

  const saveNewMultiItem = async (item: Item, isNew: boolean) => {
    item;
    isNew;
    setEditingItem(undefined);
    setItems([...Manager.getInstance().getItems()]);
  }

  const newMultiItem = () => {
    setMultiItemView(true);
  };

  const editItem = (item: Item) => {
    if (item instanceof SimpleItem) {
      setNewItemView(true);
    } else if (item instanceof MultiItem) {
      setMultiItemView(true);
    }
    setEditingItem(item);
  };

  const deleteItem = async (item: any) => {
    await Manager.getInstance().deleteItem(item);
    setItems([...Manager.getInstance().getItems()]);
  };

  const addItemToFolder = (item: Item) => {
    Manager.getInstance().addItemToFolder(item, selectedFolder!);
  };

  useEffect(() => {
    if (items.length > 0 && !foldersView) {
      const filtered = items.filter(
        (item) =>
          item.getName().toLowerCase().includes(searchTerm.toLowerCase()) ||
          item
            .getProvider()
            .getName()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else if (folders.length > 0 && foldersView && !itemsOfFolderView) {
      const filtered = folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFolders(filtered);
    } else if (
      selectedFolder &&
      selectedFolder.items.length > 0 &&
      itemsOfFolderView
    ) {
      const filtered = selectedFolder.items.filter(
        (item) =>
          item.getName().toLowerCase().includes(searchTerm.toLowerCase()) ||
          item
            .getProvider()
            .getName()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm]);

  useEffect(() => {
    const loadFolders = async () => {
      await Manager.getInstance().loadFolders();
      setFolders(Manager.getInstance().getFolders());
    };
    loadFolders();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      const manager = Manager.getInstance();
      await manager.loadMoreItems(); // Espera a que los items se carguen
      setItems(manager.getItems()); // Establece los items una vez cargados
    };

    loadItems();
  }, []);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    setFilteredFolders(folders);
  }, [folders]);

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      if (searchView) {
        setSearchView(false);
      } else if (itemsOfFolderView) {
        setItemsOfFolderView(false);
      } else if (foldersView) {
        setFoldersView(false);
      }
      // Al cerrar el searchView, modifica el estado sin ir hacia atrás
      window.history.replaceState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [searchView, foldersView, itemsOfFolderView]);

  return (
    <div id="inventory-page" className="p-2">
      {selectItemsView && (
        <div className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]">
          <div className="fixed inset-2 size-auto overflow-y-auto">
            <AllItemsComponent
              addItem={addItemToFolder}
              closeBasicItemList={() => {
                setSelectItemsView(false);
              }}
              createNewItem={() => {
                setNewItemView(true);
              }}
              itemsList={items}
            />
          </div>
        </div>
      )}
      {moveItemView && (
        <div className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]">
          <div className="fixed inset-2 size-auto overflow-y-auto">
            <MoveItemComponent
              closeMoveItem={() => {
                setMoveItemView(false);
              }}
              item={moveItem}
            />
          </div>
        </div>
      )}
      {itemGraphicsView && (
        <div className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]">
          <div
            id="inventory-page-show-item-graphics-component"
            className="fixed inset-2 size-auto overflow-y-auto"
          >
            <ShowItemGraphics
              title="Title"
              closeFun={() => {
                setItemGraphicsView(false);
              }}
            />
          </div>
        </div>
      )}
      {multiItemView && (
        <div className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]">
          <div className="fixed inset-2 size-auto overflow-y-auto">
            <NewMultiItemComponent
              item={editingItem as MultiItem}
              closeNewMultiItem={() => {
                setEditingItem(undefined);
                setMultiItemView(false);
              }}
              saveNewItem={saveNewMultiItem}
            />
          </div>
        </div>
      )}
      {newItemView && (
        <div className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]">
          <div className="fixed inset-2 size-auto overflow-y-auto">
            <NewSimpleItemComponent
              closeNewItem={() => {
                setEditingItem(undefined);
                setNewItemView(false);
              }}
              saveNewItem={saveNewItem}
              item={editingItem as SimpleItem}
            />
          </div>
        </div>
      )}
      {replenishmentView && (
        <div
          id="inventory-page-replenishment-container"
          className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]"
        >
          <div className="fixed inset-2 size-auto overflow-y-auto">
            <NewReplenishmentComponent
              item={replenishmentItem!}
              closeReplenishmentView={() => {
                setItems([...Manager.getInstance().getItems()]);
                setReplenishmentView(false);
              }}
            />
          </div>
        </div>
      )}
      {newFolderView && (
        <div
          id="new-folder-container"
          className="fixed inset-2 size-auto bg-neutral-100/[0.60] p-8 flex items-center justify-center"
          onClick={() => {
            setNewFolderView(false);
          }}
        >
          <NewFolderComponent
            saveNewFolder={saveNewFolder}
            cancelNewFolder={cancelNewFolder}
          />
        </div>
      )}

      {searchView ? (
        <div id="top-buttons" className="flex justify-between items-center">
          <div id="search-bar">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="rounded-full py-1 px-2 text-base border border-neutral-900"
            />
          </div>
          <button
            id="inventory-page-close-search-bar"
            className="p-2 size-10"
            onClick={() => {
              setSearchView(false);
              setSearchTerm("");
            }}
          >
            <img src={CloseIcon} />
          </button>
        </div>
      ) : (
        <div id="top-buttons" className="flex justify-between items-center">
          <button
            id="items-folder-button"
            className={`p-2 ${
              foldersView ? "bg-tertiary-light" : "bg-primary-light"
            } rounded border border-neutral-900 w-48 text-left text-xl`}
            onClick={() => {
              if (!foldersView) {
                setSettings(foldersSettings);
                setFoldersView(true);
              } else if (!itemsOfFolderView) {
                setSettings(allItemsSettings);
                setFilteredItems(items);
                setFoldersView(!foldersView);
              }
              if (itemsOfFolderView) {
                setSettings(foldersSettings);
                setFilteredItems(items);
                setItemsOfFolderView(false);
              }
            }}
          >
            {!foldersView || itemsOfFolderView
              ? "Carpetas"
              : "Todos los artículos"}
          </button>
          <div id="inventory-page-options-container" className="">
            <OptionsButtonComponent settings={settings} />
          </div>
        </div>
      )}
      <div id="inventory-page-content" className="space-y-5 mt-8">
        {!foldersView || itemsOfFolderView ? (
          filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <InventoryPageItem
                key={index}
                setItemToMove={() => {
                  handleMoveItem(item);
                }}
                item={item}
                setItemToShow={setItemToShow}
                setItemToEdit={() => {
                  editItem(item);
                }}
                setItemToDelete={() => {
                  deleteItem(item);
                }}
                setReplenishmentView={() => {
                  setReplenishmentView(true);
                  setReplenishmentItem(item);
                }}
              />
            ))
          ) : (
            <p className="p-2">
              Parece que todavía no hay artículos para mostrar, intenta crear
              nuevos.
            </p>
          )
        ) : filteredFolders.length > 0 ? (
          filteredFolders.map((folder, index) => (
            <FolderComponent
              key={index}
              name={folder.name}
              id={folder.id}
              deleteFolder={deleteFolder}
              onClick={() => {
                selectFolder(folder);
              }}
            />
          ))
        ) : (
          <p className="p-2">
            Parece que todavía no hay carpetas para mostrar, intenta crear
            nuevos.
          </p>
        )}
      </div>
    </div>
  );
};
