// components/LoadingScreen.jsx
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-6"></div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">NECSE</h1>
      <p className="text-gray-500 dark:text-gray-300">Carregant dades…</p>
    </div>
  );
}
