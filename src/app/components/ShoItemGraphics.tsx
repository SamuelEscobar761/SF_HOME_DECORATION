import { useState } from "react";
import { GraphicComponent } from "./GraphicComponent";

type MonthNumberTuple = [string, number];

export const ShowItemGraphics = () => {
    const [utilities] = useState<MonthNumberTuple[]>([["Ene", 3500.00], ["Feb", 2600.00], ["Mar", 2000.00], ["Abr", 4500.00], ["May", 1500.00], ["Jun", 4300.00]]);
    return(
        <div>
            <div className="mb-2">
                <GraphicComponent title={"Utilidades Ganadas"} data={utilities} graphType="bar-chart"/>
            </div>
            <div className="mb-2">
                <GraphicComponent title={"Capital en Mercadería"} data={utilities} graphType="bar-chart"/>
            </div>
            <div>
                <GraphicComponent title={"Ingresos por Ventas"} data={utilities} graphType="bar-chart"/>
            </div>
        </div>
    );
}