import { useState } from "react";
import FolderIcon from "../../assets/Folder-Icon.svg";

export const FolderComponent = ({
  name,
  id,
  deleteFolder,
  onClick,
}: {
  name: string;
  id: number;
  deleteFolder: (id: number) => void;
  onClick: (id: number) => void;
}) => {
  const [optionsIsOpen, setOptionsIsOpen] = useState<boolean>(false);

  return (
    <div
      id="folder-component"
      className="flex justify-between py-2"
      onClick={() => {
        optionsIsOpen && setOptionsIsOpen(false);
      }}
    >
      <div
        id="folder-img-text-container"
        className="flex"
        onClick={() => onClick(id)}
      >
        <img
          src={FolderIcon}
          alt="folder-icon"
          id="folder-icon"
          className="size-7"
        />
        <p id="folder-component-name" className="ml-2 text-xl">
          {name}
        </p>
      </div>
      {optionsIsOpen ? (
        <button
          onClick={() => {
            setOptionsIsOpen(false);
            deleteFolder(id);
          }}
          className="p-1 bg-tertiary-light rounded"
        >
          Eliminar
        </button>
      ) : (
        <button
          onClick={() => setOptionsIsOpen(!optionsIsOpen)}
          className="flex flex-col justify-center items-center bg-transparent rounded focus:outline-none space-y-1 p-1.5"
        >
          <span className="block w-1 h-1 bg-black rounded-full"></span>
          <span className="block w-1 h-1 bg-black rounded-full"></span>
          <span className="block w-1 h-1 bg-black rounded-full"></span>
        </button>
      )}
    </div>
  );
};
