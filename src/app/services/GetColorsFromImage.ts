const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event: any) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                // Crear un canvas para redimensionar la imagen
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                
                // Establecer el tamaño del canvas
                canvas.width = maxWidth;
                canvas.height = maxHeight;
                
                // Dibujar la imagen redimensionada en el canvas
                ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
                
                // Convertir el canvas a blob y luego a un archivo de imagen
                canvas.toBlob((blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, { type: file.type });
                        resolve(resizedFile);
                    } else {
                        reject(new Error('No se pudo redimensionar la imagen.'));
                    }
                }, file.type);
            };

            img.onerror = (error) => {
                reject(new Error('Error al cargar la imagen: ' + error));
            };
        };

        reader.onerror = (error) => {
            reject(new Error('Error al leer el archivo: ' + error));
        };

        // Leer el archivo de imagen original
        reader.readAsDataURL(file);
    });
};

export const GetColorsFromImage = async (files: File[]) => {
    const formData = new FormData();

    // Redimensionar todas las imágenes a 200x200 antes de enviarlas al backend
    const resizedFilesPromises = files.map((file) => resizeImage(file, 200, 200));

    try {
        const resizedFiles = await Promise.all(resizedFilesPromises);

        resizedFiles.forEach((file) => {
            formData.append('images', file);
        });

        // Envía la solicitud POST al backend
        const response = await fetch('http://127.0.0.1:8000/images/upload-images/', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error en la carga de imágenes');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al redimensionar o enviar imágenes:', error);
        throw error;
    }
};
