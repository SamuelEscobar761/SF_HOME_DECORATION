import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ShoppingCartItemComponent } from "../components/ShoppingCartItemComponent";
import { Manager } from "../classes/Manager";
import { Link, useNavigate } from "react-router-dom";
import { SalesService } from "../services/SalesService";

export const ShoppingCartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseComplete, setPurchaseComplete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const removeItemFromCart = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    Cookies.set("cartItems", JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const calculateTotal = (cartItems: CartItem[]) => {
    let total = 0;
    cartItems.forEach((item) => {
      // Calcular el precio con cualquier descuento aplicado
      const unitPrice = item.price! - (item.rebajaUnidad || 0);
      total += unitPrice * item.units;

      // Aplicar descuento total si existe
      if (item.rebajaTotal) {
        total -= item.rebajaTotal;
      }
    });
    setTotalPrice(total);
  };

  const loadItems = async () => {
    const existingCart = Cookies.get("cartItems");
    let cartItems: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

    const updates = cartItems.map(async (cartItem) => {
      const result = await Manager.getInstance().getItemFromIdColor(
        typeof cartItem.id === "string"
          ? parseInt(cartItem.id, 10)
          : cartItem.id,
        cartItem.color
      );
      return {
        ...cartItem,
        image: result.image,
        name: result.name,
        price: result.price,
      };
    });

    const updatedItems = await Promise.all(updates); // Espera a que todos los items se actualicen
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleFinishPurchase = async () => {
    if (items.length === 0) return;

    setIsProcessing(true);
    setError(null); // Limpiar errores previos

    try {
      // Primero verificamos que todos los items tengan la información requerida
      const itemsWithAllData = items.map((item) => {
        // Aseguramos que haya datos para todos los campos requeridos
        return {
          id: item.id || "", // ID es obligatorio
          name: item.name || "Producto",
          color: item.color || "",
          units: item.units || 1,
          price: item.price || 0,
          rebajaUnidad: item.rebajaUnidad || 0,
          rebajaTotal: item.rebajaTotal || 0,
        };
      });

      // Verificar que todos los items tengan ID
      const allItemsHaveId = itemsWithAllData.every((item) => item.id);
      if (!allItemsHaveId) {
        throw new Error("Algunos productos no tienen identificador");
      }

      // Log para debugging
      console.log("Enviando datos:", itemsWithAllData);

      // Intentar procesar la venta
      await SalesService.getInstance().finalizePurchase(itemsWithAllData);

      // Si todo sale bien, limpiar el carrito
      Cookies.remove("cartItems");
      setIsProcessing(false);
      setPurchaseComplete(true);

      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate("/sell");
      }, 3000);
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      setIsProcessing(false);

      let errorMessage = "Error al procesar la venta. Intente nuevamente.";

      // Intentar extraer un mensaje más específico si existe
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    }
  };

  if (purchaseComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-purple-50">
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg animate-fadeIn">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Compra finalizada!
            </h2>
            <p className="text-purple-600 font-medium mb-4">
              Gracias por tu compra
            </p>
            <div className="w-full bg-gray-100 h-1 rounded-full mb-4">
              <div className="bg-purple-600 h-1 rounded-full animate-progress"></div>
            </div>
            <p className="text-sm text-gray-500">
              Serás redirigido automáticamente...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Encabezado */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto py-4 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">¡Excelente!</h1>
            <h2 className="text-xl font-semibold text-purple-700 mb-1">
              La venta está lista para finalizar
            </h2>
            <p className="text-sm text-gray-500">
              Por favor revisa los detalles antes de continuar
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow">
        <div className="max-w-md mx-auto pt-3 px-4 pb-20">
          {items.length > 0 ? (
            <>
              {/* Tabla de items - Simplificada */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                {/* Cabecera de la tabla - Simplificada */}
                <div className="grid grid-cols-12 items-center p-3 border-b border-gray-100 text-sm font-medium text-gray-600 bg-gray-50">
                  <div className="col-span-2 text-center"></div>
                  <div className="col-span-2 text-center">Uds</div>
                  <div className="col-span-5 text-left pl-2">Nombre</div>
                  <div className="col-span-2 text-right">Precio</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Items del carrito */}
                <div className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <ShoppingCartItemComponent
                      key={index}
                      index={index}
                      item={item}
                      removeItemFromCart={removeItemFromCart}
                    />
                  ))}
                </div>
              </div>

              {/* Total y botón finalizar */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Total:</h3>
                    <span className="text-xl font-bold text-purple-700">
                      ${totalPrice.toLocaleString("es-BO")}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleFinishPurchase}
                    disabled={isProcessing || items.length === 0}
                    className={`w-full py-3 rounded-lg text-white text-lg font-medium transition-colors ${
                      isProcessing || items.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      "Finalizar Compra"
                    )}
                  </button>
                </div>
              </div>

              {/* Volver a la tienda */}
              <div className="text-center">
                <Link
                  to="/sell"
                  className="inline-flex items-center justify-center text-purple-600 font-medium"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Volver a la tienda
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="mb-4">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-4">
                Parece que todavía no tienes items en el carrito de compras.
              </p>
              <Link
                to="/sell"
                className="inline-block px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Ir a la tienda
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Barra de navegación inferior fija */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
        <Link to="/" className="flex flex-col items-center p-2 text-gray-500">
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
          <span className="text-xs">Inicio</span>
        </Link>

        <Link
          to="/sell"
          className="flex flex-col items-center p-2 text-gray-500"
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
          <span className="text-xs">Tienda</span>
        </Link>

        <Link
          to="/shopping_cart"
          className="flex flex-col items-center p-2 text-purple-600"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7202C22.922 5 23.2205 5.90326 22.9036 7.03024L20.9036 15.0302C20.7455 15.5804 20.2279 16 19.7202 16H4.00488Z"></path>
            <path d="M6.00488 20C6.00488 21.1046 5.10945 22 4.00488 22C2.9003 22 2.00488 21.1046 2.00488 20C2.00488 18.8954 2.9003 18 4.00488 18C5.10945 18 6.00488 18.8954 6.00488 20Z"></path>
            <path d="M20 20C20 21.1046 19.1046 22 18 22C16.8954 22 16 21.1046 16 20C16 18.8954 16.8954 18 18 18C19.1046 18 20 18.8954 20 20Z"></path>
          </svg>
          <span className="text-xs">Carrito</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center p-2 text-gray-500"
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </div>
  );
};
