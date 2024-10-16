import { ImageNameComponent } from "./ImageNameComponent";
import CloseIcon from "../../assets/Close-Icon.svg";
import { useState } from "react";
import { SimpleItem } from "../classes/SimpleItem";
import { Item } from "../classes/Item";

export const AllItemsComponent = ({
  itemsList,
  closeBasicItemList,
  addItem,
  createNewItem,
}: {
  itemsList: SimpleItem[] | Item[];
  closeBasicItemList: () => void;
  addItem: (item: Item) => void;
  createNewItem: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = itemsList.filter((item) =>
    item.getName().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="basic-item-list" className="w-full bg-neutral-100 rounded">
      <div className="flex justify-between items-center p-1">
        <div
          id="close-full-item"
          className="w-fit border border-neutral-600 rounded bg-neutral-100 p-1"
          onClick={closeBasicItemList}
        >
          <img src={CloseIcon} className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          className="border border-neutral-900 rounded-full pl-2 p-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="p-2 space-y-2 bg-neutral-100">
        <button
          className="w-fit flex space-x-1 items-center p-2 border border-neutral-900 rounded"
          onClick={createNewItem}
        >
          <p className="text-xl">+</p>
          <p>Nuevo item</p>
        </button>
        {filteredItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              
              addItem(item);
              closeBasicItemList();
            }}
            className="cursor-pointer"
          >
            <ImageNameComponent
              name={item.getName()}
              image={item.getImages()[0].image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
