import { useState } from "react";
import SaveIcon from "../../assets/Save-Icon.svg";
import CloseIcon from "../../assets/Close-Icon.svg";
import Sketch from "@uiw/react-color-sketch";
import { GetColorsFromImage } from "../services/GetColorsFromImage";

export const ShowNewItemComponent = ({
  closeNewItem,
}: {
  closeNewItem: () => void;
}) => {
  const [colorEditView, setColorEditView] = useState<boolean>(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [tempColor, setTempColor] = useState<string>("");
  const [colorMapping, setColorMapping] = useState<{ [key: string]: string }>(
    {}
  );
  const [loadingColors, setLoadingColors] = useState<boolean>(false);
  const [colorsLoadedSuccessfully, setColorsLoadedSuccessfully] =
    useState<boolean>(false);
  useState<boolean>(false);

  const [images, setImages] = useState<File[]>([]); // Nuevo estado para las imágenes

  const handleColorTouch = (name: string) => {
    if(!colorsLoadedSuccessfully){
      alert("Parece que hubo un error, los colores no cargaron correctamente, por favor modificalos de forma manual y verifica tu conexión a internet. Si el error persiste contacta con soporte.")
    }
    setEditingImage(name);
    setTempColor(colorMapping[name]);
    setColorEditView(true);
  };

  const handleColorChange = (color: any) => {
    setTempColor(color.hex);
  };

  const saveColor = () => {
    colorMapping[editingImage!] = tempColor;
    setColorEditView(false);
  };

  const cancelEdit = () => {
    setTempColor("");
    setColorEditView(false);
  };

  const saveNewItem = () => {
    closeNewItem();
  };

  // Manejar la carga de imágenes
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoadingColors(true);
    const files = event.target.files;
    if (files) {
      setImages([...images, ...Array.from(files)]); // Almacena las imágenes seleccionadas
      try {
        // Subir las imágenes al backend y obtener el mapeo de colores
        const result = await GetColorsFromImage(Array.from(files));
        setColorsLoadedSuccessfully(true);
        setColorMapping(result);
      } catch (error) {
        console.error("Error al obtener colores:", error);
      }
    }
    setLoadingColors(false);
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
        className="bg-neutral-400 h-fit rounded mb-2 p-2 flex overflow-x-scroll snap-x snap-mandatory"
      >
        {images.length > 0 &&
          images.map((image, index) => (
            <div className="w-full flex-shrink-0 snap-center mr-2 flex flex-col justify-between">
              <img
                key={index}
                src={URL.createObjectURL(image)} // Previsualización de la imagen
                alt={`uploaded-${index}`}
                className="object-conatin w-full h-80"
              />
              <div
                id="color-container"
                className="flex h-12 overflow-x-auto rounded bg-neutral-100 mt-2 justify-center items-center"
                style={{
                  backgroundColor: loadingColors
                    ? "#FFFFFF"
                    : colorMapping[image.name] || "#FFFFFF",
                }}
                onClick={() =>
                  !loadingColors && handleColorTouch(image.name)
                }
              >
                {loadingColors && (
                  <div className="loader"></div>
                )}
              </div>
            </div>
          ))}
        <div
          className="min-h-80 h-auto w-full flex justify-center items-center rounded bg-neutral-100 flex-shrink-0 snap-center object-contain"
          onClick={() => document.getElementById("file-upload")?.click()} // Triggers the file input when clicked
        >
          <span className="text-7xl text-neutral-500">+</span>
        </div>
        <input
          type="file"
          id="file-upload"
          multiple
          style={{ display: "none" }} // Oculta el input para que solo aparezca el contenedor de imágenes
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
      <div
        id="new-item-component-content"
        className="bg-neutral-400 p-2 rounded text-lg space-y-2"
      >
        <div id="new-item-title">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-2 rounded"
          />
        </div>
        <div id="new-item-provider">
          <input
            type="text"
            placeholder="Proveedor"
            className="w-full p-2 rounded"
          />
        </div>
        <div id="new-item-room">
          <input
            type="text"
            placeholder="Habitación"
            className="w-full p-2 rounded"
          />
        </div>
        <div id="new-item-material">
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
