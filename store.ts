import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = {
  isDarkMode: boolean;
  toggleMode: (mode: "dark" | "light") => void;
};
export const useTheme = create<Theme>()(
  persist(
    (set) => ({
      isDarkMode: true,
      toggleMode: (currentMode) =>
        set((state) => ({ isDarkMode: !currentMode })),
    }),
    { name: "theme" }
  )
);

type HighScore = {
  highScore: number;
  setHighScore: (score: number) => void;
};
export const useHighScore = create<HighScore>()(
  persist(
    (set) => ({
      highScore: 0,
      setHighScore: (score) => set((state) => ({ highScore: score })),
    }),
    { name: "highscore" }
  )
);
