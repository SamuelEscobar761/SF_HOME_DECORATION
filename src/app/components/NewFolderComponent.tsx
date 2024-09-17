import SaveIcon from "../../assets/Save-Icon.svg";
import CancelIcon from "../../assets/Close-Icon.svg";
import { useState } from "react";

export const NewFolderComponent = ({
  saveNewFolder,
  cancelNewFolder,
}: {
  saveNewFolder: (name: string) => void;
  cancelNewFolder: () => void;
}) => {

  const [name, setName] = useState<string>("");

  return (
    <div
      id="new-folder-component"
      className="flex flex-col bg-primary border border-neutral-300 p-2 space-y-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div id="new-folder-name-container" className="space-y-2">
        <label htmlFor="new-folder-name">Nueva Carpeta:</label>
        <input
          type="text"
          id="new-folder-name"
          placeholder="Nombre"
          className="border border-neutral-300 p-2 rounded bg-neutral-100 w-full"
          value={name}
          onChange={(event) => {setName(event.target.value)}}
        />
      </div>
      <div id="new-folder-buttons-container" className="flex justify-around">
        <button
          className="bg-success p-2 rounded"
          onClick={() => saveNewFolder(name)}
        >
          <img src={SaveIcon} alt="SaveIcon" className="size-6" />
        </button>
        <button
          className="bg-tertiary-dark p-2 rounded"
          onClick={cancelNewFolder}
        >
          <img src={CancelIcon} alt="CancelIcon" className="size-6" />
        </button>
      </div>
    </div>
  );
};
