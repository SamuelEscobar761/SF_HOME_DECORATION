import SeeIcon from "../../assets/See-Icon.svg";
import FolderIcon from "../../assets/Folder-Icon.svg";
import ReplenishmentIcon from "../../assets/Replenishment-Icon.svg";
import { Provider } from "../classes/Provider";

export const ProviderCardComponent = ({provider}: {provider: Provider}) => {
  return (
    <div
      id="provider-card-component"
      className="relative flex p-2 border border-neutral-900 rounded border space-x-1"
    >
      <img
        src=""
        alt=""
        id="provider-card-image"
        className="size-24 bg-neutral-100"
      />
      <div id="provider-card-content" className="w-full">
        <p id="provider-card-name" className="text-xl border-b border-tertiary">
          Title
        </p>
        <div
          id="provider-card-buttons-container"
          className="absolute bottom-2 right-2 flex space-x-2"
        >
          <div
            id="provider-card-component-items-button-container"
            className="size-8 bg-tertiary rounded p-1"
          >
            <img
              src={SeeIcon}
              id="provider-card-component-items-button"
              className="svg-neutral-900"
            />
          </div>
          <div
            id="provider-card-component-show-button-container"
            className="size-8 bg-tertiary rounded p-1"
          >
            <img
              src={FolderIcon}
              id="provider-card-component-show-button"
              className="svg-neutral-900"
            />
          </div>
          <div
            id="provider-card-component-shipments-button-container"
            className="size-8 bg-secondary-light rounded p-1"
          >
            <img
              src={ReplenishmentIcon}
              id="provider-card-component-shipments-button"
              className="svg-neutral-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
