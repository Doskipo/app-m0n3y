import { useState, useEffect } from "react";

export default function InputModal({ open, title, placeholder, onClose, onSubmit }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80 max-w-full text-sm">
        <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 mb-4"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-sm"
          >
            Cancel·la
          </button>
          <button
            onClick={() => {
              if (value.trim()) onSubmit(value.trim());
            }}
            className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            Desa
          </button>
        </div>
      </div>
    </div>
  );
}
