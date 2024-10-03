import { BasicItemComponent } from "./BasicItemComponent";
import CloseIcon from "../../assets/Close-Icon.svg";
import { useState } from "react";

export const BasicItemListComponent = ({
  itemsList,
  closeBasicItemList,
  addItem,
}: {
  itemsList: BasicItem[];
  closeBasicItemList: () => void;
  addItem: (item: BasicItem) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = itemsList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="w-fit flex space-x-1 items-center p-2 border border-neutral-900 rounded">
        <p className="text-xl">+</p>
        <p>Nuevo item</p>
        </div>
        {filteredItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              addItem(item);
              closeBasicItemList();
            }}
            className="cursor-pointer"
          >
            <BasicItemComponent name={item.name} image={item.image} />
          </div>
        ))}
      </div>
    </div>
  );
};
