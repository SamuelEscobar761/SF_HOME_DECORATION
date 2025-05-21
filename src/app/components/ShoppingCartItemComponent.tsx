// Componente simple y estático para pantallas móviles
interface ShoppingCartItemProps {
  index: number;
  item: CartItem;
  removeItemFromCart: (index: number) => void;
}

export const ShoppingCartItemComponent = ({
  index,
  item,
  removeItemFromCart,
}: ShoppingCartItemProps) => {
  const unitPrice = item.price! - (item.rebajaUnidad || 0);
  const totalPrice = unitPrice * item.units - (item.rebajaTotal || 0);

  // Creamos un componente de color circular para visualizar el color
  const ColorCircle = ({ color }: { color: string }) => {
    // Convertir valores de color como #292929 a un color real
    const backgroundColor = color.startsWith("#") ? color : `#${color}`;
    return (
      <div
        className="w-4 h-4 rounded-full inline-block mr-1 border border-gray-200"
        style={{ backgroundColor }}
      />
    );
  };

  return (
    <div className="grid grid-cols-12 items-center py-3 px-2">
      {/* Imagen del producto */}
      <div className="col-span-2 flex justify-center">
        {item.image ? (
          <div className="relative">
            <img
              src={item.image}
              alt={item.name || "Producto"}
              className="h-14 w-14 object-cover rounded-lg shadow-sm"
            />
          </div>
        ) : (
          <div className="h-14 w-14 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {/* Unidades (simplemente muestra el número) */}
      <div className="col-span-2 flex justify-center items-center">
        <span className="font-medium text-sm text-gray-800">{item.units}</span>
      </div>

      {/* Nombre y detalles del producto */}
      <div className="col-span-5 pl-1 pr-1">
        <p className="font-medium text-sm text-gray-800 truncate">
          {item.name || "N/A"}
        </p>
        <div className="flex items-center mt-1">
          <ColorCircle color={item.color} />
          <span className="text-xs text-gray-500 truncate">{item.color}</span>
        </div>
      </div>

      {/* Precio */}
      <div className="col-span-2 text-right">
        <p className="font-bold text-purple-700">
          ${totalPrice.toLocaleString("es-BO")}
        </p>
      </div>

      {/* Botón eliminar */}
      <div className="col-span-1 flex justify-center">
        <button
          onClick={() => removeItemFromCart(index)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Eliminar producto"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
