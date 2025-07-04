import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function App() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : [
      { name: "Menjar", subcategories: ["Supermercat", "Restaurant"] },
      { name: "Transport", subcategories: ["Metro", "Gasolina"] },
      { name: "Altres", subcategories: [] },
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [isEarning, setIsEarning] = useState(false);
  const [earnings, setEarnings] = useState(() => {
    const saved = localStorage.getItem("earnings");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("earnings", JSON.stringify(earnings));
  }, [earnings]);


  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: categories[0]?.name || "",
    subcategory: "",
  });

  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [selectedCatName, setSelectedCatName] = useState(categories[0]?.name || "");

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || (!isEarning && !form.category)) return;

    const newEntry = {
      ...form,
      id: Date.now(),
      date: new Date().toISOString(),
    };

    if (isEarning) {
      setEarnings((prev) => [newEntry, ...prev]);
    } else {
      setExpenses((prev) => [newEntry, ...prev]);
    }

    setForm({
      name: "",
      amount: "",
      category: form.category,
      subcategory: "",
    });
  };


  const handleDeleteExpense = (id) => {
    const confirmat = confirm("Segur que vols eliminar aquesta despesa?");
    if (!confirmat) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDeleteEarning = (id) => {
    const confirmat = confirm("Segur que vols eliminar aquest guany?");
    if (!confirmat) return;
    setEarnings((prev) => prev.filter((e) => e.id !== id));
  };


  const handleAddCategory = () => {
    const newCat = prompt("Introdueix el nom de la nova categoria:");
    if (!newCat || categories.some((c) => c.name === newCat)) {
      alert("Categoria no vàlida o ja existent.");
      return;
    }
    setCategories((prev) => [...prev, { name: newCat, subcategories: [] }]);
    setSelectedCatName(newCat);
  };

  const handleAddSubcategory = () => {
    const newSub = prompt(`Nova subcategoria per a "${selectedCatName}":`);
    if (!newSub) return;

    const updated = categories.map((cat) => {
      if (cat.name === selectedCatName && !cat.subcategories.includes(newSub)) {
        return {
          ...cat,
          subcategories: [...cat.subcategories, newSub],
        };
      }
      return cat;
    });

    setCategories(updated);
  };

  const handleDeleteSubcategory = (subToDelete) => {
    const confirmat = confirm(`Eliminar la subcategoria "${subToDelete}" de "${selectedCatName}"?`);
    if (!confirmat) return;

    const updated = categories.map((cat) => {
      if (cat.name === selectedCatName) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter((sub) => sub !== subToDelete),
        };
      }
      return cat;
    });

    setCategories(updated);
  };

  const subcategories = categories.find((c) => c.name === form.category)?.subcategories || [];
  const selectedCat = categories.find((c) => c.name === selectedCatName);

  return (
    <div className="max-w-md mx-auto p-4 pb-40 relative">
        <div className="flex justify-between items-center mb-4">
        <Link
            to="/resum"
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
        >
            📊 Aquest mes
        </Link>
        <h1 className="text-2xl font-bold text-center">NECSE</h1>
        <Link
            to="/recap"
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
        >
            📅 Recap
        </Link>
        </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsEarning(false)}
            className={`flex-1 py-1 rounded ${!isEarning ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setIsEarning(true)}
            className={`flex-1 py-1 rounded ${isEarning ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Guany
          </button>
        </div>
        <input
          type="text"
          name="name"
          placeholder="Concepte"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="amount"
          placeholder="Import (€)"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {!isEarning && (
          <select
            name="category"
            value={form.category}
            onChange={(e) => {
              handleChange(e);
              const cat = e.target.value;
              const firstSub = categories.find(c => c.name === cat)?.subcategories[0] || "";
              setForm(prev => ({ ...prev, subcategory: firstSub }));
            }}
            className="w-full p-2 border rounded"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        {!isEarning && subcategories.length > 0 && (
          <select
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {subcategories.map((sub, i) => (
              <option key={i} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}


        <button
          type="submit"
          className={`${isEarning ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white w-full py-2 rounded transition`}
        >
          {isEarning ? "Afegir guany" : "Afegir despesa"}
        </button>
      </form>

      {/* Llista de despeses */}
      <ul className="mt-6 space-y-2">
        {[...expenses.map(e => ({ ...e, type: "expense" })), ...earnings.map(e => ({ ...e, type: "earning" }))]
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // ordena per data descendent
          .map((e) => (
            <li
              key={e.id}
              className={`p-3 rounded flex justify-between items-center ${
                e.type === "expense" ? "bg-red-100" : "bg-green-100"
              }`}
            >
              <div>
                <p className="font-medium">{e.name}</p>
                {e.type === "expense" && (
                  <p className="text-sm text-gray-500">
                    {e.category} {e.subcategory && `→ ${e.subcategory}`}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(e.date).toLocaleDateString("ca-ES")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${
                    e.type === "expense" ? "text-red-800" : "text-green-800"
                  }`}
                >
                  {e.amount} €
                </span>
                <button
                  onClick={() =>
                    e.type === "expense"
                      ? handleDeleteExpense(e.id)
                      : handleDeleteEarning(e.id)
                  }
                  className="text-gray-700 hover:text-gray-900"
                  title="Eliminar"
                >
                  🅧
                </button>
              </div>
            </li>
          ))}
      </ul>




      {/* Botó flotant verd */}
      <button
        onClick={() => setShowCategoryEditor(!showCategoryEditor)}
        className="fixed bottom-6 right-6 bg-green-600 text-white w-12 h-12 rounded-full text-2xl shadow hover:bg-green-700"
        title="Gestionar categories"
      >
        +
      </button>

      {/* Editor de categories */}
      {showCategoryEditor && (
        <div className="fixed bottom-24 right-4 bg-white shadow-lg border rounded-lg p-4 w-72 z-10">
          <h2 className="text-lg font-bold mb-2">Gestió de categories</h2>

          <select
            value={selectedCatName}
            onChange={(e) => setSelectedCatName(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddCategory}
            className="w-full mb-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            ➕ Nova categoria
          </button>

          <button
            onClick={handleAddSubcategory}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 mb-2"
          >
            ➕ Nova subcategoria
          </button>

          <hr className="my-2" />

          <button
            onClick={() => {
              const confirmat = confirm(`Eliminar la categoria "${selectedCatName}"?`);
              if (!confirmat) return;
              const updated = categories.filter(cat => cat.name !== selectedCatName);
              setCategories(updated);
              if (updated.length > 0) {
                setSelectedCatName(updated[0].name);
              } else {
                setSelectedCatName("");
              }
            }}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            🗑️ Eliminar categoria
          </button>

          {selectedCat?.subcategories.length > 0 && (
            <>
              <select
                onChange={(e) => handleDeleteSubcategory(e.target.value)}
                defaultValue=""
                className="w-full mt-4 p-2 border rounded"
              >
                <option value="" disabled>Selecciona subcategoria per eliminar</option>
                {selectedCat.subcategories.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

    </div>
  );
}