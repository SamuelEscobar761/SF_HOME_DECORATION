import { useEffect, useState } from "react";
import { SalesService } from "../services/SalesService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SaleItem {
  name: string;
  color: string;
  units: number;
  price_per_unit: number;
  total: number;
}

interface Sale {
  id: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: SaleItem[];
}

export const SalesReportComponent = ({
  onClose,
  selectedStartDate,
  selectedEndDate,
}: {
  onClose: () => void;
  selectedStartDate: string;
  selectedEndDate: string;
}) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);

        // Si el backend tiene el endpoint por rango de fechas
        const data = await SalesService.getInstance().getSalesByDateRange(
          selectedStartDate,
          selectedEndDate
        );

        setSales(data);
      } catch (error) {
        console.error("Error al cargar ventas:", error);
        setError("No se pudieron cargar las ventas. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [selectedStartDate, selectedEndDate]);

  const toggleSaleDetails = (saleId: number) => {
    if (expandedSaleId === saleId) {
      setExpandedSaleId(null);
    } else {
      setExpandedSaleId(saleId);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy - HH:mm", { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  // Función para obtener el nombre del método de pago
  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      cash: "Efectivo",
      credit_card: "Tarjeta de Crédito",
      debit_card: "Tarjeta de Débito",
      transfer: "Transferencia",
      other: "Otro",
    };
    return methods[method] || method;
  };

  const getTotalSales = () => {
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-4">
          <div className="text-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando reporte de ventas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Reporte de Ventas</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Período:</p>
              <p className="font-medium">
                {format(new Date(selectedStartDate), "dd/MM/yyyy")} -{" "}
                {format(new Date(selectedEndDate), "dd/MM/yyyy")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total ventas:</p>
              <p className="font-bold text-purple-700">
                ${getTotalSales().toLocaleString("es-BO")}
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
            {error}
          </div>
        ) : sales.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 mx-auto text-gray-300"
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
            <p className="mt-2 text-gray-600">
              No hay ventas registradas en este período
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  className="p-3 bg-white cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSaleDetails(sale.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Venta #{sale.id}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(sale.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="font-bold text-purple-700">
                          ${sale.total.toLocaleString("es-BO")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getPaymentMethodName(sale.payment_method)}
                        </p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedSaleId === sale.id
                            ? "transform rotate-180"
                            : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedSaleId === sale.id && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <p className="font-medium text-sm mb-2">
                      Detalles de productos:
                    </p>
                    <div className="space-y-2">
                      {sale.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm p-2 bg-white rounded border border-gray-100"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <div className="flex items-center mt-1">
                              <div
                                className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                                style={{
                                  backgroundColor: item.color.startsWith("#")
                                    ? item.color
                                    : `#${item.color}`,
                                }}
                              ></div>
                              <p className="text-xs text-gray-500">
                                {item.units} unidad{item.units !== 1 && "es"} x
                                ${item.price_per_unit.toLocaleString("es-BO")}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">
                            ${item.total.toLocaleString("es-BO")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
