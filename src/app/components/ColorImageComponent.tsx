import Sketch from "@uiw/react-color-sketch";
import { GetColorsFromImage } from "../services/GetColorsFromImage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const ColorImageComponent = ({
  colorImages,
  setColorImages,
}: {
  colorImages: { image: string; color: string }[];
  setColorImages: Dispatch<SetStateAction<{ image: string; color: string }[]>>;
}) => {
  const [colorEditView, setColorEditView] = useState<boolean>(false);
  const [editingImage, setEditingImage] = useState<number | null>(null);
  const [tempColor, setTempColor] = useState<string>("");
  const [loadingColors, setLoadingColors] = useState<boolean>(false);
  const [colorsSuccess, setColorsSuccesss] = useState<boolean>(true);
  let errorShow: unknown ;

  const handleColorTouch = (index: number, color: string) => {
    if (!colorsSuccess) {
      alert(
        "Parece que hubo un error, " + errorShow
      );
      setColorsSuccesss(true);
    }
    setEditingImage(index);
    setTempColor(color);
    setColorEditView(true);
  };

  const handleColorChange = (color: any) => {
    setTempColor(color.hex);
  };

  const saveColor = () => {
    
    if (editingImage != null) {
      colorImages[editingImage].color = tempColor;
    }
    setColorEditView(false);
  };

  const cancelEdit = () => {
    setTempColor("");
    setColorEditView(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoadingColors(true);
    setColorsSuccesss(false);
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newColorImages = fileArray.map((file) => ({
        image: URL.createObjectURL(file),
        color: "#FFFFFF", // Color predeterminado
      }));

      setColorImages([...colorImages, ...newColorImages]);

      try {
        const colorMap = await GetColorsFromImage(fileArray);
        // Asigna los colores desde el mapa a las nuevas imágenes
        const updatedImages = newColorImages.map((img, index) => ({
          ...img,
          color: colorMap[fileArray[index].name] || "#FFFFFF", // Asume que el nombre del archivo es la clave en colorMap
        }));

        // Actualiza el estado reemplazando las imágenes provisionales con las actualizadas
        setColorImages((prev) => [
          ...prev.slice(0, prev.length - fileArray.length), // Conserva todos los ítems excepto los últimos agregados provisionalmente
          ...updatedImages, // Agrega las nuevas imágenes actualizadas
        ]);
        setColorsSuccesss(true);
        setLoadingColors(false);
      } catch (error) {
        alert(error);
        console.error("Error al obtener colores:", error);
        setLoadingColors(false);
      }
    }
  };

  useEffect(() => {
    //Scroll to the first image
    const scrollableDiv = document.querySelector(".overflow-x-scroll");
    if (scrollableDiv) {
      scrollableDiv.scrollTo({ left: 0, behavior: "instant" });
    }
  }, [colorImages]);

  return (
    <div
      id="images-container"
      className="bg-neutral-400 h-fit rounded p-2 flex overflow-x-scroll snap-x snap-mandatory"
    >
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
      {colorImages.map((colorImage, index) => (
        <div
          className="w-full flex-shrink-0 snap-center mr-2 flex flex-col justify-between"
          key={index}
        >
          <img
            src={colorImage.image} // Previsualización de la imagen
            alt={`uploaded-${index}`}
            className="object-contain w-full h-80"
          />
          <div
            id="color-container"
            className="flex h-12 overflow-x-auto rounded bg-neutral-100 mt-2 justify-center items-center"
            style={{
              backgroundColor: loadingColors ? "#FFFFFF" : colorImage.color,
            }}
            onClick={() =>
              !loadingColors && handleColorTouch(index, colorImage.color)
            }
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
  );
};
