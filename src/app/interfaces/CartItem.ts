/**
 * Interfaz para los items del carrito de compras
 */
interface CartItem {
  id: string | number;       // ID del producto (puede ser string o number)
  color: string;             // Color seleccionado
  units: number;             // Número de unidades
  rebajaUnidad?: number;     // Descuento por unidad (opcional)
  rebajaTotal?: number;      // Descuento total (opcional)
  image?: string;            // URL de la imagen (opcional, se carga después)
  name?: string;             // Nombre del producto (opcional, se carga después)
  price?: number;            // Precio del producto (opcional, se carga después)
}
