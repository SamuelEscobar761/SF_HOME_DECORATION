// components/ProviderCardComponent.tsx
import SeeIcon from "../../assets/See-Icon.svg";
import FolderIcon from "../../assets/Folder-Icon.svg";
import ReplenishmentIcon from "../../assets/Replenishment-Icon.svg";
import { Provider } from "../classes/Provider";

interface ProviderCardComponentProps {
  provider: Provider;
  onClick: () => void;
}

export const ProviderCardComponent: React.FC<ProviderCardComponentProps> = ({
  provider,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      id="provider-card-component"
      className="relative flex p-2 border border-neutral-900 rounded space-x-1 cursor-pointer hover:bg-neutral-100"
    >
      <img
        src={provider.getImage()}
        id="provider-card-image"
        className="w-24 h-24 bg-neutral-100 object-contain rounded"
      />
      <div id="provider-card-content" className="w-full">
        <p
          id="provider-card-name"
          className="text-xl border-b border-tertiary pb-1"
        >
          {provider.getName()}
        </p>
        <div
          id="provider-card-buttons-container"
          className="absolute bottom-2 right-2 flex space-x-2"
        >
          <div className="w-8 h-8 bg-tertiary rounded p-1 flex items-center justify-center">
            <img src={SeeIcon} alt="Ver" className="svg-neutral-900" />
          </div>
          <div className="w-8 h-8 bg-tertiary rounded p-1 flex items-center justify-center">
            <img src={FolderIcon} alt="Carpeta" className="svg-neutral-900" />
          </div>
          <div className="w-8 h-8 bg-secondary-light rounded p-1 flex items-center justify-center">
            <img
              src={ReplenishmentIcon}
              alt="Reabastecer"
              className="svg-neutral-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
