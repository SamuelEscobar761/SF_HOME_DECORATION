import { useEffect, useState } from "react";
import SaveIcon from "../../assets/Save-Icon.svg";
import CloseIcon from "../../assets/Close-Icon.svg";
import Sketch from "@uiw/react-color-sketch";
import { GetColorsFromImage } from "../services/GetColorsFromImage";

export const ShowNewItemComponent = ({
  closeNewItem,
  saveNewItem,
}: {
  closeNewItem: () => void;
  saveNewItem: (item: any) => void;
}) => {
  const [colorEditView, setColorEditView] = useState<boolean>(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [tempColor, setTempColor] = useState<string>("");
  const [colorMapping, setColorMapping] = useState<{ [key: string]: string }>(
    {}
  );
  const [loadingColors, setLoadingColors] = useState<boolean>(false);
  const [colorsSuccess, setColorsSuccesss] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);
  const [name, setName] = useState<string>("");
  const [provider, setProvider] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [material, setMaterial] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [units, setUnits] = useState<string>("");

  const handleColorTouch = (name: string) => {
    if (!colorsSuccess) {
      alert(
        "Parece que hubo un error, los colores no cargaron correctamente, por favor modificalos de forma manual y verifica tu conexión a internet. Si el error persiste contacta con soporte."
      );
      setColorsSuccesss(true);
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

  const save = () => {
    saveNewItem({
      id: 22,
      name: name,
      provider: provider,
      price: price,
      image: URL.createObjectURL(images[0]),
      rotation: 0,
      utilitiesAvg: 0,
      locations: [{ id: 1, name: "almacen", units: units }],
    });
    closeNewItem();
  };

  // Manejar la carga de imágenes
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    //Start to load colors
    setLoadingColors(true);
    const files = event.target.files;
    if (files) {
      setImages([...images, ...Array.from(files)]);

      try {
        // Subir las imágenes al backend y obtener el mapeo de colores
        const result = await GetColorsFromImage(Array.from(files));
        setColorsSuccesss(true);
        setColorMapping(result);
      } catch (error) {
        console.error("Error al obtener colores:", error);
      }
    }
    setLoadingColors(false);
  };

  useEffect(() => {
    //Scroll to the first image
    const scrollableDiv = document.querySelector(".overflow-x-scroll");
    if (scrollableDiv) {
      scrollableDiv.scrollTo({ left: 0, behavior: "instant" });
    }
  }, [images]);

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
                onClick={() => !loadingColors && handleColorTouch(image.name)}
              >
                {loadingColors && <div className="loader"></div>}
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
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div id="new-item-provider">
          <input
            type="text"
            placeholder="Proveedor"
            className="w-full p-2 rounded"
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
            }}
          />
        </div>
        <div id="new-item-room">
          <input
            type="text"
            placeholder="Habitación"
            className="w-full p-2 rounded"
            value={room}
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
        </div>
        <div id="new-item-material">
          <input
            type="text"
            placeholder="Material"
            className="w-full p-2 rounded"
            value={material}
            onChange={(e) => {
              setMaterial(e.target.value);
            }}
          />
        </div>
        <div id="new-item-price-units" className="mb-2 flex space-x-2">
          <div id="new-item-price-container" className="flex space-x-1">
            <input
              id="new-item-price"
              type="number"
              placeholder="Precio"
              className="w-20 p-2 rounded"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
            <p className="p-2 bg-neutral-100 rounded">Bs</p>
          </div>
          <input
            id="new-item-units"
            type="number"
            placeholder="Unidades"
            className="w-full p-2 rounded"
            value={units}
            onChange={(e) => {
              setUnits(e.target.value);
            }}
          />
        </div>
        <div
          id="new-item-save-button"
          className="w-full flex justify-center bg-success p-2 rounded"
          onClick={save}
        >
          <img src={SaveIcon} />
          <p className="ml-1 text-2xl">Guardar</p>
        </div>
      </div>
    </div>
  );
};
