// components/LoadingScreen.jsx
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-6"></div>

      {/* Imatge diferent segons el mode */}
      <img
        src="\necse\Logo_Necse_WhiteTheme_1024x1024.png"
        alt="NECSE Logo"
        className="h-16 w-auto mb-2 block dark:hidden"
      />
      <img
        src="\necse\Logo_Necse_BlackTheme_1024x1024.png"
        alt="NECSE Logo"
        className="h-16 w-auto mb-2 hidden dark:block"
      />

      <p className="text-gray-500 dark:text-gray-300">Carregant dades…</p>
    </div>
  );
}
