// src/hooks/useDarkMode.js
import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [enabled, setEnabled] = useState(() => {
    const theme = localStorage.getItem("theme");
    if (theme) return theme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [enabled]);

  return [enabled, setEnabled];
}

