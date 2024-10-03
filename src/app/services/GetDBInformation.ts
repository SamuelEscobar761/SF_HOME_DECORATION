import { useState } from "react";

interface ImageColorByID {
  [id: number]: ImageColor[];
}

const imageColors: ImageColorByID = {
  1: [
    { color: "#FFE324", image: "https://t.ly/7nTCp" },
    { color: "#11F34A", image: "https://t.ly/7nTCp" },
    { color: "#33FE22", image: "https://t.ly/7nTCp" },
  ],
  2: [
    { color: "#FFE324", image: "https://t.ly/vsT0F" },
    { color: "#11F34A", image: "https://t.ly/vsT0F" },
    { color: "#33FE22", image: "https://t.ly/vsT0F" },
  ],
  3: [
    { color: "#FFE324", image: "https://t.ly/4Q6Tb" },
    { color: "#11F34A", image: "https://t.ly/4Q6Tb" },
    { color: "#33FE22", image: "https://t.ly/4Q6Tb" },
  ]
};

export const getImageColors = (id: number) => {
  return imageColors[id];
};

export const saveImageColors = (id: number, colorImages: ImageColor[]) => {
  imageColors[id] = colorImages;
  return true;
};
