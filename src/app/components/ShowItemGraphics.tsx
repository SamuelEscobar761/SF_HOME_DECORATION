import { useState } from "react";
import { GraphicComponent } from "./GraphicComponent";
import CloseIcon from "../../assets/Close-Icon.svg";

type MonthNumberTuple = [string, number];

export const ShowItemGraphics = ({
  title,
  closeFun,
}: {
  title: string;
  closeFun: () => void;
}) => {
  const [utilities] = useState<MonthNumberTuple[]>([
    ["Ene", 3500.0],
    ["Feb", 2600.0],
    ["Mar", 2000.0],
    ["Abr", 4500.0],
    ["May", 1500.0],
    ["Jun", 4300.0],
  ]);
  return (
    <div className="p-5">
      <div
        id="close-full-item"
        className="fixed top-2 left-2 z-50 border border-neutral-600"
        onClick={closeFun}
      >
        <img src={CloseIcon} />
      </div>
      <div id="show-item-title-container" className="bg-neutral-300 p-2 rounded mb-2">
      <div id="show-item-graphics-title-text-container" className="bg-neutral-100 p-2 rounded">
      <p className="text-2xl text-center">{title}</p>
      </div>
      
      </div>
      <div className="mb-2">
        <GraphicComponent
          title={"Utilidades Ganadas"}
          data={utilities}
          graphType="bar-chart"
        />
      </div>
      <div className="mb-2">
        <GraphicComponent
          title={"Capital en Mercadería"}
          data={utilities}
          graphType="bar-chart"
        />
      </div>
      <div>
        <GraphicComponent
          title={"Ingresos por Ventas"}
          data={utilities}
          graphType="bar-chart"
        />
      </div>
    </div>
  );
};
