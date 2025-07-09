import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection, getDocs, addDoc, deleteDoc, doc, setDoc
} from "firebase/firestore";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingScreen from "../components/LoadingScreen";
import useDarkMode from "../hooks/useDarkMode";
import AuthModal from "../components/AuthModal";
import useAuth from "../hooks/useAuth"; 
import InputModal from "../components/InputModal";


export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [isEarning, setIsEarning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();
  const [configOpen, setConfigOpen] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [inputModalConfig, setInputModalConfig] = useState({ title: "", placeholder: "", onSubmit: () => {} });


  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    subcategory: ""
  });

  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [selectedCatName, setSelectedCatName] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const askConfirm = (message, action) => {
    setConfirmMessage(message);
    setOnConfirm(() => action);
    setConfirmOpen(true);
  };

  const openInputModal = ({ title, placeholder, onSubmit }) => {
    setInputModalConfig({ title, placeholder, onSubmit });
    setInputModalOpen(true);
  };

  
  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      const catSnap = await getDocs(collection(db, `users/${user.uid}/categories`));
      const expSnap = await getDocs(collection(db, `users/${user.uid}/expenses`));
      const earnSnap = await getDocs(collection(db, `users/${user.uid}/earnings`));

      const catList = catSnap.docs.map(doc => doc.data());
      setCategories(catList);
      setSelectedCatName(catList[0]?.name || "");
      setForm(prev => ({ ...prev, category: catList[0]?.name || "" }));

      setExpenses(expSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setEarnings(earnSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || (!isEarning && !form.category)) return;

    const newEntry = { ...form, date: new Date().toISOString() };
    const coll = isEarning ? "earnings" : "expenses";
    const docRef = await addDoc(collection(db, `users/${user.uid}/${coll}`), newEntry);
    const withId = { ...newEntry, id: docRef.id };

    if (isEarning) setEarnings(prev => [withId, ...prev]);
    else setExpenses(prev => [withId, ...prev]);

    setForm({ name: "", amount: "", category: form.category, subcategory: "" });
  };

  const handleDelete = async (id, type) => {
    askConfirm("Segur que vols eliminar aquest registre?", async () => {
      await deleteDoc(doc(db, `users/${user.uid}/${type}`, id));
      if (type === "expenses") setExpenses(prev => prev.filter(e => e.id !== id));
      else setEarnings(prev => prev.filter(e => e.id !== id));
      setConfirmOpen(false);
    });
  };

  const handleDeleteSubcategory = async (subToDelete) => {
    askConfirm(`Eliminar subcategoria "${subToDelete}"?`, async () => {
      const updated = categories.map(cat => {
        if (cat.name === selectedCatName) {
          const updatedCat = {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub !== subToDelete)
          };
          setDoc(doc(db, `users/${user.uid}/categories`, cat.name), updatedCat);
          return updatedCat;
        }
        return cat;
      });
      setCategories(updated);
      setConfirmOpen(false);
    });
  };

  const handleAddCategory = () => {
    openInputModal({
      title: "Nova categoria",
      placeholder: "Nom de la nova categoria",
      onSubmit: async (newCat) => {
        if (categories.some(c => c.name === newCat)) {
          alert("Categoria ja existent.");
          return;
        }
        const updated = [...categories, { name: newCat, subcategories: [] }];
        setCategories(updated);
        setSelectedCatName(newCat);
        await setDoc(doc(db, `users/${user.uid}/categories`, newCat), {
          name: newCat,
          subcategories: [],
        });
        setInputModalOpen(false);
      }
    });
  };


  const handleAddSubcategory = () => {
    openInputModal({
      title: `Nova subcategoria per a "${selectedCatName}"`,
      placeholder: "Nom de la nova subcategoria",
      onSubmit: async (newSub) => {
        const updated = categories.map(cat => {
          if (cat.name === selectedCatName && !cat.subcategories.includes(newSub)) {
            const updatedCat = {
              ...cat,
              subcategories: [...cat.subcategories, newSub]
            };
            setDoc(doc(db, `users/${user.uid}/categories`, cat.name), updatedCat);
            return updatedCat;
          }
          return cat;
        });
        setCategories(updated);
        setInputModalOpen(false);
      }
    });
  };


  const handleDeleteCategory = () => {
    askConfirm(`Eliminar la categoria "${selectedCatName}"?`, async () => {
      const updated = categories.filter(cat => cat.name !== selectedCatName);
      setCategories(updated);
      setSelectedCatName(updated[0]?.name || "");
      await deleteDoc(doc(db, `users/${user.uid}/categories`, selectedCatName));
      setConfirmOpen(false);
    });
  };

  const selectedCat = categories.find(c => c.name === selectedCatName);
  const subcategories = categories.find(c => c.name === form.category)?.subcategories || [];

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-md mx-auto p-4 pb-40 relative bg-white text-black dark:bg-gray-900 dark:text-white transition-colors min-h-screen">
      <ConfirmDialog open={confirmOpen} message={confirmMessage} onConfirm={onConfirm} onCancel={() => setConfirmOpen(false)} />

      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Navegació"
          >
            📂
          </button>
          {navOpen && (
            <div className="absolute top-12 left-0 bg-white dark:bg-gray-800 text-black dark:text-white shadow-md rounded p-3 z-10">
              <Link to="/resum" className="block px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Aquest mes</Link>
              <Link to="/recap" className="block px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Recap</Link>
            </div>
          )}
        </div>


        <div className="relative">
        <button
          onClick={() => setConfigOpen(!configOpen)}
          className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Configuració"
        >
          ⚙️
        </button>
        {configOpen && (
          <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 text-black dark:text-white shadow-md rounded p-3 z-10 w-56 text-sm">
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              Usuari: {user?.isAnonymous ? "invitado" : user?.email}
            </p>
            <button
              onClick={() => {
                setConfigOpen(false);
                setAuthOpen(true);
              }}
              className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Iniciar sessió / Registrar-se
            </button>
          </div>
        )}
      </div>

      </div>

      {/* Formulari */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow p-4 rounded space-y-4 transition-colors">
        <div className="flex gap-2">
          <button type="button" onClick={() => setIsEarning(false)} className={`flex-1 py-1 rounded ${!isEarning ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Despesa</button>
          <button type="button" onClick={() => setIsEarning(true)} className={`flex-1 py-1 rounded ${isEarning ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Guany</button>
        </div>
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Concepte" className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700" />
        <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Import (€)" className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700" />

        {!isEarning && (
          <>
            <select name="category" value={form.category} onChange={(e) => {
              handleChange(e);
              const cat = e.target.value;
              const firstSub = categories.find(c => c.name === cat)?.subcategories[0] || "";
              setForm(prev => ({ ...prev, subcategory: firstSub }));
            }} className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
              {categories.map((cat, i) => <option key={i} value={cat.name}>{cat.name}</option>)}
            </select>

            {subcategories.length > 0 && (
              <select name="subcategory" value={form.subcategory} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                {subcategories.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
              </select>
            )}
          </>
        )}

        <button type="submit" className={`${isEarning ? 'bg-green-600' : 'bg-red-600'} text-white w-full py-2 rounded`}>
          {isEarning ? "Afegir guany" : "Afegir despesa"}
        </button>
      </form>

      {/* Llistat d’elements */}
      <ul className="mt-6 space-y-2">
        {[...expenses.map(e => ({ ...e, type: "expense" })), ...earnings.map(e => ({ ...e, type: "earning" }))]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(e => (
            <li key={e.id} className={`p-3 rounded flex justify-between items-center ${e.type === "expense" ? "bg-red-100 dark:bg-red-900" : "bg-green-100 dark:bg-green-900"}`}>
              <div>
                <p className="font-medium">{e.name}</p>
                {e.type === "expense" && <p className="text-sm text-gray-500 dark:text-gray-300">{e.category} {e.subcategory && `→ ${e.subcategory}`}</p>}
                <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString("ca-ES")}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${e.type === "expense" ? "text-red-800" : "text-green-800"}`}>{e.amount} €</span>
                <button onClick={() => handleDelete(e.id, e.type === "expense" ? "expenses" : "earnings")} className="text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-gray-300">🅧</button>
              </div>
            </li>
          ))}
      </ul>

      {/* Botó flotant per categories */}
      <button onClick={() => setShowCategoryEditor(!showCategoryEditor)} className="fixed bottom-6 right-6 bg-green-600 text-white w-12 h-12 rounded-full text-2xl shadow">+</button>

      {/* Panell de categories */}
      {showCategoryEditor && (
        <div className="fixed bottom-24 right-4 bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 rounded-lg p-4 w-72 z-10">
          <h2 className="text-lg font-bold mb-2">Gestió de categories</h2>

          <select value={selectedCatName} onChange={(e) => setSelectedCatName(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 mb-3">
            {categories.map((cat, i) => <option key={i} value={cat.name}>{cat.name}</option>)}
          </select>

          <button onClick={handleAddCategory} className="w-full mb-2 bg-indigo-600 text-white py-2 rounded">➕ Nova categoria</button>
          <button onClick={handleAddSubcategory} className="w-full bg-orange-500 text-white py-2 rounded mb-2">➕ Nova subcategoria</button>

          <hr className="my-2" />
          <button onClick={handleDeleteCategory} className="w-full bg-red-600 text-white py-2 rounded">🗑️ Eliminar categoria</button>

          {selectedCat?.subcategories.length > 0 && (
            <select onChange={(e) => handleDeleteSubcategory(e.target.value)} defaultValue="" className="w-full mt-4 p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
              <option value="" disabled>Selecciona subcategoria per eliminar</option>
              {selectedCat.subcategories.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
            </select>
          )}
        </div>
      )}
    <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    <InputModal
      open={inputModalOpen}
      title={inputModalConfig.title}
      placeholder={inputModalConfig.placeholder}
      onClose={() => setInputModalOpen(false)}
      onSubmit={inputModalConfig.onSubmit}
    />
    </div>
  );
}