import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllExpenses, getAllCategories } from "../firestoreHelpers";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../components/LoadingScreen";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MONTHS = [
  "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
];

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ffbb28", "#8dd1e1",
  "#a4de6c", "#d0ed57", "#ffc0cb", "#d88884", "#b0c4de"
];

export default function SummaryDetailPage() {
  const { user } = useAuth();
  const { year, month } = useParams();
  const today = new Date();
  const navigate = useNavigate();

  const selectedYear = year ? parseInt(year) : today.getFullYear();
  const selectedMonth = month ? parseInt(month) - 1 : today.getMonth();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCat, setOpenCat] = useState(null); // categoria desplegada

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const exp = await getAllExpenses(user.uid);
      const cats = await getAllCategories(user.uid);
      setExpenses(exp);
      setCategories(cats);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Tancar desplegables quan canviem de mes/any
  useEffect(() => { setOpenCat(null); }, [selectedYear, selectedMonth]);

  if (!user || loading) return <LoadingScreen />;

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    return (
      date.getFullYear() === selectedYear &&
      date.getMonth() === selectedMonth
    );
  });

  const total = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const totalPerCat = {};
  const totalPerSub = {};
  const itemsByCat = {};

  filteredExpenses.forEach((e) => {
    const cat = e.category || "(Sense categoria)";
    const sub = e.subcategory || "(Sense subcategoria)";
    const amt = parseFloat(e.amount || 0);

    totalPerCat[cat] = (totalPerCat[cat] || 0) + amt;
    const key = `${cat}|||${sub}`;
    totalPerSub[key] = (totalPerSub[key] || 0) + amt;

    if (!itemsByCat[cat]) itemsByCat[cat] = [];
    itemsByCat[cat].push(e);
  });

  const pieData = Object.entries(totalPerCat).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));

  // Format curt de data
  const fmtDate = (d) => {
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    return dt.toLocaleDateString("ca-ES", { day: "2-digit", month: "short" });
  };

  // Concepte robust
  const getConcept = (it) => {
    const fields = [
      "concept", "concepte", "concepto",
      "title", "name", "label",
      "merchant", "payee",
      "notes", "note", "description",
      "memo", "text"
    ];
    for (const f of fields) {
      const v = it?.[f];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "(Sense concepte)";
  };

  // Ordenar ítems: de més car a més barat
  const getSortedItemsForCat = (catName) => {
    const list = itemsByCat[catName] || [];
    return [...list].sort((a, b) => {
      const A = parseFloat(a.amount || 0);
      const B = parseFloat(b.amount || 0);
      return B - A; // si tens imports negatius, usa Math.abs(B) - Math.abs(A)
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="inline-block mb-4 bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
      >
        ← Enrere
      </button>

      <h1 className="text-2xl font-bold mb-2 text-center">📊 Resum de despeses</h1>
      <p className="text-center text-sm text-gray-500 mb-4">
        Resum de: <strong>{MONTHS[selectedMonth]} {selectedYear}</strong>
      </p>

      <div className="bg-blue-100 p-4 rounded mb-6 text-center">
        <p className="text-gray-700">Total gastat:</p>
        <p className="text-3xl font-extrabold text-blue-700">{total.toFixed(2)} €</p>
      </div>

      <div className="space-y-6 mb-8">
        {categories.map((cat, i) => {
          const catName = cat.name;
          const catTotal = totalPerCat[catName] || 0;
          const percentGlobal = total > 0 ? ((catTotal / total) * 100).toFixed(0) : "0";
          const isOpen = openCat === catName;

          return (
            <div key={i} className="bg-white shadow p-4 rounded-lg border">
              {/* Capçalera clicable de la categoria */}
              <button
                type="button"
                onClick={() => setOpenCat(isOpen ? null : catName)}
                className="w-full flex justify-between items-center mb-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    aria-hidden
                  >
                    ▸
                  </span>
                  <h2 className="font-bold text-lg text-gray-800 text-left">{catName}</h2>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-semibold text-base">{catTotal.toFixed(2)} €</p>
                  <p className="text-xs text-gray-500">{percentGlobal}%</p>
                </div>
              </button>

              {/* Subcategories (només si n'hi ha) */}
              {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 && (
                <div className="space-y-1 ml-2 text-sm">
                  {cat.subcategories.map((sub, j) => {
                    const key = `${catName}|||${sub}`;
                    const subTotal = totalPerSub[key] || 0;
                    const percentLocal = catTotal > 0 ? ((subTotal / catTotal) * 100).toFixed(0) : "0";
                    return (
                      <div key={j} className="flex justify-between items-center text-gray-600">
                        <span className="truncate">• {sub}</span>
                        <div className="text-right">
                          <p className="tabular-nums leading-none">{subTotal.toFixed(2)} €</p>
                          <p className="text-xs text-gray-400 leading-none">{percentLocal}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Panell d’items desplegable, amb límit d’alçada i scroll intern */}
              <div
                className={`transition-[grid-template-rows] duration-200 ease-out overflow-hidden mt-3 ${isOpen ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}`}
              >
                <div className="min-h-0">
                  <ul className="divide-y rounded-lg bg-gray-50 dark:bg-gray-900/30 max-h-56 overflow-y-auto">
                    {getSortedItemsForCat(catName).map((it, k) => {
                      const amount = parseFloat(it.amount || 0);
                      const concept = getConcept(it);
                      const rawSub = (it.subcategory ?? "").toString().trim();
                      const hasSub = rawSub.length > 0;

                      return (
                        <li key={k} className="flex items-start justify-between p-2">
                          <div className="pr-3">
                            <p className="font-medium leading-tight">{concept}</p>
                            <p className="text-xs text-gray-500">
                              {fmtDate(it.date)}{hasSub ? ` • ${rawSub}` : ""}
                            </p>
                          </div>
                          <div className="text-right tabular-nums font-semibold">
                            {amount.toFixed(2)} €
                          </div>
                        </li>
                      );
                    })}
                    {(!itemsByCat[catName] || itemsByCat[catName].length === 0) && (
                      <li className="p-3 text-sm text-gray-500 italic">No hi ha moviments en aquesta categoria.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pieData.length > 0 && (
        <div className="mb-12">
          <h2 className="text-center text-sm text-gray-500 mb-2">Distribució per categories</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number(value).toFixed(2)} €`} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
