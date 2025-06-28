import { imagePaths } from "@/lib/utils";
import { create } from "zustand";


function getRandomImage() {
  return imagePaths[Math.floor(Math.random() * imagePaths.length)];
}

interface ImageStore {
  image: string;
  randomizeImage: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  image: getRandomImage(),
  randomizeImage: () => set({ image: getRandomImage() }),
}));
