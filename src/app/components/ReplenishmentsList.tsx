import { Replenishment } from "../classes/Replenishment";
import { ReplenishmentEditable } from "./ReplenishmentEditable";

export const ReplenishmentList = ({
  replenishments,
}: {
  replenishments: Replenishment[];
}) => {
  return (
    <div id="replenishment-list" className="flex justify-center p-2 bg-neutral-300 rounded ">
      <div className="flex flex-col bg-neutral-100 w-full rounded p-2 divide-y max-h-96 overflow-y-auto">
        <p className="p-2">Encargos</p>
        {replenishments.map((replenishment, index) => (
          <ReplenishmentEditable replenishment={replenishment} key={index}/>
        ))}
      </div>
    </div>
  );
};
