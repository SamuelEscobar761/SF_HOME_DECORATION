import Sketch from "@uiw/react-color-sketch";
import { GetColorsFromImage } from "../services/GetColorsFromImage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { resizeAndCompressImage } from "../services/ImageService";

export const ColorImageComponent = ({
  colorImages,
  setColorImages,
}: {
  colorImages: ImageColor[];
  setColorImages: Dispatch<SetStateAction<ImageColor[]>>;
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingColors(true);
    setColorsSuccesss(false);
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const compressedFilesPromises = fileArray.map(file => new Promise<{ image: string, file: File }>((resolve) => {
        resizeAndCompressImage(file, (resizedImage) => {
          resolve({
            image: URL.createObjectURL(resizedImage),
            file: resizedImage
          });
        });
      }));
  
      Promise.all(compressedFilesPromises)
        .then(compressedFiles => {
          setColorImages(prev => [...prev, ...compressedFiles.map(file => ({ image: file.file, color: "#FFFFFF" }))]);
          return compressedFiles; // Continúa pasando los archivos comprimidos
        })
        .then(compressedFiles => {
          // Ahora obtenemos los colores y continuamos pasando los archivos comprimidos
          return GetColorsFromImage(compressedFiles.map(file => file.file)).then(colorMap => {
            return { colorMap, compressedFiles };
          });
        })
        .then(({ colorMap, compressedFiles }) => {
          setColorImages(prev => {
            //EL PROBLEMA EMPIEZA AQUI
            const updatedImages = prev.filter(img => !img.url).map((img, index) => ({
              ...img,
              color: colorMap[compressedFiles[index].file.name] || "#FFFFFF"
            }));
            return [...prev.filter(img => img.url), ...updatedImages];
          });
          setColorsSuccesss(true);
          setLoadingColors(false);
        })
        .catch(error => {
          console.error("Error al procesar imágenes:", error);
          setLoadingColors(false);
        });
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
            src={colorImage.image ? URL.createObjectURL(colorImage.image): colorImage.url!} // Previsualización de la imagen
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
