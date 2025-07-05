import { useState } from "react";
import useDarkMode from "../hooks/useDarkMode";

export default function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <div className="relative">
      {/* Botó engranatge */}
      <button
        onClick={() => setOpen(!open)}
        className="text-2xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Configuració"
      >
        ⚙️
      </button>

      {/* Panell de configuració */}
      {open && (
        <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 text-black dark:text-white shadow-md rounded p-4 z-10">
          <h3 className="font-bold mb-2">Ajustos</h3>
          <div className="space-y-2">
            <button
              onClick={() => setDarkMode(false)}
              className="block w-full text-left px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🌞 Mode clar
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className="block w-full text-left px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🌙 Mode fosc
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
