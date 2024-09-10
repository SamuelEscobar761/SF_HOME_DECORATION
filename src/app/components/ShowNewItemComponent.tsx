import { useState } from "react";
import SaveIcon from "../../assets/Save-Icon.svg";
import CloseIcon from "../../assets/Close-Icon.svg";
import Sketch from "@uiw/react-color-sketch";

export const ShowNewItemComponent = ({
  closeNewItem,
}: {
  closeNewItem: () => void;
}) => {
  const [colors, setColors] = useState<string[]>(["#0064FF"]);
  const [colorEditView, setColorEditView] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Índice del color que estamos editando
  const [tempColor, setTempColor] = useState<string>(""); // Color temporal mientras se edita o agrega un nuevo color

  const handleNewColor = () => {
    setTempColor("#FFFFFF");
    setColorEditView(true);
    setEditingIndex(null); // Asegurar que no se está editando un color existente
  };

  const handleColorTouch = (index: number) => {
    setEditingIndex(index); // Establecer el índice del color a editar
    setTempColor(colors[index]); // Establecer color temporal
    setColorEditView(true); // Mostrar el editor
  };

  const handleColorChange = (color: any) => {
    setTempColor(color.hex); // Actualizar el color temporalmente sin confirmarlo
  };

  const saveColor = () => {
    if (editingIndex !== null) {
      // Editar color existente
      const updatedColors = [...colors];
      updatedColors[editingIndex] = tempColor;
      setColors(updatedColors);
    } else {
      // Agregar nuevo color
      setColors([...colors, tempColor]);
    }
    setColorEditView(false); // Cerrar editor
  };

  const cancelEdit = () => {
    setTempColor(""); // Resetear el color temporal
    setColorEditView(false); // Cerrar el editor sin cambios
  };

  const saveNewItem = () => {
    closeNewItem();
  };

  return (
    <div id="show-new-item-component" className="bg-neutral-300 p-2 rounded">
      {colorEditView && (
        <div id="color-editor-container" className="absolute right-4">
          <div className="bg-neutral-100 p-4 rounded">
            <Sketch
              style={{ marginLeft: 20 }}
              color={tempColor}
              disableAlpha={false}
              onChange={handleColorChange}
            />
            <div className="mt-2 flex justify-around">
              <button
                className="bg-success text-white p-2 rounded"
                onClick={saveColor}
              >
                Guardar
              </button>
              <button
                className="bg-tertiary-dark text-white p-2 rounded"
                onClick={cancelEdit}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {!colorEditView && (
        <div
          id="close-full-item"
          className="fixed top-2 left-2 z-50 border border-neutral-600 rounded p-1"
          onClick={closeNewItem}
        >
          <img src={CloseIcon} className="w-5 h-5" />
        </div>
      )}
      <div
        id="images-container"
        className="bg-neutral-400 h-80 rounded mb-2"
      ></div>
      <div
        id="new-item-component-content"
        className="bg-neutral-400 p-2 rounded text-lg"
      >
        <div
          id="colors-container"
          className="flex overflow-x-auto mb-2 rounded bg-neutral-100 p-2"
        >
          <div
            className="h-14 w-14 flex justify-center items-center rounded-full bg-neutral-100 border border-neutral-900"
            onClick={handleNewColor}
          >
            <span className="text-2xl">+</span>
          </div>
          {colors.map((color, index) => (
            <div
              key={index}
              className="h-14 w-14 rounded-full border border-neutral-900 ml-3"
              style={{ backgroundColor: color }}
              onClick={() => handleColorTouch(index)} // Editar color al tocar
            ></div>
          ))}
        </div>
        <div id="new-item-title" className="mb-2">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 rounded"
          />
        </div>
        <div id="new-item-provider" className="mb-2">
          <input
            type="text"
            placeholder="Proveedor"
            className="w-full p-2 rounded"
          />
        </div>
        <div id="new-item-room" className="mb-2">
          <input
            type="text"
            placeholder="Habitación"
            className="w-full p-2 rounded"
          />
        </div>
        <div id="new-item-material" className="mb-2">
          <input
            type="text"
            placeholder="Material"
            className="w-full p-2 rounded"
          />
        </div>
        <div id="new-item-price" className="mb-2 flex">
          <input
            type="number"
            placeholder="Precio"
            className="w-20 p-2 rounded"
          />
          <p className="p-2 bg-neutral-100 rounded ml-1">Bs</p>
        </div>
        <div id="new-item-storage" className="mb-2 rounded">
          <select
            name=""
            id="new-item-storage-selector"
            className="p-2 rounded w-full"
          >
            <option value="">Seleccionar</option>
            <option value="Almacen">Almacen</option>
            <option value="Tienda">Tienda</option>
          </select>
        </div>
        <div
          id="new-item-save-button"
          className="w-full flex justify-center bg-success p-2 rounded"
          onClick={saveNewItem}
        >
          <img src={SaveIcon} />
          <p className="ml-1 text-2xl">Guardar</p>
        </div>
      </div>
    </div>
  );
};
