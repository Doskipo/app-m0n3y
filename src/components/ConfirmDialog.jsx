// src/components/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl w-[90%] max-w-sm">
        <p className="text-lg mb-4 text-center">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600"
          >
            Cancel·lar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            Esborrar
          </button>
        </div>
      </div>
    </div>
  );
}
