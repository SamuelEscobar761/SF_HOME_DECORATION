import { BarChart } from "@mui/x-charts/BarChart";

export const GraphicComponent = ({
  title,
  data,
  graphType,
}: {
  title: string;
  data: [string, number][];
  graphType: "bar-chart";
}) => {
  // Extraer valores y etiquetas
  const values = data.map((tuple) => tuple[1]);
  const labels = data.map((tuple) => tuple[0]);

  // Calcular valores para escalas
  const maxValue = Math.max(...values, 1);
  const hasData = values.some((v) => v > 0);


  return (
    <div className="bg-neutral-200 rounded-lg p-3 shadow-md">
      <div className="bg-white rounded-lg p-4">
        {graphType === "bar-chart" && hasData ? (
          <BarChart
            series={[
              {
                data: values,
                color: "#0092a5",
                // Evitamos configuración adicional que podría causar errores
              },
            ]}
            height={300}
            xAxis={[
              {
                data: labels,
                scaleType: "band",
                // Simplificamos la configuración
                tickLabelStyle: {
                  fontSize: 12,
                },
              },
            ]}
            yAxis={[
              {
                min: 0,
                max: maxValue * 1.1,
                // Usamos la función de formato directamente en el eje
                tickNumber: 5,
                // Esta es una propiedad estándar que debería ser compatible
                tickLabelStyle: {
                  fontSize: 12,
                },
              },
            ]}
            margin={{
              top: 40,
              bottom: 30,
              left: 70, // Incrementamos para dar más espacio a etiquetas Y
              right: 20,
            }}
            // Evitamos cualquier configuración avanzada que pueda causar errores
            slotProps={{
              legend: { hidden: true }, // Esta propiedad es estándar
            }}
          />
        ) : (
          <div className="flex justify-center items-center h-[250px] text-gray-500">
            No hay datos disponibles para mostrar
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg p-2 mt-2">
        <p className="text-xl text-gray-700 font-medium text-center">{title}</p>
      </div>
    </div>
  );
};
