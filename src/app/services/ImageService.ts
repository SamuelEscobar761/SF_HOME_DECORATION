type ResizeAndCompressImageCallback = (resizedImage: File) => void;

const resizeAndCompressImage = (file: File, callback: ResizeAndCompressImageCallback): void => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const imgElement = new Image();
    imgElement.src = event.target!.result as string;
    imgElement.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDimension = 360; // Max width or height
      const scaleSize = maxDimension / Math.max(imgElement.width, imgElement.height);
      canvas.width = imgElement.width * scaleSize;
      canvas.height = imgElement.height * scaleSize;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
        ctx.canvas.toBlob((blob) => {
          if (blob) {
            const resizedImage = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            callback(resizedImage);
          }
        }, 'image/jpeg');
      }
    };
  };
}

export { resizeAndCompressImage };
