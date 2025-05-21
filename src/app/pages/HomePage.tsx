import { useEffect, useState } from "react";
import { GraphicComponent } from "../components/GraphicComponent";
import { SalesService } from "../services/SalesService";
import { DateRangePicker } from "../components/DateRangePicker";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { SalesReportComponent } from "../components/SellsReportComponent";

type MonthNumberTuple = [string, number];

export const HomePage = () => {
  // Estados para los datos de gráficos
  const [profits, setProfits] = useState<MonthNumberTuple[]>([]);
  const [inventory, setInventory] = useState<MonthNumberTuple[]>([]);
  const [salesIncome, setSalesIncome] = useState<MonthNumberTuple[]>([]);

  // Estados para el reporte de ventas
  const [showReport, setShowReport] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Fechas seleccionadas para el reporte (por defecto el mes actual)
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );

  // Estados para indicar carga
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar datos para los gráficos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar datos de los 3 gráficos en paralelo
        const [profitsData, inventoryData, salesData] = await Promise.all([
          SalesService.getInstance().getMonthlyProfits(),
          SalesService.getInstance().getMonthlyInventory(),
          SalesService.getInstance().getMonthlySales(),
        ]);

        setProfits(profitsData);
        setInventory(inventoryData);
        setSalesIncome(salesData);
      } catch (error) {
        console.error("Error al cargar datos para gráficos:", error);
        // En caso de error, mostrar datos de ejemplo
        setProfits([
          ["Ene", 3500.0],
          ["Feb", 2600.0],
          ["Mar", 2000.0],
          ["Abr", 4500.0],
          ["May", 1500.0],
          ["Jun", 4300.0],
        ]);
        setInventory([
          ["Ene", 12000.0],
          ["Feb", 15000.0],
          ["Mar", 14500.0],
          ["Abr", 16000.0],
          ["May", 17500.0],
          ["Jun", 18300.0],
        ]);
        setSalesIncome([
          ["Ene", 7500.0],
          ["Feb", 6800.0],
          ["Mar", 5500.0],
          ["Abr", 9000.0],
          ["May", 4800.0],
          ["Jun", 8700.0],
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para manejar el click en el botón de reporte
  const handleReportClick = () => {
    setShowDatePicker(true);
  };

  // Función para manejar la selección de fechas
  const handleDateRangeSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setShowDatePicker(false);
    setShowReport(true);
  };

  return (
    <div id="home-page" className="p-2 bg-primary min-h-screen">
      {/* Título y botón de reporte */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleReportClick}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-purple-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Reporte de Ventas
        </button>
      </div>

      {/* Contenido principal con gráficos */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <GraphicComponent
              title={"Utilidades Ganadas"}
              data={profits}
              graphType="bar-chart"
            />
          </div>
          <div className="mb-4">
            <GraphicComponent
              title={"Capital en Mercadería"}
              data={inventory}
              graphType="bar-chart"
            />
          </div>
          <div className="mb-4">
            <GraphicComponent
              title={"Ingresos por Ventas"}
              data={salesIncome}
              graphType="bar-chart"
            />
          </div>
        </>
      )}

      {/* Componente DateRangePicker modal */}
      {showDatePicker && (
        <DateRangePicker
          onSelectRange={handleDateRangeSelect}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Componente de Reporte de Ventas modal */}
      {showReport && (
        <SalesReportComponent
          onClose={() => setShowReport(false)}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
        />
      )}
    </div>
  );
};
