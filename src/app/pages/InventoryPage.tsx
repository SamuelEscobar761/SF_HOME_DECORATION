import { useEffect, useState } from "react";
import { InventoryPageItem } from "../components/InventoryPageItem";
import { MoveItemComponent } from "../components/MoveItemComponent";
import { ShowItemGraphics } from "../components/ShowItemGraphics";
import { OptionsButtonComponent } from "../components/OptionsButtonComponent";
import { ShowNewItemComponent } from "../components/ShowNewItemComponent";
import { NewFolderComponent } from "../components/NewFolderComponent";
import { FolderComponent } from "../components/FolderComponent";
import { NewMultiItemComponent } from "../components/NewMultiItemComponent";
import { getImageColors } from "../services/GetDBInformation";

export const InventoryPage = () => {
  const [foldersView, setFoldersView] = useState<boolean>(false);
  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [moveItemView, setMoveItemView] = useState<boolean>(false);
  const [itemGraphicsView, setItemGraphicsView] = useState<boolean>(false);
  const [newItemView, setNewItemView] = useState<boolean>(false);
  const [newFolderView, setNewFolderView] = useState<boolean>(false);
  const [moveItem, setMoveItem] = useState<any>({});
  const [multiItemView, setMultiItemView] = useState<boolean>(false);

  const handleMoveItem = (item: any) => {
    setMoveItem({
      id: item.id,
      locations: item.locations,
      image: item.image,
      name: item.name,
    });
    setMoveItemView(true);
  };

  const setItemToShow = (item: any) => {
    item[0];
    setItemGraphicsView(true);
  };

  const createNewItem = () => {
    setNewItemView(true);
  };

  const saveNewFolder = (name: string) => {
    const id = 15;
    setFolders([...folders, { id: id, name: name }]);
    setNewFolderView(false);
  };

  const cancelNewFolder = () => {
    setNewFolderView(false);
  };

  const deleteFolder = (id: number) => {
    setFolders(folders.filter((folder) => folder.id != id));
  };

  const selectFolder = (id: number) => {
    console.log("select folder with id: " + id);
  };

  const saveNewItem = (item: any) => {
    console.log(item);
    setItems([...items, item]);
  };

  const newMultiItem = () => {
    setMultiItemView(true);
  };

  useEffect(() => {
    setFolders([
      { id: 1, name: "Primera Carpeta" },
      { id: 2, name: "Segunda Carpeta" },
      { id: 3, name: "Tercera Carpeta" },
    ]);
  }, []);

  useEffect(() => {
    setItems([
      {
        id: 1,
        name: "Sofa",
        provider: "Provider",
        price: 50,
        cost: 30,
        image: "https://t.ly/7nTCp",
        rotation: 15,
        utilitiesAvg: 210,
        locations: [
          { id: 1, name: "almacen", units: 25 },
          { id: 2, name: "tienda", units: 5 },
        ],
      },
      {
        id: 2,
        name: "Sofa de 1 plaza",
        provider: "Provider",
        price: 65,
        cost: 30,
        image: "https://t.ly/vsT0F",
        rotation: 8,
        utilitiesAvg: 110,
        locations: [
          { id: 1, name: "almacen", units: 20 },
          { id: 2, name: "tienda", units: 8 },
        ],
      },
      {
        id: 3,
        name: "Silla de madera",
        provider: "Provider",
        price: 35,
        cost: 30,
        image: "https://t.ly/4Q6Tb",
        rotation: 25,
        utilitiesAvg: 340,
        locations: [
          { id: 1, name: "almacen", units: 3 },
          { id: 2, name: "tienda", units: 2 },
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  return (
    <div id="inventory-page" className="relative size-full p-2">
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
      {newItemView && (
        <div className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]">
          <div className="fixed inset-2 size-auto overflow-y-auto">
            <ShowNewItemComponent
              closeNewItem={() => {
                setNewItemView(false);
              }}
              saveNewItem={saveNewItem}
            />
          </div>
        </div>
      )}
      {multiItemView && (
        <div className="fixed left-0 top-0 z-40 h-screen w-screen bg-white/[0.60]">
          <div className="fixed inset-2 size-auto overflow-y-auto">
            <NewMultiItemComponent
              saveComposedItem={(item: any) => saveNewItem(item)}
              basicItems={items.map(({ id, name, provider, image, cost, locations }) => ({
                id,
                name,
                provider,
                image,
                cost,
                units: locations.reduce((total: number, location: { id: number, name: string, units: number }) => total + location.units, 0),
                images_colors: getImageColors(id),
              }))}
              closeNewMultiItem={() => {
                setMultiItemView(false);
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
      {optionsIsOpen && (
        <div
          id="inventory-page-options-container"
          className="fixed inset-2 size-auto z-40"
          onClick={() => {
            setOptionsIsOpen(false);
          }}
        >
          <OptionsButtonComponent
            page="InventoryPage"
            settings={{ foldersView, newMultiItem }}
            newItem={createNewItem}
            newFolder={() => {
              setNewFolderView(true);
            }}
          />
        </div>
      )}
      <div id="top-buttons" className="flex justify-between items-center">
        <button
          id="items-folder-button"
          className="p-2 bg-tertiary-light rounded border border-neutral-900 w-48 text-left text-xl"
          onClick={() => {
            setFoldersView(!foldersView);
          }}
        >
          {foldersView ? "Todos los artículos" : "Carpetas"}
        </button>
        <div id="options-button">
          <button
            onClick={() => setOptionsIsOpen(!optionsIsOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 bg-transparent rounded focus:outline-none space-y-1"
          >
            <span className="block w-1 h-1 bg-black rounded-full"></span>
            <span className="block w-1 h-1 bg-black rounded-full"></span>
            <span className="block w-1 h-1 bg-black rounded-full"></span>
          </button>
        </div>
      </div>
      <div id="inventory-page-content" className="space-y-5 mt-8">
        {!foldersView ? (
          filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <InventoryPageItem
                key={index}
                setItemToMove={() => {
                  handleMoveItem(item);
                }}
                item={item}
                setItemToShow={setItemToShow}
              />
            ))
          ) : (
            <p>
              Parece que todavía no hay artículos para mostrar, intenta crear
              nuevos.
            </p>
          )
        ) : folders.length > 0 ? (
          folders.map((folder, index) => (
            <FolderComponent
              key={index}
              name={folder.name}
              id={folder.id}
              deleteFolder={deleteFolder}
              onClick={selectFolder}
            />
          ))
        ) : (
          <p>
            Parece que todavía no hay artículos para mostrar, intenta crear
            nuevos.
          </p>
        )}
      </div>
    </div>
  );
};
