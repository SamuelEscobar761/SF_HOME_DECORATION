/**
 * Servicio para gestionar las ventas y comunicarse con el backend
 */
export class SalesService {
  private static instance: SalesService;
  private baseUrl: string = "http://127.0.0.1:8000"; // URL base para las peticiones, vacía para rutas relativas

  /**
   * Constructor privado para implementar Singleton
   */
  private constructor() {}

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): SalesService {
    if (!SalesService.instance) {
      SalesService.instance = new SalesService();
    }
    return SalesService.instance;
  }

  /**
   * Procesa la finalización de una compra
   * @param items - Array de items en el carrito
   * @param paymentMethod - Método de pago (default: 'cash')
   * @param notes - Notas adicionales para la venta
   * @returns Promise con la respuesta del servidor
   */
  public async finalizePurchase(
    items: CartItem[],
    paymentMethod: string = "cash",
    notes: string = ""
  ): Promise<any> {
    try {
      // Verificar que todos los items tengan ID y datos requeridos
      if (!items || items.length === 0) {
        throw new Error("No hay productos en el carrito");
      }

      // Preparar los datos para enviar al backend
      const saleData = {
        payment_method: paymentMethod,
        notes: notes,
        items: items.map((item) => ({
          id: item.id,
          name: item.name || "Producto",
          color: item.color || "",
          units: item.units || 1,
          price: item.price || 0,
          rebajaUnidad: item.rebajaUnidad || 0,
          rebajaTotal: item.rebajaTotal || 0,
        })),
      };

      console.log("Datos a enviar al servidor:", JSON.stringify(saleData));

      // Enviar los datos al backend
      const response = await fetch(`${this.baseUrl}/sales/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        let errorMessage = "Error al procesar la venta";

        // Intentar leer el mensaje de error del servidor
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // Si no podemos leer JSON, intentar leer el texto
          const errorText = await response.text();
          console.error("Respuesta del servidor (no JSON):", errorText);

          // Si parece HTML, es probable que sea una página de error de Django
          if (errorText.includes("<!DOCTYPE") || errorText.includes("<html")) {
            errorMessage = "Error en el servidor. Contacte al administrador.";
          }
        }

        throw new Error(errorMessage);
      }

      // Retornar los datos de la respuesta
      return await response.json();
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de ventas
   * @returns Promise con la lista de ventas
   */
  public async getSales(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/sales/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las ventas");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de una venta específica
   * @param saleId - ID de la venta
   * @returns Promise con los detalles de la venta
   */
  public async getSaleDetails(saleId: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/sales/${saleId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los detalles de la venta");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al obtener detalles de venta:", error);
      throw error;
    }
  }

  /**
   * Obtiene las ventas entre dos fechas
   * @param startDate - Fecha de inicio (formato YYYY-MM-DD)
   * @param endDate - Fecha de fin (formato YYYY-MM-DD)
   * @returns Promise con la lista de ventas en el rango de fechas
   */
  public async getSalesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/sales/by_date/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las ventas por rango de fechas");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al obtener ventas por fecha:", error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de utilidades por mes
   * @param year - Año para el que se quieren las estadísticas (default: año actual)
   * @returns Promise con los datos de utilidades por mes [mes, monto]
   */
  public async getMonthlyProfits(
    year: number = new Date().getFullYear()
  ): Promise<[string, number][]> {
    try {
      // Intentar con la ruta principal
      const response = await fetch(
        `${this.baseUrl}/sales/stats/profits/?year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener estadísticas de utilidades");
      }

      const data = await response.json();
      return data.profits;
    } catch (error) {
      console.warn("Error al obtener estadísticas de utilidades:", error);
      // En caso de error, devolver datos de ejemplo
      return [
        ["Ene", 0],
        ["Feb", 0],
        ["Mar", 0],
        ["Abr", 0],
        ["May", 0],
        ["Jun", 0],
      ];
    }
  }

  /**
   * Obtiene estadísticas de capital en mercadería por mes
   * @param year - Año para el que se quieren las estadísticas (default: año actual)
   * @returns Promise con los datos de capital en mercadería por mes [mes, monto]
   */
  public async getMonthlyInventory(
    year: number = new Date().getFullYear()
  ): Promise<[string, number][]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/sales/stats/inventory/?year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener estadísticas de inventario");
      }

      const data = await response.json();
      console.log(data);
      return data.inventory;
    } catch (error) {
      console.warn("Error al obtener estadísticas de inventario:", error);
      // En caso de error, devolver datos de ejemplo
      return [
        ["Ene", 0],
        ["Feb", 0],
        ["Mar", 0],
        ["Abr", 0],
        ["May", 0],
        ["Jun", 0],
      ];
    }
  }

  /**
   * Obtiene estadísticas de ingresos por ventas por mes
   * @param year - Año para el que se quieren las estadísticas (default: año actual)
   * @returns Promise con los datos de ingresos por mes [mes, monto]
   */
  public async getMonthlySales(
    year: number = new Date().getFullYear()
  ): Promise<[string, number][]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/sales/stats/income/?year=${year}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener estadísticas de ingresos");
      }

      const data = await response.json();
      return data.income;
    } catch (error) {
      console.warn("Error al obtener estadísticas de ingresos:", error);
      // En caso de error, devolver datos de ejemplo
      return [
        ["Ene", 8500.0],
        ["Feb", 7800.0],
        ["Mar", 6200.0],
        ["Abr", 9700.0],
        ["May", 5800.0],
        ["Jun", 10500.0],
      ];
    }
  }
}

export default SalesService;
