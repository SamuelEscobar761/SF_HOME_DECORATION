import { BasicItemComponent } from "./BasicItemComponent";
import CloseIcon from "../../assets/Close-Icon.svg";
import { useState } from "react";
import { SimpleItem } from "../classes/SimpleItem";

export const BasicItemListComponent = ({
  itemsList,
  closeBasicItemList,
  addItem,
  createNewItem,
}: {
  itemsList: SimpleItem[];
  closeBasicItemList: () => void;
  addItem: (item: SimpleItem) => void;
  createNewItem: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = itemsList.filter((item) =>
    item.getName().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="basic-item-list" className="w-full bg-neutral-100">
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

      <div className="h-48 p-2 space-y-2 bg-neutral-100 overflow-y-auto">
        <button className="w-fit flex space-x-1 items-center p-2 border border-neutral-900 rounded" onClick={createNewItem}>
          <p className="text-xl">+</p>
          <p>Nuevo item</p>
        </button>
        {filteredItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              const newItem = new SimpleItem(null, 0, item.getName(), item.getPrice(), 0, item.getLocations(), item.getImages(), item.getRoom(), item.getMaterial(), item.getProvider());
              addItem(newItem);
              closeBasicItemList();
            }}
            className="cursor-pointer"
          >
            <BasicItemComponent
              name={item.getName()}
              image={item.getImages()[0].image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
